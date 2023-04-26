import assert from "assert"
import * as marshal from "./marshal"

export class UpdateDaoPolicy {
    public readonly isTypeOf = 'UpdateDaoPolicy'
    private _daoId!: number
    private _policy!: string

    constructor(props?: Partial<Omit<UpdateDaoPolicy, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._daoId = marshal.int.fromJSON(json.daoId)
            this._policy = marshal.string.fromJSON(json.policy)
        }
    }

    get daoId(): number {
        assert(this._daoId != null, 'uninitialized access')
        return this._daoId
    }

    set daoId(value: number) {
        this._daoId = value
    }

    get policy(): string {
        assert(this._policy != null, 'uninitialized access')
        return this._policy
    }

    set policy(value: string) {
        this._policy = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            daoId: this.daoId,
            policy: this.policy,
        }
    }
}
