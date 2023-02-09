import { FungibleToken } from "../model";

export function getAccount(
  m: Map<string, FungibleToken>,
  id: string
): FungibleToken {
  let acc = m.get(id);
  if (acc == null) {
    acc = new FungibleToken();
    acc.id = id;
    m.set(id, acc);
  }
  return acc;
}
