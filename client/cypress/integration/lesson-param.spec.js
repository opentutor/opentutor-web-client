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
});
