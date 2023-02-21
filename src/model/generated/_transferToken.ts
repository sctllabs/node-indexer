import assert from "assert"
import * as marshal from "./marshal"

export class TransferToken {
    public readonly isTypeOf = 'TransferToken'
    private _amount!: bigint
    private _beneficiary!: string

    constructor(props?: Partial<Omit<TransferToken, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._amount = marshal.bigint.fromJSON(json.amount)
            this._beneficiary = marshal.string.fromJSON(json.beneficiary)
        }
    }

    get amount(): bigint {
        assert(this._amount != null, 'uninitialized access')
        return this._amount
    }

    set amount(value: bigint) {
        this._amount = value
    }

    get beneficiary(): string {
        assert(this._beneficiary != null, 'uninitialized access')
        return this._beneficiary
    }

    set beneficiary(value: string) {
        this._beneficiary = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            amount: marshal.bigint.toJSON(this.amount),
            beneficiary: this.beneficiary,
        }
    }
}
