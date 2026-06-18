<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>Edit User</h2>
      <NuxtLink to="/dashboard/users" class="kokoa-btn">Back to Users</NuxtLink>
    </div>

    <div class="kokoa-window">
      <div class="kokoa-window__titlebar">Edit User</div>
      <div class="kokoa-window__content">
        <form @submit.prevent="updateUser" v-if="userRecord">
          <label class="kokoa-label">Username</label>
          <input v-model="form.username" type="text" class="kokoa-input" required>
          <br><br>
          <label class="kokoa-label">New Password (leave blank to keep current)</label>
          <input v-model="form.password" type="password" class="kokoa-input">
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

const { data: userRecord } = await useFetch(`/api/users/${id}`);

useHead({ title: `Edit User: ${userRecord.value?.username || id}` });
const form = ref({ username: '', password: '' });

watch(userRecord, (newUser) => {
  if (newUser) {
    form.value.username = newUser.username;
  }
}, { immediate: true });

const updateUser = async () => {
  try {
    await $fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: form.value
    });
    await showAlert('User updated successfully!', 'Success');
    navigateTo('/dashboard/users');
  } catch (err) {
    await showAlert(err.message, 'Error');
  }
};
</script>
