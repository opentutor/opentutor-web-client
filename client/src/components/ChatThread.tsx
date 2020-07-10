import React, {useEffect} from "react";
import { MuiThemeProvider, createMuiTheme, makeStyles } from "@material-ui/core/styles";
import '../styles/chat.css';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#1b6a9c",
        },
    },
});

const useStyles = makeStyles((theme) => ({
    body: {
        //backgroundColor: "#808080",
        width: "90%",
        maxWidth: 400,
        height: "40%",
        marginLeft: "50%",
        marginBottom: 8,
        transform: "translateX(-50%)",
    },
}));

export default function ChatThread(props: { messages: { timeSent: string, senderId: string, text: string }[] }) {
    console.log("Printing Messages");
    console.log(props.messages);
    const styles = useStyles();

    useEffect(() => {
        document.title = `New Msg: ${props.messages[props.messages.length-1].text}`;
    });

    return (
        <div className={styles.body}>
            <ul>
                {props.messages.map(message => {
                    return (
                        <li key={message.timeSent} className={message.senderId}>
                            {message.text}
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}