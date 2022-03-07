import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { faker } from '@faker-js/faker'
import SignInPage from '../../pages/sign_in_page'
import MainMenu from '../../pages/menus/main_menu'
import AddUserPage from '../../pages/add_user_page'
import LastEmailPage from '../../pages/last_email_page'
import AcceptInvitePage from '../../pages/accept_invite_page'

Given('I am a new user', () => {
  const user = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName()
  }
  // First part of the email address
  const emailName = `${user.firstName}.${user.lastName}${faker.datatype.number({ min: 10, max: 100 })}`.replace("'", '')
  user.email = `${emailName}@example.com`.toLowerCase()

  cy.wrap(user).as('newUser')
})

When('a new account is created for me', () => {
  SignInPage.visit()
  SignInPage.email().type(Cypress.config().users.admin.email)
  SignInPage.password().type(Cypress.env('PASSWORD'))
  SignInPage.logIn().click()

  MainMenu.admin.getOption('User Management', '').click()

  cy.get('button#new-user').click()

  cy.get('@newUser').then((newUser) => {
    AddUserPage.email().type(newUser.email)
    AddUserPage.firstName().type(newUser.firstName)
    AddUserPage.lastName().type(newUser.lastName)

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
  cy.get('@newUser').then((newUser) => {
    LastEmailPage.lastEmail([newUser.email, 'created an account'])

    cy.get('@lastEmail').then((lastEmail) => {
      const link = LastEmailPage.extractInvitation(lastEmail.last_email.body)

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
  cy.get('@newUser').then((newUser) => {
    const username = `${newUser.firstName} ${newUser.lastName}`
    MainMenu.user.menuLink().should('contain', username)
  })
})
