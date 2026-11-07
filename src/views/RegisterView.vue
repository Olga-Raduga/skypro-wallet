<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { registerUser } from '../api/auth.js'

const router = useRouter()

const name = ref('')
const login = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

async function handleRegister() {
  errorMessage.value = ''
  isSubmitting.value = true
  try {
    await registerUser({
      login: login.value,
      name: name.value,
      password: password.value,
    })
  
  router.push('/login')
  } catch (error) {
    errorMessage.value = error.message || 'Не удалось зарегистрироваться'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <section class="auth-card">
      <h1>Регистрация</h1>
      <form
        class="auth-form"
        @submit.prevent="handleRegister"
      >
        <input
          id="registerName"
          v-model.trim="name"
          type="text"
          name="name"
          autocomplete="name"
          placeholder="Имя"
          required
        >
        <input
          id="registerEmail"
          v-model.trim="login"       
          type="email"
          name="email"
          autocomplete="email"
          placeholder="Эл. почта"
          required
        >

        <input
          id="registerPassword"
          v-model="password"
          type="password"
          name="password"
          autocomplete="new-password"
          placeholder="Пароль"
          required
        >

        <p v-if="errorMessage" class="auth-error" role="alert">
          {{ errorMessage }}
        </p>
       
        <button
          type="submit"
          class="auth-btn"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Регистрируем…' : 'Зарегистрироваться' }}
        </button>
      </form>

      <p class="auth-switch">
        Уже есть аккаунт?
        <RouterLink
          to="/login"
          class="auth-link"
        >
          Войдите здесь
        </RouterLink>
      </p>
    </section>
  </div>      
</template>

<style scoped>
.auth-page {
  display: grid;
  width: 100%;
  min-height: 100vh;
  padding: 24px;
  place-items: center;
}
.auth-card {
  width: min(100%, 320px);
  padding: 28px 24px;
  border: 1px solid #d4dbe5;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 20px rgb(0 0 0 / 3%);
  text-align: center;
}
.auth-card h1 {
  margin: 0 0 24px;
  color: #222;
  font-size: 20px;
  font-weight: 600;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.auth-form__block {
  display: flex;
  flex-direction: column;
  gap: 7px;
  text-align: left;
}
.auth-form__label {
  color: #94a6be;
  font-size: 13px;
  font-weight: 500;
}
.auth-form input {
  width: 100%;
  height: 38px;
  padding: 0 11px;
  border: 1px solid #d4dbe5;
  border-radius: 6px;
  outline: none;
  background: #fff;
  color: #222;
  font: inherit;
  font-size: 13px;
}
.auth-form input:focus {
  border-color: #793fed;
}
.auth-form input.auth-input_invalid {
  border-color: #e55666;
  background: #fff5f5;
}
.auth-error {
  margin: 0;
  color: #d94352;
  font-size: 12px;
  line-height: 1.4;
  text-align: left;
}
.auth-notice {
  margin: 12px 0 0;
  color: #596579;
  font-size: 12px;
  line-height: 1.4;
}
.auth-btn {
  width: 100%;
  height: 36px;
  margin-top: 4px;
  border: 0;
  border-radius: 5px;
  background: #793fed;
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  transition: background-color 0.2s;
}
.auth-btn:hover {
  background: #632cd4;
}
.auth-btn--invalid {
  background: #aeb4bd;
}
.auth-switch {
  display: inline-block;
  margin-top: 12px;
  color: #999999;
  font-size: 12px;
  text-decoration: none;
}
.auth-link {
  display: inline-block;
  margin-top: 12px;
  color: #999999;
  font-size: 12px;
  text-decoration: none;
}
.auth-link:hover {
  text-decoration: underline;
}
</style>