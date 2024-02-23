//Здесь линтовые ошибки можно игнорить, они не влияют на работу приложения
const { defineConfig } = require('cypress')

// https://docs.cypress.io/guides/guides/launching-browsers#Customize-available-browsers
// Можно указать какой браузер использовать


module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
  }
})
