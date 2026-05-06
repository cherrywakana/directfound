
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const articleContent = `
<p>「最新の海外限定ドライバーをいち早く手に入れたい」「日本では手に入らないスペックのアイアンが欲しい」そんなこだわり派のゴルファーにとって、<strong>ゴルフ用品の個人輸入（海外通販）</strong>は非常に魅力的な選択肢です。</p>

<p>円安の影響を考慮しても、アメリカやイギリスの大型ショップでは<strong>日本国内価格より30%以上安く買える</strong>ケースが珍しくありません。また、中古市場（Pre-owned）が極めて活発なため、日本では考えられないような良質な中古クラブが驚きの価格で流通しています。</p>

<p>本記事では、日本への発送実績が豊富で、初心者でも安心して利用できる<strong>ゴルフ用品のおすすめ海外通販ショップを厳選</strong>し、それぞれの特徴や送料・関税の注意点を徹底解説します。</p>

<h2>1. ゴルフ用品の海外通販ショップ比較一覧</h2>
<p>まずは、日本からチェックすべき主要ショップの基本情報をまとめました。<strong>ショップ名をクリックすると公式サイトへ移動</strong>できます。</p>

<table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; font-size: 0.9rem;">
  <thead>
    <tr style="background-color: #f8fafc;">
      <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: left;">ショップ名</th>
      <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: left;">特徴</th>
      <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: left;">日本発送</th>
      <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: left;">主要ブランド</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #e2e8f0;"><a href="https://www.fairwaygolfusa.com/" target="_blank" rel="noopener"><strong>Fairway Golf USA</strong></a></td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">日本語対応。限定スペックが豊富。</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">○（直送）</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">Titleist, PING, TaylorMade</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #e2e8f0;"><a href="https://www.globalgolf.com/" target="_blank" rel="noopener"><strong>Global Golf</strong></a></td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">中古クラブが世界最大級の在庫数。</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">○（直送）</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">Callaway, TaylorMade, Cobra</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #e2e8f0;"><a href="https://www.rockbottomgolf.com/" target="_blank" rel="noopener"><strong>Rock Bottom Golf</strong></a></td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">アウトレットとセールの安さが圧倒的。</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">○（直送）</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">Wilson, Cleveland, Odyssey</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #e2e8f0;"><a href="https://www.carlsgolfland.com/" target="_blank" rel="noopener"><strong>Carl's Golfland</strong></a></td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">アメリカ国内でも信頼厚い老舗ショップ。</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">○（直送）</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">Mizuno, FootJoy, Srixon</td>
    </tr>
  </tbody>
</table>

<h2>2. カテゴリ別・おすすめショップ深掘り解説</h2>

<h3>Fairway Golf USA（フェアウェイゴルフ）</h3>
<p>カルフォルニアに拠点を置く<strong>Fairway Golf USA</strong>は、日本人スタッフが在籍しているため<strong>日本語での問い合わせが可能</strong>という最大の強みを持っています。特に、海外モデルのカスタムシャフトや、日本未発売の限定キャディバッグなどの品揃えは業界トップクラスです。</p>
<p><strong>「初めての海外通販で不安」「英語でのトラブル対応が心配」</strong>という方には、まずこのショップを推奨します。</p>

<div style="text-align: center; margin: 2rem 0;">
  <a href="https://www.fairwaygolfusa.com/" target="_blank" rel="noopener" style="background-color: #111110; color: #ffffff; padding: 16px 40px; border-radius: 9999px; text-decoration: none; font-weight: 800; display: inline-block;">Fairway Golf USA 公式サイト ↗</a>
</div>

<h3>Global Golf（グローバルゴルフ）</h3>
<p><strong>Global Golf</strong>は、最新モデルはもちろんのこと、<strong>中古クラブ（Certified Pre-Owned）の充実度</strong>で世界中のゴルファーに知られています。クラブの状態（Condition）が非常に詳細にランク付けされており、プロによる検品済みのクラブを安心して購入できます。</p>
<p>また、下取りプログラムや不定期で開催される「20% OFF Site-wide」などのキャンペーンを組み合わせることで、最新ギアを驚異的な低価格で手に入れることが可能です。</p>

<div style="text-align: center; margin: 2rem 0;">
  <img src="https://ggmcgokdtmflioqezrqk.supabase.co/storage/v1/object/public/shop-thumbnails/global-golf.webp" alt="Global Golf" style="max-width: 100%; border-radius: 12px; border: 1px solid #e2e8f0;">
</div>

<div style="text-align: center; margin: 2rem 0;">
  <a href="https://www.globalgolf.com/" target="_blank" rel="noopener" style="background-color: #111110; color: #ffffff; padding: 16px 40px; border-radius: 9999px; text-decoration: none; font-weight: 800; display: inline-block;">Global Golf 公式サイト ↗</a>
</div>

<h3>Rock Bottom Golf（ロックボトムゴルフ）</h3>
<p>とにかく<strong>「安さ」を最優先</strong>するなら、<strong>Rock Bottom Golf</strong>は外せません。名前の通り「どん底（Rock Bottom）」価格を目指しており、特にウェア、ボール、シューズ、型落ちのアイアンセットなどが破格で放出されます。毎日更新される「Daily Deals」をチェックするだけでも価値があります。</p>

<div style="text-align: center; margin: 2rem 0;">
  <a href="https://www.rockbottomgolf.com/" target="_blank" rel="noopener" style="background-color: #111110; color: #ffffff; padding: 16px 40px; border-radius: 9999px; text-decoration: none; font-weight: 800; display: inline-block;">Rock Bottom Golf 公式サイト ↗</a>
</div>

<h2>3. 海外通販でゴルフ用品を買う際の注意点</h2>

<h3>関税と消費税について</h3>
<p>ゴルフ用品は基本的に<strong>「関税は無税（0%）」</strong>ですが、輸入消費税（国内消費税相当分）がかかります。一般的に、<strong>「商品代金の60%」に対して10%の消費税</strong>が課税されます。また、配送会社（FedExやDHLなど）の立替納税手数料（数百円〜2,000円程度）が別途発生します。</p>

<h3>送料と配送日数</h3>
<p>ドライバーなどの長尺物は送料が高くなりやすく、アメリカからの直送で<strong>1本あたり5,000円〜8,000円程度</strong>が目安です。2本以上まとめて注文することで、1本あたりの送料を大幅に抑えることができます。配送日数は通常<strong>5日〜10日程度</strong>で日本に到着します。</p>

<h2>4. よくある質問（FAQ）</h2>
<div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; margin-top: 2rem;">
  <p><strong>Q. 海外モデルと日本モデルで性能に違いはありますか？</strong><br>
  A. ヘッド自体の基本性能は同じですが、<strong>シャフトのフレックス（硬さ）</strong>が海外モデルの方が1ランク程度硬い設定になっていることが多いです。また、ライ角やグリップの太さが異なる場合があるため、スペック表をよく確認することをおすすめします。</p>
  
  <p><strong>Q. 偽物が届く心配はありませんか？</strong><br>
  A. 本記事で紹介したショップはいずれも全米クラスの大型正規販売店であり、偽物を扱うことはまず考えられません。メーカーから直接仕入れているため、品質に関しては国内ショップと同等に信頼できます。</p>
  
  <p><strong>Q. 返品はできますか？</strong><br>
  A. 多くのショップで30日以内の返品・交換を受け付けていますが、<strong>自己都合の場合は返送送料が自己負担</strong>となります。国際送料は高額なため、注文間違いには細心の注意を払いましょう。</p>
</div>
`;

async function updateArticle() {
  const slug = 'overseas-shopping-golf-equipment';
  
  // 削除して再挿入
  await supabase.from('posts').delete().eq('slug', slug);
  
  const { error } = await supabase.from('posts').insert({
    slug: slug,
    title: '海外通販でゴルフ用品を安く買う方法｜おすすめショップ4選と関税・送料の全知識',
    content: articleContent,
    category: 'スポーツ・アウトドア',
    thumbnail_url: 'https://ggmcgokdtmflioqezrqk.supabase.co/storage/v1/object/public/shop-thumbnails/article-golf-hero.webp'
  });

  if (error) console.error('Error inserting article:', error);
  else console.log('Article eye-catch updated successfully to the custom hero image.');
}

updateArticle();
