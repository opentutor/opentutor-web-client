describe('The Home Page', () => {
    it('successfully loads', () => {
        cy.server()
        cy.viewport(660, 1000)
        cy.visit('/') // change URL to match your dev URLs

        //Part 1
        cy.fixture("lesson1-p1.json").then((desiredServerResponse) => {
            cy.route("POST", "**/dialog/q1", desiredServerResponse)
            
            cy.get('#chat-msg-0').contains("Welcome to OpenTutor")
            cy.get('#chat-msg-1').contains(desiredServerResponse.response[0].data.text)
            cy.get('#chat-msg-2').contains(desiredServerResponse.response[1].data.text)
        })

        //Part 2
        cy.fixture("lesson1-p2.json").then((desiredServerResponse) => {
            cy.route("POST", "**/dialog/q1/session", desiredServerResponse)
            
            const reply1 = "Peer pressure can cause you to allow inappropriate behavior. If you correct someone's behavior, you may get them in trouble or it may be harder to work with them. Enforcing the rules can make you unpopular."

            cy.get('#outlined-multiline-static').type(reply1)
            cy.get('#submit-button').click()

            cy.get('#chat-msg-3').contains(reply1)
            cy.get('#chat-msg-4').contains(desiredServerResponse.response[0].data.text)
            cy.get('#chat-msg-5').contains(desiredServerResponse.response[1].data.text)
            cy.get('#chat-msg-6').contains(desiredServerResponse.response[2].data.text)
        })
    })
})