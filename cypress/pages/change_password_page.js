class ChangePasswordPage {
  static mainHeading () {
    return cy.get('h1')
  }

  static password () {
    return cy.get('input#user_password')
  }

  static passwordConfirmation () {
    return cy.get('input#user_password_confirmation')
  }

  static changeMyPassword () {
    return cy.get('input[name="commit"]')
  }
}

export default ChangePasswordPage
