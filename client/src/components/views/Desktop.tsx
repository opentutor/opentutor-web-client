/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
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
import { isTesting, shouldDisplayPortrait } from "utils";
import { useMediaQuery } from "@material-ui/core";
import HeaderBar from "components/HeaderBar";
import LessonMedia from "components/LessonMedia";
import SurveySaysDesktop from "./SurveySays-Desktop";

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

function Desktop(props: {
  lesson: string;
  guest: string;
  actor: string;
  noheader: string;
}): JSX.Element {
  const { lesson, guest, actor, noheader } = props;
  const styles = useStyles();

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
  const [hasMedia, setHasMedia] = React.useState(false);
  const [lessonFormat, setLessonFormat] = React.useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

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

  let showHeader = true;
  if (noheader !== undefined) {
    showHeader = false;
  }
  return (
    <>
      <div className={styles.foreground}>
        {noheader ? (
          <div id="invisible-header"></div>
        ) : (
          <HeaderBar superDense={isMobile} />
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
              {shouldDisplayPortrait() ? (
                <SurveySays hasMedia={hasMedia} targets={targets} />
              ) : (
                <SurveySaysDesktop hasMedia={hasMedia} targets={targets} />
              )}
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

export default withLocation(Desktop);
