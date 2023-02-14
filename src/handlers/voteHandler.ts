import { In } from "typeorm";
import { Ctx, EventInfo } from "../processor";
import { DaoCouncilVotedEvent } from "../types/events";
import { Account, Proposal, VoteHistory } from "../model";
import { decodeAddress, getAccount } from "../utils";

export async function voteHandler(
  ctx: Ctx,
  voteEvents: EventInfo<DaoCouncilVotedEvent>[],
  proposals: Map<string, Proposal>,
  accounts: Map<string, Account>
) {
  const votes: Map<string, VoteHistory> = new Map();
  const [accountsQuery, proposalsQuery] = await getAccountsAndProposals(
    ctx,
    voteEvents,
    proposals,
    accounts
  );
  accountsQuery.forEach((_accountQuery: Account) =>
    accounts.set(_accountQuery.id, _accountQuery)
  );
  const proposalsMap = new Map(
    proposalsQuery.map((_proposalQuery) => [_proposalQuery.id, _proposalQuery])
  );

  for (const { event, timestamp, blockHash, blockNum } of voteEvents) {
    const { account, proposalHash, voted, yes, no, daoId } = event.asV100;
    const accountAddress = decodeAddress(account);
    const hash = Buffer.from(proposalHash).toString("hex");
    const proposalId = `${daoId}-${hash}`;
    const proposal = proposals.get(proposalId) ?? proposalsMap.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal with id: ${proposalId} not found`);
    }
    const id = `${daoId}-${hash}-${accountAddress}`;
    votes.set(
      id,
      new VoteHistory({
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
  return votes;
}

async function getAccountsAndProposals(
  ctx: Ctx,
  voteEvents: EventInfo<DaoCouncilVotedEvent>[],
  proposals: Map<string, Proposal>,
  accounts: Map<string, Account>
) {
  const accountIds = new Set<string>();
  const proposalIds = new Set<string>();

  for (const { event } of voteEvents) {
    if (!event.isV100) {
      throw new Error("Unsupported vote spec");
    }

    const { daoId, account, proposalHash: encodedProposalHash } = event.asV100;
    const accountAddress = decodeAddress(account);
    const hash = Buffer.from(encodedProposalHash).toString("hex");
    const proposalId = `${daoId}-${hash}`;

    if (!accounts.get(accountAddress)) {
      accountIds.add(accountAddress);
    }
    if (!proposals.get(proposalId)) {
      proposalIds.add(proposalId);
    }
  }
  return Promise.all([
    ctx.store.findBy(Account, { id: In([...accountIds]) }),
    ctx.store.findBy(Proposal, { id: In([proposalIds]) }),
  ]);
}
