<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  selectedStart: {
    type: String,
    default: '',
  },
  selectedEnd: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-date', 'reset'])

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const today = new Date()
const scrollContainerRef = ref(null)
const currentMonthRef = ref(null)

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

// 12 прошедших месяцев + текущий (0) + 12 будущих
const months = computed(() => {
  const offsets = Array.from({ length: 73 }, (_, i) => i - 36)
  return offsets.map((offset) => {
    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth() + offset,
      1,
      12
    )
    const year = firstDay.getFullYear()
    const month = firstDay.getMonth()
    const daysInMonth = new Date(year, month + 1, 0, 12).getDate()

    return {
      isCurrent: offset === 0,
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

const selectedPeriodLabel = computed(() => {
  if (!props.selectedStart) {
    return 'Выберите начало и конец периода'
  }
  if (!props.selectedEnd) {
    return `Начало: ${formatDateRu(props.selectedStart)} — выберите конец`
  }
  return `${formatDateRu(props.selectedStart)} — ${formatDateRu(props.selectedEnd)}`
})

function isDaySelected(value) {
  return value === props.selectedStart || value === props.selectedEnd
}

function isDayInRange(value) {
  return Boolean(
    props.selectedStart &&
      props.selectedEnd &&
      value > props.selectedStart &&
      value < props.selectedEnd
  )
}

// Автоматически прокручиваем скролл к текущему месяцу при загрузке
onMounted(async () => {
  await nextTick()
  const el = Array.isArray(currentMonthRef.value)
    ? currentMonthRef.value[0]
    : currentMonthRef.value
  if (scrollContainerRef.value && el) {
    scrollContainerRef.value.scrollTop = el.offsetTop - 8
  }
})
</script>

<template>
  <article class="panel calendar-panel">
    <header class="panel-header">
      <div>
        <h2 class="panel-title">Период</h2>
      </div>
    </header>

    <div class="calendar-weekdays">
      <span
        v-for="dayName in weekDays"
        :key="dayName"
        class="weekday"
      >
        {{ dayName }}
      </span>
    </div>

    <div ref="scrollContainerRef" class="calendar-scroll">
      <div
        v-for="month in months"
        :key="month.title"
        :ref="month.isCurrent ? 'currentMonthRef' : undefined"
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
            @click="emit('select-date', day.value)"
          >
            {{ day.day }}
          </button>
        </div>
      </div>
    </div>

    <div class="calendar-footer">
      <div class="calendar-footer__info">
        <span class="calendar-footer__label">Выбранный период</span>
        <span class="calendar-footer__value">{{ selectedPeriodLabel }}</span>
      </div>
      <button
        type="button"
        class="calendar-footer__reset-btn"
        :disabled="isLoading"
        @click="emit('reset')"
      >
        Сбросить
      </button>
    </div>
  </article>
</template>

<style scoped>
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
.calendar-scroll {
  position: relative;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 6px;
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
  background: transparent;
  color: #000000;
  font-size: 12px;
  cursor: pointer;
}
.calendar-day:hover:not(:disabled):not(.calendar-day--empty) {
  background: #f4f5f6;
}
.calendar-day--empty {
  cursor: default;
}
.calendar-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  padding: 14px;
  background: #FAFAFA;
  border: 1px solid #D4DBE5;
  border-radius: 8px;
  font-size: 12px;
  text-align: left;
}
.calendar-footer__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.calendar-footer__label {
  color: #737e91;
  font-size: 12px;
}
.calendar-footer__value {
  color: #1f2430;
  font-weight: 600;
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
.calendar-day--selected {
  border-radius: 50%;
  background: #F1EBFD;
  color: #7334EA;
}
.calendar-day--in-range {
  border-radius: 50%;
  background: #F1EBFD;
  color: #7334EA;
}
.calendar-day:disabled {
  cursor: wait;
  opacity: 0.6;
}
@media (max-width: 560px) {
  .panel {
    padding: 18px;
  }
}
</style>