/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
export enum ChatMsgType {
  Text = "text",
  Closing = "closing",
  Opening = "opening",
  MainQuestion = "mainQuestion",
  Hint = "hint",
  Prompt = "prompt",
  FeedbackPositive = "feedbackPositive",
  FeedbackNegative = "feedbackNegative",
  FeedbackNeutral = "feedbackNeutral",
  Encouragement = "encouragement",
  Profanity = "profanity",
}

export interface ChatMsg {
  senderId: string;
  type: string;
  text: string;
}

export interface ErrorData {
  title: string;
  message: string;
  buttonText: string;
}

export interface Target {
  achieved: boolean;
  score: number;
  text: string;
  status: string;
}

export interface Lesson {
  name: string;
  media?: Media;
  learningFormat: string;
}

export enum MediaType {
  NONE = "",
  IMAGE = "image",
  VIDEO = "video",
}

export enum LessonFormat {
  SURVEY_SAYS = "surveySays",
}

export interface Media {
  url: string;
  type: string;
  props?: Array<{ name: string; value: string }>;
}

export interface ExpectationData {
  ideal: string;
  score: number;
  satisfied: boolean;
  status: string;
}

export interface DialogState {
  expectationsCompleted: boolean;
  expectationData: ExpectationData[];
  hints: boolean;
}

export interface SessionData {
  sessionId: string;
  sessionHistory: string;
  previousUserResponse: string;
  previousSystemResponse: string[];
  dialogState: DialogState;
  hash: string;
}

export interface DialogMsg {
  author: string;
  type: string;
  data: { text: string };
}

export interface DialogData {
  status: number;
  sessionInfo: SessionData;
  response: DialogMsg[];
  completed: boolean;
  score: number;
  expectationActive: number;
}

export interface DialogError {
  status: number;
  statusText: string;
  data: string;
}

export type DialogResponse = DialogData | DialogError;

export interface FetchLesson {
  lessonInfo: Lesson;
}

export interface SessionSummary {
  showSummary: boolean;
  showSummaryTimer?: number;
  summaryMessage?: string;
  sendResultsPending?: boolean;
  score?: number;
}
