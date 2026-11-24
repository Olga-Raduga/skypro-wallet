<script setup>
import { computed } from 'vue'
import { CATEGORIES } from '../constants/categories.js'
import { formatMoney } from '../utils/format.js'

const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
  periodLabel: {
    type: String,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
})

const totalExpenses = computed(() =>
  props.transactions.reduce(
    (total, transaction) => total + Number(transaction.sum || 0),
    0
  )
)

const chartItems = computed(() => {
  const totalsByCategory = CATEGORIES.map((category) => ({
    ...category,
    amount: props.transactions
      .filter((transaction) => transaction.category === category.key)
      .reduce((total, transaction) => total + Number(transaction.sum || 0), 0),
  }))

  const maxAmount = Math.max(
    1,
    ...totalsByCategory.map((category) => category.amount)
  )

  return totalsByCategory.map((category) => ({
    name: category.label,
    value: formatMoney(category.amount),
    height:
      category.amount === 0
        ? '0%'
        : `${Math.max(3, (category.amount / maxAmount) * 100)}%`,
    color: category.color,
  }))
})
</script>

<template>
  <article class="panel chart-panel">
    <header class="panel-header">
      <div class="chart-heading">
        <h2 class="panel-title panel-title--desktop">Расходы по категориям</h2>
        <h2 class="panel-title panel-title--mobile">Анализ расходов</h2>
        <p class="panel-subtitle">{{ periodLabel }}</p>
      </div>
      <div class="total-block">
        <span class="total-block__label">Всего расходов</span>
        <strong>{{ formatMoney(totalExpenses) }}</strong>
      </div>
    </header>

    <p v-if="errorMessage" class="chart-message" role="alert">
      {{ errorMessage }}
    </p>
    <p v-else-if="isLoading" class="chart-message">
      Загружаем транзакции…
    </p>
    <p v-else-if="transactions.length === 0" class="chart-message">
      За этот период расходов нет
    </p>

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
</template>

<style scoped>
.panel {
  box-sizing: border-box;
  width: 100%;
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
.chart-heading {
  min-width: 0;
}
.panel-title {
  margin: 0;
  color: #1f2430;
  font-size: 24px;
  font-weight: 700;
}
.panel-subtitle {
  max-width: 100%;
  margin: 8px 0 0;
  color: #8993a5;
  font-size: 12px;
  overflow-wrap: anywhere;
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
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}
.chart-message {
  margin: 0 0 16px;
  color: #737e91;
  font-size: 13px;
}
.chart-scroll {
  width: 100%;
  min-width: 0;
}
.bar-chart {
  display: grid;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
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
  border-radius: 6px 6px 2px 2px;
  background: var(--bar-color);
}
.bar-value {
  position: absolute;
  z-index: 2;
  bottom: calc(var(--bar-height) + 8px);
  left: 50%;
  width: max-content;
  max-width: 100%;
  color: #50596b;
  font-size: 11px;
  line-height: 1.15;
  text-align: center;
  overflow-wrap: anywhere;
  transform: translateX(-50%);
}
.chart-label {
  display: block;
  margin-top: 12px;
  padding-top: 4px; 
  color: #737e91;
  font-size: 11px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}
.panel-title--mobile {
  display: none; /* на десктопе мобильный заголовок скрыт */
}
@media (max-width: 560px) {
  .panel {
    padding: 16px;
    background: #f7f8fc;
    border: none;
  }
  .panel-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  .panel-title--desktop {
    display: none;
  }

  .panel-title--mobile {
    display: block;
  }
  .panel-title {
    font-size: 22px;
    line-height: 1.2;
    margin-bottom: 16px;
  }
  .chart-heading .panel-title--mobile {
    margin-bottom: 16px;
  }
  .panel-subtitle {
    margin-top: 0; 
  }
  .total-block {
    align-items: flex-start;
    white-space: normal;
  }
  .total-block__label {
  display: none;
}
  .total-block strong {
    font-size: 20px;
  }
  .chart-scroll {
    width: 100%;
    min-width: 0;
  }
  .bar-chart {
    width: 100%;
    min-width: 0;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 4px;
  }
  .chart-column {
    min-width: 0;
  }
  .bar {
  width: min(44px, 80%);
}
  .bar-stage {
    height: 190px;
  }
  
  .bar-value {
    max-width: 100%;
    font-size: 8px;
    white-space: normal;
    overflow-wrap: anywhere;
  }
  .chart-label {
    font-size: 8px;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }
  
}
</style>