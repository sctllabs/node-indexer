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

import { Call as CallV100 } from "../types/v100";
import { Call as CallV101 } from "../types/v101";
import { Call as CallV102 } from "../types/v102";
import { Call as CallV103 } from "../types/v103";
import { Call as CallV104 } from "../types/v104";

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
    } = this.decodeDaoCouncilProposedEvent(event);

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
    let daoId, proposalIndex;
    if (event.isV100) {
      ({ daoId, proposalIndex } = event.asV100);
    } else {
      throw new Error("Unsupported council proposal spec");
    }

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
      let result;
      if (event.isV100) {
        ({ result } = event.asV100);
      } else {
        throw new Error("Unsupported council proposal spec");
      }

      switch (result.__kind) {
        case "Ok": {
          proposal.executed = true;
          break;
        }
        case "Err": {
          proposal.executed = false;

          switch (result.value.__kind) {
            case "Module":
              proposal.reason = JSON.stringify(result.value.value);

              break;
            default:
              proposal.reason = result.value.__kind;

              break;
          }

          break;
        }
      }
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
    const { daoId, account } = this.decodeDaoCouncilProposedEvent(event);

    const accountAddress = decodeAddress(account);
    daoIds.add(daoId.toString());
    accountIds.add(accountAddress);
  }

  prepareStatusQuery(
    event: CouncilProposalStatusEvents,
    proposalIds: Set<string>
  ) {
    let daoId, proposalIndex;
    if (event.isV100) {
      ({ daoId, proposalIndex } = event.asV100);
    } else {
      throw new Error("Unsupported council proposal spec");
    }

    const proposalId = `${daoId}-${proposalIndex}`;
    proposalIds.add(proposalId);
  }

  decodeDaoCouncilProposedEvent(event: DaoCouncilProposedEvent): {
    daoId: number;
    account: Uint8Array;
    proposalIndex: number;
    proposalHash: Uint8Array;
    proposal: CallV100 | CallV101 | CallV102 | CallV103 | CallV104;
    threshold: number;
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
    } else if (event.isV104) {
      return event.asV104;
    } else {
      throw new Error("Unsupported council proposal spec");
    }
  }
}
