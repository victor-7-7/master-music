<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <h4 class="inline-block text-xl">(genre - {{ song.genre }})</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>

    <div v-show="showForm">
      <!-- ALERT -->
      <div class="text-white text-center font-bold p-4 rounded mb-4" v-if="show_alert" :class="alert_variant">{{ alert_msg }}</div>

      <vee-form :validation-schema="editSchema" :initial-values="song" @submit="updateComposition">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <!-- The @input event fires when the value of an input-element has been changed -->
          <!-- https://vee-validate.logaretm.com/v4/guide/components/validation/ -->
          <!-- Note that input event is not considered to be a trigger because
          it would make it too aggressive, you can configure the triggers in the
          next section to suit your needs. -->
          <vee-field
            type="text" name="modified_name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name"/>
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text" name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre"/>
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission"
          @click.prevent="goBack"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { deleteDoc, deleteObject, doc, fireStore, ref, storage, updateDoc } from '@/includes/firebase'

export default {
  name: 'CompositionItem',
  props: {
    // Свойство song будет проброшено сюда из родительского компонента Manage.vue
    // через v-bind атрибут - :song
    song: {
      type: Object,
      // Свойство song является обязательным. Если song в родительском
      // компоненте (Manage.vue) будет undefined, то движок кинет ворнинг
      required: true,
    },
    // Аналогично сюда из Manage.vue пробрасываются функции и индекс
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
      // Эта функция опциональна, может быть undefined
    },
  },

  data() {
    return {
      showForm: false,
      // https://vee-validate.logaretm.com/v4/guide/components/validation/
      // https://vee-validate.logaretm.com/v4/guide/global-validators/
      editSchema: {
        // // If you defined global rules you can also use them
        modified_name: "required",
        genre: "alpha_spaces",
      },
      in_submission: false,
      show_alert: false,
      alert_variant: "bg-blue-500",
      alert_msg: "Please wait! Updating song info.",
    }
  },

  methods: {
    // Движок самостоятельно передает в метод values-параметр в виде набора
    // key:value (ключ - имя поля формы, значение - содержимое поля формы)
    async updateComposition(values) {
      this.in_submission = true
      this.show_alert = true
      // На случай, если юзер пытается засабмитить форму повторно
      this.alert_variant = "bg-blue-500"
      this.alert_msg = "Please wait! Updating song info."

      const docRef = doc(fireStore, "songs", this.song.docId)
      try {
        // https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
        // Обновляем инфу по композиции в БД
        await updateDoc(docRef, values)
      } catch (e) {
        this.in_submission = false
        this.alert_variant = "bg-red-500"
        this.alert_msg = "Something went wrong! Try again later."
        return
      }

      // Если все ок, то триггерим родителя (Manage.vue) чтобы он обновил
      // содержимое полей песни на странице
      this.updateSong(this.index, values)
      // Изменения в форме были сохранены
      this.updateUnsavedFlag(false)

      this.in_submission = false
      this.alert_variant = "bg-green-500"
      this.alert_msg = "Success!"
    },

    goBack() {
      // Юзер решил не сохранять изменения в форме
      this.updateUnsavedFlag(false)
      this.showForm = false
    },

    async deleteSong() {
      // Надо, чтобы секьюр-правила для хранилища и правила для БД
      // позволяли делать удаление файлов и документов соответственно
      // https://firebase.google.com/docs/rules/basics?hl=en&authuser=0

      // Файл песни в хранилище (имена файлов в директории songs уникальны)
      const songFileRef = ref(storage, `songs/${this.song.original_name}`)
      // https://firebase.google.com/docs/storage/web/delete-files
      await deleteObject(songFileRef)

      // Документ с инфой о песне в БД
      const docRef = doc(fireStore, "songs", this.song.docId)
      // https://firebase.google.com/docs/firestore/manage-data/delete-data#delete_documents
      await deleteDoc(docRef)

      // Триггерим родительский компонент, чтобы он удалил песню из списка
      this.removeSong(this.index)
    },
  }
}
</script>