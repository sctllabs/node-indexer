import {AddMember} from "./_addMember"
import {RemoveMember} from "./_removeMember"
import {Spend} from "./_spend"
import {TransferToken} from "./_transferToken"
import {CreateBounty} from "./_createBounty"
import {CreateTokenBounty} from "./_createTokenBounty"
import {ProposeCurator} from "./_proposeCurator"

export type DemocracyProposalKind = AddMember | RemoveMember | Spend | TransferToken | CreateBounty | CreateTokenBounty | ProposeCurator

export function fromJsonDemocracyProposalKind(json: any): DemocracyProposalKind {
    switch(json?.isTypeOf) {
        case 'AddMember': return new AddMember(undefined, json)
        case 'RemoveMember': return new RemoveMember(undefined, json)
        case 'Spend': return new Spend(undefined, json)
        case 'TransferToken': return new TransferToken(undefined, json)
        case 'CreateBounty': return new CreateBounty(undefined, json)
        case 'CreateTokenBounty': return new CreateTokenBounty(undefined, json)
        case 'ProposeCurator': return new ProposeCurator(undefined, json)
        default: throw new TypeError('Unknown json object passed as DemocracyProposalKind')
    }
}
