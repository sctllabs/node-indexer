import { In } from "typeorm";
import { DaoEthGovernanceVotedEvent } from "../types/events";
import {
  Account,
  EthGovernanceProposal,
  EthGovernanceVoteHistory,
} from "../model";
import { decodeAddress, getAccount } from "../utils";

import type { Ctx } from "../processor";
import type { EventInfo } from "../types";
import { BaseHandler } from "./baseHandler";

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
  }

  get ethGovernanceVotesQueryMap() {
    return this._ethGovernanceVotesQueryMap;
  }

  arrayToMap(ethGovernanceVotes: EthGovernanceVoteHistory[]) {
    for (const ethGovernanceVote of ethGovernanceVotes) {
      this._ethGovernanceVotesQueryMap.set(
        ethGovernanceVote.id,
        ethGovernanceVote
      );
    }
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
    const { account, proposalIndex, daoId, vote, proposalHash } = event.asV100;
    const accountAddress = decodeAddress(account);
    const proposalId = `${daoId}-${proposalIndex}`;
    const proposal =
      ethGovernanceProposalsToInsert.get(proposalId) ??
      ethGovernanceProposalsQueryMap.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal with id: ${proposalId} not found`);
    }
    const id = `${daoId}-${proposalIndex}-${accountAddress}`;

    const existingVote = this.ethGovernanceVotesQueryMap.get(id);

    const { aye, balance } = vote;

    if (existingVote) {
      this._ethGovernanceVotesToUpdate.set(
        id,
        new EthGovernanceVoteHistory({
          ...existingVote,
          aye,
          balance,
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

  query() {
    return this._ctx.store.findBy(EthGovernanceVoteHistory, {
      id: In([...this._ethGovernanceVoteIds]),
    });
  }

  prepareQuery(
    event: DaoEthGovernanceVotedEvent,
    accountIds: Set<string>,
    ethGovernanceProposalIds: Set<string>
  ) {
    if (!event.isV100) {
      throw new Error("Unsupported vote spec");
    }

    const { daoId, account, proposalIndex } = event.asV100;
    const accountAddress = decodeAddress(account);
    const proposalId = `${daoId}-${proposalIndex}`;
    const voteId = `${daoId}-${proposalIndex}-${accountAddress}`;

    accountIds.add(accountAddress);
    ethGovernanceProposalIds.add(proposalId);
    this._ethGovernanceVoteIds.add(voteId);
  }
}
