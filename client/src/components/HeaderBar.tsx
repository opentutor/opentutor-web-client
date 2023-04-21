/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import "styles/layout.css";
import React from "react";
import { AppBar, IconButton, Theme, Toolbar, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "tss-react/mui";
import withLocation from "wrap-with-location";
import { fetchLesson } from "api";
import { Lesson } from "types";

const HeaderBar = (props: {
  search: { admin: string; lesson: string };
  superDense: boolean;
}): JSX.Element => {
  const { classes: styles } = useStyles();
  const [lessonName, setLessonName] = React.useState("");

  const onClose = (): void => {
    window.history.back();
  };

  React.useEffect(() => {
    fetchLesson(props.search.lesson)
      .then((lesson: Lesson) => {
        if (lesson) {
          setLessonName(lesson.name);
        }
      })
      .catch((err: string) => console.error(err));
  }, []);

  if (props.superDense) {
    return (
      <div className={styles.superDenseAppBar}>
        <Typography
          data-cy="lesson-name"
          id="lesson-name-header"
          variant="body1"
          style={{ paddingLeft: 10 }}
        >
          {lessonName}
        </Typography>
      </div>
    );
  } else if (!props.search.admin) {
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <Typography data-cy="lesson-name" variant="h6">
              {lessonName}
            </Typography>
          </Toolbar>
        </AppBar>
        <div /> {/* create space below app bar */}
      </div>
    );
  } else {
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              data-cy="back-button"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
            <Typography data-cy="lesson-name" variant="h6">
              Preview {lessonName}
            </Typography>
          </Toolbar>
        </AppBar>
        <div /> {/* create space below app bar */}
      </div>
    );
  }
};

const useStyles = makeStyles({ name: { HeaderBar } })((theme: Theme) => ({
  superDenseAppBar: {
    display: "flex",
    alignItems: "center",
    height: 30,
    width: "100%",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    boxShadow:
      "0 2px 4px -1px rgb(0 0 0 / 20%), 0 4px 5px 0 rgb(0 0 0 / 14%), 0 1px 10px 0 rgb(0 0 0 / 12%)",
    boxSizing: "border-box",
    zIndex: 1100,
  },
}));

export default withLocation(HeaderBar);
