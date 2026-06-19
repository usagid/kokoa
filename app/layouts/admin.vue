<template>
  <div>
    <div style="padding: 10px; background-color: var(--color-board-header); color: var(--color-board-header-text); display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong>Dashboard</strong>
        <NuxtLink to="/" style="margin-left: 10px; color: inherit;">[Back to Blog]</NuxtLink>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
        <KokoaThemeToggle />
        <button @click="logout" class="kokoa-btn kokoa-btn--sm">Logout</button>
      </div>
    </div>
    <div style="padding: 10px; display: flex; gap: 10px; align-items: flex-start;">
      <aside style="width: 200px; flex-shrink: 0;">
        <div class="kokoa-window">
          <div class="kokoa-window__titlebar">Navigation</div>
          <div class="kokoa-window__content">
            <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
              <li><NuxtLink to="/dashboard">Overview</NuxtLink></li>
              <li><NuxtLink to="/dashboard/posts">Posts</NuxtLink></li>
              <li><NuxtLink to="/dashboard/emoticons">Emoticons</NuxtLink></li>
              <li><NuxtLink to="/dashboard/tags">Tags</NuxtLink></li>
              <li><NuxtLink to="/dashboard/users">Users</NuxtLink></li>
              <li><NuxtLink to="/dashboard/settings">Settings</NuxtLink></li>
            </ul>
          </div>
        </div>
      </aside>
      <main style="flex: 1;">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const { logout, fetchUser, user } = useAuth();
// On mount or server init, fetch user
await useAsyncData('auth', () => fetchUser());

// Redirect if not logged in
if (!user.value) {
  navigateTo('/login');
}
</script>
