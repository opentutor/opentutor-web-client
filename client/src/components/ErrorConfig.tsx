/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { ErrorData } from "./types";
export function errorForStatus(status: number): ErrorData {
  switch (status) {
    case 400:
      return {
        title: "Lesson not provided",
        message:
          "A lesson id was not provided in the url. Please contact the creator of this lesson to obtain a new link.",
        buttonText: "OK",
      };
    case 404:
      return {
        title: "Lesson not found",
        message:
          "This lesson does not exist in the OpenTutor system. Please go back and try again, or contact your teacher for help.",
        buttonText: "OK",
      };
    case 403:
      return {
        title: "Could not continue lesson!",
        message:
          "We could not validate your session. Perhaps relaod the page and try again? Leaving and coming back to a lesson may cause this error.",
        buttonText: "OK",
      };
    case 410:
      return {
        title: "Lesson session ended",
        message:
          "We're sorry, but like all good things, this tutoring session has ended. The good news is you can always take it again! Just reload this page.",
        buttonText: "OK",
      };
    default:
      //Unknown Error
      return {
        title: `Server Error (${status})`,
        message:
          "We don't know what happened. Please try again later or contact a teacher.",
        buttonText: "OK",
      };
  }
}
