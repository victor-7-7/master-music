<template>
  <div
    class="bg-white rounded border border-gray-200 relative flex flex-col"
  >
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)"/>
      <hr class="my-6" />
      <!-- Progress Bars -->
      <div class="mb-4" v-for="uploadObj in uploads" :key="uploadObj.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="uploadObj.text_class">
          <i :class="uploadObj.icon"></i> {{ uploadObj.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded" v-if="uploadObj.isRunning">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="uploadObj.variant"
            :style="{ width: uploadObj.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ref, storage, uploadBytesResumable, getDownloadURL,
  auth, fireStore, collection, addDoc, getDoc,
} from '@/includes/firebase'

export default {
  name: 'UploadFrag',
  data() {
    return {
      is_dragover: false,
      uploads: [],
    }
  },
  // Свойство addSong будет проброшено сюда из родительского компонента Manage.vue
  // через v-bind атрибут - :addSong
  props: ["addSong",],

  methods: {
    upload(event) {
      this.is_dragover = false

      console.log(event)
      // Если мы перетаскиваем и скидываем файл в Upload Dropbox div-элемент, то
      // event имеет свойство dataTransfer, являющееся объектом со свойством files.
      // Если мы скидываем файл в <input type="file".../>, то event уже не имеет свойства
      // dataTransfer, но будет иметь свойство target, input-объект которого будет содержать
      // свойство files. Если мы отпустили (дропнули) музыкальный файл после перетаскивания
      // над каким-то элементом страницы, у которого нет атрибута @change="upload($event)",
      // то браузер откроет страницу с дефолтным плеером и загрузит в него этот файл.

      // const { files } = event.dataTransfer // Здесь свойство files является объектом
      // Для возможности forEach-итерации конвертируем files объект в массив
      const files = event.dataTransfer
        ? [...event.dataTransfer.files]
        : [...event.target.files]

      files.forEach((file) => {
        console.log("file", file)
        // {name: 'tiger-g46bd77ef7_1280.jpg', lastModified: 1690609651424,
        // lastModifiedDate: Sat Jul 29 2023 12:47:31 GMT+0700 (Novosibirsk Standard Time),
        // type: "image/jpeg",webkitRelativePath: '', size: 733165, ...}

        // Обычно проверку типа выгружаемого клиентом файла делают на бэкенде, но
        // мы проверим в браузере, прежде чем выгружать аудио-файл на сервер
        if (file.type !== 'audio/mpeg' && file.type !== 'audio/wav') {
          console.log(`File ${file.name} is not an audio file, so it is omitted.`)
          return
        }

        // https://firebase.google.com/docs/storage/web/create-reference?authuser=0
        // const storageRef = ref(storage) // vue-music-1075a.appspot.com
        // const songsDirRef = ref(storage, 'songs') // vue-music-1075a.appspot.com/songs
        const fileRef = ref(storage,`songs/${file.name}`) // .../songs/example.mp3
        // https://firebase.google.com/docs/storage/web/upload-files?authuser=0
        /*uploadBytes(fileRef, file).then(() => {
          console.log(`Uploaded file ${file.name}!`)
        })*/
        const uploadTask = uploadBytesResumable(fileRef, file)
        const uploadObj = {
          // Это свойство требуется для отмены выгрузки и т.п.
          task: uploadTask,
          current_progress: 0,
          name: file.name,
          state: '',
          idx: 0,
          isRunning: true,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: '',
        }
        const arrayLength = this.uploads.push(uploadObj)
        this.uploads[arrayLength - 1].idx = arrayLength - 1

        // https://firebase.google.com/docs/reference/js/v8/firebase.storage.UploadTask#on
        // Register 'state_changed' observer, called any time the state changes
        uploadTask.on('state_changed', {
          // Observe state change events such as progress, pause, and resume
          next: (snapshot) => {
            // Обновляем current_progress свойство соответствующего элемента массива
            this.uploads[uploadObj.idx].current_progress =
              // the number of bytes uploaded / the total number of bytes to be uploaded
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100

            switch (snapshot.state) {
              case 'running':
                if (uploadObj.state !== 'running') {
                  console.log(`Upload "${uploadObj.name}" is running`)
                }
                break
              case 'paused':
                if (uploadObj.state !== 'paused') {
                  console.log(`Upload "${uploadObj.name}" is paused`)
                }
                break
            }
            uploadObj.state = snapshot.state
          },
          // Register Error observer, called on failure
          error: (err) => {
            // Handle unsuccessful uploads
            this.uploads[uploadObj.idx].variant = 'bg-red-400'
            this.uploads[uploadObj.idx].text_class = 'text-red-400'
            // https://fontawesome.com/icons/circle-xmark?f=classic&s=regular
            this.uploads[uploadObj.idx].icon = 'fas fa-times' // 'fa-regular fa-circle-xmark'

            console.log(err.message)
          },
          // Register Completion observer, called on successful completion
          complete: async () => {
            // Handle successful uploads on complete
            const song = {
              // Если браузер-юзер не был залогинен, то null
              uid: auth.currentUser.uid,
              user_display_name: auth.currentUser.displayName,
              original_name: uploadTask.snapshot.ref.name,
              // Мы позволим юзеру изменить имя файла после выгрузки файла
              // (для показа в браузере) но не хотим менять имя файла в хранилище
              modified_name: uploadTask.snapshot.ref.name,
              genre: '',
              comment_count: 0,
              url: '',
            }
            song.url = await getDownloadURL(uploadTask.snapshot.ref)
            // Добавляем song-документ в коллекцию songs Firestore
            // сервиса с Auto-generated ID и получаем ссылку на док
            // https://firebase.google.com/docs/firestore/manage-data/add-data
            const songRef = await addDoc(collection(fireStore, "songs"), song)
            // Получаем снэпшот документа
            const songSnap = await getDoc(songRef)
            // Триггерим родительский компонент Manage.vue, чтобы он добавил песню в список
            this.addSong(songSnap)

            this.uploads[uploadObj.idx].isRunning = false
            this.uploads[uploadObj.idx].text_class = 'text-green-400'
            // https://fontawesome.com/icons/circle-check?f=classic&s=regular
            this.uploads[uploadObj.idx].icon = 'fas fa-check' // 'fa-regular fa-circle-check'
          }
        })
      })
    },

    cancelUploads() {
      // Если во время выгрузки файлов на сервак юзер покидает страницу /manage-music
      // (переходит на другую), то родительский компонент Manage.vue отключается,
      // а перед отключением он в своем хуке вызовет эту функцию. Мы должны
      // остановить все выгрузки
      this.uploads.forEach((uploadObj) => {
        // Если выгрузка файла продолжается в данный момент
        if (uploadObj.isRunning) {
          // Отменяем выгрузку
          uploadObj.task.cancel()
        }
      })
    },
  },

  /*beforeUnmount() {
    // Если во время выгрузки файлов на сервак юзер покидает страницу
    // (переходит на другую), то компонент отключается, а перед отключением
    // вызывается эта функция. Мы должны остановить все выгрузки
    this.uploads.forEach((uploadObj) => {
      // Если выгрузка файла продолжается в данный момент
      if (uploadObj.isRunning) {
        // Отменяем выгрузку
        uploadObj.task.cancel()
      }
    })
  },*/
}
</script>

<style scoped>

</style>