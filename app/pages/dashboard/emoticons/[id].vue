<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>Edit Emoticon</h2>
      <NuxtLink to="/dashboard/emoticons" class="kokoa-btn">Back to Emoticons</NuxtLink>
    </div>

    <div class="kokoa-window">
      <div class="kokoa-window__titlebar">Edit Emoticon</div>
      <div class="kokoa-window__content">
        <form @submit.prevent="updateEmoticon" v-if="emoticon">
          <label class="kokoa-label">Name</label>
          <input v-model="form.name" type="text" class="kokoa-input" required>
          <br><br>
          <label class="kokoa-label">Image URL or Emoji</label>
          <input v-model="form.imageUrl" type="text" class="kokoa-input" required>
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
const route = useRoute();
const id = route.params.id;

const { data: emoticon } = await useFetch(`/api/emoticons/${id}`);

useHead({ title: `Edit Emoticon: ${emoticon.value?.name || id}` });

const form = ref({ name: '', imageUrl: '' });

watch(emoticon, (newEmoticon) => {
  if (newEmoticon) {
    form.value.name = newEmoticon.name;
    form.value.imageUrl = newEmoticon.imageUrl;
  }
}, { immediate: true });

const updateEmoticon = async () => {
  try {
    await $fetch(`/api/emoticons/${id}`, {
      method: 'PUT',
      body: form.value
    });
    await showAlert('Emoticon updated successfully!', 'Success');
    navigateTo('/dashboard/emoticons');
  } catch (err) {
    await showAlert(err.message, 'Error');
  }
};
</script>
