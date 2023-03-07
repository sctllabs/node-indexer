import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Account} from "./account.model"
import {DemocracyProposal} from "./democracyProposal.model"

@Entity_()
export class DemocracySecond {
    constructor(props?: Partial<DemocracySecond>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    seconder!: Account

    @Column_("int4", {nullable: false})
    count!: number

    @Index_()
    @ManyToOne_(() => DemocracyProposal, {nullable: true})
    proposal!: DemocracyProposal
}
