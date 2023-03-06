import { FungibleToken } from "../model";
import { AssetsMetadataSetEvent } from "../types/events";

import type { Ctx } from "../processor";
import type { EventInfo } from "../types";

export class FungibleTokenHandler {
  ctx: Ctx;
  createTokenEvents: EventInfo<AssetsMetadataSetEvent>[];

  constructor(
    ctx: Ctx,
    createTokenEvents: EventInfo<AssetsMetadataSetEvent>[]
  ) {
    this.ctx = ctx;
    this.createTokenEvents = createTokenEvents;
  }

  async handle() {
    const fungibleTokens: Map<string, FungibleToken> = new Map();
    for (const { event, timestamp, blockHash, blockNum } of this
      .createTokenEvents) {
      if (!event.isV100) {
        throw new Error("Unsupported token spec");
      }

      const { assetId, name, symbol, isFrozen, decimals } = event.asV100;

      const fungibleToken = new FungibleToken({
        id: assetId.toString(),
        name: name.toString(),
        symbol: symbol.toString(),
        isFrozen,
        decimals,
        blockHash,
        blockNum,
        createdAt: new Date(timestamp),
      });

      fungibleTokens.set(fungibleToken.id, fungibleToken);
    }
    return fungibleTokens;
  }
}
