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
