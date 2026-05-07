# English Upgrade

Vocabulary builder + IPA mastery roadmap. AI tự sinh phiên âm IPA và nghĩa tiếng Việt cho mọi từ bạn nhập vào.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Supabase** — Postgres + Auth + RLS
- **Groq** — AI sinh IPA, nghĩa, ví dụ (model `llama-3.3-70b-versatile`)
- **Shadcn UI** + Tailwind CSS
- **Web Speech API** — TTS phát âm

## Tính năng

| Module | Mô tả |
|---|---|
| Vocabulary | CRUD từ vựng, kèm IPA UK + US, nghĩa, định nghĩa, ví dụ |
| AI auto-fill | Bấm 1 nút → AI điền mọi trường (IPA, nghĩa VI/EN, 3 ví dụ) |
| Decks | Nhóm từ vựng theo chủ đề (IELTS, Business, ...) |
| SRS Review | Thuật toán SM-2 (Anki-style) — 4 nút Again/Hard/Good/Easy + hotkeys 1-4 |
| IPA Roadmap | 5 cấp độ × 30+ bài: vowels → diphthongs → phụ âm khó → trọng âm → connected speech |
| TTS | Phát âm UK/US qua Web Speech API ngay trên browser |

## Setup

### 1. Cài dependencies

```bash
npm install
```

### 2. Tạo Supabase project

1. Tạo project tại https://supabase.com
2. Lấy project URL + publishable key (anon)
3. Vào SQL Editor → paste toàn bộ nội dung `supabase/schema.sql` → Run

### 3. Cấu hình env

Tạo file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
```

Lấy `GROQ_API_KEY` miễn phí tại https://console.groq.com/keys

### 4. Chạy dev

```bash
npm run dev
```

Mở http://localhost:3000 → đăng ký tài khoản → bắt đầu học.

## Cấu trúc

```
app/
├── (auth)/           # login, signup
├── (app)/            # protected routes
│   ├── dashboard/
│   ├── vocabulary/   # CRUD + AI generation
│   ├── decks/
│   ├── review/       # SRS session
│   └── ipa/          # 5-level roadmap
├── api/ai/generate-word/  # Groq endpoint
└── auth/callback     # Supabase OAuth callback

lib/
├── supabase/{client,server,middleware}.ts
├── groq.ts           # AI prompt + response parsing
├── srs.ts            # SM-2 algorithm
├── ipa-data.ts       # 5-level lesson curriculum
└── utils.ts

components/
├── ui/               # shadcn primitives
├── speak-button.tsx
└── theme-toggle.tsx

types/database.ts     # generated Supabase types
supabase/schema.sql   # one-shot migration
```

## Lộ trình học IPA (built-in)

| Level | Nội dung | Số bài | Tiêu chí |
|---|---|---|---|
| 1. Monophthongs | 12 nguyên âm đơn /iː ɪ e æ ʌ ɑː ɒ ɔː ʊ uː ɜː ə/ | 12 | Phân biệt minimal pairs |
| 2. Diphthongs | 8 nguyên âm đôi /eɪ aɪ ɔɪ aʊ əʊ ɪə eə ʊə/ | 8 | Đọc đúng 50 từ random |
| 3. Phụ âm khó | /θ ð ʃ ʒ tʃ dʒ ŋ/ | 7 | Phân biệt think/sink, ship/chip |
| 4. Trọng âm | Word stress + schwa + weak forms | 4 | Đoán đúng 80% từ mới |
| 5. Connected speech | Linking, assimilation, elision, intrusion | 4 | Transcribe câu nói tự nhiên |

Mỗi bài có:
- Mô tả + mẹo phát âm (vị trí miệng/lưỡi)
- 4 ví dụ kèm audio
- Minimal pairs (so sánh phân biệt)
- Quiz 5 câu — đạt ≥80% được mark "mastered"

## Scripts

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Dev server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Bảo mật

- Row Level Security (RLS) enabled ở mọi bảng — user chỉ truy cập được data của mình
- Groq API key chỉ dùng phía server (route handler `/api/ai/generate-word`)
- Supabase publishable key an toàn để expose phía client
