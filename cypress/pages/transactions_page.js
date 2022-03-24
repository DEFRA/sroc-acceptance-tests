import BasePage from './base_page'

class TransactionsPage extends BasePage {
  static confirm () {
    cy.get('h1').should('contain', 'Transactions to be billed')
    // As transactions is the root path when authenticated we can't guarantee we'll have a url to assert against
  }

  static visit () {
    // Transactions is the root path. You just have to be authenticated
    // to see it
    cy.visit('/')
  }

  // Elements

  static searchInput () {
    return cy.get('#search')
  }

  static resultsTable () {
    return cy.get('.table')
  }

  static customerColumn () {
    return cy.get('.table > tbody > tr > td:nth-child(4)')
  }

  static transactionMenu () {
    return cy.get('#navbarTransactionsSelectorLink')
  }

  static adminMenu () {
    return cy.get('#navbarAdminSelectorLink')
  }

  static billingMenu () {
    return cy.get('#navbarAnnualBillingSelectorLink')
  }

  static regimeMenu () {
    return cy.get('#navbarRegimeSelectorLink')
  }

  static regimeMenuItem (regime) {
    let slug

    switch (regime) {
      case 'Water Quality':
        slug = 'cfd'
        break
      case 'Installations':
        slug = 'pas'
        break
      case 'Waste':
        slug = 'wml'
        break
    }

    return cy.get(`.nav-item.show > .dropdown-menu > [href="/regimes/${slug}/transactions"]`)
  }

  static downloadTransactionDataMenuItem () {
    return cy.get(':nth-child(1) > .nav-item > .dropdown-menu > [href="/regimes/pas/data_export"]')
  }

  static annualBillingDataMenuItem () {
    return cy.get('#navbarAnnualBillingSelectorLink')
  }

  static reviewAnnualBillingDataMenuItem () {
    return cy.get(':nth-child(1) > .dropdown > div > [href="/regimes/wml/annual_billing_data_files"]')
  }

  static regionDropDown () {
    return cy.get('#region')
  }
}

export default TransactionsPage
