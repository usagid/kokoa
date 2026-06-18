<script setup lang="ts">
const theme = ref<'light' | 'dark'>('light')

onMounted(() => {
  const stored = localStorage.getItem('kokoa-theme')
  if (stored === 'dark' || stored === 'light') {
    theme.value = stored
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.value = 'dark'
  }
  applyTheme()
})

function toggle() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  applyTheme()
  localStorage.setItem('kokoa-theme', theme.value)
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', theme.value)
}
</script>

<template>
  <button
    type="button"
    class="kokoa-theme-toggle"
    :title="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
    @click="toggle"
    style="color: inherit;"
  >{{ theme === 'light' ? '☽' : '☀' }}</button>
</template>
