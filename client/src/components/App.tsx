/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useEffect } from "react";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import { createSession, DialogData, SessionData } from "api";
import ChatThread from "components/ChatThread";
import ChatForm from "components/ChatForm";
import { TargetIndicator } from "components/TargetIndicator";
import SummaryPopup from "components/SummaryPopup";
import ErrorPopup from "components/ErrorPopup";
import withLocation from "wrap-with-location";
import { errorForStatus } from "components/ErrorConfig";
import { ChatMsg, ErrorData, Target } from "./types";

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

const App = (props: { search: { lesson: string } }) => {
  const styles = useStyles();
  const { lesson } = props.search;
  const [summaryOpen, setSummaryOpen] = React.useState(false);
  const [summaryMessage, setSummaryMessage] = React.useState(
    "Let's see how you're doing so far!"
  );
  const [targets, setTargets] = React.useState<Target[]>([]);
  const [session, setSession] = React.useState<SessionData>({
    sessionId: "",
    sessionHistory: "",
    previousUserResponse: "",
    previousSystemResponse: [""],
    dialogState: {
      expectationsCompleted: false,
      expectationData: [{ ideal: "", score: 0, satisfied: false, status: "" }],
      hints: false,
    },
    hash: "",
  });

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      senderId: "system",
      type: "opening",
      text: "Welcome to OpenTutor!",
    },
  ]);
  const [errorProps, setErrorProps] = useState<ErrorData>({
    title: "",
    message: "",
    buttonText: "",
  });
  const handleSummaryOpen = () => {
    setSummaryOpen(true);
  };

  const [errorOpen, setErrorOpen] = React.useState(false);

  const handleErrorOpen = () => {
    setErrorOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const lessonOut = lesson || ""; //If lesson is undef make ""
      const response = await createSession(lessonOut);
      if (response.status !== 200) {
        setErrorProps(errorForStatus(response.status));
        handleErrorOpen();
      } else {
        const dialogData = response.data as DialogData;
        setSession(dialogData.sessionInfo);
        setMessages([
          ...messages,
          ...dialogData.response.map((msg) => {
            return {
              senderId: "system",
              type: msg.type,
              text: msg.data.text,
            };
          }),
        ]);
        setTargets(
          dialogData.sessionInfo.dialogState.expectationData.map((exp) => {
            return {
              achieved: exp.satisfied,
              score: exp.score,
              text: exp.ideal,
              status: exp.status,
            };
          })
        );
      }
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
          setErrorProps={setErrorProps}
          handleErrorOpen={handleErrorOpen}
        />
        <SummaryPopup
          open={summaryOpen}
          setOpen={setSummaryOpen}
          message={summaryMessage}
          buttonText={"Close"}
          targets={targets}
        />
        <ErrorPopup
          open={errorOpen}
          setOpen={setErrorOpen}
          errorProps={errorProps}
        />
        <Button id="view-summary-btn" onClick={handleSummaryOpen}>
          View Summary
        </Button>
      </div>
      <Typography className={styles.buildInfo}>
        OpenTutor Client V1.0.0-alpha.12
      </Typography>
    </div>
  );
};

export default withLocation(App);
