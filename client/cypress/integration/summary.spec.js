import { cySetup } from "../support/functions";

describe("Expectation summary pop-up", () => {
  it("opens with View Summary button", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.visit("/?lesson=q2");
    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
  });

  [
    {
      lesson: "q1",
      fixture: "q1-1-p1.json",
      expectedExpectations: 3,
    },
    {
      lesson: "q2",
      fixture: "q2-1-p1.json",
      expectedExpectations: 1,
    },
  ].forEach((x) => {
    it(`shows an icon for each expectation for lesson with ${x.expectedExpectations}`, () => {
      cySetup(cy);
      cy.route("POST", `**/dialog/${x.lesson}`, `fixture:${x.fixture}`);
      cy.visit(`/?lesson=${x.lesson}`);
      cy.get("#view-summary-btn").click();
      cy.get("#summary-popup");
      cy.get("#summary-targets")
        .children()
        .should("have.length", x.expectedExpectations);
    });
  });

  it("displays on tap any expectation-progress indicator", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.visit("/?lesson=q2");
    cy.fixture("q2-1-p1.json").then((desiredServerResponse) => {
      cy.get(
        `#target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}`
      ).click();
      cy.get("#summary-popup");
      cy.get("#summary-targets").children().should("have.length", 1);
    });
  });

  it("displays at when lesson is completed", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");
    cy.visit("/?lesson=q2");
    cy.get("#outlined-multiline-static").type(
      "Current flows in the same direction as the arrow"
    );
    cy.get("#submit-button").click();
    cy.get("#summary-popup");
  });

  it("hides text for expectations that have not been completed", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.visit("/?lesson=q2");
    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
    cy.get("#exp-locked-0");
  });

  it("shows no progress for expectations that have not been completed", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.visit("/?lesson=q2");
    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
    cy.get("#summary-target-0-0");
  });

  it("shows text for expectations that have been completed", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");
    cy.visit("/?lesson=q2");
    cy.get("#outlined-multiline-static").type(
      "Current flows in the same direction as the arrow"
    );
    cy.get("#submit-button").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
    cy.get("#exp-0").contains(
      "Current flows in the same direction as the arrow."
    );
  });

  it("shows progress for expectations that have been completed", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");
    cy.visit("/?lesson=q2");
    cy.get("#outlined-multiline-static").type(
      "Current flows in the same direction as the arrow"
    );
    cy.get("#submit-button").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
    cy.get("#summary-target-0-1");
  });
});
