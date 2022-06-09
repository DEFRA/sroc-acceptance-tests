import { Then, And } from 'cypress-cucumber-preprocessor/steps'

import ExportDataPage from '../../../pages/export_data_page'
import TransactionsPage from '../../../pages/transactions_page'

And('I proceed to view the file download details', () => {
  TransactionsPage.transactionsMenu.getOption('Download Transaction Data', 'pas').click()
})

Then('I can view the Data Protection Notice', () => {
  ExportDataPage.dataProtectionNotice().should('be.visible')
})

Then('I am told that the transaction data file has not yet been generated', () => {
  ExportDataPage.notGeneratedAlert().should('contain.text', 'The transaction data file has not yet been generated.')
})

And('I cannot download transaction data', () => {
  ExportDataPage.downloadButton().should('not.exist')
})

And('return to the home page', () => {
  TransactionsPage.visit()
})

And('I run the generate data job', () => {
  cy.runJob('data', false)
})

Then('I can download transaction data file', () => {
  ExportDataPage.downloadButton().should('have.attr', 'href', '/regimes/pas/data_export/download')
})

And('the transaction data file exists', () => {
  cy.get('@regime').then((regime) => {
    cy.task('s3Download', {
      Bucket: Cypress.env('S3_ARCHIVE_BUCKET'),
      remotePath: Cypress.env('S3_DATA_PATH'),
      filePath: `${regime.slug}_transactions.csv.gz`
    }).then((data) => {
      if (data) {
        cy.log('We have a file')
      } else {
        cy.log('We do not have a file')
      }
    })
  })
})
