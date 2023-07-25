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

import { Call as CallV100 } from "../types/v100";
import { Call as CallV101 } from "../types/v101";
import { Call as CallV102 } from "../types/v102";
import { Call as CallV103 } from "../types/v103";

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
      this.decodeDaoDemocracyProposedEvent(event);

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
    let daoId, propIndex;
    if (event.isV100) {
      ({ daoId, propIndex } = event.asV100);
    } else {
      throw new Error("Unsupported democracy proposal status spec");
    }

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
    const { daoId, account } = this.decodeDaoDemocracyProposedEvent(event);

    const accountAddress = decodeAddress(account);

    daoIds.add(daoId.toString());
    accountIds.add(accountAddress);
  }

  prepareStatusQuery(event: DaoDemocracyStartedEvent) {
    let daoId, propIndex;
    if (event.isV100) {
      ({ daoId, propIndex } = event.asV100);
    } else {
      throw new Error("Unsupported democracy proposal status spec");
    }

    const democracyProposalId = `${daoId}-${propIndex}`;

    this._democracyProposalsIds.add(democracyProposalId);
  }

  decodeDaoDemocracyProposedEvent(event: DaoDemocracyProposedEvent): {
    daoId: number;
    account: Uint8Array;
    proposalIndex: number;
    proposal: CallV100 | CallV101 | CallV102 | CallV103;
    deposit: bigint;
    meta: Uint8Array | undefined;
  } {
    if (event.isV100) {
      return event.asV100;
    } else if (event.isV101) {
      return event.asV101;
    } else if (event.isV102) {
      return event.asV102;
    } else if (event.isV103) {
      return event.asV103;
    } else {
      throw new Error("Unsupported democracy proposal spec");
    }
  }
}
