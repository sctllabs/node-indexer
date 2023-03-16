import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Dao} from "./dao.model"
import {CouncilProposalKind, fromJsonCouncilProposalKind} from "./_councilProposalKind"
import {CouncilProposalStatus} from "./_councilProposalStatus"

@Entity_()
export class CouncilProposal {
    constructor(props?: Partial<CouncilProposal>) {
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

    @Column_("int4", {nullable: false})
    voteThreshold!: number

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : fromJsonCouncilProposalKind(obj)}, nullable: false})
    kind!: CouncilProposalKind

    @Column_("text", {nullable: true})
    meta!: string | undefined | null

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Column_("text", {nullable: false})
    blockHash!: string

    @Column_("int4", {nullable: false})
    blockNum!: number

    @Column_("varchar", {length: 11, nullable: false})
    status!: CouncilProposalStatus
}
