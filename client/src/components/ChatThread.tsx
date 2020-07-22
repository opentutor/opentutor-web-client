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
import "styles/chat.css";

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
  icon: {
    position: "absolute",
    zIndex: 1000,
    right: -35,
  },
  avatar: {
    color: "#fff",
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));

export default function ChatThread(props: {
  messages: { senderId: string; type: string; text: string }[];
}) {
  console.log("Printing Messages");
  console.log(props.messages);
  const styles = useStyles();

  const chatIcon = (type: string) => {
    let icon = undefined;
    if (type === "mainQuestion" || type === "hint") {
      icon = <HelpIcon />;
    } else if (type === "feedbackPositive") {
      icon = <CheckCircleIcon />;
    } else if (type === "feedbackNegative") {
      icon = <CancelIcon />;
    } else if (type === "feedbackNeutral") {
      icon = <ImportExportIcon />;
    }

    if (!icon) {
      return undefined;
    }
    return (
      <div className={styles.icon}>
        <ListItemAvatar>
          <Avatar className={styles.avatar}>{icon}</Avatar>
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
