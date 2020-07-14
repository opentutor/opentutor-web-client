import React, { useState, useEffect } from 'react'
import ChatThread from '../components/ChatThread';
import ChatForm from '../components/ChatForm';
import TargetIndicator from '../components/TargetIndicator';
import SummaryPopup from '../components/SummaryPopup';
import { MuiThemeProvider, createMuiTheme, makeStyles } from "@material-ui/core/styles";
import "styles/layout.css";
import { Button } from '@material-ui/core';

import axios from 'axios'

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
        width: "90%",
        maxWidth: 400,
        aspectRatio: "2/1",
        height: undefined,
    }
}));

export default function App() {
    const styles = useStyles();
    const [open, setOpen] = React.useState(false);


    const handleSummaryOpen = () => {
        setOpen(true);
    };

    const DUMMY_DATA = [
        {
            timeSent: "23io2i3o12i3op",
            senderId: "user",
            text: "Welcome to OpenTutor!"
        }
    ]

    const [messages, setMessages] = useState(DUMMY_DATA);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.post(
                'http://dev-opentutor.pal3.org/dialog/q1',{}
            );

            let newMessages = messages.slice();
            
            //Add Messages
            console.log(response.data.response);
            response.data.response.forEach((msg:any) => {
                newMessages.push({ timeSent: msg.type, senderId: "system", text: msg.data.text });
            });

            setMessages(newMessages);
        };
        fetchData();
    }, []);//Watches for vars in array to make updates. If none only updates on comp. mount




    return (
        <div className={styles.foreground}>

            <img src="https://images.theconversation.com/files/193721/original/file-20171108-6766-udash5.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip" className={styles.image}></img>
            <br />
            <TargetIndicator count={0} />
            <ChatThread messages={messages} />
            <ChatForm messages={messages} setMessages={setMessages} />
            <SummaryPopup open={open} setOpen={setOpen} message={"That's a wrap! Let's see how you did on this lesson!"} buttonText={"OK"} targetCount={0} />
            <Button onClick={handleSummaryOpen}>Quit</Button>
        </div>
    )
}