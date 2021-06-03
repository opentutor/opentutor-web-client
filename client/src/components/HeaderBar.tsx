/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import "styles/layout.css";
import React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import withLocation from "wrap-with-location";
import { fetchLesson } from "api";
import { Lesson } from "types";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
}));

const HeaderBar = (props: {
  search: { admin: string; lesson: string };
}): JSX.Element => {
  const styles = useStyles();
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

  if (!props.search.admin) {
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <Typography data-cy="title" variant="h6">
              {lessonName}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={styles.toolbar} /> {/* create space below app bar */}
      </div>
    );
  }

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
          <Typography data-cy="title" variant="h6">
            Preview {lessonName}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={styles.toolbar} /> {/* create space below app bar */}
    </div>
  );
};

export default withLocation(HeaderBar);
