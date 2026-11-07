<script setup>
import { onMounted, ref } from 'vue'
import HeaderView from '../components/HeaderView.vue'
import ExpensesTable from '../components/ExpensesTable.vue'

import IconCategory from '../components/IconCategory.vue'
import {
  addTransaction,
  getTransactions,
} from '../api/transactions.js'

const expenses = ref([])

// Переменные полей формы (оставляем только для v-model)
const description = ref('')
const category = ref('food')
const date = ref('')
const amount = ref('')

const isLoading = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')
const fieldErrors = ref({})

// Переделываем массив в объекты с именами и путями к иконкам
const categoriesList = [
  { name: 'Еда', value: 'food', icon: 'food' },
  { name: 'Транспорт', value: 'transport', icon: 'transport' },
  { name: 'Жильё', value: 'housing', icon: 'housing' },
  { name: 'Развлечения', value: 'joy', icon: 'entertainment' },
  { name: 'Образование', value: 'education', icon: 'education' },
  { name: 'Другое', value: 'others', icon: 'other' },
]
const categoryNames = {
  food: 'Еда',
  transport: 'Транспорт',
  housing: 'Жильё',
  joy: 'Развлечения',
  education: 'Образование',
  others: 'Другое',
}
function toExpenseRow(transaction) {
  return {
    id: transaction._id,
    title: transaction.description,
    category: categoryNames[transaction.category] ?? transaction.category,
    // В таблицу передаём YYYY-MM-DD, чтобы её форматирование даты сработало.
    date: transaction.date?.slice(0, 10) ?? '',
    amount: transaction.sum,
  }
}
async function loadTransactions() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const transactions = await getTransactions()
    expenses.value = transactions.map(toExpenseRow)
  } catch (error) {
    errorMessage.value = error.message || 'Не удалось загрузить расходы'
  } finally {
    isLoading.value = false
  }
}
function validateExpense() {
  const errors = {}
  const cleanDescription = description.value.trim()
  const sum = Number(amount.value)
  if (!cleanDescription) {
    errors.description = 'Введите описание'
  } else if (cleanDescription.length < 4) {
    errors.description = 'Описание должно содержать не менее 4 символов'
  }
  if (!categoriesList.some((item) => item.value === category.value)) {
    errors.category = 'Выберите категорию'
  }
  if (!date.value) {
    errors.date = 'Укажите дату расхода'
  }
  if (amount.value === '' || !Number.isSafeInteger(sum) || sum <= 0) {
    errors.amount = 'Укажите положительную сумму целым числом'
  }
  fieldErrors.value = errors
  return Object.keys(errors).length === 0
}
function clearFieldError(field) {
  if (!fieldErrors.value[field]) return
  const errors = { ...fieldErrors.value }
  delete errors[field]
  fieldErrors.value = errors
}
async function handleAddTransaction() {
  errorMessage.value = ''
  if (!validateExpense()) return
  isSubmitting.value = true
  try {
    await addTransaction({
      description: description.value.trim(),
      sum: Number(amount.value),
      category: category.value,
      date: date.value,
    })
    description.value = ''
    date.value = ''
    amount.value = ''
    fieldErrors.value = {}
    await loadTransactions()
  } catch (error) {
    errorMessage.value = error.message || 'Не удалось добавить расход'
  } finally {
    isSubmitting.value = false
  }
}
onMounted(loadTransactions)


</script>

