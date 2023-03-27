import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {ApproveOriginType} from "./_approveOriginType"
import {Governance, fromJsonGovernance} from "./_governance"

@Entity_()
export class Policy {
    constructor(props?: Partial<Policy>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    proposalPeriod!: number

    @Column_("int4", {nullable: false})
    bountyPayoutDelay!: number

    @Column_("int4", {nullable: false})
    bountyUpdatePeriod!: number

    @Column_("varchar", {length: 8, nullable: false})
    approveOriginType!: ApproveOriginType

    @Column_("int4", {array: true, nullable: false})
    approveOriginProportion!: (number)[]

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : fromJsonGovernance(obj)}, nullable: true})
    governance!: Governance | undefined | null
}
