import { In } from "typeorm";
import {
  DaoDemocracyDelegatedEvent,
  DaoDemocracyUndelegatedEvent,
} from "../types/events";
import {
  Account,
  Conviction,
  DemocracyDelegation,
  DemocracyDelegationItem,
} from "../model";
import { decodeAddress, getAccount } from "../utils";
import { mapArrayById } from "../utils/mapArrayById";

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
    const democracyDelegationsToUpdate = new Map<string, DemocracyDelegation>();

    const [accountsQuery, delegationsQuery] =
      await this.getAccountsAndDelegations(accounts);
    accountsQuery.forEach((_accountsQuery) =>
      accounts.set(_accountsQuery.id, _accountsQuery)
    );
    const delegationsQueryMap = mapArrayById(delegationsQuery);

    for (const { event } of this.delegatedEvents) {
      const { daoId, target, who } = event.asV100;

      const targetAddress = decodeAddress(target);
      const whoAddress = decodeAddress(who);
      const delegationId = `${daoId}-${whoAddress}`;

      const democracyDelegation = delegationsQueryMap.get(delegationId);
      if (democracyDelegation) {
        democracyDelegation.delegations = [
          ...democracyDelegation.delegations,
          new DemocracyDelegationItem({
            account: targetAddress,
            lockedBalance: BigInt(100),
            conviction: Conviction.Locked1x,
          }),
        ];
        democracyDelegationsToUpdate.set(delegationId, democracyDelegation);
      } else {
        democracyDelegationsToInsert.set(
          delegationId,
          new DemocracyDelegation({
            id: delegationId,
            account: getAccount(accounts, whoAddress),
            delegations: [
              new DemocracyDelegationItem({
                account: targetAddress,
                lockedBalance: BigInt(100),
                conviction: Conviction.Locked1x,
              }),
            ],
          })
        );
      }
    }

    for (const { event } of this.undelegatedEvents) {
      const { daoId, account } = event.asV100;
      const accountAddress = decodeAddress(account);

      const delegationId = `${daoId}-${accountAddress}`;
      const democracyDelegation = delegationsQueryMap.get(delegationId);
      if (!democracyDelegation) {
        throw new Error(
          `Democracy Delegation with id: ${delegationId} not found`
        );
      }

      democracyDelegation.delegations = [];
      democracyDelegationsToUpdate.set(delegationId, democracyDelegation);
    }

    return { democracyDelegationsToInsert, democracyDelegationsToUpdate };
  }

  private async getAccountsAndDelegations(accounts: Map<string, Account>) {
    const accountIds = new Set<string>();
    const delegationIds = new Set<string>();

    for (const { event } of this.delegatedEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported delegation event spec");
      }

      const { daoId, who, target } = event.asV100;

      const whoAddress = decodeAddress(who);
      const targetAddress = decodeAddress(target);
      const delegationId = `${daoId}-${whoAddress}`;

      if (!accounts.get(whoAddress)) {
        accountIds.add(whoAddress);
      }
      if (!accounts.get(targetAddress)) {
        accountIds.add(targetAddress);
      }
      delegationIds.add(delegationId);
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
      delegationIds.add(delegationId);
    }

    return Promise.all([
      this.ctx.store.findBy(Account, { id: In([...accountIds]) }),
      this.ctx.store.findBy(DemocracyDelegation, {
        id: In([...delegationIds]),
      }),
    ]);
  }
}
