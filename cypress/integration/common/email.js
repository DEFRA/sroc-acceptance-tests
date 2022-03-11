import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { generateUserHelper, generateStringHelper } from '../../support/helpers'

import AcceptInvitePage from '../../pages/accept_invite_page'
import AddUserPage from '../../pages/add_user_page'
import LastEmailPage from '../../pages/last_email_page'
import MainMenu from '../../pages/menus/main_menu'
import SignInPage from '../../pages/sign_in_page'
import UsersPage from '../../pages/users_page'

Given('I am a new user', () => {
  const user = generateUserHelper()

  cy.wrap(user).as('user')
})

Given('I am an existing user', () => {
  cy.authenticate(Cypress.config().users.admin.email)

  const user = generateUserHelper()
  cy.wrap(user, { log: false }).as('user')

  cy.get('@user', { log: false }).then((user) => {
    cy.addUser(user)
    cy.signOut()
  })
})

When('a new account is created for me', () => {
  cy.signIn(Cypress.config().users.admin.email)

  MainMenu.admin.getOption('User Management', '').click()

  UsersPage.addUserAccount().click()

  cy.get('@user').then((user) => {
    AddUserPage.email().type(user.email)
    AddUserPage.firstName().type(user.firstName)
    AddUserPage.lastName().type(user.lastName)

    AddUserPage.regimeAccess('Waste').click()
    AddUserPage.addAndInviteUser().click()

    cy.get('.col > .alert')
      .should('contain.text', 'User account created')
  })
})

And('I accept the invitation', () => {
  MainMenu.user.getOption('Sign out').click()
  cy.get('h1').should('contain', 'Sign in')
  cy.url().should('include', '/auth/sign_in')

  cy.get('@user').then((user) => {
    LastEmailPage.lastEmail([user.email, 'created an account'])

    cy.get('@lastEmail').then((lastEmail) => {
      const link = LastEmailPage.extractInvitationLink(lastEmail.last_email.body)

      cy.visit(link).then(() => {
        AcceptInvitePage.mainHeading().should('contain', 'Set a password')

        AcceptInvitePage.password().type(Cypress.env('PASSWORD'), { log: false })
        AcceptInvitePage.passwordConfirmation().type(Cypress.env('PASSWORD'), { log: false })
        AcceptInvitePage.setPassword().click()
      })
    })
  })
})

Then('I will be signed in with my new account', () => {
  cy.get('@user').then((user) => {
    const username = `${user.firstName} ${user.lastName}`
    MainMenu.user.menuLink().should('contain', username)
  })
})

And('I incorrectly enter my password 5 times', () => {
  cy.get('@user').then((user) => {
    SignInPage.email().type(user.email)

    for (let i = 0; i < 5; i++) {
      SignInPage.password().clear()
      SignInPage.password().type(generateStringHelper())

      SignInPage.logIn().click()
    }
  })
})

When('I follow the link to unlock my account', () => {
  cy.get('@user').then((user) => {
    LastEmailPage.lastEmail([user.email, 'Your account has been locked'])

    cy.get('@lastEmail').then((lastEmail) => {
      const link = LastEmailPage.extractUnlockAccountLink(lastEmail.last_email.body)

      cy.visit(link)
    })
  })
})

Then('I will see confirmation my account is unlocked', () => {
  cy.get('.col > .alert')
    .should(
      'contain.text',
      'Your account has been unlocked successfully. Please sign in to continue.'
    )
})
