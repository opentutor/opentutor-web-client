// describe("Expectation summary", () => {
//     it("appears at end of conversation", () => {
//         cy.server();
//         cy.viewport(660, 1000);
//         cy.visit("/?lesson=q1"); // change URL to match your dev URLs

//         cy.fixture("q1-p2.json").then((desiredServerResponse) => {
//             cy.route("POST", "**/dialog/q1/session", desiredServerResponse);
//             const reply =
//                 "Peer pressure can cause you to allow inappropriate behavior. If you correct someone's behavior, you may get them in trouble or it may be harder to work with them. Enforcing the rules can make you unpopular.";

//             cy.get("#outlined-multiline-static").type(reply);
//             cy.get("#submit-button").click();
//             cy.get("#summary-popup");
//         });
//     });

//     it("opens with View Summary button", () => {
//         cy.server();
//         cy.viewport(660, 1000);
//         cy.visit("/?lesson=q1"); // change URL to match your dev URLs

//         cy.get("#summary-btn").click();
//         cy.get("#summary-popup");
//     });

// });
