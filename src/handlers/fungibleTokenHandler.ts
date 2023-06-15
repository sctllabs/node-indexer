import { In } from "typeorm";
import { AssetsMetadataSetEvent } from "../types/events";
import { FungibleToken } from "../model";
import type { Ctx } from "../processor";
import type { EventInfo } from "../types";
import { BaseHandler } from "./baseHandler";

export class FungibleTokenHandler extends BaseHandler<FungibleToken> {
  private readonly _fungibleTokensToInsert: Map<string, FungibleToken>;
  private readonly _fungibleTokensQueryMap: Map<string, FungibleToken>;
  private readonly _fungibleTokenIds: Set<string>;

  constructor(ctx: Ctx) {
    super(ctx);
    this._fungibleTokensToInsert = new Map<string, FungibleToken>();
    this._fungibleTokensQueryMap = new Map<string, FungibleToken>();
    this._fungibleTokenIds = new Set<string>();
  }

  get fungibleTokensToInsert() {
    return this._fungibleTokensToInsert;
  }

  get fungibleTokensQueryMap() {
    return this._fungibleTokensQueryMap;
  }

  get fungibleTokenIds() {
    return this._fungibleTokenIds;
  }

  arrayToMap(fungibleTokens: FungibleToken[]) {
    for (const fungibleToken of fungibleTokens) {
      this._fungibleTokensQueryMap.set(fungibleToken.id, fungibleToken);
    }
  }

  query() {
    return this._ctx.store.findBy(FungibleToken, {
      id: In([...this._fungibleTokenIds]),
    });
  }

  insert() {
    return this._ctx.store.insert([...this._fungibleTokensToInsert.values()]);
  }

  protected save() {
    throw new Error("Method not implemented");
  }

  process({
    event,
    blockHash,
    blockNum,
    timestamp,
  }: EventInfo<AssetsMetadataSetEvent>) {
    let assetId, name, symbol, isFrozen, decimals;
    if (event.isV100) {
      ({ assetId, name, symbol, isFrozen, decimals } = event.asV100);
    } else {
      throw new Error("Unsupported token spec");
    }

    const fungibleToken = new FungibleToken({
      id: assetId.toString(),

      isFrozen,
      decimals,
      blockHash,
      blockNum,
      name: name.toString(),
      symbol: symbol.toString(),
      createdAt: new Date(timestamp),
    });

    this._fungibleTokensToInsert.set(fungibleToken.id, fungibleToken);
  }
}
