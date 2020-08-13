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
        cy.visit(`/?lesson=${x.lesson}`); // change URL to match your dev URLs
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
        cy.visit(`/?lesson=${x.lesson}`); // change URL to match your dev URLs
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
