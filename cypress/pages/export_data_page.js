import BasePage from './base_page'

class ExportDataPage extends BasePage {
  static confirm () {
    cy.get('h1').should('contain', 'Download Transaction Data')
    cy.url().should('include', '/data_export')
  }

  // Elements

  static dataProtectionNotice () {
    return cy.get('h5')
  }

  static downloadButton () {
    return cy.get('.btn.btn-primary')
  }
}

export default ExportDataPage
