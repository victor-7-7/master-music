// https://on.cypress.io/api
// https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test
describe('My First Test', () => {
  it('Visits the Kitchen Sink', () => {
    cy.visit('https://example.cypress.io')
  })

  it('clicks the link "type"', () => {
    cy.visit('https://example.cypress.io')
    cy.contains('type').click()
  })

  it('clicking "type" navigates to a new url', () => {
    cy.visit('https://example.cypress.io')
    cy.contains('type').click()
    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/commands/actions')
  })

  it('Gets, types and asserts', () => {
    cy.visit('https://example.cypress.io')
    cy.contains('type').click()
    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/commands/actions')
    // Get an input, type into it
    cy.get('.action-email').type('fake@email.com')
    //  Verify that the value has been updated
    cy.get('.action-email').should('have.value', 'fake@email.com')
  })
})

// https://docs.cypress.io/guides/end-to-end-testing/testing-your-app
// Когда я командую npm run test:e2e, выполняется скрипт
// "start-server-and-test preview http://localhost:4173 'cypress run --e2e'"
// без визуализации в браузере, вся процедура тестов проходит в терминале.
// Про стартовую утилиту - https://github.com/bahmutov/start-server-and-test
// Для визуализации тестов в браузере надо скомандовать npm run test:e2e:dev,
// чтобы выполнился скрипт "start-server-and-test 'vite dev --port 4173' http://localhost:4173 'cypress open --e2e'"

describe('Sanity Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('#header a:first-child', 'Music')
  })
})

