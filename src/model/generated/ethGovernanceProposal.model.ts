import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Dao} from "./dao.model"
import {EthGovernanceProposalKind, fromJsonEthGovernanceProposalKind} from "./_ethGovernanceProposalKind"
import {EthGovernanceProposalStatus} from "./_ethGovernanceProposalStatus"

@Entity_()
export class EthGovernanceProposal {
    constructor(props?: Partial<EthGovernanceProposal>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    index!: number

    @Column_("text", {nullable: false})
    hash!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Index_()
    @ManyToOne_(() => Dao, {nullable: true})
    dao!: Dao

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockNumber!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    voteThreshold!: bigint

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : fromJsonEthGovernanceProposalKind(obj)}, nullable: false})
    kind!: EthGovernanceProposalKind

    @Column_("text", {nullable: true})
    meta!: string | undefined | null

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Column_("timestamp with time zone", {nullable: false})
    updatedAt!: Date

    @Column_("text", {nullable: false})
    blockHash!: string

    @Column_("int4", {nullable: false})
    blockNum!: number

    @Column_("varchar", {length: 11, nullable: false})
    status!: EthGovernanceProposalStatus

    @Column_("bool", {nullable: true})
    executed!: boolean | undefined | null

    @Column_("text", {nullable: true})
    reason!: string | undefined | null
}
