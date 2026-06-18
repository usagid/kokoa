<script setup lang="ts">
const { data: settings } = await useFetch('/api/settings');
const navLinks = [
  { label: '[Home]', to: '/' },
  { label: '[Example]', to: '/example' },
]
</script>

<template>
  <div class="kokoa-layout">


    <main class="kokoa-main">
      <slot />
    </main>

    <footer class="kokoa-footer">
      <div class="kokoa-footer__inner">
        <span>{{ settings?.blogTitle || 'My Personal Blog' }}</span>
        <span class="kokoa-footer__separator">|</span>
        <span>{{ settings?.footerMessage || 'Powered by Kokoa UI' }}</span>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.kokoa-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.kokoa-header {
  background: linear-gradient(90deg, var(--board-header) 0%, var(--board-header-light15) 100%);
  border-bottom: 2px solid var(--board-header-dark10);
  box-shadow: 0 2px 0 rgba(0,0,0,0.2);

  &__inner {
    max-width: 960px;
    margin: 0 auto;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__logo {
    font-size: 20px;
    color: var(--accent-primary);
    filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.3));
  }

  &__title {
    font-family: 'DotGothic16', monospace;
    font-size: 18px;
    color: var(--board-header-text);
    letter-spacing: 2px;
  }

  &__nav {
    display: flex;
    gap: 4px;
  }

  &__link {
    font-family: 'DotGothic16', monospace;
    font-size: 14px;
    color: var(--board-header-text);
    text-decoration: none;
    padding: 2px 6px;

    &:hover {
      background-color: rgba(255,255,255,0.15);
      color: var(--accent-warm);
    }

    &:visited {
      color: var(--board-header-text);
    }

    &.router-link-active {
      color: var(--accent-warm);
      text-decoration: underline;
    }
  }
}

.kokoa-main {
  flex: 1;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 12px;
}

.kokoa-footer {
  background-color: var(--surface-1);
  border-top: 1px solid var(--border-default);
  padding: 8px 12px;
  margin-top: auto;

  &__inner {
    max-width: 960px;
    margin: 0 auto;
    text-align: center;
    font-size: 12px;
    color: var(--text-muted);
  }

  &__separator {
    margin: 0 6px;
    color: var(--border-default);
  }
}
</style>
