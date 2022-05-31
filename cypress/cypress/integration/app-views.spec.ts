/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  cyMockDefault,
  cyMockDialog,
  cyMockImage,
  cySetup,
  mockGQL,
} from "../support/functions";
import { lessonInfo } from "../fixtures/lesson-graphql-default";

describe("App view desktop", () => {
  it(`Optimize space if param is passed with header`, () => {
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchLessonInfo", {
          lessonInfo: {
            name: "lesson 1",
            media: {
              url: "https://www.youtube.com/watch?v=g4mHPeMGTJM",
              type: "video",
              props: [
                { name: "start", value: "71" },
                { name: "end", value: "72.5" },
              ],
            },
            learningFormat: "surveySays",
          },
        }),
      ],
    });
    cyMockDialog(cy, "q1", "views/surveySays-opts.json");
    cy.viewport("macbook-13");
    cy.visit(`/?lesson=q1&guest=guest`); // change URL to match your dev URLs

    cy.get("[data-cy=video]");
  });

  it(`Optimize space if param is passed & noheader=true`, () => {
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchLessonInfo", {
          lessonInfo: {
            name: "lesson 1",
            media: {
              url: "https://www.youtube.com/watch?v=g4mHPeMGTJM",
              type: "video",
              props: [
                { name: "start", value: "71" },
                { name: "end", value: "72.5" },
              ],
            },
            learningFormat: "surveySays",
          },
        }),
      ],
    });
    cyMockDialog(cy, "q1", "views/surveySays-opts.json");

    cy.visit(`/?lesson=q1&guest=guest&noheader=true`); // change URL to match your dev URLs
    cy.viewport("macbook-11");

    cy.get("[data-cy=video]");
  });

  it(`Optimize space if param is passed with header & no media`, () => {
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchLessonInfo", {
          lessonInfo: {
            name: "lesson 1",
            media: {
              url: "https://www.youtube.com/watch?v=g4mHPeMGTJM",
              type: "video",
              props: [
                { name: "start", value: "71" },
                { name: "end", value: "72.5" },
              ],
            },
            learningFormat: "",
          },
        }),
      ],
    });
    cyMockDialog(cy, "q1", "views/surveySays-opts.json");
    cy.viewport("macbook-13");

    cy.visit(`/?lesson=q1&guest=guest`); // change URL to match your dev URLs

    cy.get("[data-cy=video]");
  });
});

describe("App view Mobile", () => {
  it(`Optimize space if param is passed with header`, () => {
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchLessonInfo", {
          lessonInfo: {
            name: "lesson 1",
            media: {
              url: "https://www.youtube.com/watch?v=g4mHPeMGTJM",
              type: "video",
              props: [
                { name: "start", value: "71" },
                { name: "end", value: "72.5" },
              ],
            },
            learningFormat: "surveySays",
          },
        }),
      ],
    });
    cyMockDialog(cy, "q1", "views/surveySays-opts.json");
    cy.visit(`/?lesson=q1&guest=guest`); // change URL to match your dev URLs

    cy.get("[data-cy=video]");
  });

  it(`Optimize space if param is passed & noheader=true`, () => {
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchLessonInfo", {
          lessonInfo: {
            name: "lesson 1",
            media: {
              url: "https://www.youtube.com/watch?v=g4mHPeMGTJM",
              type: "video",
              props: [
                { name: "start", value: "71" },
                { name: "end", value: "72.5" },
              ],
            },
            learningFormat: "surveySays",
          },
        }),
      ],
    });
    cyMockDialog(cy, "q1", "views/surveySays-opts.json");

    cy.visit(`/?lesson=q1&guest=guest&noheader=true`); // change URL to match your dev URLs

    cy.get("[data-cy=video]");
  });
  it(`Optimize space if param is passed & noheader=true & no media`, () => {
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchLessonInfo", {
          lessonInfo: {
            name: "lesson 1",
            media: {
              url: "https://www.youtube.com/watch?v=g4mHPeMGTJM",
              type: "video",
              props: [
                { name: "start", value: "71" },
                { name: "end", value: "72.5" },
              ],
            },
            learningFormat: "",
          },
        }),
      ],
    });
    cyMockDialog(cy, "q1", "views/surveySays-opts.json");
    cy.visit(`/?lesson=q1&guest=guest&noheader=true`); // change URL to match your dev URLs

    cy.get("[data-cy=video]");
  });
});
