import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class DaoPolicy {
    constructor(props?: Partial<DaoPolicy>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    proposalPeriod!: number

    @Column_("text", {nullable: false})
    approveOriginType!: string

    @Column_("int4", {array: true, nullable: true})
    approveOriginProportion!: (number)[] | undefined | null
}
