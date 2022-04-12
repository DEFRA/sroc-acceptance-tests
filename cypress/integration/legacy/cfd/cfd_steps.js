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
  cy.intercept('GET', '**/regimes/*/transactions?search=*').as('getSearch')

  // This request is made when a transaction is selected from the results
  cy.intercept('GET', '**/regimes/*/transactions/*').as('getTransaction')

  // This request is made from the transaction detail page to view its history
  cy.intercept('GET', '**/transactions/*/audit').as('getTransactionHistory')

  // This request is made when the 'Approve' button is clicked
  cy.intercept('PUT', '**/regimes/*/transactions/approve.json').as('putApproveTransactions')

  // This request is made just before displaying the generate transaction file summary modal
  cy.intercept('GET', '**/regimes/*/transaction_summary?**').as('getTransactionSummary')

  // This request is made in transaction file history after search criteria have been selected
  cy.intercept('GET', '**/regimes/*/transaction_files?search**').as('getTransactionFileHistory')

  // This request is made in transaction  history after changing the view option
  cy.intercept('GET', '**/regimes/*/retrospectives?*').as('getRetrospectivesSearch')

  // This request is made just before displaying the generate presroc transaction file summary modal
  cy.intercept('GET', '**/regimes/*/retrospective_summary?**').as('getRetrospectiveSummary')
})

