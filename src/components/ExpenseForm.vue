<script setup>
import { computed, ref } from 'vue'
import IconCategory from './IconCategory.vue'
import { CATEGORIES } from '../constants/categories.js'

const props = defineProps({
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  serverError: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['submit-expense'])

const description = ref('')
const category = ref('food')
const date = ref('')
const amount = ref('')
const fieldErrors = ref({})
const hasSubmitted = ref(false)

const categoriesList = CATEGORIES.map(({ key, label, icon }) => ({
  name: label,
  value: key,
  icon,
}))

function validateExpense() {
  const errors = {}
  const cleanDescription = description.value.trim()
  const sum = Number(amount.value)

  if (!cleanDescription) {
    errors.description = 'Введите описание'
  } else if (cleanDescription.length < 4) {
    errors.description = 'Описание должно содержать не менее 4 символов'
  }

  if (!categoriesList.some((item) => item.value === category.value)) {
    errors.category = 'Выберите категорию'
  }

  if (!date.value) {
    errors.date = 'Укажите дату расхода'
  }

  if (amount.value === '' || !Number.isSafeInteger(sum) || sum <= 0) {
    errors.amount = 'Укажите положительную сумму целым числом'
  }

  fieldErrors.value = errors
  return Object.keys(errors).length === 0
}

function isFormValid() {
  const cleanDescription = description.value.trim()
  const sum = Number(amount.value)
  return (
    cleanDescription.length >= 4 &&
    categoriesList.some((item) => item.value === category.value) &&
    Boolean(date.value) &&
    Number.isSafeInteger(sum) &&
    sum > 0
  )
}

const isSubmitDisabled = computed(() => {
  return props.isSubmitting || (hasSubmitted.value && !isFormValid())
})

function clearFieldError(field) {
  if (!fieldErrors.value[field]) return
  const errors = { ...fieldErrors.value }
  delete errors[field]
  fieldErrors.value = errors
}

function handleSubmit() {
  hasSubmitted.value = true
  if (!validateExpense()) return

  emit('submit-expense', {
    description: description.value.trim(),
    sum: Number(amount.value),
    category: category.value,
    date: date.value,
  })
}

function resetForm() {
  description.value = ''
  date.value = ''
  amount.value = ''
  fieldErrors.value = {}
  hasSubmitted.value = false
}

defineExpose({ resetForm })
</script>

<template>
  <div class="form-container">
    <h2 class="form-title">Новый расход</h2>
    <form
      class="expense-form"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <div class="form-group">
        <label for="expDesc">
          Описание <span v-if="fieldErrors.description" class="star-error">*</span>
        </label>
        <input
          id="expDesc"
          v-model.trim="description"
          type="text"
          placeholder="Введите описание"
          required
          minlength="4"
          :aria-invalid="Boolean(fieldErrors.description)"
          :class="{ input_invalid: fieldErrors.description }"
          @input="clearFieldError('description')"
        >
        <p v-if="fieldErrors.description" class="field-error" role="alert">
          {{ fieldErrors.description }}
        </p>
      </div>

      <fieldset class="expense-form__categories">
        <legend>
          Категория <span v-if="fieldErrors.category" class="star-error">*</span>
        </legend>
        <div class="categories-grid">
          <label
            v-for="item in categoriesList"
            :key="item.name"
            class="category-label"
            :class="{ 'category-label_active': category === item.value }"
          >
            <input
              v-model="category"
              type="radio"
              name="category"
              :value="item.value"
              class="hidden-radio"
            >
            <IconCategory :name="item.icon" class="category-icon" />
            <span>{{ item.name }}</span>
          </label>
        </div>
      </fieldset>
      <p v-if="fieldErrors.category" class="field-error" role="alert">
        {{ fieldErrors.category }}
      </p>

      <div class="form-group">
        <label for="expDate">
          Дата <span v-if="fieldErrors.date" class="star-error">*</span>
        </label>
        <input
          id="expDate"
          v-model="date"
          type="date"
          required
          :aria-invalid="Boolean(fieldErrors.date)"
          :class="{ input_invalid: fieldErrors.date }"
          @change="clearFieldError('date')"
        >
        <p v-if="fieldErrors.date" class="field-error" role="alert">
          {{ fieldErrors.date }}
        </p>
      </div>

      <div class="form-group">
        <label for="expAmount">
          Сумма <span v-if="fieldErrors.amount" class="star-error">*</span>
        </label>
        <input
          id="expAmount"
          v-model="amount"
          type="number"
          min="1"
          step="1"
          placeholder="Введите сумму"
          required
          :aria-invalid="Boolean(fieldErrors.amount)"
          :class="{ input_invalid: fieldErrors.amount }"
          @input="clearFieldError('amount')"
        >
        <p v-if="fieldErrors.amount" class="field-error" role="alert">
          {{ fieldErrors.amount }}
        </p>
      </div>

      <p v-if="serverError" class="form-error" role="alert">
        {{ serverError }}
      </p>

      <button
        type="submit"
        class="submit-btn"
        :disabled="isSubmitDisabled"
      >
        {{ isSubmitting ? 'Добавляем…' : 'Добавить новый расход' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  background: #FFFFFF;
  border: 1px solid #D4DBE5;
  border-radius: 12px;
  padding: 24px;
}
.form-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: left;
}
.expense-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}
.expense-form__categories {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.expense-form__categories legend {
  margin-bottom: 8px;
  padding: 0;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
}
.expense-form input[type='number'] {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 0 14px;
  height: 44px;
  border: 1px solid #999999;
  font-size: 12px;
  border-radius: 8px;
  font: inherit;
  outline: none;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}
.expense-form input[type='number']:focus {
  border-color: #7334EA;
  background-color: #F1EBFD;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-size: 16px;
  font-weight: 500;
  color: #000000;
}
.form-group input[type="text"],
.form-group input[type="date"] {
  height: 44px;
  padding: 0 14px;
  border: 1px solid #999999;
  border-radius: 8px;
  outline: none;
  font-size: 12px;
  width: 100%;
  background: transparent;
}
.form-group input:focus {
  border-color: #793FED;
}
.categories-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.category-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #F4F5F6;
  background-color: #F4F5F6;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: #000000;
  transition: all 0.2s;
}
.category-label_active {
  background-color: #F1EBFD;
  color: #7334EA;
  border-color: #F1EBFD;
}
.category-icon {
  width: 14px;
  height: 14px;
  color: currentColor;
  transition: color 0.2s;
}
.hidden-radio {
  display: none;
}
.submit-btn {
  height: 44px;
  border: none;
  border-radius: 6px;
  background-color: #793FED;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
}
.submit-btn:hover {
  background-color: #7334EA;
}
.submit-btn:disabled {
  background: #c8ccd6;
  border-color: #c8ccd6;
  cursor: not-allowed;
  opacity: 1;
}
.field-error,
.form-error {
  margin: 6px 0 0;
  color: #d14343;
  font-size: 12px;
}
.expense-form input.input_invalid {
  border-color: #d14343;
}
.star-error {
  color: #F25050;
  margin-left: 4px;
  font-weight: bold;
}
</style>