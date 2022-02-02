// We disable this rule to prevent chai matchers like `to.be.empty` causing linting errors:
/* eslint-disable no-unused-expressions */

import { Given, Then, And, Before } from 'cypress-cucumber-preprocessor/steps'
import MainMenu from '../../../pages/menus/main_menu'
import SignInPage from '../../../pages/sign_in_page'
import TransactionsPage from '../../../pages/transactions_page'

Before(() => {
  // When certain drop downs are selected the TCM will do a background refresh of the UI using XHR requests.
  // The impact on testing is that there are times having selected an option we need to wait for that background request
  // to complete before we then try and get() or assert anything in the UI. If we don't we may get old data or hit
  // inexplicable Cypress errors.
  //
  // The legacy tests handled this by scattering wait() calls all over the place. However, most testing frameworks
  // consider this an anti-pattern https://docs.cypress.io/guides/references/best-practices#Unnecessary-Waiting. The
  // solution in Cypress is to intercept requests, register an alias for them and then when needed wait() on a
  // registered alias (XHR request) to complete. We do the intercept part in a before() hook as there are a number of
  // steps that depend on selecting dropdowns in the UI
  cy.intercept('GET', '**?search=*').as('getSearch')

  // This request is made when a transaction is selected from the results
  cy.intercept('GET', '**/regimes/*/transactions/*').as('getTransaction')

  // This request is made from the transaction detail page to view its history
  cy.intercept('GET', '**/transactions/*/audit').as('getTransactionHistory')
})

Given('I sign in as the {word} user', (regime) => {
  SignInPage.visit()
  SignInPage.email().type(Cypress.config().users[regime].email)
  SignInPage.password().type(Cypress.env('PASSWORD'))

  SignInPage.logIn().click()
})

Then('the user menu is visible', () => {
  MainMenu.user.menuLink().should('be.visible')
})

And('the main heading is {string}', (heading) => {
  cy.get('h1').should('contain', heading)
})

And('the user menu says I am signed in as {string}', (username) => {
  MainMenu.user.menuLink().should('contain', username)
})

And('I select {string} from the Regime menu', (optionText) => {
  MainMenu.regime.getOption(optionText).click()
})

And('I select {string} from the Transactions menu', (optionText) => {
  MainMenu.transactions.getOption(optionText, 'cfd').click()
})

And('I log the number of transactions displayed', () => {
  TransactionsPage.resultsTable().find('tbody').find('tr').then((rows) => {
    cy.log(`Number of transactions listed is ${rows.length}`)
  })
})

And('I log which region is selected in the search bar', () => {
  cy.get('select#region').find(':selected').invoke('text').then((text) => {
    cy.log(`Region selected for search is ${text}`)
  })
})

And('I select {word} for financial year in the search bar', (option) => {
  cy.get('select#fy').select(option)

  cy.wait('@getSearch').its('response.statusCode').should('eq', 200)

  cy.get('select#fy').find(':selected').invoke('text').then((val) => {
    expect(val).to.equal(option)
  })
})

And('I select {word} for items per page in the paging info bar', (option) => {
  cy.get('select#per_page').select(option)

  cy.wait('@getSearch')

  cy.get('select#per_page').find(':selected').invoke('text').then((val) => {
    expect(val).to.equal(option)
  })
})

Then('I click the column title {string} and it sorts the transactions in {word} order', (sort, sortOrder) => {
  const sorts = {
    'File Reference': 'file_reference',
    'File Date': 'file_date',
    Customer: 'customer_reference',
    Consent: 'consent_reference',
    Category: 'sroc_category',
    '%': 'variation',
    Period: 'period'
  }

  const sortOrders = {
    ascending: 'oi-caret-top',
    descending: 'oi-caret-bottom'
  }

  cy.get(`th > [data-column="${sorts[sort]}"]`).click()

  cy.wait('@getSearch').its('response.statusCode').should('eq', 200)

  cy.get(`th > [data-column="${sorts[sort]}"]`).then((element) => {
    expect(element).to.have.class('sorted')
    expect(element.find('span.oi')).to.have.class(sortOrders[sortOrder])
  })
})

Then('I see the {string} column is displayed', (columnName) => {
  cy.get('span[aria-hidden="true"]').contains(columnName).then((element) => {
    expect(element).to.be.visible
  })
})

Then('I copy the consent reference from the first transaction', () => {
  cy.get('.table-responsive > tbody > tr:first-child > td').eq(4).invoke('text').then((reference) => {
    cy.wrap(reference.trim()).as('searchValue')
  })
})

And('search transactions with it', () => {
  cy.get('@searchValue').then((searchValue) => {
    cy.get('#search').type(searchValue)
    cy.get('input[value="Search"]').click()

    cy.wait('@getSearch').its('response.statusCode').should('eq', 200)
  })
})

And('all transactions displayed have the same consent reference', () => {
  cy.get('@searchValue').then((searchValue) => {
    cy.get('.table-responsive > tbody > tr').each((element) => {
      expect(element.children('td:nth-child(5)').text().trim()).to.equal(searchValue)
    })
  })
})

Then('I select a category for the first transaction', () => {
  cy.get('.table-responsive > tbody > tr:first-child input.tcm-select-input').type('{downarrow}')
  cy.get('.table-responsive > tbody > tr:first-child input.tcm-select-input').type('{enter}')

  cy.wait('@getSearch').its('response.statusCode').should('eq', 200)
})

And('the transaction category will be set', () => {
  cy.get('.table-responsive > tbody > tr:first-child input.tcm-select-input').should('not.exist')
  cy.get('.table-responsive > tbody > tr:first-child > td').eq(7).invoke('text').then((reference) => {
    expect(reference.trim()).not.to.be.undefined
  })
})

And('the transaction charge will be set', () => {
  cy.get('.table-responsive > tbody > tr:first-child > td').eq(12).invoke('text').then((reference) => {
    expect(reference.trim()).not.to.contain('(TBC)')
  })
})

Then('I open the transaction detail page for the first transaction', () => {
  cy.get('tbody > tr:first-child button.show-details-button').click()

  cy.wait('@getTransaction').its('response.statusCode').should('eq', 200)
})

And('the sub heading {string} is visible', (heading) => {
  cy.get('h2')
    .should('contain', heading)
    .should('be.visible')
})

Then('I open the transaction history page', () => {
  cy.get('a.btn-outline-info').click()

  cy.wait('@getTransactionHistory')
})

And('the first event is Transaction imported from file', () => {
  cy.get('tbody > tr:first-child > td:first-child').should('contain.text', 'Transaction imported from file')
})

Then('the {word} element is visible', (selector) => {
  cy.get(selector).should('be.visible')
})

And('the {word} element contains {string}', (selector, text) => {
  cy.get(selector).should('contain', text)
})

And('I click the element {string}', (selector) => {
  cy.get(selector).click()
})
