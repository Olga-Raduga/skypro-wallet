<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import logo from '../assets/logo.svg'
import { clearToken } from '../api/http.js'

const router = useRouter()
const route = useRoute()
const mobileMenuRef = ref(null)

const mobilePageTitle = computed(() => {
  if (route.path === '/analysis') return 'Анализ расходов'
  if (route.path === '/new-expense') return 'Новый расход'
  return 'Мои расходы'
})

function closeMobileMenu() {
  if (mobileMenuRef.value) {
    mobileMenuRef.value.open = false
  }
}

function handleLogout() {
  clearToken()
  router.replace('/login')
}
</script>

<template>
  <header class="header">
    <div class="header__left">
      <RouterLink
        to="/expenses"
        class="header__logo-link"
        aria-label="Skypro.Wallet — мои расходы"
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
      <details ref="mobileMenuRef" class="mobile-nav">
        <summary class="mobile-nav__summary">
          <span>{{ mobilePageTitle }}</span>
          <span aria-hidden="true">▾</span>
        </summary>
        <nav class="mobile-nav__menu" aria-label="Мобильная навигация">
          <RouterLink
            to="/expenses"
            class="mobile-nav__link"
            active-class="mobile-nav__link_active"
            @click="closeMobileMenu"
          >
            Мои расходы
          </RouterLink>
          <RouterLink
            to="/new-expense"
            class="mobile-nav__link"
            active-class="mobile-nav__link_active"
            @click="closeMobileMenu"
          >
            Новый расход
          </RouterLink>
          <RouterLink
            to="/analysis"
            class="mobile-nav__link"
            active-class="mobile-nav__link_active"
            @click="closeMobileMenu"
          >
            Анализ расходов
          </RouterLink>
        </nav>
      </details>
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
  font-weight: 400;
  color: #000000;
  text-decoration: none;
  transition: color 0.2s;
  padding-bottom: 4px; /* Отступ снизу для линии подчёркивания */
  border-bottom: 2px solid transparent; /* Резервируем место под линию */
  transition: all 0.2s ease;
}
.header__link:hover, .header__link_active {
  color: #7334EA; 
  border-bottom-color: #7334EA; 
}
.mobile-nav {
  display: none;
}
.header__logout-btn {
  background: transparent;
  color: #000000;
  border: 0;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.header__logout-btn:hover {
  color: #793FED;
}
@media (max-width: 480px) {
  .header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    gap: 8px;
    height: 60px;
    padding: 0 12px;
  }
  .header__left {
    display: contents;
  }
  .header__logo-link {
    grid-column: 1;
    grid-row: 1;
    flex-basis: 100px;
    width: 100px;
  }
  .header__logo {
    width: 100px;
    max-height: 30px;
  }
  .header__nav {
    display: none;
  }
  .mobile-nav {
    position: relative;
    display: block;
    grid-column: 2;
    grid-row: 1;
  }
  .mobile-nav__summary {
    display: flex;
    align-items: center;
    gap: 5px;
    list-style: none;
    color: #7334ea;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
  }
  .mobile-nav__summary::-webkit-details-marker {
    display: none;
  }
  .mobile-nav__menu {
    position: absolute;
    z-index: 10;
    top: calc(100% + 10px);
    right: 0;
    display: flex;
    flex-direction: column;
    min-width: 170px;
    padding: 8px;
    border: 1px solid #d4dbe5;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
  }
  .mobile-nav__link {
    padding: 10px 12px;
    border-radius: 6px;
    color: #222;
    font-size: 10px;
    font-weight: 400;
    text-decoration: none;
    white-space: nowrap;
  }
  .mobile-nav__link_active {
    background: #f1ebfd;
    color: #7334ea;
    font-size: 10px;
    font-weight: 400;
  }
  .header__logout-btn {
    grid-column: 3;
    grid-row: 1;
    padding: 6px 0;
    font-size: 12px;
    font-weight: 600;
  }
}
</style>
