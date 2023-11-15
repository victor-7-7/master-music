<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="newSong(song)"
        >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ $n(10, "currency") }}</div>
          <!--<div class="song-price">{{ $n(10, "currency", "ru") }}</div>-->
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <!--<span class="card-title">Comments ({{ song.comment_count }})</span>-->
          <!-- https://vue-i18n.intlify.dev/guide/essentials/syntax.html -->
          <!-- sect 016, video 003, time 03:00 -->
          <!-- tc (в отличии от t) умеет подставлять правильные окончания
           для множественного числа (Locale message pluralization) -->
          <!-- https://vue-i18n.intlify.dev/guide/essentials/pluralization.html -->
          <span class="card-title">{{
              $tc("song.comment_count", song.comment_count, { count: song.comment_count })
            }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <!-- ALERT -->
          <div class="text-white text-center font-bold p-4 rounded mb-4" v-if="comment_show_alert" :class="comment_alert_variant">{{ comment_alert_msg }}</div>
          <!-- ADD COMMENT -->
          <vee-form :validation-schema="commentSchema" @submit="addComment" v-if="userLoggedIn">
              <vee-field as="textarea" name="comment"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
                placeholder="Your comment here..."
              ></vee-field>
            <ErrorMessage class="text-red-600" name="comment"/>
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_submission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <!-- id attr нужен, чтобы можно было перейти к этому фрагменту на странице -->
    <ul class="container mx-auto" id="comments">
      <li class="p-6 bg-gray-50 border border-gray-200"
          v-for="comment in sortedComments"
          :key="comment.docId"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.userName }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { addDoc, auth, collection, doc, fireStore, getDoc, getDocs, query, updateDoc, where } from '@/includes/firebase'
import { mapState, mapActions } from 'pinia'
import useUserStore from '@/stores/user'
import usePlayerStore from '@/stores/player'

export default {
  name: "SongComp",

  data() {
    return {
      song: {},
      commentSchema: {
        comment: 'required|min:3',
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: "bg-blue-500",
      comment_alert_msg: "Please wait! Your comment is being submitted.",
      comments: [],
      sort: '1',
    }
  },

  async created() {
    // https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document
    // На эту страницу мы приходим, кликнув по router-link ссылке во фрагменте
    // SongItem.vue. В том фрагменте движок цепляет к пути динамический параметр id
    // (song doc id), который здесь доступен через объект $route.params
    const docRef = doc(fireStore, "songs", this.$route.params.id)
    const docSnap = await getDoc(docRef)
    // Если в базе нет документа с таким id, то движок вернет снэпшот с установленным
    // в false свойством exists
    if (!docSnap.exists()) {
      // В этом случае кидаем юзера на домашнюю страницу
      this.$router.push({ name: 'home' })
      return
    }
    // https://router.vuejs.org/guide/
    // Каждому компоненту соответствует свой рут (route). При создании
    // компонента движок инжектирует в него $route-объект. Извлекаем из
    // query-части рута параметр sort
    const { sort } = this.$route.query
    // URL разбивается на части - протокол (как браузеру читать url-строку),
    // домен (адрес сервера в сети), порт (куда стучаться на сервере), путь
    // (раньше это был адрес запрашиваемого ресурса на сервере, в наше время
    // это абстракция для получения ресурса), запрос (параметры ключ=значение),
    // фрагмент (якорь - закладка на странице, куда браузер должен переместиться)
    // https://developer.mozilla.org/ru/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL

    // Задаем соответствующее значение для sort-свойства компонента
    this.sort = sort === '1' || sort === '2' ? sort : '1'
    // Мы не добавляем в song-объект доп-свойство id, ибо оно доступно через $route.params
    this.song = docSnap.data()
    await this.getComments()
  },

  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),

    sortedComments() {
      // slice() нам нужен, чтобы получить копию массива. Эту копию мы
      // отсортируем по дате. Если сортировать сам массив, то будут побочки
      return this.comments.slice().sort((a, b) => {
        // Сверху самые свежие комменты (latest to oldest) descending order
        if (this.sort === '1') {
          // The return value should be a number whose sign indicates the
          // relative order of the two elements: negative if a is less than b,
          // positive if a is greater than b, and zero if they are equal.
          // Если компаратор возвращает число < 0, то а-элемент
          // будет в массиве отсортирован перед b-элементом. Если 0, то
          // расстановка a и b будет в соответствии с их индексами.
          // Если > 0, то b-элемент будет предшествовать a-элементу.
          return new Date(b.datePosted) - new Date(a.datePosted)
        }
        // Самые свежие комменты в самом низу (oldest to latest) ascending order
        return new Date(a.datePosted) - new Date(b.datePosted)
      })
    },
  },

  methods: {
    // https://pinia.vuejs.org/core-concepts/actions.html
    ...mapActions(usePlayerStore, ['newSong']),

    async getComments() {
      const commentsCollRef = collection(fireStore, 'comments')
      // https://firebase.google.com/docs/firestore/query-data/queries
      // sid ==> song doc id
      const q = query(commentsCollRef, where('sid', '==', this.$route.params.id))
      // Выбираем из коллекции те комменты, которые относятся к данной песне
      const commentsSnap = await getDocs(q)
      // Чтобы не возникло дубликатов (функция вызывается неоднократно на странице)
      this.comments = [] // очищаем массив перед заполнением
      commentsSnap.forEach((doc) => {
        this.comments.push({
          docId: doc.id,
          ...doc.data(),
        })
      })
    },

    // При сабмите формы движок дает доступ ко второму (опциональному) параметру
    // функции - так называемому контексту в виде объекта со многими свойствами
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true
      this.comment_show_alert = true
      this.comment_alert_variant = "bg-blue-500"
      this.comment_alert_msg = "Please wait! Your comment is being submitted."

      const comment = {
        content: values.comment,
        // Преобразуем дату в строку, так как FireStore не хранит объекты
        datePosted: new Date().toString(),
        // song doc id
        sid: this.$route.params.id,
        // Коммент может добавить только залогиненный юзер
        userName: auth.currentUser.displayName,
        // user's unique ID
        uid: auth.currentUser.uid,
      }

      const commentsCollRef = collection(fireStore, 'comments')
      // Добавляем comment-документ в коллекцию comments Firestore
      // сервиса с Auto-generated ID
      // https://firebase.google.com/docs/firestore/manage-data/add-data
      await addDoc(commentsCollRef, comment)
      // ES Lint не рекомендует использовать ++ (no plus plus rule)
      this.song.comment_count += 1
      // Надо обновить число комментов у песни в БД
      const docRef = doc(fireStore, "songs", this.$route.params.id)
      await updateDoc(docRef, {
        comment_count: this.song.comment_count,
      })

      this.comment_in_submission = false
      this.comment_alert_variant = "bg-green-500"
      this.comment_alert_msg = "Comment added!"
      // Очищаем форму от комментария
      resetForm()
      // Обновляем массив комментов для данной песни
      await this.getComments()
    },
  },

  watch: {
    // Отслеживаем изменение data-свойства sort. Это позволит нам
    // сделать его persist - сохранять при перезагрузке страницы
    sort(newVal) {
      // Если вотчер сработал не ложный ивент, ничего не делаем
      if (newVal === this.$route.query.sort) {
        return
      }
      // При изменении свойства sort обновляем рут компонента через рутер.
      // push-функция понимает, что здесь мы не хотим перейти на другую
      // страницу, а всего лишь хотим обновить рут текущего компонента
      this.$router.push({
        // Добавляем/обновляем в URL query-параметр sort
        query: {
          sort: newVal,
        }
      })
    },
  },
}
</script>

<style scoped>

</style>