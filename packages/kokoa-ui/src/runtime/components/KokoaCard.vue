<script setup lang="ts">

withDefaults(defineProps<{
  variant?: 'default' | 'elevated' | 'bordered' | 'ghost'
}>(), {
  variant: 'default'
})
</script>

<template>
  <div
    class="kokoa-card"
    :class="{
      'kokoa-card--elevated': variant === 'elevated',
      'kokoa-card--bordered': variant === 'bordered',
      'kokoa-card--ghost': variant === 'ghost',
    }"
  >
    <slot name="image" />
    <slot name="header" />
    <div v-if="$slots.default" class="kokoa-card__body">
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>
