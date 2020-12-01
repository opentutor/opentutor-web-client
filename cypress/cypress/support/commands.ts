/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import "cypress-fill-command";
import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command";

addMatchImageSnapshotCommand({
  comparisonMethod: "ssim",
  customDiffDir:
    Cypress.env("CYPRESS_SNAPSHOT_DIFF_DIR") ||
    "cypress/snapshots/__diff_output__",
  failureThreshold: 0.001,
  failureThresholdType: "percent",
});

// Cypress.Commands.overwrite("visit", (originalFn, url, options) => {
//   /**
//    * Currently unable to get visual-regression tests
//    * (matchImageSnapshot) to match on chat area because
//    * of animated scrolling.
//    *
//    * On current cypress@6.0, and cypress-image-snapshot@4.0.0,
//    * all attempts to wait for scrolling to complete have failed,
//    * including capture scroll-end event and mark `data-cy` and also
//    * brute-force waiting for even several seconds.
//    *
//    * So temp/hack fix is to disable auto chat scroll via query param.
//    * We should revisions this problem as new releases of cypress
//    * and cypress-image-snapshot are released (maybe fixing)
//    */
//   originalFn(`${url}${url.indexOf("?") == -1 ? "?" : "&"}e2e=true`);
// });
