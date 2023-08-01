import {
  AssetsMetadataSetEvent,
  DaoBountiesBountyAwardedEvent,
  DaoBountiesBountyBecameActiveEvent,
  DaoBountiesBountyCanceledEvent,
  DaoBountiesBountyClaimedEvent,
  DaoBountiesBountyCreatedEvent,
  DaoBountiesBountyCuratorAcceptedEvent,
  DaoBountiesBountyCuratorProposedEvent,
  DaoBountiesBountyCuratorUnassignedEvent,
  DaoBountiesBountyExtendedEvent,
  DaoBountiesDaoPurgedEvent,
  DaoCouncilApprovedEvent,
  DaoCouncilClosedEvent,
  DaoCouncilDaoPurgedEvent,
  DaoCouncilDisapprovedEvent,
  DaoCouncilExecutedEvent,
  DaoCouncilMembersMemberAddedEvent,
  DaoCouncilMembersMemberRemovedEvent,
  DaoCouncilProposedEvent,
  DaoCouncilVotedEvent,
  DaoDaoMetadataUpdatedEvent,
  DaoDaoPolicyUpdatedEvent,
  DaoDaoRegisteredEvent,
  DaoDaoRemovedEvent,
  DaoDemocracyCancelledEvent,
  DaoDemocracyDaoPurgedEvent,
  DaoDemocracyDelegatedEvent,
  DaoDemocracyNotPassedEvent,
  DaoDemocracyPassedEvent,
  DaoDemocracyProposedEvent,
  DaoDemocracySecondedEvent,
  DaoDemocracyStartedEvent,
  DaoDemocracyUndelegatedEvent,
  DaoDemocracyVotedEvent,
  DaoEthGovernanceApprovedEvent,
  DaoEthGovernanceClosedEvent,
  DaoEthGovernanceDaoPurgedEvent,
  DaoEthGovernanceDisapprovedEvent,
  DaoEthGovernanceExecutedEvent,
  DaoEthGovernanceProposedEvent,
  DaoEthGovernanceVotedEvent,
} from "./types/events";

export type EventInfo<T> = {
  event: T;
  blockNum: number;
  blockHash: string;
  timestamp: number;
};

export type EventType =
  | DaoDaoRegisteredEvent
  | DaoDaoMetadataUpdatedEvent
  | DaoDaoPolicyUpdatedEvent
  | DaoDaoRemovedEvent
  | AssetsMetadataSetEvent
  | DaoCouncilVotedEvent
  | DaoCouncilProposedEvent
  | DaoCouncilApprovedEvent
  | DaoCouncilDisapprovedEvent
  | DaoCouncilExecutedEvent
  | DaoCouncilClosedEvent
  | DaoCouncilDaoPurgedEvent
  | DaoDemocracyProposedEvent
  | DaoDemocracySecondedEvent
  | DaoDemocracyPassedEvent
  | DaoDemocracyNotPassedEvent
  | DaoDemocracyStartedEvent
  | DaoDemocracyCancelledEvent
  | DaoDemocracyDelegatedEvent
  | DaoDemocracyUndelegatedEvent
  | DaoDemocracyVotedEvent
  | DaoDemocracyDaoPurgedEvent
  | DaoCouncilMembersMemberAddedEvent
  | DaoCouncilMembersMemberRemovedEvent
  | DaoBountiesBountyCreatedEvent
  | DaoBountiesBountyBecameActiveEvent
  | DaoBountiesBountyCuratorProposedEvent
  | DaoBountiesBountyCuratorUnassignedEvent
  | DaoBountiesBountyCuratorAcceptedEvent
  | DaoBountiesBountyAwardedEvent
  | DaoBountiesBountyClaimedEvent
  | DaoBountiesBountyCanceledEvent
  | DaoBountiesBountyExtendedEvent
  | DaoBountiesDaoPurgedEvent
  | DaoEthGovernanceApprovedEvent
  | DaoEthGovernanceClosedEvent
  | DaoEthGovernanceDisapprovedEvent
  | DaoEthGovernanceExecutedEvent
  | DaoEthGovernanceProposedEvent
  | DaoEthGovernanceVotedEvent
  | DaoEthGovernanceDaoPurgedEvent;

export type EventsInfo = EventInfo<EventType>[];
