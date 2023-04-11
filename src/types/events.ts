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
        return this._chain.getEventHash('Dao.DaoRegistered') === 'b4c94312a7532011947e551e27d572d24551e2eed6882a7d98a1a88ba73df2af'
    }

    get asV100(): {daoId: number, founder: Uint8Array, accountId: Uint8Array, council: Uint8Array[], technicalCommittee: Uint8Array[], token: v100.DaoToken, config: v100.DaoConfig, policy: v100.DaoPolicy} {
        assert(this.isV100)
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
        return this._chain.getEventHash('DaoCouncil.Proposed') === 'fa9187c2b3b9176a5828fc0384eb9c14df26c6bc4c7ecdb7adfcf51c259e34d5'
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
        return this._chain.getEventHash('DaoDemocracy.Proposed') === '72d4d43199d0045c5fbbf9cfa3ce9eadb69cf675a45496aadc6fb4bb199be2cd'
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
    get asV100(): {daoId: number, voter: Uint8Array, refIndex: number, vote: v100.Type_283} {
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
        return this._chain.getEventHash('DaoEthGovernance.Proposed') === '763d9e76c31bb49d2f985ef16cf8ca5a52a0e3a1cfb8c5c31dc7957e3dd2446f'
    }

    /**
     * A motion (given hash) has been proposed (by given account) with a threshold
     */
    get asV100(): {daoId: number, account: Uint8Array, proposalIndex: number, proposalHash: Uint8Array, proposal: v100.Call, blockNumber: number, threshold: bigint, meta: Uint8Array} {
        assert(this.isV100)
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
