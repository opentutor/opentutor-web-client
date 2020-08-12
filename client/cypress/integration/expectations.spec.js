import { visitOnMobile } from "../support/functions";

describe("Expectation indicators", () => {
  [
    {
      lesson: "q1",
      fixture: "q1-1-p1.json",
      expectedExpCount: 3,
    },
    {
      lesson: "q2",
      fixture: "q2-1-p1.json",
      expectedExpCount: 1,
    },
  ].forEach((x) => {
    it(`shows an icon for each expectation for a lesson with ${x.expectedExpCount}`, () => {
      visitOnMobile(cy, `/?lesson=${x.lesson}`); // change URL to match your dev URLs
      cy.route("POST", `**/dialog/${x.lesson}`, `fixture:${x.fixture}`);
      cy.get("#targets").children().should("have.length", x.expectedExpCount);
    });
  });
});
