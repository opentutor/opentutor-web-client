import axios from "axios";

export interface SuccessfulCreationResponse {
  data: {
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
  };
  status: number;
}

export interface SuccessfulContinuationResponse {
  data: {
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
    sentToGrader: boolean;
    completed: boolean;
    score: number;
    expectationActive: number;
  };
  status: number;
}

export interface FailedResponse {
  status: number;
  statusText: string;
  data: string;
}

const DIALOG_ENDPOINT = process.env.DIALOG_ENDPOINT || "/dialog";
//{status:number; lessonID:string, sessionInfo: {sessionId:string, sessionHistory:string, previousUserResponse:string, previousSystemResponse:string[],dialogState:{expectationsCompleted:boolean, expectationData:{ideal:string, score:number, satisfied:boolean, status:string}[],hints:boolean},hash:string}, response:{author:string, type:string, data:{text:string}}[]};
// put dialog api calls here
export async function createSession(
  lesson: string
): Promise<SuccessfulCreationResponse | FailedResponse> {
  try {
    return await axios.post(`${DIALOG_ENDPOINT}/${lesson}`, {});
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
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
}): Promise<SuccessfulContinuationResponse | FailedResponse> {
  try {
    return await axios.post(`${DIALOG_ENDPOINT}/${props.lesson}/session`, {
      sessionInfo: props.session,
      message: props.outboundChat,
    });
  } catch (error) {
    return error.response;
  }
} //|Promise<failureResponse>
