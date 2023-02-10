import { Ctx } from "../processor";
import { FungibleToken } from "../model";
import { AssetsMetadataSetEvent } from "../types/events";

export async function fungibleTokenHandler(
  ctx: Ctx,
  createTokenEvents: AssetsMetadataSetEvent[]
) {
  const fungibleTokens: FungibleToken[] = [];

  for (const tokenEvent of createTokenEvents) {
    if (!tokenEvent.isV100) {
      throw new Error("Unsupported token spec");
    }

    const { assetId, name, symbol, isFrozen, decimals } = tokenEvent.asV100;

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
