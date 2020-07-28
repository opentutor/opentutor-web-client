import React, { useState, useEffect } from "react";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { continueSession } from "api";

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
  setMessages: any;
  setTargets: any;
  session: any;
  setSession: any;
  handleSummaryOpen: any;
  setSummaryMessage: any;
  setErrorProps: any;
  handleErrorOpen: any;
}) {
  const styles = useStyles();
  const [chat, setChat] = useState("");
  const [outboundChat, setOutboundChat] = useState("");
  const [sessionAlive, setSessionAlive] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (props.session != null) {
        const response = await continueSession({
          lesson: props.lesson,
          session: props.session,
          outboundChat: outboundChat,
        });

        if (response.status != 200) {
          console.log(response.status); //Get the status code
          if (response.status == 404) {
            props.setErrorProps({
              title: "Could not find lesson",
              message:
                "This lesson does not exist in the OpenTutor system. Please go back and try again, or contact your teacher for help.",
              buttonText: "OK",
            });
          } else if (response.status == 400) {
            props.setErrorProps({
              title: "Missing Lesson ID",
              message:
                "Please provide a lesson ID in the URL to begin a lesson.",
              buttonText: "OK",
            });
          } else if (response.status == 403) {
            props.setErrorProps({
              title: "Nice Try!",
              message:
                "Did you think we wouldn't know you tried to cheat? We're always watching... always...",
              buttonText: "OK",
            });
          } else if (response.status == 410) {
            props.setErrorProps({
              title: "Lesson session ended",
              message:
                "We're sorry, but like all good things, this tutoring session has ended. The good news is you can always take it again! Just reload this page.",
              buttonText: "OK",
            });
          } else {
            //Unknown error
            props.setErrorProps({
              title: `Server Error (${response.status})`,
              message:
                "We don't know what happened. Please try again later or contact a teacher.",
              buttonText: "OK",
            });
          }
          props.handleErrorOpen();
        } else {
          //Add Messages
          const newMessages = props.messages.slice();
          response.data.response.forEach((msg: any) => {
            newMessages.push({
              senderId: "system",
              type: msg.type,
              text: msg.data.text,
            });
          });
          props.setMessages(newMessages);

          // Add expectations
          const newTargets: any[] = [];
          response.data.sessionInfo.dialogState.expectationData.forEach(
            (exp: any) => {
              newTargets.push({
                achieved: exp.satisfied ? 1 : exp.score,
                text: exp.ideal,
                status: exp.status,
              });
            }
          );
          props.setTargets(newTargets);

          if (response.data.completed == true) {
            //Session ending. Show Summary
            setSessionAlive(false);
            props.setSummaryMessage(
              "That's a wrap! Let's see how you did on this lesson!"
            );
            props.handleSummaryOpen();
          }

          props.setSession(response.data.sessionInfo);
        }
      }
    };
    fetchData();
  }, [outboundChat]); //Watches for vars in array to make updates. If none only updates on comp. mount

  function handleClick(e: any) {
    e.preventDefault();

    if (chat.length > 0) {
      console.log(`User typed: ${chat}\n`);
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
        disabled={chat.length == 0 || !sessionAlive}
      >
        Send
      </Button>
    </form>
  );
}
