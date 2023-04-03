import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
} from "@subsquid/substrate-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { processEvents } from "./processorHandler";

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    chain: process.env.WEBSOCKET_URL,
    archive: process.env.ARCHIVE_URL as string,
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
  .addEvent("DaoEthGovernance.Proposed", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoEthGovernance.Voted", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoEthGovernance.Approved", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoEthGovernance.Disapproved", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoEthGovernance.Executed", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoEthGovernance.Closed", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoCouncilMembers.MemberAdded", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoCouncilMembers.MemberRemoved", {
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
  } as const)
  .addEvent("DaoBounties.BountyCreated", {
    data: { event: { args: true, call: true } },
  } as const)
  .addEvent("DaoBounties.BountyBecameActive", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoBounties.BountyCuratorProposed", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoBounties.BountyCuratorUnassigned", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoBounties.BountyCuratorAccepted", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoBounties.BountyAwarded", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoBounties.BountyClaimed", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoBounties.BountyCanceled", {
    data: { event: { args: true } },
  } as const)
  .addEvent("DaoBounties.BountyExtended", {
    data: { event: { args: true } },
  } as const);
export type Item = BatchProcessorItem<typeof processor>;
export type Ctx = BatchContext<Store, Item>;

processor.run(new TypeormDatabase(), async (ctx) => {
  await processEvents(ctx);
});
