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

And('I run the generate data job', () => {
  cy.runJob('data')
})
