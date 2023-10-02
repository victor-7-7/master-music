<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">

      <div class="col-span-1">
        <!-- Нам нужен доступ из Manage.vue к дочернему компоненту UploadFrag.vue
          с помощью атрибута ref -->
        <upload-frag ref="upload-ref" :addSong="addSong"></upload-frag>
      </div>

      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <composition-item
              v-for="(song, idx) in songs"
              :key="song.docId"
              :song="song"
              :updateSong="updateSong"
              :index="idx"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            ></composition-item>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

import UploadFrag from '@/components/UploadFrag.vue'
import CompositionItem from '@/components/CompositionItem.vue'
import { auth, collection, fireStore, getDocs, query, where } from '@/includes/firebase'

export default {
  name: 'ManageComp',

  components: {
    UploadFrag,
    CompositionItem,
  },

  data() {
    return {
      songs: [],
      // Редактирует ли юзер в данный момент песню?
      unsavedFlag: false,
    }
  },

  methods: {
    addSong(doc) {
      const song = {
        ...doc.data(),
        docId: doc.id,
      }
      this.songs.push(song)
    },

    updateSong(idx, values) {
      this.songs[idx].modified_name = values.modified_name
      this.songs[idx].genre = values.genre
    },

    removeSong(idx) {
      // Удаляем песню из массива, чтобы обновился список песен на странице
      this.songs.splice(idx, 1)
    },

    updateUnsavedFlag(value) {
      this.unsavedFlag = value
    }
  },

  // Это первый лайфсайкл-хук, в котором мы уже можем лезть в базу
  async created() {
    // https://firebase.google.com/docs/firestore/query-data/get-data
    // https://firebase.google.com/docs/firestore/query-data/queries
    const songsCollRef = collection(fireStore, 'songs')
    const q = query(songsCollRef, where('uid', '==', auth.currentUser.uid))
    const querySnapshot = await getDocs(q)

    /*querySnapshot.forEach((doc) => {
      this.addSong(doc)
    })*/
    // Синтаксический сахар
    querySnapshot.forEach(this.addSong)
  },

  beforeRouteLeave(to, from, next) {
    // Если юзер редактировал песню в списке, то спрашиваем его
    if (this.unsavedFlag) {
      const leave = confirm("You have unsaved changes. Are you sure you want to leave?")
      // Если юзер передумал покидать страницу, то завершаем метод
      if (!leave) return
    }
    // Перед уходом со страницы /manage-music останавливаем выгрузки
    // файлов на сервер, если они осуществляются в данный момент.
    this.$refs['upload-ref'].cancelUploads()
    // Уходим на другую страницу
    next()
  },

  // Локальная защита страницы от неавторизованных юзеров некошерна.
  // Если таких страниц десятки, то на каждой придется повторять этот
  // кусок кода. Лучше все эти страницы защитить глобально в @/router/index.js
  /*beforeRouteEnter(to, from) {
    // В момент вызова этой функции компонент еще не создан, поэтому
    // доступ к this здесь невозможен.
    console.log('beforeRouteEnter Guard', to, from)
    // Но мы можем получить ссылку на объект pinia store.
    const userStore = useUserStore()
    if (!userStore.userLoggedIn) {
      // Если юзер не авторизован, то перекидываем его на домашнюю страницу
      return { name: 'home' }
    }
  },*/
}
</script>

<style scoped>

</style>