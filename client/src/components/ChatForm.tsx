import React, {useState} from 'react'
import { MuiThemeProvider, createMuiTheme, makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#1b6a9c",
        },
    },
});

const useStyles = makeStyles((theme) => ({
    chatbox: {
        width: "90%",
        maxWidth: 400,
    },
    button: {
        margin: theme.spacing(1),
    },
}));

export default function ChatForm(props:{messages: { timeSent: string, senderId: string, text: string }[], setMessages:any}) {
    const styles = useStyles();
    const [chat, setChat] = useState("");

    function handleClick(e:any) {
        e.preventDefault();
        console.log(`User typed: ${chat}\n`);
        let newMessages = props.messages.slice();
        newMessages.push({timeSent: "value", senderId: "user", text: chat});
        props.setMessages(newMessages);
        setChat("");
        console.log(props.messages.length);
    }
    
    return (
        <form noValidate autoComplete="off">
            <TextField
                id="outlined-multiline-static"
                label="Chat with OpenTutor"
                multiline
                rows={4}
                variant="outlined"
                className={styles.chatbox}
                value={chat}
                onChange={(e) => {setChat(e.target.value)}}
            />
            <br/>
            <Button
                variant="contained"
                color="primary"
                className={styles.button}
                endIcon={<SendIcon />}
                onClick={handleClick}
            >
                Send
            </Button>
        </form>
    )
}