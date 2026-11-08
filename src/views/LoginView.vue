<script setup>
import { ref, computed } from 'vue'
import { useRouter,  RouterLink } from 'vue-router'
import { loginUser } from '../api/auth.js'
import { setToken } from '../api/http.js'

const router = useRouter()

const login = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const hasSubmitted = ref(false)

// Локальная валидация для управления звёздочками и подсветкой
const isLoginInvalid = computed(() => hasSubmitted.value && (!login.value.trim() || !login.value.includes('@')))
const isPasswordInvalid = computed(() => hasSubmitted.value && !password.value)

function clearError() {
  errorMessage.value = ''
  hasSubmitted.value = false
}

async function handleLogin() {
  hasSubmitted.value = true
  errorMessage.value = ''

  // Если локальная проверка не пройдена, не отправляем запрос
  if (!login.value.trim() || !login.value.includes('@') || !password.value) {
    return
  }

  isSubmitting.value = true
  try {
    const response = await loginUser({
      login: login.value.trim(),
      password: password.value,
    })
    const token = response?.user?.token
    if (!token) {
      throw new Error('Сервер не вернул токен авторизации')
    }
    setToken(token)
  await router.push('/expenses')
  } catch {
    errorMessage.value = 'Упс! Введенные вами данные некорректны. Введите данные корректно и повторите попытку.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <section class="auth-card">
      <h1>Вход</h1>
      <form
        class="auth-form"
        novalidate
        @submit.prevent="handleLogin"
      >
        <div class="input-wrapper">
          <input
            id="loginEmail"
            v-model.trim="login"
            type="email"
            name="login"
            autocomplete="email"
            placeholder="Введите ваш email"
            :class="{ 'auth-input_invalid': isLoginInvalid || errorMessage }"
            required
            @input="clearError"          
          >
          <span
            v-if="isLoginInvalid"
            class="required-star"
            aria-hidden="true"
          >*</span>
        </div>
        

        <div class="input-wrapper">
          <input
            id="loginPassword"
            v-model="password"    
            type="password"
            name="password"
            autocomplete="current-password"
            placeholder="Пароль"
            :class="{ 'auth-input_invalid': isPasswordInvalid || errorMessage }"
            required
            @input="clearError"           
          >
          <span
            v-if="isPasswordInvalid"
            class="required-star"
            aria-hidden="true"
          >*</span>
        </div>
        <p v-if="errorMessage" class="auth-error" role="alert">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="auth-btn"
          :class="{ 'auth-btn--invalid': isSubmitting || errorMessage }"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Входим…' : 'Войти' }}
        </button>   
      </form>

      <p class="auth-switch">
        Нужно зарегистрироваться?
        <RouterLink
          to="/register"
          class="auth-link"
        >
          Регистрируйтесь здесь
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
.input-wrapper {
  position: relative;
}

.required-star {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  color: #d14343;
  font-size: 16px;
  font-weight: 600;
  pointer-events: none;
}
</style>
