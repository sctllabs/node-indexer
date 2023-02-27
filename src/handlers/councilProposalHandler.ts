import { In } from "typeorm";
import type { Ctx } from "../processor";
import type { EventInfo } from "../processorHandler";
import { Account, Dao, CouncilProposal, CouncilProposalStatus } from "../model";
import { DaoCouncilProposedEvent } from "../types/events";
import { decodeAddress, getAccount } from "../utils";
import { decodeHash } from "../utils/decodeHash";
import { getProposalKind } from "../utils/getProposalKind";

export async function councilProposalHandler(
  ctx: Ctx,
  proposalEvents: EventInfo<DaoCouncilProposedEvent>[],
  daos: Map<string, Dao>,
  accounts: Map<string, Account>
) {
  const proposals: Map<string, CouncilProposal> = new Map();
  const [accountsQuery, daosQuery] = await getAccountsAndDaos(
    ctx,
    proposalEvents,
    daos,
    accounts
  );
  accountsQuery.forEach((_accountQuery) =>
    accounts.set(_accountQuery.id, _accountQuery)
  );
  const daosQueryMap = new Map(
    daosQuery.map((_daoQuery) => [_daoQuery.id, _daoQuery])
  );

  for (const { event, timestamp, blockHash, blockNum } of proposalEvents) {
    if (!event.isV100) {
      throw new Error("Unsupported proposal spec");
    }

    const {
      proposal,
      proposalHash,
      proposalIndex,
      account,
      meta,
      threshold,
      daoId,
    } = event.asV100;

    const dao =
      daos.get(daoId.toString()) ?? daosQueryMap.get(daoId.toString());

    if (!dao) {
      throw new Error(`Dao with id: ${daoId} not found`);
    }

    const kind = getProposalKind(proposal);
    const hash = decodeHash(proposalHash);
    const id = `${dao.id}-${proposalIndex}`;

    proposals.set(
      id,
      new CouncilProposal({
        id,
        hash,
        index: proposalIndex.toString(),
        account: getAccount(accounts, decodeAddress(account)),
        meta: meta?.toString(),
        voteThreshold: threshold,
        kind,
        dao,
        blockHash,
        status: CouncilProposalStatus.Open,
        blockNum,
        createdAt: new Date(timestamp),
      })
    );
  }
  return proposals;
}

function getAccountsAndDaos(
  ctx: Ctx,
  proposalEvents: EventInfo<DaoCouncilProposedEvent>[],
  daoCandidates: Map<string, Dao>,
  accounts: Map<string, Account>
) {
  const accountIds = new Set<string>();
  const daoIds = new Set<string>();

  for (const { event } of proposalEvents) {
    if (!event.isV100) {
      throw new Error("Unsupported proposal spec");
    }

    const { daoId, account } = event.asV100;
    const accountAddress = decodeAddress(account);
    if (!daoCandidates.get(daoId.toString())) {
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
