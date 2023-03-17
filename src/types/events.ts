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
        return this._chain.getEventHash('DaoCouncil.Proposed') === '10c51852d0d3873355ef40f3597f9724d47fbf1dc9f38ec3f4a956e13a864df8'
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

export class DaoCouncilMembersMemberAddedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoCouncilMembers.MemberAdded')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * The given member was added; see the transaction for who.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoCouncilMembers.MemberAdded') === 'afa6ba1a14465c0cacf97e93097d202040da51335eab28489474165e3254266a'
    }

    /**
     * The given member was added; see the transaction for who.
     */
    get asV100(): {daoId: number, member: Uint8Array} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoCouncilMembersMemberRemovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoCouncilMembers.MemberRemoved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * The given member was removed; see the transaction for who.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoCouncilMembers.MemberRemoved') === 'afa6ba1a14465c0cacf97e93097d202040da51335eab28489474165e3254266a'
    }

    /**
     * The given member was removed; see the transaction for who.
     */
    get asV100(): {daoId: number, member: Uint8Array} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoDemocracyCancelledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoDemocracy.Cancelled')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A referendum has been cancelled.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoDemocracy.Cancelled') === 'fd60262a82594b52e0d423cc5303ef96ce205982a5e1306310ff009c7a2928a6'
    }

    /**
     * A referendum has been cancelled.
     */
    get asV100(): {daoId: number, refIndex: number} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoDemocracyDelegatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoDemocracy.Delegated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * An account has delegated their vote to another account.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoDemocracy.Delegated') === '7690151ebe52185c57d7c6d812c8a8529f3c7c424abcf457eb5e6445378b7206'
    }

    /**
     * An account has delegated their vote to another account.
     */
    get asV100(): {daoId: number, who: Uint8Array, target: Uint8Array, conviction: v100.Conviction, balance: bigint} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoDemocracyNotPassedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoDemocracy.NotPassed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A proposal has been rejected by referendum.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoDemocracy.NotPassed') === 'fd60262a82594b52e0d423cc5303ef96ce205982a5e1306310ff009c7a2928a6'
    }

    /**
     * A proposal has been rejected by referendum.
     */
    get asV100(): {daoId: number, refIndex: number} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoDemocracyPassedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoDemocracy.Passed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A proposal has been approved by referendum.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoDemocracy.Passed') === 'fd60262a82594b52e0d423cc5303ef96ce205982a5e1306310ff009c7a2928a6'
    }

    /**
     * A proposal has been approved by referendum.
     */
    get asV100(): {daoId: number, refIndex: number} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoDemocracyProposedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoDemocracy.Proposed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A motion has been proposed by a public account.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoDemocracy.Proposed') === '6d1eca6b13fe15964804da74c2ead9ac59f95700d11b3e5753d657f613b4bd50'
    }

    /**
     * A motion has been proposed by a public account.
     */
    get asV100(): {daoId: number, account: Uint8Array, proposalIndex: number, proposal: v100.Call, deposit: bigint, meta: (Uint8Array | undefined)} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoDemocracySecondedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoDemocracy.Seconded')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * An account has secconded a proposal
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoDemocracy.Seconded') === '1217874cf1007e6c338b986ec21154b5366bb48c3b1379f558fb2b0e06d48ac4'
    }

    /**
     * An account has secconded a proposal
     */
    get asV100(): {daoId: number, seconder: Uint8Array, propIndex: number} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoDemocracyStartedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoDemocracy.Started')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A referendum has begun.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoDemocracy.Started') === 'aa06bad17472fd1377d0c624d87bbc4c7cd9c97ae2696578bdd40e578f067f5e'
    }

    /**
     * A referendum has begun.
     */
    get asV100(): {daoId: number, refIndex: number, propIndex: number, threshold: v100.VoteThreshold} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoDemocracyUndelegatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoDemocracy.Undelegated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * An account has cancelled a previous delegation operation.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoDemocracy.Undelegated') === '717ea835695d5be2c78ce1fc5dfd10ca96867fcfaf1b8cfcce8c70917f1b848b'
    }

    /**
     * An account has cancelled a previous delegation operation.
     */
    get asV100(): {daoId: number, account: Uint8Array, votes: number} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoDemocracyVotedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoDemocracy.Voted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * An account has voted in a referendum
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoDemocracy.Voted') === 'a1b602ed4f3d294f215c9dd0766baa1f8ed205723cfa88eaed4e5bc2d8372b2a'
    }

    /**
     * An account has voted in a referendum
     */
    get asV100(): {daoId: number, voter: Uint8Array, refIndex: number, vote: v100.Type_306} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}
