import { In } from "typeorm";
import { DaoDemocracyProposedEvent } from "../types/events";
import {
  Account,
  Dao,
  DemocracyProposal,
  DemocracyProposalStatus,
} from "../model";
import { decodeAddress, getAccount } from "../utils";
import { getProposalKind } from "../utils/getProposalKind";

import type { Ctx } from "../processor";
import type { EventInfo } from "../types";

export class DemocracyProposalHandler {
  ctx: Ctx;
  democracyProposedEvents: EventInfo<DaoDemocracyProposedEvent>[];

  constructor(
    ctx: Ctx,
    democracyProposedEvents: EventInfo<DaoDemocracyProposedEvent>[]
  ) {
    this.ctx = ctx;
    this.democracyProposedEvents = democracyProposedEvents;
  }

  async handle(daosToInsert: Map<string, Dao>, accounts: Map<string, Account>) {
    const democracyProposals: Map<string, DemocracyProposal> = new Map();
    const [accountsQuery, daosQuery] = await this.getAccountsAndDaos(
      daosToInsert,
      accounts
    );
    accountsQuery.forEach((_accountsQuery) =>
      accounts.set(_accountsQuery.id, _accountsQuery)
    );
    const daosQueryMap = new Map(
      daosQuery.map((_daoQuery) => [_daoQuery.id, _daoQuery])
    );

    for (const { event, timestamp, blockHash, blockNum } of this
      .democracyProposedEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported proposal spec");
      }

      const { daoId, account, proposalIndex, proposal, deposit, meta } =
        event.asV100;

      const dao =
        daosToInsert.get(daoId.toString()) ??
        daosQueryMap.get(daoId.toString());

      if (!dao) {
        throw new Error(`Dao with id: ${daoId} not found`);
      }

      const kind = getProposalKind(proposal);
      const id = `${dao.id}-${proposalIndex}`;
      democracyProposals.set(
        id,
        new DemocracyProposal({
          id,
          index: proposalIndex.toString(),
          account: getAccount(accounts, decodeAddress(account)),
          dao,
          deposit,
          kind,
          meta: meta?.toString(),
          createdAt: new Date(timestamp),
          blockHash,
          blockNum,
          status: DemocracyProposalStatus.Open,
        })
      );
    }
    return democracyProposals;
  }

  private getAccountsAndDaos(
    daosToInsert: Map<string, Dao>,
    accounts: Map<string, Account>
  ) {
    const accountIds = new Set<string>();
    const daoIds = new Set<string>();

    for (const { event } of this.democracyProposedEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported proposal spec");
      }

      const { daoId, account } = event.asV100;
      const accountAddress = decodeAddress(account);

      if (!daosToInsert.get(daoId.toString())) {
        daoIds.add(daoId.toString());
      }
      if (!accounts.get(accountAddress)) {
        accountIds.add(accountAddress);
      }
    }
    return Promise.all([
      this.ctx.store.findBy(Account, { id: In([...accountIds]) }),
      this.ctx.store.findBy(Dao, { id: In([...daoIds]) }),
    ]);
  }
}
