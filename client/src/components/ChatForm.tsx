import React, { useState, useEffect } from "react";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { continueSession, DialogData } from "api";
import { errorForStatus } from "./ErrorConfig";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

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
  messages: { senderId: string; type: string; text: string }[];
  setMessages: React.Dispatch<
    React.SetStateAction<
      {
        senderId: string;
        type: string;
        text: string;
      }[]
    >
  >;
  setTargets: React.Dispatch<
    React.SetStateAction<
      {
        achieved: boolean;
        score: number;
        text: string;
        status: string;
      }[]
    >
  >;
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
  setSession: React.Dispatch<
    React.SetStateAction<{
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
    }>
  >;
  handleSummaryOpen: () => void;
  setSummaryMessage: React.Dispatch<React.SetStateAction<string>>;
  setErrorProps: React.Dispatch<
    React.SetStateAction<{
      title: string;
      message: string;
      buttonText: string;
    }>
  >;
  handleErrorOpen: () => void;
}) {
  const styles = useStyles();
  const [chat, setChat] = useState("");
  const [outboundChat, setOutboundChat] = useState("");
  const [sessionAlive, setSessionAlive] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (props.session.sessionHistory !== "") {
        const response = await continueSession({
          lesson: props.lesson,
          session: props.session,
          outboundChat: outboundChat,
        });

        if (response.status !== 200) {
          props.setErrorProps(errorForStatus(response.status));
          props.handleErrorOpen();
        } else {
          const succesfulResponse = response as DialogData;
          //Add Messages
          const newMessages = props.messages.slice();
          succesfulResponse.data.response.forEach(
            (msg: {
              author: string;
              type: string;
              data: {
                text: string;
              };
            }) => {
              newMessages.push({
                senderId: "system",
                type: msg.type,
                text: msg.data.text,
              });
            }
          );
          props.setMessages(newMessages);

          // Add expectations
          const newTargets: {
            achieved: boolean;
            score: number;
            text: string;
            status: string;
          }[] = [];
          succesfulResponse.data.sessionInfo.dialogState.expectationData.forEach(
            (exp: {
              ideal: string;
              score: number;
              satisfied: boolean;
              status: string;
            }) => {
              newTargets.push({
                achieved: exp.satisfied,
                score: exp.satisfied ? 1 : exp.score,
                text: exp.ideal,
                status: exp.status,
              });
            }
          );
          props.setTargets(newTargets);

          if (succesfulResponse.data.completed === true) {
            //Session ending. Show Summary
            setSessionAlive(false);
            props.setSummaryMessage(
              "That's a wrap! Let's see how you did on this lesson!"
            );
            props.handleSummaryOpen();
          }

          props.setSession(succesfulResponse.data.sessionInfo);
        }
      }
    };
    fetchData();
  }, [outboundChat]); //Watches for vars in array to make updates. If none only updates on comp. mount

  function handleClick(e: any) {
    e.preventDefault();

    if (chat.length > 0) {
      const newMessages = props.messages.slice();
      newMessages.push({ senderId: "user", type: "", text: chat });
      props.setMessages(newMessages);
      setOutboundChat(chat);
      setChat("");
    }
  }

  function onKeyPress(e: any) {
    if (e.key !== "Enter") {
      return;
    }
    if (chat.length === 0 || !sessionAlive) {
      return;
    }

    e.preventDefault();
    handleClick(e);
  }

  return (
    <form noValidate autoComplete="off">
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
        onChange={(e) => {
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
        disabled={chat.length === 0 || !sessionAlive}
      >
        Send
      </Button>
    </form>
  );
}
