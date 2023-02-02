import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
} from "@subsquid/substrate-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";

import { daoHandler } from "./handlers/dao.handler";

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    chain: "ws://127.0.0.1:9944",
    archive: "http://127.0.0.1:8888/graphql",
  })

  .addEvent("Dao.DaoRegistered", {
    data: {
      event: {
        args: true,
        call: true,
      },
    },
  } as const);

export type Item = BatchProcessorItem<typeof processor>;
export type Ctx = BatchContext<Store, Item>;

processor.run(new TypeormDatabase(), async (ctx) => {
  await processEvents(ctx);
});

async function processEvents(ctx: Ctx): Promise<void> {
  for (let block of ctx.blocks) {
    const _createDaoEvents = [];
    for (let item of block.items) {
      switch (item.kind) {
        case "event": {
          switch (item.name) {
            case "Dao.DaoRegistered": {
              _createDaoEvents.push(item);
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
    const { daos, policies, tokens, accounts } = await daoHandler(
      ctx,
      _createDaoEvents
    );
    await ctx.store.save(Array.from(accounts.values()));
    await ctx.store.insert(policies);
    await ctx.store.insert(tokens);
    await ctx.store.insert(daos);
  }
}

// interface TransferEvent {
//   id: string;
//   blockNumber: number;
//   timestamp: Date;
//   extrinsicHash?: string;
//   from: string;
//   to: string;
//   amount: bigint;
//   fee?: bigint;
// }
//
// function getTransfers(ctx: Ctx): TransferEvent[] {
//   let transfers: TransferEvent[] = [];
//   for (let block of ctx.blocks) {
//     for (let item of block.items) {
//       console.dir(item, { depth: 5 });
//       if (item.name == "Balances.Transfer") {
//         let e = new BalancesTransferEvent(ctx, item.event);
//         let rec: { from: Uint8Array; to: Uint8Array; amount: bigint };
//         if (e.isV100) {
//           let { from, to, amount } = e.asV100;
//           rec = { from, to, amount };
//         } else {
//           throw new Error("Unsupported spec");
//         }
//
//         transfers.push({
//           id: item.event.id,
//           blockNumber: block.header.height,
//           timestamp: new Date(block.header.timestamp),
//           extrinsicHash: item.event.extrinsic?.hash,
//           from: ss58.codec("kusama").encode(rec.from),
//           to: ss58.codec("kusama").encode(rec.to),
//           amount: rec.amount,
//           fee: item.event.extrinsic?.fee || 0n,
//         });
//       }
//     }
//   }
//   return transfers;
// }
//

// let transfersData = getTransfers(ctx);
//
// let accountIds = new Set<string>();
// for (let t of transfersData) {
//   accountIds.add(t.from);
//   accountIds.add(t.to);
// }
//
// let accounts = await ctx.store
//   .findBy(Account, { id: In([...accountIds]) })
//   .then((accounts) => {
//     return new Map(accounts.map((a) => [a.id, a]));
//   });
//
// let transfers: Transfer[] = [];
//
// for (let t of transfersData) {
//   let { id, blockNumber, timestamp, extrinsicHash, amount, fee } = t;
//
//   let from = getAccount(accounts, t.from);
//   let to = getAccount(accounts, t.to);
//
//   transfers.push(
//     new Transfer({
//       id,
//       blockNumber,
//       timestamp,
//       extrinsicHash,
//       from,
//       to,
//       amount,
//       fee,
//     })
//   );
// }
//
// await ctx.store.save(Array.from(accounts.values()));
// await ctx.store.insert(transfers);
