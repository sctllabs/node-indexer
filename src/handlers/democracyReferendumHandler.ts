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

import type { Ctx } from "../processor";
import type { EventInfo } from "../types";
import { BaseHandler } from "./baseHandler";

type ReferendumStatusEvent =
  | DaoDemocracyPassedEvent
  | DaoDemocracyNotPassedEvent
  | DaoDemocracyCancelledEvent;

export class DemocracyReferendumHandler extends BaseHandler<DemocracyReferendum> {
  private readonly _democracyReferendumsToInsert: Map<
    string,
    DemocracyReferendum
  >;
  private readonly _democracyReferendumsToUpdate: Map<
    string,
    DemocracyReferendum
  >;
  private readonly _democracyReferendumsQueryMap: Map<
    string,
    DemocracyReferendum
  >;
  private readonly _democracyReferendumsIds: Set<string>;

  constructor(ctx: Ctx) {
    super(ctx);
    this._democracyReferendumsToInsert = new Map<string, DemocracyReferendum>();
    this._democracyReferendumsToUpdate = new Map<string, DemocracyReferendum>();
    this._democracyReferendumsQueryMap = new Map<string, DemocracyReferendum>();
    this._democracyReferendumsIds = new Set<string>();
  }

  insert() {
    return this._ctx.store.insert([
      ...this._democracyReferendumsToInsert.values(),
    ]);
  }

  save() {
    return this._ctx.store.save([
      ...this._democracyReferendumsToUpdate.values(),
    ]);
  }

  query() {
    return this._ctx.store.findBy(DemocracyReferendum, {
      id: In([...this._democracyReferendumsIds]),
    });
  }

  arrayToMap(democracyReferendums: DemocracyReferendum[]) {
    for (const democracyReferendum of democracyReferendums) {
      this._democracyReferendumsQueryMap.set(
        democracyReferendum.id,
        democracyReferendum
      );
    }
  }

  processStarted(
    {
      event,
      blockNum,
      blockHash,
      timestamp,
    }: EventInfo<DaoDemocracyStartedEvent>,
    democracyProposalsToInsert: Map<string, DemocracyProposal>,
    democracyProposalsToUpdate: Map<string, DemocracyProposal>,
    democracyProposalsQueryMap: Map<string, DemocracyProposal>
  ) {
    let daoId, refIndex, propIndex, threshold;
    if (event.isV100) {
      ({ daoId, refIndex, propIndex, threshold } = event.asV100);
    } else {
      throw new Error("Unsupported referendum event spec");
    }

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

    this._democracyReferendumsToInsert.set(
      democracyReferendumId,
      new DemocracyReferendum({
        id: democracyReferendumId,
        democracyProposal: democracyProposal,
        voteThreshold,
        status: DemocracyReferendumStatus.Started,
        index: refIndex,
        blockHash,
        blockNum,
        createdAt: new Date(timestamp),
        updatedAt: new Date(timestamp),
      })
    );
  }

  processStatus({ event, timestamp }: EventInfo<ReferendumStatusEvent>) {
    let daoId, refIndex;
    if (event.isV100) {
      ({ daoId, refIndex } = event.asV100);
    } else {
      throw new Error("Unsupported referendum status spec");
    }

    const id = `${daoId}-${refIndex}`;

    const democracyReferendum =
      this._democracyReferendumsToInsert.get(id) ??
      this._democracyReferendumsQueryMap.get(id);

    if (!democracyReferendum) {
      throw new Error(`Democracy referendum with id: ${id} not found`);
    }

    if (event instanceof DaoDemocracyPassedEvent) {
      democracyReferendum.status = DemocracyReferendumStatus.Passed;
    } else if (event instanceof DaoDemocracyNotPassedEvent) {
      democracyReferendum.status = DemocracyReferendumStatus.NotPassed;
    } else {
      democracyReferendum.status = DemocracyReferendumStatus.Cancelled;
    }

    democracyReferendum.updatedAt = new Date(timestamp);
    this._democracyReferendumsToUpdate.set(id, democracyReferendum);
  }

  prepareStartedQuery(
    event: DaoDemocracyStartedEvent,
    democracyProposalIds: Set<string>
  ) {
    let daoId, propIndex;
    if (event.isV100) {
      ({ daoId, propIndex } = event.asV100);
    } else {
      throw new Error("Unsupported referendum event spec");
    }

    const democracyProposalId = `${daoId}-${propIndex}`;
    democracyProposalIds.add(democracyProposalId);
  }

  prepareStatusQuery(event: ReferendumStatusEvent) {
    let daoId, refIndex;
    if (event.isV100) {
      ({ daoId, refIndex } = event.asV100);
    } else {
      throw new Error("Unsupported referendum event spec");
    }

    const id = `${daoId}-${refIndex}`;
    this._democracyReferendumsIds.add(id);
  }
}
