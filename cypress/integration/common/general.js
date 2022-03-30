import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

import { fixturePickerHelper } from '../../support/helpers'

Then('I see {string} in the main heading', (title) => {
  cy.get('h1').contains(title)
})

Given('I am starting with known {word} data', (regimeSlug) => {
  cy.cleanDb()

  const fixtureFilename = fixturePickerHelper(regimeSlug)

  cy.fixture(fixtureFilename)
    .then(Body => {
      cy.task('s3Upload', {
        Body,
        Bucket: Cypress.env('S3_BUCKET'),
        remotePath: Cypress.env('S3_UPLOAD_PATH'),
        fixtureFilename
      })
    })
    .then(fullPath => {
      cy.log(`${fullPath} uploaded`)
    })
  cy.runJob('import')
})
