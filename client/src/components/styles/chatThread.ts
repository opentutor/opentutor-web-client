import { makeStyles } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core";

function calcBoardHeight(expectationCount: number) {
  // 46px per target, 31px for question, 16*2px padding, 5*2 border, 10*2px padding
  return expectationCount * 46 + 31 + 32 + 10 + 20;
}

export interface ChatThreadStylesProps {
  expectationCount: number;
}

export const chatThreadStyles = makeStyles<Theme, ChatThreadStylesProps>(
  (theme) => ({
    bodySurveySaysNoMedia: (props) => ({
      height: `calc(100% - 95px - ${calcBoardHeight(
        props.expectationCount
      )}px)`,
    }),
    bodySurveySaysMedia: (props) => ({
      height: `calc(70% - 95px - ${calcBoardHeight(props.expectationCount)}px)`,
    }),
    root: {
      width: "auto",
      paddingTop: 0,
      paddingBottom: 0,
    },
    bodyRoot: {
      paddingTop: 10,
      width: "90%",
      maxWidth: 400,
      marginLeft: "50%",
      paddingBottom: 10,
      transform: "translateX(-50%)",
      boxSizing: "border-box",
    },
    bodyDefaultNoMedia: {
      height: "calc(100% - 60px - 95px)",
    },
    bodyDefaultMedia: {
      height: "calc(65% - 60px - 95px)",
    },

    avatar: {
      color: "#fff",
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    icon: {
      position: "absolute",
      right: -40,
    },
    gray: {},
    red: {
      background: "#DC143C",
    },
    green: {
      background: "#3CB371",
    },
    yellow: {
      background: "yellow",
    },
  })
);
