import { defineStore } from 'pinia'
import { Howl } from 'howler'
import helper from '@/includes/helper'

export default defineStore('player', {
  state: () => ({
    current_song: {},
    sound: {},
    seek: '00:00', // current position
    duration: '00:00',
    playerProgress: '0%',
  }),

  actions: {
    async newSong(song) {
      // Если Хаулер уже заряжен треком
      if (this.sound instanceof Howl) {
        // То прежде чем запускать новый трек выгружаем текущий
        this.sound.unload()
      }
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

      this.sound.on("play", () => {
        requestAnimationFrame(this.progress)
      })
    },

    progress() {
      // Из функций seek() и duration() Хаулер возвращает секунды
      this.seek = helper.formatTime(this.sound.seek())
      this.duration = helper.formatTime(this.sound.duration())
      // Здесь важно вызывать методы. Пропети работать не будут
      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`
      // Если мы не на паузе, то продолжаем отражать прогресс воспроизведения
      if (this.sound.playing()) {
        requestAnimationFrame(this.progress)
      }
    },

    async toggleAudio() {
      if (!this.sound.playing) {
        // Если объект sound пустой (нет свойства playing), то Хаулер
        // не заряжен треком и таглить нечего
        return
      }
      // Саунд не пустой. Если трек сейчас играет
      if (this.sound.playing()) {
        this.sound.pause()
      }
      // Трек на паузе
      else {
        this.sound.play()
      }
    },
    // Vue-движок в клик-колбэки всегда передает клик-ивент параметр
    updateSeek(event) {
      if (!this.sound.playing) {
        // Если объект sound пустой (нет свойства playing), то Хаулер
        // не заряжен треком и клик игнорим
        return
      }
      // Поскольку браузер задает clientX координату клика относительно
      // документа (страницы), а не кликнутого элемента, то нам надо знать сдвиг
      // таймлайна/прогресс-бара (Scrub Container) относительно страницы.
      // х - сдвиг по оси х в пикселях относительно Document
      const { x, width } = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - x
      // Вычисляем число секунд трека, соответствующее кликнутой точке на таймлайне
      const seconds = this.sound.duration() * (clickX / width)
      // Задаем Хаулеру позицию проигрывания трека
      this.sound.seek(seconds)
      // Триггерим единожды колбэк на событие seek.
      this.sound.once("seek", this.progress)
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


