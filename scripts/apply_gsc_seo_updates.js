/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function replaceOrThrow(content, before, after, label) {
  if (!content.includes(before)) {
    throw new Error(`Replacement target not found: ${label}`);
  }
  return content.replace(before, after);
}

function applySneakers(content) {
  content = replaceOrThrow(
    content,
    `<p>「日本で完売したレアスニーカーが欲しい」「海外限定カラーを定価で手に入れたい！」スニーカーヘッズにとって、海外通販はもはや必須のスキルです。</p>
<p>しかし、「偽物を掴まされないか」「関税はいくらかかるのか」といった不安も尽きません。本記事では、海外通販歴10年以上の専門スタッフが、<strong>「真贋鑑定の信頼性・配送の速さ・関税の透明性」</strong>を軸に、今リアルにおすすめできるスニーカー通販サイトを厳選して紹介します。</p>

<div style="background: #fdf2f2; border-left: 5px solid #111110; padding: 20px; margin: 30px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #111110;">この記事を読んでわかること</p>
  <ul style="margin: 10px 0 0 20px; padding: 0;">
    <li>偽物の心配なし！鑑定付きのおすすめマーケットプレイス</li>
    <li>抽選（ラッフル）に強い海外有名セレクトショップ</li>
    <li>関税込み（DDP）で安心して買えるサイトの見分け方</li>
  </ul>
</div>`,
    `<p>「<strong>海外 スニーカー サイト</strong>で安全に買いたい」「<strong>スニーカー 海外通販</strong>のおすすめを知りたい」「<strong>ナイキ 海外通販サイト</strong>はどこが安心？」という人向けに、いま本当に使いやすいショップを整理しました。</p>
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
    <li><strong>ナイキの海外通販サイトを探す</strong>なら、まずは Kith や BSTN の抽選・新着を追うのが近道</li>
  </ul>
</div>`,
    'sneakers intro'
  );

  content = replaceOrThrow(
    content,
    '<h2>【保存版】海外スニーカー通販比較表</h2>',
    '<h2>【保存版】海外スニーカーサイト比較表</h2>',
    'sneakers comparison heading'
  );

  content = replaceOrThrow(
    content,
    '<h2>海外スニーカー通販おすすめサイト12選</h2>',
    '<h2>海外スニーカーサイトおすすめ12選</h2>',
    'sneakers list heading'
  );

  return content.replace(
    /<h2>よくある質問（FAQ）<\/h2>[\s\S]*?<h2>まとめ<\/h2>/,
    `<h2>よくある質問（FAQ）</h2>
<h3>Q. 海外スニーカーサイトはどこが初心者向きですか？</h3>
<p>最初の1足なら、価格の透明性が高く鑑定付きの StockX か、正規セレクトとして安心感のある Kith / BSTN が使いやすいです。まずは「関税込みか」「真贋保証があるか」を確認して選ぶと失敗しにくくなります。</p>

<h3>Q. スニーカー 海外通販で関税がかからないことはありますか？</h3>
<p>個人輸入では課税価格が16,666円以下なら免税の目安がありますが、人気スニーカーはこのラインを超えることが多いです。スニーカー 海外通販では、基本的に関税や消費税が発生する前提で総額を比較するのが安全です。</p>

<h3>Q. ナイキ 海外通販サイトを探すなら、どこを優先すべきですか？</h3>
<p>Nike の一般販売モデルよりも、海外限定カラーやコラボを狙うケースが多いため、Kith・BSTN・Bodega の新着や抽選情報を追うのが定番です。リセールでもよければ StockX で相場を確認してから購入すると失敗しにくくなります。</p>

<h2>まとめ</h2>`
  );
}

