/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from "react";
import {
  createStyles,
  Theme,
  useTheme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { SummaryIndicator } from "components/TargetIndicator";
import { Target } from "types";
import { useMediaQuery } from "@material-ui/core";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            color: "gray",
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function SummaryPopup(props: {
  open: boolean;
  onCloseRequested: () => void;
  message: string;
  buttonText: string;
  targets: Target[];
}): JSX.Element {
  const { open, onCloseRequested, message, buttonText, targets } = props;
  const [tranState, setTranState] = useState("summary-popup-trans-none");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Dialog
      data-cy="summary-popup"
      onClose={onCloseRequested}
      onEntered={() => setTranState("summary-popup-trans-done")}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullScreen={fullScreen}
    >
      <div data-cy={tranState} />
      <DialogTitle
        id="customized-dialog-title"
        data-cy="customized-dialog-title"
        onClose={onCloseRequested}
      >
        Lesson Summary
      </DialogTitle>
      <DialogContent dividers style={{minHeight: 30, maxHeight: 30}}>
        <Typography gutterBottom>{message}</Typography>
      </DialogContent>
      <SummaryIndicator targets={targets} />
      <DialogActions>
        <Button onClick={onCloseRequested} color="primary" variant="contained" style={{marginRight: 30, marginBottom: 10}}>
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
