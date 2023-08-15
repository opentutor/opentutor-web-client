import { defineConfig } from "cypress";
import { addMatchImageSnapshotPlugin } from "@simonsmith/cypress-image-snapshot/plugin";

export default defineConfig({
  video: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on);
    },
    baseUrl: "http://localhost:8000",
    chromeWebSecurity: false,
    video: false,
    requestTimeout: 10000,
  },
});
