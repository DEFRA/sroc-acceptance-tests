import { Given } from 'cypress-cucumber-preprocessor/steps'
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

Given('I import the file {string}', (filename) => {
  const accessKeyId = Cypress.env('ACCESS_KEY_ID')
  const secretAccessKey = Cypress.env('SECRET_ACCESS_KEY')
  const region = Cypress.env('AWS_REGION')
  const Bucket = Cypress.env('S3_BUCKET')
  const Key = Cypress.env('S3_KEY')

  cy.fixture(filename).then(Body => {
    cy.task('s3Upload', { Body, Bucket, Key, filename, accessKeyId, secretAccessKey, region }).then(fullPath => {
      cy.log(`${fullPath} uploaded`)
    })
  })
})
