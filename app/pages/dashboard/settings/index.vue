<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>Settings</h2>
    </div>

    <div class="kokoa-window">
      <div class="kokoa-window__titlebar">General Config</div>
      <div class="kokoa-window__content">
        <form @submit.prevent="updateSettings" v-if="settings">
          <label class="kokoa-label">Blog Title</label>
          <input v-model="form.blogTitle" type="text" class="kokoa-input" required>
          <br><br>
          <label class="kokoa-label">Footer Message</label>
          <input v-model="form.footerMessage" type="text" class="kokoa-input" required>
          <br><br>
          <label class="kokoa-label">Favicon URL (optional)</label>
          <input v-model="form.faviconUrl" type="text" class="kokoa-input" placeholder="/favicon.ico or https://...">
          <br><br>
          <button type="submit" class="kokoa-btn kokoa-btn--accent">Save Changes</button>
        </form>
        <div v-else>Loading...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { showAlert } = useDialog();
definePageMeta({ layout: 'admin' });
useHead({ title: 'Settings - Admin' });

const { data: settings } = await useFetch('/api/settings');

const form = ref({ blogTitle: '', footerMessage: '', faviconUrl: '' });

watch(settings, (newSettings) => {
  if (newSettings) {
    form.value.blogTitle = newSettings.blogTitle || '';
    form.value.footerMessage = newSettings.footerMessage || '';
    form.value.faviconUrl = newSettings.faviconUrl || '';
  }
}, { immediate: true });

const updateSettings = async () => {
  try {
    await $fetch('/api/settings', {
      method: 'PUT',
      body: form.value
    });
    await showAlert('Settings updated successfully!', 'Success');
  } catch (err) {
    await showAlert(err.message, 'Error');
  }
};
</script>
