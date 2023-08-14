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
  Typography,
  useMediaQuery,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HelpIcon from "@mui/icons-material/Help";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import BlockIcon from "@mui/icons-material/Block";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { ChatMsg, ChatMsgType, LessonFormat } from "types";
import { isNoHeader, isTesting, shouldDisplayPortrait } from "utils";
import {
  chatThreadStylesDesktop,
  chatThreadStylesMobile,
} from "styles/chatThread";

function calcBoardHeight(expectationCount: number) {
  // 46px per target, 31px for question, 16*2px padding, 5*2 border, 10*2px padding
  return expectationCount * 46 + 31 + 32 + 10 + 20;
}

export default function ChatThread(props: {
  messages: ChatMsg[];
  messageQueue: ChatMsg[];
  hasMedia: boolean;
  lessonFormat: string;
  expectationCount: number;
}): JSX.Element {
  const matchesMobile = useMediaQuery("(max-width : 600px)", { noSsr: true });
  const { classes: stylesDesktop } = chatThreadStylesDesktop({
    expectationCount: props.expectationCount,
  });
  const { classes: stylesMobile } = chatThreadStylesMobile({
    expectationCount: props.expectationCount,
  });

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
    } else if (type === ChatMsgType.Queue) {
      icon = <Typography>{props.messageQueue.length}</Typography>;
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

  const msgs: ChatMsg[] =
    props.messageQueue.length > 0
      ? [
          ...props.messages,
          {
            senderId: "system",
            type: "queue",
            text: "  . . .  ",
          },
        ]
      : props.messages;

  return (
    <div
      data-cy="chat-thread"
      className={clsx({
        [stylesDesktop.bodyRoot]: true,
        [stylesDesktop.bodyDefaultNoMedia]:
          (props.lessonFormat || LessonFormat.DEFAULT) ==
            LessonFormat.DEFAULT && !props.hasMedia,
        [stylesMobile.bodyDefaultMediaMobile]:
          (shouldDisplayPortrait() || matchesMobile) &&
          (props.lessonFormat || LessonFormat.DEFAULT) ==
            LessonFormat.DEFAULT &&
          props.hasMedia,
        [stylesDesktop.bodyDefaultMedia]:
          !shouldDisplayPortrait() &&
          (props.lessonFormat || LessonFormat.DEFAULT) ==
            LessonFormat.DEFAULT &&
          props.hasMedia,
        [stylesDesktop.bodySurveySaysNoMedia]:
          (props.lessonFormat || LessonFormat.DEFAULT) ==
            LessonFormat.SURVEY_SAYS && !props.hasMedia,
        [stylesDesktop.bodySurveySaysMedia]:
          (props.lessonFormat || LessonFormat.DEFAULT) ==
            LessonFormat.SURVEY_SAYS && props.hasMedia,
        [stylesMobile.bodySurveySaysMediaMobile]:
          (shouldDisplayPortrait() || matchesMobile) &&
          (props.lessonFormat || LessonFormat.DEFAULT) ==
            LessonFormat.SURVEY_SAYS &&
          props.hasMedia,
        [stylesMobile.noHeader_BodySurveySaysMediaMobile]:
          (shouldDisplayPortrait() || matchesMobile) &&
          isNoHeader() &&
          (props.lessonFormat || LessonFormat.DEFAULT) ==
            LessonFormat.SURVEY_SAYS &&
          props.hasMedia,
      })}
      style={
        (props.lessonFormat || LessonFormat.DEFAULT) ==
          LessonFormat.SURVEY_SAYS && props.hasMedia
          ? {
              height: `calc(70% - 95px - ${calcBoardHeight(
                props.expectationCount
              )}px)`,
            }
          : (props.lessonFormat || LessonFormat.DEFAULT) ==
              LessonFormat.SURVEY_SAYS && !props.hasMedia
          ? {
              height: `calc(100% - 95px - ${calcBoardHeight(
                props.expectationCount
              )}px)`,
            }
          : {}
      }
    >
      <List
        data-cy="thread"
        id="thread"
        disablePadding={true}
        className={stylesDesktop.chatThreadList}
      >
        {msgs.map((message, i) => {
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
                height: shouldDisplayPortrait() ? "auto" : "auto",
                width: shouldDisplayPortrait()
                  ? "90% !important"
                  : "100% !important",
                maxWidth: shouldDisplayPortrait()
                  ? "90% !important"
                  : "100% !important",
                marginRight: "20px",
              }}
            >
              <div style={{ padding: "10px 20px 10px 10px" }}>
                <ListItemText primary={message.text} />
              </div>
              {chatIcon(message.type)}
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
