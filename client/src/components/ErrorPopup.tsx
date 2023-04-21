/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ErrorData } from "types";

export default function ErrorPopup(props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  errorProps: ErrorData;
}): JSX.Element {
  const handleErrorClose = (): void => {
    props.setOpen(false);
  };

  return (
    <div>
      <Dialog
        data-cy="error-popup"
        open={props.open}
        onClose={handleErrorClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle data-cy="alert-dialog-title">
          {props.errorProps.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText data-cy="alert-dialog-description">
            {props.errorProps.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorClose}
            color="primary"
            variant="contained"
          >
            {props.errorProps.buttonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
