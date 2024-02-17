
it("sanity test", () => {
  expect(true).toBe(true)
})

import { mount } from '@vue/test-utils'
// https://test-utils.vuejs.org/guide/advanced/vue-router.html
import { routes } from '@/router'
import { createRouter, createWebHistory } from 'vue-router'

import SongItem from '@/components/SongItem.vue'


describe("SongItem.vue", () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: routes,
  })
  // Но можно и замокать реальный роутер...
  // https://test-utils.vuejs.org/guide/advanced/vue-router.html#Using-a-Mocked-Router

  const song = {
    docId: "abc",
    user_display_name: "test_name",
  }


  it("renders song.user_display_name", () => {
    // wrapper в тесте представляет собой урезанный компонент SongItem
    const wrapper = mount(SongItem, {
      props: { song, },
      global: {
        plugins: [router, ],
      }
    })
    const compositionAuthor = wrapper.find('.text-gray-500')
    expect(compositionAuthor.text()).toBe(song.user_display_name)
  })


  it("renders song.docId", () => {
    const wrapper = mount(SongItem, {
      props: { song, },
      global: {
        plugins: [router, ],
      }
    })
    const elem = wrapper.find('.flex')

    // Берем из списочного элементв в тестируемом компоненте атрибут id
    // и сравниваем его с предустановленным значением
    expect(elem.attributes().id).toBe(`song-id-${song.docId}`)

    // Функция attributes() возвращает объект с перечислением всех аттрибутов
    // списочного элемента li. Функция classes() возвращает массив строк-имен
    // классов элемента. Вариант с классами
    expect(elem.classes()).toContain(`song-id-${song.docId}`)
  })
})
