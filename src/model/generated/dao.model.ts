import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Account} from "./account.model"
import {Token} from "./token.model"
import {DaoPolicy} from "./daoPolicy.model"

@Entity_()
export class Dao {
    constructor(props?: Partial<Dao>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    founder!: Account

    @Column_("text", {array: true, nullable: true})
    council!: (string)[] | undefined | null

    @Column_("text", {array: true, nullable: true})
    technicalCommittee!: (string)[] | undefined | null

    @Column_("text", {nullable: false})
    name!: string

    @Column_("text", {nullable: false})
    purpose!: string

    @Column_("text", {nullable: false})
    metadata!: string

    @Index_()
    @ManyToOne_(() => Token, {nullable: true})
    token!: Token

    @Index_()
    @ManyToOne_(() => DaoPolicy, {nullable: true})
    policy!: DaoPolicy
}
