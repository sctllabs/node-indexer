import { In } from "typeorm";
import { DaoDaoRegisteredEvent } from "../types/events";
import { decodeAddress, getAccount } from "../utils";
import {
  Account,
  ApproveOriginType,
  Dao,
  FungibleToken,
  GovernanceKind,
  GovernanceV1,
  OwnershipWeightedVoting,
  Policy,
} from "../model";
import { DaoGovernance } from "../types/v100";
import { BaseHandler } from "./baseHandler";
import type { Ctx } from "../processor";
import type { EventInfo } from "../types";

export class DaoHandler extends BaseHandler<Dao> {
  private readonly _daosToInsert: Map<string, Dao>;
  private readonly _daosToUpdate: Map<string, Dao>;
  private readonly _policiesToInsert: Map<string, Policy>;
  private readonly _daosQueryMap: Map<string, Dao>;
  private readonly _daoIds: Set<string>;

  constructor(ctx: Ctx) {
    super(ctx);
    this._daosToInsert = new Map<string, Dao>();
    this._daosToUpdate = new Map<string, Dao>();
    this._daosQueryMap = new Map<string, Dao>();
    this._policiesToInsert = new Map<string, Policy>();
    this._daoIds = new Set<string>();
  }

  get daosQueryMap() {
    return this._daosQueryMap;
  }

  get daoIds() {
    return this._daoIds;
  }

  get daosToInsert() {
    return this._daosToInsert;
  }

  get daosToUpdate() {
    return this._daosToUpdate;
  }

  arrayToMap(daos: Dao[]) {
    for (const dao of daos) {
      this._daosQueryMap.set(dao.id, dao);
    }
  }

  insertPolicies() {
    return this._ctx.store.insert([...this._policiesToInsert.values()]);
  }

  insertDaos() {
    return this._ctx.store.insert([...this._daosToInsert.values()]);
  }

  protected insert() {
    throw new Error("Method not implemented");
  }

  save() {
    return this._ctx.store.save([...this._daosToUpdate.values()]);
  }

  query() {
    return this._ctx.store.findBy(Dao, { id: In([...this._daoIds]) });
  }

  process(
    { event, blockHash, blockNum, timestamp }: EventInfo<DaoDaoRegisteredEvent>,
    accounts: Map<string, Account>,
    fungibleTokensToInsert: Map<string, FungibleToken>,
    fungibleTokensQueryMap: Map<string, FungibleToken>
  ) {
    let daoId,
      encodedFounderAddress,
      encodedDaoAddress,
      daoConfig,
      daoPolicy,
      encodedCouncil,
      encodedTechnicalCommittee,
      token;
    if (event.isV100) {
      ({
        daoId,
        founder: encodedFounderAddress,
        accountId: encodedDaoAddress,
        config: daoConfig,
        policy: daoPolicy,
        council: encodedCouncil,
        technicalCommittee: encodedTechnicalCommittee,
        token,
      } = event.asV100);
    } else {
      throw new Error("Unsupported dao spec");
    }

    const founderAddress = decodeAddress(encodedFounderAddress);
    const daoAccount = decodeAddress(encodedDaoAddress);

    const founder = getAccount(accounts, founderAddress);
    const account = getAccount(accounts, daoAccount);

    const governance = this.createGovernance(daoPolicy.governance);
    const policy = new Policy({
      id: daoId.toString(),
      proposalPeriod: daoPolicy.proposalPeriod,
      bountyPayoutDelay: daoPolicy.bountyPayoutDelay,
      bountyUpdatePeriod: daoPolicy.bountyUpdatePeriod,
      approveOriginProportion: daoPolicy.approveOrigin.value,
      approveOriginType: ApproveOriginType[daoPolicy.approveOrigin.__kind],
      governance,
    });

    const council = encodedCouncil.map(
      (_encodedCouncil) =>
        getAccount(accounts, decodeAddress(_encodedCouncil)).id
    );
    const technicalCommittee = encodedTechnicalCommittee.map(
      (_encodedTechnicalCommittee) =>
        getAccount(accounts, decodeAddress(_encodedTechnicalCommittee)).id
    );

    const dao = new Dao({
      id: daoId.toString(),
      account,
      founder,

      council,
      technicalCommittee,
      policy,
      blockHash,
      blockNum,
      name: daoConfig.name.toString(),
      purpose: daoConfig.purpose.toString(),
      metadata: daoConfig.metadata.toString(),
      createdAt: new Date(timestamp),
    });

    switch (token.__kind) {
      case "EthTokenAddress": {
        dao.ethTokenAddress = token.value.toString();
        break;
      }
      case "FungibleToken": {
        const fungibleToken =
          fungibleTokensQueryMap.get(token.value.toString()) ??
          fungibleTokensToInsert.get(token.value.toString());
        if (!fungibleToken) {
          throw new Error(
            `Fungible token with id :${token.value.toString()} does not exist.`
          );
        }
        dao.fungibleToken = fungibleToken;
        break;
      }
    }

    this._policiesToInsert.set(dao.policy.id, dao.policy);
    this._daosToInsert.set(dao.id, dao);
  }

