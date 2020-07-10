import React, { useState, useEffect } from 'react'
import ChatThread from '../components/ChatThread';
import ChatForm from '../components/ChatForm';
import { MuiThemeProvider, createMuiTheme, makeStyles } from "@material-ui/core/styles";
import "styles/layout.css";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#1b6a9c",
        },
    },
});

const useStyles = makeStyles((theme) => ({
    foreground: {
        backgroundColor: theme.palette.background.default,
        width: "90%",
        maxWidth: 800,
        height: "85%",
        minHeight: 750,
        position: "absolute",
        left: "50%",
        transform: "translate(-50%, 0%)",
        marginTop: 15,
        marginBottom: 15
    },
    image: {
        marginTop: 15,
        marginBottom: 10,
        width: "90%",
        maxWidth: 400,
        aspectRatio: "2/1",
        height: undefined,
    },
}));

export default function App() {
    const styles = useStyles();

    const DUMMY_DATA = [
        {
            timeSent:"23io2i3o12i3op",
            senderId: "system",
            text: "Hiya! What would you like to do?"
        },
        {
            timeSent:"jdkf934ui32434",
            senderId: "user",
            text: "Let's learn about circuits!"
        }
    ]

    const [messages, setMessages] = useState(DUMMY_DATA);

    return (
        <div className={styles.foreground}>
            <img src="https://images.theconversation.com/files/193721/original/file-20171108-6766-udash5.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip" className={styles.image}></img>
            <ChatThread messages={messages} />
            <ChatForm messages={messages} setMessages={setMessages}/>
        </div>
    )
}