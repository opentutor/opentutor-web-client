export function visitOnMobile(cy, url) {
  cy.server();
  cy.viewport(660, 1000);
  cy.visit(url);
}
