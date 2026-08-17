<template>
  <div class="space-y-4 lg:space-y-6">
    <!-- Form generate link -->
    <AffiliateLinkGenerator @generated="historyRef?.loadHistory()" />

    <!-- Lịch sử link đã tạo -->
    <AffiliateLinkHistory ref="historyRef" />
  </div>
</template>

<script setup lang="ts">
// Trang chính: paste link Shopee -> generate link affiliate + xem lịch sử
const historyRef = ref<{ loadHistory: () => Promise<void> } | null>(null)
</script>
