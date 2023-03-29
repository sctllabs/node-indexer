import type { EventInfo, EventsInfo, EventType } from "../types";
import type { Ctx, Item } from "../processor";
import {
  DaoBountiesBountyAwardedEvent,
  DaoBountiesBountyBecameActiveEvent,
  DaoBountiesBountyCanceledEvent,
  DaoBountiesBountyClaimedEvent,
  DaoBountiesBountyCreatedEvent,
  DaoBountiesBountyCuratorAcceptedEvent,
  DaoBountiesBountyCuratorProposedEvent,
  DaoBountiesBountyCuratorUnassignedEvent,
  DaoBountiesBountyExtendedEvent,
  AssetsMetadataSetEvent,
  DaoCouncilApprovedEvent,
  DaoCouncilClosedEvent,
  DaoCouncilDisapprovedEvent,
  DaoCouncilExecutedEvent,
  DaoCouncilMembersMemberAddedEvent,
  DaoCouncilMembersMemberRemovedEvent,
  DaoCouncilProposedEvent,
  DaoCouncilVotedEvent,
  DaoDaoRegisteredEvent,
  DaoDemocracyCancelledEvent,
  DaoDemocracyDelegatedEvent,
  DaoDemocracyNotPassedEvent,
  DaoDemocracyPassedEvent,
  DaoDemocracyProposedEvent,
  DaoDemocracySecondedEvent,
  DaoDemocracyStartedEvent,
  DaoDemocracyUndelegatedEvent,
  DaoDemocracyVotedEvent,
} from "../types/events";
import { DaoHandler } from "./daoHandler";
import { FungibleTokenHandler } from "./fungibleTokenHandler";
import { AccountHandler } from "./accountHandler";
import { CouncilMembersEventHandler } from "./councilMembersEventHandler";
import { CouncilProposalHandler } from "./councilProposalHandler";
import {
  Account,
  Bounty,
  CouncilProposal,
  CouncilVoteHistory,
  Dao,
  DemocracyProposal,
  DemocracyReferendum,
  DemocracySecond,
  FungibleToken,
} from "../model";
import { CouncilVoteHandler } from "./councilVoteHandler";
import { DemocracyProposalHandler } from "./democracyProposalHandler";
import { DemocracyReferendumHandler } from "./democracyReferendumHandler";
import { DemocracySecondHandler } from "./democracySecondHandler";
import { BountyHandler } from "./bountyHandler";

export class EventHandler {
  private readonly _ctx: Ctx;
  private readonly _events: EventsInfo;
  private readonly _accountHandler: AccountHandler;
  private readonly _daoHandler: DaoHandler;
  private readonly _fungibleTokenHandler: FungibleTokenHandler;
  private readonly _councilMembersEventHandler: CouncilMembersEventHandler;
  private readonly _councilProposalHandler: CouncilProposalHandler;
  private readonly _councilVoteHandler: CouncilVoteHandler;
  private readonly _democracyProposalHandler: DemocracyProposalHandler;
  private readonly _democracyReferendumHandler: DemocracyReferendumHandler;
  private readonly _democracySecondHandler: DemocracySecondHandler;
  private readonly _bountyHandler: BountyHandler;

  constructor(ctx: Ctx) {
    this._ctx = ctx;
    this._events = [];
    this._daoHandler = new DaoHandler(ctx);
    this._fungibleTokenHandler = new FungibleTokenHandler(ctx);
    this._accountHandler = new AccountHandler(ctx);
    this._councilMembersEventHandler = new CouncilMembersEventHandler(ctx);
    this._councilProposalHandler = new CouncilProposalHandler(ctx);
    this._councilVoteHandler = new CouncilVoteHandler(ctx);
    this._democracyProposalHandler = new DemocracyProposalHandler(ctx);
    this._democracyReferendumHandler = new DemocracyReferendumHandler(ctx);
    this._democracySecondHandler = new DemocracySecondHandler(ctx);
    this._bountyHandler = new BountyHandler(ctx);
  }

  async process() {
    this.processEvents();
    const data = await this.queryData();
    this.mapData(data);
    this.processData();
    await this.saveData();
  }

  private async saveData() {
    await this._accountHandler.save();
    await this._fungibleTokenHandler.insert();
    await this._daoHandler.insertPolicies();
    await this._daoHandler.insertDaos();
    await this._councilProposalHandler.insert();
    await this._democracyProposalHandler.insert();
    await this._councilVoteHandler.insert();
    await this._democracyReferendumHandler.insert();
    await this._democracySecondHandler.insert();
    await this._bountyHandler.insert();

    await this._councilProposalHandler.save();
    await this._democracyProposalHandler.save();
    await this._daoHandler.save();
    await this._councilVoteHandler.save();
    await this._democracyReferendumHandler.save();
    await this._democracySecondHandler.save();
    await this._bountyHandler.save();
  }

