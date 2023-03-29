import { Ctx } from "../processor";

export abstract class BaseHandler<T> {
  protected readonly _ctx: Ctx;

  protected constructor(ctx: Ctx) {
    this._ctx = ctx;
  }

  protected abstract save(): void;
  protected abstract insert(): void;
  protected abstract arrayToMap(value: T[]): void;
}
