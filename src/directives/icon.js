export default {
  beforeMount(el, binding) {
    // const iconClass = `fa fa-headphones-alt float-right text-green-400 text-xl`
    let iconClass = `fa fa-${binding.value} text-xl`

    if (binding.args === 'full') {
      // Если в темплейте у элемента директива имеет full-аргумент (v-icon:full="..."),
      // то вместо вставки фрагмента строки в строковый шаблон делаем полную подстановку
      iconClass = binding.value
    }

    if (binding.modifiers.right) {
      // Если на директиву в темплейте навешен модификатор right, то добавляем
      // в определение класса соответствующий tailwindcss-атрибут для выравнивания
      // элемента по правому краю родителя. Важно! Обязателен лидирующий пробел!
      iconClass += ' float-right'
    }

    if (binding.modifiers.yellow) {
      iconClass += ' text-yellow-400'
    } else {
      iconClass += ' text-green-400'
    }

    // Добавляем к html-разметке элемента узел в виде иконки
    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}
