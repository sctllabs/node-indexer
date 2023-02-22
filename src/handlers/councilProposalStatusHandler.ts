import { In } from "typeorm";
import type { Ctx } from "../processor";
import type { EventInfo } from "../processorHandler";
import { Account, Dao, CouncilProposal, CouncilProposalStatus } from "../model";
import {
  DaoCouncilApprovedEvent,
  DaoCouncilClosedEvent,
  DaoCouncilDisapprovedEvent,
  DaoCouncilExecutedEvent,
} from "../types/events";
import { getAccount } from "../utils";

type ProposalEvents = {
  approvedCouncilProposalEvents: EventInfo<DaoCouncilApprovedEvent>[];
  disapprovedCouncilProposalEvents: EventInfo<DaoCouncilDisapprovedEvent>[];
  closedCouncilProposalEvents: EventInfo<DaoCouncilClosedEvent>[];
  executedCouncilProposalEvents: EventInfo<DaoCouncilExecutedEvent>[];
};

type ProposalEventsKind = keyof ProposalEvents;

export async function councilProposalStatusHandler(
  ctx: Ctx,
  proposalEvents: ProposalEvents,
  accounts: Map<string, Account>,
  proposals: Map<string, CouncilProposal>,
  daos: Map<string, Dao>
) {
  const proposalsToUpdate: Map<string, CouncilProposal> = new Map();

  const proposalsQuery = await getProposals(ctx, proposalEvents, proposals);
  const proposalsQueryMap = new Map(
    proposalsQuery.map((_proposalQuery) => [_proposalQuery.id, _proposalQuery])
  );
  Object.entries(proposalEvents).forEach(
    ([_proposalEventsKindType, _proposalEventsKind]) =>
      updateProposalStatuses(
        proposalsToUpdate,
        proposals,
        proposalsQueryMap,
        _proposalEventsKind,
        _proposalEventsKindType as ProposalEventsKind
      )
  );

  const daosQuery = await getDaos(
    ctx,
    daos,
    proposals,
    proposalsToUpdate,
    proposalEvents.executedCouncilProposalEvents
  );
  const daosQueryMap = new Map(
    daosQuery.map((_daoQuery) => [_daoQuery.id, _daoQuery])
  );
  const daosToUpdate = updateDaos(
    daos,
    daosQueryMap,
    accounts,
    proposals,
    proposalsToUpdate,
    proposalEvents.executedCouncilProposalEvents
  );

  return { proposalsToUpdate, daosToUpdate };
}

function updateDaos(
  daos: Map<string, Dao>,
  daosQueryMap: Map<string, Dao>,
  accounts: Map<string, Account>,
  proposals: Map<string, CouncilProposal>,
  proposalsToUpdate: Map<string, CouncilProposal>,
  executedEvents: EventInfo<DaoCouncilExecutedEvent>[]
) {
  const daosToUpdate: Map<string, Dao> = new Map();
  executedEvents.forEach((_executedEvent) => {
    const { daoId, proposalIndex } = _executedEvent.event.asV100;
    const proposalId = `${daoId}-${proposalIndex}`;
    const proposal =
      proposals.get(proposalId) ?? proposalsToUpdate.get(proposalId);

    if (!proposal) {
      throw new Error(`Proposal with id: ${proposalId} not found.`);
    }

    const dao =
      daos.get(daoId.toString()) ?? daosQueryMap.get(daoId.toString());

    if (!dao) {
      throw new Error(`Dao with id: ${daoId} not found.`);
    }

    if (
      proposal.kind.isTypeOf === "AddMember" ||
      proposal.kind.isTypeOf === "RemoveMember"
    ) {
      const account = getAccount(accounts, proposal.kind.who);

      dao.council =
        proposal.kind.isTypeOf === "AddMember"
          ? [...dao.council, account.id]
          : dao.council.filter((_address) => _address !== account.id);
      daosToUpdate.set(dao.id, dao);
    }
  });
  return daosToUpdate;
}

function getDaos(
  ctx: Ctx,
  daos: Map<string, Dao>,
  proposals: Map<string, CouncilProposal>,
  proposalsToUpdate: Map<string, CouncilProposal>,
  executedEvents: EventInfo<DaoCouncilExecutedEvent>[]
) {
  const daoIds = new Set<string>();
  executedEvents.forEach((_executedEvent) => {
    const { daoId, proposalIndex } = _executedEvent.event.asV100;

    if (daos.get(daoId.toString())) {
      return;
    }

    const proposalId = `${daoId}-${proposalIndex}`;

    const proposal =
      proposals.get(proposalId) ?? proposalsToUpdate.get(proposalId);

    if (!proposal) {
      throw new Error(`Proposal with id: ${proposalId} not found.`);
    }

    daoIds.add(daoId.toString());
  });

  return ctx.store.findBy(Dao, {
    id: In([...daoIds]),
  });
}

function getProposals(
  ctx: Ctx,
  proposalEvents: ProposalEvents,
  proposals: Map<string, CouncilProposal>
) {
  const proposalIds = new Set<string>();
  Object.values(proposalEvents).map((_proposalEventsKind) =>
    getProposalIds(proposals, _proposalEventsKind, proposalIds)
  );

  return ctx.store.findBy(CouncilProposal, {
    id: In([...proposalIds]),
  });
}

function getProposalIds(
  proposals: Map<string, CouncilProposal>,
  proposalEvents: EventInfo<
    | DaoCouncilApprovedEvent
    | DaoCouncilDisapprovedEvent
    | DaoCouncilClosedEvent
    | DaoCouncilExecutedEvent
  >[],
  proposalIds: Set<string>
) {
  for (const { event } of proposalEvents) {
    if (!event.isV100) {
      throw new Error("Unsupported status spec");
    }

    const { daoId, proposalIndex } = event.asV100;
    const proposalId = `${daoId}-${proposalIndex}`;
    if (!proposals.get(proposalId)) {
      proposalIds.add(proposalId);
    }
  }
}

function updateProposalStatuses(
  proposalsToUpdate: Map<string, CouncilProposal>,
  proposals: Map<string, CouncilProposal>,
  proposalsQueryMap: Map<string, CouncilProposal>,
  proposalEvents: EventInfo<
    | DaoCouncilApprovedEvent
    | DaoCouncilDisapprovedEvent
    | DaoCouncilClosedEvent
    | DaoCouncilExecutedEvent
  >[],
  kind: ProposalEventsKind
) {
  for (const { event } of proposalEvents) {
    const { daoId, proposalIndex } = event.asV100;
    const proposalId = `${daoId}-${proposalIndex}`;
    const proposal =
      proposals.get(proposalId) ?? proposalsQueryMap.get(proposalId);

    if (!proposal) {
      throw new Error(`Proposal with id: ${proposalId} not found.`);
    }

    let status: CouncilProposalStatus;
    switch (kind) {
      case "approvedCouncilProposalEvents": {
        status = CouncilProposalStatus.Approved;
        break;
      }
      case "disapprovedCouncilProposalEvents": {
        status = CouncilProposalStatus.Disapproved;
        break;
      }
      case "closedCouncilProposalEvents": {
        status = CouncilProposalStatus.Closed;
        break;
      }
      case "executedCouncilProposalEvents": {
        status = CouncilProposalStatus.Executed;
        break;
      }
    }
    proposal.status = status;
    proposalsToUpdate.set(proposal.id, proposal);
  }
}
