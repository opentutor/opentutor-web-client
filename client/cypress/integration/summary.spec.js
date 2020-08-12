import { visitOnMobile } from "../support/functions";

describe("Expectation summary pop-up", () => {
  it("opens with View Summary button", () => {
    visitOnMobile(cy, "/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");

    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
  });

  it("shows icons for each expectation for lesson q1", () => {
    visitOnMobile(cy, "/?lesson=q1"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");

    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 3);
  });

  it("shows icons for each expectation for lesson q2", () => {
    visitOnMobile(cy, "/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");

    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
  });

  it("displays on tap any expectation-progress indicator", () => {
    visitOnMobile(cy, "/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
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
    visitOnMobile(cy, "/?lesson=q2"); // change URL to match your dev URLs

    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");

    const reply = "Current flows in the same direction as the arrow";
    cy.get("#outlined-multiline-static").type(reply);
    cy.get("#submit-button").click();
    cy.get("#summary-popup");
  });

  it("hides text for expectations that have not been completed", () => {
    visitOnMobile(cy, "/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");

    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
    cy.get("#exp-locked-0");
  });

  it("shows no progress for expectations that have not been completed", () => {
    visitOnMobile(cy, "/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");

    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
    cy.get("#summary-target-0-0");
  });

  it("shows text for expectations that have been completed", () => {
    visitOnMobile(cy, "/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");

    const reply = "Current flows in the same direction as the arrow";
    cy.get("#outlined-multiline-static").type(reply);
    cy.get("#submit-button").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
    cy.get("#exp-0").contains(
      "Current flows in the same direction as the arrow."
    );
  });

  it("shows progress for expectations that have been completed", () => {
    visitOnMobile(cy, "/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");

    const reply = "Current flows in the same direction as the arrow";
    cy.get("#outlined-multiline-static").type(reply);
    cy.get("#submit-button").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
    cy.get("#summary-target-0-1");
  });
});
