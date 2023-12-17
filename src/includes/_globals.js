import _ from "lodash"

export default {
  // Функция автоматически регистрирует компоненты, находящиеся в ../components/base/
  install(app) {
    // import.meta object доступен в любом JS-файле и содержит инфу о текущем
    // модуле. Vite цепляет к нему свои плюшки, например glob().
    // Отыскиваем все модули по заданному пути
    const baseComps = import.meta.glob("../components/base/*.vue", {
      eager: true,
    })
    // Section 18, track 002, time 05:00
    // Конвертим объект в массив для итерации
    Object.entries(baseComps).forEach(([path, module]) => {
      // Для удобства оперируем именами модулей в паскаль-кейс нотации
      const compName = _.upperFirst(
        _.camelCase(
          path
            .split("/")
            .pop()
            // Отбрасываем расширение .vue
            .replace(/\.\w+$/, "")
        )
      )
      // export default
      app.component(`Base${compName}`, module.default)
    })
  }
}