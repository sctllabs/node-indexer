import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v100 from './v100'

export class AssetsMetadataSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Assets.MetadataSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * New metadata has been set for an asset.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('Assets.MetadataSet') === '01ab9e31f40d9a1871985e1d4fa0e5b8324a517e9a5d954999b54e728d81b541'
    }

    /**
     * New metadata has been set for an asset.
     */
    get asV100(): {assetId: bigint, name: Uint8Array, symbol: Uint8Array, decimals: number, isFrozen: boolean} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoDaoRegisteredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Dao.DaoRegistered')
        this._chain = ctx._chain
        this.event = event
    }

    get isV100(): boolean {
        return this._chain.getEventHash('Dao.DaoRegistered') === 'd0355a019f331abde8d4fa84a03e150fd2da637a2d1f60a6ecce59df973577f2'
    }

    get asV100(): {daoId: number, founder: Uint8Array, accountId: Uint8Array, council: Uint8Array[], technicalCommittee: Uint8Array[], token: v100.DaoToken, config: v100.DaoConfig, policy: v100.DaoPolicy} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoCouncilApprovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoCouncil.Approved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A motion was approved by the required threshold.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoCouncil.Approved') === '66116e5e87427f0f23eab3119f627b9a718d060e11063fd891936b7078e661c7'
    }

    /**
     * A motion was approved by the required threshold.
     */
    get asV100(): {daoId: number, proposalIndex: number, proposalHash: Uint8Array} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoCouncilClosedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoCouncil.Closed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A proposal was closed because its threshold was reached or after its duration was up.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoCouncil.Closed') === '2aab0b4e98d9baee0f0f558d8c8acbe398fcff3c871aea51930c1fc3de497a6d'
    }

    /**
     * A proposal was closed because its threshold was reached or after its duration was up.
     */
    get asV100(): {daoId: number, proposalIndex: number, proposalHash: Uint8Array, yes: number, no: number} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoCouncilDisapprovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoCouncil.Disapproved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A motion was not approved by the required threshold.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoCouncil.Disapproved') === '66116e5e87427f0f23eab3119f627b9a718d060e11063fd891936b7078e661c7'
    }

    /**
     * A motion was not approved by the required threshold.
     */
    get asV100(): {daoId: number, proposalIndex: number, proposalHash: Uint8Array} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoCouncilExecutedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoCouncil.Executed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A motion was executed; result will be `Ok` if it returned without error.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoCouncil.Executed') === 'd61e1e1db4a2f11e48bf202815707b3fdedce32a9b7b421eaac2353af3d0730e'
    }

    /**
     * A motion was executed; result will be `Ok` if it returned without error.
     */
    get asV100(): {daoId: number, proposalIndex: number, proposalHash: Uint8Array, result: v100.Type_39} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoCouncilProposedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoCouncil.Proposed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold (given
     * `MemberCount`).
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoCouncil.Proposed') === '996c2d558f181bdefd2760d7fa223806623a584f72409a5d0f4c4caf4954f175'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold (given
     * `MemberCount`).
     */
    get asV100(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v100.Call, threshold: number, meta: (Uint8Array | undefined)} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoCouncilVotedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoCouncil.Voted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A motion (given hash) has been voted on by given account, leaving
     * a tally (yes votes and no votes given respectively as `MemberCount`).
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoCouncil.Voted') === '8769a95fd923611bc64bc2b84595715b90ea42b121b0cd06bcba28074b5791ac'
    }

    /**
     * A motion (given hash) has been voted on by given account, leaving
     * a tally (yes votes and no votes given respectively as `MemberCount`).
     */
    get asV100(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, voted: boolean, yes: number, no: number} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}
