import { And, But, Then } from 'cypress-cucumber-preprocessor/steps'

import LastEmailPage from '../../../pages/last_email_page'
import ResendUnlockPage from '../../../pages/resend_unlock_page'
import SignInPage from '../../../pages/sign_in_page'

But('I miss the first unlock email', () => {
  cy.get('@user').then((user) => {
    LastEmailPage.lastEmail([user.email, 'Your account has been locked'])

    cy.get('@lastEmail').then((lastEmail) => {
      const link = LastEmailPage.extractUnlockAccountLink(lastEmail.last_email.body)

      cy.wrap(link).as('firstLink')
    })
  })
})

And('request another unlock email', () => {
  SignInPage.visit()
  SignInPage.resendUnlockLink().click()

  cy.get('@user').then((user) => {
    ResendUnlockPage.email().type(user.email)
    ResendUnlockPage.resendUnlockInstructions().click()
  })
})

Then('I will see confirmation an unlock email has been sent', () => {
  cy.get('.col > .alert')
    .should(
      'contain.text',
      'If your account exists, you will receive an email with instructions for how to unlock it in a few minutes.'
    )
})
