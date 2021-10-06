import { Given } from 'cypress-cucumber-preprocessor/steps'
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

Given('I import the file {string}', (filename) => {
  cy.fixture(filename).then(Body => {
    cy.task('s3Upload', {
      Body,
      Bucket: Cypress.env('S3_BUCKET'),
      Key: Cypress.env('S3_KEY'),
      filename
    }).then(fullPath => {
      cy.log(`${fullPath} uploaded`)
    })
  })
})
