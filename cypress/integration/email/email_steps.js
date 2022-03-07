import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { faker } from '@faker-js/faker'
import SignInPage from '../../pages/sign_in_page'
import MainMenu from '../../pages/menus/main_menu'
import AddUserPage from '../../pages/add_user_page'
import LastEmailPage from '../../pages/last_email_page'
import AcceptInvitePage from '../../pages/accept_invite_page'
import ForgotPasswordPage from '../../pages/forgot_password_page'
import ChangePasswordPage from '../../pages/change_password_page'
import UsersPage from '../../pages/users_page'

Given('I am a new user', () => {
  const user = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName()
  }
  // First part of the email address
  const emailName = `${user.firstName}.${user.lastName}${faker.datatype.number({ min: 10, max: 100 })}`.replace("'", '')
  user.email = `${emailName}@example.com`.toLowerCase()

  cy.wrap(user).as('user')
})

When('a new account is created for me', () => {
  SignInPage.visit()
  SignInPage.email().type(Cypress.config().users.admin.email)
  SignInPage.password().type(Cypress.env('PASSWORD'))
  SignInPage.logIn().click()

  MainMenu.admin.getOption('User Management', '').click()

  UsersPage.addUserAccount().click()

  cy.get('@user').then((user) => {
    AddUserPage.email().type(user.email)
    AddUserPage.firstName().type(user.firstName)
    AddUserPage.lastName().type(user.lastName)

    AddUserPage.regimeAccess('Waste').click()
    AddUserPage.addAndInviteUser().click()

    cy.get('div.alert-info.alert-dismissable')
      .should('contain.text', 'User account created')

    MainMenu.user.getOption('Sign out').click()
    cy.get('h1').should('contain', 'Sign in')
    cy.url().should('include', '/auth/sign_in')
  })
})

And('I accept the invitation', () => {
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

Given('I am an existing user', () => {
  const user = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName()
  }
  // First part of the email address
  const emailName = `${user.firstName}.${user.lastName}${faker.datatype.number({ min: 10, max: 100 })}`.replace("'", '')
  user.email = `${emailName}@example.com`.toLowerCase()

  cy.wrap(user).as('user')

  SignInPage.visit()
  SignInPage.email().type(Cypress.config().users.admin.email)
  SignInPage.password().type(Cypress.env('PASSWORD'))
  SignInPage.logIn().click()

  MainMenu.admin.getOption('User Management', '').click()

  cy.get('button#new-user').click()

  cy.get('@user').then((user) => {
    AddUserPage.email().type(user.email)
    AddUserPage.firstName().type(user.firstName)
    AddUserPage.lastName().type(user.lastName)

    AddUserPage.regimeAccess('Waste').click()
    AddUserPage.addAndInviteUser().click()

    cy.get('div.alert-info.alert-dismissable')
      .should('contain.text', 'User account created')

    MainMenu.user.getOption('Sign out').click()
    cy.get('h1').should('contain', 'Sign in')
    cy.url().should('include', '/auth/sign_in')
  })
})

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
