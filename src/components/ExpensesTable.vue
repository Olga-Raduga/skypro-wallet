<script setup>
import { computed, ref, watch } from 'vue'
import { formatMoney } from '../utils/format.js'
const props = defineProps({
  expenses: {
    type: Array,
    required: true,
  },
  deletingId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['delete'])
const selectedId = ref('')

const selectedExpense = computed(() =>
  props.expenses.find((item) => String(item.id) === selectedId.value) ?? null
)
function toggleSelected(id) {
  const value = String(id)
  selectedId.value = selectedId.value === value ? '' : value
}
watch(
  () => props.expenses,
  (items) => {
    if (!items.some((item) => String(item.id) === selectedId.value)) {
      selectedId.value = ''
    }
  }
)

const dateFormatter = new Intl.DateTimeFormat('ru-RU')

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
            colspan="5"
            class="empty-state"
          >
            Пока расходов нет
          </td>
        </tr>
        <tr
          v-for="item in props.expenses"
          :key="item.id"
          :class="{ 'expense-row--selected': selectedId === String(item.id) }"
          :aria-selected="selectedId === String(item.id)"
          tabindex="0"
          @click="toggleSelected(item.id)"
          @keydown.enter.prevent="toggleSelected(item.id)"
        >
          <td>{{ item.title }}</td>
          <td>
            <span class="category-tag">{{ item.category }}</span>
          </td>
          <td>{{ formatDate(item.date) }}</td>
          <td class="amount-cell">
            {{ formatMoney(item.amount) }}
          </td>
          <td class="delete-cell">
            <button 
              type="button" 
              class="delete-button" 
              aria-label="Удалить расход"
              :disabled="props.deletingId === String(item.id)"
              @click.stop="emit('delete', item.id)"
            >
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

    <button
      v-if="selectedExpense"
      type="button"
      class="mobile-delete-button"
      :disabled="props.deletingId === selectedId"
      @click="emit('delete', selectedExpense.id)"
    >
      Удалить расход
    </button>
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
.delete-heading {
  width: 32px;
}
.expense-row--selected {
  background: #f1ebfd;
}
.expense-row--selected td {
  color: #7334ea;
}
.mobile-delete-button {
  display: none;
}
@media (max-width: 480px) {
  .table-container {
    padding: 16px;
    overflow-x: auto;
  }
  .table-title {
    margin-bottom: 14px;
    font-size: 20px;
    display: none;
  }
  .expenses-table {
    width: 100%;
    min-width: 0;
    table-layout: fixed;
  }
  .expenses-table th,
  .expenses-table td {
    padding: 10px 3px;
    overflow: hidden;
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .expenses-table th:nth-child(1),
  .expenses-table td:nth-child(1) {
    width: 25%;
  }
  .expenses-table th:nth-child(2),
  .expenses-table td:nth-child(2) {
    width: 24%;
  }
  .expenses-table th:nth-child(3),
  .expenses-table td:nth-child(3) {
    width: 29%;
    text-align: right;
  }
  .expenses-table th:nth-child(4),
  .expenses-table td:nth-child(4) {
    width: 22%;
    text-align: right;
  }
  .expenses-table th.delete-heading,
  .expenses-table td.delete-cell {
    display: none;
  }
  .expenses-table td:nth-child(2) {
    white-space: normal;
    overflow-wrap: anywhere;
  }
  .category-tag {
    padding: 0;
    font-size: 10px;
  }
  .mobile-delete-button {
    display: block;
    width: 100%;
    height: 44px;
    margin-top: 16px;
    border: 0;
    border-radius: 6px;
    background: #793fed;
    color: #fff;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }
  .mobile-delete-button:disabled {
    opacity: 0.6;
    cursor: wait;
  }
}
</style>
