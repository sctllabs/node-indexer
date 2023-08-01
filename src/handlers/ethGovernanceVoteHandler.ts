import { FindOptionsWhere, In } from "typeorm";
import {
  DaoEthGovernanceDaoPurgedEvent,
  DaoEthGovernanceVotedEvent,
} from "../types/events";
import {
  Account,
  EthGovernanceProposal,
  EthGovernanceVoteHistory,
} from "../model";
import { decodeAddress, getAccount } from "../utils";

import type { Ctx } from "../processor";
import type { EventInfo } from "../types";
import { BaseHandler } from "./baseHandler";
import { buildProposalId } from "../utils/buildProposalId";
import { buildVoteId } from "../utils/buildVoteId";

export class EthGovernanceVoteHandler extends BaseHandler<EthGovernanceVoteHistory> {
  private readonly _ethGovernanceVotesToInsert: Map<
    string,
    EthGovernanceVoteHistory
  >;
  private readonly _ethGovernanceVotesToUpdate: Map<
    string,
    EthGovernanceVoteHistory
  >;
  private readonly _ethGovernanceVotesQueryMap: Map<
    string,
    EthGovernanceVoteHistory
  >;
  private readonly _ethGovernanceVoteIds: Set<string>;
  private readonly _ethGovernanceVoteDaoIds: Set<number>;

  constructor(ctx: Ctx) {
    super(ctx);
    this._ethGovernanceVotesToInsert = new Map<
      string,
      EthGovernanceVoteHistory
    >();
    this._ethGovernanceVotesToUpdate = new Map<
      string,
      EthGovernanceVoteHistory
    >();
    this._ethGovernanceVoteIds = new Set<string>();
    this._ethGovernanceVotesQueryMap = new Map<
      string,
      EthGovernanceVoteHistory
    >();
    this._ethGovernanceVoteDaoIds = new Set<number>();
  }

  get ethGovernanceVotesQueryMap() {
    return this._ethGovernanceVotesQueryMap;
  }

  get ethGovernanceVoteDaoIds() {
    return this._ethGovernanceVoteDaoIds;
  }

  arrayToMap(ethGovernanceVotes: EthGovernanceVoteHistory[]) {
    for (const ethGovernanceVote of ethGovernanceVotes) {
      this._ethGovernanceVotesQueryMap.set(
        ethGovernanceVote.id,
        ethGovernanceVote
      );
    }
  }

  query() {
    const where: FindOptionsWhere<EthGovernanceVoteHistory>[] = [
      { id: In([...this._ethGovernanceVoteIds]) },
    ];
    if (this.ethGovernanceVoteDaoIds.size > 0) {
      where.push({
        proposal: { dao: { id: In([...this.ethGovernanceVoteDaoIds]) } },
      });
    }

    return this._ctx.store.findBy(EthGovernanceVoteHistory, {
      id: In([...this._ethGovernanceVoteIds]),
    });
  }

  insert() {
    return this._ctx.store.insert([
      ...this._ethGovernanceVotesToInsert.values(),
    ]);
  }

  save() {
    return this._ctx.store.save([...this._ethGovernanceVotesToUpdate.values()]);
  }

  process(
    {
      event,
      blockHash,
      blockNum,
      timestamp,
    }: EventInfo<DaoEthGovernanceVotedEvent>,
    accounts: Map<string, Account>,
    ethGovernanceProposalsToInsert: Map<string, EthGovernanceProposal>,
    ethGovernanceProposalsQueryMap: Map<string, EthGovernanceProposal>
  ) {
    let account, proposalIndex, daoId, vote, proposalHash;
    if (event.isV100) {
      ({ account, proposalIndex, daoId, vote, proposalHash } = event.asV100);
    } else {
      throw new Error("Unsupported eth governance vote spec");
    }

    const accountAddress = decodeAddress(account);
    const proposalId = buildProposalId(daoId, proposalIndex);
    const proposal =
      ethGovernanceProposalsToInsert.get(proposalId) ??
      ethGovernanceProposalsQueryMap.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal with id: ${proposalId} not found`);
    }
    const id = buildVoteId(daoId, proposalIndex, accountAddress);

    const existingVote = this.ethGovernanceVotesQueryMap.get(id);

    const { aye, balance } = vote;

    if (existingVote) {
      this._ethGovernanceVotesToUpdate.set(
        id,
        new EthGovernanceVoteHistory({
          ...existingVote,
          aye,
          balance,
          blockNum,
          blockHash,
          updatedAt: new Date(timestamp),
        })
      );
    } else {
      this._ethGovernanceVotesToInsert.set(
        id,
        new EthGovernanceVoteHistory({
          id,
          account: getAccount(accounts, accountAddress),
          proposal,
          aye,
          balance,
          blockHash,
          blockNum,
          createdAt: new Date(timestamp),
          updatedAt: new Date(timestamp),
        })
      );
    }
  }

  processDaoPurged({ event }: EventInfo<DaoEthGovernanceDaoPurgedEvent>) {
    let daoId: number;
    if (event.isV104) {
      ({ daoId } = event.asV104);
    } else {
      throw new Error("Unsupported eth governance dao purge spec");
    }

    this._ethGovernanceVotesQueryMap.forEach((vote, id) => {
      if (!id.startsWith(daoId.toString())) {
        return;
      }

      vote.removed = true;

      this._ethGovernanceVotesToUpdate.set(id, vote);
    });
  }

  prepareQuery(
    event: DaoEthGovernanceVotedEvent,
    accountIds: Set<string>,
    ethGovernanceProposalIds: Set<string>
  ) {
    let daoId, account, proposalIndex;
    if (event.isV100) {
      ({ daoId, account, proposalIndex } = event.asV100);
    } else {
      throw new Error("Unsupported eth governance vote spec");
    }

    const accountAddress = decodeAddress(account);
    const proposalId = buildProposalId(daoId, proposalIndex);
    const voteId = buildVoteId(daoId, proposalIndex, accountAddress);

    accountIds.add(accountAddress);
    ethGovernanceProposalIds.add(proposalId);
    this._ethGovernanceVoteIds.add(voteId);
  }

  prepareDaoPurgeQuery(event: DaoEthGovernanceDaoPurgedEvent) {
    let daoId;
    if (event.isV104) {
      ({ daoId } = event.asV104);
    } else {
      throw new Error("Unsupported eth governance dao purge spec");
    }

    this._ethGovernanceVoteDaoIds.add(daoId);
  }
}
