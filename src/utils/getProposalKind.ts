import { Call, DaoBountiesCall_propose_curator } from "../types/v100";
import {
  AddMember,
  CreateBounty,
  CreateTokenBounty,
  ProposeCurator,
  RemoveMember,
  Spend,
  TransferToken,
} from "../model";
import { decodeAddress } from "./decodeAddress";
import { decodeString } from "./decodeString";

export function getProposalKind(proposal: Call) {
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
    default: {
      throw new Error(
        `Proposal method ${proposal.value.__kind} does not exist`
      );
    }
  }
}
