/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import axios, { AxiosResponse } from "axios";

export interface ExpectationData {
  ideal: string;
  score: number;
  satisfied: boolean;
  status: string;
}

export interface DialogState {
  expectationsCompleted: boolean;
  expectationData: ExpectationData[];
  hints: boolean;
}

export interface SessionData {
  sessionId: string;
  sessionHistory: string;
  previousUserResponse: string;
  previousSystemResponse: string[];
  dialogState: DialogState;
  hash: string;
}

export interface DialogMsg {
  author: string;
  type: string;
  data: { text: string };
}

export interface DialogData {
  status: number;
  sessionInfo: SessionData;
  response: DialogMsg[];
  completed: boolean;
  score: number;
  expectationActive: number;
}

export interface DialogError {
  status: number;
  statusText: string;
  data: string;
}

export type DialogResponse = DialogData | DialogError;

const DIALOG_ENDPOINT = process.env.DIALOG_ENDPOINT || "/dialog";
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
  session: SessionData;
  outboundChat: string;
}): Promise<AxiosResponse<DialogResponse>> {
  try {
    return await axios.post<DialogResponse>(
      `${DIALOG_ENDPOINT}/${props.lesson}/session`,
      {
        sessionInfo: props.session,
        message: props.outboundChat,
      }
    );
  } catch (error) {
    return error.response;
  }
}
