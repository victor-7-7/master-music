import SongItem from '@/components/SongItem.vue'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'

describe('Router', () => {
  it('renders router link', () => {
    const song = {
      docId: "abc",
    }
    // https://test-utils.vuejs.org/guide/advanced/vue-router.html#Using-a-Mocked-Router

    const wrapper = shallowMount(SongItem, {
      props: { song, },
      global: {
        components: {
          'router-link': RouterLinkStub,
        }
      },
    })

    expect(wrapper.findComponent(RouterLinkStub).props().to)
      .toEqual({ name: 'song', params: { id: song.docId } })
  })
})


