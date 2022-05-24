import { makeStyles } from "@material-ui/core/styles";

export const targetIndicatorStyles = makeStyles((theme) => ({
  placeholder: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 22,
    color: theme.palette.background.default,
  },
  released: {
    marginTop: "-30",
    transform: "translate(0%, -60%)",
    padding: 10,
    height: 10,
    width: "140%",
  },
  censored: {
    borderRadius: 10,
    background: "#929fad",
    padding: 10,
    height: 10,
    width: "150%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  targetGrid: { width: "100%", padding: 10, boxSizing: "border-box" },
  targetItem: {
    width: "100%",
    display: "flex",
    padding: 5,
    boxSizing: "border-box",
    alignItems: "center",
  },
  inProgress: {
    color: "#DC143C",
  },
  complete: {
    color: "#3CB371",
  },
}));
