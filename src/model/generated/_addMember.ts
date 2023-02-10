import assert from "assert"
import * as marshal from "./marshal"
import {Account} from "./account.model"

export class AddMember {
    public readonly isTypeOf = 'AddMember'
    private _who!: string

    constructor(props?: Partial<Omit<AddMember, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._who = marshal.string.fromJSON(json.who)
        }
    }

    get who(): string {
        assert(this._who != null, 'uninitialized access')
        return this._who
    }

    set who(value: string) {
        this._who = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            who: this.who,
        }
    }
}
