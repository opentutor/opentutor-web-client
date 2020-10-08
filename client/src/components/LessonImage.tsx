/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import { makeStyles } from "@material-ui/core/styles";
import { fetchLesson } from "api";
import { Lesson } from "types";
import withLocation from "wrap-with-location";

const useStyles = makeStyles((theme) => ({
  scroll: {
    backgroundColor: theme.palette.primary.dark,
    position: "relative",
    top: 0,
    left: 0,
    width: "100%",
    height: "35%",
    overflow: "auto",
    whiteSpace: "nowrap",
  },
  image: {
    position: "relative",
    top: 0,
    left: 0,
    minWidth: 400,
  },
  zoom: {
    position: "sticky",
    right: 0,
    bottom: 0,
    height: 50,
    width: 50,
    color: "white",
  },
}));

const LessonImage = (props: { search: { lesson: string } }): JSX.Element => {
  const styles = useStyles();
  const { lesson } = props.search;
  const [image, setImage] = React.useState<string>();
  const [imgWidth, setImgWidth] = React.useState(0);
  const [imgHeight, setImgHeight] = React.useState(0);
  const [isImgExpanded, setImgExpanded] = React.useState(false);

  const handleImageExpand = (): void => {
    setImgExpanded(!isImgExpanded);
  };

  const getImage = (): JSX.Element => {
    if (isImgExpanded) {
      return (
        <img
          src={image}
          className={styles.image}
          style={{
            width: imgHeight > imgWidth ? 400 : "",
          }}
        ></img>
      );
    }
    return (
      <img
        src={image}
        style={{
          objectFit: "contain",
          height: "100%",
          width: "100%",
        }}
      ></img>
    );
  };

  const getZoom = (): JSX.Element => {
    if (isImgExpanded) {
      return <ZoomOutIcon className={styles.zoom} />;
    }
    return <ZoomInIcon className={styles.zoom} />;
  };

  React.useEffect(() => {
    fetchLesson(lesson)
      .then((lesson: Lesson) => {
        if (lesson) {
          setImage(lesson.image);
          const img = new Image();
          img.addEventListener("load", function () {
            setImgHeight(this.naturalHeight);
            setImgWidth(this.naturalWidth);
          });
          img.src = lesson.image;
        }
      })
      .catch((err: string) => console.error(err));
  }, [lesson]);

  if (!image) {
    return <div></div>;
  }

  return (
    <div id="image" className={styles.scroll} onClick={handleImageExpand}>
      {getImage()}
      {getZoom()}
    </div>
  );
};

export default withLocation(LessonImage);
