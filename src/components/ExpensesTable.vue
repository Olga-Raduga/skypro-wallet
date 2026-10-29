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
          <th>Название</th>
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
  font-size: 18px;
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
  font-size: 14px;
  color: #94A6BE;
  font-weight: 500;
  padding-bottom: 14px;
  border-bottom: 1px solid #EAEDF6;
}
.expenses-table td {
  padding: 14px 0;
  font-size: 14px;
  color: #000000;
  border-bottom: 1px solid #EAEDF6;
}
.category-tag {
  background: #EAEEF6;
  color: #565EEF;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
.amount-cell {
  font-weight: 600;
}
</style>
