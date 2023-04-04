import assert from "assert"
import * as marshal from "./marshal"

export class CreateTokenBounty {
    public readonly isTypeOf = 'CreateTokenBounty'
    private _daoId!: number
    private _tokenId!: bigint | undefined | null
    private _value!: bigint
    private _description!: string

    constructor(props?: Partial<Omit<CreateTokenBounty, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._daoId = marshal.int.fromJSON(json.daoId)
            this._tokenId = json.tokenId == null ? undefined : marshal.bigint.fromJSON(json.tokenId)
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

    get tokenId(): bigint | undefined | null {
        return this._tokenId
    }

    set tokenId(value: bigint | undefined | null) {
        this._tokenId = value
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
            tokenId: this.tokenId == null ? undefined : marshal.bigint.toJSON(this.tokenId),
            value: marshal.bigint.toJSON(this.value),
            description: this.description,
        }
    }
}
