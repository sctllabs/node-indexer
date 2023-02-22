import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
} from "@subsquid/substrate-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { processEvents } from "./processorHandler";

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    chain: "ws://127.0.0.1:9944",
    archive: "http://127.0.0.1:8888/graphql",
  })
  .addEvent("Dao.DaoRegistered", {
    data: { event: { args: true } },
  } as const)
  .addEvent("Assets.MetadataSet", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoCouncil.Proposed", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoCouncil.Voted", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoCouncil.Approved", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoCouncil.Disapproved", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoCouncil.Executed", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoCouncil.Closed", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoDemocracy.Proposed", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoDemocracy.Voted", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoDemocracy.Started", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoDemocracy.Passed", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoDemocracy.NotPassed", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoDemocracy.Cancelled", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoDemocracy.Seconded", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoDemocracy.Delegated", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoDemocracy.Undelegated", {
    data: { event: { args: true } },
  } as const);

export type Item = BatchProcessorItem<typeof processor>;
export type Ctx = BatchContext<Store, Item>;

processor.run(new TypeormDatabase(), async (ctx) => {
  await processEvents(ctx);
});
