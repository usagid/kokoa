<script setup>
import { DialogRoot, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from 'reka-ui';

const { isOpen, title, message, type, close } = useDialog();
</script>
<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay class="kokoa-dialog-overlay" />
      <DialogContent class="kokoa-dialog-content">
        <div class="kokoa-dialog-titlebar">
          <DialogTitle>{{ title }}</DialogTitle>
          <DialogClose class="kokoa-dialog-close" @click="close(false)">✕</DialogClose>
        </div>
        <div class="kokoa-dialog-body">
          <DialogDescription style="margin: 0; white-space: pre-wrap;">{{ message }}</DialogDescription>
        </div>
        <div class="kokoa-dialog-footer">
          <button v-if="type === 'confirm'" @click="close(false)" class="kokoa-btn">Cancel</button>
          <button @click="close(true)" class="kokoa-btn kokoa-btn--accent">OK</button>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
