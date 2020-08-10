import axios from "axios";

const DIALOG_ENDPOINT = process.env.DIALOG_ENDPOINT || "/dialog";
//{status:number; lessonID:string, sessionInfo: {sessionId:string, sessionHistory:string, previousUserResponse:string, previousSystemResponse:string[],dialogState:{expectationsCompleted:boolean, expectationData:{ideal:string, score:number, satisfied:boolean, status:string}[],hints:boolean},hash:string}, response:{author:string, type:string, data:{text:string}}[]};
// put dialog api calls here
export async function createSession(lesson: string) {
  try {
    return await axios.post(`${DIALOG_ENDPOINT}/${lesson}`, {});
  } catch (error) {
    return error.response;
  }
}

export interface successesfulResponse {
  status: number;
  lessonID: string;
  sessionInfo: {
    sessionId: string;
    sessionHistory: string;
    previousUserResponse: string;
    previousSystemResponse: string[];
    dialogState: {
      expectationsCompleted: boolean;
      expectationData: {
        ideal: string;
        score: number;
        satisfied: boolean;
        status: string;
      }[];
      hints: boolean;
    };
    hash: string;
  };
  response: { author: string; type: string; data: { text: string } }[];
}

export async function continueSession(props: {
  lesson: string;
  session: {
    sessionId: string;
    sessionHistory: string;
    previousUserResponse: string;
    previousSystemResponse: string[];
    dialogState: {
      expectationsCompleted: boolean;
      expectationData: {
        ideal: string;
        score: number;
        satisfied: boolean;
        status: string;
      }[];
      hints: boolean;
    };
    hash: string;
  };
  outboundChat: string;
}):Promise<successesfulResponse> {
  try {
    return await axios.post(`${DIALOG_ENDPOINT}/${props.lesson}/session`, {
      sessionInfo: props.session,
      message: props.outboundChat,
    });
  } catch (error) {
    return error.response;
  }
}//|Promise<failureResponse>
