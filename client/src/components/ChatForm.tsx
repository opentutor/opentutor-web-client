/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { continueSession } from "api";
import { errorForStatus } from "components/ErrorConfig";
import { Target, ChatMsg, ErrorData, SessionData, DialogData } from "types";

const useStyles = makeStyles((theme) => ({
  chatbox: {
    width: "90%",
    maxWidth: 400,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function ChatForm(props: {
  lesson: string;
  username: string;
  messages: { senderId: string; type: string; text: string }[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMsg[]>>;
  setTargets: React.Dispatch<React.SetStateAction<Target[]>>;
  session: SessionData;
  setSession: React.Dispatch<React.SetStateAction<SessionData>>;
  handleSummaryOpen: () => void;
  setSummaryMessage: React.Dispatch<React.SetStateAction<string>>;
  setErrorProps: React.Dispatch<React.SetStateAction<ErrorData>>;
  handleErrorOpen: () => void;
}): JSX.Element {
  const styles = useStyles();
  const [chat, setChat] = useState("");
  const [outboundChat, setOutboundChat] = useState("");
  const [sessionAlive, setSessionAlive] = useState(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (props.session.sessionHistory !== "") {
        const response = await continueSession({
          lesson: props.lesson,
          username: props.username,
          session: props.session,
          outboundChat: outboundChat,
        });
        if (response.status !== 200) {
          const error: any = response.data;
          props.setErrorProps(errorForStatus(error.status, error.message));
          props.handleErrorOpen();
        } else {
          const dialogData = response.data as DialogData;
          props.setMessages([
            ...props.messages,
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
          if (dialogData.completed) {
            //Session ending. Show Summary
            setSessionAlive(false);
            props.setSummaryMessage(
              "That's a wrap! Let's see how you did on this lesson!"
            );
            props.handleSummaryOpen();
          }
          props.setSession(dialogData.sessionInfo);
        }
      }
    };
    fetchData();
  }, [outboundChat]); //Watches for vars in array to make updates. If none only updates on comp. mount

  function handleClick(e: React.SyntheticEvent<Element>): void {
    e.preventDefault();
    if (chat.length > 0) {
      props.setMessages([
        ...props.messages,
        { senderId: "user", type: "", text: chat },
      ]);
      setOutboundChat(chat);
      setChat("");
    }
  }

  function onKeyPress(e: React.KeyboardEvent<Element>): void {
    if (e.key !== "Enter") {
      return;
    }
    e.preventDefault();
    if (chat.trim().length === 0 || !sessionAlive) {
      return;
    }
    handleClick(e);
  }

  return (
    <form id="chat-form" noValidate autoComplete="off">
      <TextField
        id="outlined-multiline-static"
        label={
          sessionAlive
            ? "Chat with OpenTutor"
            : "Thanks for chatting with OpenTutor!"
        }
        multiline
        rows={4}
        variant="outlined"
        className={styles.chatbox}
        value={chat}
        disabled={!sessionAlive}
        onChange={(e): void => {
          setChat(e.target.value);
        }}
        onKeyPress={onKeyPress}
      />
      <br />
      <Button
        id="submit-button"
        variant="contained"
        color="primary"
        className={styles.button}
        endIcon={<SendIcon />}
        onClick={handleClick}
        disabled={chat.trim().length === 0 || !sessionAlive}
      >
        Send
      </Button>
    </form>
  );
}
