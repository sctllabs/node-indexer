export function mapArrayById<T extends { id: string }>(
  array: T[]
): Map<string, T> {
  return new Map<string, T>(array.map((item) => [item.id, item]));
}
