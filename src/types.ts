import {
  AssetsMetadataSetEvent,
  DaoCouncilApprovedEvent,
  DaoCouncilClosedEvent,
  DaoCouncilDisapprovedEvent,
  DaoCouncilExecutedEvent,
  DaoCouncilProposedEvent,
  DaoCouncilVotedEvent,
  DaoDaoRegisteredEvent,
  DaoDemocracyCancelledEvent,
  DaoDemocracyDelegatedEvent,
  DaoDemocracyNotPassedEvent,
  DaoDemocracyPassedEvent,
  DaoDemocracyProposedEvent,
  DaoDemocracySecondedEvent,
  DaoDemocracyStartedEvent,
  DaoDemocracyUndelegatedEvent,
  DaoDemocracyVotedEvent,
} from "./types/events";
import {
  Account,
  CouncilProposal,
  CouncilVoteHistory,
  Dao,
  DemocracyDelegation,
  DemocracyProposal,
  DemocracyReferendum,
  DemocracySecond,
  FungibleToken,
  Policy,
} from "./model";

export type EventInfo<T> = {
  event: T;
  blockNum: number;
  blockHash: string;
  timestamp: number;
};

export type EventsInfo = {
  daoEvents: EventInfo<DaoDaoRegisteredEvent>[];
  tokenEvents: EventInfo<AssetsMetadataSetEvent>[];
  voteEvents: EventInfo<DaoCouncilVotedEvent>[];
  councilProposalEvents: EventInfo<DaoCouncilProposedEvent>[];
  approvedCouncilProposalEvents: EventInfo<DaoCouncilApprovedEvent>[];
  disapprovedCouncilProposalEvents: EventInfo<DaoCouncilDisapprovedEvent>[];
  executedCouncilProposalEvents: EventInfo<DaoCouncilExecutedEvent>[];
  closedCouncilProposalEvents: EventInfo<DaoCouncilClosedEvent>[];
  democracyProposalEvents: EventInfo<DaoDemocracyProposedEvent>[];
  democracySecondEvents: EventInfo<DaoDemocracySecondedEvent>[];
  democracyPassedEvents: EventInfo<DaoDemocracyPassedEvent>[];
  democracyNotPassedEvents: EventInfo<DaoDemocracyNotPassedEvent>[];
  democracyStartedEvents: EventInfo<DaoDemocracyStartedEvent>[];
  democracyCancelledEvents: EventInfo<DaoDemocracyCancelledEvent>[];
  democracyDelegatedEvents: EventInfo<DaoDemocracyDelegatedEvent>[];
  democracyUndelegatedEvents: EventInfo<DaoDemocracyUndelegatedEvent>[];
  democracyVotedEvents: EventInfo<DaoDemocracyVotedEvent>[];
};

export type DataBatch = {
  accounts: Map<string, Account>;
  daosToInsert: Map<string, Dao>;
  daosToUpdate: Map<string, Dao>;
  policiesToInsert: Map<string, Policy>;
  fungibleTokens: Map<string, FungibleToken>;
  councilProposalsToInsert: Map<string, CouncilProposal>;
  councilProposalsToUpdate: Map<string, CouncilProposal>;
  councilVotesToInsert: Map<string, CouncilVoteHistory>;
  councilVotesToUpdate: Map<string, CouncilVoteHistory>;
  democracyProposalsToInsert: Map<string, DemocracyProposal>;
  democracyProposalsToUpdate: Map<string, DemocracyProposal>;
  democracySecondsToInsert: Map<string, DemocracySecond>;
  democracySecondsToUpdate: Map<string, DemocracySecond>;
  democracyReferendumsToInsert: Map<string, DemocracyReferendum>;
  democracyReferendumsToUpdate: Map<string, DemocracyReferendum>;
  democracyDelegationsToInsert: Map<string, DemocracyDelegation>;
  democracyDelegationsToRemove: string[];
};
