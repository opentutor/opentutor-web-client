import React, { useState, useEffect } from "react";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { continueSession } from "../api";

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
  messages: { senderId: string; text: string }[];
  setMessages: any;
  setTargetCount: any;
  session: any;
  setSession: any;
  handleSummaryOpen: any;
}) {
  const styles = useStyles();
  const [chat, setChat] = useState("");
  const [outboundChat, setOutboundChat] = useState("");

  useEffect(() => {
    console.log("Calling OpenTutor");
    const fetchData = async () => {
      if (props.session != null) {
        const response = await continueSession({
          session: props.session,
          outboundChat: outboundChat,
        });

        if (response.data.alive == null || response.data.alive == true) {
          const newMessages = props.messages.slice();

          //Add Messages
          console.log(response.data.response);
          response.data.response.forEach((msg: any) => {
            newMessages.push({ senderId: "system", text: msg.data.text });
          });

          props.setMessages(newMessages);
        } else {
          //Session ending. Show Summary
          props.handleSummaryOpen();
        }

        props.setSession(response.data.sessionInfo);
      }
    };
    fetchData();
  }, [outboundChat]); //Watches for vars in array to make updates. If none only updates on comp. mount

  function handleClick(e: any) {
    e.preventDefault();
    console.log(`User typed: ${chat}\n`);
    const newMessages = props.messages.slice();
    newMessages.push({ senderId: "user", text: chat });
    props.setMessages(newMessages);
    setOutboundChat(chat);
    setChat("");
  }

  return (
    <form noValidate autoComplete="off">
      <TextField
        id="outlined-multiline-static"
        label="Chat with OpenTutor"
        multiline
        rows={4}
        variant="outlined"
        className={styles.chatbox}
        value={chat}
        onChange={(e) => {
          setChat(e.target.value);
        }}
      />
      <br />
      <Button
        id="submit-button"
        variant="contained"
        color="primary"
        className={styles.button}
        endIcon={<SendIcon />}
        onClick={handleClick}
      >
        Send
      </Button>
    </form>
  );
}
