import {
  DaoCouncilMembersMemberAddedEvent,
  DaoCouncilMembersMemberRemovedEvent,
} from "../types/events";
import { BaseHandler } from "./baseHandler";
import { Dao } from "../model";
import { decodeAddress } from "../utils";
import type { Ctx } from "../processor";
import type { EventInfo } from "../types";

export class CouncilMembersEventHandler extends BaseHandler<unknown> {
  constructor(ctx: Ctx) {
    super(ctx);
  }

  protected arrayToMap(value: unknown[]) {
    throw new Error("Method not implemented");
  }

  protected insert() {
    throw new Error("Method not implemented");
  }

  protected save() {
    throw new Error("Method not implemented");
  }

  process(
    {
      event,
      blockNum,
      blockHash,
      timestamp,
    }: EventInfo<
      DaoCouncilMembersMemberAddedEvent | DaoCouncilMembersMemberRemovedEvent
    >,
    daosToInsert: Map<string, Dao>,
    daosToUpdate: Map<string, Dao>,
    daosQueryMap: Map<string, Dao>
  ) {
    let daoId, member;
    if (event.isV100) {
      ({ daoId, member } = event.asV100);
    } else {
      throw new Error("Unsupported council members spec");
    }

    const dao =
      daosToInsert.get(daoId.toString()) ?? daosQueryMap.get(daoId.toString());

    if (!dao) {
      throw new Error(`Dao with id: ${daoId} not found.`);
    }

    const account = decodeAddress(member);

    if (event instanceof DaoCouncilMembersMemberAddedEvent) {
      dao.council = dao.council.includes(account)
        ? dao.council
        : [...dao.council, account];
    } else {
      dao.council = dao.council.filter((_address) => _address !== account);
    }

    daosToUpdate.set(dao.id, dao);
  }

  prepareQuery(
    event:
      | DaoCouncilMembersMemberAddedEvent
      | DaoCouncilMembersMemberRemovedEvent,
    daoIds: Set<string>
  ) {
    if (event.isV100) {
      const { daoId } = event.asV100;
      daoIds.add(daoId.toString());
    } else {
      throw new Error("Unsupported council members spec");
    }
  }
}
