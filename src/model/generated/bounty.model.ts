import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Dao} from "./dao.model"
import {BountyTag} from "./_bountyTag"
import {BountyStatus} from "./_bountyStatus"
import {Account} from "./account.model"

@Entity_()
export class Bounty {
    constructor(props?: Partial<Bounty>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Dao, {nullable: true})
    dao!: Dao

    @Column_("varchar", {length: 9, nullable: false})
    tag!: BountyTag

    @Column_("int4", {nullable: false})
    index!: number

    @Column_("varchar", {length: 17, nullable: false})
    status!: BountyStatus

    @Column_("text", {nullable: false})
    description!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    value!: bigint

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    curator!: Account | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    beneficiary!: Account | undefined | null

    @Column_("int4", {nullable: true})
    updateDue!: number | undefined | null

    @Column_("int4", {nullable: true})
    unlockAt!: number | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    fee!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    payout!: bigint | undefined | null

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Column_("timestamp with time zone", {nullable: false})
    updatedAt!: Date
}
