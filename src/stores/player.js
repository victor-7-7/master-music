import { defineStore } from 'pinia'
import { Howl } from 'howler'

export default defineStore('player', {
  state: () => ({
    current_song: {},
    sound: {},
  }),

  actions: {
    async newSong(song) {
      this.current_song = song
      // https://github.com/goldfire/howler.js#quick-start
      this.sound = new Howl({
        src: [song.url],
        // Set to true to force HTML5 Audio. This should be used for large
        // audio files so that you don't have to wait for the full file to
        // be downloaded and decoded before playing.
        html5: true,
      })
      this.sound.play()
    },

    async toggleAudio() {
      if (!this.sound.playing) {
        // Если объект sound пустой (нет свойства playing), то ничего
        // не воспроизводится и таглить нечего
        return
      }
      // Саунд не пустой. Если песня сейчас играет
      if (this.sound.playing()) {
        this.sound.pause()
      }
      else {
        this.sound.play()
      }

    },
  },

  getters: {
    playing(state) {
      // Если песня в проигрывателе
      if (state.sound.playing) {
        // Возвращаем ее статус - играет или на паузе
        return state.sound.playing()
      }
      // Нет песни в проигрывателе
      return false
    }
  },
})


