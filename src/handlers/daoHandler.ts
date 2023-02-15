import { In } from "typeorm";
import { Ctx, EventInfo } from "../processor";
import {
  Account,
  ApproveOriginType,
  Dao,
  Policy,
  GovernanceKind,
  GovernanceV1,
  OwnershipWeightedVoting,
  FungibleToken,
} from "../model";
import { DaoDaoRegisteredEvent } from "../types/events";
import { getAccount, decodeAddress } from "../utils";

import type {
  DaoConfig,
  DaoGovernance,
  DaoPolicy,
  DaoToken,
} from "../types/v100";

export async function daoHandler(
  ctx: Ctx,
  createDaoEvents: EventInfo<DaoDaoRegisteredEvent>[],
  fungibleTokens: Map<string, FungibleToken>,
  accounts: Map<string, Account>
) {
  const daos: Map<string, Dao> = new Map();
  const policies: Map<string, Policy> = new Map();

  const [accountsQuery, fungibleTokensQuery] =
    await getAccountsAndFungibleTokens(ctx, createDaoEvents, fungibleTokens);

  accountsQuery.map((_account: Account) => accounts.set(_account.id, _account));

  const fungibleTokensQueryMap = new Map(
    fungibleTokensQuery.map((_fungibleTokenQuery) => [
      _fungibleTokenQuery.id,
      _fungibleTokenQuery,
    ])
  );

  for (const { event, timestamp, blockNum, blockHash } of createDaoEvents) {
    if (!event.isV100) {
      throw new Error("Unsupported dao spec");
    }

    const {
      daoId,
      founder: encodedFounderAddress,
      accountId: encodedDaoAddress,
      config: daoConfig,
      policy: daoPolicy,
      council: encodedCouncil,
      technicalCommittee: encodedTechnicalCommittee,
      token,
    } = event.asV100;
    const founderAddress = decodeAddress(encodedFounderAddress);
    const daoAccount = decodeAddress(encodedDaoAddress);

    const founder = getAccount(accounts, founderAddress);
    const account = getAccount(accounts, daoAccount);

    const dao = createDao(
      daoId.toString(),
      account,
      founder,
      daoPolicy,
      daoConfig,
      blockHash,
      blockNum,
      timestamp
    );

    dao.council = encodedCouncil.map(
      (_encodedCouncil) =>
        getAccount(accounts, decodeAddress(_encodedCouncil)).id
    );
    dao.technicalCommittee = encodedTechnicalCommittee.map(
      (_encodedTechnicalCommittee) =>
        getAccount(accounts, decodeAddress(_encodedTechnicalCommittee)).id
    );

    mapTokenToDao(dao, token, fungibleTokensQueryMap, fungibleTokens);

    policies.set(dao.policy.id, dao.policy);
    daos.set(dao.id, dao);
  }
  return {
    daos,
    policies,
    accounts,
  };
}

function mapTokenToDao(
  dao: Dao,
  token: DaoToken,
  fungibleTokensQuery: Map<string, FungibleToken>,
  candidateFungibleTokens: Map<string, FungibleToken>
) {
  switch (token.__kind) {
    case "EthTokenAddress": {
      dao.ethTokenAddress = token.value.toString();
      break;
    }
    case "FungibleToken": {
      const fungibleToken =
        fungibleTokensQuery.get(token.value.toString()) ??
        candidateFungibleTokens.get(token.value.toString());
      if (!fungibleToken) {
        throw new Error(
          `Fungible token with id :${token.value.toString()} does not exist.`
        );
      }
      dao.fungibleToken = fungibleToken;
      break;
    }
  }
}

async function getAccountsAndFungibleTokens(
  ctx: Ctx,
  createDaoEvents: EventInfo<DaoDaoRegisteredEvent>[],
  candidateFungibleTokens: Map<string, FungibleToken>
) {
  const accountIds = new Set<string>();
  const fungibleTokenIds = new Set<string>();

  for (const { event } of createDaoEvents) {
    if (!event.isV100) {
      throw new Error("Unsupported dao spec");
    }
    const {
      founder: encodedFounderAddress,
      accountId: encodedDaoAddress,
      council: encodedCouncil,
      technicalCommittee: encodedTechnicalCommittee,
      token,
    } = event.asV100;
    const founder = decodeAddress(encodedFounderAddress);
    const daoAddress = decodeAddress(encodedDaoAddress);
    encodedCouncil.forEach((_encodedCouncilAddress) =>
      accountIds.add(decodeAddress(_encodedCouncilAddress))
    );
    encodedTechnicalCommittee.forEach((_encodedTechnicalCommitteeAddress) =>
      accountIds.add(decodeAddress(_encodedTechnicalCommitteeAddress))
    );
    accountIds.add(founder);
    accountIds.add(daoAddress);

    if (
      token.__kind === "FungibleToken" &&
      !candidateFungibleTokens.get(token.value.toString())
    ) {
      fungibleTokenIds.add(token.value.toString());
    }
  }

  return Promise.all([
    ctx.store.findBy(Account, {
      id: In([...accountIds]),
    }),
    ctx.store.findBy(FungibleToken, {
      id: In([...fungibleTokenIds]),
    }),
  ]);
}

function createDao(
  daoId: string,
  account: Account,
  founder: Account,
  daoPolicy: DaoPolicy,
  daoConfig: DaoConfig,
  blockHash: string,
  blockNum: number,
  timestamp: number
) {
  const governance = createGovernance(daoPolicy.governance);
  const policy = new Policy({
    id: daoId,
    proposalPeriod: daoPolicy.proposalPeriod,
    approveOriginProportion: daoPolicy.approveOrigin.value,
    approveOriginType: ApproveOriginType[daoPolicy.approveOrigin.__kind],
    governance,
  });
  return new Dao({
    id: daoId,
    account,
    founder,
    name: daoConfig.name.toString(),
    purpose: daoConfig.purpose.toString(),
    metadata: daoConfig.metadata.toString(),
    policy,
    blockHash,
    blockNum,
    createdAt: new Date(timestamp),
  });
}

function createGovernance(governance: DaoGovernance | undefined) {
  if (!governance) {
    return;
  }

  switch (governance.__kind) {
    case "GovernanceV1": {
      const daoGovernanceValue = governance.value;
      return new GovernanceV1({
        kind: GovernanceKind.GovernanceV1,
        enactmentPeriod: BigInt(daoGovernanceValue.enactmentPeriod),
        launchPeriod: BigInt(daoGovernanceValue.launchPeriod),
        votingPeriod: BigInt(daoGovernanceValue.votingPeriod),
        voteLockingPeriod: BigInt(daoGovernanceValue.voteLockingPeriod),
        fastTrackVotingPeriod: BigInt(daoGovernanceValue.fastTrackVotingPeriod),
        cooloffPeriod: BigInt(daoGovernanceValue.cooloffPeriod),
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
