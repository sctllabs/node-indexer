import { In } from "typeorm";
import {
  DaoDemocracyDelegatedEvent,
  DaoDemocracyUndelegatedEvent,
} from "../types/events";
import { Account, Conviction, DemocracyDelegation } from "../model";
import { decodeAddress, getAccount } from "../utils";

import type { Ctx } from "../processor";
import type { EventInfo } from "../types";

export class DemocracyDelegationHandler {
  ctx: Ctx;
  delegatedEvents: EventInfo<DaoDemocracyDelegatedEvent>[];
  undelegatedEvents: EventInfo<DaoDemocracyUndelegatedEvent>[];

  constructor(
    ctx: Ctx,
    delegatedEvents: EventInfo<DaoDemocracyDelegatedEvent>[],
    undelegatedEvents: EventInfo<DaoDemocracyUndelegatedEvent>[]
  ) {
    this.ctx = ctx;
    this.delegatedEvents = delegatedEvents;
    this.undelegatedEvents = undelegatedEvents;
  }

  async handle(accounts: Map<string, Account>) {
    const democracyDelegationsToInsert = new Map<string, DemocracyDelegation>();

    const [accountsQuery, delegationsQuery] =
      await this.getAccountsAndDelegations(accounts);

    accountsQuery.forEach((_accountsQuery) =>
      accounts.set(_accountsQuery.id, _accountsQuery)
    );

    for (const { event } of this.delegatedEvents) {
      const { daoId, target, who, conviction, balance } = event.asV100;

      const targetAddress = decodeAddress(target);
      const whoAddress = decodeAddress(who);
      const delegationId = `${daoId}-${whoAddress}-${targetAddress}`;
      const queryId = `${daoId}-${whoAddress}`;

      democracyDelegationsToInsert.set(
        delegationId,
        new DemocracyDelegation({
          id: delegationId,
          queryId,
          account: getAccount(accounts, whoAddress),
          target: getAccount(accounts, targetAddress),
          lockedBalance: balance,
          conviction: Conviction[conviction.__kind],
        })
      );
    }

    const democracyDelegationsToRemove = delegationsQuery.map(
      (delegationQuery) => delegationQuery.id
    );

    return { democracyDelegationsToInsert, democracyDelegationsToRemove };
  }

  private async getAccountsAndDelegations(accounts: Map<string, Account>) {
    const accountIds = new Set<string>();
    const delegationQueryIds = new Set<string>();

    for (const { event } of this.delegatedEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported delegation event spec");
      }

      const { who, target } = event.asV100;

      const whoAddress = decodeAddress(who);
      const targetAddress = decodeAddress(target);

      if (!accounts.get(whoAddress)) {
        accountIds.add(whoAddress);
      }
      if (!accounts.get(targetAddress)) {
        accountIds.add(targetAddress);
      }
    }

    for (const { event } of this.undelegatedEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported undelegation event spec");
      }

      const { daoId, account } = event.asV100;

      const address = decodeAddress(account);
      const delegationId = `${daoId}-${address}`;

      if (!accounts.get(address)) {
        accountIds.add(address);
      }
      delegationQueryIds.add(delegationId);
    }

    return Promise.all([
      this.ctx.store.findBy(Account, { id: In([...accountIds]) }),
      this.ctx.store.findBy(DemocracyDelegation, {
        queryId: In([...delegationQueryIds]),
      }),
    ]);
  }
}
