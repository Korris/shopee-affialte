<template>
  <div class="card p-5 lg:p-6">
    <h2 class="text-lg font-bold text-slate-900 mb-1">Tạo link affiliate</h2>
    <p class="text-sm text-slate-500 mb-4">
      Paste link sản phẩm Shopee (shopee.vn, shope.ee, s.shopee.vn...) vào ô bên dưới
    </p>

    <form @submit.prevent="handleGenerate" class="space-y-3">
      <!-- Input link sản phẩm -->
      <div class="relative">
        <LinkIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input v-model="url" type="url" required placeholder="https://shopee.vn/ten-san-pham-i.123.456"
          class="input pl-10" :disabled="loading" />
      </div>

      <!-- Sub ID (tùy chọn, để tracking chiến dịch) -->
      <input v-model="subId" type="text" placeholder="Sub ID (tùy chọn — ví dụ: facebook, tiktok...)"
        class="input" :disabled="loading" />

      <button type="submit" class="btn-primary w-full" :disabled="loading || !url.trim()">
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
        <Sparkles v-else class="w-4 h-4" />
        {{ loading ? 'Đang generate...' : 'Generate link affiliate' }}
      </button>
    </form>

    <!-- Lỗi -->
    <div v-if="error" class="mt-4 p-3.5 bg-rose-50 text-rose-700 text-sm rounded-xl ring-1 ring-rose-200 animate-fade-in">
      {{ error }}
    </div>

    <!-- Kết quả -->
    <div v-if="result" class="mt-4 p-4 bg-emerald-50 rounded-2xl ring-1 ring-emerald-200 animate-pop-in space-y-3">
      <div class="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
        <CheckCircle2 class="w-4 h-4" />
        Link affiliate của bạn
      </div>

      <div class="flex items-center gap-2">
        <input :value="result.affiliateUrl" readonly
          class="flex-1 h-11 px-3.5 rounded-xl bg-white ring-1 ring-emerald-200 text-sm text-slate-800 font-medium truncate focus:outline-none" />
        <button @click="copyToClipboard" class="btn-secondary shrink-0 !h-11 !px-3.5"
          :class="copied ? '!text-emerald-600 !ring-emerald-300' : ''">
          <Check v-if="copied" class="w-4 h-4" />
          <Copy v-else class="w-4 h-4" />
          {{ copied ? 'Đã copy' : 'Copy' }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span class="px-2 py-0.5 bg-white rounded-full ring-1 ring-emerald-200 font-medium">
          {{ result.method === 'open-api' ? 'Shopee Open API' : 'Manual redirect' }}
        </span>
        <span v-if="result.itemId" class="px-2 py-0.5 bg-white rounded-full ring-1 ring-emerald-200">
          Item: {{ result.itemId }}
        </span>
        <a :href="result.affiliateUrl" target="_blank" rel="noopener"
          class="inline-flex items-center gap-1 text-brand-600 font-semibold hover:underline ml-auto">
          Mở thử link <ExternalLink class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, CheckCircle2, Copy, ExternalLink, Link as LinkIcon, Loader2, Sparkles } from 'lucide-vue-next'
import { generateAffiliateLink } from '~/services/affiliate'
import type { GenerateLinkResponse } from '~/services/affiliate/types'

const emit = defineEmits<{ generated: [] }>()

const url = ref('')
const subId = ref('')
const loading = ref(false)
const error = ref('')
const result = ref<GenerateLinkResponse | null>(null)
const copied = ref(false)

async function handleGenerate() {
  loading.value = true
  error.value = ''
  result.value = null
  copied.value = false

  try {
    const res = await generateAffiliateLink(url.value.trim(), subId.value.trim() || undefined)
    console.log('res', res)
    result.value = res.data
    emit('generated') // Báo cho history list refresh
  } catch (err: any) {
    // Chi tiết lỗi thật nằm trong err.response.data (body server trả về), không nằm trong stack
    console.log('err', err)
    console.log('err detail:', err?.response?.data)
    // Lấy message từ error response của server (createError -> data.message)
    error.value = err?.response?.data?.data?.message
      || err?.response?.data?.message
      || 'Không thể generate link. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

async function copyToClipboard() {
  if (!result.value) return
  try {
    await navigator.clipboard.writeText(result.value.affiliateUrl)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // Fallback cho browser cũ / không có clipboard permission
    const input = document.createElement('input')
    input.value = result.value.affiliateUrl
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
}
</script>
