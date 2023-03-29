import { Account } from "../model";

export function getAccount(
  accounts: Map<string, Account>,
  id: string
): Account {
  let acc = accounts.get(id);
  if (acc == null) {
    acc = new Account();
    acc.id = id;
    accounts.set(id, acc);
  }
  return acc;
}
