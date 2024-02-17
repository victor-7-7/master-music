import { createI18n } from 'vue-i18n'
import en from "@/locales/en.json"
import ru from "@/locales/ru.json"

// https://vue-i18n.intlify.dev/guide/
// https://vue-i18n.intlify.dev/guide/essentials/syntax.html
// https://vue-i18n.intlify.dev/guide/migration/breaking

export default createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en, ru,
  },
  // https://vue-i18n.intlify.dev/guide/essentials/number.html
  numberFormats: {
    en: {
      currency: {
        // may be also decimal, time, percent etc...
        style: "currency", currency: "USD"

      },
    },
    ru: {
      currency: {
        style: "currency", currency: "RUB"

      },
    },
  }
})
