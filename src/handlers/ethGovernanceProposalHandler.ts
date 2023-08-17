import { FindOptionsWhere, In } from "typeorm";
import {
  DaoEthGovernanceApprovedEvent,
  DaoEthGovernanceClosedEvent,
  DaoEthGovernanceDisapprovedEvent,
  DaoEthGovernanceExecutedEvent,
  DaoEthGovernanceProposedEvent,
  DaoEthGovernanceDaoPurgedEvent,
} from "../types/events";
import {
  Account,
  Dao,
  EthGovernanceProposalStatus,
  EthGovernanceProposal,
} from "../model";
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
import { Call as CallV105 } from "../types/v105";
import { buildProposalId } from "../utils/buildProposalId";

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
  private readonly _ethGovernanceProposalDaoIds: Set<number>;

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
    this._ethGovernanceProposalDaoIds = new Set<number>();
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

  get ethGovernanceProposalDaoIds() {
    return this._ethGovernanceProposalDaoIds;
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
    const where: FindOptionsWhere<EthGovernanceProposal>[] = [
      { id: In([...this._ethGovernanceProposalIds]) },
    ];
    if (this.ethGovernanceProposalDaoIds.size > 0) {
      where.push({ dao: { id: In([...this.ethGovernanceProposalDaoIds]) } });
    }

    return this._ctx.store.findBy(EthGovernanceProposal, where);
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
      blockNumber,
    } = this.decodeDaoEthGovernanceProposedEvent(event);

    const dao =
      daosToInsert.get(daoId.toString()) ?? daosQueryMap.get(daoId.toString());

    if (!dao) {
      throw new Error(`Dao with id: ${daoId} not found`);
    }

    const kind = getProposalKind(proposal);
    const hash = decodeHash(proposalHash);
    const id = buildProposalId(dao.id, proposalIndex);

    this._ethGovernanceProposalsToInsert.set(
      id,
      new EthGovernanceProposal({
        id,
        hash,
        index: proposalIndex,
        account: getAccount(accounts, decodeAddress(account)),
        meta: meta?.toString(),
        blockNumber: BigInt(blockNumber),
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
    let daoId, proposalIndex;
    if (event.isV100) {
      ({ daoId, proposalIndex } = event.asV100);
    } else {
      throw new Error("Unsupported eth governance proposal spec");
    }

    const proposalId = buildProposalId(daoId, proposalIndex);
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
      const { result } = event.asV100;
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
      proposal.status = EthGovernanceProposalStatus.Executed;
    }

    proposal.updatedAt = new Date(timestamp);
    this._ethGovernanceProposalsToUpdate.set(proposal.id, proposal);
  }

  processDaoPurged({ event }: EventInfo<DaoEthGovernanceDaoPurgedEvent>) {
    let daoId: number;
    if (event.isV104) {
      ({ daoId } = event.asV104);
    } else {
      throw new Error("Unsupported eth governance dao purge spec");
    }

    this._ethGovernanceProposalsQueryMap.forEach((proposal, id) => {
      const { index } = proposal;
      if (id !== buildProposalId(daoId, index)) {
        return;
      }

      proposal.removed = true;

      this._ethGovernanceProposalsToUpdate.set(id, proposal);
    });
  }

  prepareProposedQuery(
    event: DaoEthGovernanceProposedEvent,
    daoIds: Set<string>,
    accountIds: Set<string>
  ) {
    const { daoId, account } = this.decodeDaoEthGovernanceProposedEvent(event);

    const accountAddress = decodeAddress(account);
    daoIds.add(daoId.toString());
    accountIds.add(accountAddress);
  }

  prepareStatusQuery(
    event: EthGovernanceProposalStatusEvents,
    proposalIds: Set<string>
  ) {
    let daoId, proposalIndex;
    if (event.isV100) {
      ({ daoId, proposalIndex } = event.asV100);
    } else {
      throw new Error("Unsupported status spec");
    }

    const proposalId = buildProposalId(daoId, proposalIndex);
    proposalIds.add(proposalId);
  }

  prepareDaoPurgeQuery(event: DaoEthGovernanceDaoPurgedEvent) {
    let daoId;
    if (event.isV104) {
      ({ daoId } = event.asV104);
    } else {
      throw new Error("Unsupported eth governance dao purge spec");
    }

    this._ethGovernanceProposalDaoIds.add(daoId);
  }

  decodeDaoEthGovernanceProposedEvent(event: DaoEthGovernanceProposedEvent): {
    daoId: number;
    account: Uint8Array;
    proposalIndex: number;
    proposalHash: Uint8Array;
    proposal: CallV100 | CallV101 | CallV102 | CallV103 | CallV104 | CallV105;
    blockNumber: number;
    threshold: bigint;
    meta: Uint8Array;
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
    } else if (event.isV105) {
      return event.asV105;
    } else {
      throw new Error("Unsupported eth governance proposal spec");
    }
  }
}
