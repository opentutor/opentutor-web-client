/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useRef } from "react";
import ReactPlayer from "react-player/youtube";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import ReplayIcon from "@material-ui/icons/Replay";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { fetchLesson } from "api";
import { Lesson, Video } from "types";
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

const LessonMedia = (props: { search: { lesson: string } }): JSX.Element => {
  const styles = useStyles();
  const { lesson } = props.search;
  const [image, setImage] = React.useState<string>();
  const [video, setVideo] = React.useState<Video>();
  const [imgDims, setImgDims] = React.useState({ width: 0, height: 0 });
  const [isImgExpanded, setImgExpanded] = React.useState(false);
  const [isVideoOver, setIsVideoOver] = React.useState(false);

  const handleImageExpand = (): void => {
    setImgExpanded(!isImgExpanded);
  };

  const getImage = (): JSX.Element => {
    return isImgExpanded ? (
      <img
        src={image}
        className={styles.image}
        style={{
          width: imgDims.height > imgDims.width ? 400 : "",
        }}
      ></img>
    ) : (
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
    return isImgExpanded ? (
      <ZoomOutIcon className={styles.zoom} />
    ) : (
      <ZoomInIcon className={styles.zoom} />
    );
  };

  React.useEffect(() => {
    fetchLesson(lesson)
      .then((lesson: Lesson) => {
        if (lesson) {
          setImage(lesson.image);
          setVideo(lesson.video);
          const img = new Image();
          img.addEventListener("load", function () {
            setImgDims({
              width: this.naturalWidth,
              height: this.naturalHeight,
            });
          });
          img.src = lesson.image;
        }
      })
      .catch((err: string) => console.error(err));
  }, [lesson]);

  const videoPlayer:any = useRef(null);

  if (image) {
    return (
      <div
        data-cy="image"
        className={styles.scroll}
        onClick={handleImageExpand}
      >
        {getImage()}
        {getZoom()}
      </div>
    );
  } else if (video) {
    // } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#000000",
        }}
      >
        <div style={{ position: "relative" }}>
          <ReactPlayer
            ref={videoPlayer}
            playing={!isVideoOver}
            data-cy="video"
            // url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
            url={video.link}
            // controls={true}
            config={{
              playerVars: {
                modestbranding: 1,
                start: video.start,
                end: video.end,
                disablekb: 1,
                // autoplay: 1
              },
            }}
            onProgress={(player) => {
              console.log(player);
              if(player.playedSeconds > video.end) {
                setIsVideoOver(true)
              }
            }}
          />
          {isVideoOver ? (
            <div
              style={{
                position: "absolute",
                backgroundColor: "#000000",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
              }}
            >
              <div style={{ position: "relative", height: "100%" }}>
                <IconButton
                  data-cy="replay-button"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={()=>{
                    setIsVideoOver(false)
                    console.log(videoPlayer)
                    videoPlayer.current.seekTo(video.start, 'seconds')
                  }}
                >
                  <ReplayIcon style={{ color: "white", fontSize: 40 }} />
                  <Typography style={{ color: "white"}} >Replay</Typography>
                </IconButton>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default withLocation(LessonMedia);
