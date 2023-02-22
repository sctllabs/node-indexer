import { In } from "typeorm";
import type { Ctx } from "../processor";
import type { EventInfo } from "../processorHandler";
import { DaoCouncilVotedEvent } from "../types/events";
import { Account, CouncilProposal, CouncilVoteHistory } from "../model";
import { decodeAddress, getAccount } from "../utils";

export async function voteHandler(
  ctx: Ctx,
  voteEvents: EventInfo<DaoCouncilVotedEvent>[],
  proposals: Map<string, CouncilProposal>,
  accounts: Map<string, Account>
) {
  const votes: Map<string, CouncilVoteHistory> = new Map();
  const votesToUpdate: Map<string, CouncilVoteHistory> = new Map();
  const [accountsQuery, proposalsQuery, votesQuery] =
    await getAccountsAndProposalsAndVotes(ctx, voteEvents, proposals, accounts);
  accountsQuery.forEach((_accountQuery: Account) =>
    accounts.set(_accountQuery.id, _accountQuery)
  );
  const proposalsMap = new Map(
    proposalsQuery.map((_proposalQuery) => [_proposalQuery.id, _proposalQuery])
  );
  const votesMap = new Map(
    votesQuery.map((_voteQuery) => [_voteQuery.id, _voteQuery])
  );

  for (const { event, timestamp, blockHash, blockNum } of voteEvents) {
    const { account, proposalIndex, voted, yes, no, daoId } = event.asV100;
    const accountAddress = decodeAddress(account);
    const proposalId = `${daoId}-${proposalIndex}`;
    const proposal = proposals.get(proposalId) ?? proposalsMap.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal with id: ${proposalId} not found`);
    }
    const id = `${daoId}-${proposalIndex}-${accountAddress}`;

    const existingVote = votesMap.get(id);

    if (existingVote) {
      votesToUpdate.set(
        id,
        new CouncilVoteHistory({ ...existingVote, approvedVote: voted })
      );
    } else {
      votes.set(
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
  return { votes, votesToUpdate };
}

async function getAccountsAndProposalsAndVotes(
  ctx: Ctx,
  voteEvents: EventInfo<DaoCouncilVotedEvent>[],
  proposals: Map<string, CouncilProposal>,
  accounts: Map<string, Account>
) {
  const accountIds = new Set<string>();
  const proposalIds = new Set<string>();
  const voteIds = new Set<string>();

  for (const { event } of voteEvents) {
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
    if (!proposals.get(proposalId)) {
      proposalIds.add(proposalId);
    }
    voteIds.add(voteId);
  }
  return Promise.all([
    ctx.store.findBy(Account, { id: In([...accountIds]) }),
    ctx.store.findBy(CouncilProposal, { id: In([...proposalIds]) }),
    ctx.store.findBy(CouncilVoteHistory, { id: In([...voteIds]) }),
  ]);
}
