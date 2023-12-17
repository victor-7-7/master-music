import NProgress from "nprogress"

// Section 18, video 005
export default (router) => {
  router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
  })

  router.afterEach(NProgress.done)
}
