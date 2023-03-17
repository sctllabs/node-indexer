import { In } from "typeorm";
import {
  DaoDemocracyCancelledEvent,
  DaoDemocracyNotPassedEvent,
  DaoDemocracyPassedEvent,
  DaoDemocracyStartedEvent,
} from "../types/events";
import {
  DemocracyProposal,
  DemocracyReferendum,
  DemocracyReferendumStatus,
  DemocracyReferendumVoteThreshold,
} from "../model";
import { mapArrayById } from "../utils/mapArrayById";

import type { Ctx } from "../processor";
import type { EventInfo } from "../types";

type ReferendumEvents = {
  democracyStartedEvents: EventInfo<DaoDemocracyStartedEvent>[];
  democracyPassedEvents: EventInfo<DaoDemocracyPassedEvent>[];
  democracyNotPassedEvents: EventInfo<DaoDemocracyNotPassedEvent>[];
  democracyCancelledEvents: EventInfo<DaoDemocracyCancelledEvent>[];
};

type ReferendumEventsKind = keyof ReferendumEvents;

export class DemocracyReferendumHandler {
  ctx: Ctx;
  referendumEvents: ReferendumEvents;

  constructor(ctx: Ctx, referendumEvents: ReferendumEvents) {
    this.ctx = ctx;
    this.referendumEvents = referendumEvents;
  }

  async handle(
    democracyProposalsToInsert: Map<string, DemocracyProposal>,
    democracyProposalsToUpdate: Map<string, DemocracyProposal>
  ) {
    const democracyProposalsQuery = await this.getDemocracyProposals(
      democracyProposalsToInsert,
      democracyProposalsToUpdate
    );

    const democracyProposalsQueryMap = mapArrayById(democracyProposalsQuery);
    const democracyReferendumsToInsert = this.handleDemocracyStartedEvents(
      democracyProposalsToInsert,
      democracyProposalsToUpdate,
      democracyProposalsQueryMap
    );

    const democracyReferendumsQuery = await this.getDemocracyReferendums();
    const democracyReferendumsQueryMap = mapArrayById(
      democracyReferendumsQuery
    );
    const democracyReferendumsToUpdate = await this.handleDemocracyStatuses(
      democracyReferendumsToInsert,
      democracyReferendumsQueryMap
    );

    return { democracyReferendumsToInsert, democracyReferendumsToUpdate };
  }

  private async handleDemocracyStatuses(
    democracyReferendumsToInsert: Map<string, DemocracyReferendum>,
    democracyReferendumsQueryMap: Map<string, DemocracyReferendum>
  ) {
    const democracyReferendumsToUpdate = new Map<string, DemocracyReferendum>();

    Object.entries(this.referendumEvents).forEach(
      ([_proposalEventsKindType, _proposalEvents]) =>
        this.updateDemocracyReferendumStatuses(
          democracyReferendumsToInsert,
          democracyReferendumsQueryMap,
          _proposalEvents,
          democracyReferendumsToUpdate,
          _proposalEventsKindType as ReferendumEventsKind
        )
    );

    return democracyReferendumsToUpdate;
  }

