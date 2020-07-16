import React, { useEffect } from "react";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import "../styles/chat.css";
import { animateScroll } from "react-scroll";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  body: {
    width: "90%",
    maxWidth: 400,
    height: "calc(100% - 265px)",
    marginLeft: "50%",
    marginBottom: 8,
    transform: "translateX(-50%)",
  },
}));

export default function ChatThread(props: {
  messages: { senderId: string; text: string }[];
}) {
  console.log("Printing Messages");
  console.log(props.messages);
  const styles = useStyles();

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
      <ul id="thread">
        {props.messages.map((message, i) => {
          return (
            <li
              id={`chat-msg-${i}`}
              key={`chat-msg-${i}`}
              className={message.senderId}
            >
              {message.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
