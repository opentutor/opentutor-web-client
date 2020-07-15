import axios from "axios";

const DIALOG_ENDPOINT = process.env.DIALOG_ENDPOINT || "/dialog/";

// put dialog api calls here
export async function createSession() {
  return await axios.post(`${DIALOG_ENDPOINT}/q1`, {});
}

export async function continueSession(props: {
  session: any;
  outboundChat: any;
}) {
  return await axios.post(`${DIALOG_ENDPOINT}/q1/session`, {
    sessionInfo: props.session,
    message: props.outboundChat,
  });
}
