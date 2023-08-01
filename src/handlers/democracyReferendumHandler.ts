import { FindOptionsWhere, In } from "typeorm";
import {
  DaoDemocracyCancelledEvent,
  DaoDemocracyDaoPurgedEvent,
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
import { buildProposalId } from "../utils/buildProposalId";

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
  private readonly _democracyReferendumDaoIds: Set<number>;

  constructor(ctx: Ctx) {
    super(ctx);
    this._democracyReferendumsToInsert = new Map<string, DemocracyReferendum>();
    this._democracyReferendumsToUpdate = new Map<string, DemocracyReferendum>();
    this._democracyReferendumsQueryMap = new Map<string, DemocracyReferendum>();
    this._democracyReferendumsIds = new Set<string>();
    this._democracyReferendumDaoIds = new Set<number>();
  }

  get democracyReferendumDaoIds() {
    return this._democracyReferendumDaoIds;
  }

  query() {
    const where: FindOptionsWhere<DemocracyReferendum>[] = [
      { id: In([...this._democracyReferendumsIds]) },
    ];
    if (this.democracyReferendumDaoIds.size > 0) {
      where.push({
        democracyProposal: {
          dao: { id: In([...this.democracyReferendumDaoIds]) },
        },
      });
    }

    return this._ctx.store.findBy(DemocracyReferendum, where);
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

    const democracyProposalId = buildProposalId(daoId, propIndex);

    const democracyProposal =
      democracyProposalsToInsert.get(democracyProposalId) ??
      democracyProposalsToUpdate.get(democracyProposalId) ??
      democracyProposalsQueryMap.get(democracyProposalId);

    if (!democracyProposal) {
      throw new Error(
        `Democracy proposal with id: ${democracyProposalId} not found`
      );
    }

    const democracyReferendumId = buildProposalId(daoId, refIndex);

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

    const id = buildProposalId(daoId, refIndex);

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

  processDaoPurged({ event }: EventInfo<DaoDemocracyDaoPurgedEvent>) {
    let daoId: number;
    if (event.isV104) {
      ({ daoId } = event.asV104);
    } else {
      throw new Error("Unsupported democracy dao purge spec");
    }

    this._democracyReferendumsQueryMap.forEach((referendum, id) => {
      const { index } = referendum;
      if (id !== buildProposalId(daoId, index)) {
        return;
      }

      referendum.removed = true;

      this._democracyReferendumsToUpdate.set(id, referendum);
    });
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

    const democracyProposalId = buildProposalId(daoId, propIndex);
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

  prepareDaoPurgeQuery(event: DaoDemocracyDaoPurgedEvent) {
    let daoId;
    if (event.isV104) {
      ({ daoId } = event.asV104);
    } else {
      throw new Error("Unsupported democracy dao purge spec");
    }

    this._democracyReferendumDaoIds.add(daoId);
  }
}
