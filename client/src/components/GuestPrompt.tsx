/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from "react";
import { Modal, Button, Paper, InputBase, Backdrop } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  inputField: {
    flex: 1,
    paddingLeft: "8px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "5px",
    borderColor: "rgba(0, 0, 0, 0.20)",
  },
  button: {
    margin: 10,
  },
}));

interface GuestPromptArgs {
  submit: (name: string) => void;
}
export default function GuestPrompt(args: GuestPromptArgs): JSX.Element {
  const classes = useStyles();
  const [name, setName] = useState("");
  const { submit } = args;

  function onInput(name: string) {
    const polished = name ? name.trim() : "";
    setName(polished);
    if (name.includes("\n")) {
      submit(polished);
    }
  }

  return (
    <div id="guest-prompt">
      <Modal
        open={true}
        onClose={() => submit(name)}
        className={classes.modal}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Paper className={classes.paper}>
          <h2 id="guest-prompt-header">Enter a guest name:</h2>
          <InputBase
            id="guest-prompt-input"
            multiline={true}
            className={classes.inputField}
            value={name}
            placeholder={"guest"}
            onChange={(e) => {
              onInput(e.target.value);
            }}
          />
          <Button
            id="guest-prompt-input-send"
            className={classes.button}
            onClick={() => submit(name)}
            variant="contained"
            color="primary"
          >
            Okay
          </Button>
        </Paper>
      </Modal>
    </div>
  );
}
