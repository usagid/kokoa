<template>
  <div>
    <div class="kokoa-window" style="max-width: 400px; margin: 40px auto;">
      <div class="kokoa-window__titlebar">Login</div>
      <div class="kokoa-window__content">
        <form @submit.prevent="handleLogin">
          <label class="kokoa-label">Username</label>
          <input v-model="username" type="text" class="kokoa-input" required>
          <br><br>
          <label class="kokoa-label">Password</label>
          <input v-model="password" type="password" class="kokoa-input" required>
          <br><br>
          <p v-if="errorMsg" style="color: var(--color-accent-danger);">{{ errorMsg }}</p>
          <button type="submit" class="kokoa-btn kokoa-btn--primary">Log In</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Login' });
const { login, fetchUser, user } = useAuth();
const username = ref('');
const password = ref('');
const errorMsg = ref('');

await useAsyncData('auth', () => fetchUser());
if (user.value) {
  navigateTo('/dashboard');
}

const handleLogin = async () => {
  errorMsg.value = '';
  try {
    await login(username.value, password.value);
    navigateTo('/dashboard');
  } catch (err) {
    errorMsg.value = err.message || 'Login failed';
  }
};
</script>
