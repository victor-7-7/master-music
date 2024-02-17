/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  // Применяем правила из трех конфигурационных файлов
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    // Чтобы избежать конфликта правил ESLint с правилами Prettier
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  // Для некоторых типов файлов применяем специальные правила
  overrides: [
    {
      files: [
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'
      ],
      extends: [
        'plugin:cypress/recommended'
      ],
    },
    // Section 20, video 004, time 04:40
    {
      files: [
        "src/components/__tests__/**.spec.js"
      ],
      // Свойства объекта globals будут доступны как переменные
      // окружения в тестовых файлах
      globals: {
        // Этой переменной окружения (как и последующим) кодер не может
        // задать новое значение
        test: "readonly",
        describe: "readonly",
        expect: "readonly",
        vi: "readonly",
        beforeEach: "readonly",
        it: "readonly",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  env: {
    // Чтобы ESLint не ругался на слово module в конфигурационных файлах корня проекта
    node: true,
  },
  rules: {
    // Если захотим давать однословные имена компонентам
    // 'vue/multi-word-component-names': 'off',
  },
}
