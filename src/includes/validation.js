import { configure, defineRule, ErrorMessage, Field as VeeField, Form as VeeForm } from 'vee-validate'

// https://vee-validate.logaretm.com/v4/guide/global-validators/
import {
  alpha_dash as alphaDash,
  confirmed,
  email,
  max,
  max_value as maxValue,
  min,
  min_value as minValue,
  not_one_of as excluded,
  required,
  alpha_spaces as alphaSpaces,
} from '@vee-validate/rules'

// https://vee-validate.logaretm.com/v4/guide/components/validation/

export default {
  install(app/*, options*/) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)

    defineRule('required', required)
    defineRule('tos', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('alpha_dash', alphaDash)
    defineRule('email', email)
    defineRule('min_value', minValue)
    defineRule('max_value', maxValue)
    defineRule('passwords_mismatch', confirmed)
    defineRule('excluded', excluded)
    defineRule('country_excluded', excluded)
    defineRule('alpha_spaces', alphaSpaces)

    configure({
      // Функция вызывается всякий раз, когда глобальный валидатор
      // возвращает false
      generateMessage: (ctx) => {
        const messages = {
          required: `The field ${ctx.field} is required.`,
          min: `The field ${ctx.field} is too short.`,
          max: `The field ${ctx.field} is too long.`,
          alpha_dash: `The field ${ctx.field} may only contain alphabetical characters, numbers, dashes, or underscores.`,
          email: `The field ${ctx.field} must be a valid email.`,
          min_value: `The field ${ctx.field} is too low.`,
          max_value: `The field ${ctx.field} is too high.`,
          excluded: `You are not allowed to use this value for the field ${ctx.field}.`,
          country_excluded:
            "Due to restrictions, we do not accept users from this location.",
          passwords_mismatch: "The passwords don't match.",
          tos: "You must accept the Terms of Service.",
        }
        return messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The field ${ctx.field} is invalid.`
      },
      // Когда input кидает событие blur (юзер коснулся поля, затем убрал палец)
      validateOnBlur: true,
      // Когда input кидает событие change
      validateOnChange: true,
      // Событие кидается на каждый keystroke
      validateOnInput: false,
      // Когда меняется модель и при этом на input навешена директива v-model
      validateOnModelUpdate: true,
    })
  }
}

