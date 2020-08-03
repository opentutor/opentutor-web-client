describe("Target Indicators Work", () => {
  it("shows no progress on all three targets at start of lesson 1", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q1"); // change URL to match your dev URLs

    cy.fixture("q1-1-p1.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q1", desiredServerResponse);
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
    // Take a snapshot for visual diffing
    await(1500);
    cy.percySnapshot();
  });

  it("shows some progress on two targets during lesson 1", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q1"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q1", "fixture:q1-2-p2.json");

    cy.fixture("q1-2-p2.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q1/session", desiredServerResponse);
      const reply = "Peer pressure";

      cy.get("#outlined-multiline-static").type(reply);
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
    // Take a snapshot for visual diffing
    await(1500);
    cy.percySnapshot();
  });

  it("shows full progress on three targets with perfect response in lesson 1", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q1"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p2.json");

    cy.fixture("q1-1-p2.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q1/session", desiredServerResponse);
      const reply =
        "Peer pressure can cause you to allow inappropriate behavior. If you correct someone's behavior, you may get them in trouble or it may be harder to work with them. Enforcing the rules can make you unpopular.";

      cy.get("#outlined-multiline-static").type(reply);
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
    // Take a snapshot for visual diffing
    await(1500);
    cy.percySnapshot();
  });
  //Q2
  it("shows no progress on all three targets at start of lesson 2", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q2"); // change URL to match your dev URLs

    cy.fixture("q2-1-p1.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q2", desiredServerResponse);
      cy.get(
        `#target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}`
      );
    });
    // Take a snapshot for visual diffing
    await(1500);
    cy.percySnapshot();
  });

  it("shows some progress on two targets during lesson 2", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-2-p2.json");

    cy.fixture("q2-2-p2.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q2/session", desiredServerResponse);
      const reply = "Peer pressure";

      cy.get("#outlined-multiline-static").type(reply);
      cy.get("#submit-button").click();

      cy.get(
        `#target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}`
      );
    });
    // Take a snapshot for visual diffing
    await(1500);
    cy.percySnapshot();
  });

  it("shows full progress on three targets with perfect response in lesson 2", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p2.json");

    cy.fixture("q2-1-p2.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q2/session", desiredServerResponse);
      const reply =
        "Peer pressure can cause you to allow inappropriate behavior. If you correct someone's behavior, you may get them in trouble or it may be harder to work with them. Enforcing the rules can make you unpopular.";

      cy.get("#outlined-multiline-static").type(reply);
      cy.get("#submit-button").click();

      cy.get(
        `#target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}`
      );
    });
    // Take a snapshot for visual diffing
    await(1500);
    cy.percySnapshot();
  });
});
