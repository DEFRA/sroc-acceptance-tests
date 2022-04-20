Feature: CFD (Water Quality) Legacy

  Background:
    Given I am starting with known cfd data
    And I sign in as the 'admin' user

  Scenario: Legacy test
    Then the user menu is visible
    And the main heading is 'Transactions to be billed'
    And the user menu says I am signed in as 'Admin User'
    And I select the 'Water Quality' regime
    And I select 'Imported Transaction Files' from the Transactions menu
    And the main heading is 'Imported Transaction Files'
    And the first record has file reference 'CFDAI00394'
    And I select 'Transactions to be billed' from the Transactions menu
    And the main heading is 'Transactions to be billed'
    Then I copy the Customer and Consent references from the first transaction
    And search transactions with it
    And all transactions displayed have the same consent reference
    Then I select a category for each transaction
    And the transaction categories will be set
    And the transaction charges will be set
    And approve the transactions for billing
    And generate the transaction file
    Then I see confirmation the transaction file is queued for export
    And there are no transactions to be billed displayed anymore
    When the transaction file is exported
    Then I can see it contains the transactions we billed
    # We need this step because of sticky search values
    # See https://eaflood.atlassian.net/browse/CMEA-306
    Then I clear the search field and search again because of CMEA-306
    And I select 'Pre-April 2018 Transactions to be billed' from the Transactions menu
    And the main heading is 'Pre-April 2018 Transactions to be billed'
    And I grab the first record and confirm its period is pre-April 2018
    Then I generate the pre-sroc transaction file
    Then I see confirmation the transaction file is queued for export
