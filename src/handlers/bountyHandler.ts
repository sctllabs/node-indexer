import { FindOptionsWhere, In } from "typeorm";
import type { Ctx } from "../processor";
import type { EventInfo } from "../types";
import {
  DaoBountiesBountyAwardedEvent,
  DaoBountiesBountyBecameActiveEvent,
  DaoBountiesBountyCanceledEvent,
  DaoBountiesBountyClaimedEvent,
  DaoBountiesBountyCreatedEvent,
  DaoBountiesBountyCuratorAcceptedEvent,
  DaoBountiesBountyCuratorProposedEvent,
  DaoBountiesBountyCuratorUnassignedEvent,
  DaoBountiesBountyExtendedEvent,
  DaoBountiesDaoPurgedEvent,
} from "../types/events";
import { Account, Bounty, BountyStatus, Dao } from "../model";
import { decodeAddress, decodeString, getAccount } from "../utils";
import { BaseHandler } from "./baseHandler";
import { buildBountyId } from "../utils/buildBountyId";

type BountyStatusEvents =
  | DaoBountiesBountyBecameActiveEvent
  | DaoBountiesBountyCuratorProposedEvent
  | DaoBountiesBountyCuratorUnassignedEvent
  | DaoBountiesBountyCuratorAcceptedEvent
  | DaoBountiesBountyAwardedEvent
  | DaoBountiesBountyClaimedEvent
  | DaoBountiesBountyCanceledEvent
  | DaoBountiesBountyExtendedEvent;

type BountyEvents =
  | BountyStatusEvents
  | DaoBountiesBountyCreatedEvent
  | DaoBountiesDaoPurgedEvent;

export class BountyHandler extends BaseHandler<Bounty> {
  private readonly _bountiesToInsert: Map<string, Bounty>;
  private readonly _bountiesToUpdate: Map<string, Bounty>;
  private readonly _bountiesQueryMap: Map<string, Bounty>;
  private readonly _bountyIds: Set<string>;
  private readonly _bountyDaoIds: Set<number>;

  constructor(ctx: Ctx) {
    super(ctx);
    this._bountiesToInsert = new Map<string, Bounty>();
    this._bountiesToUpdate = new Map<string, Bounty>();
    this._bountiesQueryMap = new Map<string, Bounty>();
    this._bountyIds = new Set<string>();
    this._bountyDaoIds = new Set<number>();
  }

  get bountyDaoIds() {
    return this._bountyDaoIds;
  }

  save() {
    return this._ctx.store.save([...this._bountiesToUpdate.values()]);
  }

  insert() {
    return this._ctx.store.insert([...this._bountiesToInsert.values()]);
  }

  arrayToMap(bounties: Bounty[]) {
    for (const bounty of bounties) {
      this._bountiesQueryMap.set(bounty.id, bounty);
    }
  }

  query() {
    const where: FindOptionsWhere<Bounty>[] = [
      { id: In([...this._bountyIds]) },
    ];
    if (this.bountyDaoIds.size > 0) {
      where.push({ dao: { id: In([...this.bountyDaoIds]) } });
    }

    return this._ctx.store.findBy(Bounty, where);
  }

  processStatus(
    { event, timestamp }: EventInfo<BountyStatusEvents>,
    accounts: Map<string, Account>
  ) {
    let daoId, index, beneficiary;
    if (event.isV100) {
      ({ daoId, index } = event.asV100);
    } else {
      throw new Error("Unsupported bounty spec");
    }

    const id = buildBountyId(daoId, index);

    const bounty =
      this._bountiesToInsert.get(id) ??
      this._bountiesToUpdate.get(id) ??
      this._bountiesQueryMap.get(id);

    if (!bounty) {
      throw new Error(`Bounty with id: ${id} not found.`);
    }

    if (event instanceof DaoBountiesBountyCreatedEvent) {
      bounty.status = BountyStatus.Created;
    } else if (event instanceof DaoBountiesBountyCanceledEvent) {
      bounty.status = BountyStatus.Cancelled;
    } else if (event instanceof DaoBountiesBountyAwardedEvent) {
      let beneficiary;
      if (event.isV100) {
        ({ beneficiary } = event.asV100);
      } else {
        throw new Error("Unsupported bounty spec");
      }

      const beneficiaryAddress = decodeAddress(beneficiary);
      bounty.beneficiary = getAccount(accounts, beneficiaryAddress);
      bounty.status = BountyStatus.Awarded;
    } else if (event instanceof DaoBountiesBountyCuratorProposedEvent) {
      let fee;
      if (event.isV100) {
        ({ fee } = event.asV100);
      } else {
        throw new Error("Unsupported bounty spec");
      }

      bounty.fee = fee;
      bounty.status = BountyStatus.CuratorProposed;
    } else if (event instanceof DaoBountiesBountyCuratorUnassignedEvent) {
      bounty.curator = null;
      bounty.fee = null;
      bounty.status = BountyStatus.CuratorUnassigned;
    } else if (event instanceof DaoBountiesBountyCuratorAcceptedEvent) {
      bounty.status = BountyStatus.CuratorAccepted;
    } else if (event instanceof DaoBountiesBountyExtendedEvent) {
      let updateDue;
      if (event.isV100) {
        ({ updateDue } = event.asV100);
      } else {
        throw new Error("Unsupported bounty spec");
      }

      bounty.status = BountyStatus.Extended;
      bounty.updateDue = updateDue;
    } else if (event instanceof DaoBountiesBountyClaimedEvent) {
      let payout, beneficiary;
      if (event.isV100) {
        ({ payout, beneficiary } = event.asV100);
      } else {
        throw new Error("Unsupported bounty spec");
      }

      const beneficiaryAddress = decodeAddress(beneficiary);
      bounty.beneficiary = getAccount(accounts, beneficiaryAddress);
      bounty.payout = payout;
      bounty.status = BountyStatus.Claimed;
    } else {
      bounty.status = BountyStatus.BecameActive;
    }

    if (
      !(
        event instanceof DaoBountiesBountyExtendedEvent ||
        event instanceof DaoBountiesBountyClaimedEvent ||
        event instanceof DaoBountiesBountyCanceledEvent
      )
    ) {
      let status;
      if (event.isV100) {
        ({ status } = event.asV100);
      } else {
        throw new Error("Unsupported bounty spec");
      }

      switch (status.__kind) {
        case "Active": {
          const { curator, updateDue } = status;
          const curatorAddress = decodeAddress(curator);
          bounty.curator = getAccount(accounts, curatorAddress);
          bounty.updateDue = updateDue;
          break;
        }
        case "PendingPayout": {
          const { curator, beneficiary, unlockAt } = status;
          const curatorAddress = decodeAddress(curator);
          const beneficiaryAddress = decodeAddress(beneficiary);
          bounty.curator = getAccount(accounts, curatorAddress);
          bounty.beneficiary = getAccount(accounts, beneficiaryAddress);
          bounty.unlockAt = unlockAt;
          break;
        }
        case "Funded": {
          break;
        }
        case "CuratorProposed": {
          const { curator } = status;
          const curatorAddress = decodeAddress(curator);
          bounty.curator = getAccount(accounts, curatorAddress);
          break;
        }
        case "Approved": {
          break;
        }
        default: {
          throw new Error(`Incorrect status.`);
        }
      }
    }

    bounty.updatedAt = new Date(timestamp);
    this._bountiesToUpdate.set(id, bounty);
  }

