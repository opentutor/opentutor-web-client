describe("Cypress", () => {
  it("is working", () => {
    expect(true).to.equal(true);
  });

  it("visits the app at base URL", () => {
    cy.visit("/");
  });
});
