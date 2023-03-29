import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {DemocracyReferendumVoteThreshold} from "./_democracyReferendumVoteThreshold"
import {DemocracyProposal} from "./democracyProposal.model"
import {DemocracyReferendumStatus} from "./_democracyReferendumStatus"

@Entity_()
export class DemocracyReferendum {
    constructor(props?: Partial<DemocracyReferendum>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("varchar", {length: 20, nullable: false})
    voteThreshold!: DemocracyReferendumVoteThreshold

    @Index_()
    @ManyToOne_(() => DemocracyProposal, {nullable: true})
    democracyProposal!: DemocracyProposal

    @Column_("varchar", {length: 9, nullable: false})
    status!: DemocracyReferendumStatus

    @Column_("int4", {nullable: false})
    index!: number

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Column_("timestamp with time zone", {nullable: false})
    updatedAt!: Date
}
