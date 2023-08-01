import { FindOptionsWhere, In } from "typeorm";
import { Account, DemocracyProposal, DemocracySecond } from "../model";
import {
  DaoDemocracyDaoPurgedEvent,
  DaoDemocracySecondedEvent,
} from "../types/events";
import { decodeAddress, getAccount } from "../utils";
import { BaseHandler } from "./baseHandler";

import type { Ctx } from "../processor";
import type { EventInfo } from "../types";
import { buildProposalId } from "../utils/buildProposalId";
import { buildVoteId } from "../utils/buildVoteId";

export class DemocracySecondHandler extends BaseHandler<DemocracySecond> {
  private readonly _democracySecondsToInsert: Map<string, DemocracySecond>;
  private readonly _democracySecondsToUpdate: Map<string, DemocracySecond>;
  private readonly _democracySecondsQueryMap: Map<string, DemocracySecond>;
  private readonly _democracySecondsIds: Set<string>;
  private readonly _democracySecondDaoIds: Set<number>;

  constructor(ctx: Ctx) {
    super(ctx);
    this._democracySecondsToInsert = new Map<string, DemocracySecond>();
    this._democracySecondsToUpdate = new Map<string, DemocracySecond>();
    this._democracySecondsQueryMap = new Map<string, DemocracySecond>();
    this._democracySecondsIds = new Set<string>();
    this._democracySecondDaoIds = new Set<number>();
  }

  get democracySecondDaoIds() {
    return this._democracySecondDaoIds;
  }

  arrayToMap(democracySeconds: DemocracySecond[]) {
    for (const democracySecond of democracySeconds) {
      this._democracySecondsQueryMap.set(democracySecond.id, democracySecond);
    }
  }

  query() {
    const where: FindOptionsWhere<DemocracySecond>[] = [
      { id: In([...this._democracySecondsIds]) },
    ];
    if (this.democracySecondDaoIds.size > 0) {
      where.push({
        proposal: { dao: { id: In([...this.democracySecondDaoIds]) } },
      });
    }

    return this._ctx.store.findBy(DemocracySecond, where);
  }

  save() {
    return this._ctx.store.save([...this._democracySecondsToUpdate.values()]);
  }

  insert() {
    return this._ctx.store.insert([...this._democracySecondsToInsert.values()]);
  }

  process(
    {
      event,
      blockHash,
      blockNum,
      timestamp,
    }: EventInfo<DaoDemocracySecondedEvent>,
    accounts: Map<string, Account>,
    democracyProposalsToInsert: Map<string, DemocracyProposal>,
    democracyProposalsQueryMap: Map<string, DemocracyProposal>
  ) {
    let daoId, propIndex, seconder;
    if (event.isV100) {
      ({ daoId, propIndex, seconder } = event.asV100);
    } else {
      throw new Error("Unsupported democracy second spec");
    }

    const accountAddress = decodeAddress(seconder);
    const democracyProposalId = buildProposalId(daoId, propIndex);
    const proposal =
      democracyProposalsToInsert.get(democracyProposalId) ??
      democracyProposalsQueryMap.get(democracyProposalId);

    if (!proposal) {
      throw new Error(
        `Democracy proposal with id: ${democracyProposalId} not found`
      );
    }

    const id = buildVoteId(daoId, propIndex, accountAddress);

    const account = getAccount(accounts, accountAddress);

    const existingSecond = this._democracySecondsQueryMap.get(id);

    if (existingSecond) {
      existingSecond.count += 1;
      existingSecond.updatedAt = new Date(timestamp);
      this._democracySecondsToUpdate.set(id, existingSecond);
    } else {
      this._democracySecondsToInsert.set(
        id,
        new DemocracySecond({
          id,
          proposal,
          seconder: account,
          count: 1,
          blockHash,
          blockNum,
          createdAt: new Date(timestamp),
          updatedAt: new Date(timestamp),
        })
      );
    }
  }

  processDaoPurged({ event }: EventInfo<DaoDemocracyDaoPurgedEvent>) {
    let daoId: number;
    if (event.isV104) {
      ({ daoId } = event.asV104);
    } else {
      throw new Error("Unsupported democracy dao purge spec");
    }

    this._democracySecondsQueryMap.forEach((second, id) => {
      if (!id.startsWith(daoId.toString())) {
        return;
      }

      second.removed = true;

      this._democracySecondsToUpdate.set(id, second);
    });
  }

  prepareQuery(
    event: DaoDemocracySecondedEvent,
    accountIds: Set<string>,
    democracyProposalIds: Set<string>
  ) {
    let daoId, seconder, propIndex;
    if (event.isV100) {
      ({ daoId, seconder, propIndex } = event.asV100);
    } else {
      throw new Error("Unsupported democracy second spec");
    }

    const accountAddress = decodeAddress(seconder);
    const democracyProposalId = buildProposalId(daoId, propIndex);
    const secondId = buildVoteId(daoId, propIndex, accountAddress);

    accountIds.add(accountAddress);
    democracyProposalIds.add(democracyProposalId);
    this._democracySecondsIds.add(secondId);
  }

  prepareDaoPurgeQuery(event: DaoDemocracyDaoPurgedEvent) {
    let daoId;
    if (event.isV104) {
      ({ daoId } = event.asV104);
    } else {
      throw new Error("Unsupported democracy dao purge spec");
    }

    this._democracySecondDaoIds.add(daoId);
  }
}
