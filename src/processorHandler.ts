import type { Ctx } from "./processor";
import { EventHandler } from "./handlers";

export async function processEvents(ctx: Ctx): Promise<void> {
  const eventHandler = new EventHandler(ctx);
  await eventHandler.process();
}
