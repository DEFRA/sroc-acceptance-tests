Feature: WML (Installations) Legacy

  Background:
    Given I sign in as the admin user

  Scenario: Legacy test
    Then the user menu is visible
    And the main heading is 'Transactions to be billed'
    And the user menu says I am signed in as 'Admin User'
    And I select 'Waste' from the Regime menu
    And I select 'Imported Transaction Files' from the Transactions menu
    And the main heading is 'Imported Transaction Files'
    And the first record has file reference 'WMLAI00394'
    And I select 'Transactions to be billed' from the Transactions menu
    And the main heading is 'Transactions to be billed'
    And I log the number of transactions displayed
    # If the TCM had no transactions the legacy test would then skip approx 600 lines of testing!
    # We've assumed we'll always be running this against an environment that at least has our basic test data. We will
    # always attempt to run the following steps.
    And I log which region is selected in the search bar
    # In CFD and PAS the legacy test selects All from the financial year drop down. In WML the code is commented out.
    # This is most likely because when manually viewing the page 'All' is not an option
    And I select 50 for items per page in the paging info bar
    Then I click the column title 'File Reference' and it sorts the transactions in ascending order
    Then I click the column title 'File Reference' and it sorts the transactions in descending order
    Then I click the column title 'File Date' and it sorts the transactions in descending order
    Then I click the column title 'File Date' and it sorts the transactions in ascending order
    Then I click the column title 'Customer' and it sorts the transactions in ascending order
    Then I click the column title 'Customer' and it sorts the transactions in descending order
    Then I click the column title 'Permit' and it sorts the transactions in descending order
    Then I click the column title 'Permit' and it sorts the transactions in ascending order
    Then I click the column title 'Band' and it sorts the transactions in ascending order
    Then I click the column title 'Band' and it sorts the transactions in descending order
    Then I click the column title 'Period' and it sorts the transactions in descending order
    Then I click the column title 'Period' and it sorts the transactions in ascending order
    Then I click the column title 'Category' and it sorts the transactions in ascending order
    Then I click the column title 'Category' and it sorts the transactions in descending order
    Then I set the temporary cessation flag for the first transaction
    Then I open the transaction detail page for the first transaction
    And the main heading is 'Transaction detail'
    And the sub heading 'Suggested category' is visible
    And the sub heading 'Related unbilled transactions' is visible
    Then I open the transaction history page
    And the main heading is 'Transaction change history'
    And the first event is Transaction imported from file
    Then I go back using the link
    And exclude the transaction
    And reinstate the transaction
    Then I go back using the link
    Then I go back using the link
    Then I go back using the link
    Then I click the export button and check the export modal displays
    Then I copy the consent reference from the first transaction
    And search transactions with it
    And all transactions displayed have the same consent reference
    And all transactions displayed have the same consent reference
    Then I select a category for each transaction
    And the transaction categories will be set
    And the transaction charges will be set
    And approve the transactions for billing
    And generate the transaction file
    Then I see confirmation the transaction file is queued for export
    And there are no transactions to be billed displayed anymore
    And I select 'Transaction File History' from the Transactions menu
    And the main heading is 'Transaction File History'
    And I set region to A
    And I select 'Excluded Transactions' from the Transactions menu
    And the main heading is 'Excluded Transactions'
    Then I click the export button and check the export modal displays
    And I select 'Transaction History' from the Transactions menu
    And the main heading is 'Transaction History'
    Then I click the export button and check the export modal displays
    And I select 'Download Transaction Data' from the Transactions menu
    And the main heading is 'Download Transaction Data'
    And I confirm the data protection notice is displayed