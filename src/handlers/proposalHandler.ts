import { Ctx } from "../processor";
import { AddMember, Dao, Proposal, RemoveMember, Spend } from "../model";
import { DaoCouncilProposedEvent } from "../types/events";
import { In } from "typeorm";
import { decodeAddress } from "../utils/decodeAddress";
import * as v100 from "../types/v100";

export async function proposalHandler(
  ctx: Ctx,
  proposalEvents: DaoCouncilProposedEvent[],
  daoCandidates: Dao[]
) {
  const proposals: Proposal[] = [];

  const daosQuery = await getDaos(ctx, proposalEvents, daoCandidates);

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
      daoCandidates.find(
        (_daoCandidate) => _daoCandidate.id === daoId.toString()
      ) ?? daosQuery.find((_daoQuery) => _daoQuery.id === daoId.toString());

    const kind = getProposalKind(proposal);

    const hash = Buffer.from(proposalHash).toString("hex");

    proposals.push(
      new Proposal({
        id: hash,
        hash: hash,
        index: proposalIndex.toString(),
        account: decodeAddress(account),
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

function getDaos(
  ctx: Ctx,
  proposalEvents: DaoCouncilProposedEvent[],
  daoCandidates: Dao[]
) {
  const daoIds = new Set<string>();
  for (const proposalEvent of proposalEvents) {
    if (!proposalEvent.isV100) {
      throw new Error("Unsupported proposal spec");
    }

    const { daoId } = proposalEvent.asV100;
    if (
      !daoCandidates.find(
        (_daoCandidate) => _daoCandidate.id === daoId.toString()
      )
    ) {
      daoIds.add(daoId.toString());
    }
  }
  return ctx.store.findBy(Dao, {
    id: In([...daoIds]),
  });
}
