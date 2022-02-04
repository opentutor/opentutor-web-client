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
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HelpIcon from "@material-ui/icons/Help";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import BlockIcon from "@material-ui/icons/Block";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import { ChatMsg, ChatMsgType, LessonFormat } from "types";
import { isTesting } from "utils";

export default function ChatThread(props: {
  messages: ChatMsg[];
  hasMedia: boolean;
  lessonFormat: string;
  expectationCount: number;
}): JSX.Element {
  function calcBoardHeight(expectationCount: number) {
    // 46px per target, 16*2px padding, 5*2 border, 10*2px padding
    return expectationCount * 46 + 32 + 10 + 20;
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "auto",
      paddingTop: 0,
      paddingBottom: 0,
    },
    bodyRoot: {
      paddingTop: 10,
      width: "90%",
      maxWidth: 400,
      marginLeft: "50%",
      paddingBottom: 10,
      transform: "translateX(-50%)",
      boxSizing: "border-box",
    },
    //Note: Deduct extra pixel for rounding (ensure no scrollbar)
    bodyDefaultNoMedia: {
      height: "calc(100% - 60px - 95px - 1px)",
    },
    bodyDefaultMedia: {
      height: "calc(65% - 60px - 95px - 1px)",
    },
    bodySurveySaysNoMedia: {
      height: `calc(100% - 95px - ${calcBoardHeight(
        props.expectationCount
      )}px - 1px)`,
    },
    bodySurveySaysMedia: {
      height: `calc(70% - 95px - ${calcBoardHeight(
        props.expectationCount
      )}px - 1px)`,
    },
    avatar: {
      color: "#fff",
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    icon: {
      position: "absolute",
      right: -40,
    },
    gray: {},
    red: {
      background: "#DC143C",
    },
    green: {
      background: "#3CB371",
    },
    yellow: {
      background: "yellow",
    },
  }));

  const styles = useStyles();

  const chatIcon = (type: string): JSX.Element | undefined => {
    let icon = undefined;
    let color = styles.gray;

    if (type === ChatMsgType.MainQuestion || type === "hint") {
      icon = <HelpIcon />;
    } else if (type === ChatMsgType.FeedbackPositive) {
      icon = <CheckCircleIcon />;
      color = styles.green;
    } else if (type === ChatMsgType.FeedbackNegative) {
      icon = <CancelIcon />;
      color = styles.red;
    } else if (type === ChatMsgType.FeedbackNeutral) {
      icon = <ImportExportIcon />;
      color = styles.yellow;
    } else if (type === ChatMsgType.Encouragement) {
      icon = <FlashOnIcon />;
      color = styles.green;
    } else if (type === ChatMsgType.Profanity) {
      icon = <BlockIcon />;
      color = styles.red;
    }

    if (!icon) {
      return undefined;
    }
    return (
      <div className={styles.icon}>
        <ListItemAvatar>
          <Avatar className={[styles.avatar, color].join(" ")}>{icon}</Avatar>
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

  return (
    <div
      data-cy="chat-thread"
      className={clsx({
        [styles.bodyRoot]: true,
        [styles.bodyDefaultNoMedia]:
          (props.lessonFormat || LessonFormat.DEFAULT) ==
            LessonFormat.DEFAULT && !props.hasMedia,
        [styles.bodyDefaultMedia]:
          (props.lessonFormat || LessonFormat.DEFAULT) ==
            LessonFormat.DEFAULT && props.hasMedia,
        [styles.bodySurveySaysNoMedia]:
          (props.lessonFormat || LessonFormat.DEFAULT) ==
            LessonFormat.SURVEY_SAYS && !props.hasMedia,
        [styles.bodySurveySaysMedia]:
          (props.lessonFormat || LessonFormat.DEFAULT) ==
            LessonFormat.SURVEY_SAYS && props.hasMedia,
      })}
    >
      <List data-cy="thread" id="thread" disablePadding={true}>
        {props.messages.map((message, i) => {
          return (
            <ListItem
              data-cy={`chat-msg-${i}`}
              key={`chat-msg-${i}`}
              disableGutters={false}
              className={message.senderId}
              classes={{
                root: styles.root,
              }}
              style={{ paddingRight: chatIcon(message.type) ? 24 : 16 }}
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
