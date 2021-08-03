/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import Cmi5 from "@xapi/cmi5";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import readTime from "reading-time";
import { createSession, fetchLesson } from "api";
import ChatThread from "components/ChatThread";
import ChatForm from "components/ChatForm";
import { TargetIndicator } from "components/TargetIndicator";
import SummaryPopup from "components/SummaryPopup";
import ErrorPopup from "components/ErrorPopup";
import { errorForStatus } from "components/ErrorConfig";
import {
  ChatMsg,
  DialogData,
  ErrorData,
  ExpectationData,
  Lesson,
  SessionData,
  SessionSummary,
  Target,
} from "types";
import withLocation from "wrap-with-location";
import LessonMedia from "./LessonMedia";
import HeaderBar from "./HeaderBar";
import { isTesting } from "utils";

const useStyles = makeStyles((theme) => ({
  foreground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  chatWindow: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
    width: "100%",
  },
  buildInfo: {
    padding: 5,
    color: "white",
    fontWeight: "bold",
    fontSize: "70%",
    backgroundColor: theme.palette.primary.main,
    textAlign: "left",
  },
}));

function App(props: {
  search: { lesson: string; guest: string; actor: string; noheader: string };
}): JSX.Element {
  const styles = useStyles();
  const { lesson, guest, actor, noheader } = props.search;
  const username = actor ? JSON.parse(actor).name : guest;
  const [sessionSummary, setSessionSummary] = React.useState<SessionSummary>({
    showSummary: false,
    summaryMessage: "Let's see how you're doing so far!",
  });
  const [sessionAlive, setSessionAlive] = React.useState(true);
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
  const [messages, setMessages] = React.useState<ChatMsg[]>([]);
  const [errorProps, setErrorProps] = React.useState<ErrorData>({
    title: "",
    message: "",
    buttonText: "",
  });
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [image, setImage] = React.useState<string>();
  const [surveySays, setSurveySays] = React.useState(false);
  setSurveySays(false)

  function handleSessionDone(session: SessionData): void {
    setSessionSummary({
      summaryMessage: "That's a wrap! Let's see how you did on this lesson!",
      // show the summary immediately if testing, otherwise...
      showSummary: isTesting(),
      // get the `readTime` for the concat string
      // of all messages sent from the server
      // after last user input
      showSummaryTimer: !isTesting()
        ? Math.max(
            readTime(
              (session.previousSystemResponse || []).reduce((acc, cur) => {
                return `${cur}${acc}`;
              }, "")
            ).time,
            1000 // at least 1 second
          )
        : undefined,
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
    await Cmi5.instance.moveOn({ score: sessionSummary.score || 0 });
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

  React.useEffect(() => {
    let mounted = true;
    const fetchData = async (): Promise<void> => {
      const response = await createSession(lesson || "");
      if (!mounted) {
        return;
      }
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
    return () => {
      mounted = false;
    };
  }, []); //Watches for vars in array to make updates. If none only updates on comp. mount

  React.useEffect(() => {
    let mounted = true;
    fetchLesson(lesson)
      .then((lesson: Lesson) => {
        if (!mounted) {
          return;
        }
        if (lesson) {
          setImage(lesson.image);
        }
      })
      .catch((err: string) => console.error(err));
    return () => {
      mounted = false;
    };
  }, [lesson]);

  React.useEffect(() => {
    let mounted = true;
    if (
      sessionSummary.showSummaryTimer &&
      sessionSummary.showSummaryTimer > 0
    ) {
      setTimeout(() => {
        if (!mounted) {
          return;
        }
        setSessionSummary({
          ...sessionSummary,
          showSummaryTimer: undefined,
          showSummary: true,
        });
      }, sessionSummary.showSummaryTimer);
    }
    return () => {
      mounted = false;
    };
  }, [sessionSummary]);

  return (
    <div className={styles.foreground}>
      {noheader ? undefined : <HeaderBar />}
      <LessonMedia surveySays={surveySays} targets={targets} />
      <div
        className={styles.chatWindow}
        style={{ height: image ? "65%" : "100%" }}
      >
        {!surveySays ? (
          <>
            <TargetIndicator
              targets={targets}
              showSummary={onSummaryOpenRequested}
            />
          </>
        ) : (
          <></>
        )}
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
          handleErrorOpen={handleErrorOpen}
          handleSessionDone={handleSessionDone}
          sessionAlive={sessionAlive}
          setSessionAlive={setSessionAlive}
          onSummaryOpenRequested={onSummaryOpenRequested}
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
        {sessionAlive ? (
          <Button data-cy="view-summary-btn" onClick={onSummaryOpenRequested}>
            Preview Summary
          </Button>
        ) : (
          <></>
        )}
      </div>
      <Typography className={styles.buildInfo}>
        OpenTutor {process.env.OPENTUTOR_CLIENT_VERSION}
      </Typography>
    </div>
  );
}

export default withLocation(App);
