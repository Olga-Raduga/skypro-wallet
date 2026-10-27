<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/login">Вход</RouterLink> |
    <RouterLink to="/register">Регистрация</RouterLink> |
    <RouterLink to="/expenses">Расходы</RouterLink> |
    <RouterLink to="/analysis">Анализ</RouterLink>
  </nav>
  <RouterView />
</template>
