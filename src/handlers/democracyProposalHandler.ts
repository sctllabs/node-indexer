import { In } from "typeorm";
import type { Ctx } from "../processor";
import type { EventInfo } from "../processorHandler";
import { DaoDemocracyProposedEvent } from "../types/events";
import {
  Account,
  Dao,
  DemocracyProposal,
  DemocracyProposalStatus,
} from "../model";
import { decodeAddress, getAccount } from "../utils";
import { getProposalKind } from "../utils/getProposalKind";

export async function democracyProposalHandler(
  ctx: Ctx,
  democracyProposedEvents: EventInfo<DaoDemocracyProposedEvent>[],
  daos: Map<string, Dao>,
  accounts: Map<string, Account>
) {
  const democracyProposals: Map<string, DemocracyProposal> = new Map();
  const [accountsQuery, daosQuery] = await getAccountsAndDaos(
    ctx,
    democracyProposedEvents,
    daos,
    accounts
  );
  accountsQuery.forEach((_accountsQuery) =>
    accounts.set(_accountsQuery.id, _accountsQuery)
  );
  const daosQueryMap = new Map(
    daosQuery.map((_daoQuery) => [_daoQuery.id, _daoQuery])
  );

  for (const {
    event,
    timestamp,
    blockHash,
    blockNum,
  } of democracyProposedEvents) {
    if (!event.isV100) {
      throw new Error("Unsupported proposal spec");
    }

    const { daoId, account, proposalIndex, proposal, deposit, meta } =
      event.asV100;

    const dao =
      daos.get(daoId.toString()) ?? daosQueryMap.get(daoId.toString());

    if (!dao) {
      throw new Error(`Dao with id: ${daoId} not found`);
    }

    const kind = getProposalKind(proposal);
    const id = `${dao.id}-${proposalIndex}`;
    democracyProposals.set(
      id,
      new DemocracyProposal({
        id,
        index: proposalIndex.toString(),
        account: getAccount(accounts, decodeAddress(account)),
        dao,
        deposit,
        kind,
        meta: meta?.toString(),
        createdAt: new Date(timestamp),
        blockHash,
        blockNum,
        status: DemocracyProposalStatus.Open,
      })
    );
  }
  return democracyProposals;
}

function getAccountsAndDaos(
  ctx: Ctx,
  democracyProposedEvents: EventInfo<DaoDemocracyProposedEvent>[],
  daos: Map<string, Dao>,
  accounts: Map<string, Account>
) {
  const accountIds = new Set<string>();
  const daoIds = new Set<string>();

  for (const { event } of democracyProposedEvents) {
    if (!event.isV100) {
      throw new Error("Unsupported proposal spec");
    }

    const { daoId, account } = event.asV100;
    const accountAddress = decodeAddress(account);

    if (!daos.get(daoId.toString())) {
      daoIds.add(daoId.toString());
    }
    if (!accounts.get(accountAddress)) {
      accountIds.add(accountAddress);
    }
  }
  return Promise.all([
    ctx.store.findBy(Account, { id: In([...accountIds]) }),
    ctx.store.findBy(Dao, { id: In([...daoIds]) }),
  ]);
}
