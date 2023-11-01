export default {
  beforeMount(el, binding) {
    // const iconClass = `fa fa-headphones-alt float-right text-green-400 text-xl`
    // Поскольку эта директива принимает объект со свойствами, указываем
    // конкретное свойство icon
    let iconClass = `fa fa-${binding.value.icon } text-green-400 text-xl`

    if (binding.value.right) {
      iconClass += ' float-right'
    }

    // Добавляем к html-разметке элемента узел в виде иконки
    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}
