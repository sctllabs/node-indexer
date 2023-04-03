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
  DaoCouncilApprovedEvent,
  DaoCouncilClosedEvent,
  DaoCouncilDisapprovedEvent,
  DaoCouncilExecutedEvent,
  DaoCouncilMembersMemberAddedEvent,
  DaoCouncilMembersMemberRemovedEvent,
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
  DaoEthGovernanceApprovedEvent,
  DaoEthGovernanceClosedEvent,
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
  | AssetsMetadataSetEvent
  | DaoCouncilVotedEvent
  | DaoCouncilProposedEvent
  | DaoCouncilApprovedEvent
  | DaoCouncilDisapprovedEvent
  | DaoCouncilExecutedEvent
  | DaoCouncilClosedEvent
  | DaoDemocracyProposedEvent
  | DaoDemocracySecondedEvent
  | DaoDemocracyPassedEvent
  | DaoDemocracyNotPassedEvent
  | DaoDemocracyStartedEvent
  | DaoDemocracyCancelledEvent
  | DaoDemocracyDelegatedEvent
  | DaoDemocracyUndelegatedEvent
  | DaoDemocracyVotedEvent
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
  | DaoEthGovernanceApprovedEvent
  | DaoEthGovernanceClosedEvent
  | DaoEthGovernanceDisapprovedEvent
  | DaoEthGovernanceExecutedEvent
  | DaoEthGovernanceProposedEvent
  | DaoEthGovernanceVotedEvent;

export type EventsInfo = EventInfo<EventType>[];