function applyPetite(content) {
  content = replaceOrThrow(
    content,
    `<p>「SHEIN以外にも安くて可愛い海外通販はある？」「海外通販を使ってみたいけど、安全性が不安...」そんな悩みをお持ちではありませんか？</p>
<p>2026年現在、海外プチプラ通販はかつてないほど多様化しており、自分の好みにぴったりのサイトを選べるようになりました。本記事では、海外通販歴10年以上の専門スタッフが、<strong>「価格・デザイン・安全性・配送スピード」</strong>の4軸で、今リアルにおすすめできるサイトを厳選して紹介します。</p>

<div style="background: #fdf2f2; border-left: 5px solid #ff4757; padding: 20px; margin: 30px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #ff4757;">この記事を読んでわかること</p>
  <ul style="margin: 10px 0 0 20px; padding: 0;">
    <li>SHEIN以外に圧倒的に安い「次くる」海外通販サイト</li>
    <li>失敗しないための安全なサイトの見分け方</li>
    <li>関税・送料で損をしないための注意点</li>
  </ul>
</div>`,
    `<p>「<strong>海外プチプラファッション通販</strong>で安くて安全なサイトを知りたい」「SHEIN以外に使える海外通販を探したい」という人向けに、今でも使いやすい定番を整理しました。</p>
<p>2026年現在、海外プチプラ通販はかつてないほど多様化しており、価格だけでなく<strong>配送の安定性・レビューの厚さ・関税の分かりやすさ</strong>で差が出ています。本記事では、海外通販歴10年以上の専門スタッフが、<strong>「価格・デザイン・安全性・配送スピード」</strong>の4軸で、今リアルにおすすめできるサイトを厳選して紹介します。</p>

<div style="background: #fdf2f2; border-left: 5px solid #ff4757; padding: 20px; margin: 30px 0; border-radius: 4px;">
  <p style="margin: 0; font-weight: bold; color: #ff4757;">この記事を読んでわかること</p>
  <ul style="margin: 10px 0 0 20px; padding: 0;">
    <li>SHEIN以外に安くて可愛い海外プチプラファッション通販サイト</li>
    <li>海外通販サイトが安い理由と、安全に使うための見分け方</li>
    <li>1回の注文額をどう抑えると税金で損しにくいか</li>
  </ul>
</div>`,
    'petite intro'
  );

  content = replaceOrThrow(
    content,
    '<h2>【一目でわかる】海外プチプラ通販比較表</h2>',
    '<h2>【一目でわかる】海外プチプラファッション通販比較表</h2>',
    'petite comparison heading'
  );

  content = replaceOrThrow(
    content,
    '<h2>海外通販プチプラおすすめサイト10選</h2>',
    '<h2>海外プチプラファッション通販おすすめサイト10選</h2>',
    'petite list heading'
  );

  return content.replace(
    '<h2>海外通販に関するよくある質問（FAQ）</h2>',
    `<h2>海外プチプラファッション通販に関するよくある質問（FAQ）</h2>
<h3>Q. 海外プチプラファッション通販は本当に安いですか？</h3>
<p>同じトレンドでも、国内販売より数割安いことは珍しくありません。ただし送料や関税を含めた総額で比較しないと逆転する場合もあるので、1回の注文額と配送条件を必ず確認しましょう。</p>

<h3>Q. 海外通販サイトが安い理由は何ですか？</h3>
<p>中間マージンが少ないこと、生産から販売までのスピードが速いこと、セール頻度が高いことが主な理由です。特に SHEIN、Temu、Cider などは在庫回転が速く、価格調整も頻繁です。</p>

<h3>Q. SHEIN以外でおすすめの海外通販はありますか？</h3>
<p>韓国っぽい雰囲気なら SONYUNARA や Musinsa、少し大人っぽい高見え路線なら Cider、最安値重視なら Temu や AliExpress も比較候補になります。</p>

<h2>海外通販に関するよくある質問（FAQ）</h2>`
  );
}

