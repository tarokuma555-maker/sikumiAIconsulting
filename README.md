# シクミAIコンサル LP

非エンジニアのビジネス職向け AI・Claude Code 伴走型スクールのランディングページ。

## 技術スタック
- Next.js 14 (App Router) / TypeScript
- Supabase(無料相談フォームの保存先)
- Vercel(ホスティング)

## セットアップ

```bash
npm install
cp .env.local.example .env.local   # Supabase設定を記入(未設定でも動作します)
npm run dev
```

## Supabase設定
1. Supabaseプロジェクトで `supabase/schema.sql` を SQL Editor から実行
2. `.env.local` に以下を設定
   - `NEXT_PUBLIC_SUPABASE_URL`: プロジェクトURL
   - `SUPABASE_SERVICE_ROLE_KEY`: service_role キー(サーバー側のみで使用)

※ 未設定の場合、フォームは受理されサーバーログに内容が出力されます(本番前に必ず設定してください)。

## Vercelデプロイ
1. GitHubリポジトリにpush
2. Vercelでimportし、環境変数2つを設定
3. デプロイ

## 今後のTODO
- [ ] LINE公式アカウントのURL差し込み(`app/page.tsx` 内の `#` リンク2箇所)
- [ ] 講師写真の差し込み(`.teacher-photo`)
- [ ] 特定商取引法に基づく表記/プライバシーポリシーページの作成
- [ ] TimeRex等の日程調整ツール連携(フォーム送信後の導線)
- [ ] GA4計測タグの設置
- [ ] OGP画像(`public/og.png` 1200x630)の作成と`layout.tsx`への追加
- [ ] 申込通知(メール or LINE Notify or Slack)
