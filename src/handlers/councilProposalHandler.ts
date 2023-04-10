import { In } from "typeorm";
import {
  DaoCouncilApprovedEvent,
  DaoCouncilClosedEvent,
  DaoCouncilDisapprovedEvent,
  DaoCouncilExecutedEvent,
  DaoCouncilProposedEvent,
} from "../types/events";
import { Account, CouncilProposal, CouncilProposalStatus, Dao } from "../model";
import {
  decodeAddress,
  decodeHash,
  getAccount,
  getProposalKind,
} from "../utils";
import { BaseHandler } from "./baseHandler";
import type { EventInfo } from "../types";
import type { Ctx } from "../processor";

type CouncilProposalStatusEvents =
  | DaoCouncilApprovedEvent
  | DaoCouncilDisapprovedEvent
  | DaoCouncilClosedEvent
  | DaoCouncilExecutedEvent;

export class CouncilProposalHandler extends BaseHandler<CouncilProposal> {
  private readonly _councilProposalsToInsert: Map<string, CouncilProposal>;
  private readonly _councilProposalsToUpdate: Map<string, CouncilProposal>;
  private readonly _councilProposalsQueryMap: Map<string, CouncilProposal>;
  private readonly _councilProposalIds: Set<string>;

  constructor(ctx: Ctx) {
    super(ctx);
    this._councilProposalsToInsert = new Map<string, CouncilProposal>();
    this._councilProposalsToUpdate = new Map<string, CouncilProposal>();
    this._councilProposalsQueryMap = new Map<string, CouncilProposal>();
    this._councilProposalIds = new Set<string>();
  }

  get councilProposalsToInsert() {
    return this._councilProposalsToInsert;
  }

  get councilProposalsQueryMap() {
    return this._councilProposalsQueryMap;
  }

  get councilProposalIds() {
    return this._councilProposalIds;
  }

  arrayToMap(councilProposals: CouncilProposal[]) {
    for (const councilProposal of councilProposals) {
      this._councilProposalsQueryMap.set(councilProposal.id, councilProposal);
    }
  }

  query() {
    return this._ctx.store.findBy(CouncilProposal, {
      id: In([...this._councilProposalIds]),
    });
  }

  insert() {
    return this._ctx.store.insert([...this._councilProposalsToInsert.values()]);
  }

  save() {
    return this._ctx.store.save([...this._councilProposalsToUpdate.values()]);
  }

  processProposed(
    {
      event,
      blockNum,
      blockHash,
      timestamp,
    }: EventInfo<DaoCouncilProposedEvent>,
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

    this._councilProposalsToInsert.set(
      id,
      new CouncilProposal({
        id,
        hash,
        index: proposalIndex,
        account: getAccount(accounts, decodeAddress(account)),
        meta: meta?.toString(),
        voteThreshold: threshold,
        kind,
        dao,
        blockHash,
        blockNum,
        status: CouncilProposalStatus.Open,
        createdAt: new Date(timestamp),
        updatedAt: new Date(timestamp),
      })
    );
  }

  processStatus({ event, timestamp }: EventInfo<CouncilProposalStatusEvents>) {
    const { daoId, proposalIndex } = event.asV100;
    const proposalId = `${daoId}-${proposalIndex}`;
    const proposal =
      this._councilProposalsToInsert.get(proposalId) ??
      this._councilProposalsQueryMap.get(proposalId);

    if (!proposal) {
      throw new Error(`Proposal with id: ${proposalId} not found.`);
    }

    if (event instanceof DaoCouncilApprovedEvent) {
      proposal.status = CouncilProposalStatus.Approved;
    } else if (event instanceof DaoCouncilDisapprovedEvent) {
      proposal.status = CouncilProposalStatus.Disapproved;
    } else if (event instanceof DaoCouncilClosedEvent) {
      proposal.status = CouncilProposalStatus.Closed;
    } else {
      proposal.status = CouncilProposalStatus.Executed;
    }

    proposal.updatedAt = new Date(timestamp);
    this._councilProposalsToUpdate.set(proposal.id, proposal);
  }

  prepareProposedQuery(
    event: DaoCouncilProposedEvent,
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
    event: CouncilProposalStatusEvents,
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