function applyCycling(content) {
  content = replaceOrThrow(
    content,
    `<p>海外の高品質なロードバイクやMTB、最新コンポーネントを圧倒的に安く手に入れられる「自転車海外通販」。しかし、2026年現在、かつての王者WiggleやCRCは事実上の日本発送停止となり、風景は激変しました。本記事では、最新のおすすめショップ9選を、検証済みの正しいリンクと高品質な画像共に徹底解説します。</p>`,
    `<p>海外の高品質なロードバイクやMTB、最新コンポーネントを圧倒的に安く手に入れられるのが、<strong>ロードバイク・自転車海外通販</strong>です。しかし、2026年現在、かつての王者WiggleやCRCは事実上の日本発送停止となり、勝ち筋はかなり変わりました。本記事では、いま日本から使いやすいおすすめショップ9選を、検証済みリンクとともに整理します。</p>
<div style='background:#f8fafc;border:1px solid #e2e8f0;padding:18px 20px;margin:24px 0 28px;border-radius:10px;'><p style='margin:0 0 8px;font-weight:700;'>先に結論</p><ul style='margin:0;padding-left:20px;'><li><strong>ホイール・完成車まわりの安定感</strong>なら Merlin Cycles と Canyon</li><li><strong>ウェアや小物をまとめて安く買う</strong>なら Bikeinn と Deporvillage</li><li><strong>コンポや在庫の厚さ</strong>なら Bike24 と Bike-Discount が強いです</li></ul></div>`,
    'cycling intro'
  );

  content = replaceOrThrow(
    content,
    '<h2>2. 自転車海外通販が選ばれる理由とメリット</h2>',
    '<h2>2. ロードバイク・自転車海外通販が選ばれる理由とメリット</h2>',
    'cycling heading 2'
  );

  content = replaceOrThrow(
    content,
    '<h2>4. 海外通販で失敗しないための重要ポイント3選</h2>',
    `<h2>4. 海外通販で失敗しないための重要ポイント3選</h2>
<p>「自転車 海外通販」で検索する人が特に気にしやすいのは、<strong>送料・関税・発送制限</strong>の3点です。価格だけで決めず、以下を必ず見てください。</p>`,
    'cycling point intro'
  );

  return content.replace(
    '<h2>まとめ：世界の在庫を味方につけて最安で最高の1台を</h2>',
    `<h2>よくある質問（FAQ）</h2><h3>Q. ロードバイク 海外通販で関税はかかりますか？</h3><p>自転車本体や多くのパーツは関税ゼロのことが多い一方、輸入消費税と通関手数料は発生します。高額商品は「商品代金の約6%前後」を見込んでおくと予算が組みやすいです。</p><h3>Q. 自転車 海外通販は何日くらいで届きますか？</h3><p>Merlin Cycles や Bike24 のように DHL / FedEx を使う大手なら、在庫品は1週間前後で届くことがあります。完成車は梱包や通関でさらに時間がかかるため、2週間以上を見るのが安全です。</p><h3>Q. Wiggle の代わりになる自転車海外通販サイトはどこですか？</h3><p>総合力では Merlin Cycles、Bikeinn、Bike24 が代替候補です。ウェア中心なら Bikeinn、完成車や直販モデルなら Canyon、ドイツ系パーツなら Bike-Discount まで見ると選びやすくなります。</p><h2>まとめ：世界の在庫を味方につけて最安で最高の1台を</h2>`
  );
}

