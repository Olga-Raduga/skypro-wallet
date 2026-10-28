<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

const email = ref('')
const password = ref('')
const submitted = ref(false)
const notice = ref('')

const emailIsValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
})
const formIsValid = computed(() => {
  return emailIsValid.value && password.value.length > 0
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
  return ''
})

function handleLogin() {
  submitted.value = true
  notice.value = ''

  if (!formIsValid.value) {
    return
  }

  notice.value = 'Подключение входа будет добавлено на следующем этапе.'
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <h1>Вход</h1>

      <form
        class="auth-form"
        novalidate
        @submit.prevent="handleLogin"
      >
        <div class="auth-form__block">
          <label
            for="loginEmail"
            class="auth-form__label"
          >
            Email
          </label>
          <input
            id="loginEmail"
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
            for="loginPassword"
            class="auth-form__label"
          >
            Пароль
          </label>
          <input
            id="loginPassword"
            v-model="password"
            :class="{ 'auth-input_invalid': submitted && !password }"
            :aria-invalid="submitted && !password"
            type="password"
            name="password"
            autocomplete="current-password"
            placeholder="Введите ваш пароль"
          >
        </div>

        <button
          type="submit"
          class="auth-btn"
          :class="{ 'auth-btn--invalid': submitted && !formIsValid }"
        >
          Войти
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
          class="auth-notice"
          role="status"
        >
          {{ notice }}
        </p>
      </form>

      <RouterLink
        to="/register"
        class="auth-link"
      >
        Ещё нет аккаунта? Зарегистрироваться
      </RouterLink>
    </section>
  </main>
</template>