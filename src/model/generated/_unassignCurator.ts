import assert from "assert"
import * as marshal from "./marshal"

export class UnassignCurator {
    public readonly isTypeOf = 'UnassignCurator'
    private _daoId!: number
    private _bountyId!: number

    constructor(props?: Partial<Omit<UnassignCurator, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._daoId = marshal.int.fromJSON(json.daoId)
            this._bountyId = marshal.int.fromJSON(json.bountyId)
        }
    }

    get daoId(): number {
        assert(this._daoId != null, 'uninitialized access')
        return this._daoId
    }

    set daoId(value: number) {
        this._daoId = value
    }

    get bountyId(): number {
        assert(this._bountyId != null, 'uninitialized access')
        return this._bountyId
    }

    set bountyId(value: number) {
        this._bountyId = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            daoId: this.daoId,
            bountyId: this.bountyId,
        }
    }
}
