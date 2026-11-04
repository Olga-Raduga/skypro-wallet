
<script setup>
import HeaderView from '../components/HeaderView.vue'
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
// Демо-данные: два месяца подряд, как на макете.
const months = [
  {
    title: 'Июль 2026',
    // первое число — среда (Пн=0, Вт=1, Ср=2) → 2 пустых
    leadingEmpty: 2,
    days: 31,
  },
  {
    title: 'Август 2026',
    // август начинается в субботу (Пн=0 … Сб=5) → 5 пустых
    leadingEmpty: 5,
    days: 31,
  },
]

const selectedDay = 15
// Демонстрационные данные для отображения диаграммы.
const chartItems = [
  {
    name: 'Продукты',
    value: '4 310 ₽',
    height: '88%',
    color: '#c99cff',
  },
  {
    name: 'Транспорт',
    value: '0 ₽',
    height: '3%',
    color: '#ffbb4a',
  },
  {
    name: 'Жильё',
    value: '0 ₽',
    height: '3%',
    color: '#a6a2ff',
  },
  {
    name: 'Развлечения',
    value: '1 599 ₽',
    height: '38%',
    color: '#ff9eac',
  },
  {
    name: 'Образование',
    value: '0 ₽',
    height: '3%',
    color: '#a6d92f',
  },
  {
    name: 'Другое',
    value: '1 540 ₽',
    height: '37%',
    color: '#a8b3ff',
  },
]
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

                <span
                  v-for="d in month.days"
                  :key="`day-${month.title}-${d}`"
                  class="calendar-day"
                  :class="{ 'calendar-day--selected': d === selectedDay }"
                >
                  {{ d }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="calendar-footer">
            <span class="calendar-footer__label">Пример периода</span>
            <strong>15 июля 2026</strong>
          </div>
        </article>
        <article class="panel chart-panel">
          <header class="panel-header">
            <div>
              <h2 class="panel-title">Расходы по категориям</h2>
              <p class="panel-subtitle">Расходы за июль 2026</p>
            </div>
            <div class="total-block">
              <span class="total-block__label">Всего расходов</span>
              <strong>7 449 ₽</strong>
            </div>
          </header>
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
  max-height: 340px;
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
  background: #d4d9e4;
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
  aspect-ratio: 1 / 1;   /* круг ровный независимо от ширины */
  place-items: center;
  border: none;
  border-radius: 50%;
  color: #333b4a;
  font-size: 12px;
  cursor: default;
}
.calendar-day--empty {
  background: transparent;
}
.calendar-day--selected {
  background: #F1EBFD;
  color: #7334EA;
  font-weight: 600;
}
.calendar-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #edf0f5;
  font-size: 13px;
}
.calendar-footer__label {
  color: #8993a5;
}
.calendar-footer strong {
  color: #333b4a;
  font-weight: 500;
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