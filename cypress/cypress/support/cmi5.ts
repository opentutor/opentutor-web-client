/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { LaunchParameters, LaunchData } from "@xapi/cmi5";
import { staticResponse } from "./functions";

export const LAUNCH_PARAMETERS_DEFAULT: LaunchParameters = {
  activityId: "http://fake.com/fake-activity-id",
  actor: {
    objectType: "Agent",
    name: "fake-cmi-user",
    account: {
      name: "fake-cmi-user-id",
      homePage: "http://fake.com/users/",
    },
  },
  endpoint: "/cmi5/xapi/",
  fetch: "/cmi5/fetch/",
  registration: "fake-registration-id",
};

export const LAUNCH_DATA_DEFAULT: LaunchData = {
  contextTemplate: {},
  moveOn: "CompletedOrPassed",
  launchMode: "Normal",
};

export function addCmi5LaunchParams(
  url: string,
  launchParams?: LaunchParameters
): string {
  const lp = launchParams || LAUNCH_PARAMETERS_DEFAULT;
  return `${url}${
    url.indexOf("?") === -1 ? "?" : "&"
  }activityId=${encodeURIComponent(lp.activityId)}&actor=${encodeURIComponent(
    JSON.stringify(lp.actor)
  )}&endpoint=${encodeURIComponent(lp.endpoint)}&fetch=${encodeURIComponent(
    lp.fetch
  )}&registration=${encodeURIComponent(lp.registration)}`;
}

export function cyMockCmi5Initialize(
  cy,
  launchParams?: LaunchParameters
): void {
  const lp = launchParams || LAUNCH_PARAMETERS_DEFAULT;
  cy.intercept(
    {
      method: "POST",
      url: lp.fetch,
    },
    staticResponse({
      body: {
        "auth-token": "fake-auth-token",
      },
    })
  ).as("fetch");
  cy.intercept(
    {
      method: "GET",
      url: `**/activities/state**`,
    },
    staticResponse({
      body: LAUNCH_DATA_DEFAULT,
    })
  ).as("getState");
  cy.intercept(
    {
      method: "GET",
      url: `**/activities/profile**`,
    },
    staticResponse({
      body: {},
    })
  ).as("getProfile");
  cy.intercept(
    {
      method: "POST",
      url: `**/statements`,
    },
    staticResponse({
      body: ["fake-initialized-statement-id"],
    })
  ).as("initialized");
}
