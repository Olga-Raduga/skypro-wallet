<script setup>
import { ref } from 'vue'
import HeaderView from '../components/HeaderView.vue'
import ExpensesTable from '../components/ExpensesTable.vue'

const expenses = ref([
  {
    id: 1,
    title: 'Интернет',
    category: 'Развлечения',
    date: '2026-07-01',
    amount: 1200,
  },
  {
    id: 2,
    title: 'Яндекс Плюс',
    category: 'Развлечения',
    date: '2026-07-02',
    amount: 399,
  },
  {
    id: 3,
    title: 'Аптека Вита',
    category: 'Другое',
    date: '2026-07-03',
    amount: 1540,
  },
  {
    id: 4,
    title: 'Купер Маркет',
    category: 'Продукты',
    date: '2026-07-04',
    amount: 4310,
  },
])
const description = ref('')
const category = ref('Продукты')
const date = ref('')
const amount = ref('')
const formError = ref('')
const notice = ref('')
let nextExpenseId = expenses.value.length + 1
const categoriesList = [
  'Продукты',
  'Одежда',
  'Транспорт',
  'Еда',
  'Развлечения',
  'Образование',
  'Другое',
]
function handleAddExpense() {
  formError.value = ''
  notice.value = ''
  const numericAmount = Number(amount.value)
  if (!description.value.trim()) {
    formError.value = 'Введите описание расхода.'
    return
  }
  if (!date.value) {
    formError.value = 'Выберите дату.'
    return
  }
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    formError.value = 'Введите сумму больше нуля.'
    return
  }
  expenses.value.unshift({
    id: nextExpenseId,
    title: description.value.trim(),
    category: category.value,
    date: date.value,
    amount: numericAmount,
  })
  nextExpenseId += 1
  description.value = ''
  category.value = 'Продукты'
  date.value = ''
  amount.value = ''
  notice.value = 'Расход добавлен.'
}
</script>

<template>
  <div class="page-wrapper">
    <HeaderView />
    <main class="main-content">
      <div class="content-layout">
        <div class="layout-left">
          <ExpensesTable :expenses="expenses" />
        </div>
        <div class="layout-right">
          <div class="form-container">
            <h2 class="form-title">Новый расход</h2>
            <form
              class="expense-form"
              novalidate
              @submit.prevent="handleAddExpense"
            >
              <div class="form-group">
                <label for="expDesc">Описание</label>
                <input
                  id="expDesc"
                  v-model.trim="description"
                  type="text"
                  placeholder="Например, Кофе"
                >
              </div>
              <fieldset class="expense-form__categories">
                <legend>Категория</legend>
                <div class="categories-grid">
                  <label
                    v-for="cat in categoriesList"
                    :key="cat"
                    class="category-label"
                    :class="{ 'category-label_active': category === cat }"
                  >
                    <input
                      v-model="category"
                      type="radio"
                      name="category"
                      :value="cat"
                      class="hidden-radio"
                    >
                    <span>{{ cat }}</span>
                  </label>
                </div>
              </fieldset>
              <div class="form-group">
                <label for="expDate">Дата</label>
                <input
                  id="expDate"
                  v-model="date"
                  type="date"
                >
              </div>
              <div class="form-group">
                <label for="expAmount">Сумма</label>
                <input
                  id="expAmount"
                  v-model="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0"
                >
              </div>
              <p
                v-if="formError"
                class="form-error"
                role="alert"
              >
                {{ formError }}
              </p>
              <p
                v-if="notice"
                class="form-notice"
                role="status"
              >
                {{ notice }}
              </p>
              <button
                type="submit"
                class="submit-btn"
              >
                Добавить новый расход
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  width: 100vw;
  background-color: #FAFAFA;
  display: flex;
  flex-direction: column;
}
.main-content {
  padding: 40px;
  flex-grow: 1;
}
.content-layout {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}
.layout-left {
  width: 789px; 
}
.layout-right {
  width: 379px; 
  min-width: 360px;
}
.form-container {
  background: #FFFFFF;
  border: 1px solid #D4DBE5;
  border-radius: 12px;
  padding: 24px;
}
.form-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: left;
}
.expense-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}
.expense-form__categories {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.expense-form__categories legend {
  margin-bottom: 8px;
  padding: 0;
}
.expense-form input[type='number'] {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #dedee5;
  border-radius: 8px;
  font: inherit;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
}
.form-group input[type="text"], .form-group input[type="date"] {
  height: 44px;
  padding: 0 14px;
  border: 1px solid #D4DBE5;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  width: 100%;
  background: transparent;
}
.form-group input:focus {
  border-color: #793FED;
}

.categories-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.category-label {
  padding: 8px 14px;
  border: 1px solid #D4DBE5;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  color: #94A6BE;
  transition: all 0.2s;
}
.category-label_active {
  background-color: #793FED;
  color: #FFFFFF;
  border-color: #793FED;
}
.hidden-radio {
  display: none;
}
.submit-btn {
  height: 44px;
  border: none;
  border-radius: 8px;
  background-color: #793FED;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
}
.submit-btn:hover {
  background-color: #632cd4;
}
</style>