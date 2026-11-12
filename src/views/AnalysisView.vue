
<script setup>
import { computed, onMounted, ref } from 'vue'
import HeaderView from '../components/HeaderView.vue'
import { CATEGORIES } from '../constants/categories.js'
import { formatMoney } from '../utils/format.js'
import {
  getTransactions,
  getTransactionsByPeriod,
} from '../api/transactions.js'

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const today = new Date()
const visibleMonth = ref(
  new Date(today.getFullYear(), today.getMonth(), 1, 12)
)
const selectedStart = ref('')
const selectedEnd = ref('')
const transactions = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
function toInputDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
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


const months = computed(() => {
  const base = visibleMonth.value
  const count = 12 // сколько месяцев показываем подряд (можно изменить)

  return Array.from({ length: count }, (_, offset) => {
    const firstDay = new Date(
      base.getFullYear(),
      base.getMonth() + offset,
      1,
      12
    )
    const year = firstDay.getFullYear()
    const month = firstDay.getMonth()
    const daysInMonth = new Date(year, month + 1, 0, 12).getDate()
    return {
      title: new Intl.DateTimeFormat('ru-RU', {
        month: 'long',
        year: 'numeric',
      }).format(firstDay),
      leadingEmpty: (firstDay.getDay() + 6) % 7,
      days: Array.from({ length: daysInMonth }, (_, index) => {
        const date = new Date(year, month, index + 1, 12)
        return {
          day: index + 1,
          value: toInputDate(date),
        }
      }),
    }
  })
})


function isDaySelected(value) {
  return value === selectedStart.value || value === selectedEnd.value
}
function isDayInRange(value) {
  return Boolean(
    selectedStart.value &&
      selectedEnd.value &&
      value > selectedStart.value &&
      value < selectedEnd.value
  )
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
  // Первый клик задаёт начало нового периода.
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
const selectedPeriodLabel = computed(() => {
  if (!selectedStart.value) {
    return 'Выберите начало и конец периода'
  }
  if (!selectedEnd.value) {
    return `Начало: ${formatDateRu(selectedStart.value)} — выберите конец`
  }
  return `${formatDateRu(selectedStart.value)} — ${formatDateRu(selectedEnd.value)}`
})
const chartPeriodLabel = computed(() => {
  if (!selectedStart.value || !selectedEnd.value) {
    return 'Все загруженные транзакции'
  }
  return `Расходы за ${formatDateRu(selectedStart.value)} — ${formatDateRu(selectedEnd.value)}`
})
const categories = CATEGORIES.map(({ key, label, color }) => ({
  key,
  name: label,
  color,
}))


const totalExpenses = computed(() =>
  transactions.value.reduce(
    (total, transaction) => total + Number(transaction.sum || 0),
    0
  )
)
const chartItems = computed(() => {
  const totalsByCategory = categories.map((category) => ({
    ...category,
    amount: transactions.value
      .filter((transaction) => transaction.category === category.key)
      .reduce((total, transaction) => total + Number(transaction.sum || 0), 0),
  }))
  const maxAmount = Math.max(
    1,
    ...totalsByCategory.map((category) => category.amount)
  )
  return totalsByCategory.map((category) => ({
    name: category.name,
    value: formatMoney(category.amount),
    height:
      category.amount === 0
        ? '0%'
        : `${Math.max(3, (category.amount / maxAmount) * 100)}%`,
    color: category.color,
  }))
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
        <article class="panel calendar-panel">
          <header class="panel-header">
            <div>
              <h2 class="panel-title">Период</h2>
            </div>
          </header>
          <!-- Сетка дней недели (фиксированная, не скроллится) -->
          <div
            class="calendar-weekdays"
          >
            <span
              v-for="dayName in weekDays"
              :key="dayName"
              class="weekday"
            >
              {{ dayName }}
            </span>
          </div> 

          <!-- Прокручиваемый блок с месяцами -->
          <div class="calendar-scroll">
            <div
              v-for="month in months"
              :key="month.title"
              class="calendar-month"
            >
              <p class="month-title">{{ month.title }}</p>

              <div class="calendar-grid">
                <span
                  v-for="i in month.leadingEmpty"
                  :key="`empty-${month.title}-${i}`"
                  class="calendar-day calendar-day--empty"
                ></span>

                <button
                  v-for="day in month.days"
                  :key="day.value"
                  type="button"
                  class="calendar-day"
                  :class="{
                    'calendar-day--selected': isDaySelected(day.value),
                    'calendar-day--in-range': isDayInRange(day.value),
                  }"
                  :disabled="isLoading"
                  @click="selectDate(day.value)"
                >
                  {{ day.day }}
                </button>
              </div>
            </div>
          </div>
          
          <div class="calendar-footer">
            <div class="calendar-footer__info">
              <span class="calendar-footer__label">Выбранный период</span>
              <strong class="calendar-footer__value">{{ selectedPeriodLabel }}</strong>
            </div>
            <button 
              type="button"
              class="calendar-footer__reset-btn" :disabled="isLoading" 
              @click="resetPeriod"
            >
              Сбросить
            </button>
          </div>
        </article>
        <article class="panel chart-panel">
          <header class="panel-header">
            <div>
              <h2 class="panel-title">Расходы по категориям</h2>
              <p class="panel-subtitle">{{ chartPeriodLabel }}</p>
            </div>
            <div class="total-block">
              <span class="total-block__label">Всего расходов</span>
              <strong>{{ formatMoney(totalExpenses) }}</strong>
            </div>
          </header>

          <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
          <p v-else-if="isLoading">Загружаем транзакции…</p>
          <p v-else-if="transactions.length === 0">За этот период расходов нет</p>

          <div class="chart-scroll">
            <div
              class="bar-chart"
              role="img"
              aria-label="Столбчатая диаграмма расходов по категориям"
            >
              <div
                v-for="item in chartItems"
                :key="item.name"
                class="chart-column"
              >
                <div
                  class="bar-stage"
                  :style="{
                    '--bar-height': item.height,
                    '--bar-color': item.color,
                  }"
                >
                  <span class="bar-value">{{ item.value }}</span>
                  <div class="bar"></div>
                </div>
                <span class="chart-label">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </article>
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
.panel {
  min-width: 0;
  padding: 24px;
  border: 1px solid #e2e6ee;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgb(31 36 48 / 4%);
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
}
.panel-title {
  margin: 0;
  color: #1f2430;
  font-size: 24px;
  font-weight: 600;
}
.panel-subtitle {
  margin: 8px 0 0;
  color: #8993a5;
  font-size: 12px;
}
.month-arrows {
  display: flex;
  gap: 8px;
  color: #8993a5;
  font-size: 24px;
  line-height: 1;
}
.month-arrows span {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid #e2e6ee;
  border-radius: 8px;
}

/* --- КАЛЕНДАРЬ --- */
.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
  margin-bottom: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid #edf0f5;   
}
.weekday {
  padding: 10px 0;
  color: #8993a5;
  font-size: 12px;
  text-align: center;
}
/* Прокручиваемая область с месяцами */

