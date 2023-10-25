<template>
  <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div
      class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(/assets/img/header.png)"
    ></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis, congue
          augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
          sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
        </p>
      </div>
    </div>

    <img
      class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="/assets/img/introduction-music.png"
      alt="introduction"
    />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Songs</span>
        <!-- Icon -->
        <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <app-song-item
          v-for="(song, idx) in songs"
          :key="song.docId"
          :song="song"
        ></app-song-item>
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
</template>

<script>

import { collection, fireStore, getDocs, limit, orderBy, query, startAfter } from '@/includes/firebase'
import AppSongItem from '@/components/SongItem.vue'

export default {
  name: "HomeComp",

  components: {
    AppSongItem,
  },

  data() {
    return {
      songs: [],
      maxPerPage: 3,
      pendingRequest: false,
    }
  },

  // Это первый лайфсайкл-хук, в котором мы уже можем лезть в базу
  async created() {
    await this.getSongs()

    window.addEventListener('scroll', this.handleScroll)
  },

  beforeUnmount() {
    // Чтобы не было утечек памяти, если юзер уходит со страницы
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    handleScroll() {
      // scrollTop - number of pixels that an element's content is scrolled
      // vertically (distance from the element's top to its topmost visible
      // content). Сдвиг экрана (вьюпорта) от верха страницы.
      // offsetHeight - height of an element (высота всей страницы).
      const { scrollTop, offsetHeight } = document.documentElement
      // innerHeight - interior height of the window in pixels (высота экрана).
      const { innerHeight } = window
      // Приблизился ли экран к низу страницы?
      const bottomOfWindow = Math.round(scrollTop) + innerHeight > offsetHeight - 100
      if (bottomOfWindow) {
        console.log('Bottom!')
        this.getSongs(this.maxPerPage)
      }
    },

    async getSongs(count) {
      if (this.pendingRequest) {
        // Если юзер пытается скроллить, а сервер еще не вернул порцию
        // песен в ответ на предыдущий запрос, то игнорим юзерские хотелки
        return
      }
      this.pendingRequest = true // Начинаем запрос
      // https://firebase.google.com/docs/firestore/query-data/get-data#get_all_documents_in_a_collection
      const songsCollRef = collection(fireStore, 'songs')
      // https://firebase.google.com/docs/firestore/query-data/query-cursors#paginate_a_query
      let q
      if (this.songs.length === 0) {
        q = query(songsCollRef, orderBy('modified_name'), limit(count))
      } else {
        const lastDoc = this.songs[this.songs.length - 1]
        q = query(songsCollRef, orderBy('modified_name'), startAfter(lastDoc), limit(count))
      }

      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        const song = {
          ...doc.data(),
          docId: doc.id,
        }
        this.songs.push(song)
      })
      this.pendingRequest = false // Запрос окончен
    },
  },

  /*mounted() {
    console.log('Home component mounted')
  },
  unmounted() {
    console.log('Home component unmounted')
  },
  activated() {
    console.log('Home component activated')
  },
  deactivated() {
    console.log('Home component deactivated')
  },*/
}
</script>

<style scoped>

</style>