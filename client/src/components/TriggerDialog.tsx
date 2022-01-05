/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

export default function TriggerDialog(props: {
  showTriggerWarning: boolean;
  setShowTriggerWarning: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRedirect: string;
}): JSX.Element {
  const { showTriggerWarning, setShowTriggerWarning, triggerRedirect } = props;

  function dismissTriggerWarning() {
    setShowTriggerWarning(false);
  }

  return (
    <Dialog
      open={showTriggerWarning}
      fullScreen
      onClose={dismissTriggerWarning}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      data-cy="trigger-dialog"
    >
      <DialogTitle id="alert-dialog-title">{"Trigger Warning"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`The following lesson contains material which may considered disturbing...`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          data-cy="trigger-exit-button"
          href={triggerRedirect}
        >
          Exit
        </Button>
        <Button
          onClick={dismissTriggerWarning}
          color="primary"
          variant="contained"
          data-cy="trigger-dismiss-button"
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
