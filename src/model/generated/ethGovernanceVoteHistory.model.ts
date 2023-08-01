import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {EthGovernanceProposal} from "./ethGovernanceProposal.model"
import {Account} from "./account.model"

@Entity_()
export class EthGovernanceVoteHistory {
    constructor(props?: Partial<EthGovernanceVoteHistory>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => EthGovernanceProposal, {nullable: true})
    proposal!: EthGovernanceProposal | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account | undefined | null

    @Column_("bool", {nullable: true})
    aye!: boolean | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    balance!: bigint | undefined | null

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Column_("timestamp with time zone", {nullable: false})
    updatedAt!: Date

    @Column_("text", {nullable: false})
    blockHash!: string

    @Column_("int4", {nullable: false})
    blockNum!: number

    @Column_("bool", {nullable: true})
    removed!: boolean | undefined | null
}
