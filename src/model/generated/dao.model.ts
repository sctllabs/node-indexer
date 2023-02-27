import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Account} from "./account.model"
import {FungibleToken} from "./fungibleToken.model"
import {Policy} from "./policy.model"
import {CouncilProposal} from "./councilProposal.model"

@Entity_()
export class Dao {
    constructor(props?: Partial<Dao>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    founder!: Account

    @Column_("text", {array: true, nullable: false})
    council!: (string | undefined | null)[]

    @Column_("text", {array: true, nullable: false})
    technicalCommittee!: (string | undefined | null)[]

    @Column_("text", {nullable: false})
    name!: string

    @Column_("text", {nullable: false})
    purpose!: string

    @Column_("text", {nullable: false})
    metadata!: string

    @Index_()
    @ManyToOne_(() => FungibleToken, {nullable: true})
    fungibleToken!: FungibleToken | undefined | null

    @Column_("text", {nullable: true})
    ethTokenAddress!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Policy, {nullable: true})
    policy!: Policy

    @OneToMany_(() => CouncilProposal, e => e.dao)
    proposals!: CouncilProposal[]

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Column_("text", {nullable: false})
    blockHash!: string

    @Column_("int4", {nullable: false})
    blockNum!: number
}
