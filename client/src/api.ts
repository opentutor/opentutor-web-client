/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import axios, { AxiosResponse } from "axios";
import { MAX_INPUT_LENGTH } from "components/ChatForm";
import {
  Lesson,
  FetchLesson,
  DialogResponse,
  SessionData,
  WarmupLambdaResponse,
} from "types";

interface GQLResponse<T> {
  errors?: { message: string }[];
  data?: T;
}

function ensureEndSlashIfExists(u?: string): string | null {
  if (!u) {
    return "";
  }
  return u.endsWith("/") ? u : `${u}/`;
}

const DIALOG_ENDPOINT =
  ensureEndSlashIfExists(process.env.DIALOG_ENDPOINT) || "/dialog/";
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || "/graphql";
const CLASSIFIER_ENTRYPOINT =
  process.env.CLASSIFIER_ENTRYPOINT || "/classifier";

export async function fetchLesson(lessonId: string): Promise<Lesson> {
  const result = await axios.post<GQLResponse<FetchLesson>>(GRAPHQL_ENDPOINT, {
    query: `
      query FetchLessonInfo {
        lessonInfo(lessonId: "${lessonId}") {
          name
          learningFormat
          media {
            url
            type
            props {
              name
              value
            }
          }
        }  
      }
    `,
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return result.data.data!.lessonInfo;
}

export async function createSession(
  lesson: string,
  username: string
): Promise<AxiosResponse<DialogResponse>> {
  try {
    return await axios.post<DialogResponse>(`${DIALOG_ENDPOINT}${lesson}`, {
      username: username,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error.response);
    return error.response;
  }
}

export async function warmupLessonLambda(
  lesson: string
): Promise<AxiosResponse<WarmupLambdaResponse>> {
  try {
    return await axios.post<WarmupLambdaResponse>(
      `${CLASSIFIER_ENTRYPOINT}/evaluate`,
      {
        lesson: lesson,
        ping: true,
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
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
      `${DIALOG_ENDPOINT}${props.lesson}/session`,
      {
        sessionInfo: props.session,
        message: props.outboundChat.slice(0, MAX_INPUT_LENGTH),
        username: props.username,
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error.response;
  }
}
