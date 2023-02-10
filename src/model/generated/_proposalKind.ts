import {AddMember} from "./_addMember"
import {RemoveMember} from "./_removeMember"
import {Spend} from "./_spend"

export type ProposalKind = AddMember | RemoveMember | Spend

export function fromJsonProposalKind(json: any): ProposalKind {
    switch(json?.isTypeOf) {
        case 'AddMember': return new AddMember(undefined, json)
        case 'RemoveMember': return new RemoveMember(undefined, json)
        case 'Spend': return new Spend(undefined, json)
        default: throw new TypeError('Unknown json object passed as ProposalKind')
    }
}
