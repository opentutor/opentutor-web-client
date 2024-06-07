/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { ArrowForward, Mic, MicOutlined, Send } from "@mui/icons-material";
import { continueSession } from "api";
import { errorForStatus } from "components/ErrorConfig";
import { ChatMsg, DialogData, ErrorData, SessionData, Target } from "types";
import withLocation from "wrap-with-location";

interface OutboundChat {
  text: string;
  seq: number;
}

const ChatForm = (props: {
  search: { lesson: string; nostt: string };
  username: string;
  messages: { senderId: string; type: string; text: string }[];
  messageQueue: { senderId: string; type: string; text: string }[];
  session: SessionData;
  sessionAlive: boolean;
  setMessages: React.Dispatch<React.SetStateAction<ChatMsg[]>>;
  setMessageQueue: React.Dispatch<React.SetStateAction<ChatMsg[]>>;
  setTargets: React.Dispatch<React.SetStateAction<Target[]>>;
  setSession: React.Dispatch<React.SetStateAction<SessionData>>;
  setErrorProps: React.Dispatch<React.SetStateAction<ErrorData>>;
  handleErrorOpen: () => void;
  handleSessionDone: (session: SessionData) => void;
  setSessionAlive: React.Dispatch<React.SetStateAction<boolean>>;
  onSummaryOpenRequested: () => void;
}): JSX.Element => {
  const { classes: styles } = useStyles();
  const [chat, setChat] = useState("");
  const [outboundChat, setOutboundChat] = useState<OutboundChat>({
    text: "",
    seq: 0,
  });
  const [stt, setSTT] = React.useState<string>("");
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  React.useEffect(() => {
    setChat(chat + transcript.substr(stt.length));
    setSTT(transcript);
  }, [transcript]);

  React.useEffect(() => {
    if (!props.sessionAlive || !outboundChat.text) {
      return;
    }
    async function fetchData(): Promise<void> {
      if (props.session.sessionHistory !== "") {
        const response = await continueSession({
          lesson: props.search.lesson,
          username: props.username,
          session: props.session,
          outboundChat: outboundChat.text,
        });
        if (response.status !== 200) {
          props.setErrorProps(
            errorForStatus(response.status, `${response.data}`)
          );
          props.handleErrorOpen();
        } else {
          const dialogData = response.data as DialogData;
          props.setMessageQueue([
            ...props.messageQueue,
            ...dialogData.response.map((msg) => {
              return {
                senderId: "system",
                type: msg.type,
                text: msg.data.text,
              };
            }),
          ]);
          props.setTargets(
            dialogData.sessionInfo.dialogState.expectationData.map((exp) => {
              return {
                achieved: exp.satisfied,
                score: exp.satisfied ? 1 : exp.score,
                text: exp.ideal,
                status: exp.status,
              };
            })
          );
          // Session complete.
          // Show summary then send score on summary close
          if (dialogData.completed) {
            props.setSessionAlive(false);
          }
          props.setSession({
            ...dialogData.sessionInfo,
            score: dialogData.score,
          });
        }
      }
    }
    fetchData();
  }, [outboundChat]); //Watches for vars in array to make updates. If none only updates on comp. mount

  function handleClick(e: React.SyntheticEvent<Element>): void {
    e.preventDefault();
    if (chat.length > 0) {
      props.setMessages([
        ...props.messages,
        { senderId: "user", type: "", text: chat },
      ]);
      setOutboundChat({
        text: chat,
        seq: outboundChat.seq + 1,
      });
      setChat("");
    }
  }

  function onKeyPress(e: React.KeyboardEvent<Element>): void {
    if (e.key !== "Enter") {
      return;
    }
    e.preventDefault();
    if (
      chat.trim().length === 0 ||
      !props.sessionAlive ||
      props.messageQueue.length > 0
    ) {
      return;
    }
    handleClick(e);
  }

  function toggleSTT() {
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
      setSTT("");
    } else {
      resetTranscript();
      setSTT("");
      SpeechRecognition.startListening();
    }
  }

  if (!props.sessionAlive) {
    return (
      <Button
        data-cy="continue-button"
        variant="contained"
        color="primary"
        size="small"
        className={styles.button}
        endIcon={<ArrowForward />}
        onClick={props.onSummaryOpenRequested}
        disabled={props.sessionAlive}
        key={`${props.sessionAlive}`}
      >
        Complete
      </Button>
    );
  }

  return (
    <FormControl
      data-cy="chat-form"
      variant="outlined"
      style={{ height: 95, width: "100%" }}
    >
      <div className={styles.chatboxRoot}>
        <InputLabel>Chat with OpenTutor</InputLabel>
        <OutlinedInput
          data-cy="outlined-multiline-static"
          label="Chat with OpenTutor"
          multiline
          minRows={2}
          style={{
            width: "100%",
            backgroundColor: listening ? "rgba(26, 107, 155, 0.1)" : "white",
          }}
          value={chat}
          autoComplete="off"
          disabled={listening}
          onChange={(e): void => setChat(e.target.value)}
          onKeyPress={onKeyPress}
        />
        <div className={styles.innerOverlayBottomRight}>
          {browserSupportsSpeechRecognition && !props.search.nostt ? (
            <InputAdornment position="start">
              <IconButton color="primary" edge="start" onClick={toggleSTT}>
                {listening ? (
                  <Mic color="primary" />
                ) : (
                  <MicOutlined style={{ color: "gray" }} />
                )}
              </IconButton>
            </InputAdornment>
          ) : undefined}
          <Button
            data-cy="submit-button"
            variant="contained"
            color="primary"
            size="small"
            className={styles.button}
            endIcon={<Send />}
            onClick={handleClick}
            key={`${chat.trim().length === 0 || !props.sessionAlive}`}
            disabled={
              chat.trim().length === 0 ||
              props.messageQueue.length > 0 ||
              listening
            }
          >
            Send
          </Button>
        </div>
      </div>
    </FormControl>
  );
};

const useStyles = makeStyles({ name: { ChatForm } })(() => ({
  chatboxRoot: {
    width: "90%",
    maxWidth: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    position: "relative",
    marginTop: 10,
  },
  button: {
    // transition: 'color .01s',
  },
  innerOverlayBottomRight: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
    bottom: 7,
    right: 7,
  },
}));

export default withLocation(ChatForm);
