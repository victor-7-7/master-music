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
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4">
        <!-- File Name -->
        <div class="font-bold text-sm">Just another song.mp3</div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar bg-blue-400"
            style="width: 75%"
          ></div>
        </div>
      </div>
      <div class="mb-4">
        <div class="font-bold text-sm">Just another song.mp3</div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <div
            class="transition-all progress-bar bg-blue-400"
            style="width: 35%"
          ></div>
        </div>
      </div>
      <div class="mb-4">
        <div class="font-bold text-sm">Just another song.mp3</div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <div
            class="transition-all progress-bar bg-blue-400"
            style="width: 55%"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, storage, uploadBytes } from '@/includes/firebase'

export default {
  name: 'UploadFrag',
  data() {
    return {
      is_dragover: false,
    }
  },
  methods: {
    upload(event) {
      this.is_dragover = false
      // const { files } = event.dataTransfer // Здесь свойство files является объектом
      // Для возможности forEach-итерации конвертируем объект в массив
      const files = [...event.dataTransfer.files]

      files.forEach((file) => {
        console.log("file", file)
        // {name: 'tiger-g46bd77ef7_1280.jpg', lastModified: 1690609651424,
        // lastModifiedDate: Sat Jul 29 2023 12:47:31 GMT+0700 (Novosibirsk Standard Time),
        // type: "image/jpeg",webkitRelativePath: '', size: 733165, ...}

        // Обычно проверку типа выгружаемого клиентом файла делают на бэкенде, но
        // мы проверим в браузере, прежде чем выгружать аудио-файл на сервер
        if (file.type !== 'audio/mpeg') {
          console.log(`File ${file.name} is not an audio file, so it is omitted.`)
          return
        }

        // https://firebase.google.com/docs/storage/web/create-reference?authuser=0
        // const storageRef = ref(storage) // vue-music-1075a.appspot.com
        // const songsDirRef = ref(storage, 'songs') // vue-music-1075a.appspot.com/songs
        const fileRef = ref(storage,`songs/${file.name}`) // .../songs/example.mp3
        // https://firebase.google.com/docs/storage/web/upload-files?authuser=0
        uploadBytes(fileRef, file).then(() => {
          console.log(`Uploaded file ${file.name}!`)
        })
      })
    },
  },
}
</script>

<style scoped>

</style>