import type { Ctx } from "./processor";
import {
  daoHandler,
  fungibleTokenHandler,
  councilProposalHandler,
  councilProposalStatusHandler,
  democracyProposalHandler,
  voteHandler,
} from "./handlers";
import {
  AssetsMetadataSetEvent,
  DaoCouncilApprovedEvent,
  DaoCouncilClosedEvent,
  DaoCouncilDisapprovedEvent,
  DaoCouncilExecutedEvent,
  DaoCouncilProposedEvent,
  DaoCouncilVotedEvent,
  DaoDaoRegisteredEvent,
  DaoDemocracyProposedEvent,
} from "./types/events";
import {
  Account,
  Dao,
  FungibleToken,
  Policy,
  CouncilProposal,
  CouncilVoteHistory,
  DemocracyProposal,
} from "./model";

export type EventInfo<T> = {
  event: T;
  blockNum: number;
  blockHash: string;
  timestamp: number;
};

type EventsInfo = {
  daoEvents: EventInfo<DaoDaoRegisteredEvent>[];
  tokenEvents: EventInfo<AssetsMetadataSetEvent>[];
  voteEvents: EventInfo<DaoCouncilVotedEvent>[];
  councilProposalEvents: EventInfo<DaoCouncilProposedEvent>[];
  approvedCouncilProposalEvents: EventInfo<DaoCouncilApprovedEvent>[];
  disapprovedCouncilProposalEvents: EventInfo<DaoCouncilDisapprovedEvent>[];
  executedCouncilProposalEvents: EventInfo<DaoCouncilExecutedEvent>[];
  closedCouncilProposalEvents: EventInfo<DaoCouncilClosedEvent>[];
  democracyProposalEvents: EventInfo<DaoDemocracyProposedEvent>[];
};
type DataBatch = {
  accounts: Map<string, Account>;
  daos: Map<string, Dao>;
  daosToUpdate: Map<string, Dao>;
  policies: Map<string, Policy>;
  councilProposals: Map<string, CouncilProposal>;
  democracyProposals: Map<string, DemocracyProposal>;
  proposalsToUpdate: Map<string, CouncilProposal>;
  fungibleTokens: Map<string, FungibleToken>;
  votes: Map<string, CouncilVoteHistory>;
  votesToUpdate: Map<string, CouncilVoteHistory>;
};

export async function processEvents(ctx: Ctx): Promise<void> {
  const eventsInfo = getEvents(ctx);
  const dataBatch = await handleEvents(ctx, eventsInfo);
  await saveData(ctx, dataBatch);
}

async function handleEvents(
  ctx: Ctx,
  {
    tokenEvents,
    daoEvents,
    councilProposalEvents,
    voteEvents,
    approvedCouncilProposalEvents,
    disapprovedCouncilProposalEvents,
    executedCouncilProposalEvents,
    closedCouncilProposalEvents,
    democracyProposalEvents,
  }: EventsInfo
): Promise<DataBatch> {
  const accounts: Map<string, Account> = new Map();
  const fungibleTokens = await fungibleTokenHandler(ctx, tokenEvents);
  const { daos, policies } = await daoHandler(
    ctx,
    daoEvents,
    fungibleTokens,
    accounts
  );
  const councilProposals = await councilProposalHandler(
    ctx,
    councilProposalEvents,
    daos,
    accounts
  );
  const { votes, votesToUpdate } = await voteHandler(
    ctx,
    voteEvents,
    councilProposals,
    accounts
  );
  const { proposalsToUpdate, daosToUpdate } =
    await councilProposalStatusHandler(
      ctx,
      {
        approvedCouncilProposalEvents,
        disapprovedCouncilProposalEvents,
        closedCouncilProposalEvents,
        executedCouncilProposalEvents,
      },
      accounts,
      councilProposals,
      daos
    );
  const democracyProposals = await democracyProposalHandler(
    ctx,
    democracyProposalEvents,
    daos,
    accounts
  );
  return {
    accounts,
    daos,
    daosToUpdate,
    policies,
    fungibleTokens,
    councilProposals,
    democracyProposals,
    proposalsToUpdate,
    votes,
    votesToUpdate,
  };
}

async function saveData(ctx: Ctx, dataBatch: DataBatch) {
  await ctx.store.save([...dataBatch.accounts.values()]);
  await ctx.store.insert([...dataBatch.fungibleTokens.values()]);
  await ctx.store.insert([...dataBatch.policies.values()]);
  await ctx.store.insert([...dataBatch.daos.values()]);
  await ctx.store.insert([...dataBatch.councilProposals.values()]);
  await ctx.store.insert([...dataBatch.votes.values()]);
  await ctx.store.insert([...dataBatch.democracyProposals.values()]);
  await ctx.store.save([...dataBatch.proposalsToUpdate.values()]);
  await ctx.store.save([...dataBatch.daosToUpdate.values()]);
  await ctx.store.save([...dataBatch.votesToUpdate.values()]);
}

function getEvents(ctx: Ctx) {
  const events: EventsInfo = {
    daoEvents: [],
    tokenEvents: [],
    councilProposalEvents: [],
    voteEvents: [],
    approvedCouncilProposalEvents: [],
    disapprovedCouncilProposalEvents: [],
    closedCouncilProposalEvents: [],
    executedCouncilProposalEvents: [],
    democracyProposalEvents: [],
  };

  for (let block of ctx.blocks) {
    const blockHash = block.header.hash;
    const blockNum = block.header.height;
    const timestamp = block.header.timestamp;

    for (let item of block.items) {
      switch (item.kind) {
        case "event": {
          switch (item.name) {
            case "Dao.DaoRegistered": {
              events.daoEvents.push({
                event: new DaoDaoRegisteredEvent(ctx, item.event),
                blockNum,
                blockHash,
                timestamp,
              });
              break;
            }
            case "Assets.MetadataSet": {
              events.tokenEvents.push({
                event: new AssetsMetadataSetEvent(ctx, item.event),
                blockNum,
                blockHash,
                timestamp,
              });
              break;
            }
            case "DaoCouncil.Proposed": {
              events.councilProposalEvents.push({
                event: new DaoCouncilProposedEvent(ctx, item.event),
                blockNum,
                blockHash,
                timestamp,
              });
              break;
            }
            case "DaoCouncil.Voted": {
              events.voteEvents.push({
                event: new DaoCouncilVotedEvent(ctx, item.event),
                blockNum,
                blockHash,
                timestamp,
              });
              break;
            }
            case "DaoCouncil.Approved": {
              events.approvedCouncilProposalEvents.push({
                event: new DaoCouncilApprovedEvent(ctx, item.event),
                blockNum,
                blockHash,
                timestamp,
              });
              break;
            }
            case "DaoCouncil.Disapproved": {
              events.disapprovedCouncilProposalEvents.push({
                event: new DaoCouncilDisapprovedEvent(ctx, item.event),
                blockNum,
                blockHash,
                timestamp,
              });
              break;
            }
            case "DaoCouncil.Executed": {
              events.executedCouncilProposalEvents.push({
                event: new DaoCouncilExecutedEvent(ctx, item.event),
                blockNum,
                blockHash,
                timestamp,
              });
              break;
            }
            case "DaoCouncil.Closed": {
              events.closedCouncilProposalEvents.push({
                event: new DaoCouncilClosedEvent(ctx, item.event),
                blockNum,
                blockHash,
                timestamp,
              });
              break;
            }
            case "DaoDemocracy.Proposed": {
              events.democracyProposalEvents.push({
                event: new DaoDemocracyProposedEvent(ctx, item.event),
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
  return events;
}
