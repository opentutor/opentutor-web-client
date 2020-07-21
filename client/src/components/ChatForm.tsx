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
            });
          }
        );
        props.setTargets(newTargets);

        if (response.data.completed == true) {
          //Session ending. Show Summary
          setSessionAlive(false);
          props.handleSummaryOpen();
        }

        props.setSession(response.data.sessionInfo);
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
