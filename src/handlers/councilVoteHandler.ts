import { In } from "typeorm";
import { DaoCouncilVotedEvent } from "../types/events";
import { Account, CouncilProposal, CouncilVoteHistory } from "../model";
import { decodeAddress, getAccount } from "../utils";

import type { Ctx } from "../processor";
import type { EventInfo } from "../types";
import { BaseHandler } from "./baseHandler";

export class CouncilVoteHandler extends BaseHandler<CouncilVoteHistory> {
  private readonly _councilVotesToInsert: Map<string, CouncilVoteHistory>;
  private readonly _councilVotesToUpdate: Map<string, CouncilVoteHistory>;
  private readonly _councilVotesQueryMap: Map<string, CouncilVoteHistory>;
  private readonly _councilVoteIds: Set<string>;

  constructor(ctx: Ctx) {
    super(ctx);
    this._councilVotesToInsert = new Map<string, CouncilVoteHistory>();
    this._councilVotesToUpdate = new Map<string, CouncilVoteHistory>();
    this._councilVoteIds = new Set<string>();
    this._councilVotesQueryMap = new Map<string, CouncilVoteHistory>();
  }

  get councilVotesQueryMap() {
    return this._councilVotesQueryMap;
  }

  arrayToMap(councilVotes: CouncilVoteHistory[]) {
    for (const councilVote of councilVotes) {
      this._councilVotesQueryMap.set(councilVote.id, councilVote);
    }
  }

  insert() {
    return this._ctx.store.insert([...this._councilVotesToInsert.values()]);
  }

  save() {
    return this._ctx.store.save([...this._councilVotesToUpdate.values()]);
  }

