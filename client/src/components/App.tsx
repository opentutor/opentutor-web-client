/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import Cmi5 from "@xapi/cmi5";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import readTime from "reading-time";
import { createSession, fetchLesson, warmupLessonLambda } from "api";
import { errorForStatus } from "components/ErrorConfig";
import {
  ChatMsg,
  DialogData,
  ErrorData,
  Lesson,
  LessonFormat,
  SessionData,
  SessionSummary,
  Target,
} from "types";
import withLocation from "wrap-with-location";
import { isTesting, shouldDisplayPortrait } from "utils";
import Mobile from "./views/Mobile";
import Desktop from "./views/Desktop";

export interface AppProps {
  search: {
    noheader: string;
    lesson: string;
  };
  isMobile: boolean;
  lessonFormat: string;
  hasMedia: boolean;
  targets: Target[];
  messages: ChatMsg[];
  messageQueue: ChatMsg[];
  lesson: string;
  username: string;
  session: SessionData;
  sessionAlive: boolean;
  sessionSummary: SessionSummary;
  errorOpen: boolean;
  errorProps: ErrorData;
  setErrorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSessionAlive: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorProps: React.Dispatch<React.SetStateAction<ErrorData>>;
  setSession: React.Dispatch<React.SetStateAction<SessionData>>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMsg[]>>;
  setMessageQueue: React.Dispatch<React.SetStateAction<ChatMsg[]>>;
  setTargets: React.Dispatch<React.SetStateAction<Target[]>>;
  onSummaryOpenRequested: () => void;
  onSummaryCloseRequested: () => void;
  onSummarySubmitRequested: () => void;
  handleErrorOpen: () => void;
  handleSessionDone: (session: SessionData) => void;
}

function App(props: {
  search: { lesson: string; guest: string; actor: string };
}): JSX.Element {
  const { lesson, guest, actor } = props.search;
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
    score: 0,
  });
  const [messages, setMessages] = React.useState<ChatMsg[]>([]);
  const [messageQueue, setMessageQueue] = React.useState<ChatMsg[]>([]);
  const [messageQueueTimer, setMessageQueueTimer] = React.useState<number>();
  const [errorProps, setErrorProps] = React.useState<ErrorData>({
    title: "",
    message: "",
    buttonText: "",
  });
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [hasMedia, setHasMedia] = React.useState(false);
  const [lessonFormat, setLessonFormat] = React.useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMobile = useMediaQuery("(max-width : 600px)", {
    noSsr: true,
  });

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
      score: session.score,
    });
  }

  async function sendCmi5Results(): Promise<void> {
    if (!Cmi5.isCmiAvailable) {
      return;
    }
    setSessionSummary((sessionSummary) => {
      return {
        ...sessionSummary,
        sendResultsPending: true,
      };
    });
    await Cmi5.instance.moveOn({ score: sessionSummary.score || 0 });
    setSessionSummary((sessionSummary) => {
      return {
        ...sessionSummary,
        sendResultsPending: false,
      };
    });
  }

  const onSummaryOpenRequested = (): void => {
    setSessionSummary({
      ...sessionSummary,
      showSummary: true,
    });
  };

  const onSummaryCloseRequested = (): void => {
    setSessionSummary((sessionSummary) => {
      return {
        ...sessionSummary,
        showSummary: false,
      };
    });
  };

  const onSummarySubmitRequested = (): void => {
    if (sessionAlive || !Cmi5.isCmiAvailable) {
      return;
    }
    onSummaryCloseRequested();
    sendCmi5Results();
  };

  const handleErrorOpen = (): void => {
    setErrorOpen(true);
  };

  React.useEffect(() => {
    warmupLessonLambda(lesson);
  }, []);

  React.useEffect(() => {
    let mounted = true;
    if (!username) {
      return;
    }
    const fetchData = async (): Promise<void> => {
      const response = await createSession(lesson || "", username);
      if (!mounted) {
        return;
      }
      if (response.status !== 200) {
        setErrorProps(errorForStatus(response.status, `${response.data}`));
        handleErrorOpen();
      } else {
        const dialogData = response.data as DialogData;
        setSession({
          ...dialogData.sessionInfo,
          score: dialogData.score,
        });
        setMessageQueue([
          ...messageQueue,
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
  }, [username]); //Watches for vars in array to make updates. If none only updates on comp. mount

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

  React.useEffect(() => {
    if (messageQueue.length === 0 || messageQueueTimer) {
      return;
    }
    const message = messageQueue.shift();
    if (!message) {
      return;
    }
    setMessages([...messages, message]);
    setMessageQueue(messageQueue);
    if (messageQueue.length > 0) {
      const timer = (1000 + 60 * message.text.length) * 0.65;
      setMessageQueueTimer(timer);
      queue(timer);
    }
  }, [messageQueue, messageQueueTimer]);

  React.useEffect(() => {
    if (!sessionAlive) {
      setSessionSummary({
        ...sessionSummary,
        score: session.score,
      });
      if (messageQueue.length === 0 && !messageQueueTimer) {
        handleSessionDone(session);
      }
    }
  }, [sessionAlive, messageQueue, messageQueueTimer]);

  async function queue(ms: number): Promise<void> {
    await new Promise((res) => setTimeout(res, ms));
    setMessageQueueTimer(0);
  }

  return (
    <div>
      {shouldDisplayPortrait() || isMobile || matchesMobile ? (
        <Mobile
          isMobile={isMobile}
          lessonFormat={lessonFormat}
          hasMedia={hasMedia}
          targets={targets}
          messages={messages}
          messageQueue={messageQueue}
          username={username}
          session={session}
          sessionAlive={sessionAlive}
          sessionSummary={sessionSummary}
          errorOpen={errorOpen}
          errorProps={errorProps}
          setErrorOpen={setErrorOpen}
          setSessionAlive={setSessionAlive}
          setErrorProps={setErrorProps}
          setSession={setSession}
          setMessages={setMessages}
          setMessageQueue={setMessageQueue}
          setTargets={setTargets}
          onSummaryOpenRequested={onSummaryOpenRequested}
          onSummaryCloseRequested={onSummaryCloseRequested}
          onSummarySubmitRequested={onSummarySubmitRequested}
          handleErrorOpen={handleErrorOpen}
          handleSessionDone={handleSessionDone}
        />
      ) : (
        <Desktop
          isMobile={isMobile}
          lessonFormat={lessonFormat}
          hasMedia={hasMedia}
          targets={targets}
          messages={messages}
          messageQueue={messageQueue}
          username={username}
          session={session}
          sessionAlive={sessionAlive}
          sessionSummary={sessionSummary}
          errorOpen={errorOpen}
          errorProps={errorProps}
          setErrorOpen={setErrorOpen}
          setSessionAlive={setSessionAlive}
          setErrorProps={setErrorProps}
          setSession={setSession}
          setMessages={setMessages}
          setMessageQueue={setMessageQueue}
          setTargets={setTargets}
          onSummaryOpenRequested={onSummaryOpenRequested}
          onSummaryCloseRequested={onSummaryCloseRequested}
          onSummarySubmitRequested={onSummarySubmitRequested}
          handleErrorOpen={handleErrorOpen}
          handleSessionDone={handleSessionDone}
        />
      )}
    </div>
  );
}

export default withLocation(App);
