/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function replaceLeadHtml(content, leadHtml) {
  const firstHeadingIndex = content.search(/<h2[^>]*>/i);
  if (firstHeadingIndex === -1) {
    throw new Error('HTML lead replacement failed: <h2> not found');
  }
  return `${leadHtml}\n${content.slice(firstHeadingIndex)}`;
}

function replaceLeadMarkdown(content, leadMarkdown) {
  const dividerIndex = content.indexOf('\n---\n');
  if (dividerIndex !== -1) {
    return `${leadMarkdown}\n\n---\n${content.slice(dividerIndex + 5)}`;
  }

  const firstHeadingIndex = content.search(/\n##\s+/);
  if (firstHeadingIndex === -1) {
    throw new Error('Markdown lead replacement failed: heading divider not found');
  }

  return `${leadMarkdown}\n${content.slice(firstHeadingIndex + 1)}`;
}

function appendIfMissing(content, marker, snippet) {
  if (content.includes(marker)) {
    return content;
  }
  return `${content.trim()}\n\n${snippet}\n`;
}

const updates = {
  'fashionshop/sneakers/list': {
    title: '【2026最新】海外スニーカーサイトおすすめ12選！スニーカー海外通販で安全に買える人気ショップを徹底比較',
    transform(content) {
      const lead = `<p>「<strong>海外 スニーカー サイト</strong>で安全に買いたい」「<strong>スニーカー 海外通販</strong>のおすすめを知りたい」「<strong>ナイキ 海外通販サイト</strong>はどこが安心？」という人向けに、いま本当に使いやすいショップを整理しました。</p>
<p>レアモデルや海外限定カラーを狙える反面、スニーカーの海外通販は<strong>偽物リスク・関税・配送トラブル</strong>が見えづらいジャンルでもあります。本記事では、海外通販歴10年以上の専門スタッフが、<strong>「真贋鑑定の信頼性・配送の速さ・関税の透明性」</strong>を軸に、今リアルにおすすめできる海外スニーカーサイトを厳選して紹介します。</p>

<div style="background: #fdf2f2; border-left: 5px solid #111110; padding: 20px; margin: 30px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #111110;">この記事を読んでわかること</p>
  <ul style="margin: 10px 0 0 20px; padding: 0;">
    <li>海外スニーカーサイトの中でも、初心者が使いやすい定番ショップ</li>
    <li>ナイキや海外限定スニーカーを探すときのショップの使い分け</li>
    <li>関税込み（DDP）か受け取り時払い（DDU）かを見分けるポイント</li>
  </ul>
</div>

<div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px 20px; margin: 24px 0 32px; border-radius: 10px;">
  <p style="margin: 0 0 8px; font-weight: 700;">先に結論</p>
  <ul style="margin: 0; padding-left: 20px;">
    <li><strong>鑑定重視</strong>なら StockX / Stadium Goods</li>
    <li><strong>海外限定モデルやラッフル重視</strong>なら Kith / BSTN / Bodega</li>
    <li><strong>ナイキの海外通販サイト</strong>を探すなら、まずは Kith や BSTN の抽選・新着チェックが近道です</li>
  </ul>
</div>`;

      return replaceLeadHtml(content, lead);
    },
  },
  'overseas-cycling-shopping-guide-2026': {
    title: '【2026年最新】ロードバイク 海外通販おすすめ9選！自転車を安く安全に買えるサイト比較',
    transform(content) {
      let next = replaceLeadHtml(
        content,
        `<p>「<strong>ロードバイク 海外通販</strong>はどこが安い？」「<strong>自転車 海外通販</strong>で失敗しないショップを知りたい」という人向けに、日本から使いやすいサイトを整理しました。</p>
<p>海外の高品質なロードバイクやMTB、最新コンポーネントを圧倒的に安く手に入れられるのが、<strong>ロードバイク・自転車海外通販</strong>です。しかし、2026年現在、かつての王者WiggleやCRCは事実上の日本発送停止となり、勝ち筋はかなり変わりました。本記事では、いま日本から使いやすいおすすめショップ9選を、検証済みリンクとともに整理します。</p>
<div style='background:#f8fafc;border:1px solid #e2e8f0;padding:18px 20px;margin:24px 0 28px;border-radius:10px;'><p style='margin:0 0 8px;font-weight:700;'>先に結論</p><ul style='margin:0;padding-left:20px;'><li><strong>ホイール・完成車まわりの安定感</strong>なら Merlin Cycles と Canyon</li><li><strong>ウェアや小物をまとめて安く買う</strong>なら Bikeinn と Deporvillage</li><li><strong>コンポや在庫の厚さ</strong>なら Bike24 と Bike-Discount が強いです</li></ul></div>`
      );
      next = next.replace(
        '<h2>3. 自転車海外通販おすすめショップ9選 徹底解説</h2>',
        '<h2>3. ロードバイク・自転車海外通販おすすめショップ9選 徹底解説</h2>'
      );
      return next;
    },
  },
  'whisky-overseas-shopping-guide': {
    title: '【2026年最新】ウイスキー個人輸入おすすめ8選！Master of Maltを含む海外通販サイト・関税・買い方を解説',
    transform(content) {
      let next = replaceLeadMarkdown(
        content,
        `## 日本未発売のレアボトルを、世界の酒屋から直接買い付ける

「<strong>ウイスキー 個人輸入</strong>はどこで買うのが安全？」「<strong>Master of Malt 個人輸入</strong>はまだ使える？」と悩む人向けに、いま日本から使いやすい海外通販サイトを整理しました。

日本のウイスキー市場は成熟していますが、それでも蒸留所限定ボトルや欧州向けリリース、ボトラーズの限定品など、国内ではほぼ見つからない銘柄が存在します。そんな時に利用したいのが、海を越えて世界中へボトルを発送してくれる<strong>海外のウイスキー専門通販サイト</strong>です。

本記事では、日本国内のモルトラバーが日常的に「個人輸入」で利用している、信頼と実績のある<strong>世界最高峰のウイスキーショップ8選</strong>を徹底解説しつつ、酒税・送料・買い方まで実務寄りにまとめます。`
      );
      next = next.replace(
        '## 2. 絶対に外さない「ウイスキー個人輸入」海外通販サイト8選',
        '## 2. 絶対に外さない「ウイスキー個人輸入」海外通販サイト8選'
      );
      next = appendIfMissing(
        next,
        '### Master of Malt は日本から個人輸入できる？',
        `## 関連記事

- [海外通販ガイド](/guide)
- [海外インテリア通販おすすめ9選](/articles/interior-furniture-overseas-guide)
- [海外ファッション通販おすすめ25選](/articles/overseas-fashion-shopping-ultimate-guide)`
      );
      return next;
    },
  },
  'interior-furniture-overseas-guide': {
    title: '【2026年最新】海外インテリア通販おすすめ9選！Finnish Design Shop・北欧家具・輸入雑貨を安全に個人輸入する方法',
    transform(content) {
      let next = replaceLeadMarkdown(
        content,
        `## 憧れの空間を、国内流通価格の「約半額」で組み上げる

北欧家具や輸入雑貨を探していると、<strong>Finnish Design Shop</strong> や Nordic Nest のような海外インテリア通販が必ず候補に入ってきます。日本の店舗経由だと高くなりやすい名作チェアや照明も、個人輸入なら現地価格に近い条件で狙えることがあります。

現在では国際物流がかなり安定しており、<strong>大型家具から繊細な輸入雑貨まで、安全に個人輸入しやすい時代</strong>になりました。一方で、送料・破損リスク・関税込み表示の違いはショップごとに差があります。

本記事では、品質・配送ともに信頼できる<strong>2026年最新のおすすめ海外インテリア通販サイト9選</strong>をプロの視点で徹底比較しつつ、<strong>Finnish Design Shop 個人輸入</strong>を含む、北欧家具・輸入雑貨を日本から買うときの実務ポイントまでまとめます。`
      );
      return appendIfMissing(
        next,
        '### Finnish Design Shop は日本から買える？',
        `## 関連記事

- [海外通販ガイド](/guide)
- [海外ファッション通販おすすめ25選](/articles/overseas-fashion-shopping-ultimate-guide)
- [海外プチプラファッション通販おすすめ10選](/articles/overseas-shopping-petite-price-list)`
      );
    },
  },
  'tablet-electronics-overseas-guide': {
    title: '【2026年最新】タブレット 海外通販おすすめ5選！Xiaomi・Lenovoを安く個人輸入する方法',
    transform(content) {
      let next = replaceLeadMarkdown(
        content,
        `## タブレットを海外通販で安く買いたい人へ

「<strong>タブレット 海外通販</strong>で安く買いたい」「Lenovo Xiaoxin や Xiaomi Pad を個人輸入したい」という人向けに、日本から使いやすい通販サイトを整理しました。

iPadの価格が高騰する一方で、Lenovo（Xiaoxin）や Xiaomi、Teclast のAndroidタブレットは、海外通販なら国内より数万円安く買えることがあります。ただし、<strong>Global ROM・技適・到着時の消費税</strong>はショップごとに確認が必要です。

本記事では、日本のガジェット好きが使いやすい<strong>海外タブレット通販サイト5社</strong>を、安さだけでなく発送の安定性・本物の安心感・日本向けの使いやすさで比較します。`
      );
      next = next.replace(
        '## 1. ひと目でわかる：海外タブレット通販 最強5社 比較表',
        '## 1. ひと目でわかる：タブレット海外通販 比較表'
      );
      next = appendIfMissing(
        next,
        '## 関連記事',
        `## 関連記事

- [海外通販ガイド](/guide)
- [海外ファッション通販おすすめ25選](/articles/overseas-fashion-shopping-ultimate-guide)
- [自転車・ロードバイク海外通販おすすめ9選](/articles/overseas-cycling-shopping-guide-2026)`
      );
      return next;
    },
  },
  'overseas-fashion-shopping-ultimate-guide': {
    title: '【2026年最新】海外ファッション通販おすすめ25選！海外の服通販サイトを安く安全に使う方法',
    transform(content) {
      const lead = `<p>「<strong>海外ファッション通販 おすすめ</strong>を知りたい」「<strong>海外 服 通販</strong>で失敗しないサイトを探したい」「<strong>海外通販サイトおすすめ</strong>をまとめて見たい」という人向けに、ジャンル別の定番ショップを整理しました。</p>

<p>円安が進む中でも、海外通販でのファッション購入は依然として大きなメリットがあります。それは「日本未入荷アイテムへのアクセス」「本国価格による割安な購入」「日本ではあり得ない規模のセール」という、国内ショッピングでは得にくい価値があるからです。</p>

<p>一方で、海外通販は正しい知識なしに利用すると「偽物を掴まされないか？」「関税はいくらかかるのか？」といった不安も尽きません。本記事では、10年以上の海外通販歴を持つプロの視点から、日本への確実な配送と正規品の安心感を軸に、<b>厳選25ショップ</b>を徹底比較します。</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:18px 20px;margin:24px 0 32px;border-radius:10px;">
  <p style="margin:0 0 8px;font-weight:700;">先に結論</p>
  <ul style="margin:0;padding-left:20px;">
    <li><strong>ラグジュアリー中心</strong>なら SSENSE / FARFETCH / MYTHERESA</li>
    <li><strong>ストリート・スニーカー</strong>なら Kith / BSTN / END.</li>
    <li><strong>安く広く比較したい</strong>なら YOOX や ASOS まで見ると選びやすいです</li>
  </ul>
</div>`;

      let next = replaceLeadHtml(content, lead);
      next = next.replace(
        '<h2>海外ファッション通販サイト・ベスト5比較表</h2>',
        '<h2>海外ファッション通販サイトおすすめ25選の結論</h2><h2>海外ファッション通販サイト・ベスト5比較表</h2>'
      );
      return next;
    },
  },
  'overseas-shopping-petite-price-list': {
    title: '【2026最新】海外プチプラファッション通販おすすめ10選！安くて安全なサイトを徹底比較',
    transform(content) {
      let next = replaceLeadHtml(
        content,
        `<p>「<strong>海外プチプラファッション通販</strong>で安くて安全なサイトを知りたい」「SHEIN以外に使える海外通販を探したい」という人向けに、今でも使いやすい定番を整理しました。</p>
<p>2026年現在、海外プチプラ通販はかつてないほど多様化しており、価格だけでなく<strong>配送の安定性・レビューの厚さ・関税の分かりやすさ</strong>で差が出ています。本記事では、海外通販歴10年以上の専門スタッフが、<strong>「価格・デザイン・安全性・配送スピード」</strong>の4軸で、今リアルにおすすめできるサイトを厳選して紹介します。</p>
<div style="background: #fdf2f2; border-left: 5px solid #ff4757; padding: 20px; margin: 30px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #ff4757;">この記事を読んでわかること</p>
  <ul style="margin: 10px 0 0 20px; padding: 0;">
    <li>SHEIN以外に安くて可愛い海外プチプラファッション通販サイト</li>
    <li>海外通販サイトが安い理由と、安全に使うための見分け方</li>
    <li>1回の注文額をどう抑えると税金で損しにくいか</li>
  </ul>
</div>`
      );
      return next;
    },
  },
  'overseas-shopping-golf-equipment': {
    title: '【2026年最新】ゴルフ用品 海外通販おすすめ4選！クラブ・ウェアを安く買う方法と関税',
    transform(content) {
      let next = replaceLeadHtml(
        content,
        `<p>「<strong>ゴルフ用品 海外通販</strong>で安く買いたい」「海外限定スペックのクラブやウェアを探したい」という人向けに、日本から使いやすいショップを整理しました。</p>
<p>こだわり派のゴルファーにとって、ゴルフ用品の個人輸入は非常に魅力的な選択肢です。円安の影響を考慮しても、アメリカやイギリスの大型ショップでは<strong>日本国内価格より安く買えるケース</strong>が珍しくありません。また、中古市場（Pre-owned）が活発なため、日本では出会いにくい中古クラブも探しやすいです。</p>
<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:18px 20px;margin:24px 0 28px;border-radius:10px;"><p style="margin:0 0 8px;font-weight:700;">先に結論</p><ul style="margin:0;padding-left:20px;"><li><strong>クラブ全般を広く比較</strong>するなら Global Golf</li><li><strong>日本語で安心して始める</strong>なら Fairway Golf USA</li><li><strong>型落ちや激安セール狙い</strong>なら Rock Bottom Golf を優先すると選びやすいです</li></ul></div>`
      );
      next = next.replace(
        '<h2>1. ゴルフ用品の海外通販ショップ比較一覧</h2>',
        '<h2>1. ゴルフ用品 海外通販ショップ比較一覧</h2>'
      );
      return next;
    },
  },
  'overseas-outdoor-shops-guide': {
    title: '【2026年最新】海外アウトドア通販おすすめ8選！アークテリクス・パタゴニアを安く買う方法',
    transform(content) {
      let next = replaceLeadMarkdown(
        content,
        `## 海外アウトドア通販で失敗したくない人へ

「<strong>アウトドア 海外通販</strong>で安く買いたい」「<strong>アークテリクス 海外通販</strong>や<strong>パタゴニア 海外通販</strong>はどこから買えるのか知りたい」という人向けに、いま使いやすいショップを整理しました。

アウトドア愛好家にとって、アークテリクスやパタゴニアのような人気ブランドは国内価格の高騰や完売が続きやすく、「海外から直接買いたい」と考えるのはとても自然です。ただし、日本向けには<strong>ブランドごとの直送制限</strong>があり、安さだけでショップを選ぶと失敗しやすいジャンルでもあります。

本記事では、単なる安さの紹介に留まらず、日本のアウトドアファンが海外通販で直面する最大の壁である「直送制限」をどう回避するかという視点で、厳選した8つのショップを比較します。`
      );
      next = next.replace(
        '## 1. 知っておくべき「直送制限（Shipping Restrictions）」の法則',
        '## 1. アークテリクス・パタゴニア海外通販で知っておくべき「直送制限」の法則'
      );
      return next;
    },
  },
  'motorcycle-gear-overseas-guide': {
    title: '【2026年最新】バイク用品 海外通販おすすめ7選！ヘルメット・ウェアを安く買う方法',
    transform(content) {
      let next = replaceLeadMarkdown(
        content,
        `## バイク用品を海外通販で安く買いたい人へ

「<strong>バイク用品 海外通販</strong>で安く買いたい」「<strong>ヘルメット 海外通販</strong>はどこが安心？」「Dainese や AGV を本国価格で買いたい」という人向けに、日本から使いやすいショップを整理しました。

Dainese（ダイネーゼ）のレザージャケット、AGVのヘルメット、Alpinestarsのレーシングブーツなど、世界の人気モーターサイクル用品は、日本国内の正規代理店で購入するとかなり高額になることがあります。

しかし、ヨーロッパの大手ディーラーから個人輸入すれば、<strong>セール・免税・在庫の厚さ</strong>を活かして大きく差がつくこともあります。本記事では、価格だけでなく日本発送の安定性・本物の安心感・使いやすさで、おすすめ7社を比較します。`
      );
      return next;
    },
  },
  'kids-baby-overseas-fashion-guide': {
    title: '【2026年最新】子供服 海外通販おすすめ7選！ベビー服を安く安全に個人輸入する方法',
    transform(content) {
      let next = replaceLeadMarkdown(
        content,
        `## 子供服・ベビー服を海外通販で安く買いたい人へ

「<strong>子供服 海外通販</strong>で安く買いたい」「<strong>ベビー服 海外通販</strong>で安全なサイトを知りたい」という人向けに、日本から使いやすいショップを整理しました。

すぐサイズアウトする子供服は、国内で少し良いブランドを揃えると想像以上にコストがかかります。一方で、イギリスやヨーロッパの人気サイトを使えば、<strong>デザインの幅・まとめ買いのしやすさ・セール頻度</strong>の面でかなり有利です。

本記事では、日本への配送実績があり、デザインと品質のバランスが良い海外ベビー・キッズ服通販サイト7社を比較しつつ、サイズ選びや関税の考え方までまとめます。`
      );
      return next;
    },
  },
  'mens-fashion-overseas-guide': {
    title: '【2026年最新】海外メンズファッション通販おすすめ11選！安い人気サイトを徹底比較',
    transform(content) {
      let next = replaceLeadMarkdown(
        content,
        `## 海外メンズファッション通販で安く買いたい人へ

「<strong>海外メンズファッション通販</strong>のおすすめを知りたい」「<strong>メンズファッション 海外通販</strong>で安いサイトを比較したい」という人向けに、いま使いやすい定番ショップを整理しました。

日本のセレクトショップでは完売しやすいブランドや、価格が大きく上乗せされる人気アイテムも、海外通販なら本国価格に近い条件で買えることがあります。特にメンズは、モード・ストリート・アウトレットの3系統を使い分けると失敗しにくくなります。

本記事では、2026年現在、日本の男性が使いやすい11のショップを、<strong>価格・関税の分かりやすさ・サイズ選びのしやすさ</strong>の観点から比較します。`
      );
      return next;
    },
  },
  'ladies-fashion-overseas-guide': {
    title: '【2026年最新】海外レディースファッション通販おすすめ12選！安い人気サイトを徹底比較',
    transform(content) {
      let next = replaceLeadMarkdown(
        content,
        `## 海外レディースファッション通販で安く買いたい人へ

「<strong>海外レディースファッション通販</strong>のおすすめを知りたい」「韓国系からラグジュアリーまで、安いサイトをまとめて見たい」という人向けに、いま使いやすい定番を整理しました。

ロエベやセリーヌのようなラグジュアリー、韓国トレンド、SHEIN や Cider のようなプチプラまで、レディースはジャンルごとに強い通販サイトが大きく分かれます。価格だけでなく、<strong>関税込み表示・返品のしやすさ・サイズ感の分かりやすさ</strong>で選ぶのが失敗しないコツです。

本記事では、日本から使う価値がある12のショップを厳選し、スタイル別の使い分けまでまとめます。`
      );
      return next;
    },
  },
  'overseas-shopping-golf-equipment': {
    title: '【2026年最新】ゴルフ用品 海外通販おすすめ4選！クラブ・ウェアを安く買う方法と関税',
    transform(content) {
      let next = replaceLeadHtml(
        content,
        `<p>「<strong>ゴルフ用品 海外通販</strong>で安く買いたい」「海外限定スペックのクラブやウェアを探したい」という人向けに、日本から使いやすいショップを整理しました。</p>
<p>こだわり派のゴルファーにとって、ゴルフ用品の個人輸入は非常に魅力的な選択肢です。円安の影響を考慮しても、アメリカやイギリスの大型ショップでは<strong>日本国内価格より安く買えるケース</strong>が珍しくありません。また、中古市場（Pre-owned）が活発なため、日本では出会いにくい中古クラブも探しやすいです。</p>
<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:18px 20px;margin:24px 0 28px;border-radius:10px;"><p style="margin:0 0 8px;font-weight:700;">先に結論</p><ul style="margin:0;padding-left:20px;"><li><strong>クラブ全般を広く比較</strong>するなら Global Golf</li><li><strong>日本語で安心して始める</strong>なら Fairway Golf USA</li><li><strong>型落ちや激安セール狙い</strong>なら Rock Bottom Golf を優先すると選びやすいです</li></ul></div>`
      );
      next = next.replace(
        '<h2>1. ゴルフ用品の海外通販ショップ比較一覧</h2>',
        '<h2>1. ゴルフ用品 海外通販ショップ比較一覧</h2>'
      );
      return next;
    },
  },
};

async function main() {
  const slugs = Object.keys(updates);
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, slug, title, content')
    .in('slug', slugs);

  if (error) {
    throw error;
  }

  for (const slug of slugs) {
    const post = posts.find((item) => item.slug === slug);
    if (!post) {
      console.warn(`Skipping missing post: ${slug}`);
      continue;
    }

    const { title, transform } = updates[slug];
    const nextContent = transform(post.content || '');

    const { error: updateError } = await supabase
      .from('posts')
      .update({
        title,
        content: nextContent,
      })
      .eq('id', post.id);

    if (updateError) {
      throw updateError;
    }

    console.log(`Updated: ${slug}`);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
