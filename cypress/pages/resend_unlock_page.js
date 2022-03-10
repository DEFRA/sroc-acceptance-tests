class ResendUnlockPage {
  static email () {
    return cy.get('#user_email')
  }

  static resendUnlockInstructions () {
    return cy.get('[name=commit]')
  }
}

export default ResendUnlockPage
