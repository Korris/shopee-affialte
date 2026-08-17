# Shopee Affiliate Link Generator

App fullstack (Nuxt 4 — FE + BE cùng repo) giúp người dùng paste link sản phẩm Shopee và generate ra link affiliate (tiếp thị liên kết).

## Tính năng

- Paste link sản phẩm Shopee (`shopee.vn`, `shope.ee`, `s.shopee.vn`...) → generate link affiliate
- Tự resolve short link về link sản phẩm đầy đủ, bỏ tracking params rác
- Hỗ trợ Sub ID để tracking chiến dịch (facebook, tiktok...)
- Lưu lịch sử link đã tạo vào MongoDB (fail-soft: DB offline vẫn generate được link)
- 2 chế độ generate:
  - **Shopee Affiliate Open API** (khuyến nghị): cần `SHOPEE_APP_ID` + `SHOPEE_APP_SECRET`, trả về short link `s.shopee.vn/...`
  - **Manual redirect** (fallback): chỉ cần `SHOPEE_AFFILIATE_ID`, build link dạng `shope.ee/an_redir?...`

## Tech Stack

- **Nuxt 4** (Vue 3 + Nitro server routes) — FE và BE cùng 1 repo
- **MongoDB** (native driver) — lưu lịch sử link
- **TailwindCSS** — UI theme Shopee orange
- **lucide-vue-next** — icons

## Cấu trúc

```
├── pages/index.vue                          # Trang chính
├── components/
│   ├── affiliate-link-generator.vue         # Form paste link + kết quả
│   └── affiliate-link-history.vue           # Lịch sử link đã tạo
├── layouts/default.vue                      # Layout chung (header/footer)
├── services/
│   ├── api.ts, api-factory.ts, type.ts      # Axios client dùng chung
│   └── affiliate/                           # Service gọi API affiliate
├── server/
│   ├── api/affiliate/
│   │   ├── generate.post.ts                 # POST /api/affiliate/generate
│   │   └── history.get.ts                   # GET /api/affiliate/history
│   ├── models/index.ts                      # AffiliateLink model
│   └── utils/
│       ├── shopee-link-parser.ts            # Validate/resolve/normalize link Shopee
│       ├── shopee-affiliate-client.ts       # Client Shopee Open API + fallback
│       ├── use-database.ts                  # MongoDB connection
│       └── error-handler.ts                 # Error handling type-safe
```

## Chạy dự án

```bash
# 1. Cài dependencies
npm install

# 2. Tạo file .env từ mẫu và điền credentials
cp .env.example .env

# 3. Chạy dev server (port 9998)
npm run dev
```

Mở http://localhost:9998

## API

| Method | Endpoint | Body/Query | Mô tả |
|--------|----------|------------|-------|
| POST | `/api/affiliate/generate` | `{ url, subId? }` | Generate link affiliate |
| GET | `/api/affiliate/history` | `?page=1&limit=20` | Lịch sử link (mới nhất trước) |
