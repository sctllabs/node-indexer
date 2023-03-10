import {AddMember} from "./_addMember"
import {RemoveMember} from "./_removeMember"
import {Spend} from "./_spend"
import {TransferToken} from "./_transferToken"

export type CouncilProposalKind = AddMember | RemoveMember | Spend | TransferToken

export function fromJsonCouncilProposalKind(json: any): CouncilProposalKind {
    switch(json?.isTypeOf) {
        case 'AddMember': return new AddMember(undefined, json)
        case 'RemoveMember': return new RemoveMember(undefined, json)
        case 'Spend': return new Spend(undefined, json)
        case 'TransferToken': return new TransferToken(undefined, json)
        default: throw new TypeError('Unknown json object passed as CouncilProposalKind')
    }
}
