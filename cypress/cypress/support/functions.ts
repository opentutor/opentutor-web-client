/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
// import {StaticResponse} from 'cypress/types'
export function cySetup(cy) {
  cy.viewport("iphone-x", "portrait");
}

// can't find way to import Cypress's StaticResponse interface
// so just define it  here
export interface StaticResponse {
  /**
   * Serve a fixture as the response body.
   */
  fixture?: string;
  /**
   * Serve a static string/JSON object as the response body.
   */
  body?: string | object | object[];
  /**
   * HTTP headers to accompany the response.
   * @default {}
   */
  headers?: { [key: string]: string };
  /**
   * The HTTP status code to send.
   * @default 200
   */
  statusCode?: number;
  /**
   * If 'forceNetworkError' is truthy, Cypress will destroy the browser connection
   * and send no response. Useful for simulating a server that is not reachable.
   * Must not be set in combination with other options.
   */
  forceNetworkError?: boolean;
  /**
   * Milliseconds to delay before the response is sent.
   */
  delayMs?: number;
  /**
   * Kilobits per second to send 'body'.
   */
  throttleKbps?: number;
}
/**
 * Maybe cypress will fix in future release,
 * but as of 6.0, most `cy.intercept` calls
 * will trigger an abort because no default CORS headers
 */
export function staticResponse(s: StaticResponse): StaticResponse {
  return {
    ...{
      headers: {
        "access-control-allow-origin": window.location.origin,
        "Access-Control-Allow-Credentials": "true",
      },
      ...s,
    },
  };
}

export function cyMockDialog(cy, lesson: string, fixture: string) {
  return cy.intercept(
    "POST",
    `**/dialog/${lesson}`,
    staticResponse({ fixture })
  );
}

export function cyMockGraphQL(cy, fixture = "lesson-graphql-default.json") {
  cy.intercept("**/lesson1/image.png", { fixture: "lesson1.png" });
  return cy.intercept("POST", `**/graphql`, staticResponse({ fixture }));
}

export function cyMockSession(cy, lesson: string, fixture: string) {
  return cyMockDialog(cy, `${lesson}/session`, fixture);
}

export function cyVisitWithTestingParam(cy, url, options = {}) {
  cy.visit(`${url}${url.indexOf("?") == -1 ? "?" : "&"}testing=true`, options);
}
