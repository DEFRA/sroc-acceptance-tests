import { Given } from 'cypress-cucumber-preprocessor/steps'
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

Given('I import the file {string}', (filename) => {
  cy.fixture(filename)
    .then(Body => {
      cy.task('s3Upload', {
        Body,
        Bucket: Cypress.env('S3_BUCKET'),
        remotePath: Cypress.env('S3_PATH'),
        filename
      })
    })
    .then(fullPath => {
      cy.log(`${fullPath} uploaded`)
    })
})
