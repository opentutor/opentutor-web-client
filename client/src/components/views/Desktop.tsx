/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import Cmi5 from "@xapi/cmi5";
import clsx from "clsx";
import ChatThread from "components/ChatThread";
import ChatForm from "components/ChatForm";
import { TargetIndicator } from "components/TargetIndicator";
import SurveySays from "components/SurveySays";
import SummaryPopup from "components/SummaryPopup";
import ErrorPopup from "components/ErrorPopup";
import LessonMedia from "components/LessonMedia";
import HeaderBar from "components/HeaderBar";
import { LessonFormat } from "types";
import { isNoHeader, shouldDisplayPortrait } from "utils";
import { appStylesDesktop } from "styles/app";
import { AppProps } from "components/App";
import withLocation from "wrap-with-location";

function Desktop(props: AppProps): JSX.Element {
  const { classes: styles } = appStylesDesktop();
  const {
    isMobile,
    lessonFormat,
    hasMedia,
    targets,
    messages,
    messageQueue,
    username,
    session,
    sessionAlive,
    sessionSummary,
    errorOpen,
    errorProps,
    setErrorOpen,
    setSessionAlive,
    setErrorProps,
    setSession,
    setMessages,
    setMessageQueue,
    setTargets,
    onSummaryOpenRequested,
    onSummaryCloseRequested,
    onSummarySubmitRequested,
    handleErrorOpen,
    handleSessionDone,
  } = props;
  const { lesson, noheader } = props.search;

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
            [styles.appRootDefault]: !noheader && !isMobile,
            [styles.appRootSuperDenseHeader]: !noheader && isMobile,
            [styles.appRootNoHeader]: noheader,
          })}
        >
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
          {hasMedia ? (
            <div
              className={clsx({
                [styles.middleAppContent]:
                  !isNoHeader() && !shouldDisplayPortrait(),
                [styles.noHeader_middleAppContent]:
                  isNoHeader() || shouldDisplayPortrait(),
              })}
            >
              <div className={styles.videoContainer}>
                <LessonMedia lessonFormat={lessonFormat} />
              </div>
              <div className={styles.chatThreadInputFormContainer}>
                <ChatThread
                  messages={messages}
                  messageQueue={messageQueue}
                  hasMedia={hasMedia}
                  lessonFormat={lessonFormat}
                  expectationCount={targets.length}
                />
                <ChatForm
                  username={username}
                  messages={messages}
                  messageQueue={messageQueue}
                  setMessages={setMessages}
                  setMessageQueue={setMessageQueue}
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
          ) : (
            <div
              className={clsx({
                [styles.hasNoMediaContainerMobile]: shouldDisplayPortrait(),
                [styles.hasNoMediaContainer]: !shouldDisplayPortrait(),
              })}
            >
              <ChatThread
                messages={messages}
                messageQueue={messageQueue}
                hasMedia={hasMedia}
                lessonFormat={lessonFormat}
                expectationCount={targets.length}
              />
              <ChatForm
                lesson={lesson}
                username={username}
                messages={messages}
                messageQueue={messageQueue}
                setMessages={setMessages}
                setMessageQueue={setMessageQueue}
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
          )}
        </div>
      </div>
      <SummaryPopup
        open={sessionSummary.showSummary}
        showSubmit={Cmi5.isCmiAvailable && !sessionAlive}
        sendResultsPending={sessionSummary.sendResultsPending}
        message={sessionSummary.summaryMessage || ""}
        targets={targets}
        onCloseRequested={onSummaryCloseRequested}
        onSubmitRequested={onSummarySubmitRequested}
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
