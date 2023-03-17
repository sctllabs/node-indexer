import { In } from "typeorm";
import { Dao } from "../model";
import {
  DaoCouncilMembersMemberAddedEvent,
  DaoCouncilMembersMemberRemovedEvent,
} from "../types/events";
import { decodeAddress, getAccount } from "../utils";

import type { EventInfo } from "../types";
import type { Ctx } from "../processor";

type CouncilMembersEvents = {
  addedCouncilMembersEvents: EventInfo<DaoCouncilMembersMemberAddedEvent>[];
  removedCouncilMembersEvents: EventInfo<DaoCouncilMembersMemberRemovedEvent>[];
};

export class CouncilMembersEventHandler {
  ctx: Ctx;
  councilMembersEvents: CouncilMembersEvents;

  constructor(ctx: Ctx, councilMembersEvents: CouncilMembersEvents) {
    this.ctx = ctx;
    this.councilMembersEvents = councilMembersEvents;
  }

  async handle(daosToInsert: Map<string, Dao>) {
    const [daosQuery] = await this.getDaos(daosToInsert);
    const daosQueryMap = new Map(
      daosQuery.map((_daoQuery) => [_daoQuery.id, _daoQuery])
    );

    const daosToUpdate = this.updateDaos(daosToInsert, daosQueryMap);

    return { daosToUpdate };
  }

  private getDaos(daosToInsert: Map<string, Dao>) {
    const daoIds = new Set<number>();
    Object.values(this.councilMembersEvents).map(
      (_councilMembersEventsKind) => {
        for (const { event } of _councilMembersEventsKind) {
          if (!event.isV100) {
            throw new Error("Unsupported proposal spec");
          }

          const { daoId } = event.asV100;
          if (!daosToInsert.get(daoId.toString())) {
            daoIds.add(daoId);
          }
        }
      }
    );

    return Promise.all([this.ctx.store.findBy(Dao, { id: In([...daoIds]) })]);
  }

  private updateDaos(
    daosToInsert: Map<string, Dao>,
    daosQueryMap: Map<string, Dao>
  ) {
    const daosToUpdate = new Map<string, Dao>();

    // TODO: cache DAO queries
    Object.values(this.councilMembersEvents).map(
      (_councilMembersEventsKind) => {
        for (const { event } of _councilMembersEventsKind) {
          const { daoId, member } = event.asV100;

          const dao =
            daosToInsert.get(daoId.toString()) ??
            daosQueryMap.get(daoId.toString());

          if (!dao) {
            throw new Error(`Dao with id: ${daoId} not found.`);
          }

          const account = decodeAddress(member);

          if (event instanceof DaoCouncilMembersMemberAddedEvent) {
            dao.council = dao.council.includes(account)
              ? dao.council
              : [...dao.council, account];
          } else if (event instanceof DaoCouncilMembersMemberRemovedEvent) {
            dao.council = dao.council.filter(
              (_address) => _address !== account
            );
          }

          daosToUpdate.set(dao.id, dao);
        }
      }
    );

    return daosToUpdate;
  }
}
