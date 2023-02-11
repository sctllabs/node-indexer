import { Ctx } from "../processor";
import { DaoCouncilVotedEvent } from "../types/events";
import { VoteHistory } from "../model";

export async function voteHandler(
  ctx: Ctx,
  voteEvents: DaoCouncilVotedEvent[]
) {
  const votes: Map<string, VoteHistory> = new Map();
  return votes;
}
