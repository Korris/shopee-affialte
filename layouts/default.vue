<template>
  <div class="min-h-screen bg-mist flex flex-col">
    <!-- Header -->
    <header class="bg-gradient-to-r from-brand-500 to-brand-600 shadow-glow">
      <div class="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
        <div class="w-11 h-11 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center ring-1 ring-white/20">
          <ShoppingBag class="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 class="text-base font-bold text-white tracking-tight">Shopee Affiliate</h1>
          <p class="text-xs text-orange-100">Generate link tiếp thị liên kết</p>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 w-full max-w-3xl mx-auto p-4 lg:p-6">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="py-4 text-center text-xs text-slate-400">
      Paste link sản phẩm Shopee → nhận link affiliate trong 1 giây
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ShoppingBag } from 'lucide-vue-next'
</script>
