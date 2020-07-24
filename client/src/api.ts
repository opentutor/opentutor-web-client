import axios from "axios";

const DIALOG_ENDPOINT = process.env.DIALOG_ENDPOINT || "/dialog";

// put dialog api calls here
export async function createSession(lesson: string) {
  try {
    return await axios.post(`${DIALOG_ENDPOINT}/${lesson}`, {});
  } catch (error) {
    return error.response;
  }
}

export async function continueSession(props: {
  lesson: string;
  session: any;
  outboundChat: any;
}) {
  return await axios.post(`${DIALOG_ENDPOINT}/${props.lesson}/session`, {
    sessionInfo: props.session,
    message: props.outboundChat,
  });
}
