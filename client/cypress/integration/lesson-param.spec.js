/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cySetup } from "../support/functions";

describe("Lesson query parameter", () => {
  [
    {
      lesson: "q1",
      fixture: "q1-1-p1.json",
    },
    {
      lesson: "q2",
      fixture: "q2-1-p1.json",
    },
  ].forEach((x) => {
    it(`displays intro messages on start for lesson ${x.lesson}`, () => {
      cySetup(cy);
      cy.fixture(x.fixture).then((expectedServerResponse) => {
        cy.route("POST", `**/dialog/${x.lesson}`, expectedServerResponse);
        cy.visit(`/?lesson=${x.lesson}&guest=guest`); // change URL to match your dev URLs
        cy.get("#chat-msg-0").contains("Welcome to OpenTutor");
        expectedServerResponse.response.forEach((r, i) => {
          cy.get(`#chat-msg-${i + 1}`).contains(r.data.text);
        });
      });
    });
  });

  [
    {
      lesson: "q1",
      fixtureLessonStart: "q1-1-p1.json",
      fixtureLessonContinue: "q1-1-p2.json",
      userInput:
        "Peer pressure can cause you to allow inappropriate behavior. If you correct someone's behavior, you may get them in trouble or it may be harder to work with them. Enforcing the rules can make you unpopular.",
    },
    {
      lesson: "q2",
      fixtureLessonStart: "q2-1-p1.json",
      fixtureLessonContinue: "q2-1-p2.json",
      userInput: "Current flows in the same direction as the arrow.",
    },
  ].forEach((x) => {
    it(`sends message and gets response for lesson ${x.lesson}`, () => {
      cySetup(cy);
      cy.route(
        "POST",
        `**/dialog/${x.lesson}`,
        `fixture:${x.fixtureLessonStart}`
      );
      cy.fixture(x.fixtureLessonContinue).then((expectedServerResponse) => {
        cy.route(
          "POST",
          `**/dialog/${x.lesson}/session`,
          expectedServerResponse
        );
        cy.visit(`/?lesson=${x.lesson}&guest=guest`); // change URL to match your dev URLs
        cy.get("#outlined-multiline-static").type(x.userInput);
        cy.get("#submit-button").click();
        cy.get("#chat-msg-3").contains(x.userInput);
        expectedServerResponse.response.forEach((r, i) => {
          cy.get(`#chat-msg-${i + 4}`).contains(r.data.text);
        });
      });
    });
  });
});