<template>
  <div class="page-wrapper">
    <HeaderView />
    <main class="main-content">
      <h1 class="page-title">Мои расходы</h1>

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
              @submit.prevent="handleAddTransaction"
            >
              <div class="form-group">
                <label for="expDesc">Описание</label>
                <input
                  id="expDesc"
                  v-model.trim="description"
                  type="text"
                  placeholder="Введите описание"
                  required
                  minlength="4"
                  :aria-invalid="Boolean(fieldErrors.description)"
                  :class="{ input_invalid: fieldErrors.description }"
                  @input="clearFieldError('description')"
                >
                <p v-if="fieldErrors.description" class="field-error" role="alert">
                  {{ fieldErrors.description }}
                </p>
              </div>
              <fieldset class="expense-form__categories">
                <legend>Категория</legend>
                <div class="categories-grid">
                  <label
                    v-for="item in categoriesList"
                    :key="item.name"
                    class="category-label"
                    :class="{ 'category-label_active': category === item.value }"
                  >
                    <input
                      v-model="category"
                      type="radio"
                      name="category"
                      :value="item.value"
                      class="hidden-radio"
                    >
                    <!-- Динамически выводим картинку-иконку -->
                    <IconCategory :name="item.icon" class="category-icon" />
                    <span>{{ item.name }}</span>
                  </label>
                </div>
              </fieldset>
              <p v-if="fieldErrors.category" class="field-error" role="alert">
                {{ fieldErrors.category }}
              </p>
              <div class="form-group">
                <label for="expDate">Дата</label>
                <input
                  id="expDate"
                  v-model="date"
                  type="date"
                  required
                  :aria-invalid="Boolean(fieldErrors.date)"
                  :class="{ input_invalid: fieldErrors.date }"
                  @change="clearFieldError('date')"
                >
                <p v-if="fieldErrors.date" class="field-error" role="alert">
                  {{ fieldErrors.date }}
                </p>
              </div>
              <div class="form-group">
                <label for="expAmount">Сумма</label>
                <input
                  id="expAmount"
                  v-model="amount"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Введите сумму"
                  required
                  :aria-invalid="Boolean(fieldErrors.amount)"
                  :class="{ input_invalid: fieldErrors.amount }"
                  @input="clearFieldError('amount')"
                >
                <p v-if="fieldErrors.amount" class="field-error" role="alert">
                  {{ fieldErrors.amount }}
                </p>
              </div>
              
              <p v-if="errorMessage" class="form-error" role="alert">
                {{ errorMessage }}
              </p>

              <button
                type="submit"
                class="submit-btn"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Добавляем…' : 'Добавить новый расход' }}
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
.page-title {
  margin: 0 0 24px;
  color: #1f2430;
  font-size: 28px;
  font-weight: 600;
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
  font-size: 24px;
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
  font-size: 16px;
  font-weight: 500;
  color: #000000;
}
.expense-form input[type='number'] {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 0 14px;
  height: 44px;
  border: 1px solid #999999;
  
  font-size: 12px;
  border-radius: 8px;
  font: inherit;
  outline: none;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}
.expense-form input[type='number']:focus {
  border-color: #7334EA;
  background-color: #F1EBFD;
}
.expense-error {
  margin: 0 0 16px;
  color: #d94352;
  font-size: 12px;
  line-height: 1.4;
}
.expense-status {
  margin: 0 0 16px;
  color: #596579;
  font-size: 13px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-size: 16px;
  font-weight: 500;
  color: #000000;
}
.form-group input[type="text"], .form-group input[type="date"] {
  height: 44px;
  padding: 0 14px;
  border: 1px solid #999999;
  border-radius: 8px;
  outline: none;
  font-size: 12px;
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
  display: inline-flex;
  align-items: center;
  gap: 6px; /* Небольшой отступ между картинкой и текстом */
  padding: 8px 14px;
  border: 1px solid #F4F5F6;
  background-color: #F4F5F6;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: #000000;
  transition: all 0.2s;
}
.category-label_active {
  background-color: #F1EBFD;
  color: #7334EA;
  border-color: #F1EBFD;
}

/* Стили для иконки категории по ТЗ наставника */
.category-icon {
  width: 14px;
  height: 14px;
  color: currentColor;
  transition: color 0.2s;
  
}

.hidden-radio {
  display: none;
}
.submit-btn {
  height: 44px;
  border: none;
  border-radius: 6px;
  background-color: #793FED;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
}
.submit-btn:hover {
  background-color: #7334EA;
}
.field-error,
.form-error {
  margin: 6px 0 0;
  color: #d14343;
  font-size: 12px;
}

.expense-form input.input_invalid {
  border-color: #d14343;
}
</style>
