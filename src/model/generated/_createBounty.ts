import assert from "assert"
import * as marshal from "./marshal"

export class CreateBounty {
    public readonly isTypeOf = 'CreateBounty'
    private _value!: bigint
    private _description!: string

    constructor(props?: Partial<Omit<CreateBounty, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._value = marshal.bigint.fromJSON(json.value)
            this._description = marshal.string.fromJSON(json.description)
        }
    }

    get value(): bigint {
        assert(this._value != null, 'uninitialized access')
        return this._value
    }

    set value(value: bigint) {
        this._value = value
    }

    get description(): string {
        assert(this._description != null, 'uninitialized access')
        return this._description
    }

    set description(value: string) {
        this._description = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            value: marshal.bigint.toJSON(this.value),
            description: this.description,
        }
    }
}
