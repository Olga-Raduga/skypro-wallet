<script setup>
const props = defineProps({
  expenses: {
    type: Array,
    required: true,
  },
})
const amountFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2,
})
const dateFormatter = new Intl.DateTimeFormat('ru-RU')
function formatAmount(amount) {
  return amountFormatter.format(amount)
}
function formatDate(value) {
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return dateFormatter.format(date)
}
</script>
<template>
  <div class="table-container">
    <h2 class="table-title">Таблица расходов</h2>
    <table class="expenses-table">
      <thead>
        <tr>
          <th>Описание</th>
          <th>Категория</th>
          <th>Дата</th>
          <th>Сумма</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="props.expenses.length === 0">
          <td
            colspan="4"
            class="empty-state"
          >
            Пока расходов нет
          </td>
        </tr>
        <tr
          v-for="item in props.expenses"
          :key="item.id"
        >
          <td>{{ item.title }}</td>
          <td>
            <span class="category-tag">{{ item.category }}</span>
          </td>
          <td>{{ formatDate(item.date) }}</td>
          <td class="amount-cell">
            {{ formatAmount(item.amount) }}
          </td>
          <td class="delete-cell">
            <button type="button" class="delete-button" aria-label="Удалить расход">
              <svg
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M2 4h12" />
                <path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
                <path d="M3.5 4l.7 9.1a1 1 0 0 0 1 .9h5.6a1 1 0 0 0 1-.9L12.5 4" />
                <path d="M6.5 7v4" />
                <path d="M9.5 7v4" />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  background: #FFFFFF;
  border: 1px solid #D4DBE5;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
}
.table-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: left;
}
.expenses-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.expenses-table th {
  font-size: 12px;
  color: #999999;
  font-weight: 500;
  padding-bottom: 14px;
  border-bottom: 1px solid #EAEDF6;
}
.expenses-table td {
  padding: 14px 0;
  font-size: 12px;
  color: #000000;
  border-bottom: 1px solid #EAEDF6;
}
.category-tag {
  
  color: #000000;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
.delete-button {
  appearance: none;
  border: 0;
  padding: 4px;
  background: transparent;
  box-shadow: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #999;
  cursor: pointer;
}
.delete-button:hover {
  background: transparent;
  color: #7334ea;
}
</style>
