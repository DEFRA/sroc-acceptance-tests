import { Then, When } from 'cypress-cucumber-preprocessor/steps'

import TransactionsPage from '../../../pages/transactions_page'
import PermitCategoriesPage from '../../../pages/permit_categories_page'
import AddPermitCategoryPage from '../../../pages/add_permit_category_page'

When('I attempt to create a permit category with an invalid code', () => {
  TransactionsPage.adminMenu.getOption('Permit Categories', 'pas').click()

  PermitCategoriesPage.addNewPermitCategoryButton().click()

  AddPermitCategoryPage.codeInput().type('QWERTY', { log: false })
  AddPermitCategoryPage.descriptionInput().type('Test Description', { log: false })
  AddPermitCategoryPage.submitButton().click()
})

Then('I am told the code must be in dotted numeric format', () => {
  cy.alertShouldContain('Code Code must be in dotted numeric format, with 1 to 3 segments between 1 and 4 digits long. e.g. 6, 1.2, 9.34.1, 27.111.1234')
})
