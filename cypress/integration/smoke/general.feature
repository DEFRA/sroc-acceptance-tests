Feature: Smoke test

  Background:
    Given I sign in as the 'admin' user

  Scenario: Page checks (CFD)
    When I select the 'Water Quality' regime
    Then I see the Transactions to be billed page
    And I select 'Transactions to be billed' from the Transactions menu
    Then I see the Transactions to be billed page
    And I select 'Transaction History' from the Transactions menu
    Then I see the Transaction History page
    And I select 'Pre-April 2018 Transactions to be billed' from the Transactions menu
    Then I see the Pre-April 2018 Transactions to be billed page
    And I select 'Excluded Transactions' from the Transactions menu
    Then I see the Excluded Transactions page
    And I select 'Imported Transaction Files' from the Transactions menu
    Then I see the Imported Transaction Files page
    And I select 'Transaction File History' from the Transactions menu
    Then I see the Transaction File History page
    And I select 'Download Transaction Data' from the Transactions menu
    Then I see the Download Transaction Data page

  Scenario: Page checks (PAS)
    When I select the 'Installations' regime
    Then I see the Transactions to be billed page
    And I select 'Transactions to be billed' from the Transactions menu
    Then I see the Transactions to be billed page
    And I select 'Transaction History' from the Transactions menu
    Then I see the Transaction History page
    And I select 'Pre-April 2018 Transactions to be billed' from the Transactions menu
    Then I see the Pre-April 2018 Transactions to be billed page
    And I select 'Excluded Transactions' from the Transactions menu
    Then I see the Excluded Transactions page
    And I select 'Imported Transaction Files' from the Transactions menu
    Then I see the Imported Transaction Files page
    And I select 'Transaction File History' from the Transactions menu
    Then I see the Transaction File History page
    And I select 'Download Transaction Data' from the Transactions menu
    Then I see the Download Transaction Data page

  Scenario: Page checks (WML)
    When I select the 'Waste' regime
    Then I see the Transactions to be billed page
    And I select 'Transactions to be billed' from the Transactions menu
    Then I see the Transactions to be billed page
    And I select 'Transaction History' from the Transactions menu
    Then I see the Transaction History page
    And I select 'Excluded Transactions' from the Transactions menu
    Then I see the Excluded Transactions page
    And I select 'Imported Transaction Files' from the Transactions menu
    Then I see the Imported Transaction Files page
    And I select 'Transaction File History' from the Transactions menu
    Then I see the Transaction File History page
    And I select 'Download Transaction Data' from the Transactions menu
    Then I see the Download Transaction Data page
