<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const submitted = ref(false)
const notice = ref('')

const emailIsValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
})

const formIsValid = computed(() => {
  return (
    emailIsValid.value &&
    password.value.length > 0 &&
    confirmPassword.value.length > 0 &&
    password.value === confirmPassword.value
  )
})

const formError = computed(() => {
  if (!submitted.value) {
    return ''
  }

  if (!email.value) {
    return 'Введите email.'
  }
  if (!emailIsValid.value) {
    return 'Введите корректный email.'
  }

  if (!password.value) {
    return 'Введите пароль.'
  }

  if (!confirmPassword.value) {
    return 'Повторите пароль.'
  }

  if (password.value !== confirmPassword.value) {
    return 'Пароли не совпадают.'
  }

  return ''
})

function handleRegister() {
  submitted.value = true
  notice.value = ''

  if (!formIsValid.value) {
    return
  }

  notice.value = 'Подключение регистрации будет добавлено на следующем этапе.'
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <h1>Регистрация</h1>

      <form
        class="auth-form"
        novalidate
        @submit.prevent="handleRegister"
      >
        <div class="auth-form__block">
          <label
            for="registerEmail"
            class="auth-form__label"
          >
            Email
          </label>
          <input
            id="registerEmail"
            v-model.trim="email"
            :class="{ 'auth-input_invalid': submitted && !emailIsValid }"
            :aria-invalid="submitted && !emailIsValid"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="Введите ваш email"
          >
        </div>
        <div class="auth-form__block">
          <label
            for="registerPassword"
            class="auth-form__label"
          >
            Пароль
          </label>
          <input
            id="registerPassword"
            v-model="password"
            :class="{ 'auth-input_invalid': submitted && !password }"
            :aria-invalid="submitted && !password"
            type="password"
            name="password"
            autocomplete="new-password"
            placeholder="Введите пароль"
          >
        </div>

        <div class="auth-form__block">
          <label
            for="confirmPassword"
            class="auth-form__label"
          >
            Подтверждение пароля
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            :class="{
              'auth-input_invalid':
                submitted &&
                (!confirmPassword || password !== confirmPassword),
            }"
            :aria-invalid="
              submitted &&
                (!confirmPassword || password !== confirmPassword)
            "
            type="password"
            name="confirmPassword"
            autocomplete="new-password"
            placeholder="Повторите пароль"
          >
        </div>

        <button
          type="submit"
          class="auth-btn"
          :class="{ 'auth-btn--invalid': submitted && !formIsValid }"
        >
          Зарегистрироваться
        </button>

        

        <p
          v-if="formError"
          class="auth-error"
          role="alert"
        >
          {{ formError }}
        </p>

        <p
          v-if="notice"
          role="status"
        >
          {{ notice }}
        </p>
      </form>
      
      <RouterLink
        to="/login"
        class="auth-link"
      >
        Уже есть аккаунт? Войти
      </RouterLink>
    </section>
  </main>
</template>