/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import { createSession, fetchLesson } from "api";
import ChatThread from "components/ChatThread";
import ChatForm from "components/ChatForm";
import { TargetIndicator } from "components/TargetIndicator";
import SummaryPopup from "components/SummaryPopup";
import ErrorPopup from "components/ErrorPopup";
import { errorForStatus } from "components/ErrorConfig";
import {
  ChatMsg,
  ErrorData,
  Target,
  ChatMsgType,
  SessionData,
  DialogData,
  Lesson,
} from "types";
import withLocation from "wrap-with-location";

const useStyles = makeStyles((theme) => ({
  foreground: {
    backgroundColor: theme.palette.primary.main,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  scroll: {
    overflow: "auto",
    whiteSpace: "nowrap",
    // width: "100%",
    maxHeight: "35%",
    minHeight: "35%",
  },
  image: {
    minWidth: 400,
    minHeight: "35%",
  },
  chatWindow: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    height: "60%",
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

const App = (props: {
  search: { lesson: string; guest: string };
}): JSX.Element => {
  const styles = useStyles();
  const { lesson, guest } = props.search;
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
  const [messages, setMessages] = React.useState<ChatMsg[]>([
    {
      senderId: "system",
      type: ChatMsgType.Opening,
      text: "Welcome to OpenTutor!",
    },
  ]);
  const [errorProps, setErrorProps] = React.useState<ErrorData>({
    title: "",
    message: "",
    buttonText: "",
  });
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [image, setImage] = React.useState<string>();
  const [imgWidth, setImgWidth] = React.useState(0);
  const [imgHeight, setImgHeight] = React.useState(0);
  const [windowWidth, setWindowWidth] = React.useState(0);
  const [windowHeight, setWindowHeight] = React.useState(0);

  const handleSummaryOpen = (): void => {
    setSummaryOpen(true);
  };

  const handleErrorOpen = (): void => {
    setErrorOpen(true);
  };

  const showImage = (): JSX.Element => {
    return (
      <div className={styles.scroll}>
        <img
          src={image}
          className={styles.image}
          style={{
            width: imgHeight > imgWidth ? 400 : "",
          }}
        ></img>
      </div>
    );
  };

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  React.useEffect(() => {
    fetchLesson(lesson)
      .then((lesson: Lesson) => {
        if (lesson) {
          setImage(lesson.image);
          const img = new Image();
          img.addEventListener("load", function () {
            setImgHeight(this.naturalHeight);
            setImgWidth(this.naturalWidth);
          });
          img.src = lesson.image;
        }
      })
      .catch((err: string) => console.error(err));
  }, [lesson]);

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const response = await createSession(lesson || "");
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
      {showImage()}
      <div className={styles.chatWindow}>
        <TargetIndicator targets={targets} showSummary={handleSummaryOpen} />
        <ChatThread messages={messages} />
        <ChatForm
          lesson={lesson}
          username={guest}
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
        OpenTutor Client {process.env.OPENTUTOR_CLIENT_VERSION}
      </Typography>
    </div>
  );
};

export default withLocation(App);
