<script setup>
import { onMounted, ref } from 'vue'
import HeaderView from '../components/HeaderView.vue'
import ExpensesTable from '../components/ExpensesTable.vue'
import { RouterLink } from 'vue-router'
import PeriodFilter from '../components/PeriodFilter.vue'
import ExpenseForm from '../components/ExpenseForm.vue'

import { CATEGORY_LABELS } from '../constants/categories.js'

import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  getTransactionsByPeriod,
} from '../api/transactions.js'

const expenses = ref([])


const isLoading = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')
const deletingId = ref('')
const deleteErrorMessage = ref('')


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

async function handleDeleteExpense(id) {
  if (deletingId.value) return
  if (!window.confirm('Удалить этот расход?')) return
  deletingId.value = String(id)
  deleteErrorMessage.value = ''
  try {
    await deleteTransaction(id)
    expenses.value = expenses.value.filter(
      (expense) => String(expense.id) !== String(id)
    )
  } catch (error) {
    deleteErrorMessage.value =
      error.message || 'Не удалось удалить расход'
  } finally {
    deletingId.value = ''
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
      <div class="page-heading">
        <h1 class="page-title">Мои расходы</h1>
        <RouterLink class="mobile-new-expense" to="/new-expense">
          <span aria-hidden="true">＋</span>
          Новый расход
        </RouterLink>
      </div>

      <div class="content-layout">
        <div class="layout-left">
          <PeriodFilter
            :is-loading="isLoading"
            @search="handlePeriodSearch"
            @reset="resetPeriod"
          />
          <p v-if="deleteErrorMessage" class="page-error" role="alert">
            {{ deleteErrorMessage }}
          </p>
          <ExpensesTable 
            :expenses="expenses"
            :deleting-id="deletingId"
            @delete="handleDeleteExpense" 
          />             
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
  width: 100%;
  background-color: #FAFAFA;
  display: flex;
  flex-direction: column;
}
.main-content {
  padding: 40px;
  flex-grow: 1;
  width: min(1440px, 100%);
  margin: 0 auto;
}
.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}
.page-title {
  margin: 0;
  color: #1f2430;
  font-size: 28px;
  font-weight: 700;
}
.page-error {
  margin: 0 0 16px;
  color: #d14343;
  font-size: 13px;
}
.content-layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 30px;
  align-items: start;
  width: 100%;
}
.layout-left,
.layout-right {
  min-width: 0;
  width: auto; 
}



@media (max-width: 900px) {
  .main-content {
    padding: 32px 24px;
  }
  .content-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .main-content {
    padding: 24px 16px;
  }
  .page-title {
    margin-bottom: 18px;
    font-size: 23px;
  }
}
.mobile-new-expense {
  display: none;
}
@media (max-width: 480px) {
  .page-heading {
    margin-bottom: 18px;
  }
  .page-title {
    font-size: 24px;
  }
  .mobile-new-expense {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #222;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
  }
  .layout-right {
    display: none;
  }
}


</style>
