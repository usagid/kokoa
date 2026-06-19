<template>
  <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
    <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--color-board-header); padding-bottom: 10px; margin-bottom: 20px;">
      <h1 style="color: var(--color-board-header); margin: 0;">{{ settings?.blogTitle || 'My Blog' }}</h1>
      <div style="display: flex; align-items: center; gap: 10px;">
        <KokoaThemeToggle />
      </div>
    </header>

    <main>
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <article v-for="post in posts" :key="post.id">
          <NuxtLink :to="`/post/${post.slug}`" style="text-decoration: none; color: inherit;">
            <KokoaCard>
              <template #header>
                <div class="kokoa-card__header">
                  <span style="color: var(--color-board-header); font-weight: bold; margin-right: 4px;">{{ post.title }}</span>
                  <span class="kokoa-card__name">{{ post.authorName || 'Anonymous' }}</span>
                  <span class="kokoa-card__date" style="margin-left: 4px;">{{ formatDate(post.createdAt) }}</span>
                  <span class="kokoa-card__id" style="margin-left: 4px;">No.{{ post.id.split('-')[0] }}</span>
                  <span style="margin-left: auto; display: flex; align-items: center; gap: 4px; color: gray; user-select: none;" title="Views">
                    <Icon name="pixelarticons:eye" /> {{ post.viewsCount }}
                  </span>
                </div>
              </template>
              <div v-if="post.tags && post.tags.length > 0" style="margin-top: 4px; display: flex; gap: 5px; flex-wrap: wrap;">
                <span 
                  v-for="tag in post.tags" 
                  :key="tag.id" 
                  @click.prevent="setTagFilter(tag.id)"
                  class="kokoa-tag" 
                  style="background: var(--color-accent); color: var(--text-primary); padding: 2px 8px; font-size: 12px; cursor: pointer;"
                >
                  #{{ tag.name }}
                </span>
              </div>
              <KokoaMarkdownRenderer style="font-family: var(--font-mono); margin: 0; padding-top: 10px;" class="post-content" :content="truncateMarkdown(post.content)" />
              <div v-if="isTruncated(post.content)" style="text-align: center; padding-top: 10px; margin-top: 10px; border-top: 1px dashed var(--border-default); color: var(--text-muted); font-size: 12px;">
                Click to read the full post
              </div>
            </KokoaCard>
          </NuxtLink>
        </article>
      </div>
      <div v-if="loading" style="text-align: center; padding: 20px;">Loading more posts...</div>
      <div v-if="!hasMore && posts.length > 0" style="text-align: center; padding: 20px;">You've reached the end.</div>
      <div v-if="!loading && posts.length === 0" style="text-align: center; padding: 20px;">No posts yet.</div>
    </main>
    <div v-if="activeTagFilter" style="position: fixed; bottom: 20px; right: 20px; z-index: 100;">
      <button @click="clearTagFilter" class="kokoa-btn kokoa-btn--accent">
        Clear Filter ({{ activeTagFilterName }}) ✕
      </button>
    </div>
  </div>
</template>

<script setup>
import { useInfiniteScroll } from '@vueuse/core';
import { marked } from 'marked';

const { data: settings } = await useFetch('/api/settings');

useHead({ title: 'Home' });

const truncateMarkdown = (content) => {
  if (!content) return '';
  if (content.length <= 1000) return content;
  const boundary = content.indexOf(' ', 1000);
  if (boundary === -1) return content;
  return content.substring(0, boundary);
};

const isTruncated = (content) => {
  if (!content) return false;
  if (content.length <= 1000) return false;
  return content.indexOf(' ', 1000) !== -1;
};


const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = days[d.getDay()];
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${mm}/${dd}/${yy}(${day})${hh}:${min}:${ss}`;
};

const posts = ref([]);
const page = ref(1);
const limit = 10;
const hasMore = ref(true);
const loading = ref(false);
const route = useRoute();
const activeTagFilter = ref(route.query.tagId || null);
const activeTagFilterName = ref('');

// Watch route query to update filter if navigated directly
watch(() => route.query.tagId, (newTagId) => {
  if (newTagId !== activeTagFilter.value) {
    activeTagFilter.value = newTagId || null;
    refreshPosts();
  }
});

const fetchPosts = async () => {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  try {
    const data = await $fetch('/api/posts', {
      query: { page: page.value, limit, tagId: activeTagFilter.value }
    });
    if (data.length < limit) {
      hasMore.value = false;
    }
    posts.value.push(...data);
    page.value++;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

await fetchPosts();

const refreshPosts = async () => {
  posts.value = [];
  page.value = 1;
  hasMore.value = true;
  await fetchPosts();
};

const setTagFilter = (tagId) => {
  const t = posts.value.find(p => p.tags?.some(tag => tag.id === tagId))?.tags.find(tag => tag.id === tagId);
  activeTagFilterName.value = t?.name || 'Tag';
  activeTagFilter.value = tagId;
  const router = useRouter();
  router.push({ query: { tagId } });
  refreshPosts();
};

const clearTagFilter = () => {
  activeTagFilter.value = null;
  activeTagFilterName.value = '';
  const router = useRouter();
  router.push({ query: {} });
  refreshPosts();
};

if (import.meta.client) {
  useInfiniteScroll(
    window,
    async () => {
      await fetchPosts();
    },
    { distance: 100 }
  );
}
</script>
