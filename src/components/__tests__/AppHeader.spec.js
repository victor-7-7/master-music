

it("sanity test", () => {
  expect(true).toBe(true)
})

import { describe, it, expect,  } from 'vitest'
import { mount } from '@vue/test-utils'
// https://test-utils.vuejs.org/guide/advanced/vue-router.html
import { routes } from '@/router'
import { createRouter, createWebHistory } from 'vue-router'
// https://pinia.vuejs.org/cookbook/testing.html
import { createTestingPinia } from '@pinia/testing'
// https://vue-i18n.intlify.dev/guide/
import i18n from '@/includes/i18n'

import AppHeader from '@/components/AppHeader.vue'

// https://test-utils.vuejs.org/migration/
// https://testdriven.io/blog/vue-unit-testing/

describe('AppHeader', () => {

  it('renders properly', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: routes,
    })
    // Но можно и замокать реальный роутер...
    // https://test-utils.vuejs.org/guide/advanced/vue-router.html#Using-a-Mocked-Router

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createTestingPinia(), router, i18n],
      },
    })

    expect(wrapper.text()).toContain('Music')
  })
})
