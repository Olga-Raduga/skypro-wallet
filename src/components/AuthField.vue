<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  name: {
    type: String,
    default: '',
  },
  autocomplete: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'input'])

function handleInput(event) {
  emit('update:modelValue', event.target.value)
  emit('input', event)
}
</script>

<template>
  <div class="input-wrapper">
    <input
      :id="id"
      :value="modelValue"
      :type="type"
      :name="name"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :class="{ 'auth-input_invalid': invalid }"
      :required="required"
      @input="handleInput"
    >
    <span
      v-if="invalid"
      class="required-star"
      aria-hidden="true"
    >*</span>
  </div>
</template>
