describe('My First Test', () => { // test case name it further has test cases
    it('Visits the https://test.qatechhub.com/form-elements/ and login', () => {
        cy.visit('https://test.qatechhub.com/form-elements/')
        cy.get("#wpforms-49-field_1").type("ABCDEF")
        cy.get("#wpforms-49-field_1-last").type("GHIJKL")
        cy.get("#wpforms-49-field_2").type("tuser6794@gmail.com")
        cy.get("#wpforms-49-field_4").type("987654321")
        cy.get("#wpforms-49-field_3_2").click()
        cy.get("#wpforms-49-field_5").select("Cypress")
        cy.get("#wpforms-submit-49").click()
        cy.contains('You have successfully filled in the form!')
    })
  })
  