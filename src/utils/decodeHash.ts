export function decodeHash(value: Uint8Array) {
  if (Buffer.isBuffer(value)) {
    return "0x" + value.toString("hex");
  }
  return (
    "0x" +
    Buffer.from(value.buffer, value.byteOffset, value.byteLength).toString(
      "hex"
    )
  );
}
