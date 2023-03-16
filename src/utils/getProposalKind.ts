import { Call } from "../types/v100";
import { AddMember, RemoveMember, Spend, TransferToken } from "../model";
import { decodeAddress } from "./decodeAddress";

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
    default: {
      throw new Error(
        `Proposal method ${proposal.value.__kind} does not exist`
      );
    }
  }
}
