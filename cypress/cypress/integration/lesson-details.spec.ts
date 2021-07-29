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

describe("lesson details", () => {
  it(`displays name for a lesson`, () => {
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchLessonInfo", { lessonInfo })],
    });
    cyMockImage(cy, "**/lesson1/image.png", "lesson1.png");
    cyMockDialog(cy, "q1", "q1-1-p1.json");

    cy.visit(`/?lesson=q1&guest=guest`); // change URL to match your dev URLs
    cy.get("[data-cy=title]").contains("lesson 1");
  });

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
            image: "",
            video: {
              link: "https://www.youtube.com/watch?v=-lLr7Fhh67c",
              start: 71,
              end: 72.5,
            },
          },
        }),
      ],
    });
    // cyMockImage(cy, "**/lesson1/image.png", "lesson1.png");
    cyMockDialog(cy, "q1", "q1-1-p1.json");

    cy.visit(`/?lesson=q1&guest=guest`); // change URL to match your dev URLs
    cy.get("[data-cy=video]");
    cy.wait(10000);
    cy.get("[data-cy=replay-button]");
    // .within(($image) => {
    //   cy.get("img").should("have.attr", "src", "lesson1/image.png");
    // });
  });
});
