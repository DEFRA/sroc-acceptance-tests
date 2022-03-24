import BasePage from './base_page'

class UsersPage extends BasePage {
  static confirm () {
    cy.get('h1').should('contain', 'Users')
    cy.url().should('include', '/users')
  }

  // Elements

  static addUserAccountButton () {
    return cy.get('button#new-user')
  }

  static searchNameInput () {
    return cy.get('input#search[type="search"]')
  }

  static searchResultEditButton (id) {
    return cy.get(`a.btn-success[href="/users/${id}/edit"]`)
  }

  static searchResultsTable () {
    return cy.get('table.table-responsive > tbody > tr')
  }
}

export default UsersPage
