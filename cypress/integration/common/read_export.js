import { Given } from 'cypress-cucumber-preprocessor/steps'

Given('I read the export file {string}', (filePath) => {
  cy.task('s3Download', {
    Bucket: Cypress.env('S3_BUCKET'),
    remotePath: Cypress.env('S3_DOWNLOAD_PATH'),
    filePath
  }).then(data => {
    cy.log(data)
  })
})
