import { In } from "typeorm";
import { BaseHandler } from "./baseHandler";
import {
  DaoDemocracyProposedEvent,
  DaoDemocracyStartedEvent,
} from "../types/events";
import {
  Account,
  Dao,
  DemocracyProposal,
  DemocracyProposalStatus,
} from "../model";
import { decodeAddress, getAccount, getProposalKind } from "../utils";

import type { Ctx } from "../processor";
import type { EventInfo } from "../types";

export class DemocracyProposalHandler extends BaseHandler<DemocracyProposal> {
  private readonly _democracyProposalsToInsert: Map<string, DemocracyProposal>;
  private readonly _democracyProposalsToUpdate: Map<string, DemocracyProposal>;
  private readonly _democracyProposalsQueryMap: Map<string, DemocracyProposal>;
  private readonly _democracyProposalsIds: Set<string>;

  constructor(ctx: Ctx) {
    super(ctx);
    this._democracyProposalsToInsert = new Map<string, DemocracyProposal>();
    this._democracyProposalsToUpdate = new Map<string, DemocracyProposal>();
    this._democracyProposalsQueryMap = new Map<string, DemocracyProposal>();
    this._democracyProposalsIds = new Set<string>();
  }

  get democracyProposalsQueryMap() {
    return this._democracyProposalsQueryMap;
  }

  get democracyProposalsToInsert() {
    return this._democracyProposalsToInsert;
  }

  get democracyProposalsToUpdate() {
    return this._democracyProposalsToUpdate;
  }

  get democracyProposalIds() {
    return this._democracyProposalsIds;
  }

  arrayToMap(democracyProposals: DemocracyProposal[]) {
    for (const democracyProposal of democracyProposals) {
      this._democracyProposalsQueryMap.set(
        democracyProposal.id,
        democracyProposal
      );
    }
  }

  insert() {
    return this._ctx.store.insert([
      ...this._democracyProposalsToInsert.values(),
    ]);
  }

  save() {
    return this._ctx.store.save([...this._democracyProposalsToUpdate.values()]);
  }

  query() {
    return this._ctx.store.findBy(DemocracyProposal, {
      id: In([...this._democracyProposalsIds]),
    });
  }

  processProposed(
    {
      event,
      blockNum,
      blockHash,
      timestamp,
    }: EventInfo<DaoDemocracyProposedEvent>,
    daosToInsert: Map<string, Dao>,
    daosQueryMap: Map<string, Dao>,
    accounts: Map<string, Account>
  ) {
    const { daoId, account, proposalIndex, proposal, deposit, meta } =
      event.asV100;

    const dao =
      daosToInsert.get(daoId.toString()) ?? daosQueryMap.get(daoId.toString());

    if (!dao) {
      throw new Error(`Dao with id: ${daoId} not found`);
    }

    const kind = getProposalKind(proposal);
    const id = `${dao.id}-${proposalIndex}`;
    this._democracyProposalsToInsert.set(
      id,
      new DemocracyProposal({
        id,
        index: proposalIndex,
        account: getAccount(accounts, decodeAddress(account)),
        dao,
        deposit,
        kind,
        meta: meta?.toString(),
        blockHash,
        blockNum,
        status: DemocracyProposalStatus.Open,
        createdAt: new Date(timestamp),
        updatedAt: new Date(timestamp),
      })
    );
  }

  processStatus({ event, timestamp }: EventInfo<DaoDemocracyStartedEvent>) {
    const { daoId, propIndex } = event.asV100;

    const id = `${daoId}-${propIndex}`;

    const proposal =
      this._democracyProposalsToInsert.get(id) ??
      this._democracyProposalsQueryMap.get(id);

    if (!proposal) {
      throw new Error(`Democracy proposal with id: ${id} not found`);
    }

    proposal.status = DemocracyProposalStatus.Referendum;
    proposal.updatedAt = new Date(timestamp);
    this._democracyProposalsToUpdate.set(id, proposal);
  }

  prepareProposedQuery(
    event: DaoDemocracyProposedEvent,
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

  prepareStatusQuery(event: DaoDemocracyStartedEvent) {
    if (!event.isV100) {
      throw new Error("Unsupported democracy proposal status spec");
    }

    const { daoId, propIndex } = event.asV100;

    const democracyProposalId = `${daoId}-${propIndex}`;

    this._democracyProposalsIds.add(democracyProposalId);
  }
}
