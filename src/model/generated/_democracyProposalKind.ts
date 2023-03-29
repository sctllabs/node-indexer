import {AddMember} from "./_addMember"
import {RemoveMember} from "./_removeMember"
import {Spend} from "./_spend"
import {TransferToken} from "./_transferToken"
import {CreateBounty} from "./_createBounty"

export type DemocracyProposalKind = AddMember | RemoveMember | Spend | TransferToken | CreateBounty

export function fromJsonDemocracyProposalKind(json: any): DemocracyProposalKind {
    switch(json?.isTypeOf) {
        case 'AddMember': return new AddMember(undefined, json)
        case 'RemoveMember': return new RemoveMember(undefined, json)
        case 'Spend': return new Spend(undefined, json)
        case 'TransferToken': return new TransferToken(undefined, json)
        case 'CreateBounty': return new CreateBounty(undefined, json)
        default: throw new TypeError('Unknown json object passed as DemocracyProposalKind')
    }
}
