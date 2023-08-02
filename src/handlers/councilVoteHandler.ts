import { FindOptionsWhere, In } from "typeorm";
import {
  DaoCouncilDaoPurgedEvent,
  DaoCouncilVotedEvent,
} from "../types/events";
import { Account, CouncilProposal, CouncilVoteHistory } from "../model";
import { decodeAddress, getAccount } from "../utils";

import type { Ctx } from "../processor";
import type { EventInfo } from "../types";
import { BaseHandler } from "./baseHandler";
import { buildProposalId } from "../utils/buildProposalId";
import { buildVoteId } from "../utils/buildVoteId";

export class CouncilVoteHandler extends BaseHandler<CouncilVoteHistory> {
  private readonly _councilVotesToInsert: Map<string, CouncilVoteHistory>;
  private readonly _councilVotesToUpdate: Map<string, CouncilVoteHistory>;
  private readonly _councilVotesQueryMap: Map<string, CouncilVoteHistory>;
  private readonly _councilVoteIds: Set<string>;
  private readonly _councilVoteDaoIds: Set<number>;

  constructor(ctx: Ctx) {
    super(ctx);
    this._councilVotesToInsert = new Map<string, CouncilVoteHistory>();
    this._councilVotesToUpdate = new Map<string, CouncilVoteHistory>();
    this._councilVoteIds = new Set<string>();
    this._councilVotesQueryMap = new Map<string, CouncilVoteHistory>();
    this._councilVoteDaoIds = new Set<number>();
  }

  get councilVotesQueryMap() {
    return this._councilVotesQueryMap;
  }

  get councilVoteDaoIds() {
    return this._councilVoteDaoIds;
  }

  arrayToMap(councilVotes: CouncilVoteHistory[]) {
    for (const councilVote of councilVotes) {
      this._councilVotesQueryMap.set(councilVote.id, councilVote);
    }
  }

  query() {
    const where: FindOptionsWhere<CouncilVoteHistory>[] = [
      { id: In([...this._councilVoteIds]) },
    ];
    if (this.councilVoteDaoIds.size > 0) {
      where.push({
        proposal: { dao: { id: In([...this.councilVoteDaoIds]) } },
      });
    }

    return this._ctx.store.findBy(CouncilVoteHistory, where);
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
    const proposalId = buildProposalId(daoId, proposalIndex);
    const proposal =
      councilProposalsToInsert.get(proposalId) ??
      councilProposalsQueryMap.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal with id: ${proposalId} not found`);
    }
    const id = buildVoteId(daoId, proposalIndex, accountAddress);

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

  processDaoPurged({ event }: EventInfo<DaoCouncilDaoPurgedEvent>) {
    let daoId: number;
    if (event.isV104) {
      ({ daoId } = event.asV104);
    } else {
      throw new Error("Unsupported council dao purge spec");
    }

    this._councilVotesQueryMap.forEach((vote, id) => {
      if (!id.startsWith(daoId.toString())) {
        return;
      }

      vote.removed = true;

      this._councilVotesToUpdate.set(id, vote);
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
    const proposalId = buildProposalId(daoId, proposalIndex);
    const voteId = buildVoteId(daoId, proposalIndex, accountAddress);

    accountIds.add(accountAddress);
    councilProposalIds.add(proposalId);
    this._councilVoteIds.add(voteId);
  }

  prepareDaoPurgeQuery(event: DaoCouncilDaoPurgedEvent) {
    let daoId;
    if (event.isV104) {
      ({ daoId } = event.asV104);
    } else {
      throw new Error("Unsupported council dao purge spec");
    }

    this._councilVoteDaoIds.add(daoId);
  }
}