  private mapData([
    accounts,
    fungibleTokens,
    daos,
    councilProposals,
    councilVotes,
    democracyProposals,
    democracyReferendums,
    democracySeconds,
    bounties,
  ]: [
    Account[],
    FungibleToken[],
    Dao[],
    CouncilProposal[],
    CouncilVoteHistory[],
    DemocracyProposal[],
    DemocracyReferendum[],
    DemocracySecond[],
    Bounty[]
  ]) {
    this._accountHandler.arrayToMap(accounts);
    this._fungibleTokenHandler.arrayToMap(fungibleTokens);
    this._daoHandler.arrayToMap(daos);
    this._councilProposalHandler.arrayToMap(councilProposals);
    this._councilVoteHandler.arrayToMap(councilVotes);
    this._democracyProposalHandler.arrayToMap(democracyProposals);
    this._democracyReferendumHandler.arrayToMap(democracyReferendums);
    this._democracySecondHandler.arrayToMap(democracySeconds);
    this._bountyHandler.arrayToMap(bounties);
  }

  private queryData() {
    for (const item of this._events) {
      this.queryItem(item);
    }

    return Promise.all([
      this._accountHandler.query(),
      this._fungibleTokenHandler.query(),
      this._daoHandler.query(),
      this._councilProposalHandler.query(),
      this._councilVoteHandler.query(),
      this._democracyProposalHandler.query(),
      this._democracyReferendumHandler.query(),
      this._democracySecondHandler.query(),
      this._bountyHandler.query(),
    ]);
  }

  private processData() {
    for (const item of this._events) {
      this.processItem(item);
    }
  }

  private processItem({
    event,
    blockHash,
    blockNum,
    timestamp,
  }: EventInfo<EventType>) {
    if (event instanceof AssetsMetadataSetEvent) {
      this._fungibleTokenHandler.process({
        event,
        blockNum,
        blockHash,
        timestamp,
      });
      return;
    }
    if (event instanceof DaoDaoRegisteredEvent) {
      this._daoHandler.process(
        {
          event,
          blockNum,
          blockHash,
          timestamp,
        },
        this._accountHandler.accounts,
        this._fungibleTokenHandler.fungibleTokensToInsert,
        this._fungibleTokenHandler.fungibleTokensQueryMap
      );
      return;
    }
    if (event instanceof DaoCouncilProposedEvent) {
      this._councilProposalHandler.processProposed(
        {
          event,
          blockNum,
          blockHash,
          timestamp,
        },
        this._accountHandler.accounts,
        this._daoHandler.daosToInsert,
        this._daoHandler.daosQueryMap
      );
      return;
    }
    if (
      event instanceof DaoCouncilApprovedEvent ||
      event instanceof DaoCouncilDisapprovedEvent ||
      event instanceof DaoCouncilClosedEvent ||
      event instanceof DaoCouncilExecutedEvent
    ) {
      this._councilProposalHandler.processStatus({
        event,
        blockNum,
        blockHash,
        timestamp,
      });
      return;
    }

    if (event instanceof DaoCouncilVotedEvent) {
      this._councilVoteHandler.process(
        {
          event,
          blockNum,
          blockHash,
          timestamp,
        },
        this._accountHandler.accounts,
        this._councilProposalHandler.councilProposalsToInsert,
        this._councilProposalHandler.councilProposalsQueryMap
      );
      return;
    }

    if (
      event instanceof DaoCouncilMembersMemberAddedEvent ||
      event instanceof DaoCouncilMembersMemberRemovedEvent
    ) {
      this._councilMembersEventHandler.process(
        {
          event,
          blockHash,
          blockNum,
          timestamp,
        },
        this._daoHandler.daosToInsert,
        this._daoHandler.daosToUpdate,
        this._daoHandler.daosQueryMap
      );
      return;
    }
    if (event instanceof DaoDemocracyProposedEvent) {
      this._democracyProposalHandler.processProposed(
        {
          event,
          blockHash,
          blockNum,
          timestamp,
        },
        this._daoHandler.daosToInsert,
        this._daoHandler.daosQueryMap,
        this._accountHandler.accounts
      );
      return;
    }
    if (event instanceof DaoDemocracyStartedEvent) {
      this._democracyProposalHandler.processStatus({
        event,
        blockHash,
        blockNum,
        timestamp,
      });
      this._democracyReferendumHandler.processStarted(
        {
          event,
          blockHash,
          blockNum,
          timestamp,
        },
        this._democracyProposalHandler.democracyProposalsToInsert,
        this._democracyProposalHandler.democracyProposalsToUpdate,
        this._democracyProposalHandler.democracyProposalsQueryMap
      );
      return;
    }
    if (
      event instanceof DaoDemocracyPassedEvent ||
      event instanceof DaoDemocracyNotPassedEvent ||
      event instanceof DaoDemocracyCancelledEvent
    ) {
      this._democracyReferendumHandler.processStatus({
        event,
        blockHash,
        blockNum,
        timestamp,
      });
      return;
    }
    if (event instanceof DaoDemocracySecondedEvent) {
      this._democracySecondHandler.process(
        {
          event,
          blockHash,
          blockNum,
          timestamp,
        },
        this._accountHandler.accounts,
        this._democracyProposalHandler.democracyProposalsToInsert,
        this._democracyProposalHandler.democracyProposalsQueryMap
      );
    }
    if (event instanceof DaoBountiesBountyCreatedEvent) {
      this._bountyHandler.processCreated(
        {
          event,
          blockHash,
          blockNum,
          timestamp,
        },
        this._daoHandler.daosToInsert,
        this._daoHandler.daosToUpdate,
        this._daoHandler.daosQueryMap
      );
      return;
    }
    if (
      event instanceof DaoBountiesBountyBecameActiveEvent ||
      event instanceof DaoBountiesBountyCuratorAcceptedEvent ||
      event instanceof DaoBountiesBountyCuratorUnassignedEvent ||
      event instanceof DaoBountiesBountyCuratorProposedEvent ||
      event instanceof DaoBountiesBountyClaimedEvent ||
      event instanceof DaoBountiesBountyExtendedEvent ||
      event instanceof DaoBountiesBountyAwardedEvent ||
      event instanceof DaoBountiesBountyCanceledEvent
    ) {
      this._bountyHandler.processStatus(
        {
          event,
          blockHash,
          blockNum,
          timestamp,
        },
        this._accountHandler.accounts
      );
    }
  }

