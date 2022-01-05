import React from "react";
import { makeStyles } from "@material-ui/core/styles";
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
}) {
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
