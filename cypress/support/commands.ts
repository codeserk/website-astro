/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      checkLinks(): Cypress.Chainable
      checkImages(): Cypress.Chainable
    }
  }
}

export {}

const LINKS_CHECKED: Record<string, true> = {}

Cypress.Commands.add('checkLinks', () => {
  cy.get('a').each((element) => {
    const link = element.prop('href')
    if (link?.includes('mailto') || link?.includes('linkedin.com')) {
      return
    }
    if (LINKS_CHECKED[link]) {
      return
    }

    Cypress.log({ message: `Checking link <a href="${element.prop('href')}">${element.html()}</a>` })

    cy.request({ url: link }).then((response) => {
      LINKS_CHECKED[link] = true
      Cypress.log({ name: link, message: response.status })
    })
  })
})

Cypress.Commands.add('checkImages', () => {
  cy.get('img').each((element) => {
    const alt = element.prop('alt')
    const link = element.prop('src')
    Cypress.log({ message: `Checking img <img src="${element.prop('src')}" alt="${alt}" />` })

    if (element.prop('naturalWidth') === 0) {
      // Check why this fails
      // throw new Error(`Invalid image <img src="${element.prop('src')}" alt="${alt}" />`)
    }
    if (element.prop('alt') === '') {
      throw new Error(`Invalid image <img src="${element.prop('src')}" alt="${alt}" /> - Alt is missing`)
    }

    if (LINKS_CHECKED[link]) {
      return
    }
    cy.request({ url: link }).then((response) => {
      LINKS_CHECKED[link] = true
      Cypress.log({ name: link, message: response.status })
    })
  })
})
