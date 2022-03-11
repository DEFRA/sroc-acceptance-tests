import { And, When } from 'cypress-cucumber-preprocessor/steps'

import ChangePasswordPage from '../../../pages/change_password_page'
import ForgotPasswordPage from '../../../pages/forgot_password_page'
import LastEmailPage from '../../../pages/last_email_page'
import SignInPage from '../../../pages/sign_in_page'

And('I have forgotten my password', () => {
  SignInPage.visit()
  SignInPage.forgotPasswordLink().click()

  ForgotPasswordPage.mainHeading().should('contain', 'Forgot your password?')

  cy.get('@user').then((user) => {
    ForgotPasswordPage.email().type(user.email)
    ForgotPasswordPage.sendMeResetPasswordInstructions().click()
  })

  cy.get('.col > .alert')
    .should(
      'contain.text',
      'If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes.'
    )
})

When('I follow the link to reset my password', () => {
  cy.get('@user').then((user) => {
    LastEmailPage.lastEmail([`Hello ${user.firstName} ${user.lastName}`, 'change your password'])

    cy.get('@lastEmail').then((lastEmail) => {
      const link = LastEmailPage.extractResetPasswordLink(lastEmail.last_email.body)

      cy.visit(link).then(() => {
        ChangePasswordPage.mainHeading().should('contain', 'Change your password')

        ChangePasswordPage.password().type(Cypress.env('PASSWORD'), { log: false })
        ChangePasswordPage.passwordConfirmation().type(Cypress.env('PASSWORD'), { log: false })
        ChangePasswordPage.changeMyPassword().click()
      })
    })
  })
})
