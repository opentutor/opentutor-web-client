import { makeStyles } from "@material-ui/core/styles";

export const appStylesDesktop = makeStyles((theme) => ({
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
  middleAppContent: {
    display: "flex",
    width: "100%",
    height: "calc(100% - 115px)",
  },

  noHeader_middleAppContent: {
    display: "flex",
    width: "100%",
    height: "calc(100% - 70px)",
  },
  videoContainer: {
    width: "60%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  chatThreadInputFormContainer: {
    position: "relative",
    width: "40%",
    height: "100%",
  },
}));

export const appStylesMobile = makeStyles((theme) => ({
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
