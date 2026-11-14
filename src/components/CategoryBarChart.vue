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
      <div>
        <h2 class="panel-title">Расходы по категориям</h2>
        <p class="panel-subtitle">{{ periodLabel }}</p>
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
.panel-subtitle {
  margin: 8px 0 0;
  color: #8993a5;
  font-size: 12px;
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
  margin-top: 12px;
  padding-top: 4px; 
  color: #737e91;
  font-size: 11px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}
@media (max-width: 560px) {
  .panel {
    padding: 18px;
  }
  .panel-header {
    flex-wrap: wrap;
  }
}
</style>