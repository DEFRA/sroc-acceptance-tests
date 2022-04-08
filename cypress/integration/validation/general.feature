Feature: Validation

    Background: Authenticate
        Given I sign in as the 'admin' user

    Scenario: Error message is correct
         When I attempt to create a permit category with an invalid code
         Then I am told the code must be in dotted numeric format
