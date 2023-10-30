
export default {
  formatTime(timeSec) {
    const minutes = Math.floor(timeSec / 60) || 0
    const seconds = Math.round(timeSec - minutes * 60 || 0)
    // Если секунд меньше 10, то подставляем нолик, чтобы было два знака
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
}

