import assert from "assert"
import * as marshal from "./marshal"

export class UpdateDaoMetadata {
    public readonly isTypeOf = 'UpdateDaoMetadata'
    private _daoId!: number
    private _metadata!: string

    constructor(props?: Partial<Omit<UpdateDaoMetadata, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._daoId = marshal.int.fromJSON(json.daoId)
            this._metadata = marshal.string.fromJSON(json.metadata)
        }
    }

    get daoId(): number {
        assert(this._daoId != null, 'uninitialized access')
        return this._daoId
    }

    set daoId(value: number) {
        this._daoId = value
    }

    get metadata(): string {
        assert(this._metadata != null, 'uninitialized access')
        return this._metadata
    }

    set metadata(value: string) {
        this._metadata = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            daoId: this.daoId,
            metadata: this.metadata,
        }
    }
}