  prepareQuery(
    event: DaoDaoRegisteredEvent,
    accountIds: Set<string>,
    fungibleTokenIds: Set<string>
  ) {
    let encodedFounderAddress,
      encodedDaoAddress,
      encodedCouncil,
      encodedTechnicalCommittee,
      token;
    if (event.isV100) {
      ({
        founder: encodedFounderAddress,
        accountId: encodedDaoAddress,
        council: encodedCouncil,
        technicalCommittee: encodedTechnicalCommittee,
        token,
      } = event.asV100);
    } else {
      throw new Error("Unsupported dao spec");
    }

    const founder = decodeAddress(encodedFounderAddress);
    const daoAddress = decodeAddress(encodedDaoAddress);
    encodedCouncil.forEach((_encodedCouncilAddress) => {
      const decodedAddress = decodeAddress(_encodedCouncilAddress);
      accountIds.add(decodedAddress);
    });
    encodedTechnicalCommittee.forEach((_encodedTechnicalCommitteeAddress) => {
      const decodedAddress = decodeAddress(_encodedTechnicalCommitteeAddress);
      accountIds.add(decodedAddress);
    });
    accountIds.add(founder);

    accountIds.add(daoAddress);

    if (token.__kind === "FungibleToken") {
      fungibleTokenIds.add(token.value.toString());
    }
  }

  private createGovernance(governance: DaoGovernance | undefined) {
    if (!governance) {
      return;
    }

    switch (governance.__kind) {
      case "GovernanceV1": {
        const daoGovernanceValue = governance.value;
        return new GovernanceV1({
          kind: GovernanceKind.GovernanceV1,
          enactmentPeriod: daoGovernanceValue.enactmentPeriod,
          launchPeriod: daoGovernanceValue.launchPeriod,
          votingPeriod: daoGovernanceValue.votingPeriod,
          voteLockingPeriod: daoGovernanceValue.voteLockingPeriod,
          fastTrackVotingPeriod: daoGovernanceValue.fastTrackVotingPeriod,
          cooloffPeriod: daoGovernanceValue.cooloffPeriod,
          minimumDeposit: daoGovernanceValue.minimumDeposit,
          externalOrigin:
            ApproveOriginType[daoGovernanceValue.externalOrigin.__kind],
          externalMajorityOrigin:
            ApproveOriginType[daoGovernanceValue.externalMajorityOrigin.__kind],
          externalDefaultOrigin:
            ApproveOriginType[daoGovernanceValue.externalDefaultOrigin.__kind],
          fastTrackOrigin:
            ApproveOriginType[daoGovernanceValue.fastTrackOrigin.__kind],
          instantOrigin:
            ApproveOriginType[daoGovernanceValue.instantOrigin.__kind],
          instantAllowed: daoGovernanceValue.instantAllowed,
          cancellationOrigin:
            ApproveOriginType[daoGovernanceValue.cancellationOrigin.__kind],
          blacklistOrigin:
            ApproveOriginType[daoGovernanceValue.blacklistOrigin.__kind],
          cancelProposalOrigin:
            ApproveOriginType[daoGovernanceValue.cancelProposalOrigin.__kind],
        });
      }
      case "OwnershipWeightedVoting": {
        return new OwnershipWeightedVoting({
          kind: GovernanceKind.OwnershipWeightedVoting,
        });
      }
    }
  }
}
