import { In } from "typeorm";
import { DaoCouncilVotedEvent } from "../types/events";
import { Account, CouncilProposal, CouncilVoteHistory } from "../model";
import { decodeAddress, getAccount } from "../utils";

import type { Ctx } from "../processor";
import type { EventInfo } from "../types";

export class VoteHandler {
  ctx: Ctx;
  voteEvents: EventInfo<DaoCouncilVotedEvent>[];

  constructor(ctx: Ctx, voteEvents: EventInfo<DaoCouncilVotedEvent>[]) {
    this.ctx = ctx;
    this.voteEvents = voteEvents;
  }

  async handle(
    councilProposalsToInsert: Map<string, CouncilProposal>,
    accounts: Map<string, Account>
  ) {
    const councilVotesToInsert: Map<string, CouncilVoteHistory> = new Map();
    const councilVotesToUpdate: Map<string, CouncilVoteHistory> = new Map();
    const [accountsQuery, councilProposalsQuery, votesQuery] =
      await this.getAccountsAndProposalsAndVotes(
        councilProposalsToInsert,
        accounts
      );
    accountsQuery.forEach((_accountQuery: Account) =>
      accounts.set(_accountQuery.id, _accountQuery)
    );
    const councilProposalsMap = new Map(
      councilProposalsQuery.map((_proposalQuery) => [
        _proposalQuery.id,
        _proposalQuery,
      ])
    );
    const votesMap = new Map(
      votesQuery.map((_voteQuery) => [_voteQuery.id, _voteQuery])
    );

    for (const { event, timestamp, blockHash, blockNum } of this.voteEvents) {
      const { account, proposalIndex, voted, yes, no, daoId } = event.asV100;
      const accountAddress = decodeAddress(account);
      const proposalId = `${daoId}-${proposalIndex}`;
      const proposal =
        councilProposalsToInsert.get(proposalId) ??
        councilProposalsMap.get(proposalId);
      if (!proposal) {
        throw new Error(`Proposal with id: ${proposalId} not found`);
      }
      const id = `${daoId}-${proposalIndex}-${accountAddress}`;

      const existingVote = votesMap.get(id);

      if (existingVote) {
        councilVotesToUpdate.set(
          id,
          new CouncilVoteHistory({ ...existingVote, approvedVote: voted })
        );
      } else {
        councilVotesToInsert.set(
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
    return { councilVotesToInsert, councilVotesToUpdate };
  }

  private async getAccountsAndProposalsAndVotes(
    councilProposalsToInsert: Map<string, CouncilProposal>,
    accounts: Map<string, Account>
  ) {
    const accountIds = new Set<string>();
    const proposalIds = new Set<string>();
    const voteIds = new Set<string>();

    for (const { event } of this.voteEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported vote spec");
      }

      const { daoId, account, proposalIndex } = event.asV100;
      const accountAddress = decodeAddress(account);
      const proposalId = `${daoId}-${proposalIndex}`;
      const voteId = `${daoId}-${proposalIndex}-${accountAddress}`;

      if (!accounts.get(accountAddress)) {
        accountIds.add(accountAddress);
      }
      if (!councilProposalsToInsert.get(proposalId)) {
        proposalIds.add(proposalId);
      }
      voteIds.add(voteId);
    }
    return Promise.all([
      this.ctx.store.findBy(Account, { id: In([...accountIds]) }),
      this.ctx.store.findBy(CouncilProposal, { id: In([...proposalIds]) }),
      this.ctx.store.findBy(CouncilVoteHistory, { id: In([...voteIds]) }),
    ]);
  }
}
