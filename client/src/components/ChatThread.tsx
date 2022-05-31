/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import "styles/chat.css";
import React, { useEffect } from "react";
import { animateScroll } from "react-scroll";
import clsx from "clsx";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HelpIcon from "@material-ui/icons/Help";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import BlockIcon from "@material-ui/icons/Block";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import { ChatMsg, ChatMsgType, LessonFormat } from "types";
import { isNoHeader, isTesting, shouldDisplayPortrait } from "utils";
import {
  chatThreadStylesDesktop,
  ChatThreadStylesProps,
  chatThreadStylesMobile,
} from "./styles/chatThread";

export default function ChatThread(props: {
  messages: ChatMsg[];
  hasMedia: boolean;
  lessonFormat: string;
  expectationCount: number;
}): JSX.Element {
  const chatThreadStylesProps: ChatThreadStylesProps = {
    expectationCount: props.expectationCount,
  };

  const stylesDesktop = chatThreadStylesDesktop(chatThreadStylesProps);
  const stylesMobile = chatThreadStylesMobile(chatThreadStylesProps);

  const chatIcon = (type: string): JSX.Element | undefined => {
    let icon = undefined;
    let color = stylesDesktop.gray;

    if (type === ChatMsgType.MainQuestion || type === "hint") {
      icon = <HelpIcon />;
    } else if (type === ChatMsgType.FeedbackPositive) {
      icon = <CheckCircleIcon />;
      color = stylesDesktop.green;
    } else if (type === ChatMsgType.FeedbackNegative) {
      icon = <CancelIcon />;
      color = stylesDesktop.red;
    } else if (type === ChatMsgType.FeedbackNeutral) {
      icon = <ImportExportIcon />;
      color = stylesDesktop.yellow;
    } else if (type === ChatMsgType.Encouragement) {
      icon = <FlashOnIcon />;
      color = stylesDesktop.green;
    } else if (type === ChatMsgType.Profanity) {
      icon = <BlockIcon />;
      color = stylesDesktop.red;
    }

    if (!icon) {
      return undefined;
    }
    return (
      <div className={stylesDesktop.icon}>
        <ListItemAvatar>
          <Avatar className={[stylesDesktop.avatar, color].join(" ")}>
            {icon}
          </Avatar>
        </ListItemAvatar>
      </div>
    );
  };
  useEffect(() => {
    if (
      /**
       * HACK: cypress image-snapshot tests fail
       * with auto scroll as of cypress@6.0 and cypress-image-snapshot@4.0
       * Haven't been able to fix with any form of event checking
       * or brute-force waiting.
       * Revisit/remove this check when possible.
       */
      !isTesting()
    ) {
      animateScroll.scrollToBottom({
        containerId: "thread",
      });
    }
  });

  const stylesThread = clsx({
    [stylesDesktop.bodyRoot]: true,
    [stylesDesktop.bodyDefaultNoMedia]:
      (props.lessonFormat || LessonFormat.DEFAULT) == LessonFormat.DEFAULT &&
      !props.hasMedia,
    [stylesMobile.bodyDefaultMediaMobile]:
      shouldDisplayPortrait() &&
      (props.lessonFormat || LessonFormat.DEFAULT) == LessonFormat.DEFAULT &&
      props.hasMedia,
    [stylesDesktop.bodyDefaultMedia]:
      !shouldDisplayPortrait() &&
      (props.lessonFormat || LessonFormat.DEFAULT) == LessonFormat.DEFAULT &&
      props.hasMedia,
    [stylesDesktop.bodySurveySaysNoMedia]:
      (props.lessonFormat || LessonFormat.DEFAULT) ==
        LessonFormat.SURVEY_SAYS && !props.hasMedia,
    [stylesDesktop.bodySurveySaysMedia]:
      (props.lessonFormat || LessonFormat.DEFAULT) ==
        LessonFormat.SURVEY_SAYS && props.hasMedia,

    [stylesMobile.bodySurveySaysMediaMobile]:
      shouldDisplayPortrait() &&
      (props.lessonFormat || LessonFormat.DEFAULT) ==
        LessonFormat.SURVEY_SAYS &&
      props.hasMedia,

    [stylesMobile.noHeader_BodySurveySaysMediaMobile]:
      shouldDisplayPortrait() &&
      isNoHeader() &&
      (props.lessonFormat || LessonFormat.DEFAULT) ==
        LessonFormat.SURVEY_SAYS &&
      props.hasMedia,
  });

  return (
    <div data-cy="chat-thread" className={stylesThread}>
      <List
        data-cy="thread"
        id="thread"
        disablePadding={true}
        className={stylesDesktop.chatThreadList}
      >
        {props.messages.map((message, i) => {
          return (
            <ListItem
              data-cy={`chat-msg-${i}`}
              key={`chat-msg-${i}`}
              disableGutters={false}
              className={message.senderId}
              classes={{
                root: stylesDesktop.root,
              }}
              style={{
                paddingRight: chatIcon(message.type) ? 24 : 16,
                height: shouldDisplayPortrait() ? "auto" : "90px",
                width: shouldDisplayPortrait()
                  ? "90% !important"
                  : "100% !important",
                maxWidth: shouldDisplayPortrait()
                  ? "90% !important"
                  : "100% !important",
              }}
            >
              <ListItemText primary={message.text} />
              {chatIcon(message.type)}
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