  private updateDemocracyReferendumStatuses(
    democracyReferendumsToInsert: Map<string, DemocracyReferendum>,
    democracyReferendumsQueryMap: Map<string, DemocracyReferendum>,
    democracyReferendumEvents: EventInfo<
      | DaoDemocracyStartedEvent
      | DaoDemocracyPassedEvent
      | DaoDemocracyNotPassedEvent
      | DaoDemocracyCancelledEvent
    >[],
    democracyReferendumsToUpdate: Map<string, DemocracyReferendum>,
    kind: ReferendumEventsKind
  ) {
    for (const { event } of democracyReferendumEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported referendum event spec");
      }
      const { daoId, refIndex } = event.asV100;
      const id = `${daoId}-${refIndex}`;

      const democracyReferendum =
        democracyReferendumsToInsert.get(id) ??
        democracyReferendumsQueryMap.get(id);

      if (!democracyReferendum) {
        throw new Error(`Democracy referendum with id: ${id} not found`);
      }

      let status: DemocracyReferendumStatus;

      switch (kind) {
        case "democracyStartedEvents": {
          status = DemocracyReferendumStatus.Started;
          break;
        }
        case "democracyPassedEvents": {
          status = DemocracyReferendumStatus.Passed;
          break;
        }
        case "democracyNotPassedEvents": {
          status = DemocracyReferendumStatus.NotPassed;
          break;
        }
        case "democracyCancelledEvents": {
          status = DemocracyReferendumStatus.Cancelled;
          break;
        }
      }

      democracyReferendum.status = status;
      democracyReferendumsToUpdate.set(id, democracyReferendum);
    }
  }

  private async getDemocracyProposals(
    democracyProposalsToInsert: Map<string, DemocracyProposal>,
    democracyProposalsToUpdate: Map<string, DemocracyProposal>
  ) {
    const democracyProposalIds = new Set<string>();

    for (const { event } of this.referendumEvents.democracyStartedEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported referendum event spec");
      }

      const { daoId, propIndex } = event.asV100;

      const democracyProposalId = `${daoId}-${propIndex}`;

      if (!democracyProposalsToInsert.get(democracyProposalId)) {
        democracyProposalIds.add(democracyProposalId);
      }

      if (!democracyProposalsToUpdate.get(democracyProposalId)) {
        democracyProposalIds.add(democracyProposalId);
      }
    }

    return this.ctx.store.findBy(DemocracyProposal, {
      id: In([...democracyProposalIds]),
    });
  }

  private handleDemocracyStartedEvents(
    democracyProposalsToInsert: Map<string, DemocracyProposal>,
    democracyProposalsToUpdate: Map<string, DemocracyProposal>,
    democracyProposalsQueryMap: Map<string, DemocracyProposal>
  ) {
    const democracyReferendumsToInsert = new Map<string, DemocracyReferendum>();
    for (const { event } of this.referendumEvents.democracyStartedEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported referendum event spec");
      }

      const { daoId, refIndex, propIndex, threshold } = event.asV100;

      const democracyProposalId = `${daoId}-${propIndex}`;

      const democracyProposal =
        democracyProposalsToInsert.get(democracyProposalId) ??
        democracyProposalsToUpdate.get(democracyProposalId) ??
        democracyProposalsQueryMap.get(democracyProposalId);

      if (!democracyProposal) {
        throw new Error(
          `Democracy proposal with id: ${democracyProposalId} not found`
        );
      }

      const democracyReferendumId = `${daoId}-${refIndex}`;

      let voteThreshold: DemocracyReferendumVoteThreshold;

      switch (threshold.__kind) {
        case "SimpleMajority": {
          voteThreshold = DemocracyReferendumVoteThreshold.SimpleMajority;
          break;
        }
        case "SuperMajorityAgainst": {
          voteThreshold = DemocracyReferendumVoteThreshold.SuperMajorityAgainst;
          break;
        }
        case "SuperMajorityApprove": {
          voteThreshold = DemocracyReferendumVoteThreshold.SuperMajorityApprove;
          break;
        }
      }

      democracyReferendumsToInsert.set(
        democracyReferendumId,
        new DemocracyReferendum({
          id: democracyReferendumId,
          democracyProposal: democracyProposal,
          voteThreshold,
          status: DemocracyReferendumStatus.Started,
          index: refIndex,
        })
      );
    }

    return democracyReferendumsToInsert;
  }

  private async getDemocracyReferendums() {
    const democracyReferendumsPassedIds = this.getDemocracyReferendumIds(
      this.referendumEvents.democracyPassedEvents
    );
    const democracyReferendumsNotPassedIds = this.getDemocracyReferendumIds(
      this.referendumEvents.democracyNotPassedEvents
    );
    const democracyReferendumsCancelledIds = this.getDemocracyReferendumIds(
      this.referendumEvents.democracyCancelledEvents
    );

    return this.ctx.store.findBy(DemocracyReferendum, {
      id: In([
        ...democracyReferendumsPassedIds,
        ...democracyReferendumsNotPassedIds,
        ...democracyReferendumsCancelledIds,
      ]),
    });
  }

  private getDemocracyReferendumIds(
    democracyReferendumEvents: EventInfo<
      | DaoDemocracyPassedEvent
      | DaoDemocracyNotPassedEvent
      | DaoDemocracyCancelledEvent
    >[]
  ) {
    const democracyReferendumIds = new Set<string>();
    for (const { event } of democracyReferendumEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported referendum event spec");
      }
      const { daoId, refIndex } = event.asV100;
      const id = `${daoId}-${refIndex}`;
      democracyReferendumIds.add(id);
    }
    return democracyReferendumIds;
  }
}