Given('I sign in as the {word} user', (regime) => {
  SignInPage.visit()
  SignInPage.emailInput().type(Cypress.config().users[regime].email)
  SignInPage.passwordInput().type(Cypress.env('PASSWORD'))

  SignInPage.submitButton().click()
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

Then('the first record has file reference {string}', (fileReference) => {
  cy.get('.table-responsive > tbody > tr:first-child > td').eq(1).invoke('text').then((reference) => {
    expect(reference.trim()).to.equal(fileReference)
  })
})

And('I log the number of transactions displayed', () => {
  TransactionsPage.table.rows().then((rows) => {
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

  cy.wait('@getSearch').its('response.statusCode').should('eq', 200)

  cy.get('select#per_page').find(':selected').invoke('text').then((val) => {
    expect(val).to.equal(option)
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
  // This line is here to force Cypress to wait until the search is complete. Cypress should() has an inbuilt retry
  // mechanism. We know it takes a moment for the UI to update with the results and during that time it has the Search
  // button disable. We use this information to wait until the button is enabled before then grabbing all the table rows
  cy.get('input[value="Search"]').should('not.have.attr', 'disabled')
  cy.get('@searchValue').then((searchValue) => {
    cy.get('.table-responsive > tbody > tr').each((element) => {
      expect(element.children('td:nth-child(5)').text().trim()).to.equal(searchValue)
    })
  })
})

Then('I select a category for each transaction', () => {
  cy.get('.table-responsive > tbody > tr input.tcm-select-input').each((element, index) => {
    cy.get('.table-responsive > tbody > tr:nth-child(1) input.tcm-select-input').type('{downarrow}')
    cy.get('.table-responsive > tbody > tr:nth-child(1) input.tcm-select-input').type('{enter}')
    cy.wait('@getSearch')
    cy.wait(500)
  })

  cy.wait(500)
})

And('the transaction categories will be set', () => {
  cy.get('.table-responsive > tbody > tr').each((element, index) => {
    cy.get(`.table-responsive > tbody > tr:nth-child(${index + 1}) input.tcm-select-input`).should('not.exist')
    cy.get(`.table-responsive > tbody > tr:nth-child(${index + 1}) td`).eq(7).invoke('text').then((reference) => {
      expect(reference.trim()).not.to.be.undefined
    })
  })
})

And('the transaction charges will be set', () => {
  cy.get('.table-responsive > tbody > tr').each((element, index) => {
    cy.get(`.table-responsive > tbody > tr:nth-child(${index + 1}) td`).eq(12).should('not.contain.text', '(TBC)')
  })
})

Then('there are no transactions to be billed displayed anymore', () => {
  cy.get('.table-responsive > tbody > tr').should('not.exist')
})

And('approve the transactions for billing', () => {
  cy.get('button.approve-all-btn').click()

  cy.wait('@putApproveTransactions')
  cy.wait('@getSearch').its('response.statusCode').should('eq', 200)
  cy.wait(500)
})

And('generate the transaction file', () => {
  cy.get('button.generate-transaction-file-btn').click()

  cy.wait('@getTransactionSummary').its('response.statusCode').should('eq', 200)
  cy.wait('@getSearch').its('response.statusCode').should('eq', 200)

  // NOTE: Whilst handy to confirm the dialog has appeared this is actually here to force the tests to wait for the
  // dialog until it then tries to get() elements on it
  cy.get('#summary-dialog')
    .should('have.class', 'show')
    .should('have.attr', 'aria-modal')
  cy.get('#summary-dialog').should('not.have.attr', 'aria-hidden')

  cy.get('#summary-dialog h5.modal-title')
    .should('be.visible')
    .should('contain.text', 'Generate Transaction File')

  // TODO: Understand why we need this explicit wait() here. We've confirmed that the modal dialog is open
  // and visible and that we can access the controls. But without this wait() we find more often than not the
  // dialog is not dismissed when cancel is clicked which causes an error in the tests
  cy.wait(500)

  cy.get('#summary-dialog input#confirm').check()

  cy.get('#summary-dialog input.file-generate-btn')
    .should('be.enabled')
    .click()

  // cy.wait('@getSearch').its('response.statusCode').should('eq', 200)
})

Then('I see confirmation the transaction file is queued for export', () => {
  cy.get('div.alert-success.alert-dismissable')
    .should('contain.text', 'Successfully queued')
    .then(alert => {
      cy.wrap(getExportFilename(alert)).as('exportFilename')
    })
})

function getExportFilename (element) {
  return element
    // Get the element text
    .text()
    // Use regex match to extract the text between "transaction file " and " for export"
    // ?<= and ?= stop the matcher from returning those strings, so we just get the filename
    // This results in an array with a single item, so we return that using [0]
    .match(/(?<=transaction file )(.*)(?= for export)/g)[0]
}

And('I log the transaction filename to prove it can be used in another step', () => {
  cy.get('@exportFilename')
    .then(filename => cy.log(filename))
})

And('I set retrospectives region to {word}', (option) => {
  cy.get('select#region').select(option)

  cy.wait('@getRetrospectivesSearch').its('response.statusCode').should('eq', 200)
})

And('I grab the first record and confirm its period is pre-April 2018', () => {
  cy.get('.table-responsive > tbody > tr:first-child td').eq(8).invoke('text').then((text) => {
    const endPeriod = text.trim().slice(11)
    const parts = endPeriod.split('/')
    const year = parseInt(parts[2])
    cy.log(`Extracted period end year is ${year}`)

    expect(year).to.be.at.most(18)
  })
})

Then('I generate the pre-sroc transaction file', () => {
  cy.get('button.generate-transaction-file-btn').click()

  cy.wait('@getRetrospectiveSummary').its('response.statusCode').should('eq', 200)

  // NOTE: Whilst handy to confirm the dialog has appeared this is actually here to force the tests to wait for the
  // dialog until it then tries to get() elements on it
  cy.get('#summary-dialog')
    .should('have.class', 'show')
    .should('have.attr', 'aria-modal')
  cy.get('#summary-dialog').should('not.have.attr', 'aria-hidden')

  cy.get('#summary-dialog h5.modal-title')
    .should('be.visible')
    .should('contain.text', 'Generate Pre-SRoC File')

  // TODO: Understand why we need this explicit wait() here. We've confirmed that the modal dialog is open
  // and visible and that we can access the controls. But without this wait() we find more often than not the
  // dialog is not dismissed when cancel is clicked which causes an error in the tests
  cy.wait(500)

  cy.get('#summary-dialog input#confirm').check()

  cy.get('#summary-dialog input.file-generate-btn')
    .should('be.enabled')
    .click()

  cy.wait('@getRetrospectivesSearch').its('response.statusCode').should('eq', 200)
})
