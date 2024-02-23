// https://vitest.dev/guide/snapshot.html
// В снэпшоте компонента мы сохраняем его рендер (что компонент
// предоставит браузеру - html fragment), а в тесте сравниваем
// текущий рендер компонента с сохраненным в снэпшоте

// import { describe, it, expect } from 'vitest' // <-- не требуется!

import SongItem from '@/components/SongItem.vue'
import { RouterLinkStub, shallowMount } from '@vue/test-utils'

describe('Snapshot SongItem.vue', () => {
  it('renders correctly', () => {
    const song = {
      docId: "abc",
      modified_name: "test",
      user_display_name: "test",
      comment_count: 5,
    }

    const wrapper = shallowMount(SongItem, {
      props: { song, },
      global: {
        components: {
          'router-link': RouterLinkStub,
        }
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})