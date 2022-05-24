import { makeStyles } from "@material-ui/core/styles";
export const chatFormStyle = makeStyles(() => ({
  chatboxRoot: {
    width: "90%",
    maxWidth: 400,
    marginLeft: "auto",
    marginRight: "auto",
    position: "relative",
  },
  button: {
    // transition: 'color .01s',
  },
  innerOverlayBottomRight: {
    position: "absolute",
    zIndex: 1,
    bottom: 7,
    right: 7,
  },
}));
