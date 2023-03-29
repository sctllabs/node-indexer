export function decodeString(value: Uint8Array) {
  if (Buffer.isBuffer(value)) {
    return value.toString("utf-8");
  }
  return Buffer.from(value.buffer, value.byteOffset, value.byteLength).toString(
    "utf-8"
  );
}
