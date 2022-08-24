describe('My First Test', () => { // test case name it further has test cases
    it('Visits the NewsApi.org and login', () => {
        cy.visit('https://newsapi.org/login')
        cy.get("input[name='Email']").type("tuser6794@gmail.com")
        cy.get("input[name='Password']").type("tuser6794@gmail.com")
        // cy.get("input[name='Email']").type("john@example.com")
        // cy.get("input[name='Password']").type("john@example.com")
        cy.get(".ladda-button").click()
        // cy.contains('Login').click()
    })
  })
  