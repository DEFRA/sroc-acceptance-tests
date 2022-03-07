Feature: Email

  Scenario: New account email
    Given I am a new user
    When a new account is created for me
    And I accept the invitation
    Then I will be signed in with my new account

  Scenario: Forgot password email
    Given I am an existing user
    And I have forgotten my password
    When I follow the link to reset my password
    Then I will be signed in with my new account
