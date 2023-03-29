import { In } from "typeorm";
import { DaoDemocracyDelegatedEvent } from "../types/events";
import { Account, DemocracyDelegation } from "../model";
import { decodeAddress } from "../utils";

import type { Ctx } from "../processor";
import type { EventInfo } from "../types";

export class DemocracyDelegationHandler {
  // ctx: Ctx;
  // delegatedEvents: EventInfo<DaoDemocracyDelegatedEvent>[];
  //
  // constructor(
  //   ctx: Ctx,
  //   delegatedEvents: EventInfo<DaoDemocracyDelegatedEvent>[]
  // ) {
  //   this.ctx = ctx;
  //   this.delegatedEvents = delegatedEvents;
  // }
  //
  // async handle(accounts: Map<string, Account>) {
  //   const democracyDelegationsToInsert = new Map<string, DemocracyDelegation>();
  //
  //   const [accountsQuery, delegationsQuery] =
  //     await this.getAccountsAndDelegations(accounts);
  //
  //   accountsQuery.forEach((_accountsQuery) =>
  //     accounts.set(_accountsQuery.id, _accountsQuery)
  //   );
  //
  //   for (const { event } of this.delegatedEvents) {
  //     const { daoId, target, who } = event.asV100;
  //
  //     const targetAddress = decodeAddress(target);
  //     const whoAddress = decodeAddress(who);
  //     const delegationId = `${daoId}-${whoAddress}-${targetAddress}`;
  //
  //     democracyDelegationsToInsert.set(
  //       delegationId,
  //       new DemocracyDelegation({
  //         id: delegationId,
  //         account: getAccount(accounts, whoAddress),
  //         target: getAccount(accounts, targetAddress),
  //       })
  //     );
  //   }
  //
  //   const democracyDelegationsToRemove = delegationsQuery.map(
  //     (delegationQuery) => delegationQuery.id
  //   );
  //
  //   return { democracyDelegationsToInsert, democracyDelegationsToRemove };
  // }
  //
  // private async getAccountsAndDelegations(accounts: Map<string, Account>) {
  //   const accountIds = new Set<string>();
  //   const delegationIds = new Set<string>();
  //
  //   for (const { event } of this.delegatedEvents) {
  //     if (!event.isV100) {
  //       throw new Error("Unsupported delegation event spec");
  //     }
  //
  //     const { who, target } = event.asV100;
  //
  //     const whoAddress = decodeAddress(who);
  //     const targetAddress = decodeAddress(target);
  //
  //     if (!accounts.get(whoAddress)) {
  //       accountIds.add(whoAddress);
  //     }
  //     if (!accounts.get(targetAddress)) {
  //       accountIds.add(targetAddress);
  //     }
  //   }
  //
  //   return Promise.all([
  //     this.ctx.store.findBy(Account, { id: In([...accountIds]) }),
  //     this.ctx.store.findBy(DemocracyDelegation, {
  //       id: In([...delegationIds]),
  //     }),
  //   ]);
  // }
}
