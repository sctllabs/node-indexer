import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Proposal} from "./proposal.model"
import {Account} from "./account.model"

@Entity_()
export class VoteHistory {
    constructor(props?: Partial<VoteHistory>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Proposal, {nullable: true})
    proposalHash!: Proposal | undefined | null

    @Column_("bool", {nullable: false})
    approvedVote!: boolean

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    councillor!: Account | undefined | null

    @Column_("int4", {nullable: true})
    votedYes!: number | undefined | null

    @Column_("int4", {nullable: true})
    votedNo!: number | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    block!: bigint
}