  private queryItem({ event }: EventInfo<EventType>) {
    if (event instanceof DaoDaoRegisteredEvent) {
      this._daoHandler.prepareQuery(
        event,
        this._accountHandler.accountIds,
        this._fungibleTokenHandler.fungibleTokenIds
      );
      return;
    }
    if (
      event instanceof DaoCouncilMembersMemberAddedEvent ||
      event instanceof DaoCouncilMembersMemberRemovedEvent
    ) {
      this._councilMembersEventHandler.prepareQuery(
        event,
        this._daoHandler.daoIds
      );
      return;
    }
    if (event instanceof DaoCouncilProposedEvent) {
      this._councilProposalHandler.prepareProposedQuery(
        event,
        this._daoHandler.daoIds,
        this._accountHandler.accountIds
      );
      return;
    }
    if (
      event instanceof DaoCouncilApprovedEvent ||
      event instanceof DaoCouncilDisapprovedEvent ||
      event instanceof DaoCouncilClosedEvent ||
      event instanceof DaoCouncilExecutedEvent
    ) {
      this._councilProposalHandler.prepareStatusQuery(
        event,
        this._councilProposalHandler.councilProposalIds
      );
      return;
    }
    if (event instanceof DaoCouncilVotedEvent) {
      this._councilVoteHandler.prepareQuery(
        event,
        this._accountHandler.accountIds,
        this._councilProposalHandler.councilProposalIds
      );
      return;
    }
    if (event instanceof DaoDemocracyProposedEvent) {
      this._democracyProposalHandler.prepareProposedQuery(
        event,
        this._daoHandler.daoIds,
        this._accountHandler.accountIds
      );
      return;
    }
    if (event instanceof DaoDemocracyStartedEvent) {
      this._democracyProposalHandler.prepareStatusQuery(event);
      this._democracyReferendumHandler.prepareStartedQuery(
        event,
        this._democracyProposalHandler.democracyProposalIds
      );
      return;
    }
    if (
      event instanceof DaoDemocracyPassedEvent ||
      event instanceof DaoDemocracyNotPassedEvent ||
      event instanceof DaoDemocracyCancelledEvent
    ) {
      this._democracyReferendumHandler.prepareStatusQuery(event);
      return;
    }
    if (event instanceof DaoDemocracySecondedEvent) {
      this._democracySecondHandler.prepareQuery(
        event,
        this._accountHandler.accountIds,
        this._democracyProposalHandler.democracyProposalIds
      );
      return;
    }
    if (
      event instanceof DaoBountiesBountyCreatedEvent ||
      event instanceof DaoBountiesBountyBecameActiveEvent ||
      event instanceof DaoBountiesBountyCuratorAcceptedEvent ||
      event instanceof DaoBountiesBountyCuratorUnassignedEvent ||
      event instanceof DaoBountiesBountyCuratorProposedEvent ||
      event instanceof DaoBountiesBountyClaimedEvent ||
      event instanceof DaoBountiesBountyExtendedEvent ||
      event instanceof DaoBountiesBountyAwardedEvent ||
      event instanceof DaoBountiesBountyCanceledEvent
    ) {
      this._bountyHandler.prepareQuery(
        event,
        this._daoHandler.daoIds,
        this._accountHandler.accountIds
      );
      return;
    }
  }

