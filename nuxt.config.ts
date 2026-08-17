export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  compatibilityDate: '2025-09-01',
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Shopee Affiliate Link Generator',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    },
    // Hiệu ứng chuyển trang kiểu mobile app (định nghĩa trong main.css)
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  devtools: { enabled: true },

  runtimeConfig: {
    // Shopee Affiliate Open API credentials (lấy từ https://affiliate.shopee.vn -> Công cụ -> API)
    shopeeAppId: process.env.SHOPEE_APP_ID || '',
    shopeeAppSecret: process.env.SHOPEE_APP_SECRET || '',
    // Fallback: affiliate id để build link an_redir thủ công khi chưa có API credentials
    shopeeAffiliateId: process.env.SHOPEE_AFFILIATE_ID || '',
    // MongoDB
    mongodbUri: process.env.MONGODB_URI || 'mongodb://admin:conchohacker@localhost:27017/shopee-affiliate?authSource=admin',
    mongodbName: process.env.MONGODB_NAME || 'shopee-affiliate',
  },

  nitro: {
    logLevel: 'warn' // Ẩn deprecation warnings
  },
  devServer: {
    port: 9998
  },
})