  processCreated(
    {
      event,
      blockHash,
      blockNum,
      timestamp,
    }: EventInfo<DaoBountiesBountyCreatedEvent>,
    daosToInsert: Map<string, Dao>,
    daosToUpdate: Map<string, Dao>,
    daosQueryMap: Map<string, Dao>
  ) {
    const { daoId, index, description, value, tokenId } = event.asV100;

    const id = buildBountyId(daoId, index);

    const dao =
      daosToInsert.get(daoId.toString()) ??
      daosToUpdate.get(daoId.toString()) ??
      daosQueryMap.get(daoId.toString());

    if (!dao) {
      throw new Error(`Dao with id: ${daoId} not found.`);
    }

    const nativeToken = tokenId === undefined;

    this._bountiesToInsert.set(
      id,
      new Bounty({
        id,
        index,
        value,
        dao,
        nativeToken,
        blockHash,
        blockNum,
        description: decodeString(description),
        status: BountyStatus.Created,
        createdAt: new Date(timestamp),
        updatedAt: new Date(timestamp),
      })
    );
  }

  processDaoPurged({ event }: EventInfo<DaoBountiesDaoPurgedEvent>) {
    let daoId: number;
    if (event.isV104) {
      ({ daoId } = event.asV104);
    } else {
      throw new Error("Unsupported dao remove spec");
    }

    this._bountiesQueryMap.forEach((bounty, id) => {
      const { index } = bounty;
      if (id !== buildBountyId(daoId, index)) {
        return;
      }

      bounty.removed = true;

      this._bountiesToUpdate.set(id, bounty);
    });
  }

  prepareQuery(
    event: BountyEvents,
    daoIds: Set<string>,
    accountIds: Set<string>
  ) {
    if (event instanceof DaoBountiesDaoPurgedEvent) {
      if (event.isV104) {
        const { daoId } = event.asV104;

        this._bountyDaoIds.add(daoId);
      } else {
        throw new Error("Unsupported bounty dao purge spec");
      }

      return;
    }

    let daoId, index;
    if (event.asV100) {
      ({ daoId, index } = event.asV100);
    } else {
      throw new Error("Unsupported bounty event spec");
    }

    const id = buildBountyId(daoId, index);

    this._bountyIds.add(id);

    daoIds.add(daoId.toString());

    if (
      event instanceof DaoBountiesBountyExtendedEvent ||
      event instanceof DaoBountiesBountyClaimedEvent ||
      event instanceof DaoBountiesBountyCanceledEvent
    ) {
      return;
    }

    let status;
    if (event.isV100) {
      ({ status } = event.asV100);
    } else {
      throw new Error("Unsupported bounty event spec");
    }

    switch (status.__kind) {
      case "Approved": {
        break;
      }
      case "CuratorProposed": {
        const { curator } = status;
        const curatorAddress = decodeAddress(curator);
        accountIds.add(curatorAddress);
        break;
      }
      case "Funded": {
        break;
      }
      case "PendingPayout": {
        const { curator, beneficiary } = status;
        const curatorAddress = decodeAddress(curator);
        const beneficiaryAddress = decodeAddress(beneficiary);
        accountIds.add(curatorAddress);
        accountIds.add(beneficiaryAddress);
        break;
      }
      case "Active": {
        const { curator } = status;
        const curatorAddress = decodeAddress(curator);
        accountIds.add(curatorAddress);
        break;
      }
    }
  }
}
