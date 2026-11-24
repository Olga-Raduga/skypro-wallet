
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
const mobileValidationError = ref('')

// На телефоне сначала показываем диаграмму.
const activeMobileView = ref('chart')


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

  mobileValidationError.value = ''
  // Начинаем новый выбор периода.
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
  mobileValidationError.value = ''
  await loadAllTransactions()
}

function showCalendar() {
  mobileValidationError.value = ''
  activeMobileView.value = 'calendar'
}
function showChart() {
  if (selectedStart.value && !selectedEnd.value) {
    mobileValidationError.value = 'Выберите дату окончания периода'
    return
  }
  mobileValidationError.value = ''
  activeMobileView.value = 'chart'
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
        <div
          class="analysis-panel analysis-panel--calendar"
          :class="{ 'analysis-panel--hidden-mobile': activeMobileView !== 'calendar' }"
        >
          <PeriodCalendar
            :selected-start="selectedStart"
            :selected-end="selectedEnd"
            :is-loading="isLoading"
            @select-date="selectDate"
            @reset="resetPeriod"
            @show-analysis="showChart"
          />
        </div> 
        <div
          class="analysis-panel analysis-panel--chart"
          :class="{ 'analysis-panel--hidden-mobile': activeMobileView !== 'chart' }"
        >
          <CategoryBarChart
            :transactions="transactions"
            :period-label="chartPeriodLabel"
            :is-loading="isLoading"
            :error-message="errorMessage"
          />
        </div>             
      </section>

      <p
        v-if="activeMobileView === 'calendar' && errorMessage"
        class="mobile-feedback"
        role="alert"
      >
        {{ errorMessage }}
      </p>
      <p
        v-if="mobileValidationError"
        class="mobile-feedback"
        role="alert"
      >
        {{ mobileValidationError }}
      </p>
      <div class="mobile-analysis-actions">
        <button
          v-if="activeMobileView === 'chart'"
          type="button"
          class="mobile-analysis-button"
          @click="showCalendar"
        >
          Выбрать другой период
        </button>
        <button
          v-else
          type="button"
          class="mobile-analysis-button"
          :disabled="isLoading"
          @click="showChart"
        >
          Выбрать период
        </button>
      </div>
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
  box-sizing: border-box;
}
.page-title {
  margin: 0 0 24px;
  color: #1f2430;
  font-size: 28px;
  font-weight: 700;
}
.analysis-layout {
  display: grid;
  grid-template-columns: minmax(280px, 0.85fr) minmax(0, 1.6fr);
  gap: 24px;
  align-items: start;
}
.analysis-panel {
  min-width: 0;
}
.mobile-analysis-actions {
  display: none;
}
.mobile-feedback {
  margin: 12px 0 0;
  color: #f25050;
  font-size: 13px;
}

@media (max-width: 900px) {
  .analysis-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 560px) {
  .analysis-content {
    padding: 24px 16px 40px;
  }
  .page-title {
    display: none;
  }
  .analysis-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
  .analysis-panel--hidden-mobile {
    display: none;
  }
  .mobile-analysis-actions {
    display: grid;
    margin-top: 16px;
  }
  .mobile-analysis-button {
    width: 100%;
    min-height: 39px;
    padding: 12px 16px;
    border: 0;
    border-radius: 8px;
    background: #793fed;
    color: #fff;
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }
  .mobile-analysis-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}
</style>