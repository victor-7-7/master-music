import { shallowMount } from '@vue/test-utils'
import Home from '@/views/Home.vue'
import SongItem from '@/components/SongItem.vue'

it("sanity test", () => {
  expect(true).toBe(true)
})

describe("Home.vue", () => {
  it("renders list of songs", () => {
    // В тесте нам не нужно содержимое песен. Мы лишь проверяем, что
    // компонент способен получить три объекта в массиве
    const songs = [{}, {}, {},]
    const component = shallowMount(Home, {
      data() {
        return {
          songs,
        }
      },
      global: {
        mocks: {
          $t: (message) => message,
        }
      },
    })
    const items = component.findAllComponents(SongItem)
    expect(items).toHaveLength(songs.length)

    items.forEach((wrapper, i) => {
      // Сравниваем song-элемент дочернего компонента SongItem с
      // соответствующим элементом songs-массива, отправленным из
      // родительского компонента Home
      expect(wrapper.props().song).toStrictEqual(songs[i])
    })

  })
})




