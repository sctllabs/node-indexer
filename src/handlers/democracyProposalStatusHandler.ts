import { In } from "typeorm";
import { DaoDemocracyStartedEvent } from "../types/events";
import { DemocracyProposal, DemocracyProposalStatus } from "../model";

import type { EventInfo } from "../types";
import type { Ctx } from "../processor";

export class DemocracyProposalStatusHandler {
  ctx: Ctx;
  democracyStartedEvents: EventInfo<DaoDemocracyStartedEvent>[];

  constructor(
    ctx: Ctx,
    democracyProposedEvents: EventInfo<DaoDemocracyStartedEvent>[]
  ) {
    this.ctx = ctx;
    this.democracyStartedEvents = democracyProposedEvents;
  }

  async handle(democracyProposalsToInsert: Map<string, DemocracyProposal>) {
    const democracyProposalsToUpdate = new Map<string, DemocracyProposal>();

    const democracyProposalsQuery = await this.getDemocracyProposals(
      democracyProposalsToInsert
    );

    const democracyProposalsQueryMap = new Map(
      democracyProposalsQuery.map((_democracyProposalQuery) => [
        _democracyProposalQuery.id,
        _democracyProposalQuery,
      ])
    );

    for (const { event } of this.democracyStartedEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported democracy proposal status spec");
      }

      const { daoId, propIndex } = event.asV100;

      const id = `${daoId}-${propIndex}`;

      const proposal =
        democracyProposalsToInsert.get(id) ??
        democracyProposalsQueryMap.get(id);

      if (!proposal) {
        throw new Error(`Democracy proposal with id: ${id} not found`);
      }

      proposal.status = DemocracyProposalStatus.Referendum;
      democracyProposalsToUpdate.set(id, proposal);
    }

    return democracyProposalsToUpdate;
  }

  private async getDemocracyProposals(
    democracyProposalsToInsert: Map<string, DemocracyProposal>
  ) {
    const democracyProposalIds = new Set<string>();

    for (const { event } of this.democracyStartedEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported democracy proposal status spec");
      }

      const { daoId, propIndex } = event.asV100;

      const democracyProposalId = `${daoId}-${propIndex}`;

      if (!democracyProposalsToInsert.get(democracyProposalId)) {
        democracyProposalIds.add(democracyProposalId);
      }
    }

    return this.ctx.store.findBy(DemocracyProposal, {
      id: In([...democracyProposalIds]),
    });
  }
}
