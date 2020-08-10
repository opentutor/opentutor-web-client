import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function ErrorPopup(props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  errorProps: {
    title: string;
    message: string;
    buttonText: string;
  };
}) {
  const handleErrorClose = () => {
    props.setOpen(false);
  };

  return (
    <div>
      <Dialog
        id="error-popup"
        open={props.open}
        onClose={handleErrorClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.errorProps.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
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
