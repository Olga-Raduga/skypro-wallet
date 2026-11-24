<script setup>
import { ref, computed } from 'vue'
import { useRouter,  RouterLink } from 'vue-router'
import { loginUser } from '../api/auth.js'
import { setToken } from '../api/http.js'
import AuthCard from '../components/AuthCard.vue'
import AuthField from '../components/AuthField.vue'

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
  <AuthCard title="Вход">
    <form
      class="auth-form"
      novalidate
      @submit.prevent="handleLogin"
    >
      <AuthField
        id="loginEmail"
        v-model.trim="login"
        type="email"
        name="login"
        autocomplete="email"
        placeholder="Введите ваш email"
        :invalid="isLoginInvalid || Boolean(errorMessage)"
        required
        @input="clearError"          
      />        

      <AuthField
        id="loginPassword"
        v-model="password"    
        type="password"
        name="password"
        autocomplete="current-password"
        placeholder="Пароль"
        :invalid="isPasswordInvalid || Boolean(errorMessage)"
        required
        @input="clearError"                             
      />
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
  </AuthCard> 
</template>

