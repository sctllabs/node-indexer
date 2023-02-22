import assert from "assert"
import * as marshal from "./marshal"

export class DemocracyReferendum {
    private _id!: string
    private _voteThreshold!: number

    constructor(props?: Partial<Omit<DemocracyReferendum, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._id = marshal.id.fromJSON(json.id)
            this._voteThreshold = marshal.int.fromJSON(json.voteThreshold)
        }
    }

    get id(): string {
        assert(this._id != null, 'uninitialized access')
        return this._id
    }

    set id(value: string) {
        this._id = value
    }

    get voteThreshold(): number {
        assert(this._voteThreshold != null, 'uninitialized access')
        return this._voteThreshold
    }

    set voteThreshold(value: number) {
        this._voteThreshold = value
    }

    toJSON(): object {
        return {
            id: this.id,
            voteThreshold: this.voteThreshold,
        }
    }
}
