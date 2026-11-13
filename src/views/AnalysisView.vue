
<script setup>
import { computed, onMounted, ref } from 'vue'
import HeaderView from '../components/HeaderView.vue'
import PeriodCalendar from '../components/PeriodCalendar.vue'
import CategoryBarChart from '../components/CategoryBarChart.vue'

import {
  getTransactions,
  getTransactionsByPeriod,
} from '../api/transactions.js'

const selectedStart = ref('')
const selectedEnd = ref('')
const transactions = ref([])
const isLoading = ref(false)
const errorMessage = ref('')


function formatDateRu(value) {
  if (!value) return ''
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day, 12)
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}



async function loadAllTransactions() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const result = await getTransactions()
    transactions.value = Array.isArray(result) ? result : []
  } catch (error) {
    errorMessage.value = error.message || 'Не удалось загрузить транзакции'
  } finally {
    isLoading.value = false
  }
}

async function loadPeriodTransactions() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const result = await getTransactionsByPeriod(
      selectedStart.value,
      selectedEnd.value
    )
    transactions.value = Array.isArray(result) ? result : []
  } catch (error) {
    errorMessage.value = error.message || 'Не удалось загрузить период'
  } finally {
    isLoading.value = false
  }
}



async function selectDate(value) {
  if (isLoading.value) return
  
  if (!selectedStart.value || selectedEnd.value) {
    selectedStart.value = value
    selectedEnd.value = ''
    return
  }
  // Если конец выбран раньше начала, переставляем даты местами.
  if (value < selectedStart.value) {
    selectedEnd.value = selectedStart.value
    selectedStart.value = value
  } else {
    selectedEnd.value = value
  }
  await loadPeriodTransactions()
}

async function resetPeriod() {
  selectedStart.value = ''
  selectedEnd.value = ''
  await loadAllTransactions()
}

const chartPeriodLabel = computed(() => {
  if (!selectedStart.value || !selectedEnd.value) {
    return 'Все загруженные транзакции'
  }
  return `Расходы за ${formatDateRu(selectedStart.value)} — ${formatDateRu(selectedEnd.value)}`
})

onMounted(loadAllTransactions)
</script>

<template>
  <div class="analysis-page">
    <HeaderView />
    <main class="analysis-content">
      <h1 class="page-title">Анализ расходов</h1>
      <section
        class="analysis-layout"
        aria-label="Анализ расходов за выбранный период"
      >
        <PeriodCalendar
          :selected-start="selectedStart"
          :selected-end="selectedEnd"
          :is-loading="isLoading"
          @select-date="selectDate"
          @reset="resetPeriod"
        />
        <CategoryBarChart
          :transactions="transactions"
          :period-label="chartPeriodLabel"
          :is-loading="isLoading"
          :error-message="errorMessage"
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.analysis-page {
  min-height: 100vh;
  width: 100%;
  background: #f7f8fc;
}
.analysis-content {
  width: min(1440px, 100%);
  margin: 0 auto;
  padding: 36px 40px 56px;
}
.page-title {
  margin: 0 0 24px;
  color: #1f2430;
  font-size: 28px;
  font-weight: 600;
}
.analysis-layout {
  display: grid;
  grid-template-columns: minmax(280px, 0.85fr) minmax(0, 1.6fr);
  gap: 24px;
  align-items: start;
}

@media (max-width: 900px) {
  .analysis-layout {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 560px) {
  .analysis-content {
    padding: 24px 16px 40px;
  }
  .page-title {
    font-size: 23px;
  }
  
}
</style>