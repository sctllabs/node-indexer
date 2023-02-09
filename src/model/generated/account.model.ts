import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {CouncilAccounts} from "./councilAccounts.model"
import {TechnicalCommitteeAccounts} from "./technicalCommitteeAccounts.model"

@Entity_()
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    /**
     * Account address
     */
    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => CouncilAccounts, e => e.account)
    memberOfCouncil!: CouncilAccounts[]

    @OneToMany_(() => TechnicalCommitteeAccounts, e => e.account)
    memberOfTechnicalCommittee!: TechnicalCommitteeAccounts[]
}
