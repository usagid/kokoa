<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>Edit Post</h2>
      <NuxtLink to="/dashboard/posts" class="kokoa-btn">Back to Posts</NuxtLink>
    </div>

    <div class="kokoa-window">
      <div class="kokoa-window__titlebar">Edit Post: {{ post?.title }}</div>
      <div class="kokoa-window__content">
        <form @submit.prevent="updatePost" v-if="post">
          <label class="kokoa-label">Title</label>
          <input v-model="form.title" type="text" class="kokoa-input" required>
          <br><br>
          <label class="kokoa-label">Content (Markdown)</label>
          <textarea v-model="form.content" rows="15" class="kokoa-textarea" required></textarea>
          <br><br>
          <label class="kokoa-label">Tags</label>
          <KokoaTagSelect
            v-model="form.tags"
            :options="tagOptions"
            placeholder="Select tags..."
            style="margin-bottom: 20px;"
          />
          <br>
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
const slug = route.params.slug;

const { data: post } = await useFetch(`/api/posts/${slug}`);

useHead({ title: `Edit Post: ${post.value?.title || slug}` });

const form = ref({ title: '', content: '', tags: [] });

const { data: tagsList } = await useFetch('/api/tags');
const tagOptions = computed(() => {
  return (tagsList.value || []).map(t => ({ id: t.id, label: t.name }));
});

watch(post, (newPost) => {
  if (newPost) {
    form.value.title = newPost.title;
    form.value.content = newPost.content;
    form.value.tags = (newPost.tags || []).map(t => t.id);
  }
}, { immediate: true });

const updatePost = async () => {
  try {
    await $fetch(`/api/posts/${slug}`, {
      method: 'PUT',
      body: form.value
    });
    await showAlert('Post updated successfully!', 'Success');
    navigateTo('/dashboard/posts');
  } catch (err) {
    await showAlert(err.message, 'Error');
  }
};
</script>
