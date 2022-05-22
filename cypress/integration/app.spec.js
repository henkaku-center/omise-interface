describe('Navigation', () => {
  before(() => {
    // cy.setupMetamask()
  })
  it('should navigate to the mint page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')

    // The new page should contain an h1 with "About page"
    cy.get('h2').contains('Mint your Kamon')
  })
})
