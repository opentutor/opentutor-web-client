import { cySetup } from "../support/functions";

describe("Expectation-progress Indicators", () => {
  it("shows no progress on all three targets at start of a lesson", () => {
    cySetup(cy);
    cy.fixture("q1-1-p1.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q1", desiredServerResponse);
      cy.visit("/?lesson=q1");
      cy.get(
        `#target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}`
      );
      cy.get(
        `#target-1-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[1].score
        ).toFixed()}`
      );
      cy.get(
        `#target-2-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[2].score
        ).toFixed()}`
      );
    });
  });

  it("shows some progress on two targets during a lesson", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q1", "fixture:q1-2-p2.json");
    cy.fixture("q1-2-p2.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q1/session", desiredServerResponse);
      cy.visit("/?lesson=q1");
      cy.get("#outlined-multiline-static").type("Peer pressure");
      cy.get("#submit-button").click();
      cy.get(
        `#target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}`
      );
      cy.get(
        `#target-1-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[1].score
        ).toFixed()}`
      );
      cy.get(
        `#target-2-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[2].score
        ).toFixed()}`
      );
    });
  });

  it("shows full progress for three targets on perfect response", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p2.json");
    cy.fixture("q1-1-p2.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q1/session", desiredServerResponse);
      cy.visit("/?lesson=q1");
      cy.get("#outlined-multiline-static").type(
        "Peer pressure can cause you to allow inappropriate behavior. If you correct someone's behavior, you may get them in trouble or it may be harder to work with them. Enforcing the rules can make you unpopular."
      );
      cy.get("#submit-button").click();
      cy.get(
        `#target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}`
      );
      cy.get(
        `#target-1-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[1].score
        ).toFixed()}`
      );
      cy.get(
        `#target-2-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[2].score
        ).toFixed()}`
      );
    });
  });

  it("shows no progress on all three targets at start of another lesson", () => {
    cySetup(cy);
    cy.fixture("q2-1-p1.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q2", desiredServerResponse);
      cy.visit("/?lesson=q2");
      cy.get(
        `#target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}`
      );
    });
  });

  it("shows some progress on two targets during another lesson", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-2-p2.json");
    cy.fixture("q2-2-p2.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q2/session", desiredServerResponse);
      cy.visit("/?lesson=q2");
      cy.get("#outlined-multiline-static").type("Peer pressure");
      cy.get("#submit-button").click();
      cy.get(
        `#target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}`
      );
    });
  });

  it("shows full progress for three targets on perfect response on another lesson", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p2.json");
    cy.fixture("q2-1-p2.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q2/session", desiredServerResponse);
      cy.visit("/?lesson=q2");
      cy.get("#outlined-multiline-static").type(
        "Peer pressure can cause you to allow inappropriate behavior. If you correct someone's behavior, you may get them in trouble or it may be harder to work with them. Enforcing the rules can make you unpopular."
      );
      cy.get("#submit-button").click();
      cy.get(
        `#target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}`
      );
    });
  });
});
