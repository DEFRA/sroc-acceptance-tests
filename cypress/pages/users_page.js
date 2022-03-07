class UsersPage {
  static mainHeading () {
    return cy.get('h1')
  }

  static addUserAccount () {
    return cy.get('button#new-user')
  }
}

export default UsersPage
