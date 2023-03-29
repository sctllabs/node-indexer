import { In } from "typeorm";
import { Account } from "../model";
import { BaseHandler } from "./baseHandler";
import type { Ctx } from "../processor";

export class AccountHandler extends BaseHandler<Account> {
  private readonly _accounts: Map<string, Account>;
  private readonly _accountsQueryMap: Map<string, Account>;
  private readonly _accountIds: Set<string>;

  constructor(ctx: Ctx) {
    super(ctx);
    this._accounts = new Map<string, Account>();
    this._accountsQueryMap = new Map<string, Account>();
    this._accountIds = new Set<string>();
  }

  get accounts() {
    return this._accounts;
  }

  get accountIds() {
    return this._accountIds;
  }

  arrayToMap(accounts: Account[]) {
    for (const account of accounts) {
      this._accountsQueryMap.set(account.id, account);
    }
  }

  protected insert() {
    throw new Error("Method not implemented");
  }

  query() {
    return this._ctx.store.findBy(Account, { id: In([...this.accountIds]) });
  }

  save() {
    return this._ctx.store.save([...this._accounts.values()]);
  }
}
