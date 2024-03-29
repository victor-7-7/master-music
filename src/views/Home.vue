<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(/assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">{{ $t("home.listen") }}</h1>
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
        <!-- В v-icon директиву передаем параметр как строку. Применяем к директиве
         два кастомных модификатора right и yellow -->
        <!--<div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
             v-icon.right.yellow="'headphones-alt'">
          <span class="card-title">Songs</span>
        </div>-->
        <!-- Второй способ задания директив. Вместо аргументов и модификаторов
         используем объект со свойствами -->
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
             v-icon-secondary="{ icon: 'headphones-alt', right: true }">
          <span class="card-title">Songs</span>
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <song-item
            v-for="song in songs"
            :key="song.docId"
            :song="song"
          ></song-item>
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import { collection, fireStore, getDocs, limit, orderBy, query, startAfter } from '@/includes/firebase'
import SongItem from '@/components/SongItem.vue'
import IconSecondary from "@/directives/icon-secondary"

export default {
  name: "HomeComp",

  components: {
    SongItem,
  },

  directives: {
    'icon-secondary': IconSecondary,
  },

  data() {
    return {
      songs: [],
      maxPerPage: 10,
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
