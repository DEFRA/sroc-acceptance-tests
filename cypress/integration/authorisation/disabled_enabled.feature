Feature: Disabled and enabled users

  As the business responsible for the system
  I need to ensure
  That only enabled users can access the TCM

  Scenario: Disabling a user
    Given my account has been disabled
    When I sign in as the 'readonly' user
    Then the TCM refuses me access
