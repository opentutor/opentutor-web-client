import React, { useState, useEffect } from "react";
import ChatThread from "../components/ChatThread";
import ChatForm from "../components/ChatForm";
import TargetIndicator from "../components/TargetIndicator";
import SummaryPopup from "../components/SummaryPopup";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import "styles/layout.css";
import { Button } from "@material-ui/core";
import { createSession } from "../api";

import axios from "axios";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  foreground: {
    backgroundColor: theme.palette.primary.main,
    width: "100%",
    height: "85%",
    minHeight: 750,
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, 0%)",
    marginTop: 15,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: "30%",
    aspectRatio: "2/1",
    objectFit: "cover",
    marginBottom: -5,
  },
  chatWindow: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    height: "65%",
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, 0%)",
    marginBottom: 15,
  },
}));

export default function App() {
  const styles = useStyles();
  const [open, setOpen] = React.useState(false);
  const [targetCount, setTargetCount] = React.useState(0);
  const [session, setSession] = React.useState(null);

  const handleSummaryOpen = () => {
    setOpen(true);
  };

  const DUMMY_DATA = [
    {
      senderId: "system",
      text: "Welcome to OpenTutor!",
    },
  ];

  const [messages, setMessages] = useState(DUMMY_DATA);

  useEffect(() => {
    const fetchData = async () => {
      const response = await createSession();

      const newMessages = messages.slice();

      //Add Messages
      console.log(response.data.response);
      response.data.response.forEach((msg: any) => {
        newMessages.push({ senderId: "system", text: msg.data.text });
      });

      setMessages(newMessages);
      setSession(response.data.sessionInfo);
    };
    fetchData();
  }, []); //Watches for vars in array to make updates. If none only updates on comp. mount

  return (
    <div className={styles.foreground}>
      <img
        src="https://images.theconversation.com/files/193721/original/file-20171108-6766-udash5.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip"
        className={styles.image}
      ></img>
      <br />
      <div className={styles.chatWindow}>
        <TargetIndicator count={targetCount} />
        <ChatThread messages={messages} />
        <ChatForm
          messages={messages}
          setMessages={setMessages}
          setTargetCount={setTargetCount}
          session={session}
          setSession={setSession}
          handleSummaryOpen={handleSummaryOpen}
        />
        <SummaryPopup
          open={open}
          setOpen={setOpen}
          message={"That's a wrap! Let's see how you did on this lesson!"}
          buttonText={"OK"}
          targetCount={targetCount}
        />
        <Button onClick={handleSummaryOpen}>View Summary</Button>
      </div>
    </div>
  );
}
