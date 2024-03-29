import AdminMenu from './admin_menu'
import AnnualBillingMenu from './annual_billing_menu'
import RegimeMenu from './regime_menu'
import TransactionsMenu from './transactions_menu'
import UserMenu from './user_menu'

class MainMenu {
  static get admin () {
    return AdminMenu
  }

  static get annualBilling () {
    return AnnualBillingMenu
  }

  static get regime () {
    return RegimeMenu
  }

  static get transactions () {
    return TransactionsMenu
  }

  static get user () {
    return UserMenu
  }
}

export default MainMenu
