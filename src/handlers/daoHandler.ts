import { In } from "typeorm";
import { Ctx } from "../processor";
import {
  Account,
  ApproveOriginType,
  Dao,
  Policy,
  GovernanceKind,
  GovernanceV1,
  OwnershipWeightedVoting,
  FungibleToken,
  CouncilAccounts,
  TechnicalCommitteeAccounts,
} from "../model";
import { DaoDaoRegisteredEvent } from "../types/events";
import { getAccount } from "../utils/getAcccount";
import { decodeAddress } from "../utils/decodeAddress";

import type { EventItem } from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import type {
  DaoConfig,
  DaoGovernance,
  DaoPolicy,
  DaoToken,
} from "../types/v100";

type DaoMemberType = "Council" | "TechnicalCommittee";

export async function daoHandler(
  ctx: Ctx,
  createDaoEvents: EventItem<
    "Dao.DaoRegistered",
    { readonly event: { readonly args: true } }
  >[],
  candidateFungibleTokens: FungibleToken[]
) {
  const daos: Dao[] = [];
  const policies: Policy[] = [];
  const councilAccounts: CouncilAccounts[] = [];
  const technicalCommitteeAccounts: TechnicalCommitteeAccounts[] = [];

  const [accountsQuery, fungibleTokensQuery] =
    await getAccountsAndFungibleTokens(ctx, createDaoEvents);

  const accountsMap = new Map(accountsQuery.map((a) => [a.id, a]));

  for (const daoEvent of createDaoEvents) {
    const e = new DaoDaoRegisteredEvent(ctx, daoEvent.event);

    if (!e.isV100) {
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
    } = e.asV100;
    const founderAddress = decodeAddress(encodedFounderAddress);
    const daoAccount = decodeAddress(encodedDaoAddress);

    const founder = getAccount(accountsMap, founderAddress);
    const account = getAccount(accountsMap, daoAccount);

    const dao = createDao(
      daoId.toString(),
      account,
      founder,
      daoPolicy,
      daoConfig
    );

    mapTokenToDao(dao, token, fungibleTokensQuery, candidateFungibleTokens);

    councilAccounts.push(
      ...addMembersToDao(dao, encodedCouncil, accountsMap, "Council")
    );

    technicalCommitteeAccounts.push(
      ...addMembersToDao(
        dao,
        encodedTechnicalCommittee,
        accountsMap,
        "TechnicalCommittee"
      )
    );

    policies.push(dao.policy);
    daos.push(dao);
  }
  return {
    daos,
    policies,
    councilAccounts,
    technicalCommitteeAccounts,
    accounts: Array.from(accountsMap.values()),
  };
}

function addMembersToDao(
  dao: Dao,
  encodedMemberAddresses: Uint8Array[],
  accountsMap: Map<string, Account>,
  memberType: DaoMemberType
) {
  return encodedMemberAddresses.map((_encodedMemberAddress) => {
    const address = decodeAddress(_encodedMemberAddress);
    const account = getAccount(accountsMap, address);
    const id = `${dao.id}-${address}`;

    switch (memberType) {
      case "Council": {
        return new CouncilAccounts({
          id,
          dao,
          account,
        });
      }
      case "TechnicalCommittee": {
        return new TechnicalCommitteeAccounts({
          id,
          dao,
          account,
        });
      }
      default: {
        throw new Error("Unknown dao account group");
      }
    }
  });
}

function mapTokenToDao(
  dao: Dao,
  token: DaoToken,
  fungibleTokensQuery: FungibleToken[],
  candidateFungibleTokens: FungibleToken[]
) {
  switch (token.__kind) {
    case "EthTokenAddress": {
      dao.ethTokenAddress = token.value.toString();
      break;
    }
    case "FungibleToken": {
      const fungibleToken =
        fungibleTokensQuery.find(
          (fungibleToken) => fungibleToken.id === token.value.toString()
        ) ??
        candidateFungibleTokens.find(
          (fungibleToken) => fungibleToken.id === token.value.toString()
        );
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
  createDaoEvents: EventItem<
    "Dao.DaoRegistered",
    { readonly event: { readonly args: true } }
  >[]
) {
  let accountIds = new Set<string>();
  let fungibleTokenIds = new Set<string>();

  for (const daoEvent of createDaoEvents) {
    const e = new DaoDaoRegisteredEvent(ctx, daoEvent.event);

    if (!e.isV100) {
      throw new Error("Unsupported dao spec");
    }
    const {
      founder: encodedFounderAddress,
      accountId: encodedDaoAddress,
      council: encodedCouncil,
      technicalCommittee: encodedTechnicalCommittee,
      token,
    } = e.asV100;
    const founder = decodeAddress(encodedFounderAddress);
    const daoAddress = decodeAddress(encodedDaoAddress);
    encodedCouncil.forEach((_encodedCouncilAddress) => {
      const address = decodeAddress(_encodedCouncilAddress);
      accountIds.add(address);
    });
    encodedTechnicalCommittee.forEach((_encodedTechnicalCommitteeAddress) => {
      const address = decodeAddress(_encodedTechnicalCommitteeAddress);
      accountIds.add(address);
    });
    accountIds.add(founder);
    accountIds.add(daoAddress);

    if (token.__kind === "FungibleToken") {
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
  daoConfig: DaoConfig
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
