import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Conviction} from "./_conviction"

@Entity_()
export class DemocracyDelegation {
    constructor(props?: Partial<DemocracyDelegation>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    queryId!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    target!: Account

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    lockedBalance!: bigint

    @Column_("varchar", {length: 8, nullable: true})
    conviction!: Conviction | undefined | null
}
