import { In } from "typeorm";
import { Account, DemocracyProposal, DemocracySecond } from "../model";
import { DaoDemocracySecondedEvent } from "../types/events";

import type { Ctx } from "../processor";
import type { EventInfo } from "../types";
import { decodeAddress } from "../utils";

export class DemocracySecondHandler {
  ctx: Ctx;
  democracySecondedEvents: EventInfo<DaoDemocracySecondedEvent>[];

  constructor(
    ctx: Ctx,
    democracySecondedEvents: EventInfo<DaoDemocracySecondedEvent>[]
  ) {
    this.ctx = ctx;
    this.democracySecondedEvents = democracySecondedEvents;
  }

  async handle(
    democracyProposalsToInsert: Map<string, DemocracyProposal>,
    accounts: Map<string, Account>
  ) {
    const democracySecondsToInsert = new Map<string, DemocracySecond>();
    const democracySecondsToUpdate = new Map<string, DemocracySecond>();

    const [accountsQuery, democracyProposalsQuery, democracySecondsQuery] =
      await this.getAccountsAndProposalsAndSeconds(
        accounts,
        democracyProposalsToInsert
      );

    accountsQuery.forEach((_accountQuery) =>
      accounts.set(_accountQuery.id, _accountQuery)
    );
    const democracyProposalsMap = new Map(
      democracyProposalsQuery.map((_democracyProposalQuery) => [
        _democracyProposalQuery.id,
        _democracyProposalQuery,
      ])
    );
    const democracySecondsMap = new Map(
      democracySecondsQuery.map((_democracySecond) => [
        _democracySecond.id,
        _democracySecond,
      ])
    );

    for (const { event } of this.democracySecondedEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported second spec");
      }

      const { daoId, propIndex, seconder } = event.asV100;
      const accountAddress = decodeAddress(seconder);
      const democracyProposalId = `${daoId}-${propIndex}`;
      const proposal =
        democracyProposalsToInsert.get(democracyProposalId) ??
        democracyProposalsMap.get(democracyProposalId);

      if (!proposal) {
        throw new Error(
          `Democracy proposal with id: ${democracyProposalId} not found`
        );
      }

      const id = `${daoId}-${propIndex}-${accountAddress}`;

      const account = accounts.get(accountAddress);

      const existingSecond = democracySecondsMap.get(id);

      if (existingSecond) {
        democracySecondsToUpdate.set(
          id,
          new DemocracySecond({
            ...existingSecond,
            count: existingSecond.count + 1,
          })
        );
      } else {
        democracySecondsToInsert.set(
          id,
          new DemocracySecond({
            id,
            proposal,
            seconder: account,
            count: 1,
          })
        );
      }
    }

    return {
      democracySecondsToInsert,
      democracySecondsToUpdate,
    };
  }

  private async getAccountsAndProposalsAndSeconds(
    accounts: Map<string, Account>,
    democracyProposalsToInsert: Map<string, DemocracyProposal>
  ) {
    const accountIds = new Set<string>();
    const democracyProposalIds = new Set<string>();
    const secondIds = new Set<string>();

    for (const { event } of this.democracySecondedEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported second spec");
      }

      const { daoId, seconder, propIndex } = event.asV100;

      const accountAddress = decodeAddress(seconder);
      const democracyProposalId = `${daoId}-${propIndex}`;
      const secondId = `${daoId}-${propIndex}-${accountAddress}`;

      if (!accounts.get(accountAddress)) {
        accountIds.add(accountAddress);
      }
      if (!democracyProposalsToInsert.get(democracyProposalId)) {
        democracyProposalIds.add(democracyProposalId);
      }
      secondIds.add(secondId);
    }

    return Promise.all([
      this.ctx.store.findBy(Account, { id: In([...accountIds]) }),
      this.ctx.store.findBy(DemocracyProposal, {
        id: In([...democracyProposalIds]),
      }),
      this.ctx.store.findBy(DemocracySecond, { id: In([...secondIds]) }),
    ]);
  }
}
