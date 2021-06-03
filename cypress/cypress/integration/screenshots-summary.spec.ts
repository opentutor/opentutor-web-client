/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cyMockDialog, cyMockSession, cySetup, cyVisitWithTestingParam } from "../support/functions";

function snapname(n: string): string {
  return `screenshots-summary-popup-${n}`;
}

describe("screenshots - summary popup", () => {
  [
    {
      lesson: "q1",
      fixtureLessonStart: "q1-1-p1.json",
    },
    {
      lesson: "q2",
      fixtureLessonStart: "q2-1-p1.json",
    },
  ].forEach((x, i) => {
    it(`opens and displays summary popup for lesson ${x.lesson}`, () => {
      cySetup(cy);
      cyMockDialog(cy, x.lesson, x.fixtureLessonStart).as("start");
      cyVisitWithTestingParam(cy, `/?lesson=${x.lesson}&guest=guest`);
      cy.wait("@start");
      cy.get('[data-cy=thread]').should("be.visible");
      // cy.get("[data-cy=chat-thread-scroll-done]");
      cy.get('[data-cy=view-summary-btn]').should("be.visible");
      cy.get('[data-cy=view-summary-btn]').click();
      cy.get("[data-cy=summary-popup-trans-done]");
      (cy as any).matchImageSnapshot(
        snapname(`lesson-${x.lesson}-open-summary-${i}`)
      );
    });
  });

  [
    {
      lesson: "q1",
      fixtureLessonStart: "q1-1-p1.json",
      fixtureLessonContinue: "q1-2-p2.json",
      userInput: "Enforcing the rules can make you unpopular.",
    },
    {
      lesson: "q2",
      fixtureLessonStart: "q2-1-p1.json",
      fixtureLessonContinue: "q2-2-p2.json",
      userInput: "Physics",
    },
  ].forEach((x, i) => {
    it(`sends message and displays summary popup for lesson ${x.lesson}`, () => {
      cySetup(cy);
      cyMockDialog(cy, x.lesson, x.fixtureLessonStart).as("start");
      cyMockSession(cy, x.lesson, x.fixtureLessonStart).as("response");
      cyVisitWithTestingParam(cy, `/?lesson=${x.lesson}&guest=guest`);
      cy.wait("@start");
      cy.get('[data-cy=outlined-multiline-static]').type(x.userInput);
      cy.get('[data-cy=submit-button]').should("be.visible");
      cy.get('[data-cy=submit-button]').click();
      cy.wait("@response");
      cy.get('[data-cy=thread]').should("be.visible");
      // cy.get("[data-cy=chat-thread-scroll-done]");
      cy.get('[data-cy=view-summary-btn]').should("be.visible");
      cy.get('[data-cy=view-summary-btn]').click();
      cy.get("[data-cy=summary-popup-trans-done]");
      (cy as any).matchImageSnapshot(
        snapname(`lesson-${x.lesson}-summary-feedback-${i}`)
      );
    });
  });
});
