import type { Ctx } from "./processor";
import {
  CouncilProposalHandler,
  FungibleTokenHandler,
  DemocracySecondHandler,
  EventHandler,
  DaoHandler,
  VoteHandler,
  CouncilProposalStatusHandler,
  DemocracyProposalHandler,
  DemocracyProposalStatusHandler,
  DemocracyReferendumHandler,
  DemocracyDelegationHandler,
} from "./handlers";

import { Account, DemocracyDelegation } from "./model";
import { DataBatch, EventsInfo } from "./types";

export async function processEvents(ctx: Ctx): Promise<void> {
  const eventHandler = new EventHandler(ctx);
  const eventsInfo = eventHandler.handle();
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
    democracySecondEvents,
    democracyStartedEvents,
    democracyPassedEvents,
    democracyNotPassedEvents,
    democracyCancelledEvents,
    democracyDelegatedEvents,
    democracyUndelegatedEvents,
  }: EventsInfo
): Promise<DataBatch> {
  const accounts: Map<string, Account> = new Map();
  const fungibleTokenHandler = new FungibleTokenHandler(ctx, tokenEvents);
  const daoHandler = new DaoHandler(ctx, daoEvents);
  const councilProposalHandler = new CouncilProposalHandler(
    ctx,
    councilProposalEvents
  );
  const voteHandler = new VoteHandler(ctx, voteEvents);
  const councilProposalStatusHandler = new CouncilProposalStatusHandler(ctx, {
    approvedCouncilProposalEvents,
    disapprovedCouncilProposalEvents,
    closedCouncilProposalEvents,
    executedCouncilProposalEvents,
  });
  const democracyProposalHandler = new DemocracyProposalHandler(
    ctx,
    democracyProposalEvents
  );
  const democracySecondsHandler = new DemocracySecondHandler(
    ctx,
    democracySecondEvents
  );
  const democracyProposalStatusHandler = new DemocracyProposalStatusHandler(
    ctx,
    democracyStartedEvents
  );
  const democracyReferendumHandler = new DemocracyReferendumHandler(ctx, {
    democracyStartedEvents,
    democracyPassedEvents,
    democracyNotPassedEvents,
    democracyCancelledEvents,
  });
  const democracyDelegationHandler = new DemocracyDelegationHandler(
    ctx,
    democracyDelegatedEvents,
    democracyUndelegatedEvents
  );

  const fungibleTokens = await fungibleTokenHandler.handle();
  const { daosToInsert, policiesToInsert } = await daoHandler.handle(
    fungibleTokens,
    accounts
  );
  const councilProposalsToInsert = await councilProposalHandler.handle(
    daosToInsert,
    accounts
  );
  const { councilVotesToInsert, councilVotesToUpdate } =
    await voteHandler.handle(councilProposalsToInsert, accounts);
  const { councilProposalsToUpdate, daosToUpdate } =
    await councilProposalStatusHandler.handle(
      councilProposalsToInsert,
      daosToInsert,
      accounts
    );
  const democracyProposalsToInsert = await democracyProposalHandler.handle(
    daosToInsert,
    accounts
  );
  const democracyProposalsToUpdate =
    await democracyProposalStatusHandler.handle(democracyProposalsToInsert);

  const { democracySecondsToInsert, democracySecondsToUpdate } =
    await democracySecondsHandler.handle(democracyProposalsToInsert, accounts);

  const { democracyReferendumsToInsert, democracyReferendumsToUpdate } =
    await democracyReferendumHandler.handle(
      democracyProposalsToInsert,
      democracyProposalsToUpdate
    );

  const { democracyDelegationsToInsert, democracyDelegationsToRemove } =
    await democracyDelegationHandler.handle(accounts);

  return {
    accounts,
    daosToInsert,
    daosToUpdate,
    policiesToInsert,
    fungibleTokens,
    councilProposalsToInsert,
    democracyProposalsToInsert,
    democracyProposalsToUpdate,
    councilProposalsToUpdate,
    councilVotesToInsert,
    councilVotesToUpdate,
    democracySecondsToInsert,
    democracySecondsToUpdate,
    democracyReferendumsToInsert,
    democracyReferendumsToUpdate,
    democracyDelegationsToInsert,
    democracyDelegationsToRemove,
  };
}

async function saveData(ctx: Ctx, dataBatch: DataBatch) {
  await ctx.store.save([...dataBatch.accounts.values()]);
  await ctx.store.insert([...dataBatch.fungibleTokens.values()]);
  await ctx.store.insert([...dataBatch.policiesToInsert.values()]);
  await ctx.store.insert([...dataBatch.daosToInsert.values()]);
  await ctx.store.insert([...dataBatch.councilProposalsToInsert.values()]);
  await ctx.store.insert([...dataBatch.councilVotesToInsert.values()]);
  await ctx.store.insert([...dataBatch.democracyProposalsToInsert.values()]);
  await ctx.store.insert([...dataBatch.democracySecondsToInsert.values()]);
  await ctx.store.insert([...dataBatch.democracyReferendumsToInsert.values()]);
  await ctx.store.insert([...dataBatch.democracyDelegationsToInsert.values()]);
  await ctx.store.save([...dataBatch.councilProposalsToUpdate.values()]);
  await ctx.store.save([...dataBatch.democracyProposalsToUpdate.values()]);
  await ctx.store.save([...dataBatch.democracySecondsToUpdate.values()]);
  await ctx.store.save([...dataBatch.daosToUpdate.values()]);
  await ctx.store.save([...dataBatch.councilVotesToUpdate.values()]);
  await ctx.store.save([...dataBatch.democracyReferendumsToUpdate.values()]);
  if (dataBatch.democracyDelegationsToRemove.length > 0) {
    await ctx.store.remove(
      DemocracyDelegation,
      dataBatch.democracyDelegationsToRemove
    );
  }
}
