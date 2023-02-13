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
  DaoCouncilProposedEvent,
  DaoCouncilVotedEvent,
  DaoDaoRegisteredEvent,
} from "./types/events";
import {
  Account,
  CouncilAccount,
  Dao,
  FungibleToken,
  Policy,
  Proposal,
  TechnicalCommitteeAccount,
  VoteHistory,
} from "./model";

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
  } as const);

export type Item = BatchProcessorItem<typeof processor>;
export type Ctx = BatchContext<Store, Item>;

type EventsInfo = {
  daoEvents: DaoDaoRegisteredEvent[];
  tokenEvents: AssetsMetadataSetEvent[];
  proposalEvents: DaoCouncilProposedEvent[];
  voteEvents: DaoCouncilVotedEvent[];
};
type DataBatch = {
  accounts: Map<string, Account>;
  daos: Map<string, Dao>;
  policies: Map<string, Policy>;
  proposals: Map<string, Proposal>;
  fungibleTokens: Map<string, FungibleToken>;
  councilAccounts: Map<string, CouncilAccount>;
  technicalCommitteeAccounts: Map<string, TechnicalCommitteeAccount>;
  votes: Map<string, VoteHistory>;
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
  { tokenEvents, daoEvents, proposalEvents, voteEvents }: EventsInfo
): Promise<DataBatch> {
  const accounts: Map<string, Account> = new Map();
  const fungibleTokens = await fungibleTokenHandler(ctx, tokenEvents);
  const { daos, policies, councilAccounts, technicalCommitteeAccounts } =
    await daoHandler(ctx, daoEvents, fungibleTokens, accounts);
  const proposals = await proposalHandler(ctx, proposalEvents, daos, accounts);
  const votes = await voteHandler(ctx, voteEvents);
  return {
    accounts,
    daos,
    policies,
    fungibleTokens,
    councilAccounts,
    technicalCommitteeAccounts,
    proposals,
    votes,
  };
}

async function saveData(ctx: Ctx, dataBatch: DataBatch) {
  await ctx.store.save([...dataBatch.accounts.values()]);
  await ctx.store.insert([...dataBatch.fungibleTokens.values()]);
  await ctx.store.insert([...dataBatch.policies.values()]);
  await ctx.store.insert([...dataBatch.daos.values()]);
  await ctx.store.insert([...dataBatch.proposals.values()]);
  await ctx.store.insert([...dataBatch.councilAccounts.values()]);
  await ctx.store.insert([...dataBatch.technicalCommitteeAccounts.values()]);
}

function getEvents(ctx: Ctx) {
  const events: EventsInfo = {
    daoEvents: [],
    tokenEvents: [],
    proposalEvents: [],
    voteEvents: [],
  };

  for (let block of ctx.blocks) {
    for (let item of block.items) {
      switch (item.kind) {
        case "event": {
          switch (item.name) {
            case "Dao.DaoRegistered": {
              events.daoEvents.push(new DaoDaoRegisteredEvent(ctx, item.event));
              break;
            }
            case "Assets.MetadataSet": {
              events.tokenEvents.push(
                new AssetsMetadataSetEvent(ctx, item.event)
              );
              break;
            }
            case "DaoCouncil.Proposed": {
              events.proposalEvents.push(
                new DaoCouncilProposedEvent(ctx, item.event)
              );
              break;
            }
            case "DaoCouncil.Voted": {
              events.voteEvents.push(new DaoCouncilVotedEvent(ctx, item.event));
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
