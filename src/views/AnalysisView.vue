
<script setup>
import HeaderView from '../components/HeaderView.vue'
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
// Июль 2026 начинается в среду: перед первым числом два пустых места.
// Даты и цифры ниже нужны только для статичной верстки.
const calendarDays = [
  null,
  null,
  ...Array.from({ length: 31 }, (_, index) => index + 1),
  null,
  null,
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
              <p class="panel-subtitle">Июль 2026</p>
            </div>
            <div
              class="month-arrows"
              aria-hidden="true"
            >
              <span>‹</span>
              <span>›</span>
            </div>
          </header>
          <div
            class="calendar-grid"
            aria-label="Календарь за июль 2026"
          >
            <span
              v-for="dayName in weekDays"
              :key="dayName"
              class="weekday"
            >
              {{ dayName }}
            </span>
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              class="calendar-day"
              :class="{
                'calendar-day--empty': day === null,
                'calendar-day--selected': day === selectedDay,
              }"
            >
              <span v-if="day !== null">
                {{ day }}
              </span>
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
              <p class="panel-subtitle">Июль 2026</p>
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
  margin-bottom: 24px;
}
.panel-title {
  margin: 0;
  color: #1f2430;
  font-size: 18px;
  font-weight: 600;
}
.panel-subtitle {
  margin: 8px 0 0;
  color: #8993a5;
  font-size: 14px;
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
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
}
.weekday {
  padding: 8px 0;
  color: #8993a5;
  font-size: 12px;
  text-align: center;
}
.calendar-day {
  display: grid;
  min-height: 40px;
  place-items: center;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  color: #333b4a;
  font-size: 13px;
}
.calendar-day--empty {
  border-color: transparent;
}
.calendar-day--selected {
  border-color: #793fed;
  background: #793fed;
  color: #fff;
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
  .calendar-day {
    min-height: 36px;
  }
}
</style>