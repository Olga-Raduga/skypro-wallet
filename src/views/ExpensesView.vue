<script setup>
import { onMounted, ref } from 'vue'
import HeaderView from '../components/HeaderView.vue'
import ExpensesTable from '../components/ExpensesTable.vue'
import PeriodFilter from '../components/PeriodFilter.vue'
import ExpenseForm from '../components/ExpenseForm.vue'

import { CATEGORY_LABELS } from '../constants/categories.js'

import {
  addTransaction,
  getTransactions,
  getTransactionsByPeriod,
} from '../api/transactions.js'

const expenses = ref([])


const isLoading = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')


const periodStart = ref('')
const periodEnd = ref('')
const expenseFormRef = ref(null)




function toExpenseRow(transaction) {
  return {
    id: transaction._id,
    title: transaction.description,
    category: CATEGORY_LABELS[transaction.category] ?? transaction.category,
    date: transaction.date?.slice(0, 10) ?? '',
    amount: transaction.sum,
  }
}
async function loadTransactions() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const transactions = 
    periodStart.value && periodEnd.value
    ? await getTransactionsByPeriod(periodStart.value, periodEnd.value)
    : await getTransactions()
    expenses.value = transactions.map(toExpenseRow)
  } catch (error) {
    errorMessage.value = error.message || 'Не удалось загрузить расходы'
  } finally {
    isLoading.value = false
  }
}

async function handleAddTransaction(payload) {
  errorMessage.value = ''
  isSubmitting.value = true

  
  try {
    await addTransaction(payload)
    expenseFormRef.value?.resetForm()
    await loadTransactions()
  } catch (error) {
    errorMessage.value = error.message || 'Не удалось добавить расход'
  } finally {
    isSubmitting.value = false
  }
}
async function handlePeriodSearch({ start, end }) {
  periodStart.value = start
  periodEnd.value = end
  await loadTransactions()
  }
  
async function resetPeriod() {
  periodStart.value = ''
  periodEnd.value = ''
  await loadTransactions()
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
          <PeriodFilter
            :is-loading="isLoading"
            @search="handlePeriodSearch"
            @reset="resetPeriod"
          />
          <ExpensesTable :expenses="expenses" />             
        </div>
  
        <div class="layout-right">
          <ExpenseForm
            ref="expenseFormRef"
            :is-submitting="isSubmitting"
            :server-error="errorMessage"
            @submit-expense="handleAddTransaction"
          />
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

</style>
