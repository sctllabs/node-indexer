import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Dao} from "./dao.model"
import {ProposalKind, fromJsonProposalKind} from "./_proposalKind"

@Entity_()
export class Proposal {
    constructor(props?: Partial<Proposal>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    index!: string

    @Column_("text", {nullable: false})
    hash!: string

    @Column_("text", {nullable: false})
    account!: string

    @Index_()
    @ManyToOne_(() => Dao, {nullable: true})
    dao!: Dao

    @Column_("int4", {nullable: false})
    voteThreshold!: number

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : fromJsonProposalKind(obj)}, nullable: false})
    kind!: ProposalKind

    @Column_("text", {nullable: true})
    meta!: string | undefined | null
}
