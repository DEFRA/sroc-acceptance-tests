import BaseAppPage from './base_app_page'

class EditUserPage extends BaseAppPage {
  static confirm () {
    cy.get('h1').should('contain', 'Edit User Account')
    cy.url().should('include', '/edit')
  }

  // elements

  static cancelButton () {
    return cy.get('a.btn-secondary')
  }

  static enabledCheckbox () {
    return cy.get('input#user_enabled')
  }

  static firstNameInput () {
    return cy.get('input#user_first_name')
  }

  static lastNameInput () {
    return cy.get('input#user_last_name')
  }

  static regimeAccessCheckbox (option) {
    const options = {
      Installations: 'input#user_regime_users_attributes_0_enabled',
      Waste: 'input#user_regime_users_attributes_1_enabled',
      'Water Quality': 'input#user_regime_users_attributes_2_enabled'
    }

    return cy.get(options[option])
  }

  static resendInviteButton () {
    return cy.get('a.btn-warning')
  }

  static roleRadioButton (option) {
    const options = {
      'Read-only User': 'input#role_read_only',
      'Read-only + Export': 'input#role_read_only_export',
      'Billing Admin': 'role_billing',
      'System Admin': 'role_admin'
    }

    return cy.get(options[option])
  }
}

export default EditUserPage
