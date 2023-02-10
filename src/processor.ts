import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
} from "@subsquid/substrate-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";

import { daoHandler, fungibleTokenHandler } from "./handlers";
import { proposalHandler } from "./handlers/proposalHandler";
import {
  AssetsMetadataSetEvent,
  DaoCouncilProposedEvent,
  DaoCouncilVotedEvent,
  DaoDaoRegisteredEvent,
} from "./types/events";

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

processor.run(new TypeormDatabase(), async (ctx) => {
  await processEvents(ctx);
});

async function processEvents(ctx: Ctx): Promise<void> {
  const { daoEvents, tokenEvents, voteEvents, proposalEvents } = getEvents(ctx);

  const fungibleTokens = await fungibleTokenHandler(ctx, tokenEvents);
  const {
    daos,
    policies,
    councilAccounts,
    technicalCommitteeAccounts,
    accounts,
  } = await daoHandler(ctx, daoEvents, fungibleTokens);
  const proposals = await proposalHandler(ctx, proposalEvents, daos);

  await ctx.store.save(accounts);
  await ctx.store.insert(fungibleTokens);
  await ctx.store.insert(policies);
  await ctx.store.insert(daos);
  await ctx.store.insert(proposals);
  await ctx.store.insert(councilAccounts);
  await ctx.store.insert(technicalCommitteeAccounts);
}

type EventsInfo = {
  daoEvents: DaoDaoRegisteredEvent[];
  tokenEvents: AssetsMetadataSetEvent[];
  proposalEvents: DaoCouncilProposedEvent[];
  voteEvents: DaoCouncilVotedEvent[];
};

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
