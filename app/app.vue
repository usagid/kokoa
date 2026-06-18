<script setup>
const { data: settings } = await useFetch('/api/settings');

useHead({
  titleTemplate: (titleChunk) => {
    const siteName = settings.value?.blogTitle || 'My Blog';
    return titleChunk ? `${titleChunk} - ${siteName}` : siteName;
  },
  link: [
    {
      rel: 'icon',
      href: () => settings.value?.faviconUrl || '/favicon.ico'
    }
  ]
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <KokoaGlobalDialog />
</template>
