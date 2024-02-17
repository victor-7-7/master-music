it("sanity test", () => {
  expect(true).toBe(true)
})

import About from '@/views/About.vue'
import { shallowMount } from '@vue/test-utils'
describe("About.vue", () => {
  it("renders inner text", () => {
    // shallowMount() в отличии от mount() ограничивает число уровней
    // вложения дочерних компонентов, которые может иметь компонент -
    // только дочки первого уровня
    const wrapper = shallowMount(About)
    // ---------------
    // Альтернативный способ записи одно-уровневой загрузки
    // const wrapper = mount(About, { shallow: true })
    // ---------------
    expect(wrapper.text()).toContain('This is an About Page')
  })
})

