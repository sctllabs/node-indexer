export function buildProposalId(daoId: number | string, index: number): string {
  return `${daoId}-${index}`;
}
