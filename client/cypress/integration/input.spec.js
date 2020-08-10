import { visitOnMobile } from "../support/functions";

describe("Input field", () => {
  it("disables send button when no input", () => {
    visitOnMobile(cy, "/?lesson=q1"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");

    cy.get("#outlined-multiline-static").should("not.be.disabled");
    cy.get("#submit-button").should("be.disabled");
  });

  it("disables send button when session finished", () => {
    visitOnMobile(cy, "/?lesson=q1"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");
    cy.route("POST", "**/dialog/q1/session", "fixture:q1-1-p2.json");

    const reply1 =
      "Peer pressure can cause you to allow inappropriate behavior. If you correct someone's behavior, you may get them in trouble or it may be harder to work with them. Enforcing the rules can make you unpopular.";
    cy.get("#outlined-multiline-static").type(reply1);
    cy.get("#submit-button").click();
    cy.get("#submit-button").should("be.disabled");
    cy.get("#outlined-multiline-static").should("be.disabled");
  });

  it("enables send button when input and session not finished", () => {
    visitOnMobile(cy, "/?lesson=q1"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");

    cy.get("#outlined-multiline-static").type("hi");
    cy.get("#outlined-multiline-static").should("not.be.disabled");
    cy.get("#submit-button").should("not.be.disabled");
  });

  it("can send input with button", () => {
    visitOnMobile(cy, "/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");

    const reply = "Current flows in the same direction as the arrow";
    cy.get("#outlined-multiline-static").type(reply);
    cy.get("#submit-button").click();
    cy.get("#chat-msg-3").contains(reply);
  });

  it("can send input with enter", () => {
    visitOnMobile(cy, "/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");

    const reply = "Current flows in the same direction as the arrow";
    cy.get("#outlined-multiline-static").type(reply);
    cy.get("#outlined-multiline-static").type("{enter}");
    cy.get("#chat-msg-3").contains(reply);
  });
});

function visitOnMobile(cy, url) {
  cy.server();
  cy.viewport(660, 1000);
  cy.visit(url);
}
