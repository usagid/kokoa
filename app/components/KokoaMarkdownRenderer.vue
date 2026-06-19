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
  
  renderer.heading = ({ tokens, depth }) => {
    const text = marked.parser(tokens);
    const id = text.toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '') || 'section';
    return `<h${depth} id="${id}" class="kokoa-heading" title="Click to copy link"><span class="kokoa-heading-hash">#</span> ${text}</h${depth}>`;
  };

  let rawContent = props.content;
  rawContent = rawContent.replace(/^>(.*)$/gm, '<span class="greentext">>$1</span>');
  
  let html = marked.parse(rawContent, { renderer });
  html = html.replace(/<table>/g, '<div class="kokoa-table-wrap" style="margin: 10px 0;"><table class="kokoa-table kokoa-table--striped kokoa-table--bordered">');
  html = html.replace(/<\/table>/g, '</table></div>');
  
  return defineComponent({
    template: `<div class="kokoa-markdown" @click="handleClick">${html}</div>`,
    methods: {
      handleClick(event) {
        const heading = event.target.closest('.kokoa-heading');
        if (heading && heading.id) {
          const url = new URL(window.location.href);
          url.hash = heading.id;
          navigator.clipboard.writeText(url.toString());
          heading.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
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

.kokoa-markdown h1,
.kokoa-markdown h2,
.kokoa-markdown h3,
.kokoa-markdown h4,
.kokoa-markdown h5,
.kokoa-markdown h6 {
  font-weight: bold;
}

.kokoa-heading {
  cursor: pointer;
  position: relative;
}

.kokoa-heading-hash {
  color: var(--text-muted);
  opacity: 0.5;
  margin-right: 6px;
  user-select: none;
  transition: color 0.2s, opacity 0.2s;
}

.kokoa-heading:hover .kokoa-heading-hash {
  color: var(--board-header);
  opacity: 1;
}

.kokoa-markdown h1 { font-size: 2em; margin-top: 0.67em; margin-bottom: 0.67em; }
.kokoa-markdown h2 { font-size: 1.5em; margin-top: 0.83em; margin-bottom: 0.83em; }
.kokoa-markdown h3 { font-size: 1.17em; margin-top: 1em; margin-bottom: 1em; }
.kokoa-markdown h4 { font-size: 1em; margin-top: 1.33em; margin-bottom: 1.33em; }
.kokoa-markdown h5 { font-size: 0.83em; margin-top: 1.67em; margin-bottom: 1.67em; }
.kokoa-markdown h6 { font-size: 0.67em; margin-top: 2.33em; margin-bottom: 2.33em; }

.kokoa-markdown ul {
  list-style-type: disc;
  padding-left: 20px;
  margin-top: 1em;
  margin-bottom: 1em;
}

.kokoa-markdown ol {
  list-style-type: decimal;
  padding-left: 20px;
  margin-top: 1em;
  margin-bottom: 1em;
}

.kokoa-markdown li {
  display: list-item;
}
</style>
