import assert from "assert"
import * as marshal from "./marshal"
import {GovernanceKind} from "./_governanceKind"
import {ApproveOriginType} from "./_approveOriginType"

export class GovernanceV1 {
    public readonly isTypeOf = 'GovernanceV1'
    private _kind!: GovernanceKind
    private _enactmentPeriod!: bigint
    private _launchPeriod!: bigint
    private _votingPeriod!: bigint
    private _voteLockingPeriod!: bigint
    private _fastTrackVotingPeriod!: bigint
    private _cooloffPeriod!: bigint
    private _minimumDeposit!: bigint
    private _externalOrigin!: ApproveOriginType
    private _externalMajorityOrigin!: ApproveOriginType
    private _externalDefaultOrigin!: ApproveOriginType
    private _fastTrackOrigin!: ApproveOriginType
    private _instantOrigin!: ApproveOriginType
    private _instantAllowed!: boolean
    private _cancellationOrigin!: ApproveOriginType
    private _blacklistOrigin!: ApproveOriginType
    private _cancelProposalOrigin!: ApproveOriginType

    constructor(props?: Partial<Omit<GovernanceV1, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._kind = marshal.enumFromJson(json.kind, GovernanceKind)
            this._enactmentPeriod = marshal.bigint.fromJSON(json.enactmentPeriod)
            this._launchPeriod = marshal.bigint.fromJSON(json.launchPeriod)
            this._votingPeriod = marshal.bigint.fromJSON(json.votingPeriod)
            this._voteLockingPeriod = marshal.bigint.fromJSON(json.voteLockingPeriod)
            this._fastTrackVotingPeriod = marshal.bigint.fromJSON(json.fastTrackVotingPeriod)
            this._cooloffPeriod = marshal.bigint.fromJSON(json.cooloffPeriod)
            this._minimumDeposit = marshal.bigint.fromJSON(json.minimumDeposit)
            this._externalOrigin = marshal.enumFromJson(json.externalOrigin, ApproveOriginType)
            this._externalMajorityOrigin = marshal.enumFromJson(json.externalMajorityOrigin, ApproveOriginType)
            this._externalDefaultOrigin = marshal.enumFromJson(json.externalDefaultOrigin, ApproveOriginType)
            this._fastTrackOrigin = marshal.enumFromJson(json.fastTrackOrigin, ApproveOriginType)
            this._instantOrigin = marshal.enumFromJson(json.instantOrigin, ApproveOriginType)
            this._instantAllowed = marshal.boolean.fromJSON(json.instantAllowed)
            this._cancellationOrigin = marshal.enumFromJson(json.cancellationOrigin, ApproveOriginType)
            this._blacklistOrigin = marshal.enumFromJson(json.blacklistOrigin, ApproveOriginType)
            this._cancelProposalOrigin = marshal.enumFromJson(json.cancelProposalOrigin, ApproveOriginType)
        }
    }

    get kind(): GovernanceKind {
        assert(this._kind != null, 'uninitialized access')
        return this._kind
    }

    set kind(value: GovernanceKind) {
        this._kind = value
    }

    get enactmentPeriod(): bigint {
        assert(this._enactmentPeriod != null, 'uninitialized access')
        return this._enactmentPeriod
    }

    set enactmentPeriod(value: bigint) {
        this._enactmentPeriod = value
    }

    get launchPeriod(): bigint {
        assert(this._launchPeriod != null, 'uninitialized access')
        return this._launchPeriod
    }

    set launchPeriod(value: bigint) {
        this._launchPeriod = value
    }

    get votingPeriod(): bigint {
        assert(this._votingPeriod != null, 'uninitialized access')
        return this._votingPeriod
    }

    set votingPeriod(value: bigint) {
        this._votingPeriod = value
    }

    get voteLockingPeriod(): bigint {
        assert(this._voteLockingPeriod != null, 'uninitialized access')
        return this._voteLockingPeriod
    }

    set voteLockingPeriod(value: bigint) {
        this._voteLockingPeriod = value
    }

    get fastTrackVotingPeriod(): bigint {
        assert(this._fastTrackVotingPeriod != null, 'uninitialized access')
        return this._fastTrackVotingPeriod
    }

    set fastTrackVotingPeriod(value: bigint) {
        this._fastTrackVotingPeriod = value
    }

    get cooloffPeriod(): bigint {
        assert(this._cooloffPeriod != null, 'uninitialized access')
        return this._cooloffPeriod
    }

    set cooloffPeriod(value: bigint) {
        this._cooloffPeriod = value
    }

    get minimumDeposit(): bigint {
        assert(this._minimumDeposit != null, 'uninitialized access')
        return this._minimumDeposit
    }

    set minimumDeposit(value: bigint) {
        this._minimumDeposit = value
    }

    get externalOrigin(): ApproveOriginType {
        assert(this._externalOrigin != null, 'uninitialized access')
        return this._externalOrigin
    }

    set externalOrigin(value: ApproveOriginType) {
        this._externalOrigin = value
    }

    get externalMajorityOrigin(): ApproveOriginType {
        assert(this._externalMajorityOrigin != null, 'uninitialized access')
        return this._externalMajorityOrigin
    }

    set externalMajorityOrigin(value: ApproveOriginType) {
        this._externalMajorityOrigin = value
    }

    get externalDefaultOrigin(): ApproveOriginType {
        assert(this._externalDefaultOrigin != null, 'uninitialized access')
        return this._externalDefaultOrigin
    }

    set externalDefaultOrigin(value: ApproveOriginType) {
        this._externalDefaultOrigin = value
    }

    get fastTrackOrigin(): ApproveOriginType {
        assert(this._fastTrackOrigin != null, 'uninitialized access')
        return this._fastTrackOrigin
    }

    set fastTrackOrigin(value: ApproveOriginType) {
        this._fastTrackOrigin = value
    }

    get instantOrigin(): ApproveOriginType {
        assert(this._instantOrigin != null, 'uninitialized access')
        return this._instantOrigin
    }

    set instantOrigin(value: ApproveOriginType) {
        this._instantOrigin = value
    }

    get instantAllowed(): boolean {
        assert(this._instantAllowed != null, 'uninitialized access')
        return this._instantAllowed
    }

    set instantAllowed(value: boolean) {
        this._instantAllowed = value
    }

    get cancellationOrigin(): ApproveOriginType {
        assert(this._cancellationOrigin != null, 'uninitialized access')
        return this._cancellationOrigin
    }

    set cancellationOrigin(value: ApproveOriginType) {
        this._cancellationOrigin = value
    }

    get blacklistOrigin(): ApproveOriginType {
        assert(this._blacklistOrigin != null, 'uninitialized access')
        return this._blacklistOrigin
    }

    set blacklistOrigin(value: ApproveOriginType) {
        this._blacklistOrigin = value
    }

    get cancelProposalOrigin(): ApproveOriginType {
        assert(this._cancelProposalOrigin != null, 'uninitialized access')
        return this._cancelProposalOrigin
    }

    set cancelProposalOrigin(value: ApproveOriginType) {
        this._cancelProposalOrigin = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            kind: this.kind,
            enactmentPeriod: marshal.bigint.toJSON(this.enactmentPeriod),
            launchPeriod: marshal.bigint.toJSON(this.launchPeriod),
            votingPeriod: marshal.bigint.toJSON(this.votingPeriod),
            voteLockingPeriod: marshal.bigint.toJSON(this.voteLockingPeriod),
            fastTrackVotingPeriod: marshal.bigint.toJSON(this.fastTrackVotingPeriod),
            cooloffPeriod: marshal.bigint.toJSON(this.cooloffPeriod),
            minimumDeposit: marshal.bigint.toJSON(this.minimumDeposit),
            externalOrigin: this.externalOrigin,
            externalMajorityOrigin: this.externalMajorityOrigin,
            externalDefaultOrigin: this.externalDefaultOrigin,
            fastTrackOrigin: this.fastTrackOrigin,
            instantOrigin: this.instantOrigin,
            instantAllowed: this.instantAllowed,
            cancellationOrigin: this.cancellationOrigin,
            blacklistOrigin: this.blacklistOrigin,
            cancelProposalOrigin: this.cancelProposalOrigin,
        }
    }
}
