import { makeStyles } from "@material-ui/core/styles";

export const targetIconStyles = makeStyles((theme) => ({
  button: {
    position: "relative",
    minWidth: 26,
    minHeight: 26,
    maxWidth: 26,
    maxHeight: 26,
    borderRadius: 50,
  },
  centerIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  circleProgress: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  default: {
    color: theme.palette.primary.main,
  },
  completeSatisfied: {
    color: "#3CB371",
  },
  completeUnsatisfied: {
    color: "grey",
  },
  pulse: {},
}));
