import {
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

import type { EventsInfo } from "../types";
import type { Ctx } from "../processor";

export class EventHandler {
  ctx: Ctx;
  events: EventsInfo = {
    democracyCancelledEvents: [],
    democracyDelegatedEvents: [],
    democracyNotPassedEvents: [],
    democracyPassedEvents: [],
    democracyStartedEvents: [],
    democracyUndelegatedEvents: [],
    democracyVotedEvents: [],
    daoEvents: [],
    tokenEvents: [],
    councilProposalEvents: [],
    voteEvents: [],
    approvedCouncilProposalEvents: [],
    disapprovedCouncilProposalEvents: [],
    closedCouncilProposalEvents: [],
    executedCouncilProposalEvents: [],
    democracyProposalEvents: [],
    democracySecondEvents: [],
    addedCouncilMembersEvents: [],
    removedCouncilMembersEvents: [],
  };

  constructor(ctx: Ctx) {
    this.ctx = ctx;
  }

  handle() {
    for (let block of this.ctx.blocks) {
      const blockHash = block.header.hash;
      const blockNum = block.header.height;
      const timestamp = block.header.timestamp;

      for (let item of block.items) {
        switch (item.kind) {
          case "event": {
            switch (item.name) {
              case "Dao.DaoRegistered": {
                this.events.daoEvents.push({
                  event: new DaoDaoRegisteredEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "Assets.MetadataSet": {
                this.events.tokenEvents.push({
                  event: new AssetsMetadataSetEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoCouncil.Proposed": {
                this.events.councilProposalEvents.push({
                  event: new DaoCouncilProposedEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoCouncil.Voted": {
                this.events.voteEvents.push({
                  event: new DaoCouncilVotedEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoCouncil.Approved": {
                this.events.approvedCouncilProposalEvents.push({
                  event: new DaoCouncilApprovedEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoCouncil.Disapproved": {
                this.events.disapprovedCouncilProposalEvents.push({
                  event: new DaoCouncilDisapprovedEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoCouncil.Executed": {
                this.events.executedCouncilProposalEvents.push({
                  event: new DaoCouncilExecutedEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoCouncil.Closed": {
                this.events.closedCouncilProposalEvents.push({
                  event: new DaoCouncilClosedEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoCouncilMembers.MemberAdded": {
                this.events.addedCouncilMembersEvents.push({
                  event: new DaoCouncilMembersMemberAddedEvent(
                    this.ctx,
                    item.event
                  ),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoCouncilMembers.MemberRemoved": {
                this.events.removedCouncilMembersEvents.push({
                  event: new DaoCouncilMembersMemberRemovedEvent(
                    this.ctx,
                    item.event
                  ),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoDemocracy.Proposed": {
                this.events.democracyProposalEvents.push({
                  event: new DaoDemocracyProposedEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoDemocracy.Cancelled": {
                this.events.democracyCancelledEvents.push({
                  event: new DaoDemocracyCancelledEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoDemocracy.Delegated": {
                this.events.democracyDelegatedEvents.push({
                  event: new DaoDemocracyDelegatedEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoDemocracy.NotPassed": {
                this.events.democracyNotPassedEvents.push({
                  event: new DaoDemocracyNotPassedEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoDemocracy.Passed": {
                this.events.democracyPassedEvents.push({
                  event: new DaoDemocracyPassedEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoDemocracy.Started": {
                this.events.democracyStartedEvents.push({
                  event: new DaoDemocracyStartedEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoDemocracy.Undelegated": {
                this.events.democracyUndelegatedEvents.push({
                  event: new DaoDemocracyUndelegatedEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoDemocracy.Voted": {
                this.events.democracyVotedEvents.push({
                  event: new DaoDemocracyVotedEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              case "DaoDemocracy.Seconded": {
                this.events.democracySecondEvents.push({
                  event: new DaoDemocracySecondedEvent(this.ctx, item.event),
                  blockNum,
                  blockHash,
                  timestamp,
                });
                break;
              }
              default: {
                console.log("Unknown event", item.name);
                break;
              }
            }
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
    return this.events;
  }
}
