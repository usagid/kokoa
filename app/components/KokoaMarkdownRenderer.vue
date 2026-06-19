<script setup>
import { computed, defineComponent } from 'vue';
import { marked } from 'marked';

const props = defineProps({
  content: {
    type: String,
    required: true
  }
});

const compiledContent = computed(() => {
  if (!props.content) return '';
  
  const renderer = new marked.Renderer();
  renderer.blockquote = ({ tokens }) => {
    const innerHtml = marked.parser(tokens);
    return `<div class="greentext">${innerHtml}</div>`;
  };
  
  let rawContent = props.content;
  rawContent = rawContent.replace(/^>(.*)$/gm, '<span class="greentext">>$1</span>');
  
  let html = marked.parse(rawContent, { renderer });
  html = html.replace(/<table>/g, '<div class="kokoa-table-wrap" style="margin: 10px 0;"><table class="kokoa-table kokoa-table--striped kokoa-table--bordered">');
  html = html.replace(/<\/table>/g, '</table></div>');
  
  return defineComponent({
    template: `<div>${html}</div>`,
  });
});
</script>

<template>
  <component :is="compiledContent" />
</template>

<style>
.greentext {
  color: var(--color-post-quote);
}
</style>
