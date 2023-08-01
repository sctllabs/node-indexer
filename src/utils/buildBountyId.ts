export function buildBountyId(daoId: number, index: number): string {
  return `${daoId}-${index}`;
}
