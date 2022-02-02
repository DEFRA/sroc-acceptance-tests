@wip
Feature: CFD (Water Quality) Legacy

  Background:
    Given I sign in as the admin user

  Scenario: Legacy test
    Then the user menu is visible
    And the main heading is 'Transactions to be billed'
    And the user menu says I am signed in as 'Admin User'
    And I select 'Water Quality' from the Regime menu
    And I select 'Transactions to be billed' from the Transactions menu
    And I log the number of transactions displayed
    # If the TCM had no transactions the legacy test would then skip approx 600 lines of testing!
    # We've assumed we'll always be running this against an environment that at least has our basic test data. We will
    # always attempt to run the following steps.
    And I log which region is selected in the search bar
    And I select All for financial year in the search bar
    And I select 50 for items per page in the paging info bar
    Then I click the column title 'File Reference' and it sorts the transactions in ascending order
    Then I click the column title 'File Reference' and it sorts the transactions in descending order
    Then I click the column title 'File Date' and it sorts the transactions in descending order
    Then I click the column title 'File Date' and it sorts the transactions in ascending order
    Then I click the column title 'Customer' and it sorts the transactions in ascending order
    Then I click the column title 'Customer' and it sorts the transactions in descending order
    Then I click the column title 'Consent' and it sorts the transactions in descending order
    Then I click the column title 'Consent' and it sorts the transactions in ascending order
    And I see the 'Ver' column is displayed
    And I see the 'Dis' column is displayed
    Then I click the column title '%' and it sorts the transactions in ascending order
    Then I click the column title '%' and it sorts the transactions in descending order
    Then I click the column title 'Period' and it sorts the transactions in descending order
    Then I click the column title 'Period' and it sorts the transactions in ascending order
    Then I click the column title 'Category' and it sorts the transactions in ascending order
    Then I click the column title 'Category' and it sorts the transactions in descending order
    Then I copy the consent reference from the first transaction
    And search transactions with it
    And all transactions displayed have the same consent reference
    Then I select a category for the first transaction
    And the transaction category will be set
    And the transaction charge will be set
    Then I open the transaction detail page for the first transaction
    And the main heading is 'Transaction detail'
    And the sub heading 'Suggested category' is visible
    Then I open the transaction history page
    And the main heading is 'Transaction change history'
    And the first event is Transaction imported from file
