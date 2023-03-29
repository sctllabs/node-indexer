import { In } from "typeorm";
import {
  DaoEthGovernanceApprovedEvent,
  DaoEthGovernanceClosedEvent,
  DaoEthGovernanceDisapprovedEvent,
  DaoEthGovernanceExecutedEvent,
  DaoEthGovernanceProposedEvent,
} from "../types/events";
import { Account, Dao, EthGovernanceProposalStatus } from "../model";
import {
  decodeAddress,
  decodeHash,
  getAccount,
  getProposalKind,
} from "../utils";
import { BaseHandler } from "./baseHandler";
import type { EventInfo } from "../types";
import type { Ctx } from "../processor";
import { EthGovernanceProposal } from "../model/generated/ethGovernanceProposal.model";

type EthGovernanceProposalStatusEvents =
  | DaoEthGovernanceApprovedEvent
  | DaoEthGovernanceDisapprovedEvent
  | DaoEthGovernanceClosedEvent
  | DaoEthGovernanceExecutedEvent;

export class EthGovernanceProposalHandler extends BaseHandler<EthGovernanceProposal> {
  private readonly _ethGovernanceProposalsToInsert: Map<
    string,
    EthGovernanceProposal
  >;
  private readonly _ethGovernanceProposalsToUpdate: Map<
    string,
    EthGovernanceProposal
  >;
  private readonly _ethGovernanceProposalsQueryMap: Map<
    string,
    EthGovernanceProposal
  >;
  private readonly _ethGovernanceProposalIds: Set<string>;

  constructor(ctx: Ctx) {
    super(ctx);
    this._ethGovernanceProposalsToInsert = new Map<
      string,
      EthGovernanceProposal
    >();
    this._ethGovernanceProposalsToUpdate = new Map<
      string,
      EthGovernanceProposal
    >();
    this._ethGovernanceProposalsQueryMap = new Map<
      string,
      EthGovernanceProposal
    >();
    this._ethGovernanceProposalIds = new Set<string>();
  }

  get ethGovernanceProposalsToInsert() {
    return this._ethGovernanceProposalsToInsert;
  }

  get ethGovernanceProposalsQueryMap() {
    return this._ethGovernanceProposalsQueryMap;
  }

  get ethGovernanceProposalIds() {
    return this._ethGovernanceProposalIds;
  }

  arrayToMap(ethGovernanceProposals: EthGovernanceProposal[]) {
    for (const ethGovernanceProposal of ethGovernanceProposals) {
      this._ethGovernanceProposalsQueryMap.set(
        ethGovernanceProposal.id,
        ethGovernanceProposal
      );
    }
  }

  query() {
    return this._ctx.store.findBy(EthGovernanceProposal, {
      id: In([...this._ethGovernanceProposalIds]),
    });
  }

  insert() {
    return this._ctx.store.insert([
      ...this._ethGovernanceProposalsToInsert.values(),
    ]);
  }

  save() {
    return this._ctx.store.save([
      ...this._ethGovernanceProposalsToUpdate.values(),
    ]);
  }

  processProposed(
    {
      event,
      blockNum,
      blockHash,
      timestamp,
    }: EventInfo<DaoEthGovernanceProposedEvent>,
    accounts: Map<string, Account>,
    daosToInsert: Map<string, Dao>,
    daosQueryMap: Map<string, Dao>
  ) {
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
      daosToInsert.get(daoId.toString()) ?? daosQueryMap.get(daoId.toString());

    if (!dao) {
      throw new Error(`Dao with id: ${daoId} not found`);
    }

    const kind = getProposalKind(proposal);
    const hash = decodeHash(proposalHash);
    const id = `${dao.id}-${proposalIndex}`;

    this._ethGovernanceProposalsToInsert.set(
      id,
      new EthGovernanceProposal({
        id,
        hash,
        index: proposalIndex,
        account: getAccount(accounts, decodeAddress(account)),
        meta: meta?.toString(),
        voteThreshold: threshold,
        kind,
        dao,
        blockHash,
        status: EthGovernanceProposalStatus.Open,
        blockNum,
        createdAt: new Date(timestamp),
        updatedAt: new Date(timestamp),
      })
    );
  }

  processStatus({
    event,
    timestamp,
  }: EventInfo<EthGovernanceProposalStatusEvents>) {
    const { daoId, proposalIndex } = event.asV100;
    const proposalId = `${daoId}-${proposalIndex}`;
    const proposal =
      this._ethGovernanceProposalsToInsert.get(proposalId) ??
      this._ethGovernanceProposalsQueryMap.get(proposalId);

    if (!proposal) {
      throw new Error(`Proposal with id: ${proposalId} not found.`);
    }

    if (event instanceof DaoEthGovernanceApprovedEvent) {
      proposal.status = EthGovernanceProposalStatus.Approved;
    } else if (event instanceof DaoEthGovernanceDisapprovedEvent) {
      proposal.status = EthGovernanceProposalStatus.Disapproved;
    } else if (event instanceof DaoEthGovernanceClosedEvent) {
      proposal.status = EthGovernanceProposalStatus.Closed;
    } else {
      proposal.status = EthGovernanceProposalStatus.Executed;
    }

    proposal.updatedAt = new Date(timestamp);
    this._ethGovernanceProposalsToUpdate.set(proposal.id, proposal);
  }

  prepareProposedQuery(
    event: DaoEthGovernanceProposedEvent,
    daoIds: Set<string>,
    accountIds: Set<string>
  ) {
    if (!event.isV100) {
      throw new Error("Unsupported proposal spec");
    }

    const { daoId, account } = event.asV100;
    const accountAddress = decodeAddress(account);
    daoIds.add(daoId.toString());
    accountIds.add(accountAddress);
  }

  prepareStatusQuery(
    event: EthGovernanceProposalStatusEvents,
    proposalIds: Set<string>
  ) {
    if (!event.isV100) {
      throw new Error("Unsupported status spec");
    }

    const { daoId, proposalIndex } = event.asV100;
    const proposalId = `${daoId}-${proposalIndex}`;
    proposalIds.add(proposalId);
  }
}
