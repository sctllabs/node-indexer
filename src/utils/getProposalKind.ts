import {
  Call as CallV100,
  DaoBountiesCall_propose_curator,
  DaoBountiesCall_unassign_curator,
  DaoCall_mint_dao_token,
  DaoCall_update_dao_metadata,
  DaoCall_update_dao_policy,
} from "../types/v100";
import { Call as CallV101 } from "../types/v101";
import { Call as CallV102 } from "../types/v102";
import { Call as CallV103 } from "../types/v103";
import {
  AddMember,
  CreateBounty,
  CreateTokenBounty,
  MintDaoToken,
  ProposeCurator,
  RemoveMember,
  Spend,
  TransferToken,
  UnassignCurator,
  UpdateDaoMetadata,
  UpdateDaoPolicy,
} from "../model";
import { decodeAddress } from "./decodeAddress";
import { decodeString } from "./decodeString";

export function getProposalKind(
  proposal: CallV100 | CallV101 | CallV102 | CallV103
) {
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
    case "transfer_token": {
      return new TransferToken({
        beneficiary: decodeAddress(
          proposal.value.beneficiary.value as Uint8Array
        ),
        amount: proposal.value.amount,
      });
    }
    case "create_bounty": {
      return new CreateBounty({
        daoId: proposal.value.daoId,
        value: proposal.value.value,
        description: decodeString(proposal.value.description),
      });
    }
    case "create_token_bounty": {
      return new CreateTokenBounty({
        daoId: proposal.value.daoId,
        tokenId: proposal.value.tokenId,
        value: proposal.value.value,
        description: decodeString(proposal.value.description),
      });
    }
    case "propose_curator": {
      const { bountyId, curator, fee } =
        proposal.value as DaoBountiesCall_propose_curator;
      return new ProposeCurator({
        bountyId,
        fee,
        curator: decodeAddress(curator),
      });
    }
    case "unassign_curator": {
      const { daoId, bountyId } =
        proposal.value as DaoBountiesCall_unassign_curator;
      return new UnassignCurator({
        bountyId,
        daoId,
      });
    }
    case "update_dao_metadata": {
      const { daoId, metadata } = proposal.value as DaoCall_update_dao_metadata;
      return new UpdateDaoMetadata({
        daoId,
        metadata: decodeString(metadata),
      });
    }
    case "update_dao_policy": {
      const { daoId, policy } = proposal.value as DaoCall_update_dao_policy;
      return new UpdateDaoPolicy({
        daoId,
        policy: decodeString(policy),
      });
    }
    case "mint_dao_token": {
      const { daoId, amount } = proposal.value as DaoCall_mint_dao_token;
      return new MintDaoToken({
        daoId,
        amount,
      });
    }
    default: {
      throw new Error(
        `Proposal method ${proposal.value.__kind} does not exist`
      );
    }
  }
}
