<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { registerUser } from '../api/auth.js'
import AuthCard from '../components/AuthCard.vue'
import AuthField from '../components/AuthField.vue'

const router = useRouter()

const name = ref('')
const login = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const hasSubmitted = ref(false)

const isNameInvalid = computed(() => hasSubmitted.value && !name.value.trim())
const isLoginInvalid = computed(() => hasSubmitted.value && (!login.value.trim() || !login.value.includes('@')))
const isPasswordInvalid = computed(() => hasSubmitted.value && !password.value)

function clearError() {
  errorMessage.value = ''
  hasSubmitted.value = false
}


async function handleRegister() {
  hasSubmitted.value = true
  errorMessage.value = ''

  if (!name.value.trim() || !login.value.trim() || !password.value) {
    errorMessage.value = 'Упс! Все поля обязательны для заполнения.'
    return
  }
  if (!login.value.includes('@')) {
    errorMessage.value = 'Упс! Введен некорректный адрес электронной почты.'
    return
  }
  isSubmitting.value = true
  try {
    await registerUser({
      login: login.value.trim(),
      name: name.value.trim(),
      password: password.value,
    })
  
  await router.push('/login')
  } catch {
    errorMessage.value = 'Упс! Введенные вами данные некорректны. Введите данные корректно и повторите попытку.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthCard title="Регистрация">
    <form
      class="auth-form"
      novalidate
      @submit.prevent="handleRegister"
    >
      <AuthField
        id="registerName"
        v-model.trim="name"
        type="text"
        name="name"
        autocomplete="name"
        placeholder="Имя" 
        :invalid="isNameInvalid || Boolean(errorMessage)"
        required
        @input="clearError"                 
      />

      <AuthField         
        id="registerEmail"
        v-model.trim="login"       
        type="email"
        name="email"
        autocomplete="email"
        placeholder="Эл. почта"
        :invalid="isLoginInvalid || Boolean(errorMessage)"
        required
        @input="clearError"                
      />

      <AuthField
        id="registerPassword"
        v-model="password"
        type="password"
        name="password"
        autocomplete="new-password"
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
  </AuthCard>      
</template>

