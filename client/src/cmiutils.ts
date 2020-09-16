/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import queryString from "query-string";
import { Agent } from "@gradiant/xapi-dsl";

export const CMI5_EXT_RESULT_KC_SCORES =
  "http://pal3.org/xapi/knowledgecomponent/result/kc-scores";

export const CMI5_ENDPOINT = "https://dev.pal3.org/api/1.0/me/xapi";

export const CMI5_FETCH =
  "https://dev.pal3.org/api/1.0/me/xapi/accesstoken2basictoken";

export interface CmiParams {
  activityId: string;
  actor: Agent;
  endpoint: string;
  fetch: string;
  registration: string;
}

export function addCmi(url: string, cp: CmiParams): string {
  return `${url}${url.includes("?") ? "" : "?"}${
    url.endsWith("&") ? "" : "&"
  }activityId=${encodeURIComponent(cp.activityId)}&actor=${encodeURIComponent(
    JSON.stringify(cp.actor)
  )}&endpoint=${encodeURIComponent(cp.endpoint)}&fetch=${encodeURIComponent(
    cp.fetch
  )}&registration=${encodeURIComponent(cp.registration)}`;
}

export function hasCmi(urlOrQueryString: string): boolean {
  const cutIx = urlOrQueryString.indexOf("?");
  const urlQs =
    cutIx !== -1 ? urlOrQueryString.substring(cutIx + 1) : urlOrQueryString;
  const params = queryString.parse(urlQs);
  return Boolean(
    params.endpoint &&
      params.fetch &&
      params.actor &&
      params.registration &&
      params.activityId
  );
}

export default addCmi;
