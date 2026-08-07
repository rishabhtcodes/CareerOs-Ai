/**
 * Intelligence Scheduler
 * Uses node-cron to run the intelligence cycle automatically on a schedule.
 * Runs every 8 hours by default. Also runs once on server startup.
 *
 * Schedule: "0 *\/8 * * *" = at minute 0 past every 8th hour
 */

import cron from "node-cron";
import { runIntelligenceCycle } from "./intelligence.service";

let scheduledTask: ReturnType<typeof cron.schedule> | null = null;


export function startIntelligenceScheduler(): void {
  console.log("[Intelligence Scheduler] Starting…");

  // Run immediately on startup (after 10s delay to allow DB migrations to settle)
  setTimeout(() => {
    console.log("[Intelligence Scheduler] Initial startup cycle…");
    runIntelligenceCycle(false).catch((err) =>
      console.error("[Intelligence Scheduler] Startup cycle error:", err)
    );
  }, 10_000);

  // Schedule recurring runs every 8 hours
  scheduledTask = cron.schedule("0 */8 * * *", () => {
    console.log("[Intelligence Scheduler] Scheduled cycle triggered");
    runIntelligenceCycle(false).catch((err) =>
      console.error("[Intelligence Scheduler] Scheduled cycle error:", err)
    );
  });

  console.log("[Intelligence Scheduler] Running every 8 hours (next: in 8h)");
}

export function stopIntelligenceScheduler(): void {
  scheduledTask?.stop();
  scheduledTask = null;
  console.log("[Intelligence Scheduler] Stopped");
}
