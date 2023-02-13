import { In } from "typeorm";
import { Ctx } from "../processor";
import {
  Account,
  AddMember,
  Dao,
  Proposal,
  RemoveMember,
  Spend,
} from "../model";
import { DaoCouncilProposedEvent } from "../types/events";
import { decodeAddress, getAccount } from "../utils";
import * as v100 from "../types/v100";

export async function proposalHandler(
  ctx: Ctx,
  proposalEvents: DaoCouncilProposedEvent[],
  daos: Map<string, Dao>,
  accounts: Map<string, Account>
) {
  const proposals: Map<string, Proposal> = new Map();
  const [accountsQuery, daosQuery] = await getAccountsAndDaos(
    ctx,
    proposalEvents,
    daos,
    accounts
  );
  accountsQuery.map((_accountQuery) =>
    accounts.set(_accountQuery.id, _accountQuery)
  );
  const daosQueryMap = new Map(
    daosQuery.map((_daoQuery) => [_daoQuery.id, _daoQuery])
  );

  for (const proposalEvent of proposalEvents) {
    if (!proposalEvent.isV100) {
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
    } = proposalEvent.asV100;

    const dao =
      daos.get(daoId.toString()) ?? daosQueryMap.get(daoId.toString());

    if (!dao) {
      throw new Error(`Dao with id: ${daoId} not found`);
    }

    const kind = getProposalKind(proposal);
    const hash = Buffer.from(proposalHash).toString("hex");

    proposals.set(
      hash,
      new Proposal({
        id: hash,
        hash: hash,
        index: proposalIndex.toString(),
        account: getAccount(accounts, decodeAddress(account)),
        meta: meta?.toString(),
        voteThreshold: threshold,
        kind,
        dao,
      })
    );
  }
  return proposals;
}

function getProposalKind(proposal: v100.Call) {
  switch (proposal.value.__kind) {
    case "add_member": {
      return new AddMember({
        who: decodeAddress(proposal.value.who as Uint8Array),
      });
    }
    case "remove_member": {
      return new RemoveMember({
        who: decodeAddress(proposal.value.who as Uint8Array),
      });
    }
    case "spend": {
      return new Spend({
        beneficiary: decodeAddress(
          proposal.value.beneficiary.value as Uint8Array
        ),
        amount: proposal.value.amount,
      });
    }
    default: {
      throw new Error(
        `Proposal method ${proposal.value.__kind} does not exist`
      );
    }
  }
}

function getAccountsAndDaos(
  ctx: Ctx,
  proposalEvents: DaoCouncilProposedEvent[],
  daoCandidates: Map<string, Dao>,
  accounts: Map<string, Account>
) {
  const accountIds = new Set<string>();
  const daoIds = new Set<string>();

  for (const proposalEvent of proposalEvents) {
    if (!proposalEvent.isV100) {
      throw new Error("Unsupported proposal spec");
    }

    const { daoId, account } = proposalEvent.asV100;
    const accountAddress = decodeAddress(account);
    if (!daoCandidates.get(daoId.toString())) {
      daoIds.add(daoId.toString());
    }
    if (!accounts.get(accountAddress)) {
      accountIds.add(accountAddress);
    }
  }
  return Promise.all([
    ctx.store.findBy(Account, {
      id: In([...accountIds]),
    }),
    ctx.store.findBy(Dao, {
      id: In([...daoIds]),
    }),
  ]);
}
