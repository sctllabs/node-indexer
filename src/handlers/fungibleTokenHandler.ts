import { Ctx } from "../processor";
import { FungibleToken } from "../model";
import { AssetsMetadataSetEvent } from "../types/events";

import type { EventItem } from "@subsquid/substrate-processor/lib/interfaces/dataSelection";

export async function fungibleTokenHandler(
  ctx: Ctx,
  createTokenEvents: EventItem<
    "Assets.MetadataSet",
    { readonly event: { readonly args: true } }
  >[]
) {
  const fungibleTokens: FungibleToken[] = [];

  for (const tokenEvent of createTokenEvents) {
    const e = new AssetsMetadataSetEvent(ctx, tokenEvent.event);

    if (!e.isV100) {
      throw new Error("Unsupported token spec");
    }

    const { assetId, name, symbol, isFrozen, decimals } = e.asV100;

    const fungibleToken = new FungibleToken({
      id: assetId.toString(),
      name: name.toString(),
      symbol: symbol.toString(),
      isFrozen,
      decimals,
    });

    fungibleTokens.push(fungibleToken);
  }

  return fungibleTokens;
}