function applyInterior(content) {
  content = replaceOrThrow(
    content,
    `## 憧れの空間を、国内流通価格の「約半額」で組み上げる

アルテックの美しい木目、ルイスポールセンの柔らかな照明、洗練された海外テイストのラグ。
これら海外の一流インテリアを日本の店舗で購入しようとすると、関税やマージンが上乗せされ、驚くほど高額になることも珍しくありません。

しかし、現在では優れた国際物流により、<strong>大型家具から繊細なガラス食器まで、誰でも安全に「個人輸入」できる時代</strong>になりました。ハードルが心配な方のために、海外テイストをそのまま日本へ届けてくれる優秀な国内セレクトショップも存在します。

本記事では、品質・配送ともに信頼できる<strong>2026年最新のおすすめ海外インテリア通販サイト9選</strong>をプロの視点で徹底比較。絶対に失敗しないための「完全実務マニュアル」とともにお届けします。`,
    `## 憧れの空間を、国内流通価格の「約半額」で組み上げる

北欧家具や輸入雑貨を探していると、<strong>Finnish Design Shop</strong> や Nordic Nest のような海外インテリア通販が必ず候補に入ってきます。日本の店舗経由だと高くなりやすい名作チェアや照明も、個人輸入なら現地価格に近い条件で狙えることがあります。

現在では国際物流がかなり安定しており、<strong>大型家具から繊細な輸入雑貨まで、安全に個人輸入しやすい時代</strong>になりました。一方で、送料・破損リスク・関税込み表示の違いはショップごとに差があります。

本記事では、品質・配送ともに信頼できる<strong>2026年最新のおすすめ海外インテリア通販サイト9選</strong>をプロの視点で徹底比較しつつ、<strong>北欧家具・輸入雑貨を日本から買うときの実務ポイント</strong>までまとめます。`,
    'interior intro'
  );

  content = replaceOrThrow(
    content,
    '## 1. ひと目でわかる：海外インテリア通販 決定版9社 比較表',
    '## 1. ひと目でわかる：海外インテリア通販・輸入雑貨 比較表',
    'interior comparison heading'
  );

  return content.replace(
    '## 結論：インテリアこそ、世界と繋がる価値が最も大きい',
    `## 4. よくある質問（FAQ）

### Finnish Design Shop は日本から買える？
はい。<strong>Finnish Design Shop</strong> は日本発送に対応しており、チェックアウト時に関税込み相当の事前支払いを選べるケースがあります。大型家具は送料が高くなるため、照明・収納・チェアなどカテゴリごとに総額比較するのがコツです。

### 輸入雑貨や北欧インテリアは到着時に税金がかかる？
家具類は関税ゼロでも、<strong>輸入消費税</strong>がかかることがあります。RoyalDesign や SSENSE のように関税込み表示のショップなら追加費用が読めますが、Nordic Nest や一部欧州ショップでは到着時払いになる場合もあるため、注文前に必ず配送ポリシーを確認してください。

### 海外インテリア通販が初めてならどこから始めるべき？
小物から始めるなら Nordic Nest や RoyalDesign、大物家具や本格的な北欧ブランド狙いなら Finnish Design Shop が扱いやすいです。破損リスクを抑えたいなら、まずは食器や照明など比較的軽いカテゴリから試すのがおすすめです。

## 結論：インテリアこそ、世界と繋がる価値が最も大きい`,
    'interior faq insertion'
  );
}

