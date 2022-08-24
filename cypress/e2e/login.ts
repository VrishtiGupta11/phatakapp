describe('My Login Test', () => { // test case name it further has test cases
    it('Visits the Facebook and Login', () => {
        cy.visit('https://www.facebook.com')
        // cy.contains('Login').click()
        // locators in cypress

        // Locate a web element by 
        // 1. Name
        // 2. Tag
        // 3. ID
        // 4. CSS
        // 4. Xpath => /html/body/header/div/nav[2]/div[1]/a

        // using ID
        cy.get("#email") .type("john@example.com") 
        cy.get("#pass").type("John123456")
        cy.get("#loginbutton").click()
        cy.contains("ਤੁਹਾਡੀ ਗੁਜਾਰਿਸ਼ ਦੀ ਪ੍ਰਕਿਰਿਆ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ")

        
    })
  })
  