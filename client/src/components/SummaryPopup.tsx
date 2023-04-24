/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from "react";
import { useTheme, styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { SummaryIndicator } from "components/TargetIndicator";
import { Target } from "types";
import { useMediaQuery } from "@mui/material";

const DialogContent = styled(MuiDialogContent)(({ theme }) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const DialogActions = styled(MuiDialogActions)(({ theme }) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}));

export default function SummaryPopup(props: {
  open: boolean;
  onCloseRequested: () => void;
  message: string;
  buttonText: string;
  targets: Target[];
}): JSX.Element {
  const { open, onCloseRequested, buttonText, targets } = props;
  const [tranState, setTranState] = useState("summary-popup-trans-none");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      data-cy="summary-popup"
      onClose={onCloseRequested}
      TransitionProps={{
        onEntered: () => setTranState("summary-popup-trans-done"),
      }}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullScreen={fullScreen}
    >
      <div data-cy={tranState} />

      <MuiDialogTitle
        id="customized-dialog-title"
        data-cy="customized-dialog-title"
      >
        <Typography variant="h6">Lesson Summary</Typography>
        {onCloseRequested ? (
          <IconButton
            aria-label="close"
            style={{
              position: "absolute",
              right: 20,
              top: 20,
              color: "gray",
            }}
            onClick={onCloseRequested}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>

      <DialogContent dividers>
        <SummaryIndicator targets={targets} />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCloseRequested}
          color="primary"
          variant="contained"
          // style={{ marginRight: 10, marginBottom: 5, marginTop: 5 }}
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
