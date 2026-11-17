<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import HeaderView from '../components/HeaderView.vue'
import ExpenseForm from '../components/ExpenseForm.vue'
import { addTransaction } from '../api/transactions.js'
const router = useRouter()
const isSubmitting = ref(false)
const errorMessage = ref('')
async function handleAddTransaction(payload) {
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    await addTransaction(payload)
    await router.push('/expenses')
  } catch (error) {
    errorMessage.value =
      error.message || 'Не удалось добавить расход'
  } finally {
    isSubmitting.value = false
  }
}
</script>
<template>
  <div class="new-expense-page">
    <HeaderView />
    <main class="new-expense-content">
      <RouterLink class="back-to-expenses" to="/expenses">
        ← Мои расходы
      </RouterLink>
      <ExpenseForm
        :is-submitting="isSubmitting"
        :server-error="errorMessage"
        @submit-expense="handleAddTransaction"
      />
    </main>
  </div>
</template>
<style scoped>
.new-expense-page {
  min-height: 100vh;
  background: #fafafa;
}
.new-expense-content {
  width: min(480px, 100%);
  margin: 0 auto;
  padding: 24px 16px;
}
.back-to-expenses {
  display: inline-block;
  margin-bottom: 16px;
  color: #7334ea;
  font-size: 13px;
  text-decoration: none;
}
</style>