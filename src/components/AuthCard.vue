<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <div class="auth-page">
    <section class="auth-card">
      <h1>{{ title }}</h1>

      <!-- Слот для формы (поля + кнопка) -->
      <slot />

      <!-- Слот для нижней ссылки «Нужно зарегистрироваться? / Уже есть аккаунт?» -->
      <slot name="footer" />
    </section>
  </div>
</template>