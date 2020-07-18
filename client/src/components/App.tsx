import React, { useState, useEffect } from "react";
import ChatThread from "../components/ChatThread";
import ChatForm from "../components/ChatForm";
import TargetIndicator from "../components/TargetIndicator";
import SummaryPopup from "../components/SummaryPopup";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import "styles/layout.css";
import { Button } from "@material-ui/core";
import { createSession } from "../api";
import withLocation from "wrap-with-location";

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
    height: "calc(100% - 75px)",
    minHeight: 750,
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, 0%)",
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

const App = (props: { search: any }) => {
  const styles = useStyles();
  const { lesson } = props.search;
  const [open, setOpen] = React.useState(false);
  const [targets, setTargets] = React.useState<any[]>([]);
  const [session, setSession] = React.useState(null);

  const INITIAL_DATA = [
    {
      senderId: "system",
      type: "opening",
      text: "Welcome to OpenTutor!",
    },
  ];
  const [messages, setMessages] = useState(INITIAL_DATA);

  const handleSummaryOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await createSession(lesson);
      const newMessages = messages.slice();

      // Add Messages
      response.data.response.forEach((msg: any) => {
        newMessages.push({
          senderId: "system",
          type: msg.type,
          text: msg.data.text,
        });
      });

      // Add expectations
      const newTargets: any[] = [];
      response.data.sessionInfo.dialogState.expectationData.forEach(
        (exp: any) => {
          newTargets.push({ achieved: exp.score });
        }
      );

      setTargets(newTargets);
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
        <TargetIndicator targets={targets} />
        <ChatThread messages={messages} />
        <ChatForm
          lesson={lesson}
          messages={messages}
          setMessages={setMessages}
          setTargets={setTargets}
          session={session}
          setSession={setSession}
          handleSummaryOpen={handleSummaryOpen}
        />
        <SummaryPopup
          open={open}
          setOpen={setOpen}
          message={"That's a wrap! Let's see how you did on this lesson!"}
          buttonText={"OK"}
          targets={targets}
        />
        <Button id="view-summary-btn" onClick={handleSummaryOpen}>
          View Summary
        </Button>
      </div>
    </div>
  );
};

export default withLocation(App);
