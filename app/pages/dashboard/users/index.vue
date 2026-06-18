<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>Users</h2>
      <button @click="isCreating = true" class="kokoa-btn kokoa-btn--primary">New User</button>
    </div>

    <div v-if="isCreating" class="kokoa-window" style="margin-bottom: 20px;">
      <div class="kokoa-window__titlebar">Add New Admin User</div>
      <div class="kokoa-window__content">
        <form @submit.prevent="createUser">
          <label class="kokoa-label">Username</label>
          <input v-model="form.username" type="text" class="kokoa-input" required>
          <br><br>
          <label class="kokoa-label">Password</label>
          <input v-model="form.password" type="password" class="kokoa-input" required>
          <br><br>
          <div style="display: flex; gap: 10px;">
            <button type="submit" class="kokoa-btn kokoa-btn--accent">Save</button>
            <button type="button" @click="isCreating = false" class="kokoa-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <KokoaTable
      :columns="columns"
      :rows="users || []"
      striped
      bordered
    >
      <template #cell-createdAt="{ value }">
        {{ new Date(value).toLocaleDateString() }}
      </template>
      <template #cell-actions="{ row, rowIndex }">
        <NuxtLink :to="`/dashboard/users/${row.id}`" class="kokoa-btn kokoa-btn--sm" style="margin-right: 5px;">Edit</NuxtLink>
        <button v-if="rowIndex > 0" @click="deleteUser(row.id)" class="kokoa-btn kokoa-btn--sm">Delete</button>
      </template>
    </KokoaTable>
    <div v-if="loading" style="text-align: center; padding: 20px;">Loading more...</div>
    <div v-if="!hasMore && users.length > 0" style="text-align: center; padding: 20px;">No more users.</div>
  </div>
</template>

<script setup>
import { useInfiniteScroll } from '@vueuse/core';
const { showAlert, showConfirm } = useDialog();
definePageMeta({ layout: 'admin' });
useHead({ title: 'Users - Admin' });

const users = ref([]);
const page = ref(1);
const limit = 20;
const hasMore = ref(true);
const loading = ref(false);

const fetchUsers = async () => {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  try {
    const data = await $fetch('/api/users', {
      query: { page: page.value, limit }
    });
    if (data.length < limit) {
      hasMore.value = false;
    }
    users.value.push(...data);
    page.value++;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

await fetchUsers();

if (import.meta.client) {
  useInfiniteScroll(
    window,
    async () => {
      await fetchUsers();
    },
    { distance: 100 }
  );
}

const refresh = async () => {
  users.value = [];
  page.value = 1;
  hasMore.value = true;
  await fetchUsers();
};

const columns = [
  { key: 'username', label: 'Username', sortable: true, filterable: true },
  { key: 'createdAt', label: 'Created At', sortable: true },
  { key: 'actions', label: 'Actions' }
];

const isCreating = ref(false);
const form = ref({ username: '', password: '' });

const createUser = async () => {
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: form.value
    });
    isCreating.value = false;
    form.value = { username: '', password: '' };
    refresh();
  } catch (err) {
    await showAlert(err.message, 'Error');
  }
};

const deleteUser = async (id) => {
  if (!(await showConfirm('Are you sure you want to delete this user?', 'Confirm Delete'))) return;
  try {
    await $fetch(`/api/users/${id}`, { method: 'DELETE' });
    refresh();
  } catch (err) {
    await showAlert(err.message, 'Error');
  }
};
</script>
