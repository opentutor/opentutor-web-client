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
import { Lesson, Media, MediaType, Target } from "types";
import withLocation from "wrap-with-location";

const useStyles = makeStyles((theme) => ({
  scroll: {
    backgroundColor: theme.palette.primary.dark,
    position: "relative",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
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
    background: theme.palette.primary.main,
    color: "white",
    padding: 10,
    height: 10,
    width: "calc(100% - 20px)",
    position: "relative",
    borderColor: "orange",
    borderWidth: 2,
    borderStyle: "solid",
  },
  survey: {
    padding: theme.spacing(2),
    maxWidth: 500,
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const LessonMedia = (props: {
  search: { lesson: string };
  surveySays: boolean;
  targets: Target[];
}): JSX.Element => {
  const styles = useStyles();
  const { lesson } = props.search;
  const { surveySays, targets } = props;
  const [media, setMedia] = React.useState<Media | undefined>(undefined);
  const [imgDims, setImgDims] = React.useState({ width: 0, height: 0 });
  const [isImgExpanded, setImgExpanded] = React.useState(false);
  const [isVideoOver, setIsVideoOver] = React.useState(false);

  const handleImageExpand = (): void => {
    setImgExpanded(!isImgExpanded);
  };

  interface Prop {
    name: string;
    value: string;
  }

  function getProp(props: Array<Prop>, key: string): string {
    return props.find((p) => p.name === key)?.value || "";
  }

  const getImage = (): JSX.Element => {
    return isImgExpanded ? (
      <img
        src={media ? media.url : ""}
        className={styles.image}
        style={{
          width: imgDims.height > imgDims.width ? 400 : "",
        }}
      ></img>
    ) : (
      <img
        src={media ? media.url : ""}
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
          setMedia(lesson.media);
          if (lesson.media && lesson.media.type === MediaType.IMAGE) {
            const img = new Image();
            img.addEventListener("load", function () {
              setImgDims({
                width: this.naturalWidth,
                height: this.naturalHeight,
              });
            });
            img.src = lesson.media.url;
          }
        }
      })
      .catch((err: string) => console.error(err));
  }, [lesson]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const videoPlayer: any = useRef(null);

  if (media && media.type === MediaType.IMAGE) {
    console.log("Is Image");
    return (
      <>
        <div style={{ height: "35%" }}>
          <div
            data-cy="image"
            className={styles.scroll}
            style={surveySays ? { height: "50%" } : {}}
            onClick={handleImageExpand}
          >
            {getImage()}
            {getZoom()}
          </div>
          {surveySays ? (
            <div className={styles.survey}>
              <Grid container spacing={2}>
                {targets.map((target, idx) => {
                  return (
                    <Grid container item spacing={2} key={idx}>
                      <Grid item xs={12}>
                        <div className={styles.censored}>
                          <Typography
                            className={styles.centerLock}
                            variant={!target.achieved ? "h6" : "caption"}
                            style={{ width: "100%" }}
                          >
                            {target.achieved ? target.text : idx + 1}
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          ) : (
            <></>
          )}
        </div>
      </>
    );
  } else if (media && media.type === MediaType.VIDEO) {
    const videoHeight = surveySays ? "50%" : "100%";
    return (
      <div style={{ height: "35%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#000000",
            height: videoHeight,
          }}
        >
          <div style={{ position: "relative" }}>
            <ReactPlayer
              ref={videoPlayer}
              playing={!isVideoOver}
              data-cy="video"
              height="100%"
              url={media.url || "https://www.youtube.com/watch?v=KcMlPl9jArM"}
              config={{
                playerVars: {
                  modestbranding: 1,
                  start: media.props
                    ? parseFloat(getProp(media.props, "start")) || 0
                    : 0,
                  end: media.props
                    ? parseFloat(getProp(media.props, "end")) ||
                      videoPlayer.current.getDuration()
                    : videoPlayer.current.getDuration(),
                  disablekb: 1,
                },
              }}
              onProgress={(player) => {
                console.log(player);
                if (
                  player.playedSeconds >
                  (media.props
                    ? parseFloat(getProp(media.props, "end")) ||
                      videoPlayer.current.getDuration()
                    : videoPlayer.current.getDuration())
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
                      videoPlayer.current.seekTo(
                        media.props
                          ? parseFloat(getProp(media.props, "start")) || 0
                          : 0,
                        "seconds"
                      );
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
        {surveySays ? (
          <div className={styles.survey}>
            <Grid container spacing={2}>
              {targets.map((target, idx) => {
                return (
                  <Grid container item spacing={2} key={idx}>
                    <Grid item xs={12}>
                      <div className={styles.censored}>
                        <Typography
                          className={styles.centerLock}
                          variant={!target.achieved ? "h6" : "caption"}
                          style={{ width: "100%" }}
                        >
                          {target.achieved ? target.text : idx + 1}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  } else {
    return (
      <>
        {surveySays ? (
          <div style={{ height: "35%" }}>
            <div className={styles.survey}>
              <Grid container spacing={2}>
                {targets.map((target, idx) => {
                  return (
                    <Grid container item spacing={2} key={idx}>
                      <Grid item xs={12}>
                        <div className={styles.censored}>
                          <Typography
                            className={styles.centerLock}
                            variant={!target.achieved ? "h6" : "caption"}
                            style={{ width: "100%" }}
                          >
                            {target.achieved ? target.text : idx + 1}
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
};

export default withLocation(LessonMedia);
