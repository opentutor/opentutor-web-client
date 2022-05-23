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

describe("Mobile View", () => {
  it(`displays image for a lesson`, () => {
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchLessonInfo", { lessonInfo })],
    });
    cyMockImage(cy, "**/lesson1/image.png", "lesson1.png");
    cyMockDialog(cy, "q1", "q1-1-p1.json");

    cy.visit(`/?lesson=q1&guest=guest`); // change URL to match your dev URLs
    cy.get("[data-cy=image]").within(($image) => {
      cy.get("img").should("have.attr", "src", "lesson1/image.png");
    });
  });

  it(`displays video for a lesson`, () => {
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
            learningFormat: null,
          },
        }),
      ],
    });
    cyMockDialog(cy, "q1", "q1-1-p1.json");

    cy.visit(`/?lesson=q1&guest=guest`); // change URL to match your dev URLs
    cy.get("[data-cy=video]");
  });

  it(`Hides header if param is passed`, () => {
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
            learningFormat: null,
          },
        }),
      ],
    });
    cyMockDialog(cy, "q1", "q1-1-p1.json");

    cy.visit(`/?lesson=q1&guest=guest&noheader=true`); // change URL to match your dev URLs
    cy.get("[data-cy=video]");
  });

  it(`Optimize space if param is passed  & noheader=true (mobile)`, () => {
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
    cyMockDialog(cy, "q1", "views/q1-1-p1.json");

    cy.visit(`/?lesson=q1&guest=guest&noheader=true`); // change URL to match your dev URLs
    cy.get("[data-cy=video]");
  });

  it(`Optimize space if param is passed & noheader=true (desktop)`, () => {
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
    cyMockDialog(cy, "q1", "views/q1-1-p1.json");

    cy.visit(`/?lesson=q1&guest=guest&noheader=true`); // change URL to match your dev URLs
    cy.viewport("macbook-11");
    cy.get("[data-cy=video]");
  });

  it(`Optimize space if param is passed with header (desktop)`, () => {
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
    cyMockDialog(cy, "q1", "views/q1-1-p1.json");

    cy.visit(`/?lesson=q1&guest=guest`); // change URL to match your dev URLs
    cy.viewport("macbook-11");
    cy.get("[data-cy=video]");
  });

  it(`Optimize space if no surveySays (desktop)`, () => {
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
    cyMockDialog(cy, "q1", "views/q1-1-p1.json");

    cy.visit(`/?lesson=q1&guest=guest`); // change URL to match your dev URLs
    cy.viewport("macbook-11");
    cy.get("[data-cy=video]");
  });

  it(`Optimize space if param is passed with header (mobile)`, () => {
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
    cyMockDialog(cy, "q1", "views/q1-1-p1.json");

    cy.visit(`/?lesson=q1&guest=guest`); // change URL to match your dev URLs
    cy.get("[data-cy=video]");
  });
});
