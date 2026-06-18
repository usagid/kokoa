<script setup>
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })

useHead({
  title: `${props.error?.statusCode || 500} - Error`
})
</script>

<template>
  <NuxtLayout>
    <div style="max-width: 600px; margin: 40px auto; text-align: center;">
      <div class="kokoa-window">
        <div class="kokoa-window__titlebar">Error {{ error?.statusCode || 500 }}</div>
        <div class="kokoa-window__content">
          <h2 style="margin-top: 0; color: var(--color-accent-danger);">{{ error?.statusMessage || 'Something went wrong' }}</h2>
          <p v-if="error?.message && error.message !== error.statusMessage" style="margin-bottom: 20px;">
            {{ error.message }}
          </p>
          <div v-else style="margin-bottom: 20px;">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </div>
          <button @click="handleError" class="kokoa-btn kokoa-btn--primary">Return to Home</button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
