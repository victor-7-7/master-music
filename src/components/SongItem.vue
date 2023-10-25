<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div>
      <router-link
        :to="{ name: 'song', params: { id: song.docId } }"
        class="font-bold block text-gray-600"
      >
        {{ song.modified_name }}
      </router-link>
      <!-- имя юзера, который выгрузил песню в хранилище -->
      <span class="text-gray-500 text-sm">{{ song.user_display_name }}</span>
    </div>

    <div class="text-gray-600 text-lg">
            <span class="comments">
              <i class="fa fa-comments text-gray-600"></i>
              {{ song.comment_count }}
            </span>
    </div>
  </li>
</template>

<script>
export default {
  name: 'SongItem',
  props: {
    // Свойство song будет проброшено сюда из родительского компонента Home.vue
    // через v-bind атрибут - :song
    song: {
      type: Object,
      // Свойство song является обязательным. Если song в родительском
      // компоненте будет undefined, то движок кинет ворнинг
      required: true,
    },
  },

}
</script>

<style scoped>

</style>