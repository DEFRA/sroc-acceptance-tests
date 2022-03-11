Feature: Expired Tokens

  Scenario: Expired invite email
    Given I am a new user
    When a new account is created for me
    But I miss the first invitation email
    And request another invitation email
    Then the TCM will confirm the user has been reinvited
    And I try to accept the first invitation
    Then the TCM will confuse me and not be helpful
