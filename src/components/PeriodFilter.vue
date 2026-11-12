<script setup>
import { ref } from 'vue'

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['search', 'reset'])

const periodStart = ref('')
const periodEnd = ref('')
const periodError = ref('')

function handleSearch() {
  periodError.value = ''
  if (!periodStart.value || !periodEnd.value) {
    periodError.value = 'Выберите начало и конец периода'
    return
  }
  if (periodStart.value > periodEnd.value) {
    periodError.value = 'Дата начала не может быть позже даты окончания'
    return
  }
  emit('search', { start: periodStart.value, end: periodEnd.value })
}

function handleReset() {
  periodStart.value = ''
  periodEnd.value = ''
  periodError.value = ''
  emit('reset')
}
</script>

<template>
  <div class="period-filter">
    <div class="period-filter__inputs">
      <div class="period-filter__field">
        <input
          id="periodStart"
          v-model="periodStart"
          type="text"
          placeholder="С"
          onfocus="(this.type='date')"
          onblur="(this.value ? this.type='date' : this.type='text')"
        >
      </div>
      <div class="period-filter__field">
        <input
          id="periodEnd"
          v-model="periodEnd"
          type="text"
          placeholder="По"
          onfocus="(this.type='date')"
          onblur="(this.value ? this.type='date' : this.type='text')"
        >
      </div>
    </div>

    <div class="period-filter__buttons">
      <button
        type="button"
        class="period-btn period-btn_submit"
        :disabled="isLoading"
        @click="handleSearch"
      >
        Показать
      </button>
      <button
        type="button"
        class="period-btn period-btn_reset"
        :disabled="isLoading"
        @click="handleReset"
      >
        Сбросить
      </button>
    </div>

    <p v-if="periodError" class="field-error" role="alert">
      {{ periodError }}
    </p>
  </div>
</template>

<style scoped>
.period-filter {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  background: #FFFFFF;
  border: 1px solid #D4DBE5;
  border-radius: 12px;
  padding: 16px 20px;
}
.period-filter__inputs {
  display: flex;
  gap: 12px;
}
.period-filter__field {
  flex: 1;
}
.period-filter__field input {
  width: 100%;
  height: 38px;
  padding: 0 12px;
  border: 1px solid #D4DBE5;
  border-radius: 6px;
  outline: none;
  font-family: inherit;
  font-size: 12px;
  color: #000000;
  background: transparent;
  transition: border-color 0.2s;
}
.period-filter__field input:focus {
  border-color: #793FED;
}
.period-filter__buttons {
  display: flex;
  gap: 8px;
}
.period-btn {
  height: 34px;
  padding: 0 16px;
  border: 1px solid #D4DBE5;
  border-radius: 6px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  color: #94A6BE;
  transition: all 0.2s ease;
}
.period-btn_submit {
  background-color: #793FED;
  color: #FFFFFF;
  border-color: #793FED;
}
.period-btn_submit:hover:not(:disabled) {
  background-color: #632cd4;
}
.period-btn_reset:hover:not(:disabled) {
  color: #793FED;
  border-color: #793FED;
}
.period-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.field-error {
  margin: 0;
  color: #F25050;
  font-size: 12px;
  text-align: left;
}
</style>