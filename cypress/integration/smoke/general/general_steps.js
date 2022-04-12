import { And, Then } from 'cypress-cucumber-preprocessor/steps'

import MainMenu from '../../../pages/menus/main_menu'

import ExcludedTransactionsPage from '../../../pages/excluded_transactions_page'
import ExportDataPage from '../../../pages/export_data_page'
import ImportedTransactionFilesPage from '../../../pages/imported_transaction_files_page'
import RetrospectiveTransactionsPage from '../../../pages/retrospective_transactions_page'
import TransactionFileHistoryPage from '../../../pages/transaction_file_history_page'
import TransactionsPage from '../../../pages/transactions_page'
import TransactionHistoryPage from '../../../pages/transaction_history_page'

And('I select {string} from the Transactions menu', (optionText) => {
  cy.get('@regime').then((regime) => {
    MainMenu.transactions.getOption(optionText, regime.slug).click()
  })
})

Then('I see the Transactions to be billed page', () => {
  TransactionsPage.confirm()
})

Then('I see the Transaction History page', () => {
  TransactionHistoryPage.confirm()
})

Then('I see the Pre-April 2018 Transactions to be billed page', () => {
  RetrospectiveTransactionsPage.confirm()
})

Then('I see the Excluded Transactions page', () => {
  ExcludedTransactionsPage.confirm()
})

Then('I see the Imported Transaction Files page', () => {
  ImportedTransactionFilesPage.confirm()
})

Then('I see the Transaction File History page', () => {
  TransactionFileHistoryPage.confirm()
})

Then('I see the Download Transaction Data page', () => {
  ExportDataPage.confirm()
})
