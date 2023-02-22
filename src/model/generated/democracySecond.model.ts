import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Dao} from "./dao.model"
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
    @ManyToOne_(() => Dao, {nullable: true})
    dao!: Dao

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    seconder!: Account

    @Index_()
    @ManyToOne_(() => DemocracyProposal, {nullable: true})
    proposal!: DemocracyProposal
}
