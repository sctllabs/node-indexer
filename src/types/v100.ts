import type {Result, Option} from './support'

export type DaoToken = DaoToken_FungibleToken | DaoToken_EthTokenAddress

export interface DaoToken_FungibleToken {
    __kind: 'FungibleToken'
    value: number
}

export interface DaoToken_EthTokenAddress {
    __kind: 'EthTokenAddress'
    value: Uint8Array
}

export interface DaoConfig {
    name: Uint8Array
    purpose: Uint8Array
    metadata: Uint8Array
}

export interface DaoPolicy {
    proposalPeriod: number
    approveOrigin: DaoPolicyProportion
    governance: (DaoGovernance | undefined)
}

export type DaoPolicyProportion = DaoPolicyProportion_AtLeast | DaoPolicyProportion_MoreThan

export interface DaoPolicyProportion_AtLeast {
    __kind: 'AtLeast'
    value: [number, number]
}

export interface DaoPolicyProportion_MoreThan {
    __kind: 'MoreThan'
    value: [number, number]
}

export type DaoGovernance = DaoGovernance_GovernanceV1 | DaoGovernance_OwnershipWeightedVoting

export interface DaoGovernance_GovernanceV1 {
    __kind: 'GovernanceV1'
    value: GovernanceV1Policy
}

export interface DaoGovernance_OwnershipWeightedVoting {
    __kind: 'OwnershipWeightedVoting'
}

export interface GovernanceV1Policy {
    enactmentPeriod: number
    launchPeriod: number
    votingPeriod: number
    voteLockingPeriod: number
    fastTrackVotingPeriod: number
    cooloffPeriod: number
    minimumDeposit: bigint
    externalOrigin: DaoPolicyProportion
    externalMajorityOrigin: DaoPolicyProportion
    externalDefaultOrigin: DaoPolicyProportion
    fastTrackOrigin: DaoPolicyProportion
    instantOrigin: DaoPolicyProportion
    instantAllowed: boolean
    cancellationOrigin: DaoPolicyProportion
    blacklistOrigin: DaoPolicyProportion
    cancelProposalOrigin: DaoPolicyProportion
}
