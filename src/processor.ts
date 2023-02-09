import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
} from "@subsquid/substrate-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";

import { daoHandler, fungibleTokenHandler } from "./handlers";

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
  } as const);

export type Item = BatchProcessorItem<typeof processor>;
export type Ctx = BatchContext<Store, Item>;

processor.run(new TypeormDatabase(), async (ctx) => {
  await processEvents(ctx);
});

async function processEvents(ctx: Ctx): Promise<void> {
  const createDaoEvents = [];
  const createTokenEvents = [];
  for (let block of ctx.blocks) {
    for (let item of block.items) {
      switch (item.kind) {
        case "event": {
          switch (item.name) {
            case "Dao.DaoRegistered": {
              createDaoEvents.push(item);
              break;
            }
            case "Assets.MetadataSet": {
              createTokenEvents.push(item);
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

  const fungibleTokens = await fungibleTokenHandler(ctx, createTokenEvents);
  const {
    daos,
    policies,
    councilAccounts,
    technicalCommitteeAccounts,
    accounts,
  } = await daoHandler(ctx, createDaoEvents, fungibleTokens);
  await ctx.store.save(accounts);
  await ctx.store.insert(fungibleTokens);
  await ctx.store.insert(policies);
  await ctx.store.insert(daos);
  await ctx.store.insert(councilAccounts);
  await ctx.store.insert(technicalCommitteeAccounts);
}
