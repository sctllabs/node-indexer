import assert from "assert"
import * as marshal from "./marshal"

export class ProposeCurator {
    public readonly isTypeOf = 'ProposeCurator'
    private _bountyId!: number
    private _curator!: string
    private _fee!: bigint | undefined | null

    constructor(props?: Partial<Omit<ProposeCurator, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._bountyId = marshal.int.fromJSON(json.bountyId)
            this._curator = marshal.string.fromJSON(json.curator)
            this._fee = json.fee == null ? undefined : marshal.bigint.fromJSON(json.fee)
        }
    }

    get bountyId(): number {
        assert(this._bountyId != null, 'uninitialized access')
        return this._bountyId
    }

    set bountyId(value: number) {
        this._bountyId = value
    }

    get curator(): string {
        assert(this._curator != null, 'uninitialized access')
        return this._curator
    }

    set curator(value: string) {
        this._curator = value
    }

    get fee(): bigint | undefined | null {
        return this._fee
    }

    set fee(value: bigint | undefined | null) {
        this._fee = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            bountyId: this.bountyId,
            curator: this.curator,
            fee: this.fee == null ? undefined : marshal.bigint.toJSON(this.fee),
        }
    }
}
