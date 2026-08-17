<template>
  <div class="card p-5 lg:p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-slate-900">Lịch sử link</h2>
      <button @click="loadHistory" class="btn-secondary !h-9 !px-3 text-xs" :disabled="loading">
        <RefreshCw class="w-3.5 h-3.5" :class="loading ? 'animate-spin' : ''" />
        Tải lại
      </button>
    </div>

    <!-- Loading lần đầu -->
    <div v-if="loading && !items.length" class="py-8 text-center text-sm text-slate-400">
      Đang tải lịch sử...
    </div>

    <!-- DB offline / chưa có link nào -->
    <div v-else-if="!items.length" class="py-8 text-center text-sm text-slate-400">
      {{ loadError ? 'Không tải được lịch sử (kiểm tra MongoDB đã chạy chưa)' : 'Chưa có link nào. Generate link đầu tiên đi!' }}
    </div>

    <!-- Danh sách link -->
    <ul v-else class="space-y-2">
      <li v-for="item in items" :key="item._id"
        class="p-3.5 bg-slate-50 rounded-xl ring-1 ring-slate-100 hover:ring-brand-200 transition-all animate-fade-in">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <a :href="item.affiliateUrl" target="_blank" rel="noopener"
              class="block text-sm font-semibold text-brand-600 truncate hover:underline">
              {{ item.affiliateUrl }}
            </a>
            <p class="text-xs text-slate-400 truncate mt-0.5">{{ item.originUrl }}</p>
            <div class="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
              <span>{{ formatDate(item.createdAt) }}</span>
              <span v-if="item.subId" class="px-1.5 py-0.5 bg-white rounded-full ring-1 ring-slate-200 font-medium">
                {{ item.subId }}
              </span>
            </div>
          </div>
          <button @click="copyLink(item)" class="shrink-0 p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-white transition-all"
            :title="'Copy link'">
            <Check v-if="copiedId === item._id" class="w-4 h-4 text-emerald-500" />
            <Copy v-else class="w-4 h-4" />
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Check, Copy, RefreshCw } from 'lucide-vue-next'
import { getAffiliateLinkHistory } from '~/services/affiliate'
import type { AffiliateLinkHistoryItem } from '~/services/affiliate/types'

const items = ref<AffiliateLinkHistoryItem[]>([])
const loading = ref(false)
const loadError = ref(false)
const copiedId = ref('')

async function loadHistory() {
  loading.value = true
  loadError.value = false
  try {
    const res = await getAffiliateLinkHistory(1, 20)
    items.value = res.data || []
  } catch {
    loadError.value = true
  } finally {
    loading.value = false
  }
}

async function copyLink(item: AffiliateLinkHistoryItem) {
  try {
    await navigator.clipboard.writeText(item.affiliateUrl)
    copiedId.value = item._id
    setTimeout(() => (copiedId.value = ''), 2000)
  } catch { /* clipboard không khả dụng thì bỏ qua */ }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('vi-VN')
}

// Cho phép component cha gọi refresh sau khi generate link mới
defineExpose({ loadHistory })

onMounted(loadHistory)
</script>
