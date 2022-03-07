Feature: Email

  Scenario: New account email
    Given I am a new user
    When a new account is created for me
    And I accept the invitation
    Then I will be signed in with my new account
