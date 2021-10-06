Feature: Import

  Scenario: Import file
    Given I import the file 'cfdti.dat.csv'
    Then I see 'Sign in' in the main heading
