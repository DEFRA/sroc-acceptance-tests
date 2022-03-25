import { When, Then, And } from 'cypress-cucumber-preprocessor/steps'
import AnnualBillingPage from '../../pages/annual_billing_page'
import AnnualBillingFileDetailsPage from '../../pages/annual_billing_file_details_page'
import TransactionsPage from '../../pages/transactions_page'

When('I select the {string} regime', (regime) => {
  TransactionsPage.regimeMenu().click()
  TransactionsPage.regimeMenuItem(regime).click()
})

And('I proceed to review Annual Billing details', () => {
  TransactionsPage.annualBillingDataMenuItem().click()
  TransactionsPage.reviewAnnualBillingDataMenuItem().click()
  AnnualBillingPage.mainHeading().should('be.visible')
})

Then('I can view a list of Annual Billing Data Files', () => {
  AnnualBillingPage.dataFilesTable().should('be.visible')
})

And('I select an Annual Billing File to review', () => {
  AnnualBillingPage.fileNameLink().click()
  AnnualBillingFileDetailsPage.confirm()
})

Then('I can view the details of the selected Annual Billing File', () => {
  AnnualBillingFileDetailsPage.fileDetailsPanel().should('be.visible')
  AnnualBillingFileDetailsPage.errorsHeading().should('be.visible')
})

And('I can navigate back to Review Annual Billing', () => {
  AnnualBillingFileDetailsPage.backButton().click()
  AnnualBillingPage.mainHeading().should('be.visible')
})
