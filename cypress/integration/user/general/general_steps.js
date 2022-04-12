import { Before, And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { generateUserHelper, generateStringHelper } from '../../../support/helpers'
//import { faker } from '@faker-js/faker'


//import SignInPage from '../../../pages/sign_in_page'
import TransactionsPage from '../../../pages/transactions_page'
import UsersPage from '../../../pages/users_page'
import AddUserPage from '../../../pages/add_user_page'
//import EditUserPage from '../../../pages/edit_user_page'

Before(() => {
    cy.intercept('GET', '**/users?search=*').as('getSearch')
  })

And('I select a user', () => {
    const user = generateUserHelper()
    cy.wrap(user).as('user')

    TransactionsPage.adminMenu.getOption('User Management', '').click()

    UsersPage.addUserAccountButton().click()

    cy.get('@user').then((user) => {
        AddUserPage.emailInput().type(user.email)
        AddUserPage.firstNameInput().type(user.firstName)
        AddUserPage.lastNameInput().type(user.lastName)

        AddUserPage.regimeAccessCheckbox('Waste').click()
        AddUserPage.submitButton().click()
    })
    cy.alertShouldContain('User account created')
})

When('I update the users first name', () => {
    TransactionsPage.adminMenu.getOption('User Management', '').click()
    
    cy.get('@user').then((user) => {
        UsersPage.searchNameInput().type(user.lastName)
        UsersPage.submitButton().click()
        cy.wait('@getSearch').its('response.statusCode').should('eq', 200)

        UsersPage.searchResultsTable().each((element, index) => {
            cy.get(`.table-responsive > tbody > tr:nth-child(${index + 1}) td`).eq(2).invoke('text').then((email) => {
              if (email === user.email) {
                cy.get(`.table-responsive > tbody > tr:nth-child(${index + 1})`).invoke('attr', 'id').then((id) => {
                  UsersPage.searchResultEditButton(id).click()
                  cy.wait(500)
                
                  const updatedUser = generateUserHelper()
                  cy.wrap(updatedUser).as('updatedUser')

                  cy.get('@updatedUser').then((updatedUser) => {
                  AddUserPage.firstNameInput().type(updatedUser.firstName)
                  AddUserPage.submitButton().click()

                })
                  
                })
              }
            })  
        })
    })
})

Then('I will see confirmation the user account is updated', () => {
    cy.alertShouldContain('User account updated')
})

And('I can confirm the users first name is updated', () => {
    cy.get('@user').then((user) => {
    cy.get('@updatedUser').then((updatedUser) => {
        UsersPage.searchNameInput().type(updatedUser.firstName)
        UsersPage.submitButton().click()
        cy.wait('@getSearch').its('response.statusCode').should('eq', 200)

        UsersPage.searchResultsTable().each((element, index) => {
            cy.get(`.table-responsive > tbody > tr:nth-child(${index + 1}) td`).eq(2).invoke('text').then((email) => {
              if (email === user.email) {
                cy.get(`.table-responsive > tbody > tr:nth-child(${index + 1})`).invoke('attr', 'id').then((id) => {
                  //UsersPage.searchResultEditButton(id).click()
                  cy.wait(500)

                  cy.get(`.table-responsive > tbody > tr:nth-child(${index + 1}) > td`).contains(user.firstName + updatedUser.firstName)    
                                   
                })
              }
            })  
        })
    })
})
})