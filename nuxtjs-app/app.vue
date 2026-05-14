<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<template>
  <div style="background: var(--bg-primary); min-height: 100vh; overflow: hidden;">
    <ChatWindow />
    <Toaster position="top-center" theme="dark" richColors expand />
  </div>
</template>