  process(
    { event, blockHash, blockNum, timestamp }: EventInfo<DaoCouncilVotedEvent>,
    accounts: Map<string, Account>,
    councilProposalsToInsert: Map<string, CouncilProposal>,
    councilProposalsQueryMap: Map<string, CouncilProposal>
  ) {
    const { account, proposalIndex, voted, yes, no, daoId } = event.asV100;
    const accountAddress = decodeAddress(account);
    const proposalId = `${daoId}-${proposalIndex}`;
    const proposal =
      councilProposalsToInsert.get(proposalId) ??
      councilProposalsQueryMap.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal with id: ${proposalId} not found`);
    }
    const id = `${daoId}-${proposalIndex}-${accountAddress}`;

    const existingVote = this.councilVotesQueryMap.get(id);

    if (existingVote) {
      this._councilVotesToUpdate.set(
        id,
        new CouncilVoteHistory({ ...existingVote, approvedVote: voted })
      );
    } else {
      this._councilVotesToInsert.set(
        id,
        new CouncilVoteHistory({
          id,
          votedNo: no,
          votedYes: yes,
          approvedVote: voted,
          councillor: getAccount(accounts, accountAddress),
          proposal,
          blockHash,
          blockNum,
          createdAt: new Date(timestamp),
        })
      );
    }
  }

  query() {
    return this._ctx.store.findBy(CouncilVoteHistory, {
      id: In([...this._councilVoteIds]),
    });
  }

  prepareQuery(
    event: DaoCouncilVotedEvent,
    accountIds: Set<string>,
    councilProposalIds: Set<string>
  ) {
    if (!event.isV100) {
      throw new Error("Unsupported vote spec");
    }

    const { daoId, account, proposalIndex } = event.asV100;
    const accountAddress = decodeAddress(account);
    const proposalId = `${daoId}-${proposalIndex}`;
    const voteId = `${daoId}-${proposalIndex}-${accountAddress}`;

    accountIds.add(accountAddress);
    councilProposalIds.add(proposalId);
    this._councilVoteIds.add(voteId);
  }

  // ctx: Ctx;
  // voteEvents: EventInfo<DaoCouncilVotedEvent>[];
  //
  // constructor(ctx: Ctx, voteEvents: EventInfo<DaoCouncilVotedEvent>[]) {
  //   this.ctx = ctx;
  //   this.voteEvents = voteEvents;
  // }
  //
  // async handle(
  //   councilProposalsToInsert: Map<string, CouncilProposal>,
  //   accounts: Map<string, Account>
  // ) {
  //   const councilVotesToInsert = new Map<string, CouncilVoteHistory>();
  //   const councilVotesToUpdate = new Map<string, CouncilVoteHistory>();
  //   const [accountsQuery, councilProposalsQuery, votesQuery] =
  //     await this.getAccountsAndProposalsAndVotes(
  //       councilProposalsToInsert,
  //       accounts
  //     );
  //   accountsQuery.forEach((_accountQuery: Account) =>
  //     accounts.set(_accountQuery.id, _accountQuery)
  //   );
  //   const councilProposalsMap = new Map(
  //     councilProposalsQuery.map((_proposalQuery) => [
  //       _proposalQuery.id,
  //       _proposalQuery,
  //     ])
  //   );
  //   const votesMap = new Map(
  //     votesQuery.map((_voteQuery) => [_voteQuery.id, _voteQuery])
  //   );
  //
  //   for (const { event, timestamp, blockHash, blockNum } of this.voteEvents) {
  //     const { account, proposalIndex, voted, yes, no, daoId } = event.asV100;
  //     const accountAddress = decodeAddress(account);
  //     const proposalId = `${daoId}-${proposalIndex}`;
  //     const proposal =
  //       councilProposalsToInsert.get(proposalId) ??
  //       councilProposalsMap.get(proposalId);
  //     if (!proposal) {
  //       throw new Error(`Proposal with id: ${proposalId} not found`);
  //     }
  //     const id = `${daoId}-${proposalIndex}-${accountAddress}`;
  //
  //     const existingVote = votesMap.get(id);
  //
  //     if (existingVote) {
  //       councilVotesToUpdate.set(
  //         id,
  //         new CouncilVoteHistory({ ...existingVote, approvedVote: voted })
  //       );
  //     } else {
  //       councilVotesToInsert.set(
  //         id,
  //         new CouncilVoteHistory({
  //           id,
  //           votedNo: no,
  //           votedYes: yes,
  //           approvedVote: voted,
  //           councillor: getAccount(accounts, accountAddress),
  //           proposal,
  //           blockHash,
  //           blockNum,
  //           createdAt: new Date(timestamp),
  //         })
  //       );
  //     }
  //   }
  //   return { councilVotesToInsert, councilVotesToUpdate };
  // }
  //
  // private async getAccountsAndProposalsAndVotes(
  //   councilProposalsToInsert: Map<string, CouncilProposal>,
  //   accounts: Map<string, Account>
  // ) {
  //   const accountIds = new Set<string>();
  //   const proposalIds = new Set<string>();
  //   const voteIds = new Set<string>();
  //
  //   for (const { event } of this.voteEvents) {
  //     if (!event.isV100) {
  //       throw new Error("Unsupported vote spec");
  //     }
  //
  //     const { daoId, account, proposalIndex } = event.asV100;
  //     const accountAddress = decodeAddress(account);
  //     const proposalId = `${daoId}-${proposalIndex}`;
  //     const voteId = `${daoId}-${proposalIndex}-${accountAddress}`;
  //
  //     if (!accounts.get(accountAddress)) {
  //       accountIds.add(accountAddress);
  //     }
  //     if (!councilProposalsToInsert.get(proposalId)) {
  //       proposalIds.add(proposalId);
  //     }
  //     voteIds.add(voteId);
  //   }
  //   return Promise.all([
  //     this.ctx.store.findBy(Account, { id: In([...accountIds]) }),
  //     this.ctx.store.findBy(CouncilProposal, { id: In([...proposalIds]) }),
  //     this.ctx.store.findBy(CouncilVoteHistory, { id: In([...voteIds]) }),
  //   ]);
  // }
}
