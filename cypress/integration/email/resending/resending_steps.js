import { And, But, Then } from 'cypress-cucumber-preprocessor/steps'

import EditUserPage from '../../../pages/edit_user_page'
import LastEmailPage from '../../../pages/last_email_page'
import MainMenu from '../../../pages/menus/main_menu'
import ResendUnlockPage from '../../../pages/resend_unlock_page'
import SignInPage from '../../../pages/sign_in_page'
import UsersPage from '../../../pages/users_page'

But('I miss the first invitation email', () => {
  cy.get('@user').then((user) => {
    LastEmailPage.lastEmail([user.email, 'created an account'])

    cy.get('@lastEmail').then((lastEmail) => {
      const link = LastEmailPage.extractUnlockAccountLink(lastEmail.last_email.body)

      cy.wrap(link).as('firstLink')
    })
  })
})

And('request another invitation email', () => {
  MainMenu.admin.getOption('User Management', '').click()

  cy.get('@user').then((user) => {
    UsersPage.searchName().type(user.lastName)
    UsersPage.search().click()

    UsersPage.searchResults().each((element, index) => {
      cy.get(`.table-responsive > tbody > tr:nth-child(${index + 1}) td`).eq(2).invoke('text').then((email) => {
        if (email === user.email) {
          cy.get(`.table-responsive > tbody > tr:nth-child(${index + 1})`).invoke('attr', 'id').then((id) => {
            UsersPage.searchResultEdit(id).click()
            EditUserPage.resendInvite().click()
          })
        }
      })
    })
  })
})

Then('the TCM will confirm the user has been reinvited', () => {
  cy.get('.col > .alert')
    .should(
      'contain.text',
      'User reinvited'
    )
})

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
