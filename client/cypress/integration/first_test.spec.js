describe('The Home Page', () => {
    it('successfully loads', () => {
        cy.server()
        cy.route("POST", "**/dialog/q1", "fixture:example.json")
        cy.viewport(660, 1000)
        cy.visit('/') // change URL to match your dev URL
    })
})