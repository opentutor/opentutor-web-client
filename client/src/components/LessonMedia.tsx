/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useRef } from "react";
import ReactPlayer from "react-player/youtube";
import clsx from "clsx";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ReplayIcon from "@material-ui/icons/Replay";
import { IconButton } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { fetchLesson } from "api";
import { Lesson, LessonFormat, Media, MediaType } from "types";
import withLocation from "wrap-with-location";
import ImageDialog from "./ImageDialog";
import {
  lessonMediaStylesDesktop,
  lessonMediaStylesMobile,
} from "./styles/lessonMedia";
import { shouldDisplayPortrait } from "utils";
import useMediaQuery from "@mui/material/useMediaQuery";

const LessonMedia = (props: {
  search: { lesson: string };
  lessonFormat: string;
}): JSX.Element => {
  const stylesDesktop = lessonMediaStylesDesktop();
  const stylesMobile = lessonMediaStylesMobile();
  const { lesson } = props.search;
  const [media, setMedia] = React.useState<Media | undefined>(undefined);
  const [isVideoOver, setIsVideoOver] = React.useState(false);
  const [fullscreenImage, setFullscreenImage] = React.useState(false);

  const matchesMobile = useMediaQuery("(max-width : 600px)", {
    noSsr: true,
  });

  const handleImageExpand = (): void => {
    setFullscreenImage(true);
  };

  interface Prop {
    name: string;
    value: string;
  }

  function getProp(props: Array<Prop>, key: string): string {
    return props.find((p) => p.name === key)?.value || "";
  }

  React.useEffect(() => {
    fetchLesson(lesson)
      .then((lesson: Lesson) => {
        if (lesson) {
          setMedia(lesson.media);
          if (lesson.media && lesson.media.type === MediaType.IMAGE) {
            const img = new Image();
            img.src = lesson.media.url;
          }
        }
      })
      .catch((err: string) => console.error(err));
  }, [lesson]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const videoPlayer: any = useRef(null);

  if (media && media.type === MediaType.IMAGE) {
    return (
      <>
        <div
          className={clsx({
            [stylesDesktop.mediaRoot]: true,
            [stylesMobile.mediaDefaultMobile]:
              (shouldDisplayPortrait() || matchesMobile) &&
              (props.lessonFormat || LessonFormat.DEFAULT) ==
                LessonFormat.DEFAULT,
            [stylesDesktop.mediaDefault]:
              !shouldDisplayPortrait() &&
              (props.lessonFormat || LessonFormat.DEFAULT) ==
                LessonFormat.DEFAULT,

            [stylesDesktop.mediaSurveySays]:
              (props.lessonFormat || LessonFormat.DEFAULT) ==
              LessonFormat.SURVEY_SAYS,
            [stylesMobile.mediaSurveySaysMobile]:
              (shouldDisplayPortrait() || matchesMobile) &&
              (props.lessonFormat || LessonFormat.DEFAULT) ==
                LessonFormat.SURVEY_SAYS,
          })}
        >
          <div
            data-cy="image"
            className={stylesDesktop.scroll}
            onClick={handleImageExpand}
          >
            <div style={{ height: "100%", width: "100%" }}>
              <img
                src={media ? media.url : ""}
                style={{
                  objectFit: "contain",
                  height: "100%",
                  width: "100%",
                }}
              />
            </div>
            <ZoomInIcon className={stylesDesktop.innerZoomOverlay} />
          </div>
        </div>
        <ImageDialog
          imageLink={media.url}
          open={fullscreenImage}
          setOpen={setFullscreenImage}
        />
      </>
    );
  } else if (media && media.type === MediaType.VIDEO) {
    const videoHeight = "100%";
    return (
      <div
        className={clsx({
          [stylesDesktop.mediaRoot]: true,
          [stylesMobile.mediaDefaultMobile]:
            (shouldDisplayPortrait() || matchesMobile) &&
            (props.lessonFormat || LessonFormat.DEFAULT) ==
              LessonFormat.DEFAULT,
          [stylesDesktop.mediaDefault]:
            (!shouldDisplayPortrait() || !matchesMobile) &&
            (props.lessonFormat || LessonFormat.DEFAULT) ==
              LessonFormat.DEFAULT,
          [stylesDesktop.mediaSurveySays]:
            (!shouldDisplayPortrait() || !matchesMobile) &&
            (props.lessonFormat || LessonFormat.DEFAULT) ==
              LessonFormat.SURVEY_SAYS,
          [stylesMobile.mediaSurveySaysMobile]:
            (shouldDisplayPortrait() || matchesMobile) &&
            (props.lessonFormat || LessonFormat.DEFAULT) ==
              LessonFormat.SURVEY_SAYS,
        })}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#000000",
            height: videoHeight,
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <ReactPlayer
              ref={videoPlayer}
              playing={!isVideoOver}
              data-cy="video"
              height="100%"
              width="100%"
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
      </div>
    );
  } else {
    return <></>;
  }
};

export default withLocation(LessonMedia);
