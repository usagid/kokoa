<template>
  <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
    <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--color-board-header); padding-bottom: 10px; margin-bottom: 20px;">
      <NuxtLink to="/" class="kokoa-btn kokoa-btn--sm">Return</NuxtLink>
      <KokoaThemeToggle />
    </header>

    <main v-if="post">
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
        
        <div class="kokoa-post-content" v-html="renderedContent" style="font-family: var(--font-mono); line-height: 1.5; white-space: pre-wrap;"></div>
      </KokoaCard>

      <div style="margin-top: 4px; padding-top: 10px;">
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <button 
            v-for="emoticon in emoticons" 
            :key="emoticon.id"
            @click="reactToPost(emoticon.id)"
            class="kokoa-btn"
          >
            <span v-if="emoticon.imageUrl.length < 5" style="font-size: 20px;">{{ emoticon.imageUrl }}</span>
            <img v-else :src="emoticon.imageUrl" :alt="emoticon.name" style="width: 20px; height: 20px; object-fit: cover;">
            <span style="margin-left: 5px;">{{ getReactionCount(emoticon.id) }}</span>
          </button>
        </div>
      </div>
    </main>
    <main v-else-if="error" style="text-align: center; padding: 40px;">
      <h2>Post not found</h2>
      <NuxtLink to="/">Go back home</NuxtLink>
    </main>
  </div>
</template>

<style>
.kokoa-post-content blockquote {
  margin: 0;
  color: var(--color-post-quote);
}
.kokoa-post-content p {
  margin: 0 0 10px 0;
}
.greentext {
  color: var(--color-post-quote);
}
</style>

<script setup>
import { marked } from 'marked';

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

const route = useRoute();
const slug = route.params.slug;

const { data: post, error, refresh } = await useFetch(`/api/posts/${slug}`);
const { data: emoticons } = await useFetch('/api/emoticons');

useHead({ title: () => post.value?.title || slug });

onMounted(() => {
  if (post.value) {
    $fetch(`/api/posts/${slug}/view`, { method: 'POST' }).then(() => refresh());
  }
});

const renderedContent = computed(() => {
  if (!post.value?.content) return '';
  
  const renderer = new marked.Renderer();
  renderer.blockquote = ({ tokens }) => {
    const innerHtml = marked.parser(tokens);
    return `<div class="greentext">${innerHtml}</div>`;
  };
  
  let rawContent = post.value.content;
  rawContent = rawContent.replace(/^>(.*)$/gm, '<span class="greentext">>$1</span>');
  
  let html = marked.parse(rawContent, { renderer });
  html = html.replace(/<table>/g, '<div class="kokoa-table-wrap" style="margin: 10px 0;"><table class="kokoa-table kokoa-table--striped kokoa-table--bordered">');
  html = html.replace(/<\/table>/g, '</table></div>');
  
  return html;
});

const getReactionCount = (emoticonId) => {
  if (!post.value?.reactions) return 0;
  const reaction = post.value.reactions.find(r => r.id === emoticonId);
  return reaction ? reaction.count : 0;
};

const reactToPost = async (emoticonId) => {
  try {
    await $fetch(`/api/posts/${slug}/react`, {
      method: 'POST',
      body: { emoticonId }
    });
    refresh();
  } catch (err) {
    console.error(err);
  }
};
</script>
