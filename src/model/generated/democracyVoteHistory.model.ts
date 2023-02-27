import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {DemocracyReferendum} from "./_democracyReferendum"
import {Account} from "./account.model"

@Entity_()
export class DemocracyVoteHistory {
    constructor(props?: Partial<DemocracyVoteHistory>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new DemocracyReferendum(undefined, obj)}, nullable: true})
    proposal!: DemocracyReferendum | undefined | null

    @Column_("bool", {nullable: false})
    approvedVote!: boolean

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    voter!: Account | undefined | null

    @Column_("int4", {nullable: true})
    votedYes!: number | undefined | null

    @Column_("int4", {nullable: true})
    votedNo!: number | undefined | null

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Column_("text", {nullable: false})
    blockHash!: string

    @Column_("int4", {nullable: false})
    blockNum!: number
}
