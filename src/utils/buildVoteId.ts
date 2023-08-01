export function buildVoteId(
  daoId: number,
  index: number,
  address: string
): string {
  return `${daoId}-${index}-${address}`;
}
