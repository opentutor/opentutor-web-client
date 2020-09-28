/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useEffect } from "react";
import { Cmi5 } from "react-cmi5-context";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import { createSession, DialogData, SessionData, ExpectationData } from "api";
import ChatThread from "components/ChatThread";
import ChatForm from "components/ChatForm";
import { TargetIndicator } from "components/TargetIndicator";
import SummaryPopup from "components/SummaryPopup";
import ErrorPopup from "components/ErrorPopup";
import { errorForStatus } from "components/ErrorConfig";
import { ChatMsg, ErrorData, Target, ChatMsgType, SessionSummary } from "types";
import withLocation from "wrap-with-location";

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

function App(props: {
  search: { lesson: string; guest: string; actor: string };
}): JSX.Element {
  const styles = useStyles();
  const { lesson, guest, actor } = props.search;
  const username = actor ? JSON.parse(actor).name : guest;
  const [sessionSummary, setSessionSummary] = React.useState<SessionSummary>({
    showSummary: false,
    summaryMessage: "Let's see how you're doing so far!",
  });
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
      type: ChatMsgType.Opening,
      text: "Welcome to OpenTutor!",
    },
  ]);
  const [errorProps, setErrorProps] = useState<ErrorData>({
    title: "",
    message: "",
    buttonText: "",
  });
  const [errorOpen, setErrorOpen] = React.useState(false);

  function handleSessionDone(session: SessionData): void {
    setSessionSummary({
      summaryMessage: "That's a wrap! Let's see how you did on this lesson!",
      showSummary: true,
      sendResultsPending: true,
      score:
        session.dialogState.expectationData.reduce(
          (total: number, exp: ExpectationData) => {
            return total + (exp.satisfied ? 1 : exp.score);
          },
          0
        ) / targets.length,
    });
  }

  async function sendCmi5Results(): Promise<void> {
    if (!Cmi5.isCmiAvailable) {
      return;
    }
    const cmi5 = Cmi5.get();
    // TODO: everything here and below
    // should be a function in the cmi lib
    const lms = cmi5.state.lmsLaunchData.contents || {};
    const score = sessionSummary.score || 0;
    const scoreExt = { score };
    if (lms.moveOn) {
      await cmi5.moveOn(scoreExt);
    } else {
      const masteryScore = lms.masteryScore || 0;
      if (masteryScore > score) {
        await cmi5.failed(scoreExt);
      } else {
        await cmi5.passed(scoreExt);
      }
      await cmi5.completed();
      await cmi5.terminate();
    }
  }

  const onSummaryOpenRequested = (): void => {
    setSessionSummary({
      ...sessionSummary,
      showSummary: true,
    });
  };

  const onSummaryCloseRequested = (): void => {
    const sendResults = sessionSummary.sendResultsPending;
    setSessionSummary((sessionSummary) => {
      return {
        ...sessionSummary,
        showSummary: false,
        sendResultsPending: false,
      };
    });
    if (sendResults) {
      sendCmi5Results();
    }
  };

  const handleErrorOpen = (): void => {
    setErrorOpen(true);
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const lessonOut = lesson || "";
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
        <TargetIndicator
          targets={targets}
          showSummary={onSummaryOpenRequested}
        />
        <ChatThread messages={messages} />
        <ChatForm
          lesson={lesson}
          username={username}
          messages={messages}
          setMessages={setMessages}
          setTargets={setTargets}
          session={session}
          setSession={setSession}
          setErrorProps={setErrorProps}
          // onSummaryOpenRequested={onSummaryOpenRequested}
          handleErrorOpen={handleErrorOpen}
          handleSessionDone={handleSessionDone}
        />
        <SummaryPopup
          open={sessionSummary.showSummary}
          onCloseRequested={onSummaryCloseRequested}
          message={sessionSummary.summaryMessage || ""}
          buttonText={"Close"}
          targets={targets}
        />
        <ErrorPopup
          open={errorOpen}
          setOpen={setErrorOpen}
          errorProps={errorProps}
        />
        <Button id="view-summary-btn" onClick={onSummaryOpenRequested}>
          View Summary
        </Button>
      </div>
      <Typography className={styles.buildInfo}>
        OpenTutor Client {process.env.OPENTUTOR_CLIENT_VERSION}
      </Typography>
    </div>
  );
}

export default withLocation(App);
