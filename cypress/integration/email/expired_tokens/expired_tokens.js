import { And, Then } from 'cypress-cucumber-preprocessor/steps'

import MainMenu from '../../../pages/menus/main_menu'
import ResendUnlockPage from '../../../pages/resend_unlock_page'

And('I try to accept the first invitation email', () => {
  MainMenu.user.getOption('Sign out').click()
  cy.get('h1').should('contain', 'Sign in')
  cy.url().should('include', '/auth/sign_in')

  cy.get('@firstLink').then((firstLink) => {
    cy.visit(firstLink)
  })
})

And('I try to accept the first unlock email', () => {
  cy.get('@firstLink').then((firstLink) => {
    cy.visit(firstLink)
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

Then('I will be directed to the resend unlock page and told my token is invalid', () => {
  ResendUnlockPage.confirm()

  cy.get('h2').should('contain', 'error prohibited this user from being saved')
  cy.get('div#error_explanation > ul > li').should('contain', 'Unlock token is invalid')
})
