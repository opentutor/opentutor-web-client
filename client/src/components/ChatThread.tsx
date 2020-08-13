/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import "styles/chat.css";
import React, { useEffect } from "react";
import { animateScroll } from "react-scroll";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HelpIcon from "@material-ui/icons/Help";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import BlockIcon from "@material-ui/icons/Block";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import { ChatMsg } from "./types";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "auto",
    paddingTop: 0,
    paddingBottom: 0,
  },
  body: {
    width: "90%",
    maxWidth: 400,
    height: "calc(100% - 295px)",
    marginLeft: "50%",
    marginBottom: 25,
    transform: "translateX(-50%)",
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

export default function ChatThread(props: { messages: ChatMsg[] }) {
  const styles = useStyles();

  const chatIcon = (type: string) => {
    let icon = undefined;
    let color = styles.gray;

    if (type === "mainQuestion" || type === "hint") {
      icon = <HelpIcon />;
    } else if (type === "feedbackPositive") {
      icon = <CheckCircleIcon />;
      color = styles.green;
    } else if (type === "feedbackNegative") {
      icon = <CancelIcon />;
      color = styles.red;
    } else if (type === "feedbackNeutral") {
      icon = <ImportExportIcon />;
      color = styles.yellow;
    } else if (type === "encouragement") {
      icon = <FlashOnIcon />;
      color = styles.green;
    } else if (type === "profanity") {
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
    document.title = `New Msg: ${
      props.messages[props.messages.length - 1].text
    }`;
    animateScroll.scrollToBottom({
      containerId: "thread",
    });
  });

  return (
    <div className={styles.body}>
      <List id="thread" disablePadding={true}>
        {props.messages.map((message, i) => {
          return (
            <ListItem
              id={`chat-msg-${i}`}
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
