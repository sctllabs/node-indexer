import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v100 from './v100'
import * as v101 from './v101'
import * as v102 from './v102'
import * as v103 from './v103'
import * as v105 from './v105'
import * as v106 from './v106'
import * as v104 from './v104'

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

export class DaoDaoMetadataUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Dao.DaoMetadataUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV100(): boolean {
        return this._chain.getEventHash('Dao.DaoMetadataUpdated') === '316240825f9e0a2d87c00509c203827c3af971c5075c4354309bce1e97d2b003'
    }

    get asV100(): {daoId: number, metadata: Uint8Array} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoDaoPolicyUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Dao.DaoPolicyUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV100(): boolean {
        return this._chain.getEventHash('Dao.DaoPolicyUpdated') === 'b8e457cdd7826340581f9bb4e24f8d23b60a1c2115d2bfba9931edcc7c102780'
    }

    get asV100(): {daoId: number, policy: v100.DaoPolicy} {
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
        return this._chain.getEventHash('Dao.DaoRegistered') === 'b4c94312a7532011947e551e27d572d24551e2eed6882a7d98a1a88ba73df2af'
    }

    get asV100(): {daoId: number, founder: Uint8Array, accountId: Uint8Array, council: Uint8Array[], technicalCommittee: Uint8Array[], token: v100.DaoToken, config: v100.DaoConfig, policy: v100.DaoPolicy} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoDaoRemovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Dao.DaoRemoved')
        this._chain = ctx._chain
        this.event = event
    }

    get isV104(): boolean {
        return this._chain.getEventHash('Dao.DaoRemoved') === '337d3b1acd0d5290c1a00d10e7d66083cc16f3ad78075a88e5513f1c37ebb523'
    }

    get asV104(): {daoId: number} {
        assert(this.isV104)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoBountiesBountyAwardedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoBounties.BountyAwarded')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A bounty is awarded to a beneficiary.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoBounties.BountyAwarded') === '3aa06a4a9dd48250c490e1e7226c272815e4abd47956ef781fb6267389252ed7'
    }

    /**
     * A bounty is awarded to a beneficiary.
     */
    get asV100(): {daoId: number, index: number, beneficiary: Uint8Array, status: v100.BountyStatus} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoBountiesBountyBecameActiveEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoBounties.BountyBecameActive')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A bounty proposal is funded and became active.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoBounties.BountyBecameActive') === '1859f0642c00a9ae17638121a832ec8f57514348b69ffa7f2b56152ae70656b4'
    }

    /**
     * A bounty proposal is funded and became active.
     */
    get asV100(): {daoId: number, index: number, status: v100.BountyStatus} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoBountiesBountyCanceledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoBounties.BountyCanceled')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A bounty is cancelled.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoBounties.BountyCanceled') === '1c8b8b74eff9636a99f12a72bbe8264b3ebf1177cf9a8591fe0f376074b55f19'
    }

    /**
     * A bounty is cancelled.
     */
    get asV100(): {daoId: number, index: number} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoBountiesBountyClaimedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoBounties.BountyClaimed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A bounty is claimed by beneficiary.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoBounties.BountyClaimed') === '090975e3f0d5f7f70ae7b8725f446a5c3a28e93af6c47584615e04dd0c3d9f40'
    }

    /**
     * A bounty is claimed by beneficiary.
     */
    get asV100(): {daoId: number, index: number, payout: bigint, beneficiary: Uint8Array} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoBountiesBountyCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoBounties.BountyCreated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * New bounty proposal.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoBounties.BountyCreated') === '3a7cfd24eb009cc94e43618beeab5954dc4936b3b68e554c8717328119dd9828'
    }

    /**
     * New bounty proposal.
     */
    get asV100(): {daoId: number, index: number, status: v100.BountyStatus, description: Uint8Array, value: bigint, tokenId: (bigint | undefined)} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoBountiesBountyCuratorAcceptedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoBounties.BountyCuratorAccepted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A curator is accepted for bounty.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoBounties.BountyCuratorAccepted') === '1859f0642c00a9ae17638121a832ec8f57514348b69ffa7f2b56152ae70656b4'
    }

    /**
     * A curator is accepted for bounty.
     */
    get asV100(): {daoId: number, index: number, status: v100.BountyStatus} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoBountiesBountyCuratorProposedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoBounties.BountyCuratorProposed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A curator is proposed for bounty.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoBounties.BountyCuratorProposed') === '1f36c76fb82bcb84a35dffc1d34fd161bad5787c23746509187c682d74600c6e'
    }

    /**
     * A curator is proposed for bounty.
     */
    get asV100(): {daoId: number, index: number, fee: bigint, status: v100.BountyStatus} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoBountiesBountyCuratorUnassignedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoBounties.BountyCuratorUnassigned')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A curator is unassigned from bounty.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoBounties.BountyCuratorUnassigned') === '1859f0642c00a9ae17638121a832ec8f57514348b69ffa7f2b56152ae70656b4'
    }

    /**
     * A curator is unassigned from bounty.
     */
    get asV100(): {daoId: number, index: number, status: v100.BountyStatus} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoBountiesBountyExtendedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoBounties.BountyExtended')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A bounty expiry is extended.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoBounties.BountyExtended') === 'e9eeb18bd16c99d284e1226ac648eaca22e47eb332014e2aee7bcf6e57fdf7ba'
    }

    /**
     * A bounty expiry is extended.
     */
    get asV100(): {daoId: number, index: number, updateDue: number} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoBountiesDaoPurgedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoBounties.DaoPurged')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Purged DAO related storage data
     */
    get isV104(): boolean {
        return this._chain.getEventHash('DaoBounties.DaoPurged') === '337d3b1acd0d5290c1a00d10e7d66083cc16f3ad78075a88e5513f1c37ebb523'
    }

    /**
     * Purged DAO related storage data
     */
    get asV104(): {daoId: number} {
        assert(this.isV104)
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

export class DaoCouncilDaoPurgedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoCouncil.DaoPurged')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Purged DAO related storage data
     */
    get isV104(): boolean {
        return this._chain.getEventHash('DaoCouncil.DaoPurged') === '337d3b1acd0d5290c1a00d10e7d66083cc16f3ad78075a88e5513f1c37ebb523'
    }

    /**
     * Purged DAO related storage data
     */
    get asV104(): {daoId: number} {
        assert(this.isV104)
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
    get asV100(): {daoId: number, proposalIndex: number, proposalHash: Uint8Array, result: v100.Type_41} {
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
        return this._chain.getEventHash('DaoCouncil.Proposed') === '229bb1cc81fe18351b574843a13d4735d605faea0cacd13dde5736748295b5c4'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold (given
     * `MemberCount`).
     */
    get asV100(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v100.Call, threshold: number, meta: (Uint8Array | undefined)} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold (given
     * `MemberCount`).
     */
    get isV101(): boolean {
        return this._chain.getEventHash('DaoCouncil.Proposed') === 'cf9b756a1d45ec9ccecee5d306336b653b988109805d1192cee17c5022d17e8d'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold (given
     * `MemberCount`).
     */
    get asV101(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v101.Call, threshold: number, meta: (Uint8Array | undefined)} {
        assert(this.isV101)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold (given
     * `MemberCount`).
     */
    get isV102(): boolean {
        return this._chain.getEventHash('DaoCouncil.Proposed') === '83dd8da6c09d810a8163d3ffcc35ec20b0f1440a260bd4b1c93445e2cf835ac8'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold (given
     * `MemberCount`).
     */
    get asV102(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v102.Call, threshold: number, meta: (Uint8Array | undefined)} {
        assert(this.isV102)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold (given
     * `MemberCount`).
     */
    get isV103(): boolean {
        return this._chain.getEventHash('DaoCouncil.Proposed') === 'b4c50bb597f6b0aa9d78d32c6b48f1c835823ce81b982f0f31e5dd358c1f8656'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold (given
     * `MemberCount`).
     */
    get asV103(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v103.Call, threshold: number, meta: (Uint8Array | undefined)} {
        assert(this.isV103)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold (given
     * `MemberCount`).
     */
    get isV104(): boolean {
        return this._chain.getEventHash('DaoCouncil.Proposed') === 'f6efad43b62de76f72b85e7e687f1b0acd00b5f93b1a38860bd6d407160cbfc8'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold (given
     * `MemberCount`).
     */
    get asV104(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v104.Call, threshold: number, meta: (Uint8Array | undefined)} {
        assert(this.isV104)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold (given
     * `MemberCount`).
     */
    get isV105(): boolean {
        return this._chain.getEventHash('DaoCouncil.Proposed') === 'b7abfea0b403f8a54b45bc3f8a4595156ddf4d013fc046f3f665c388d2581086'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold (given
     * `MemberCount`).
     */
    get asV105(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v105.Call, threshold: number, meta: (Uint8Array | undefined)} {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold (given
     * `MemberCount`).
     */
    get isV106(): boolean {
        return this._chain.getEventHash('DaoCouncil.Proposed') === '83cecd63e202aa5508e301ad64a80fdd1e858ac8cdffd9a7a3b1b661bc71ae2c'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold (given
     * `MemberCount`).
     */
    get asV106(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v106.Call, threshold: number, meta: (Uint8Array | undefined)} {
        assert(this.isV106)
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

export class DaoDemocracyDaoPurgedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoDemocracy.DaoPurged')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Purged DAO related storage data
     */
    get isV104(): boolean {
        return this._chain.getEventHash('DaoDemocracy.DaoPurged') === '337d3b1acd0d5290c1a00d10e7d66083cc16f3ad78075a88e5513f1c37ebb523'
    }

    /**
     * Purged DAO related storage data
     */
    get asV104(): {daoId: number} {
        assert(this.isV104)
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
        return this._chain.getEventHash('DaoDemocracy.Proposed') === '670d6a12280c9940e01bd18123abcc2c818e4d1ac079def8b67f2680e23fa470'
    }

    /**
     * A motion has been proposed by a public account.
     */
    get asV100(): {daoId: number, account: Uint8Array, proposalIndex: number, proposal: v100.Call, deposit: bigint, meta: (Uint8Array | undefined)} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion has been proposed by a public account.
     */
    get isV101(): boolean {
        return this._chain.getEventHash('DaoDemocracy.Proposed') === 'aed348c96d3e27593e59a5fcf2406e1e03b5a2765c8442d4e780e8574557dc66'
    }

    /**
     * A motion has been proposed by a public account.
     */
    get asV101(): {daoId: number, account: Uint8Array, proposalIndex: number, proposal: v101.Call, deposit: bigint, meta: (Uint8Array | undefined)} {
        assert(this.isV101)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion has been proposed by a public account.
     */
    get isV102(): boolean {
        return this._chain.getEventHash('DaoDemocracy.Proposed') === '65fe8aa220122f1311bc7c1f04dbc0c217a1c5d9f51b61126756cc602ec81062'
    }

    /**
     * A motion has been proposed by a public account.
     */
    get asV102(): {daoId: number, account: Uint8Array, proposalIndex: number, proposal: v102.Call, deposit: bigint, meta: (Uint8Array | undefined)} {
        assert(this.isV102)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion has been proposed by a public account.
     */
    get isV103(): boolean {
        return this._chain.getEventHash('DaoDemocracy.Proposed') === 'eed6745563520020d35a0b580b7992086938efdac3e4cc883565fce7a30e0fe4'
    }

    /**
     * A motion has been proposed by a public account.
     */
    get asV103(): {daoId: number, account: Uint8Array, proposalIndex: number, proposal: v103.Call, deposit: bigint, meta: (Uint8Array | undefined)} {
        assert(this.isV103)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion has been proposed by a public account.
     */
    get isV104(): boolean {
        return this._chain.getEventHash('DaoDemocracy.Proposed') === 'b6a537054fa2ed91a7abceefee6c0e409caa7974fb0be5bdca9f1606822dd6dc'
    }

    /**
     * A motion has been proposed by a public account.
     */
    get asV104(): {daoId: number, account: Uint8Array, proposalIndex: number, proposal: v104.Call, deposit: bigint, meta: (Uint8Array | undefined)} {
        assert(this.isV104)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion has been proposed by a public account.
     */
    get isV105(): boolean {
        return this._chain.getEventHash('DaoDemocracy.Proposed') === '347986980e82663261f6ec73d4856586c7d4cd04010f35b65aa0e6ca16d9de47'
    }

    /**
     * A motion has been proposed by a public account.
     */
    get asV105(): {daoId: number, account: Uint8Array, proposalIndex: number, proposal: v105.Call, deposit: bigint, meta: (Uint8Array | undefined)} {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion has been proposed by a public account.
     */
    get isV106(): boolean {
        return this._chain.getEventHash('DaoDemocracy.Proposed') === 'a92c1ea0399949cff83726d614df1a7830d7895cd6e152caee8435c99fcf2400'
    }

    /**
     * A motion has been proposed by a public account.
     */
    get asV106(): {daoId: number, account: Uint8Array, proposalIndex: number, proposal: v106.Call, deposit: bigint, meta: (Uint8Array | undefined)} {
        assert(this.isV106)
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
    get asV100(): {daoId: number, voter: Uint8Array, refIndex: number, vote: v100.Type_305} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoEthGovernanceApprovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoEthGovernance.Approved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A motion was approved by the required threshold.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoEthGovernance.Approved') === '66116e5e87427f0f23eab3119f627b9a718d060e11063fd891936b7078e661c7'
    }

    /**
     * A motion was approved by the required threshold.
     */
    get asV100(): {daoId: number, proposalIndex: number, proposalHash: Uint8Array} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoEthGovernanceClosedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoEthGovernance.Closed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A proposal was closed because its threshold was reached or after its duration was up.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoEthGovernance.Closed') === '14272fd3c3c5fe6141f8c969952d76f50b120d82dae963d28e38d1bcb9e3115b'
    }

    /**
     * A proposal was closed because its threshold was reached or after its duration was up.
     */
    get asV100(): {daoId: number, proposalIndex: number, proposalHash: Uint8Array, ayes: bigint, nays: bigint} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoEthGovernanceDaoPurgedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoEthGovernance.DaoPurged')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Purged DAO related storage data
     */
    get isV104(): boolean {
        return this._chain.getEventHash('DaoEthGovernance.DaoPurged') === '337d3b1acd0d5290c1a00d10e7d66083cc16f3ad78075a88e5513f1c37ebb523'
    }

    /**
     * Purged DAO related storage data
     */
    get asV104(): {daoId: number} {
        assert(this.isV104)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoEthGovernanceDisapprovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoEthGovernance.Disapproved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A motion was not approved by the required threshold.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoEthGovernance.Disapproved') === '66116e5e87427f0f23eab3119f627b9a718d060e11063fd891936b7078e661c7'
    }

    /**
     * A motion was not approved by the required threshold.
     */
    get asV100(): {daoId: number, proposalIndex: number, proposalHash: Uint8Array} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoEthGovernanceExecutedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoEthGovernance.Executed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A motion was executed; result will be `Ok` if it returned without error.
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoEthGovernance.Executed') === 'd61e1e1db4a2f11e48bf202815707b3fdedce32a9b7b421eaac2353af3d0730e'
    }

    /**
     * A motion was executed; result will be `Ok` if it returned without error.
     */
    get asV100(): {daoId: number, proposalIndex: number, proposalHash: Uint8Array, result: v100.Type_41} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoEthGovernanceProposedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoEthGovernance.Proposed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoEthGovernance.Proposed') === '661870a288fa5cbebeb900f4c07a2c9e1e8686acfd1ea19c455a4cf80c9040fb'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold
     */
    get asV100(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v100.Call, blockNumber: number, threshold: bigint, meta: Uint8Array} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold
     */
    get isV101(): boolean {
        return this._chain.getEventHash('DaoEthGovernance.Proposed') === '5e172a5c44418ef201835ce4914cb8ca13a2398a3cc3e02455f494b01140fa7f'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold
     */
    get asV101(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v101.Call, blockNumber: number, threshold: bigint, meta: Uint8Array} {
        assert(this.isV101)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold
     */
    get isV102(): boolean {
        return this._chain.getEventHash('DaoEthGovernance.Proposed') === 'c7bc79555558b0f2a71d5614579dccd7a8067fc1523b6a2cb1e5679d74259fe3'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold
     */
    get asV102(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v102.Call, blockNumber: number, threshold: bigint, meta: Uint8Array} {
        assert(this.isV102)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold
     */
    get isV103(): boolean {
        return this._chain.getEventHash('DaoEthGovernance.Proposed') === '3b44f7945adddf9468635844982e6b575bf8495132441a11a56213112e1fe413'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold
     */
    get asV103(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v103.Call, blockNumber: number, threshold: bigint, meta: Uint8Array} {
        assert(this.isV103)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold
     */
    get isV104(): boolean {
        return this._chain.getEventHash('DaoEthGovernance.Proposed') === 'e77b5819c8abbd6dc04a0d3649d3bf4411d87ff283ed13058d08d8d85a196a8b'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold
     */
    get asV104(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v104.Call, blockNumber: number, threshold: bigint, meta: Uint8Array} {
        assert(this.isV104)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold
     */
    get isV105(): boolean {
        return this._chain.getEventHash('DaoEthGovernance.Proposed') === '2174cf8e8a44f334dae9ae10a956322b85efa90cae315034b6c6b5735a16a497'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold
     */
    get asV105(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v105.Call, blockNumber: number, threshold: bigint, meta: Uint8Array} {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold
     */
    get isV106(): boolean {
        return this._chain.getEventHash('DaoEthGovernance.Proposed') === '8f0b5259ff000eecd212185bcdddcb57188f888ee4e5c9ba78cb20964638bf9a'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold
     */
    get asV106(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v106.Call, blockNumber: number, threshold: bigint, meta: Uint8Array} {
        assert(this.isV106)
        return this._chain.decodeEvent(this.event)
    }
}

export class DaoEthGovernanceVotedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'DaoEthGovernance.Voted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A motion (given hash) has been voted on by given account, leaving
     * a tally (yes votes and no votes given respectively as `TokenSupply`).
     */
    get isV100(): boolean {
        return this._chain.getEventHash('DaoEthGovernance.Voted') === 'fdf8deae54bfef4c6c37c37b0b9937922705b3c7a365ac9ac293bb932c585419'
    }

    /**
     * A motion (given hash) has been voted on by given account, leaving
     * a tally (yes votes and no votes given respectively as `TokenSupply`).
     */
    get asV100(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, vote: v100.Vote} {
        assert(this.isV100)
        return this._chain.decodeEvent(this.event)
    }
}
