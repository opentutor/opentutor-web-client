describe("The Home Page", () => {
  it("accepts inputs when allowed and disables inputs when not allowed", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q1"); // change URL to match your dev URLs

    //Part 1
    cy.fixture("q1-1-p1.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q1", desiredServerResponse);

      cy.get("#outlined-multiline-static").should("not.be.disabled");
      cy.get("#submit-button").should("be.disabled");
    });

    //Part 2
    cy.fixture("q1-1-p2.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q1/session", desiredServerResponse);

      const reply1 =
        "Peer pressure can cause you to allow inappropriate behavior. If you correct someone's behavior, you may get them in trouble or it may be harder to work with them. Enforcing the rules can make you unpopular.";

      cy.get("#outlined-multiline-static").type(reply1);
      cy.get("#submit-button").should("not.be.disabled");
      cy.get("#submit-button").click();
      cy.get("#submit-button").should("be.disabled");

      cy.get("#outlined-multiline-static").should("be.disabled");
      cy.get("#summary-popup").contains("Lesson Summary");
    });
  });
});
