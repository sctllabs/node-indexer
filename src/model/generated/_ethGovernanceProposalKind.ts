import {AddMember} from "./_addMember"
import {RemoveMember} from "./_removeMember"
import {Spend} from "./_spend"
import {TransferToken} from "./_transferToken"
import {CreateBounty} from "./_createBounty"
import {CreateTokenBounty} from "./_createTokenBounty"
import {ProposeCurator} from "./_proposeCurator"
import {UnassignCurator} from "./_unassignCurator"
import {UpdateDaoMetadata} from "./_updateDaoMetadata"
import {UpdateDaoPolicy} from "./_updateDaoPolicy"
import {MintDaoToken} from "./_mintDaoToken"

export type EthGovernanceProposalKind = AddMember | RemoveMember | Spend | TransferToken | CreateBounty | CreateTokenBounty | ProposeCurator | UnassignCurator | UpdateDaoMetadata | UpdateDaoPolicy | MintDaoToken

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
        case 'UpdateDaoMetadata': return new UpdateDaoMetadata(undefined, json)
        case 'UpdateDaoPolicy': return new UpdateDaoPolicy(undefined, json)
        case 'MintDaoToken': return new MintDaoToken(undefined, json)
        default: throw new TypeError('Unknown json object passed as EthGovernanceProposalKind')
    }
}