  private processEvents() {
    for (let block of this._ctx.blocks) {
      const blockHash = block.header.hash;
      const blockNum = block.header.height;
      const timestamp = block.header.timestamp;

      for (let item of block.items) {
        switch (item.kind) {
          case "event": {
            const event = this.decodeAndTransformData(item);
            if (!event) {
              continue;
            }
            this._events.push({
              event,
              blockNum,
              blockHash,
              timestamp,
            });
            break;
          }
          case "call": {
            break;
          }
          default: {
            throw new Error("Unsupported kind");
          }
        }
      }
    }
  }

  private decodeAndTransformData(item: Item) {
    switch (item.name) {
      case "Dao.DaoRegistered": {
        return new DaoDaoRegisteredEvent(this._ctx, item.event);
      }
      case "Assets.MetadataSet": {
        return new AssetsMetadataSetEvent(this._ctx, item.event);
      }
      case "DaoCouncil.Proposed": {
        return new DaoCouncilProposedEvent(this._ctx, item.event);
      }
      case "DaoCouncil.Voted": {
        return new DaoCouncilVotedEvent(this._ctx, item.event);
      }
      case "DaoCouncil.Approved": {
        return new DaoCouncilApprovedEvent(this._ctx, item.event);
      }
      case "DaoCouncil.Disapproved": {
        return new DaoCouncilDisapprovedEvent(this._ctx, item.event);
      }
      case "DaoCouncil.Executed": {
        return new DaoCouncilExecutedEvent(this._ctx, item.event);
      }
      case "DaoCouncil.Closed": {
        return new DaoCouncilClosedEvent(this._ctx, item.event);
      }
      case "DaoCouncilMembers.MemberAdded": {
        return new DaoCouncilMembersMemberAddedEvent(this._ctx, item.event);
      }
      case "DaoCouncilMembers.MemberRemoved": {
        return new DaoCouncilMembersMemberRemovedEvent(this._ctx, item.event);
      }
      case "DaoDemocracy.Proposed": {
        return new DaoDemocracyProposedEvent(this._ctx, item.event);
      }
      case "DaoDemocracy.Cancelled": {
        return new DaoDemocracyCancelledEvent(this._ctx, item.event);
      }
      case "DaoDemocracy.Delegated": {
        return new DaoDemocracyDelegatedEvent(this._ctx, item.event);
      }
      case "DaoDemocracy.NotPassed": {
        return new DaoDemocracyNotPassedEvent(this._ctx, item.event);
      }
      case "DaoDemocracy.Passed": {
        return new DaoDemocracyPassedEvent(this._ctx, item.event);
      }
      case "DaoDemocracy.Started": {
        return new DaoDemocracyStartedEvent(this._ctx, item.event);
      }
      case "DaoDemocracy.Undelegated": {
        return new DaoDemocracyUndelegatedEvent(this._ctx, item.event);
      }
      case "DaoDemocracy.Voted": {
        return new DaoDemocracyVotedEvent(this._ctx, item.event);
      }
      case "DaoDemocracy.Seconded": {
        return new DaoDemocracySecondedEvent(this._ctx, item.event);
      }
      case "DaoBounties.BountyCreated": {
        return new DaoBountiesBountyCreatedEvent(this._ctx, item.event);
      }
      case "DaoBounties.BountyBecameActive": {
        return new DaoBountiesBountyBecameActiveEvent(this._ctx, item.event);
      }
      case "DaoBounties.BountyCuratorProposed": {
        return new DaoBountiesBountyCuratorProposedEvent(this._ctx, item.event);
      }
      case "DaoBounties.BountyCuratorUnassigned": {
        return new DaoBountiesBountyCuratorUnassignedEvent(
          this._ctx,
          item.event
        );
      }
      case "DaoBounties.BountyCuratorAccepted": {
        return new DaoBountiesBountyCuratorAcceptedEvent(this._ctx, item.event);
      }
      case "DaoBounties.BountyAwarded": {
        return new DaoBountiesBountyAwardedEvent(this._ctx, item.event);
      }
      case "DaoBounties.BountyCanceled": {
        return new DaoBountiesBountyCanceledEvent(this._ctx, item.event);
      }
      case "DaoBounties.BountyClaimed": {
        return new DaoBountiesBountyClaimedEvent(this._ctx, item.event);
      }
      case "DaoBounties.BountyExtended": {
        return new DaoBountiesBountyExtendedEvent(this._ctx, item.event);
      }
      default: {
        console.log("Unknown event", item.name);
      }
    }
  }
}
