import {GovernanceV1} from "./_governanceV1"
import {OwnershipWeightedVoting} from "./_ownershipWeightedVoting"

export type Governance = GovernanceV1 | OwnershipWeightedVoting

export function fromJsonGovernance(json: any): Governance {
    switch(json?.isTypeOf) {
        case 'GovernanceV1': return new GovernanceV1(undefined, json)
        case 'OwnershipWeightedVoting': return new OwnershipWeightedVoting(undefined, json)
        default: throw new TypeError('Unknown json object passed as Governance')
    }
}
