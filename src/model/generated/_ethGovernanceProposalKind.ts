import {AddMember} from "./_addMember"
import {RemoveMember} from "./_removeMember"
import {Spend} from "./_spend"
import {TransferToken} from "./_transferToken"
import {CreateBounty} from "./_createBounty"
import {CreateTokenBounty} from "./_createTokenBounty"
import {ProposeCurator} from "./_proposeCurator"
import {UnassignCurator} from "./_unassignCurator"

export type EthGovernanceProposalKind = AddMember | RemoveMember | Spend | TransferToken | CreateBounty | CreateTokenBounty | ProposeCurator | UnassignCurator

export function fromJsonEthGovernanceProposalKind(json: any): EthGovernanceProposalKind {
    switch(json?.isTypeOf) {
        case 'AddMember': return new AddMember(undefined, json)
        case 'RemoveMember': return new RemoveMember(undefined, json)
        case 'Spend': return new Spend(undefined, json)
        case 'TransferToken': return new TransferToken(undefined, json)
        case 'CreateBounty': return new CreateBounty(undefined, json)
        case 'CreateTokenBounty': return new CreateTokenBounty(undefined, json)
        case 'ProposeCurator': return new ProposeCurator(undefined, json)
        case 'UnassignCurator': return new UnassignCurator(undefined, json)
        default: throw new TypeError('Unknown json object passed as EthGovernanceProposalKind')
    }
}