.calendar-scroll {
  max-height: 420px;
  overflow-y: auto;
  padding-right: 6px; /* место под скроллбар */
  scrollbar-width: thin;
  scrollbar-color: #d4d9e4 transparent;
}

.calendar-scroll::-webkit-scrollbar {
  width: 6px;
}

.calendar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.calendar-scroll::-webkit-scrollbar-thumb {
  background: #D9D9D9;
  border-radius: 3px;
}

.calendar-scroll::-webkit-scrollbar-thumb:hover {
  background: #b8bfd0;
}

.month-title {
  margin: 16px 0 8px;
  padding-left: 4px;
  color: #1f2430;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
}

.calendar-month:first-child .month-title {
  margin-top: 4px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
}

.calendar-day {
  display: grid;
  aspect-ratio: 1 / 1;
  place-items: center;
  border: none;
  border-radius: 50%;
  color: #000000;
  font-size: 12px;
  cursor: default;
}
.calendar-day--empty {
  background: transparent;
}
.calendar-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  padding: 4px;
  background: #FAFAFA;
  border-top: 1px solid #D4DBE5;
  border-radius: 8px;
  font-size: 10px;
  text-align: left;
}
.calendar-footer__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.calendar-footer__label {
  color: #737e91;
  font-size: 10px;
}
.calendar-footer__reset-btn {
  height: 32px;
  width: 100%;
  border: 1px solid #D4DBE5;
  background: #FFFFFF;
  color: #94A6BE;
  border-radius: 6px;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.calendar-footer__reset-btn:hover:not(:disabled) {
  color: #793FED;
  border-color: #793FED;
}
.calendar-footer strong {
  color: #737e91;
  font-weight: 500;
}

.calendar-month-controls {
  display: flex;
  gap: 8px;
}

.calendar-day--selected {
  border-radius: 50%;
  background: #F1EBFD;
  color: #7334EA;
  font-weight: 400;
}

.calendar-day--in-range {
  border-radius: 50%;
  background: #eee9ff;
  color: #7334EA;
}

.calendar-day:disabled {
  cursor: wait;
  opacity: 0.6;
}

/* --- ГРАФИК --- */
.total-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  white-space: nowrap;
}
.total-block__label {
  color: #8993a5;
  font-size: 12px;
}
.total-block strong {
  color: #1f2430;
  font-size: 16px;
}
.chart-scroll {
  overflow-x: auto;
}
.bar-chart {
  display: grid;
  min-width: 540px;
  grid-template-columns: repeat(6, minmax(64px, 1fr));
  gap: 12px;
}
.chart-column {
  min-width: 0;
  text-align: center;
}
.bar-stage {
  position: relative;
  height: 230px;
  border-bottom: 1px solid #dfe4ed;
  background: repeating-linear-gradient(
    to top,
    transparent 0,
    transparent calc(25% - 1px),
    #edf0f5 calc(25% - 1px),
    #edf0f5 25%
  );
}
.bar {
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 50%;
  width: min(56px, 68%);
  height: var(--bar-height);
  transform: translateX(-50%);
  border-radius: 8px 8px 2px 2px;
  background: var(--bar-color);
}
.bar-value {
  position: absolute;
  z-index: 2;
  bottom: calc(var(--bar-height) + 8px);
  left: 50%;
  color: #50596b;
  font-size: 11px;
  white-space: nowrap;
  transform: translateX(-50%);
}
.chart-label {
  display: block;
  margin-top: 10px;
  color: #737e91;
  font-size: 11px;
  line-height: 1.35;
  overflow-wrap: anywhere;
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
  .panel {
    padding: 18px;
  }
  .panel-header {
    flex-wrap: wrap;
  }
}
</style>