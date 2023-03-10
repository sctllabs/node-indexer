import assert from "assert"
import * as marshal from "./marshal"
import {Conviction} from "./_conviction"

export class DemocracyDelegationItem {
    private _account!: string
    private _lockedBalance!: bigint
    private _conviction!: Conviction | undefined | null

    constructor(props?: Partial<Omit<DemocracyDelegationItem, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._account = marshal.string.fromJSON(json.account)
            this._lockedBalance = marshal.bigint.fromJSON(json.lockedBalance)
            this._conviction = json.conviction == null ? undefined : marshal.enumFromJson(json.conviction, Conviction)
        }
    }

    get account(): string {
        assert(this._account != null, 'uninitialized access')
        return this._account
    }

    set account(value: string) {
        this._account = value
    }

    get lockedBalance(): bigint {
        assert(this._lockedBalance != null, 'uninitialized access')
        return this._lockedBalance
    }

    set lockedBalance(value: bigint) {
        this._lockedBalance = value
    }

    get conviction(): Conviction | undefined | null {
        return this._conviction
    }

    set conviction(value: Conviction | undefined | null) {
        this._conviction = value
    }

    toJSON(): object {
        return {
            account: this.account,
            lockedBalance: marshal.bigint.toJSON(this.lockedBalance),
            conviction: this.conviction,
        }
    }
}
