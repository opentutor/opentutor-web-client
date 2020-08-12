import { cySetup } from "../support/functions";

describe("Input field", () => {
  it("disables send button when no input", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");
    cy.visit("/?lesson=q1");
    cy.get("#outlined-multiline-static").should("not.be.disabled");
    cy.get("#submit-button").should("be.disabled");
  });

  it("disables send button when session finished", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");
    cy.route("POST", "**/dialog/q1/session", "fixture:q1-1-p2.json");
    cy.visit("/?lesson=q1");
    cy.get("#outlined-multiline-static").type(
      "Peer pressure can cause you to allow inappropriate behavior. If you correct someone's behavior, you may get them in trouble or it may be harder to work with them. Enforcing the rules can make you unpopular."
    );
    cy.get("#submit-button").click();
    cy.get("#submit-button").should("be.disabled");
    cy.get("#outlined-multiline-static").should("be.disabled");
  });

  it("enables send button when input and session not finished", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");
    cy.visit("/?lesson=q1");
    cy.get("#outlined-multiline-static").type("hi");
    cy.get("#outlined-multiline-static").should("not.be.disabled");
    cy.get("#submit-button").should("not.be.disabled");
  });

  it("can send input with button", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");
    cy.visit("/?lesson=q2");
    const userInput = "Current flows in the same direction as the arrow";
    cy.get("#outlined-multiline-static").type(userInput);
    cy.get("#submit-button").click();
    cy.get("#chat-msg-3").contains(userInput);
  });

  it("can send input with enter", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");
    cy.visit("/?lesson=q2");
    const userInput = "Current flows in the same direction as the arrow";
    cy.get("#outlined-multiline-static").type(userInput);
    cy.get("#outlined-multiline-static").type("{enter}");
    cy.get("#chat-msg-3").contains(userInput);
  });
});
