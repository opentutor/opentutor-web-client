/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { continueSession } from "api";
import { errorForStatus } from "components/ErrorConfig";
import {
  ChatMsg,
  DialogData,
  DialogError,
  ErrorData,
  SessionData,
  Target,
} from "types";

interface OutboundChat {
  text: string;
  seq: number;
}

const ChatForm = (props: {
  lesson: string;
  username: string;
  messages: { senderId: string; type: string; text: string }[];
  messageQueue: { senderId: string; type: string; text: string }[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMsg[]>>;
  setMessageQueue: React.Dispatch<React.SetStateAction<ChatMsg[]>>;
  setTargets: React.Dispatch<React.SetStateAction<Target[]>>;
  session: SessionData;
  setSession: React.Dispatch<React.SetStateAction<SessionData>>;
  setErrorProps: React.Dispatch<React.SetStateAction<ErrorData>>;
  handleErrorOpen: () => void;
  handleSessionDone: (session: SessionData) => void;
  sessionAlive: boolean;
  setSessionAlive: React.Dispatch<React.SetStateAction<boolean>>;
  onSummaryOpenRequested: () => void;
}): JSX.Element => {
  const { classes: styles } = useStyles();
  const [chat, setChat] = useState("");
  const [outboundChat, setOutboundChat] = useState<OutboundChat>({
    text: "",
    seq: 0,
  });

  useEffect(() => {
    if (!props.sessionAlive) {
      return;
    }
    async function fetchData(): Promise<void> {
      if (props.session.sessionHistory !== "") {
        const response = await continueSession({
          lesson: props.lesson,
          username: props.username,
          session: props.session,
          outboundChat: outboundChat.text,
        });
        if (response.status !== 200) {
          props.setErrorProps(
            errorForStatus(response.status, (response.data as DialogError).data)
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
          props.setSession(dialogData.sessionInfo);
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

  if (!props.sessionAlive) {
    return (
      <Button
        data-cy="continue-button"
        variant="contained"
        color="primary"
        size="small"
        className={styles.button}
        endIcon={<ArrowForwardIcon />}
        onClick={props.onSummaryOpenRequested}
        disabled={props.sessionAlive}
        key={`${props.sessionAlive}`}
      >
        Complete
      </Button>
    );
  }

  return (
    <form
      data-cy="chat-form"
      noValidate
      autoComplete="off"
      style={{ height: 95 }}
    >
      <div className={styles.chatboxRoot}>
        <TextField
          data-cy="outlined-multiline-static"
          label="Chat with OpenTutor"
          multiline
          minRows={2}
          variant="outlined"
          style={{ width: "100%", marginTop: 10 }}
          value={chat}
          onChange={(e): void => setChat(e.target.value)}
          onKeyPress={onKeyPress}
        />
        <div className={styles.innerOverlayBottomRight}>
          <Button
            data-cy="submit-button"
            variant="contained"
            color="primary"
            size="small"
            className={styles.button}
            endIcon={<SendIcon />}
            onClick={handleClick}
            key={`${chat.trim().length === 0 || !props.sessionAlive}`}
            disabled={chat.trim().length === 0 || props.messageQueue.length > 0}
          >
            Send
          </Button>
        </div>
      </div>
    </form>
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
    position: "absolute",
    zIndex: 1,
    bottom: 7,
    right: 7,
  },
}));

export default ChatForm;
