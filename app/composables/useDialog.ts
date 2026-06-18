import { ref } from 'vue';

const isOpen = ref(false);
const title = ref('');
const message = ref('');
const type = ref<'alert' | 'confirm'>('alert');
let resolvePromise = null;

export const useDialog = () => {
  const showAlert = (msg, t = 'Alert') => {
    title.value = t;
    message.value = msg;
    type.value = 'alert';
    isOpen.value = true;
    return new Promise((resolve) => {
      resolvePromise = resolve;
    });
  };

  const showConfirm = (msg, t = 'Confirm') => {
    title.value = t;
    message.value = msg;
    type.value = 'confirm';
    isOpen.value = true;
    return new Promise((resolve) => {
      resolvePromise = resolve;
    });
  };

  const close = (result) => {
    isOpen.value = false;
    if (resolvePromise) {
      resolvePromise(result);
      resolvePromise = null;
    }
  };

  return {
    isOpen,
    title,
    message,
    type,
    showAlert,
    showConfirm,
    close
  };
};
