<script setup lang="ts">
export type CopyLabelMode = 'click' | 'editable'

const props = withDefaults(defineProps<{
  modelValue?: string
  mode?: CopyLabelMode
}>(), {
  mode: 'click'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isEditing = ref(false)
const copied = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const wrapperRef = ref<HTMLDivElement | null>(null)

const localValue = ref(props.modelValue ?? '')

watch(() => props.modelValue, (v) => {
  localValue.value = v ?? ''
})

const displayValue = computed(() => localValue.value)

function copyToClipboard() {
  if (!displayValue.value) return
  navigator.clipboard.writeText(displayValue.value).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 1200)
  })
}

function handleClick() {
  if (props.mode === 'click') {
    copyToClipboard()
  } else {
    startEditing()
  }
}

function startEditing() {
  isEditing.value = true
  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

function commitEdit() {
  isEditing.value = false
}

function onInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === 'Escape') {
    e.preventDefault()
    commitEdit()
  }
}

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  localValue.value = val
  emit('update:modelValue', val)
}
</script>

<template>
  <span
    ref="wrapperRef"
    class="kokoa-copy-label"
    :class="{
      'kokoa-copy-label--click': mode === 'click',
      'kokoa-copy-label--editable': mode === 'editable',
      'kokoa-copy-label--editing': isEditing,
      'kokoa-copy-label--copied': copied,
    }"
  >
    <template v-if="mode === 'click'">
      <span class="kokoa-copy-label__text" @click="handleClick">
        {{ displayValue }}
        <span class="kokoa-copy-label__icon">{{ copied ? 'OK' : '⧉' }}</span>
      </span>
    </template>

    <template v-else>
      <input
        v-if="isEditing"
        ref="inputRef"
        class="kokoa-copy-label__input"
        :value="displayValue"
        @input="onInput"
        @blur="commitEdit"
        @keydown="onInputKeydown"
      />
      <span v-else class="kokoa-copy-label__text" @click="handleClick">
        {{ displayValue }}
      </span>
      <button
        type="button"
        class="kokoa-copy-label__copy-btn"
        :class="{ 'kokoa-copy-label__copy-btn--copied': copied }"
        @click.stop="copyToClipboard"
        @mousedown.prevent
      >{{ copied ? 'OK' : '⧉' }}</button>
    </template>
  </span>
</template>
