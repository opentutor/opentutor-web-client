describe("Expectation summary pop-up", () => {
  it("opens with View Summary button", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");

    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
  });

  it("shows icons for each expectation for lesson q1", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q1"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");

    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 3);
  });

  it("shows icons for each expectation for lesson q2", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");

    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
  });

  it("appears at end of conversation", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q2"); // change URL to match your dev URLs

    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");

    const reply = "Current flows in the same direction as the arrow";
    cy.get("#outlined-multiline-static").type(reply);
    cy.get("#submit-button").click();
    cy.get("#summary-popup");
  });

  it("hides text for expectations that have not been completed", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");

    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
    cy.get("#exp-locked-0");
  });

  it("shows no progress for expectations that have not been completed", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");

    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
    cy.get("#summary-target-0-0");
  });

  it("shows text for expectations that have been completed", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q2"); // change URL to match your dev URLs
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
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q2"); // change URL to match your dev URLs
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
