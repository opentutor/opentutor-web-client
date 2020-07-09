describe("Cypress", () => {
  it("is working", () => {
    expect(true).to.equal(true);
  });

  it("visits the app at localhost:8000", () => {
    cy.visit("http://localhost:8000");
  });

  it("visits the app at base URL", () => {
    cy.visit("/");
  });
});
