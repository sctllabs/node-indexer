import assert from "assert"
import * as marshal from "./marshal"

export class CreateBounty {
    public readonly isTypeOf = 'CreateBounty'
    private _daoId!: number
    private _value!: bigint
    private _description!: string

    constructor(props?: Partial<Omit<CreateBounty, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._daoId = marshal.int.fromJSON(json.daoId)
            this._value = marshal.bigint.fromJSON(json.value)
            this._description = marshal.string.fromJSON(json.description)
        }
    }

    get daoId(): number {
        assert(this._daoId != null, 'uninitialized access')
        return this._daoId
    }

    set daoId(value: number) {
        this._daoId = value
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
            daoId: this.daoId,
            value: marshal.bigint.toJSON(this.value),
            description: this.description,
        }
    }
}
