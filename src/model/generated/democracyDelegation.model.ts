import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {DemocracyDelegationItem} from "./_democracyDelegationItem"

@Entity_()
export class DemocracyDelegation {
    constructor(props?: Partial<DemocracyDelegation>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new DemocracyDelegationItem(undefined, marshal.nonNull(val)))}, nullable: false})
    delegations!: (DemocracyDelegationItem)[]
}
