import { In } from "typeorm";
import { Account, Dao, CouncilProposal, CouncilProposalStatus } from "../model";
import { DaoCouncilProposedEvent } from "../types/events";
import { decodeAddress, getAccount } from "../utils";
import { decodeHash } from "../utils/decodeHash";
import { getProposalKind } from "../utils/getProposalKind";

import type { EventInfo } from "../types";
import type { Ctx } from "../processor";

export class CouncilProposalHandler {
  ctx: Ctx;
  proposalEvents: EventInfo<DaoCouncilProposedEvent>[];

  constructor(ctx: Ctx, proposalEvents: EventInfo<DaoCouncilProposedEvent>[]) {
    this.ctx = ctx;
    this.proposalEvents = proposalEvents;
  }

  async handle(daosToInsert: Map<string, Dao>, accounts: Map<string, Account>) {
    const councilProposalsToInsert: Map<string, CouncilProposal> = new Map();
    const [accountsQuery, daosQuery] = await this.getAccountsAndDaos(
      daosToInsert,
      accounts
    );
    accountsQuery.forEach((_accountQuery) =>
      accounts.set(_accountQuery.id, _accountQuery)
    );
    const daosQueryMap = new Map(
      daosQuery.map((_daoQuery) => [_daoQuery.id, _daoQuery])
    );

    for (const { event, timestamp, blockHash, blockNum } of this
      .proposalEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported proposal spec");
      }

      const {
        proposal,
        proposalHash,
        proposalIndex,
        account,
        meta,
        threshold,
        daoId,
      } = event.asV100;

      const dao =
        daosToInsert.get(daoId.toString()) ??
        daosQueryMap.get(daoId.toString());

      if (!dao) {
        throw new Error(`Dao with id: ${daoId} not found`);
      }

      const kind = getProposalKind(proposal);
      const hash = decodeHash(proposalHash);
      const id = `${dao.id}-${proposalIndex}`;

      councilProposalsToInsert.set(
        id,
        new CouncilProposal({
          id,
          hash,
          index: proposalIndex.toString(),
          account: getAccount(accounts, decodeAddress(account)),
          meta: meta?.toString(),
          voteThreshold: threshold,
          kind,
          dao,
          blockHash,
          status: CouncilProposalStatus.Open,
          blockNum,
          createdAt: new Date(timestamp),
        })
      );
    }
    return councilProposalsToInsert;
  }

  private getAccountsAndDaos(
    daosToInsert: Map<string, Dao>,
    accounts: Map<string, Account>
  ) {
    const accountIds = new Set<string>();
    const daoIds = new Set<string>();

    for (const { event } of this.proposalEvents) {
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
