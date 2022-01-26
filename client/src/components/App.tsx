/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState, useEffect } from "react";
import Cmi5 from "@xapi/cmi5";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import readTime from "reading-time";
import { createSession, fetchLesson } from "api";
import ChatThread from "components/ChatThread";
import ChatForm from "components/ChatForm";
import { TargetIndicator } from "components/TargetIndicator";
import SurveySays from "components/SurveySays";
import SummaryPopup from "components/SummaryPopup";
import ErrorPopup from "components/ErrorPopup";
import { errorForStatus } from "components/ErrorConfig";
import {
  ChatMsg,
  DialogData,
  ErrorData,
  ExpectationData,
  Lesson,
  LessonFormat,
  SessionData,
  SessionSummary,
  Target,
} from "types";
import withLocation from "wrap-with-location";
import LessonMedia from "./LessonMedia";
import HeaderBar from "./HeaderBar";
import { isTesting } from "utils";
import { useMediaQuery } from "@material-ui/core";
import TriggerDialog from "./TriggerDialog";

const useStyles = makeStyles((theme) => ({
  foreground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  appRoot: {
    width: "100%",
    boxSizing: "border-box",
  },
  appRootDefault: {
    height: "calc(100% - 64px)",
  },
  appRootSuperDenseHeader: {
    height: "calc(100% - 30px)",
  },
  appRootNoHeader: {
    height: "calc(100% - 0px)",
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
  search: {
    lesson: string;
    guest: string;
    actor: string;
    noHeader: string;
    triggerWarning: string;
    triggerRedirect: string;
  };
}): JSX.Element {
  const styles = useStyles();
  const { lesson, guest, actor, noHeader, triggerWarning, triggerRedirect } =
    props.search;
  const username = actor ? JSON.parse(actor).name : guest;
  const [sessionSummary, setSessionSummary] = useState<SessionSummary>({
    showSummary: false,
    summaryMessage: "Let's see how you're doing so far!",
  });
  const [sessionAlive, setSessionAlive] = useState(true);
  const [targets, setTargets] = useState<Target[]>([]);
  const [session, setSession] = useState<SessionData>({
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
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [errorProps, setErrorProps] = useState<ErrorData>({
    title: "",
    message: "",
    buttonText: "",
  });
  const [errorOpen, setErrorOpen] = useState(false);
  const [hasMedia, setHasMedia] = useState(false);
  const [lessonFormat, setLessonFormat] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [showTriggerWarning, setShowTriggerWarning] = useState(false);

  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    setShowHeader(!noHeader || noHeader != "true");
  }, [props.search]);

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

  useEffect(() => {
    console.log("Redirect Info:");
    console.log(triggerWarning);
    console.log(triggerRedirect);
    if (triggerWarning) {
      setShowTriggerWarning(true);
    }
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    let mounted = true;
    fetchLesson(lesson)
      .then((lesson: Lesson) => {
        if (!mounted) {
          return;
        }
        if (lesson) {
          document.title = lesson.name;
          if (lesson.learningFormat === "surveySays") {
            setLessonFormat(LessonFormat.SURVEY_SAYS);
          }
          setHasMedia(Boolean(lesson.media));
        }
      })
      .catch((err: string) => console.error(err));
    return () => {
      mounted = false;
    };
  }, [lesson]);

  useEffect(() => {
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
    <>
      <TriggerDialog
        showTriggerWarning={showTriggerWarning}
        setShowTriggerWarning={setShowTriggerWarning}
        triggerRedirect={triggerRedirect}
      />
      <div className={styles.foreground}>
        {showHeader ? (
          <HeaderBar superDense={isMobile} />
        ) : (
          <div id="invisible-header"></div>
        )}
        <div
          id="app-content"
          className={clsx({
            [styles.appRoot]: true,
            [styles.appRootDefault]: showHeader && !isMobile,
            [styles.appRootSuperDenseHeader]: showHeader && isMobile,
            [styles.appRootNoHeader]: !showHeader,
          })}
        >
          <LessonMedia lessonFormat={lessonFormat} />
          {lessonFormat === LessonFormat.SURVEY_SAYS ? (
            <>
              <SurveySays hasMedia={hasMedia} targets={targets} />
            </>
          ) : (
            <>
              <TargetIndicator
                targets={targets}
                showSummary={onSummaryOpenRequested}
              />
            </>
          )}
          <ChatThread
            messages={messages}
            hasMedia={hasMedia}
            lessonFormat={lessonFormat}
            expectationCount={targets.length}
          />
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
        </div>
      </div>
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
    </>
  );
}

export default withLocation(App);
