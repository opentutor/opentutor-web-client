import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export function TextTruncationPopop(props: {
  willTruncate: boolean;
  onYes: () => void;
  onNo: () => void;
}) {
  const { willTruncate, onYes, onNo } = props;

  return (
    <Dialog data-cy="text-truncation-popup" open={willTruncate}>
      <DialogTitle id="truncation-dialog-title">
        {"Warning: Message Truncation"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="truncation-dialog-description">
          Your message will be truncated to 300 characters. Are you sure you
          want to submit this message?
        </DialogContentText>
      </DialogContent>
      <DialogActions
        style={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Button
          onClick={onNo}
          color="primary"
          data-cy="text-truncation-popup-no"
        >
          No
        </Button>
        <Button
          onClick={onYes}
          color="primary"
          autoFocus
          data-cy="text-truncation-popup-yes"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TextTruncationPopop;
