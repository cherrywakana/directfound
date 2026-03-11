---
description: ブランド別SEO記事の自動生成とSupabase(DB)への直接登録手順
---

# ブランド別SEO記事の生成・投稿ワークフロー (Ver 3.2 - DB厳格運用)

このワークフローは、DBに登録された情報を基に高品質なブランド別ガイド記事を生成・投稿するための手順書です。**「DBにない情報は書かない」「ブラウザ調査に頼らない」**ことを徹底します。

> [!IMPORTANT]
> **ターゲット読者**: 「海外通販でそのブランドが買えることは知っているが、具体的にどのショップが安全で、かつ提携リンク（お得）があるか」を探しているユーザー。

---

## Step 0: DB情報の精査（ブラウザ調査禁止）
記事の構成を決める前に、DBから「本当に紹介可能なショップ」のみを抽出する。**新規のショップをブラウザで探して記事に追加することは厳禁。**

1. DBから対象ブランドの取り扱いショップを抽出する（Step 1のスクリプトを使用）。
2. 紹介ショップの条件:
   - `shops` テーブルに登録されていること。
   - `shop_brands` テーブルで `status` が `active`（または `found`）であること。
   - `image_url` が設定されていること（画像がないショップは原則避ける）。
3. 掲載数: DBにある有力ショップを **5〜8件** 選定。

---

## Step 1: DBデータ抽出スクリプト
AIの推測を排除し、DBの値を唯一の正解とする。

```bash
export $(cat .env.local | xargs) && node -e '
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function getShops() {
    // ブランド情報の取得
    const { data: brand } = await supabase.from("brands").select("id, name").eq("slug", "[BRAND_SLUG]").single();
    if (!brand) return;

    // ショップ詳細と取り扱いURL（外部リンク）を取得
    const { data: shops } = await supabase
        .from("shop_brands")
        .select(`
            brand_url, 
            shops(name, slug, popularity_score, is_affiliate, image_url)
        `)
        .eq("brand_id", brand.id)
        .neq("status", "not_found");
    
    console.log(JSON.stringify(shops.sort((a, b) => b.shops.popularity_score - a.shops.popularity_score), null, 2));
}
getShops();'
```

- **カテゴリ**: 投稿時のカテゴリは必ず **「ブランド」** とする。

---

## Step 2: SEO設計
1. **スラッグ**: `[brand]-overseas-shopping-guide`
2. **タイトル**: 30〜40文字。「ブランド名」と「海外通販」を含める。

---

## Step 3: 記事コンテンツの執筆ルール
目標文字数: **5,000文字以上**。

### 3-1. 記事構成
1. 導入（3〜5行）: タイトルを本文冒頭で繰り返さない。
2. ショップ個別紹介（5〜8件）
3. ★ ショップ比較テーブル（一覧表）
4. 個人輸入の実践ガイド（関税・サイズ・偽物対策）
5. まとめ

### 3-2. ショップ個別紹介 (厳格フォーマット)
- `<h3>` で見出し（「1. ショップ名」）
- **画像**: DBの `image_url` を使用。`<a>` タグで **ショップへの外部リンク（`brand_url`）** を貼る。
- **リンク**: 記事内の全てのショップリンク（画像、テキスト、ボタン）は **ショップ公式サイトへの外部リンク（`brand_url`）** とする。
  - 内部リンク（`/shops/[slug]`）は使用しない。
- **紹介文**: 3〜5行。DBの情報を基に記述。
- **CTA**: 中央寄せボタン。リンク先は **`brand_url`**。

### 3-3. 投稿形式
- **形式**: **必ずHTML形式**（`<p>`, `<h2>`, `<table>`等）で構成する。

---

## Step 4: 投稿
1. **アイキャッチ**: 16:9のプレミアムな画像を生成。
2. **投稿**: `manage_articles.js` を使用。
   - `category`: "ブランド"

---

## Step 5: 公開後の監査
1. **外部リンク確認**: 画像やボタンをクリックして、DBに登録された `brand_url` へ正しく飛ぶか確認。
2. **不備の発見**: 外部リンクが `null` だったり、画像が崩れている場合は、記事を修正するのではなく、まず **DBの情報を修正（manage_shop.mdに従う）** してから記事を再生成する。
