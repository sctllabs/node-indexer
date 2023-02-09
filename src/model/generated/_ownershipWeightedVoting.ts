import assert from "assert"
import * as marshal from "./marshal"
import {GovernanceKind} from "./_governanceKind"

export class OwnershipWeightedVoting {
    public readonly isTypeOf = 'OwnershipWeightedVoting'
    private _kind!: GovernanceKind

    constructor(props?: Partial<Omit<OwnershipWeightedVoting, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._kind = marshal.enumFromJson(json.kind, GovernanceKind)
        }
    }

    get kind(): GovernanceKind {
        assert(this._kind != null, 'uninitialized access')
        return this._kind
    }

    set kind(value: GovernanceKind) {
        this._kind = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            kind: this.kind,
        }
    }
}
