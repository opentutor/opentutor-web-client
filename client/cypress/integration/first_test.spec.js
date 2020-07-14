describe('The Home Page', () => {
    it('successfully loads', () => {
        cy.viewport(660, 1000)
        cy.visit('/') // change URL to match your dev URL
    })
})