function applyWhisky(content) {
  content = replaceOrThrow(
    content,
    `## 日本未発売のレアボトルを、世界の酒屋から直接買い付ける

日本のウイスキー市場は世界的に見ても成熟していますが、それでも「スコットランドの蒸留所限定ボトル」や「欧州市場向け（EU向け）リリースのボトラーズ」など、どうしても日本の酒屋には並ばない銘柄が存在します。

そんな時に利用したいのが、海を越えて世界中へボトルを発送してくれる<strong>海外のウイスキー専門通販サイト</strong>です。

本記事では、日本国内のモルトラバー（ウイスキー愛好家）が日常的に「個人輸入」で利用している、信頼と実績のある<strong>世界最高峰のウイスキーショップ8選</strong>を徹底解説。さらに、ウイスキー特有の「酒税・関税の計算方法」など、実務的なノウハウも完全網羅します。`,
    `## 日本未発売のレアボトルを、世界の酒屋から直接買い付ける

「<strong>ウイスキー 個人輸入</strong>はどこで買うのが安全？」「<strong>Master of Malt 個人輸入</strong>はまだ使える？」と悩む人向けに、いま日本から使いやすい海外通販サイトを整理しました。

日本のウイスキー市場は成熟していますが、それでも蒸留所限定ボトルや欧州向けリリース、ボトラーズの限定品など、国内ではほぼ見つからない銘柄が存在します。そんな時に利用したいのが、海を越えて世界中へボトルを発送してくれる<strong>海外のウイスキー専門通販サイト</strong>です。

本記事では、日本国内のモルトラバーが日常的に「個人輸入」で利用している、信頼と実績のある<strong>世界最高峰のウイスキーショップ8選</strong>を徹底解説しつつ、酒税・送料・買い方まで実務寄りにまとめます。`,
    'whisky intro'
  );

  content = replaceOrThrow(
    content,
    '## 2. 絶対に外さない「ウイスキー個人輸入」8選 徹底解説',
    '## 2. 絶対に外さない「ウイスキー個人輸入」海外通販サイト8選',
    'whisky list heading'
  );

  return content.replace(
    '## 結論：海を越える価値のあるボトルを手に入れよう',
    `## 4. よくある質問（FAQ）

### Master of Malt は日本から個人輸入できる？
タイミングや配送条件の変更はありますが、<strong>Master of Malt</strong> は日本向けに注文できる時期があります。ボトルごとに発送可否が変わることもあるため、カート投入時の配送表示と酒類発送ポリシーを必ず確認してください。

### ウイスキー個人輸入で税金はいくらかかる？
一般的には、<strong>酒税・輸入消費税・場合によっては関税</strong>がかかります。本文でも触れた通り、1万円前後のボトルなら到着時に1,500円〜2,000円程度の支払いが発生するケースを想定しておくと予算を組みやすいです。

### 初めてのウイスキー個人輸入ならどのサイトが安全？
最初の1本なら The Whisky Exchange か Royal Mile Whiskies のように実績が厚い大手が無難です。品揃えを重視するなら The Whisky Exchange、サンプル小瓶や独自ボトリング重視なら Master of Malt を優先すると選びやすくなります。

## 結論：海を越える価値のあるボトルを手に入れよう`,
    'whisky faq insertion'
  );
}

const updates = [
  {
    slug: 'fashionshop/sneakers/list',
    title: '【2026最新】海外スニーカーサイトおすすめ12選！海外通販で安全に買える人気ショップを徹底比較',
    transform: applySneakers,
  },
  {
    slug: 'overseas-shopping-petite-price-list',
    title: '【2026最新】海外プチプラファッション通販おすすめ10選！安くて安全なサイトを徹底比較',
    transform: applyPetite,
  },
  {
    slug: 'overseas-cycling-shopping-guide-2026',
    title: '【2026年最新】自転車・ロードバイク海外通販おすすめ9選！安い・安全なサイトを徹底比較',
    transform: applyCycling,
  },
  {
    slug: 'interior-furniture-overseas-guide',
    title: '【2026年最新】海外インテリア通販おすすめ9選！北欧家具・輸入雑貨を安全に個人輸入する方法',
    transform: applyInterior,
  },
  {
    slug: 'whisky-overseas-shopping-guide',
    title: '【2026年最新】ウイスキー個人輸入おすすめ8選！海外通販サイト・関税計算・買い方を解説',
    transform: applyWhisky,
  },
];

async function main() {
  for (const update of updates) {
    const { data, error } = await supabase
      .from('posts')
      .select('slug,title,content')
      .eq('slug', update.slug)
      .single();

    if (error || !data) {
      throw new Error(`Failed to load ${update.slug}: ${JSON.stringify(error)}`);
    }

    const nextContent = update.transform(data.content);
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        title: update.title,
        content: nextContent,
      })
      .eq('slug', update.slug);

    if (updateError) {
      throw new Error(`Failed to update ${update.slug}: ${JSON.stringify(updateError)}`);
    }

    console.log(`Updated ${update.slug}`);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
