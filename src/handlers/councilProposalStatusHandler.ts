import { In } from "typeorm";
import { Dao, CouncilProposal, CouncilProposalStatus } from "../model";
import {
  DaoCouncilApprovedEvent,
  DaoCouncilClosedEvent,
  DaoCouncilDisapprovedEvent,
  DaoCouncilExecutedEvent,
} from "../types/events";
import { getAccount } from "../utils";

import type { Ctx } from "../processor";
import type { EventInfo } from "../types";

type CouncilProposalEvents = {
  approvedCouncilProposalEvents: EventInfo<DaoCouncilApprovedEvent>[];
  disapprovedCouncilProposalEvents: EventInfo<DaoCouncilDisapprovedEvent>[];
  closedCouncilProposalEvents: EventInfo<DaoCouncilClosedEvent>[];
  executedCouncilProposalEvents: EventInfo<DaoCouncilExecutedEvent>[];
};

type ProposalEventsKind = keyof CouncilProposalEvents;

export class CouncilProposalStatusHandler {
  ctx: Ctx;
  councilProposalEvents: CouncilProposalEvents;

  constructor(ctx: Ctx, councilProposalEvents: CouncilProposalEvents) {
    this.ctx = ctx;
    this.councilProposalEvents = councilProposalEvents;
  }

  async handle(councilProposalsToInsert: Map<string, CouncilProposal>) {
    const councilProposalsToUpdate = new Map<string, CouncilProposal>();

    const proposalsQuery = await this.getProposals(councilProposalsToInsert);
    const proposalsQueryMap = new Map(
      proposalsQuery.map((_proposalQuery) => [
        _proposalQuery.id,
        _proposalQuery,
      ])
    );
    Object.entries(this.councilProposalEvents).forEach(
      ([_proposalEventsKindType, _proposalEventsKind]) =>
        this.updateProposalStatuses(
          councilProposalsToUpdate,
          councilProposalsToInsert,
          proposalsQueryMap,
          _proposalEventsKind,
          _proposalEventsKindType as ProposalEventsKind
        )
    );

    return { councilProposalsToUpdate };
  }

  private getDaos(
    daosToInsert: Map<string, Dao>,
    councilProposalsToInsert: Map<string, CouncilProposal>,
    councilProposalsToUpdate: Map<string, CouncilProposal>
  ) {
    const daoIds = new Set<string>();
    this.councilProposalEvents.executedCouncilProposalEvents.forEach(
      (_executedEvent) => {
        const { daoId, proposalIndex } = _executedEvent.event.asV100;

        if (daosToInsert.get(daoId.toString())) {
          return;
        }

        const proposalId = `${daoId}-${proposalIndex}`;

        const proposal =
          councilProposalsToInsert.get(proposalId) ??
          councilProposalsToUpdate.get(proposalId);

        if (!proposal) {
          throw new Error(`Proposal with id: ${proposalId} not found.`);
        }

        daoIds.add(daoId.toString());
      }
    );

    return this.ctx.store.findBy(Dao, {
      id: In([...daoIds]),
    });
  }

  private getProposals(councilProposalsToInsert: Map<string, CouncilProposal>) {
    const proposalIds = new Set<string>();
    Object.values(this.councilProposalEvents).map((_proposalEventsKind) =>
      this.getProposalIds(
        councilProposalsToInsert,
        _proposalEventsKind,
        proposalIds
      )
    );

    return this.ctx.store.findBy(CouncilProposal, {
      id: In([...proposalIds]),
    });
  }

  private getProposalIds(
    councilProposalsToInsert: Map<string, CouncilProposal>,
    proposalEvents: EventInfo<
      | DaoCouncilApprovedEvent
      | DaoCouncilDisapprovedEvent
      | DaoCouncilClosedEvent
      | DaoCouncilExecutedEvent
    >[],
    proposalIds: Set<string>
  ) {
    for (const { event } of proposalEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported status spec");
      }

      const { daoId, proposalIndex } = event.asV100;
      const proposalId = `${daoId}-${proposalIndex}`;
      if (!councilProposalsToInsert.get(proposalId)) {
        proposalIds.add(proposalId);
      }
    }
  }

  private updateProposalStatuses(
    proposalsToUpdate: Map<string, CouncilProposal>,
    proposals: Map<string, CouncilProposal>,
    proposalsQueryMap: Map<string, CouncilProposal>,
    proposalEvents: EventInfo<
      | DaoCouncilApprovedEvent
      | DaoCouncilDisapprovedEvent
      | DaoCouncilClosedEvent
      | DaoCouncilExecutedEvent
    >[],
    kind: ProposalEventsKind
  ) {
    for (const { event } of proposalEvents) {
      const { daoId, proposalIndex } = event.asV100;
      const proposalId = `${daoId}-${proposalIndex}`;
      const proposal =
        proposals.get(proposalId) ?? proposalsQueryMap.get(proposalId);

      if (!proposal) {
        throw new Error(`Proposal with id: ${proposalId} not found.`);
      }

      let status: CouncilProposalStatus;
      switch (kind) {
        case "approvedCouncilProposalEvents": {
          status = CouncilProposalStatus.Approved;
          break;
        }
        case "disapprovedCouncilProposalEvents": {
          status = CouncilProposalStatus.Disapproved;
          break;
        }
        case "closedCouncilProposalEvents": {
          status = CouncilProposalStatus.Closed;
          break;
        }
        case "executedCouncilProposalEvents": {
          status = CouncilProposalStatus.Executed;
          break;
        }
      }
      proposal.status = status;
      proposalsToUpdate.set(proposal.id, proposal);
    }
  }
}
