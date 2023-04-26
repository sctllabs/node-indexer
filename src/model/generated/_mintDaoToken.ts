import assert from "assert"
import * as marshal from "./marshal"

export class MintDaoToken {
    public readonly isTypeOf = 'MintDaoToken'
    private _daoId!: number
    private _amount!: bigint | undefined | null

    constructor(props?: Partial<Omit<MintDaoToken, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._daoId = marshal.int.fromJSON(json.daoId)
            this._amount = json.amount == null ? undefined : marshal.bigint.fromJSON(json.amount)
        }
    }

    get daoId(): number {
        assert(this._daoId != null, 'uninitialized access')
        return this._daoId
    }

    set daoId(value: number) {
        this._daoId = value
    }

    get amount(): bigint | undefined | null {
        return this._amount
    }

    set amount(value: bigint | undefined | null) {
        this._amount = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            daoId: this.daoId,
            amount: this.amount == null ? undefined : marshal.bigint.toJSON(this.amount),
        }
    }
}
