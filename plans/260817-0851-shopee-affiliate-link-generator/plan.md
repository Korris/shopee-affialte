# Plan: Shopee Affiliate Link Generator

Date: 2026-08-17 | Status: ✅ Complete

## Goal
Fullstack app (FE+BE cùng repo) — user paste link sản phẩm Shopee → generate link affiliate. Bắt chước kiến trúc dự án `C:/Project/vay` (Nuxt 4 + Nitro server routes + MongoDB + Tailwind).

## Architecture (mirror `vay`)
- Nuxt 4, root srcDir (pages/layouts/components/services ở root, không có app.vue)
- BE: `server/api/**` (Nitro), MongoDB native driver, error-handler pattern
- FE: services layer (axios + api-factory), Tailwind design system (đổi brand indigo → Shopee orange #EE4D2D)
- Port dev: 9998 (vay dùng 9999)

## Link generation strategy
1. Validate host Shopee (full + short domains)
2. Short link → resolve redirect thủ công (max 5 hops)
3. Normalize: strip utm_/af_/sp_atk... params, extract shopId/itemId từ `-i.{shop}.{item}`
4. Generate: ưu tiên Shopee Affiliate Open API (GraphQL `generateShortLink`, ký SHA256(AppId+Ts+Payload+Secret)); fallback `shope.ee/an_redir?origin_link=...&affiliate_id=...` nếu chỉ có SHOPEE_AFFILIATE_ID
5. Lưu history MongoDB (fail-soft nếu DB offline)

## Files
- Config: package.json, nuxt.config.ts (runtimeConfig env), tailwind.config.ts, tsconfig.json, .env.example, .gitignore
- BE: server/models/index.ts, server/utils/{use-database,error-handler,shopee-link-parser,shopee-affiliate-client}.ts, server/api/affiliate/{generate.post,history.get}.ts
- FE: layouts/default.vue, pages/index.vue, components/affiliate-link-{generator,history}.vue, services/{api,api-factory,type}.ts + services/affiliate/

## Todo
- [x] Scaffold config + install deps
- [x] BE: models, db, utils, API endpoints
- [x] FE: services, layout, components, page
- [x] Build check (npm run build)

## Unresolved questions
- Shopee Open API credentials chưa có → user cần điền .env (fallback manual-redirect hoạt động khi có SHOPEE_AFFILIATE_ID)
- MongoDB local dùng chung instance với `vay` (cùng credentials) — đổi qua .env nếu cần
