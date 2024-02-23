// https://pinia.vuejs.org/cookbook/testing.html
import { setActivePinia, createPinia } from 'pinia'
import useUserStore from '@/stores/user'

const { auth } = vi.hoisted(() => import('@/includes/firebase'))

// https://vitest.dev/api/vi.html#vi-mock
// https://vitest.dev/api/vi.html#vi-fn
// https://bentilling.com/a-practical-guide-to-mocking-svelte-stores-with-vitest
// https://stackoverflow.com/questions/77084824/mocking-laravel-echo-with-vitest-and-vue-test-utils
vi.mock("@/includes/firebase", async (importOriginal) => {
  const original = importOriginal()
  return {
    ...original,
    // replace some exports
    signInWithEmailAndPassword: vi.fn(),
    auth,
  }
})

describe('stores', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active,
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('authenticates user', async () => {
    const store = useUserStore()

    expect(store.userLoggedIn).toBe(false)
    // При желании можно использовать модификатор not
    // expect(store.userLoggedIn).not.toBe(true)

    await store.authenticate({ /*username: 'test', password: 'test'*/ })

    expect(store.userLoggedIn).toBe(true)
  })
})
