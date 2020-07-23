import React, { useState, useEffect } from "react";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { createSession } from "api";
import "styles/layout.css";
import { Button, Typography } from "@material-ui/core";
import withLocation from "wrap-with-location";
import ChatThread from "components/ChatThread";
import ChatForm from "components/ChatForm";
import { TargetIndicator } from "components/TargetIndicator";
import SummaryPopup from "components/SummaryPopup";
import "styles/layout.css";

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
    height: "67%",
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, 0%)",
    marginBottom: 15,
  },
  buildInfo: {
    position: "fixed",
    bottom: 4,
    marginLeft: 8,
    color: "white",
    fontWeight: "bold",
    fontSize: "70%",
  },
}));

const App = (props: { search: any }) => {
  const styles = useStyles();
  const { lesson } = props.search;
  const [open, setOpen] = React.useState(false);
  const [summaryMessage, setSummaryMessage] = React.useState(
    "Let's see how you're doing so far!"
  );
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
      setSession(response.data.sessionInfo);

      // Add Messages
      const newMessages = messages.slice();
      response.data.response.forEach((msg: any) => {
        newMessages.push({
          senderId: "system",
          type: msg.type,
          text: msg.data.text,
        });
      });
      setMessages(newMessages);

      // Add expectations
      const newTargets: any[] = [];
      response.data.sessionInfo.dialogState.expectationData.forEach(
        (exp: any) => {
          newTargets.push({
            achieved: exp.satisfied,
            score: exp.score,
            text: exp.ideal,
            status: exp.status,
          });
        }
      );

      setTargets(newTargets);
      console.log(newTargets);
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
        <TargetIndicator targets={targets} showSummary={handleSummaryOpen} />
        <ChatThread messages={messages} />
        <ChatForm
          lesson={lesson}
          messages={messages}
          setMessages={setMessages}
          setTargets={setTargets}
          session={session}
          setSession={setSession}
          handleSummaryOpen={handleSummaryOpen}
          setSummaryMessage={setSummaryMessage}
        />
        <SummaryPopup
          open={open}
          setOpen={setOpen}
          message={summaryMessage}
          buttonText={"Close"}
          targets={targets}
        />
        <Button id="view-summary-btn" onClick={handleSummaryOpen}>
          View Summary
        </Button>
      </div>
      <Typography className={styles.buildInfo}>
        OpenTutor Client V1.0.0-alpha.8
      </Typography>
    </div>
  );
};

export default withLocation(App);
