// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { env } from "~/env";

Sentry.init({
  dsn: "https://8325a4fc0dd448e001c8c8cef9180445@o4507930219053057.ingest.de.sentry.io/4507930222198864",
  enabled: process.env.NODE_ENV !== "test",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
