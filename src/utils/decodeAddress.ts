import * as ss58 from "@subsquid/ss58";
import { NETWORK_PREFIX } from "../constants";

export function decodeAddress(encodedAddress: Uint8Array) {
  return ss58.codec(NETWORK_PREFIX).encode(encodedAddress);
}
