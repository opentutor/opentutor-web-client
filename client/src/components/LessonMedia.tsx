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
import { Grid, IconButton } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { fetchLesson } from "api";
import { Lesson, Video, MediaType } from "types";
import withLocation from "wrap-with-location";
import LockIcon from "@material-ui/icons/Lock";

const useStyles = makeStyles((theme) => ({
  scroll: {
    backgroundColor: theme.palette.primary.dark,
    position: "relative",
    top: 0,
    left: 0,
    width: "100%",
    height: "50%",
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
  centerLock: {
    position: "absolute",
    top: "50%",
    left: "calc(50% + 0px)",
    transform: "translate(-50%, -50%)",
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
    // background: theme.palette.primary.light,
    // background: "#0084ff",
    color: "black",
    padding: 10,
    height: 10,
    width: "calc(100% - 20px)",
    position: "relative",
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
    borderStyle: "solid"
  },
  survey: {
    padding: theme.spacing(2),
    maxWidth: 500,
    marginLeft: "auto",
    marginRight: "auto",
  }
}));

const LessonMedia = (props: { search: { lesson: string } }): JSX.Element => {
  const styles = useStyles();
  const { lesson } = props.search;
  const [image, setImage] = React.useState<string>();
  const [video, setVideo] = React.useState<Video>();
  const [mediaType, setMediaType] = React.useState<string>(MediaType.NONE);
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
          setMediaType(lesson.mediaType);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const videoPlayer: any = useRef(null);

  if (mediaType === MediaType.IMAGE) {
    return (
      <div style={{height:"35%"}}>
        <div
          data-cy="image"
          className={styles.scroll}
          onClick={handleImageExpand}
        >
          {getImage()}
          {getZoom()}
        </div>
        <div className={styles.survey}>
          <Grid container spacing={2} >
            <Grid container item spacing={2} >
              <Grid item xs={12} >
                <div className={styles.censored}>
                  {/* <LockIcon
                    className={styles.centerLock}
                  /> */}
                  <Typography className={styles.centerLock} variant="h6">
                    1
                  </Typography>
                </div>
              </Grid>
            </Grid>

            <Grid container item spacing={2} >
              <Grid item xs={12} >
                <div className={styles.censored}>
                  <Typography className={styles.centerLock} variant="body1" style={{width:"100%"}}>
                    Sailors should be well-rounded team-players
                  </Typography>
                </div>
              </Grid>
            </Grid>

            <Grid container item spacing={2} >
              <Grid item xs={12}>
                <div className={styles.censored}>
                  <Typography className={styles.centerLock} variant="h6">
                    3
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  } else if (mediaType === MediaType.VIDEO) {
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
            url={video?.link ?? "https://www.youtube.com/watch?v=KcMlPl9jArM"}
            config={{
              playerVars: {
                modestbranding: 1,
                start: video?.start ?? 0,
                end: video?.end ?? videoPlayer.current.getDuration(),
                disablekb: 1,
              },
            }}
            onProgress={(player) => {
              console.log(player);
              if (
                player.playedSeconds >
                (video?.end ?? videoPlayer.current.getDuration())
              ) {
                setIsVideoOver(true);
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
                  onClick={() => {
                    setIsVideoOver(false);
                    console.log(videoPlayer);
                    videoPlayer.current.seekTo(video?.start ?? 0, "seconds");
                  }}
                >
                  <ReplayIcon style={{ color: "white", fontSize: 40 }} />
                  <Typography style={{ color: "white" }}>Replay</Typography>
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
