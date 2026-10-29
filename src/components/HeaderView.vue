<script setup>
import { RouterLink, useRouter } from 'vue-router'
import logo from '../assets/logo.png'

const router = useRouter()
function handleLogout() {
  router.push('/login')
}
</script>
<template>
  <header class="header">
    <div class="header__left">
      <RouterLink
        to="/expenses"
        class="header__logo"
      >
        <img class="header__logo" :src="logo" alt="Skypro.Wallet" />
      </RouterLink>
      <nav
        class="header__nav"
        aria-label="Основная навигация"
      >
        <RouterLink
          to="/expenses"
          class="header__link"
          active-class="header__link_active"
        >
          Мои расходы
        </RouterLink>
        <RouterLink
          to="/analysis"
          class="header__link"
          active-class="header__link_active"
        >
          Анализ расходов
        </RouterLink>
      </nav>
    </div>
    <button
      type="button"
      class="header__logout-btn"
      @click="handleLogout"
    >
      Выйти
    </button>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 40px;
  background: #FFFFFF;
  border-bottom: 1px solid #D4DBE5;
}
.header__left {
  display: flex;
  align-items: center;
  gap: 60px;
}
.header__logo {
  display: block;
  width: 130px;
  max-height: 36px;
  object-fit: contain;
  object-position: left center;
}
.header__nav {
  display: flex;
  gap: 30px;
}
.header__link {
  font-size: 14px;
  font-weight: 500;
  color: #94A6BE;
  text-decoration: none;
  transition: color 0.2s;
}
.header__link:hover, .header__link_active {
  color: #793FED; 
}
.header__logout-btn {
  background: transparent;
  color: #94A6BE;
  border: 1px solid #D4DBE5;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.header__logout-btn:hover {
  color: #793FED;
  border-color: #793FED;
}
</style>
