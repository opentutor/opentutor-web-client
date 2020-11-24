/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import axios, { AxiosResponse } from "axios";
import { Lesson, FetchLesson, DialogResponse, SessionData } from "types";
import { getApiKey } from "config";

interface GQLResponse<T> {
  errors?: { message: string }[];
  data?: T;
}

const DIALOG_ENDPOINT = process.env.DIALOG_ENDPOINT || "/dialog";
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || "/graphql";

export async function fetchLesson(lessonId: string): Promise<Lesson> {
  const API_SECRET = await getApiKey();
  const result = await axios.post<GQLResponse<FetchLesson>>(GRAPHQL_ENDPOINT, {
    headers: {
      Authorization: `bearer ${API_SECRET}`,
      "opentutor-api-req": "true",
    },
    query: `
      query {
        me {
          lesson(lessonId: "${lessonId}") {
            name
            image
          }  
        }
      }
    `,
  });
  return result.data.data!.me.lesson;
}

export async function createSession(
  lesson: string
): Promise<AxiosResponse<DialogResponse>> {
  try {
    return await axios.post<DialogResponse>(`${DIALOG_ENDPOINT}/${lesson}`, {});
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
}

export async function continueSession(props: {
  lesson: string;
  username: string;
  session: SessionData;
  outboundChat: string;
}): Promise<AxiosResponse<DialogResponse>> {
  try {
    return await axios.post<DialogResponse>(
      `${DIALOG_ENDPOINT}/${props.lesson}/session`,
      {
        sessionInfo: props.session,
        message: props.outboundChat,
        username: props.username,
      }
    );
  } catch (error) {
    return error.response;
  }
}
