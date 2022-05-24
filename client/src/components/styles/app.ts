import { makeStyles } from "@material-ui/core/styles";

export const appStyles = makeStyles((theme) => ({
  foreground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  appRoot: {
    width: "100%",
    boxSizing: "border-box",
  },
  appRootDefault: {
    height: "calc(100% - 64px)",
  },
  appRootSuperDenseHeader: {
    height: "calc(100% - 30px)",
  },
  appRootNoHeader: {
    height: "calc(100% - 0px)",
  },
  buildInfo: {
    padding: 5,
    color: "white",
    fontWeight: "bold",
    fontSize: "70%",
    backgroundColor: theme.palette.primary.main,
    textAlign: "left",
  },
}));
