<template>
  <div>
    <h2>Welcome, {{ user?.username }}</h2>
    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
      <KokoaCard variant="bordered" style="flex: 1; min-width: 200px;">
        <template #header><div class="kokoa-card__header"><span class="kokoa-card__name">Manage Posts</span></div></template>
        <p>Create, edit, or delete blog posts.</p>
        <NuxtLink to="/dashboard/posts">[Go to Posts]</NuxtLink>
      </KokoaCard>
      
      <KokoaCard variant="bordered" style="flex: 1; min-width: 200px;">
        <template #header><div class="kokoa-card__header"><span class="kokoa-card__name">Manage Emoticons</span></div></template>
        <p>Add or remove reaction emoticons.</p>
        <NuxtLink to="/dashboard/emoticons">[Go to Emoticons]</NuxtLink>
      </KokoaCard>

      <KokoaCard variant="bordered" style="flex: 1; min-width: 200px;">
        <template #header><div class="kokoa-card__header"><span class="kokoa-card__name">Manage Users</span></div></template>
        <p>Create access for other admins.</p>
        <NuxtLink to="/dashboard/users">[Go to Users]</NuxtLink>
      </KokoaCard>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' });
useHead({ title: 'Dashboard - Admin' });
const { user } = useAuth();
</script>
