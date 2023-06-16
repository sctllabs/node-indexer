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
    let account, proposalIndex, voted, yes, no, daoId;
    if (event.isV100) {
      ({ account, proposalIndex, voted, yes, no, daoId } = event.asV100);
    } else {
      throw new Error("Unsupported council vote spec");
    }

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
        new CouncilVoteHistory({
          ...existingVote,
          approvedVote: voted,
          votedNo: no,
          votedYes: yes,
          blockNum,
          blockHash,
          updatedAt: new Date(timestamp),
        })
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
          updatedAt: new Date(timestamp),
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
    let daoId, account, proposalIndex;
    if (event.isV100) {
      ({ daoId, account, proposalIndex } = event.asV100);
    } else {
      throw new Error("Unsupported council vote spec");
    }

    const accountAddress = decodeAddress(account);
    const proposalId = `${daoId}-${proposalIndex}`;
    const voteId = `${daoId}-${proposalIndex}-${accountAddress}`;

    accountIds.add(accountAddress);
    councilProposalIds.add(proposalId);
    this._councilVoteIds.add(voteId);
  }
}
