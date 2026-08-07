import { env } from "./config/env";
import { createApp } from "./app";
import { startIntelligenceScheduler } from "./intelligence/intelligence.scheduler";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`CareerOS API listening on http://localhost:${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);

  // Start the autonomous intelligence engine
  startIntelligenceScheduler();
});
