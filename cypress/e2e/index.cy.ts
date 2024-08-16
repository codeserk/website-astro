const PRODUCTION_BASE_URL = 'https://www.codeserk.es'
const LOCAL_BASE_URL = 'http://localhost:4321'

describe('general tests', () => {
  it('checks all titles are correct in the home', () => {
    const page = cy.visit('http://localhost:4321')

    page.get('h1').should('contain.text', 'José Cámara')
    page.get('h1').should('contain.text', '@codeserk')

    page.get('h2').should('contain.text', 'About Me')
    page.get('h2').should('contain.text', 'Languages')
    page.get('h2').should('contain.text', 'Last challenges')
    page.get('h2').should('contain.text', 'Career')
    page.get('h2').should('contain.text', 'Projects')
    page.get('div').should('contain.text', 'Thanks for visiting my portfolio')
  })

  it('checks all pages in sitemap.xml are correct', () => {
    cy.request({ url: 'http://localhost:4321/sitemap-0.xml' }).then((response) => {
      const xml: string = response.body
      const urls = xml
        .split(/<loc>([^<]+)<\/loc>/g)
        .filter((it) => it.includes('https'))
        .map((it) => it.replace(PRODUCTION_BASE_URL, LOCAL_BASE_URL))

      expect(urls).to.have.length.greaterThan(0)

      for (const url of urls) {
        cy.visit(url)
        cy.checkImages()
        cy.checkLinks()
      }
    })
  })
})
