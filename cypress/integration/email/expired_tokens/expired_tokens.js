import { And, Then } from 'cypress-cucumber-preprocessor/steps'

import MainMenu from '../../../pages/menus/main_menu'

And('I try to accept the first invitation', () => {
  MainMenu.user.getOption('Sign out').click()
  cy.get('h1').should('contain', 'Sign in')
  cy.url().should('include', '/auth/sign_in')

  cy.get('@user').then((user) => {
    cy.get('@firstLink').then((firstLink) => {
      cy.visit(firstLink).then(() => {
      })
    })
  })
})

Then('the TCM will confuse me and not be helpful', () => {
  cy.log('User redirected to the sign in page with no message about token being invalid')
  cy.get('.col > .alert')
    .should(
      'contain.text',
      'You need to sign in before continuing'
    )
  cy.url().should('include', '/auth/sign_in')
})

// You need to sign in before continuing.
