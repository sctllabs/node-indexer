import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {CouncilAccount} from "./councilAccount.model"
import {TechnicalCommitteeAccount} from "./technicalCommitteeAccount.model"

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

    @OneToMany_(() => CouncilAccount, e => e.account)
    memberOfCouncil!: CouncilAccount[]

    @OneToMany_(() => TechnicalCommitteeAccount, e => e.account)
    memberOfTechnicalCommittee!: TechnicalCommitteeAccount[]
}
