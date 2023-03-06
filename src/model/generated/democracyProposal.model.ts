import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Dao} from "./dao.model"
import {DemocracyProposalKind, fromJsonDemocracyProposalKind} from "./_democracyProposalKind"
import {DemocracyProposalStatus} from "./_democracyProposalStatus"

@Entity_()
export class DemocracyProposal {
    constructor(props?: Partial<DemocracyProposal>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    index!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Index_()
    @ManyToOne_(() => Dao, {nullable: true})
    dao!: Dao

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    deposit!: bigint

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : fromJsonDemocracyProposalKind(obj)}, nullable: false})
    kind!: DemocracyProposalKind

    @Column_("text", {nullable: true})
    meta!: string | undefined | null

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Column_("text", {nullable: false})
    blockHash!: string

    @Column_("int4", {nullable: false})
    blockNum!: number

    @Column_("varchar", {length: 9, nullable: false})
    status!: DemocracyProposalStatus
}
