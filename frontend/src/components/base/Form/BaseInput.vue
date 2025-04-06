<template>
  <div class="base-input" :class="{ 'base-input--error': error }">
    <label v-if="label" class="base-input__label" :for="id">
      {{ label }}
      <span v-if="required" class="base-input__required">*</span>
    </label>
    <div class="base-input__wrapper">
      <slot name="prefix"></slot>
      <input :id="id" class="base-input__field" :type="type" :value="modelValue" :placeholder="placeholder"
        :disabled="disabled" :required="required" :autocomplete="autocomplete" @input="updateValue" @blur="onBlur"
        @focus="onFocus" />
      <slot name="suffix"></slot>
    </div>
    <div v-if="error" class="base-input__error">{{ error }}</div>
    <div v-else-if="hint" class="base-input__hint">{{ hint }}</div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  // Props 定义
  const props = withDefaults(defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    type?: string
    id?: string
    error?: string
    hint?: string
    disabled?: boolean
    required?: boolean
    autocomplete?: string
  }>(), {
    type: 'text',
    id: () => `input-${Math.random().toString(36).substring(2, 9)}`,
    disabled: false,
    required: false,
    autocomplete: 'off'
  })

  // 事件定义
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'blur', event: FocusEvent): void
    (e: 'focus', event: FocusEvent): void
  }>()

  // 更新值
  const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
  }

  // 失焦事件
  const onBlur = (event: FocusEvent) => {
    emit('blur', event)
  }

  // 聚焦事件
  const onFocus = (event: FocusEvent) => {
    emit('focus', event)
  }
</script>

<style scoped>
  .base-input {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--spacing-md);
  }

  .base-input__label {
    font-size: var(--font-size-sm);
    font-weight: 500;
    margin-bottom: var(--spacing-xs);
    color: var(--text-secondary);
  }

  .base-input__required {
    color: var(--error-color);
    margin-left: var(--spacing-xs);
  }

  .base-input__wrapper {
    display: flex;
    align-items: center;
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
  }

  .base-input__wrapper:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-alpha);
  }

  .base-input--error .base-input__wrapper {
    border-color: var(--error-color);
  }

  .base-input--error .base-input__wrapper:focus-within {
    box-shadow: 0 0 0 2px var(--error-color-alpha);
  }

  .base-input__field {
    flex: 1;
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    background: transparent;
    font-size: var(--font-size-md);
    color: var(--text-primary);
    outline: none;
  }

  .base-input__field::placeholder {
    color: var(--text-tertiary);
  }

  .base-input__field:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .base-input__error {
    font-size: var(--font-size-sm);
    color: var(--error-color);
    margin-top: var(--spacing-xs);
  }

  .base-input__hint {
    font-size: var(--font-size-sm);
    color: var(--text-tertiary);
    margin-top: var(--spacing-xs);
  }
</style>