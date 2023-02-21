import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
} from "@subsquid/substrate-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";

import {
  daoHandler,
  fungibleTokenHandler,
  proposalHandler,
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
} from "./types/events";
import {
  Account,
  Dao,
  FungibleToken,
  Policy,
  Proposal,
  VoteHistory,
} from "./model";
import { proposalStatusHandler } from "./handlers/proposalStatusHandler";

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    chain: "ws://127.0.0.1:9944",
    archive: "http://127.0.0.1:8888/graphql",
  })
  .addEvent("Dao.DaoRegistered", {
    data: {
      event: {
        args: true,
      },
    },
  } as const)
  .addEvent("Assets.MetadataSet", {
    data: {
      event: {
        args: true,
      },
    },
  } as const)
  .addEvent("DaoCouncil.Proposed", {
    data: {
      event: {
        args: true,
      },
    },
  } as const)
  .addEvent("DaoCouncil.Voted", {
    data: {
      event: {
        args: true,
      },
    },
  } as const)
  .addEvent("DaoCouncil.Approved", {
    data: {
      event: {
        args: true,
      },
    },
  } as const)
  .addEvent("DaoCouncil.Disapproved", {
    data: {
      event: {
        args: true,
      },
    },
  } as const)
  .addEvent("DaoCouncil.Executed", {
    data: {
      event: {
        args: true,
      },
    },
  } as const)
  .addEvent("DaoCouncil.Closed", {
    data: {
      event: {
        args: true,
      },
    },
  } as const);

export type Item = BatchProcessorItem<typeof processor>;
export type Ctx = BatchContext<Store, Item>;
export type EventInfo<T> = {
  event: T;
  blockNum: number;
  blockHash: string;
  timestamp: number;
};

type EventsInfo = {
  daoEvents: EventInfo<DaoDaoRegisteredEvent>[];
  tokenEvents: EventInfo<AssetsMetadataSetEvent>[];
  proposalEvents: EventInfo<DaoCouncilProposedEvent>[];
  voteEvents: EventInfo<DaoCouncilVotedEvent>[];
  approvedProposalEvents: EventInfo<DaoCouncilApprovedEvent>[];
  disapprovedProposalEvents: EventInfo<DaoCouncilDisapprovedEvent>[];
  executedProposalEvents: EventInfo<DaoCouncilExecutedEvent>[];
  closedProposalEvents: EventInfo<DaoCouncilClosedEvent>[];
};
type DataBatch = {
  accounts: Map<string, Account>;
  daos: Map<string, Dao>;
  daosToUpdate: Map<string, Dao>;
  policies: Map<string, Policy>;
  proposals: Map<string, Proposal>;
  proposalsToUpdate: Map<string, Proposal>;
  fungibleTokens: Map<string, FungibleToken>;
  votes: Map<string, VoteHistory>;
  votesToUpdate: Map<string, VoteHistory>;
};

processor.run(new TypeormDatabase(), async (ctx) => {
  await processEvents(ctx);
});

async function processEvents(ctx: Ctx): Promise<void> {
  const eventsInfo = getEvents(ctx);
  const dataBatch = await handleEvents(ctx, eventsInfo);
  await saveData(ctx, dataBatch);
}

async function handleEvents(
  ctx: Ctx,
  {
    tokenEvents,
    daoEvents,
    proposalEvents,
    voteEvents,
    approvedProposalEvents,
    disapprovedProposalEvents,
    executedProposalEvents,
    closedProposalEvents,
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
  const proposals = await proposalHandler(ctx, proposalEvents, daos, accounts);
  const { votes, votesToUpdate } = await voteHandler(
    ctx,
    voteEvents,
    proposals,
    accounts
  );
  const { proposalsToUpdate, daosToUpdate } = await proposalStatusHandler(
    ctx,
    {
      approvedProposalEvents,
      disapprovedProposalEvents,
      closedProposalEvents,
      executedProposalEvents,
    },
    accounts,
    proposals,
    daos
  );
  return {
    accounts,
    daos,
    daosToUpdate,
    policies,
    fungibleTokens,
    proposals,
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
  await ctx.store.insert([...dataBatch.proposals.values()]);
  await ctx.store.insert([...dataBatch.votes.values()]);
  await ctx.store.save([...dataBatch.proposalsToUpdate.values()]);
  await ctx.store.save([...dataBatch.daosToUpdate.values()]);
  await ctx.store.save([...dataBatch.votesToUpdate.values()]);
}

function getEvents(ctx: Ctx) {
  const events: EventsInfo = {
    daoEvents: [],
    tokenEvents: [],
    proposalEvents: [],
    voteEvents: [],
    approvedProposalEvents: [],
    disapprovedProposalEvents: [],
    closedProposalEvents: [],
    executedProposalEvents: [],
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
              events.proposalEvents.push({
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
              events.approvedProposalEvents.push({
                event: new DaoCouncilApprovedEvent(ctx, item.event),
                blockNum,
                blockHash,
                timestamp,
              });
              break;
            }
            case "DaoCouncil.Disapproved": {
              events.disapprovedProposalEvents.push({
                event: new DaoCouncilDisapprovedEvent(ctx, item.event),
                blockNum,
                blockHash,
                timestamp,
              });
              break;
            }
            case "DaoCouncil.Executed": {
              events.executedProposalEvents.push({
                event: new DaoCouncilExecutedEvent(ctx, item.event),
                blockNum,
                blockHash,
                timestamp,
              });
              break;
            }
            case "DaoCouncil.Closed": {
              events.closedProposalEvents.push({
                event: new DaoCouncilClosedEvent(ctx, item.event),
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
