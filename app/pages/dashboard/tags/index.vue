<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>Tags</h2>
      <button @click="isCreating = true" class="kokoa-btn kokoa-btn--primary">New Tag</button>
    </div>

    <div v-if="isCreating" class="kokoa-window" style="margin-bottom: 20px;">
      <div class="kokoa-window__titlebar">Add New Tag</div>
      <div class="kokoa-window__content">
        <form @submit.prevent="createTag">
          <label class="kokoa-label">Name</label>
          <input v-model="form.name" type="text" class="kokoa-input" required placeholder="e.g. Anime">
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
      :rows="tags || []"
      striped
      bordered
    >
      <template #cell-actions="{ row }">
        <button @click="deleteTag(row.id)" class="kokoa-btn kokoa-btn--sm">Delete</button>
      </template>
    </KokoaTable>
  </div>
</template>

<script setup>
const { showAlert, showConfirm } = useDialog();
definePageMeta({ layout: 'admin' });
useHead({ title: 'Tags - Admin' });

const { data: tags, refresh } = await useFetch('/api/tags');

const columns = [
  { key: 'name', label: 'Name', sortable: true, filterable: true },
  { key: 'actions', label: 'Actions' }
];

const isCreating = ref(false);
const form = ref({ name: '' });

const createTag = async () => {
  try {
    await $fetch('/api/tags', {
      method: 'POST',
      body: form.value
    });
    isCreating.value = false;
    form.value = { name: '' };
    refresh();
  } catch (err) {
    await showAlert(err.message, 'Error');
  }
};

const deleteTag = async (id) => {
  const confirmed = await showConfirm('Are you sure you want to delete this tag?');
  if (!confirmed) return;
  try {
    await $fetch(`/api/tags/${id}`, { method: 'DELETE' });
    refresh();
  } catch(err) {
    await showAlert(err.message, 'Error');
  }
};
</script>
