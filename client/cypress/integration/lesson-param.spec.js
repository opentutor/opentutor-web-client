describe("Lesson query parameter", () => {
  it("starts session for lesson q1", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q1"); // change URL to match your dev URLs

    cy.fixture("q1-p1.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q1", desiredServerResponse);
      cy.get("#chat-msg-0").contains("Welcome to OpenTutor");
      cy.get("#chat-msg-1").contains(
        desiredServerResponse.response[0].data.text
      );
      cy.get("#chat-msg-2").contains(
        desiredServerResponse.response[1].data.text
      );
    });
  });

  it("sends message and gets response for lesson q1", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q1"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q1", "fixture:q1-p1.json");

    cy.fixture("q1-p2.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q1/session", desiredServerResponse);
      const reply =
        "Peer pressure can cause you to allow inappropriate behavior. If you correct someone's behavior, you may get them in trouble or it may be harder to work with them. Enforcing the rules can make you unpopular.";

      cy.get("#outlined-multiline-static").type(reply);
      cy.get("#submit-button").click();

      cy.get("#chat-msg-3").contains(reply);
      cy.get("#chat-msg-4").contains(
        desiredServerResponse.response[0].data.text
      );
      cy.get("#chat-msg-5").contains(
        desiredServerResponse.response[1].data.text
      );
      cy.get("#chat-msg-6").contains(
        desiredServerResponse.response[2].data.text
      );
    });
  });

  it("starts session for lesson q2", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q2"); // change URL to match your dev URLs

    cy.fixture("q2-p1.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q2", desiredServerResponse);
      cy.get("#chat-msg-0").contains("Welcome to OpenTutor");
      cy.get("#chat-msg-1").contains(
        desiredServerResponse.response[0].data.text
      );
      cy.get("#chat-msg-2").contains(
        desiredServerResponse.response[1].data.text
      );
    });
  });

  it("sends message and gets response for lesson q2", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-p1.json");

    cy.fixture("q2-p2.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q2/session", desiredServerResponse);
      const reply = "Current flows in the same direction as the arrow";

      cy.get("#outlined-multiline-static").type(reply);
      cy.get("#submit-button").click();

      cy.get("#chat-msg-3").contains(reply);
      cy.get("#chat-msg-4").contains(
        desiredServerResponse.response[0].data.text
      );
      cy.get("#chat-msg-5").contains(
        desiredServerResponse.response[1].data.text
      );
    });
  });
});
