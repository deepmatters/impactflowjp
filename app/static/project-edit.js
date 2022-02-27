// Get csrf token from Flask backend
const csrfToken = document.getElementById('csrf').firstChild.value

// Define blank form data to be used later by fetch function
let formData = {}

// Define form elements by id
const title = document.getElementById('title')
const impactWrapper = document.getElementById('impactWrapper')
const summary = document.getElementById('summary')
const duration = document.getElementById('duration')
const durationGuide = document.getElementById('durationGuide')
const budget = document.getElementById('budget')
const budgetGuide = document.getElementById('budgetGuide')
const teamWrapper = document.getElementById('teamWrapper')
const published = document.getElementById('published')

// Load existing form data
const projectId = document.getElementById('projectId').innerHTML
const dataJson = document.getElementById('data').innerHTML
const data = JSON.parse(dataJson)

// Impact target filter function
function filterTarget(impact) {
    let target = ''

    if (document.getElementById(`sdg${impact}`).value === '目標1 貧困をなくそう') {
        target = `
            <br>
            <fieldset>
                <legend>ターゲットを選択します。 ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="1.1　2030年までに、現在１日1.25ドル未満で生活する人々と定義されている極度の貧困をあらゆる場所で終わらせる。（現在、1日1.25ドル未満で生活する人々として測定）。">
                    <label for="targetGroup${impact}-1">1.1　2030年までに、現在１日1.25ドル未満で生活する人々と定義されている極度の貧困をあらゆる場所で終わらせる。（現在、1日1.25ドル未満で生活する人々として測定）。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="1.2 2030年までに、各国定義によるあらゆる次元の貧困状態にある、全ての年齢の男性、女性、子供の割合を半減させる。">
                    <label for="targetGroup${impact}-2">1.2 2030年までに、各国定義によるあらゆる次元の貧困状態にある、全ての年齢の男性、女性、子供の割合を半減させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="1.3 各国において最低限の基準を含む適切な社会保護制度及び対策を実施し、2030年までに貧困層及び脆弱層に対し十分な保護を達成する。">
                    <label for="targetGroup${impact}-3">1.3 各国において最低限の基準を含む適切な社会保護制度及び対策を実施し、2030年までに貧困層及び脆弱層に対し十分な保護を達成する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="1.4 2030年までに、貧困層及び脆弱層をはじめ、全ての男性及び女性が、基礎的サービスへのアクセス、土地及びその他の形態の財産に対する所有権と管理権限、相続財産、天然資源、適切な新技術、マイクロファイナンスを含む金融サービスに加え、経済的資源についても平等な権利を持つことができるように確保する。">
                    <label for="targetGroup${impact}-4">1.4 2030年までに、貧困層及び脆弱層をはじめ、全ての男性及び女性が、基礎的サービスへのアクセス、土地及びその他の形態の財産に対する所有権と管理権限、相続財産、天然資源、適切な新技術、マイクロファイナンスを含む金融サービスに加え、経済的資源についても平等な権利を持つことができるように確保する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="1.5 2030年までに、貧困層や脆弱な状況にある人々の強靱性（レジリエンス）を構築し、気候変動に関連する極端な気象現象やその他の経済、社会、環境的ショックや災害に暴露や脆弱性を軽減する。">
                    <label for="targetGroup${impact}-5">1.5 2030年までに、貧困層や脆弱な状況にある人々の強靱性（レジリエンス）を構築し、気候変動に関連する極端な気象現象やその他の経済、社会、環境的ショックや災害に暴露や脆弱性を軽減する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-6" name="targetGroup${impact}" value="1.a あらゆる次元での貧困を終わらせるための計画や政策を実施するべく、後発開発途上国をはじめとする開発途上国に対して適切かつ予測可能な手段を講じるため、開発協力の強化などを通じて、さまざまな供給源からの相当量の資源の動員を確保する。">
                    <label for="targetGroup${impact}-6">1.a あらゆる次元での貧困を終わらせるための計画や政策を実施するべく、後発開発途上国をはじめとする開発途上国に対して適切かつ予測可能な手段を講じるため、開発協力の強化などを通じて、さまざまな供給源からの相当量の資源の動員を確保する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-7" name="targetGroup${impact}" value="1.b 貧困撲滅のための行動への投資拡大を支援するため、国、地域及び国際レベルで、貧困層やジェンダーに配慮した開発戦略に基づいた適正な政策的枠組みを構築する。">
                    <label for="targetGroup${impact}-7">1.b 貧困撲滅のための行動への投資拡大を支援するため、国、地域及び国際レベルで、貧困層やジェンダーに配慮した開発戦略に基づいた適正な政策的枠組みを構築する。</label>
                </div>
            </fieldset>
      
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標2 飢餓をゼロに') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="2.1 2030年までに、飢餓を撲滅し、全ての人々、特に貧困層及び幼児を含む脆弱な立場にある人々が一年中安全かつ栄養のある食料を十分得られるようにする。">
                    <label for="targetGroup${impact}-1">2.1 2030年までに、飢餓を撲滅し、全ての人々、特に貧困層及び幼児を含む脆弱な立場にある人々が一年中安全かつ栄養のある食料を十分得られるようにする。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="2.2 ５歳未満の子供の発育阻害や消耗性疾患について国際的に合意されたターゲットを2025年までに達成するなど、2030年までにあらゆる形態の栄養不良を解消し、若年女子、妊婦・授乳婦及び高齢者の栄養ニーズへの対処を行う。">
                    <label for="targetGroup${impact}-2">2.2 ５歳未満の子供の発育阻害や消耗性疾患について国際的に合意されたターゲットを2025年までに達成するなど、2030年までにあらゆる形態の栄養不良を解消し、若年女子、妊婦・授乳婦及び高齢者の栄養ニーズへの対処を行う。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="2.3 2030年までに、土地、その他の生産資源や、投入財、知識、金融サービス、市場及び高付加価値化や非農業雇用の機会への確実かつ平等なアクセスの確保などを通じて、女性、先住民、家族農家、牧畜民及び漁業者をはじめとする小規模食料生産者の農業生産性及び所得を倍増させる。">
                    <label for="targetGroup${impact}-3">2.3 2030年までに、土地、その他の生産資源や、投入財、知識、金融サービス、市場及び高付加価値化や非農業雇用の機会への確実かつ平等なアクセスの確保などを通じて、女性、先住民、家族農家、牧畜民及び漁業者をはじめとする小規模食料生産者の農業生産性及び所得を倍増させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="2.4 2030年までに、生産性を向上させ、生産量を増やし、生態系を維持し、気候変動や極端な気象現象、干ばつ、洪水及びその他の災害に対する適応能力を向上させ、漸進的に土地と土壌の質を改善させるような、持続可能な食料生産システムを確保し、強靭（レジリエント）な農業を実践する。">
                    <label for="targetGroup${impact}-4">2.4 2030年までに、生産性を向上させ、生産量を増やし、生態系を維持し、気候変動や極端な気象現象、干ばつ、洪水及びその他の災害に対する適応能力を向上させ、漸進的に土地と土壌の質を改善させるような、持続可能な食料生産システムを確保し、強靭（レジリエント）な農業を実践する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="2.5 2020年までに、国、地域及び国際レベルで適正に管理及び多様化された種子・植物バンクなども通じて、種子、栽培植物、飼育・家畜化された動物及びこれらの近縁野生種の遺伝的多様性を維持し、国際的合意に基づき、遺伝資源及びこれに関連する伝統的な知識へのアクセス及びその利用から生じる利益の公正かつ衡平な配分を促進する。">
                    <label for="targetGroup${impact}-5">2.5 2020年までに、国、地域及び国際レベルで適正に管理及び多様化された種子・植物バンクなども通じて、種子、栽培植物、飼育・家畜化された動物及びこれらの近縁野生種の遺伝的多様性を維持し、国際的合意に基づき、遺伝資源及びこれに関連する伝統的な知識へのアクセス及びその利用から生じる利益の公正かつ衡平な配分を促進する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-6" name="targetGroup${impact}" value="2.a 開発途上国、特に後発開発途上国における農業生産能力向上のために、国際協力の強化などを通じて、農村インフラ、農業研究・普及サービス、技術開発及び植物・家畜のジーン・バンクへの投資の拡大を図る。">
                    <label for="targetGroup${impact}-6">2.a 開発途上国、特に後発開発途上国における農業生産能力向上のために、国際協力の強化などを通じて、農村インフラ、農業研究・普及サービス、技術開発及び植物・家畜のジーン・バンクへの投資の拡大を図る。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-7" name="targetGroup${impact}" value="2.b ドーハ開発ラウンドのマンデートに従い、全ての農産物輸出補助金及び同等の効果を持つ全ての輸出措置の同時撤廃などを通じて、世界の市場における貿易制限や歪みを是正及び防止する。">
                    <label for="targetGroup${impact}-7">2.b ドーハ開発ラウンドのマンデートに従い、全ての農産物輸出補助金及び同等の効果を持つ全ての輸出措置の同時撤廃などを通じて、世界の市場における貿易制限や歪みを是正及び防止する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-8" name="targetGroup${impact}" value="2.c 食料価格の極端な変動に歯止めをかけるため、食料市場及びデリバティブ市場の適正な機能を確保するための措置を講じ、食料備蓄などの市場情報への適時のアクセスを容易にする。">
                    <label for="targetGroup${impact}-8">2.c 食料価格の極端な変動に歯止めをかけるため、食料市場及びデリバティブ市場の適正な機能を確保するための措置を講じ、食料備蓄などの市場情報への適時のアクセスを容易にする。</label>
                </div>
            </fieldset>
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標3 全ての人に健康と福祉を') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="3.1 2030年までに、世界の妊産婦の死亡率を出生10万人当たり70人未満に削減する。">
                    <label for="targetGroup${impact}-1">3.1 2030年までに、世界の妊産婦の死亡率を出生10万人当たり70人未満に削減する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="3.2 全ての国が新生児死亡率を少なくとも出生1,000件中12件以下まで減らし、５歳以下死亡率を少なくとも出生1,000件中25件以下まで減らすことを目指し、 2030年までに、新生児及び５歳未満児の予防可能な死亡を根絶する。">
                    <label for="targetGroup${impact}-2">3.2 全ての国が新生児死亡率を少なくとも出生1,000件中12件以下まで減らし、５歳以下死亡率を少なくとも出生1,000件中25件以下まで減らすことを目指し、 2030年までに、新生児及び５歳未満児の予防可能な死亡を根絶する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="3.3 2030年までに、エイズ、結核、マラリア及び顧みられない熱帯病といった伝染病を根絶するとともに肝炎、水系感染症及びその他の感染症に対処する。">
                    <label for="targetGroup${impact}-3">3.3 2030年までに、エイズ、結核、マラリア及び顧みられない熱帯病といった伝染病を根絶するとともに肝炎、水系感染症及びその他の感染症に対処する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="3.4 2030年までに、非感染性疾患による若年死亡率を、予防や治療を通じて３分の１減少させ、精神保健及び福祉を促進する。">
                    <label for="targetGroup${impact}-4">3.4 2030年までに、非感染性疾患による若年死亡率を、予防や治療を通じて３分の１減少させ、精神保健及び福祉を促進する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="3.5 薬物乱用やアルコールの有害な摂取を含む、物質乱用の防止・治療を強化する。">
                    <label for="targetGroup${impact}-5">3.5 薬物乱用やアルコールの有害な摂取を含む、物質乱用の防止・治療を強化する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-6" name="targetGroup${impact}" value="3.6 2020年までに、世界の道路交通事故による死傷者を半減させる。">
                    <label for="targetGroup${impact}-6">3.6 2020年までに、世界の道路交通事故による死傷者を半減させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-7" name="targetGroup${impact}" value="3.7 2030年までに、家族計画、情報・教育及び性と生殖に関する健康の国家戦略・計画への組み入れを含む、性と生殖に関する保健サービスを全ての人々が利用できるようにする。">
                    <label for="targetGroup${impact}-7">3.7 2030年までに、家族計画、情報・教育及び性と生殖に関する健康の国家戦略・計画への組み入れを含む、性と生殖に関する保健サービスを全ての人々が利用できるようにする。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-8" name="targetGroup${impact}" value="3.8 全ての人々に対する財政リスクからの保護、質の高い基礎的な保健サービスへのアクセス及び安全で効果的かつ質が高く安価な必須医薬品とワクチンへのアクセスを含む、ユニバーサル・ヘルス・カバレッジ（UHC）を達成する。">
                    <label for="targetGroup${impact}-8">3.8 全ての人々に対する財政リスクからの保護、質の高い基礎的な保健サービスへのアクセス及び安全で効果的かつ質が高く安価な必須医薬品とワクチンへのアクセスを含む、ユニバーサル・ヘルス・カバレッジ（UHC）を達成する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-9" name="targetGroup${impact}" value="3.9 2030年までに、有害化学物質、並びに大気、水質及び土壌の汚染による死亡及び疾病の件数を大幅に減少させる。">
                    <label for="targetGroup${impact}-9">3.9 2030年までに、有害化学物質、並びに大気、水質及び土壌の汚染による死亡及び疾病の件数を大幅に減少させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-10" name="targetGroup${impact}" value="3.a 全ての国々において、たばこの規制に関する世界保健機関枠組条約の実施を適宜強化する。">
                    <label for="targetGroup${impact}-10">3.a 全ての国々において、たばこの規制に関する世界保健機関枠組条約の実施を適宜強化する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-11" name="targetGroup${impact}" value="3.b 主に開発途上国に影響を及ぼす感染性及び非感染性疾患のワクチン及び医薬品の研究開発を支援する。また、知的所有権の貿易関連の側面に関する協定（TRIPS協定）及び公衆の健康に関するドーハ宣言に従い、安価な必須医薬品及びワクチンへのアクセスを提供する。同宣言は公衆衛生保護及び、特に全ての人々への医薬品のアクセス提供にかかわる「知的所有権の貿易関連の側面に関する協定（TRIPS協定）」の柔軟性に関する規定を最大限に行使する開発途上国の権利を確約したものである。">
                    <label for="targetGroup${impact}-11">3.b 主に開発途上国に影響を及ぼす感染性及び非感染性疾患のワクチン及び医薬品の研究開発を支援する。また、知的所有権の貿易関連の側面に関する協定（TRIPS協定）及び公衆の健康に関するドーハ宣言に従い、安価な必須医薬品及びワクチンへのアクセスを提供する。同宣言は公衆衛生保護及び、特に全ての人々への医薬品のアクセス提供にかかわる「知的所有権の貿易関連の側面に関する協定（TRIPS協定）」の柔軟性に関する規定を最大限に行使する開発途上国の権利を確約したものである。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-12" name="targetGroup${impact}" value="3.c 開発途上国、特に後発開発途上国及び小島嶼開発途上国において保健財政及び保健人材の採用、能力開発・訓練及び定着を大幅に拡大させる。">
                    <label for="targetGroup${impact}-12">3.c 開発途上国、特に後発開発途上国及び小島嶼開発途上国において保健財政及び保健人材の採用、能力開発・訓練及び定着を大幅に拡大させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-13" name="targetGroup${impact}" value="3.d 全ての国々、特に開発途上国の国家・世界規模な健康危険因子の早期警告、危険因子緩和及び危険因子管理のための能力を強化する。">
                    <label for="targetGroup${impact}-13">3.d 全ての国々、特に開発途上国の国家・世界規模な健康危険因子の早期警告、危険因子緩和及び危険因子管理のための能力を強化する。</label>
                </div>
            </fieldset>
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標4 質の高い教育をみんなに') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="4.1 2030年までに、全ての子供が男女の区別なく、適切かつ効果的な学習成果をもたらす、無償かつ公正で質の高い初等教育及び中等教育を修了できるようにする。">
                    <label for="targetGroup${impact}-1">4.1 2030年までに、全ての子供が男女の区別なく、適切かつ効果的な学習成果をもたらす、無償かつ公正で質の高い初等教育及び中等教育を修了できるようにする。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="4.2 2030年までに、全ての子供が男女の区別なく、質の高い乳幼児の発達・ケア及び就学前教育にアクセスすることにより、初等教育を受ける準備が整うようにする。">
                    <label for="targetGroup${impact}-2">4.2 2030年までに、全ての子供が男女の区別なく、質の高い乳幼児の発達・ケア及び就学前教育にアクセスすることにより、初等教育を受ける準備が整うようにする。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="4.3 2030年までに、全ての人々が男女の区別なく、手の届く質の高い技術教育・職業教育及び大学を含む高等教育への平等なアクセスを得られるようにする。">
                    <label for="targetGroup${impact}-3">4.3 2030年までに、全ての人々が男女の区別なく、手の届く質の高い技術教育・職業教育及び大学を含む高等教育への平等なアクセスを得られるようにする。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="4.4 2030年までに、技術的・職業的スキルなど、雇用、働きがいのある人間らしい仕事及び起業に必要な技能を備えた若者と成人の割合を大幅に増加させる。">
                    <label for="targetGroup${impact}-4">4.4 2030年までに、技術的・職業的スキルなど、雇用、働きがいのある人間らしい仕事及び起業に必要な技能を備えた若者と成人の割合を大幅に増加させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="4.5 2030年までに、教育におけるジェンダー格差を無くし、障害者、先住民及び脆弱な立場にある子供など、脆弱層があらゆるレベルの教育や職業訓練に平等にアクセスできるようにする。">
                    <label for="targetGroup${impact}-5">4.5 2030年までに、教育におけるジェンダー格差を無くし、障害者、先住民及び脆弱な立場にある子供など、脆弱層があらゆるレベルの教育や職業訓練に平等にアクセスできるようにする。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-6" name="targetGroup${impact}" value="4.6 2030年までに、全ての若者及び大多数（男女ともに）の成人が、読み書き能力及び基本的計算能力を身に付けられるようにする。">
                    <label for="targetGroup${impact}-6">4.6 2030年までに、全ての若者及び大多数（男女ともに）の成人が、読み書き能力及び基本的計算能力を身に付けられるようにする。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-7" name="targetGroup${impact}" value="4.7 2030年までに、持続可能な開発のための教育及び持続可能なライフスタイル、人権、男女の平等、平和及び非暴力的文化の推進、グローバル・シチズンシップ、文化多様性と文化の持続可能な開発への貢献の理解の教育を通して、全ての学習者が、持続可能な開発を促進するために必要な知識及び技能を習得できるようにする。">
                    <label for="targetGroup${impact}-7">4.7 2030年までに、持続可能な開発のための教育及び持続可能なライフスタイル、人権、男女の平等、平和及び非暴力的文化の推進、グローバル・シチズンシップ、文化多様性と文化の持続可能な開発への貢献の理解の教育を通して、全ての学習者が、持続可能な開発を促進するために必要な知識及び技能を習得できるようにする。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-8" name="targetGroup${impact}" value="4.a 子供、障害及びジェンダーに配慮した教育施設を構築・改良し、全ての人々に安全で非暴力的、包摂的、効果的な学習環境を提供できるようにする。">
                    <label for="targetGroup${impact}-8">4.a 子供、障害及びジェンダーに配慮した教育施設を構築・改良し、全ての人々に安全で非暴力的、包摂的、効果的な学習環境を提供できるようにする。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-9" name="targetGroup${impact}" value="4.b 2020年までに、開発途上国、特に後発開発途上国及び小島嶼開発途上国、並びにアフリカ諸国を対象とした、職業訓練、情報通信技術（ICT）、技術・工学・科学プログラムなど、先進国及びその他の開発途上国における高等教育の奨学金の件数を全世界で大幅に増加させる。">
                    <label for="targetGroup${impact}-9">4.b 2020年までに、開発途上国、特に後発開発途上国及び小島嶼開発途上国、並びにアフリカ諸国を対象とした、職業訓練、情報通信技術（ICT）、技術・工学・科学プログラムなど、先進国及びその他の開発途上国における高等教育の奨学金の件数を全世界で大幅に増加させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-10" name="targetGroup${impact}" value="4.c 2030年までに、開発途上国、特に後発開発途上国及び小島嶼開発途上国における教員研修のための国際協力などを通じて、質の高い教員の数を大幅に増加させる。">
                    <label for="targetGroup${impact}-10">4.c 2030年までに、開発途上国、特に後発開発途上国及び小島嶼開発途上国における教員研修のための国際協力などを通じて、質の高い教員の数を大幅に増加させる。</label>
                </div>
            </fieldset>
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標5 ジェンダー平等を実現しよう') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="5.1 あらゆる場所における全ての女性及び女児に対するあらゆる形態の差別を撤廃する。">
                    <label for="targetGroup${impact}-1">5.1 あらゆる場所における全ての女性及び女児に対するあらゆる形態の差別を撤廃する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="5.2 人身売買や性的、その他の種類の搾取など、全ての女性及び女児に対する、公共・私的空間におけるあらゆる形態の暴力を排除する。">
                    <label for="targetGroup${impact}-2">5.2 人身売買や性的、その他の種類の搾取など、全ての女性及び女児に対する、公共・私的空間におけるあらゆる形態の暴力を排除する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="5.3 未成年者の結婚、早期結婚、強制結婚及び女性器切除など、あらゆる有害な慣行を撤廃する。">
                    <label for="targetGroup${impact}-3">5.3 未成年者の結婚、早期結婚、強制結婚及び女性器切除など、あらゆる有害な慣行を撤廃する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="5.4 公共のサービス、インフラ及び社会保障政策の提供、並びに各国の状況に応じた世帯・家族内における責任分担を通じて、無報酬の育児・介護や家事労働を認識・評価する。">
                    <label for="targetGroup${impact}-4">5.4 公共のサービス、インフラ及び社会保障政策の提供、並びに各国の状況に応じた世帯・家族内における責任分担を通じて、無報酬の育児・介護や家事労働を認識・評価する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="5.5 政治、経済、公共分野でのあらゆるレベルの意思決定において、完全かつ効果的な女性の参画及び平等なリーダーシップの機会を確保する。">
                    <label for="targetGroup${impact}-5">5.5 政治、経済、公共分野でのあらゆるレベルの意思決定において、完全かつ効果的な女性の参画及び平等なリーダーシップの機会を確保する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-6" name="targetGroup${impact}" value="5.6 国際人口・開発会議（ICPD）の行動計画及び北京行動綱領、並びにこれらの検証会議の成果文書に従い、性と生殖に関する健康及び権利への普遍的アクセスを確保する。">
                    <label for="targetGroup${impact}-6">5.6 国際人口・開発会議（ICPD）の行動計画及び北京行動綱領、並びにこれらの検証会議の成果文書に従い、性と生殖に関する健康及び権利への普遍的アクセスを確保する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-7" name="targetGroup${impact}" value="5.a 女性に対し、経済的資源に対する同等の権利、並びに各国法に従い、オーナーシップ及び土地その他の財産、金融サービス、相続財産、天然資源に対するアクセスを与えるための改革に着手する。">
                    <label for="targetGroup${impact}-7">5.a 女性に対し、経済的資源に対する同等の権利、並びに各国法に従い、オーナーシップ及び土地その他の財産、金融サービス、相続財産、天然資源に対するアクセスを与えるための改革に着手する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-8" name="targetGroup${impact}" value="5.b 女性の能力強化促進のため、ICTをはじめとする実現技術の活用を強化する。">
                    <label for="targetGroup${impact}-8">5.b 女性の能力強化促進のため、ICTをはじめとする実現技術の活用を強化する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-9" name="targetGroup${impact}" value="5.c ジェンダー平等の促進、並びに全ての女性及び女子のあらゆるレベルでの能力強化のための適正な政策及び拘束力のある法規を導入・強化する。">
                    <label for="targetGroup${impact}-9">5.c ジェンダー平等の促進、並びに全ての女性及び女子のあらゆるレベルでの能力強化のための適正な政策及び拘束力のある法規を導入・強化する。</label>
                </div>
            </fieldset>
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標6 安全な水とトイレを世界中に') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="6.1 2030年までに、全ての人々の、安全で安価な飲料水の普遍的かつ衡平なアクセスを達成する。">
                    <label for="targetGroup${impact}-1">6.1 2030年までに、全ての人々の、安全で安価な飲料水の普遍的かつ衡平なアクセスを達成する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="6.2 2030年までに、全ての人々の、適切かつ平等な下水施設・衛生施設へのアクセスを達成し、野外での排泄をなくす。女性及び女児、並びに脆弱な立場にある人々のニーズに特に注意を払う。">
                    <label for="targetGroup${impact}-2">6.2 2030年までに、全ての人々の、適切かつ平等な下水施設・衛生施設へのアクセスを達成し、野外での排泄をなくす。女性及び女児、並びに脆弱な立場にある人々のニーズに特に注意を払う。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="6.3 2030年までに、汚染の減少、投棄の廃絶と有害な化学物・物質の放出の最小化、未処理の排水の割合半減及び再生利用と安全な再利用の世界的規模で大幅に増加させることにより、水質を改善する。">
                    <label for="targetGroup${impact}-3">6.3 2030年までに、汚染の減少、投棄の廃絶と有害な化学物・物質の放出の最小化、未処理の排水の割合半減及び再生利用と安全な再利用の世界的規模で大幅に増加させることにより、水質を改善する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="6.4 2030年までに、全セクターにおいて水利用の効率を大幅に改善し、淡水の持続可能な採取及び供給を確保し水不足に対処するとともに、水不足に悩む人々の数を大幅に減少させる。">
                    <label for="targetGroup${impact}-4">6.4 2030年までに、全セクターにおいて水利用の効率を大幅に改善し、淡水の持続可能な採取及び供給を確保し水不足に対処するとともに、水不足に悩む人々の数を大幅に減少させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="6.5 2030年までに、国境を越えた適切な協力を含む、あらゆるレベルでの統合水資源管理を実施する。">
                    <label for="targetGroup${impact}-5">6.5 2030年までに、国境を越えた適切な協力を含む、あらゆるレベルでの統合水資源管理を実施する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-6" name="targetGroup${impact}" value="6.6 2020年までに、山地、森林、湿地、河川、帯水層、湖沼を含む水に関連する生態系の保護・回復を行う。">
                    <label for="targetGroup${impact}-6">6.6 2020年までに、山地、森林、湿地、河川、帯水層、湖沼を含む水に関連する生態系の保護・回復を行う。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-7" name="targetGroup${impact}" value="6.a 2030年までに、集水、海水淡水化、水の効率的利用、排水処理、リサイクル・再利用技術を含む開発途上国における水と衛生分野での活動と計画を対象とした国際協力と能力構築支援を拡大する。">
                    <label for="targetGroup${impact}-7">6.a 2030年までに、集水、海水淡水化、水の効率的利用、排水処理、リサイクル・再利用技術を含む開発途上国における水と衛生分野での活動と計画を対象とした国際協力と能力構築支援を拡大する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-8" name="targetGroup${impact}" value="6.b 水と衛生に関わる分野の管理向上における地域コミュニティの参加を支援・強化する。">
                    <label for="targetGroup${impact}-8">6.b 水と衛生に関わる分野の管理向上における地域コミュニティの参加を支援・強化する。</label>
                </div>
            </fieldset>
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標7 エネルギーをみんなにそしてクリーンに') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="7.1 2030年までに、安価かつ信頼できる現代的エネルギーサービスへの普遍的アクセスを確保する。">
                    <label for="targetGroup${impact}-1">7.1 2030年までに、安価かつ信頼できる現代的エネルギーサービスへの普遍的アクセスを確保する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="7.2 2030年までに、世界のエネルギーミックスにおける再生可能エネルギーの割合を大幅に拡大させる。">
                    <label for="targetGroup${impact}-2">7.2 2030年までに、世界のエネルギーミックスにおける再生可能エネルギーの割合を大幅に拡大させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="7.3 2030年までに、世界全体のエネルギー効率の改善率を倍増させる。">
                    <label for="targetGroup${impact}-3">7.3 2030年までに、世界全体のエネルギー効率の改善率を倍増させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="7.a 2030年までに、再生可能エネルギー、エネルギー効率及び先進的かつ環境負荷の低い化石燃料技術などのクリーンエネルギーの研究及び技術へのアクセスを促進するための国際協力を強化し、エネルギー関連インフラとクリーンエネルギー技術への投資を促進する。">
                    <label for="targetGroup${impact}-4">7.a 2030年までに、再生可能エネルギー、エネルギー効率及び先進的かつ環境負荷の低い化石燃料技術などのクリーンエネルギーの研究及び技術へのアクセスを促進するための国際協力を強化し、エネルギー関連インフラとクリーンエネルギー技術への投資を促進する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="7.b 2030年までに、各々の支援プログラムに沿って開発途上国、特に後発開発途上国及び小島嶼開発途上国、内陸開発途上国の全ての人々に現代的で持続可能なエネルギーサービスを供給できるよう、インフラ拡大と技術向上を行う。">
                    <label for="targetGroup${impact}-5">7.b 2030年までに、各々の支援プログラムに沿って開発途上国、特に後発開発途上国及び小島嶼開発途上国、内陸開発途上国の全ての人々に現代的で持続可能なエネルギーサービスを供給できるよう、インフラ拡大と技術向上を行う。</label>
                </div>
            </fieldset>
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標8 働きがいも経済成長も') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="8.1 各国の状況に応じて、一人当たり経済成長率を持続させる。特に後発開発途上国は少なくとも年率７%の成長率を保つ。">
                    <label for="targetGroup${impact}-1">8.1 各国の状況に応じて、一人当たり経済成長率を持続させる。特に後発開発途上国は少なくとも年率７%の成長率を保つ。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="8.2 高付加価値セクターや労働集約型セクターに重点を置くことなどにより、多様化、技術向上及びイノベーションを通じた高いレベルの経済生産性を達成する。">
                    <label for="targetGroup${impact}-2">8.2 高付加価値セクターや労働集約型セクターに重点を置くことなどにより、多様化、技術向上及びイノベーションを通じた高いレベルの経済生産性を達成する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="8.3 生産活動や適切な雇用創出、起業、創造性及びイノベーションを支援する開発重視型の政策を促進するとともに、金融サービスへのアクセス改善などを通じて中小零細企業の設立や成長を奨励する。">
                    <label for="targetGroup${impact}-3">8.3 生産活動や適切な雇用創出、起業、創造性及びイノベーションを支援する開発重視型の政策を促進するとともに、金融サービスへのアクセス改善などを通じて中小零細企業の設立や成長を奨励する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="8.4 2030年までに、世界の消費と生産における資源効率を漸進的に改善させ、先進国主導の下、持続可能な消費と生産に関する10年計画枠組みに従い、経済成長と環境悪化の分断を図る。">
                    <label for="targetGroup${impact}-4">8.4 2030年までに、世界の消費と生産における資源効率を漸進的に改善させ、先進国主導の下、持続可能な消費と生産に関する10年計画枠組みに従い、経済成長と環境悪化の分断を図る。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="8.5 2030年までに、若者や障害者を含む全ての男性及び女性の、完全かつ生産的な雇用及び働きがいのある人間らしい仕事、並びに同一労働同一賃金を達成する。">
                    <label for="targetGroup${impact}-5">8.5 2030年までに、若者や障害者を含む全ての男性及び女性の、完全かつ生産的な雇用及び働きがいのある人間らしい仕事、並びに同一労働同一賃金を達成する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-6" name="targetGroup${impact}" value="8.6 2020年までに、就労、就学及び職業訓練のいずれも行っていない若者の割合を大幅に減らす。">
                    <label for="targetGroup${impact}-6">8.6 2020年までに、就労、就学及び職業訓練のいずれも行っていない若者の割合を大幅に減らす。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-7" name="targetGroup${impact}" value="8.7 強制労働を根絶し、現代の奴隷制、人身売買を終らせるための緊急かつ効果的な措置の実施、最悪な形態の児童労働の禁止及び撲滅を確保する。2025年までに児童兵士の募集と使用を含むあらゆる形態の児童労働を撲滅する。">
                    <label for="targetGroup${impact}-7">8.7 強制労働を根絶し、現代の奴隷制、人身売買を終らせるための緊急かつ効果的な措置の実施、最悪な形態の児童労働の禁止及び撲滅を確保する。2025年までに児童兵士の募集と使用を含むあらゆる形態の児童労働を撲滅する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-8" name="targetGroup${impact}" value="8.8 移住労働者、特に女性の移住労働者や不安定な雇用状態にある労働者など、全ての労働者の権利を保護し、安全・安心な労働環境を促進する。">
                    <label for="targetGroup${impact}-8">8.8 移住労働者、特に女性の移住労働者や不安定な雇用状態にある労働者など、全ての労働者の権利を保護し、安全・安心な労働環境を促進する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-9" name="targetGroup${impact}" value="8.9 2030年までに、雇用創出、地方の文化振興・産品販促につながる持続可能な観光業を促進するための政策を立案し実施する。">
                    <label for="targetGroup${impact}-9">8.9 2030年までに、雇用創出、地方の文化振興・産品販促につながる持続可能な観光業を促進するための政策を立案し実施する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-10" name="targetGroup${impact}" value="8.10 国内の金融機関の能力を強化し、全ての人々の銀行取引、保険及び金融サービスへのアクセスを促進・拡大する。">
                    <label for="targetGroup${impact}-10">8.10 国内の金融機関の能力を強化し、全ての人々の銀行取引、保険及び金融サービスへのアクセスを促進・拡大する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-11" name="targetGroup${impact}" value="8.a 後発開発途上国への貿易関連技術支援のための拡大統合フレームワーク（EIF）などを通じた支援を含む、開発途上国、特に後発開発途上国に対する貿易のための援助を拡大する。">
                    <label for="targetGroup${impact}-11">8.a 後発開発途上国への貿易関連技術支援のための拡大統合フレームワーク（EIF）などを通じた支援を含む、開発途上国、特に後発開発途上国に対する貿易のための援助を拡大する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-12" name="targetGroup${impact}" value="8.b 2020年までに、若年雇用のための世界的戦略及び国際労働機関（ILO）の仕事に関する世界協定の実施を展開・運用化する。">
                    <label for="targetGroup${impact}-12">8.b 2020年までに、若年雇用のための世界的戦略及び国際労働機関（ILO）の仕事に関する世界協定の実施を展開・運用化する。</label>
                </div>
            </fieldset>
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標9 産業と技術革新の基盤をつくろう') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="9.1 全ての人々に安価で公平なアクセスに重点を置いた経済発展と人間の福祉を支援するために、地域・越境インフラを含む質の高い、信頼でき、持続可能かつ強靱（レジリエント）なインフラを開発する。">
                    <label for="targetGroup${impact}-1">9.1 全ての人々に安価で公平なアクセスに重点を置いた経済発展と人間の福祉を支援するために、地域・越境インフラを含む質の高い、信頼でき、持続可能かつ強靱（レジリエント）なインフラを開発する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="9.2 包摂的かつ持続可能な産業化を促進し、2030年までに各国の状況に応じて雇用及びGDPに占める産業セクターの割合を大幅に増加させる。後発開発途上国については同割合を倍増させる。">
                    <label for="targetGroup${impact}-2">9.2 包摂的かつ持続可能な産業化を促進し、2030年までに各国の状況に応じて雇用及びGDPに占める産業セクターの割合を大幅に増加させる。後発開発途上国については同割合を倍増させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="9.3 特に開発途上国における小規模の製造業その他の企業の、安価な資金貸付などの金融サービスやバリューチェーン及び市場への統合へのアクセスを拡大する。">
                    <label for="targetGroup${impact}-3">9.3 特に開発途上国における小規模の製造業その他の企業の、安価な資金貸付などの金融サービスやバリューチェーン及び市場への統合へのアクセスを拡大する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="9.4 2030年までに、資源利用効率の向上とクリーン技術及び環境に配慮した技術・産業プロセスの導入拡大を通じたインフラ改良や産業改善により、持続可能性を向上させる。全ての国々は各国の能力に応じた取組を行う。">
                    <label for="targetGroup${impact}-4">9.4 2030年までに、資源利用効率の向上とクリーン技術及び環境に配慮した技術・産業プロセスの導入拡大を通じたインフラ改良や産業改善により、持続可能性を向上させる。全ての国々は各国の能力に応じた取組を行う。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="9.5 2030年までにイノベーションを促進させることや100万人当たりの研究開発従事者数を大幅に増加させ、また官民研究開発の支出を拡大させるなど、開発途上国をはじめとする全ての国々の産業セクターにおける科学研究を促進し、技術能力を向上させる。">
                    <label for="targetGroup${impact}-5">9.5 2030年までにイノベーションを促進させることや100万人当たりの研究開発従事者数を大幅に増加させ、また官民研究開発の支出を拡大させるなど、開発途上国をはじめとする全ての国々の産業セクターにおける科学研究を促進し、技術能力を向上させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-6" name="targetGroup${impact}" value="9.a アフリカ諸国、後発開発途上国、内陸開発途上国及び小島嶼開発途上国への金融・テクノロジー・技術の支援強化を通じて、開発途上国における持続可能かつ強靱（レジリエント）なインフラ開発を促進する。">
                    <label for="targetGroup${impact}-6">9.a アフリカ諸国、後発開発途上国、内陸開発途上国及び小島嶼開発途上国への金融・テクノロジー・技術の支援強化を通じて、開発途上国における持続可能かつ強靱（レジリエント）なインフラ開発を促進する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-7" name="targetGroup${impact}" value="9.b 産業の多様化や商品への付加価値創造などに資する政策環境の確保などを通じて、開発途上国の国内における技術開発、研究及びイノベーションを支援する。">
                    <label for="targetGroup${impact}-7">9.b 産業の多様化や商品への付加価値創造などに資する政策環境の確保などを通じて、開発途上国の国内における技術開発、研究及びイノベーションを支援する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-8" name="targetGroup${impact}" value="9.c 後発開発途上国において情報通信技術へのアクセスを大幅に向上させ、2020年までに普遍的かつ安価なインターネットアクセスを提供できるよう図る。">
                    <label for="targetGroup${impact}-8">9.c 後発開発途上国において情報通信技術へのアクセスを大幅に向上させ、2020年までに普遍的かつ安価なインターネットアクセスを提供できるよう図る。</label>
                </div>
            </fieldset>
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標10 人や国の不平等をなくそう') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="10.1 2030年までに、各国の所得下位40%の所得成長率について、国内平均を上回る数値を漸進的に達成し、持続させる。">
                    <label for="targetGroup${impact}-1">10.1 2030年までに、各国の所得下位40%の所得成長率について、国内平均を上回る数値を漸進的に達成し、持続させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="10.2 2030年までに、年齢、性別、障害、人種、民族、出自、宗教、あるいは経済的地位その他の状況に関わりなく、全ての人々の能力強化及び社会的、経済的及び政治的な包含を促進する。">
                    <label for="targetGroup${impact}-2">10.2 2030年までに、年齢、性別、障害、人種、民族、出自、宗教、あるいは経済的地位その他の状況に関わりなく、全ての人々の能力強化及び社会的、経済的及び政治的な包含を促進する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="10.3 差別的な法律、政策及び慣行の撤廃、並びに適切な関連法規、政策、行動の促進などを通じて、機会均等を確保し、成果の不平等を是正する。">
                    <label for="targetGroup${impact}-3">10.3 差別的な法律、政策及び慣行の撤廃、並びに適切な関連法規、政策、行動の促進などを通じて、機会均等を確保し、成果の不平等を是正する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="10.4 税制、賃金、社会保障政策をはじめとする政策を導入し、平等の拡大を漸進的に達成する。">
                    <label for="targetGroup${impact}-4">10.4 税制、賃金、社会保障政策をはじめとする政策を導入し、平等の拡大を漸進的に達成する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="10.5 世界金融市場と金融機関に対する規制とモニタリングを改善し、こうした規制の実施を強化する。">
                    <label for="targetGroup${impact}-5">10.5 世界金融市場と金融機関に対する規制とモニタリングを改善し、こうした規制の実施を強化する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-6" name="targetGroup${impact}" value="10.6 地球規模の国際経済・金融制度の意思決定における開発途上国の参加や発言力を拡大させることにより、より効果的で信用力があり、説明責任のある正当な制度を実現する。">
                    <label for="targetGroup${impact}-6">10.6 地球規模の国際経済・金融制度の意思決定における開発途上国の参加や発言力を拡大させることにより、より効果的で信用力があり、説明責任のある正当な制度を実現する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-7" name="targetGroup${impact}" value="10.7 計画に基づき良く管理された移民政策の実施などを通じて、秩序のとれた、安全で規則的かつ責任ある移住や流動性を促進する。">
                    <label for="targetGroup${impact}-7">10.7 計画に基づき良く管理された移民政策の実施などを通じて、秩序のとれた、安全で規則的かつ責任ある移住や流動性を促進する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-8" name="targetGroup${impact}" value="10.a 世界貿易機関（WTO）協定に従い、開発途上国、特に後発開発途上国に対する特別かつ異なる待遇の原則を実施する。">
                    <label for="targetGroup${impact}-8">10.a 世界貿易機関（WTO）協定に従い、開発途上国、特に後発開発途上国に対する特別かつ異なる待遇の原則を実施する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-9" name="targetGroup${impact}" value="10.b 各国の国家計画やプログラムに従って、後発開発途上国、アフリカ諸国、小島嶼開発途上国及び内陸開発途上国を始めとする、ニーズが最も大きい国々への、政府開発援助（ODA）及び海外直接投資を含む資金の流入を促進する。">
                    <label for="targetGroup${impact}-9">10.b 各国の国家計画やプログラムに従って、後発開発途上国、アフリカ諸国、小島嶼開発途上国及び内陸開発途上国を始めとする、ニーズが最も大きい国々への、政府開発援助（ODA）及び海外直接投資を含む資金の流入を促進する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-10" name="targetGroup${impact}" value="10.c 2030年までに、移住労働者による送金コストを３%未満に引き下げ、コストが5%を越える送金経路を撤廃する。">
                    <label for="targetGroup${impact}-10">10.c 2030年までに、移住労働者による送金コストを３%未満に引き下げ、コストが5%を越える送金経路を撤廃する。</label>
                </div>
            </fieldset>
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標11 住み続けられるまちづくりを') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="11.1 2030年までに、全ての人々の、適切、安全かつ安価な住宅及び基本的サービスへのアクセスを確保し、スラムを改善する。">
                    <label for="targetGroup${impact}-1">11.1 2030年までに、全ての人々の、適切、安全かつ安価な住宅及び基本的サービスへのアクセスを確保し、スラムを改善する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="11.2 2030年までに、脆弱な立場にある人々、女性、子供、障害者及び高齢者のニーズに特に配慮し、公共交通機関の拡大などを通じた交通の安全性改善により、全ての人々に、安全かつ安価で容易に利用できる、持続可能な輸送システムへのアクセスを提供する。">
                    <label for="targetGroup${impact}-2">11.2 2030年までに、脆弱な立場にある人々、女性、子供、障害者及び高齢者のニーズに特に配慮し、公共交通機関の拡大などを通じた交通の安全性改善により、全ての人々に、安全かつ安価で容易に利用できる、持続可能な輸送システムへのアクセスを提供する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="11.3 2030年までに、包摂的かつ持続可能な都市化を促進し、全ての国々の参加型、包摂的かつ持続可能な人間居住計画・管理の能力を強化する。">
                    <label for="targetGroup${impact}-3">11.3 2030年までに、包摂的かつ持続可能な都市化を促進し、全ての国々の参加型、包摂的かつ持続可能な人間居住計画・管理の能力を強化する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="11.4 世界の文化遺産及び自然遺産の保護・保全の努力を強化する。">
                    <label for="targetGroup${impact}-4">11.4 世界の文化遺産及び自然遺産の保護・保全の努力を強化する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="11.5 2030年までに、貧困層及び脆弱な立場にある人々の保護に焦点をあてながら、水関連災害などの災害による死者や被災者数を大幅に削減し、世界の国内総生産比で直接的経済損失を大幅に減らす。">
                    <label for="targetGroup${impact}-5">11.5 2030年までに、貧困層及び脆弱な立場にある人々の保護に焦点をあてながら、水関連災害などの災害による死者や被災者数を大幅に削減し、世界の国内総生産比で直接的経済損失を大幅に減らす。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-6" name="targetGroup${impact}" value="11.6 2030年までに、大気の質及び一般並びにその他の廃棄物の管理に特別な注意を払うことによるものを含め、都市の一人当たりの環境上の悪影響を軽減する。">
                    <label for="targetGroup${impact}-6">11.6 2030年までに、大気の質及び一般並びにその他の廃棄物の管理に特別な注意を払うことによるものを含め、都市の一人当たりの環境上の悪影響を軽減する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-7" name="targetGroup${impact}" value="11.7 2030年までに、女性、子供、高齢者及び障害者を含め、人々に安全で包摂的かつ利用が容易な緑地や公共スペースへの普遍的アクセスを提供する。">
                    <label for="targetGroup${impact}-7">11.7 2030年までに、女性、子供、高齢者及び障害者を含め、人々に安全で包摂的かつ利用が容易な緑地や公共スペースへの普遍的アクセスを提供する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-8" name="targetGroup${impact}" value="11.a 各国・地域規模の開発計画の強化を通じて、経済、社会、環境面における都市部、都市周辺部及び農村部間の良好なつながりを支援する。">
                    <label for="targetGroup${impact}-8">11.a 各国・地域規模の開発計画の強化を通じて、経済、社会、環境面における都市部、都市周辺部及び農村部間の良好なつながりを支援する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-9" name="targetGroup${impact}" value="11.b 2020年までに、包含、資源効率、気候変動の緩和と適応、災害に対する強靱さ（レジリエンス）を目指す総合的政策及び計画を導入・実施した都市及び人間居住地の件数を大幅に増加させ、仙台防災枠組2015-2030に沿って、あらゆるレベルでの総合的な災害リスク管理の策定と実施を行う。">
                    <label for="targetGroup${impact}-9">11.b 2020年までに、包含、資源効率、気候変動の緩和と適応、災害に対する強靱さ（レジリエンス）を目指す総合的政策及び計画を導入・実施した都市及び人間居住地の件数を大幅に増加させ、仙台防災枠組2015-2030に沿って、あらゆるレベルでの総合的な災害リスク管理の策定と実施を行う。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-10" name="targetGroup${impact}" value="11.c 財政的及び技術的な支援などを通じて、後発開発途上国における現地の資材を用いた、持続可能かつ強靱（レジリエント）な建造物の整備を支援する。">
                    <label for="targetGroup${impact}-10">11.c 財政的及び技術的な支援などを通じて、後発開発途上国における現地の資材を用いた、持続可能かつ強靱（レジリエント）な建造物の整備を支援する。</label>
                </div>
            </fieldset>
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標12 つくる責任つかう責任') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="12.1 開発途上国の開発状況や能力を勘案しつつ、持続可能な消費と生産に関する10年計画枠組み（10YFP）を実施し、先進国主導の下、全ての国々が対策を講じる。">
                    <label for="targetGroup${impact}-1">12.1 開発途上国の開発状況や能力を勘案しつつ、持続可能な消費と生産に関する10年計画枠組み（10YFP）を実施し、先進国主導の下、全ての国々が対策を講じる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="12.2 2030年までに天然資源の持続可能な管理及び効率的な利用を達成する。">
                    <label for="targetGroup${impact}-2">12.2 2030年までに天然資源の持続可能な管理及び効率的な利用を達成する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="12.3 2030年までに小売・消費レベルにおける世界全体の一人当たりの食料の廃棄を半減させ、収穫後損失などの生産・サプライチェーンにおける食品ロスを減少させる。">
                    <label for="targetGroup${impact}-3">12.3 2030年までに小売・消費レベルにおける世界全体の一人当たりの食料の廃棄を半減させ、収穫後損失などの生産・サプライチェーンにおける食品ロスを減少させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="12.4 2020年までに、合意された国際的な枠組みに従い、製品ライフサイクルを通じ、環境上適正な化学物質や全ての廃棄物の管理を実現し、人の健康や環境への悪影響を最小化するため、化学物質や廃棄物の大気、水、土壌への放出を大幅に削減する。">
                    <label for="targetGroup${impact}-4">12.4 2020年までに、合意された国際的な枠組みに従い、製品ライフサイクルを通じ、環境上適正な化学物質や全ての廃棄物の管理を実現し、人の健康や環境への悪影響を最小化するため、化学物質や廃棄物の大気、水、土壌への放出を大幅に削減する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="12.5 2030年までに、廃棄物の発生防止、削減、再生利用及び再利用により、廃棄物の発生を大幅に削減する。">
                    <label for="targetGroup${impact}-5">12.5 2030年までに、廃棄物の発生防止、削減、再生利用及び再利用により、廃棄物の発生を大幅に削減する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-6" name="targetGroup${impact}" value="12.6 特に大企業や多国籍企業などの企業に対し、持続可能な取り組みを導入し、持続可能性に関する情報を定期報告に盛り込むよう奨励する。">
                    <label for="targetGroup${impact}-6">12.6 特に大企業や多国籍企業などの企業に対し、持続可能な取り組みを導入し、持続可能性に関する情報を定期報告に盛り込むよう奨励する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-7" name="targetGroup${impact}" value="12.7 国内の政策や優先事項に従って持続可能な公共調達の慣行を促進する。">
                    <label for="targetGroup${impact}-7">12.7 国内の政策や優先事項に従って持続可能な公共調達の慣行を促進する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-8" name="targetGroup${impact}" value="12.8 2030年までに、人々があらゆる場所において、持続可能な開発及び自然と調和したライフスタイルに関する情報と意識を持つようにする。">
                    <label for="targetGroup${impact}-8">12.8 2030年までに、人々があらゆる場所において、持続可能な開発及び自然と調和したライフスタイルに関する情報と意識を持つようにする。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-9" name="targetGroup${impact}" value="12.a 開発途上国に対し、より持続可能な消費・生産形態の促進のための科学的・技術的能力の強化を支援する。">
                    <label for="targetGroup${impact}-9">12.a 開発途上国に対し、より持続可能な消費・生産形態の促進のための科学的・技術的能力の強化を支援する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-10" name="targetGroup${impact}" value="12.b 雇用創出、地方の文化振興・産品販促につながる持続可能な観光業に対して持続可能な開発がもたらす影響を測定する手法を開発・導入する。">
                    <label for="targetGroup${impact}-10">12.b 雇用創出、地方の文化振興・産品販促につながる持続可能な観光業に対して持続可能な開発がもたらす影響を測定する手法を開発・導入する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-11" name="targetGroup${impact}" value="12.c 開発途上国の特別なニーズや状況を十分考慮し、貧困層やコミュニティを保護する形で開発に関する悪影響を最小限に留めつつ、税制改正や、有害な補助金が存在する場合はその環境への影響を考慮してその段階的廃止などを通じ、各国の状況に応じて、市場のひずみを除去することで、浪費的な消費を奨励する、化石燃料に対する非効率な補助金を合理化する。">
                    <label for="targetGroup${impact}-11">12.c 開発途上国の特別なニーズや状況を十分考慮し、貧困層やコミュニティを保護する形で開発に関する悪影響を最小限に留めつつ、税制改正や、有害な補助金が存在する場合はその環境への影響を考慮してその段階的廃止などを通じ、各国の状況に応じて、市場のひずみを除去することで、浪費的な消費を奨励する、化石燃料に対する非効率な補助金を合理化する。</label>
                </div>
            </fieldset>
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標13 気候変動に具体的な対策を') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="13.1 全ての国々において、気候関連災害や自然災害に対する強靱性（レジリエンス）及び適応の能力を強化する。">
                    <label for="targetGroup${impact}-1">13.1 全ての国々において、気候関連災害や自然災害に対する強靱性（レジリエンス）及び適応の能力を強化する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="13.2 気候変動対策を国別の政策、戦略及び計画に盛り込む。">
                    <label for="targetGroup${impact}-2">13.2 気候変動対策を国別の政策、戦略及び計画に盛り込む。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="13.3 気候変動の緩和、適応、影響軽減及び早期警戒に関する教育、啓発、人的能力及び制度機能を改善する。">
                    <label for="targetGroup${impact}-3">13.3 気候変動の緩和、適応、影響軽減及び早期警戒に関する教育、啓発、人的能力及び制度機能を改善する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="13.a 重要な緩和行動の実施とその実施における透明性確保に関する開発途上国のニーズに対応するため、2020年までにあらゆる供給源から年間1,000億ドルを共同で動員するという、UNFCCCの先進締約国によるコミットメントを実施するとともに、可能な限り速やかに資本を投入して緑の気候基金を本格始動させる。">
                    <label for="targetGroup${impact}-4">13.a 重要な緩和行動の実施とその実施における透明性確保に関する開発途上国のニーズに対応するため、2020年までにあらゆる供給源から年間1,000億ドルを共同で動員するという、UNFCCCの先進締約国によるコミットメントを実施するとともに、可能な限り速やかに資本を投入して緑の気候基金を本格始動させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="13.b 後発開発途上国及び小島嶼開発途上国において、女性や青年、地方及び社会的に疎外されたコミュニティに焦点を当てることを含め、気候変動関連の効果的な計画策定と管理のための能力を向上するメカニズムを推進する。※国連気候変動枠組条約（UNFCCC）が、気候変動への世界的対応について交渉を行う一義的な国際的、政府間対話の場であると認識している。">
                    <label for="targetGroup${impact}-5">13.b 後発開発途上国及び小島嶼開発途上国において、女性や青年、地方及び社会的に疎外されたコミュニティに焦点を当てることを含め、気候変動関連の効果的な計画策定と管理のための能力を向上するメカニズムを推進する。※国連気候変動枠組条約（UNFCCC）が、気候変動への世界的対応について交渉を行う一義的な国際的、政府間対話の場であると認識している。</label>
                </div>
            </fieldset>
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標14 海の豊かさを守ろう') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="14.1 2025年までに、海洋ごみや富栄養化を含む、特に陸上活動による汚染など、あらゆる種類の海洋汚染を防止し、大幅に削減する。">
                    <label for="targetGroup${impact}-1">14.1 2025年までに、海洋ごみや富栄養化を含む、特に陸上活動による汚染など、あらゆる種類の海洋汚染を防止し、大幅に削減する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="14.2 2020年までに、海洋及び沿岸の生態系に関する重大な悪影響を回避するため、強靱性（レジリエンス）の強化などによる持続的な管理と保護を行い、健全で生産的な海洋を実現するため、海洋及び沿岸の生態系の回復のための取組を行う。">
                    <label for="targetGroup${impact}-2">14.2 2020年までに、海洋及び沿岸の生態系に関する重大な悪影響を回避するため、強靱性（レジリエンス）の強化などによる持続的な管理と保護を行い、健全で生産的な海洋を実現するため、海洋及び沿岸の生態系の回復のための取組を行う。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="14.3 あらゆるレベルでの科学的協力の促進などを通じて、海洋酸性化の影響を最小限化し、対処する。">
                    <label for="targetGroup${impact}-3">14.3 あらゆるレベルでの科学的協力の促進などを通じて、海洋酸性化の影響を最小限化し、対処する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="14.4 水産資源を、実現可能な最短期間で少なくとも各資源の生物学的特性によって定められる最大持続生産量のレベルまで回復させるため、2020年までに、漁獲を効果的に規制し、過剰漁業や違法・無報告・無規制（IUU）漁業及び破壊的な漁業慣行を終了し、科学的な管理計画を実施する。">
                    <label for="targetGroup${impact}-4">14.4 水産資源を、実現可能な最短期間で少なくとも各資源の生物学的特性によって定められる最大持続生産量のレベルまで回復させるため、2020年までに、漁獲を効果的に規制し、過剰漁業や違法・無報告・無規制（IUU）漁業及び破壊的な漁業慣行を終了し、科学的な管理計画を実施する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="14.5 2020年までに、国内法及び国際法に則り、最大限入手可能な科学情報に基づいて、少なくとも沿岸域及び海域の10パーセントを保全する。">
                    <label for="targetGroup${impact}-5">14.5 2020年までに、国内法及び国際法に則り、最大限入手可能な科学情報に基づいて、少なくとも沿岸域及び海域の10パーセントを保全する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-6" name="targetGroup${impact}" value="14.6 開発途上国及び後発開発途上国に対する適切かつ効果的な、特別かつ異なる待遇が、世界貿易機関（WTO）漁業補助金交渉の不可分の要素であるべきことを認識した上で、2020年までに、過剰漁獲能力や過剰漁獲につながる漁業補助金を禁止し、違法・無報告・無規制（IUU）漁業につながる補助金を撤廃し、同様の新たな補助金の導入を抑制する。">
                    <label for="targetGroup${impact}-6">14.6 開発途上国及び後発開発途上国に対する適切かつ効果的な、特別かつ異なる待遇が、世界貿易機関（WTO）漁業補助金交渉の不可分の要素であるべきことを認識した上で、2020年までに、過剰漁獲能力や過剰漁獲につながる漁業補助金を禁止し、違法・無報告・無規制（IUU）漁業につながる補助金を撤廃し、同様の新たな補助金の導入を抑制する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-7" name="targetGroup${impact}" value="14.7 2030年までに、漁業、水産養殖及び観光の持続可能な管理などを通じ、小島嶼開発途上国及び後発開発途上国の海洋資源の持続的な利用による経済的便益を増大させる。">
                    <label for="targetGroup${impact}-7">14.7 2030年までに、漁業、水産養殖及び観光の持続可能な管理などを通じ、小島嶼開発途上国及び後発開発途上国の海洋資源の持続的な利用による経済的便益を増大させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-8" name="targetGroup${impact}" value="14.a 海洋の健全性の改善と、開発途上国、特に小島嶼開発途上国および後発開発途上国の開発における海洋生物多様性の寄与向上のために、海洋技術の移転に関するユネスコ政府間海洋学委員会の基準・ガイドラインを勘案しつつ、科学的知識の増進、研究能力の向上、及び海洋技術の移転を行う。">
                    <label for="targetGroup${impact}-8">14.a 海洋の健全性の改善と、開発途上国、特に小島嶼開発途上国および後発開発途上国の開発における海洋生物多様性の寄与向上のために、海洋技術の移転に関するユネスコ政府間海洋学委員会の基準・ガイドラインを勘案しつつ、科学的知識の増進、研究能力の向上、及び海洋技術の移転を行う。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-9" name="targetGroup${impact}" value="14.b 小規模・沿岸零細漁業者に対し、海洋資源及び市場へのアクセスを提供する。">
                    <label for="targetGroup${impact}-9">14.b 小規模・沿岸零細漁業者に対し、海洋資源及び市場へのアクセスを提供する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-10" name="targetGroup${impact}" value="14.c 「我々の求める未来」のパラ158において想起されるとおり、海洋及び海洋資源の保全及び持続可能な利用のための法的枠組みを規定する海洋法に関する国際連合条約（UNCLOS）に反映されている国際法を実施することにより、海洋及び海洋資源の保全及び持続可能な利用を強化する。">
                    <label for="targetGroup${impact}-10">14.c 「我々の求める未来」のパラ158において想起されるとおり、海洋及び海洋資源の保全及び持続可能な利用のための法的枠組みを規定する海洋法に関する国際連合条約（UNCLOS）に反映されている国際法を実施することにより、海洋及び海洋資源の保全及び持続可能な利用を強化する。</label>
                </div>
            </fieldset>
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標15 陸の豊かさを守ろう') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="15.1 2020年までに、国際協定の下での義務に則って、森林、湿地、山地及び乾燥地をはじめとする陸域生態系と内陸淡水生態系及びそれらのサービスの保全、回復及び持続可能な利用を確保する。">
                    <label for="targetGroup${impact}-1">15.1 2020年までに、国際協定の下での義務に則って、森林、湿地、山地及び乾燥地をはじめとする陸域生態系と内陸淡水生態系及びそれらのサービスの保全、回復及び持続可能な利用を確保する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="15.2 2020年までに、あらゆる種類の森林の持続可能な経営の実施を促進し、森林減少を阻止し、劣化した森林を回復し、世界全体で新規植林及び再植林を大幅に増加させる。">
                    <label for="targetGroup${impact}-2">15.2 2020年までに、あらゆる種類の森林の持続可能な経営の実施を促進し、森林減少を阻止し、劣化した森林を回復し、世界全体で新規植林及び再植林を大幅に増加させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="15.3 2030年までに、砂漠化に対処し、砂漠化、干ばつ及び洪水の影響を受けた土地などの劣化した土地と土壌を回復し、土地劣化に荷担しない世界の達成に尽力する。">
                    <label for="targetGroup${impact}-3">15.3 2030年までに、砂漠化に対処し、砂漠化、干ばつ及び洪水の影響を受けた土地などの劣化した土地と土壌を回復し、土地劣化に荷担しない世界の達成に尽力する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="15.4 2030年までに持続可能な開発に不可欠な便益をもたらす山地生態系の能力を強化するため、生物多様性を含む山地生態系の保全を確実に行う。">
                    <label for="targetGroup${impact}-4">15.4 2030年までに持続可能な開発に不可欠な便益をもたらす山地生態系の能力を強化するため、生物多様性を含む山地生態系の保全を確実に行う。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="15.5 自然生息地の劣化を抑制し、生物多様性の損失を阻止し、2020年までに絶滅危惧種を保護し、また絶滅防止するための緊急かつ意味のある対策を講じる。">
                    <label for="targetGroup${impact}-5">15.5 自然生息地の劣化を抑制し、生物多様性の損失を阻止し、2020年までに絶滅危惧種を保護し、また絶滅防止するための緊急かつ意味のある対策を講じる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-6" name="targetGroup${impact}" value="15.6 国際合意に基づき、遺伝資源の利用から生ずる利益の公正かつ衡平な配分を推進するとともに、遺伝資源への適切なアクセスを推進する。">
                    <label for="targetGroup${impact}-6">15.6 国際合意に基づき、遺伝資源の利用から生ずる利益の公正かつ衡平な配分を推進するとともに、遺伝資源への適切なアクセスを推進する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-7" name="targetGroup${impact}" value="15.7 保護の対象となっている動植物種の密猟及び違法取引を撲滅するための緊急対策を講じるとともに、違法な野生生物製品の需要と供給の両面に対処する。">
                    <label for="targetGroup${impact}-7">15.7 保護の対象となっている動植物種の密猟及び違法取引を撲滅するための緊急対策を講じるとともに、違法な野生生物製品の需要と供給の両面に対処する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-8" name="targetGroup${impact}" value="15.8 2020年までに、外来種の侵入を防止するとともに、これらの種による陸域・海洋生態系への影響を大幅に減少させるための対策を導入し、さらに優先種の駆除または根絶を行う。">
                    <label for="targetGroup${impact}-8">15.8 2020年までに、外来種の侵入を防止するとともに、これらの種による陸域・海洋生態系への影響を大幅に減少させるための対策を導入し、さらに優先種の駆除または根絶を行う。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-9" name="targetGroup${impact}" value="15.9 2020年までに、生態系と生物多様性の価値を、国や地方の計画策定、開発プロセス及び貧困削減のための戦略及び会計に組み込む。">
                    <label for="targetGroup${impact}-9">15.9 2020年までに、生態系と生物多様性の価値を、国や地方の計画策定、開発プロセス及び貧困削減のための戦略及び会計に組み込む。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-10" name="targetGroup${impact}" value="15.a 生物多様性と生態系の保全と持続的な利用のために、あらゆる資金源からの資金の動員及び大幅な増額を行う。">
                    <label for="targetGroup${impact}-10">15.a 生物多様性と生態系の保全と持続的な利用のために、あらゆる資金源からの資金の動員及び大幅な増額を行う。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-11" name="targetGroup${impact}" value="15.b 保全や再植林を含む持続可能な森林経営を推進するため、あらゆるレベルのあらゆる供給源から、持続可能な森林経営のための資金の調達と開発途上国への十分なインセンティブ付与のための相当量の資源を動員する。">
                    <label for="targetGroup${impact}-11">15.b 保全や再植林を含む持続可能な森林経営を推進するため、あらゆるレベルのあらゆる供給源から、持続可能な森林経営のための資金の調達と開発途上国への十分なインセンティブ付与のための相当量の資源を動員する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-12" name="targetGroup${impact}" value="15.c 持続的な生計機会を追求するために地域コミュニティの能力向上を図る等、保護種の密猟及び違法な取引に対処するための努力に対する世界的な支援を強化する。">
                    <label for="targetGroup${impact}-12">15.c 持続的な生計機会を追求するために地域コミュニティの能力向上を図る等、保護種の密猟及び違法な取引に対処するための努力に対する世界的な支援を強化する。</label>
                </div>
            </fieldset>
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標16 平和と公正をすべての人に') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="16.1 あらゆる場所において、全ての形態の暴力及び暴力に関連する死亡率を大幅に減少させる。">
                    <label for="targetGroup${impact}-1">16.1 あらゆる場所において、全ての形態の暴力及び暴力に関連する死亡率を大幅に減少させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="16.2 子供に対する虐待、搾取、取引及びあらゆる形態の暴力及び拷問を撲滅する。">
                    <label for="targetGroup${impact}-2">16.2 子供に対する虐待、搾取、取引及びあらゆる形態の暴力及び拷問を撲滅する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="16.3 国家及び国際的なレベルでの法の支配を促進し、全ての人々に司法への平等なアクセスを提供する。">
                    <label for="targetGroup${impact}-3">16.3 国家及び国際的なレベルでの法の支配を促進し、全ての人々に司法への平等なアクセスを提供する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="16.4 2030年までに、違法な資金及び武器の取引を大幅に減少させ、奪われた財産の回復及び返還を強化し、あらゆる形態の組織犯罪を根絶する。">
                    <label for="targetGroup${impact}-4">16.4 2030年までに、違法な資金及び武器の取引を大幅に減少させ、奪われた財産の回復及び返還を強化し、あらゆる形態の組織犯罪を根絶する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="16.5 あらゆる形態の汚職や贈賄を大幅に減少させる。">
                    <label for="targetGroup${impact}-5">16.5 あらゆる形態の汚職や贈賄を大幅に減少させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-6" name="targetGroup${impact}" value="16.6 あらゆるレベルにおいて、有効で説明責任のある透明性の高い公共機関を発展させる。">
                    <label for="targetGroup${impact}-6">16.6 あらゆるレベルにおいて、有効で説明責任のある透明性の高い公共機関を発展させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-7" name="targetGroup${impact}" value="16.7 あらゆるレベルにおいて、対応的、包摂的、参加型及び代表的な意思決定を確保する。">
                    <label for="targetGroup${impact}-7">16.7 あらゆるレベルにおいて、対応的、包摂的、参加型及び代表的な意思決定を確保する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-8" name="targetGroup${impact}" value="16.8 グローバル・ガバナンス機関への開発途上国の参加を拡大・強化する。">
                    <label for="targetGroup${impact}-8">16.8 グローバル・ガバナンス機関への開発途上国の参加を拡大・強化する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-9" name="targetGroup${impact}" value="16.9 2030年までに、全ての人々に出生登録を含む法的な身分証明を提供する。">
                    <label for="targetGroup${impact}-9">16.9 2030年までに、全ての人々に出生登録を含む法的な身分証明を提供する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-10" name="targetGroup${impact}" value="16.10 国内法規及び国際協定に従い、情報への公共アクセスを確保し、基本的自由を保障する。">
                    <label for="targetGroup${impact}-10">16.10 国内法規及び国際協定に従い、情報への公共アクセスを確保し、基本的自由を保障する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-11" name="targetGroup${impact}" value="16.a 特に開発途上国において、暴力の防止とテロリズム・犯罪の撲滅に関するあらゆるレベルでの能力構築のため、国際協力などを通じて関連国家機関を強化する。">
                    <label for="targetGroup${impact}-11">16.a 特に開発途上国において、暴力の防止とテロリズム・犯罪の撲滅に関するあらゆるレベルでの能力構築のため、国際協力などを通じて関連国家機関を強化する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-12" name="targetGroup${impact}" value="16.b 持続可能な開発のための非差別的な法規及び政策を推進し、実施する。">
                    <label for="targetGroup${impact}-12">16.b 持続可能な開発のための非差別的な法規及び政策を推進し、実施する。</label>
                </div>
            </fieldset>
        `
    } else if (document.getElementById(`sdg${impact}`).value === '目標17 パートナーシップで目標を達成しよう') {
        target = `
            <br>
            <fieldset>
                <legend>เลือกเป้าหมายสำหรับ ${document.getElementById(`sdg${impact}`).value}. Choose targets for ${document.getElementById(`sdg${impact}`).value}.</legend>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-1" name="targetGroup${impact}" value="17.1 課税及び徴税能力の向上のため、開発途上国への国際的な支援なども通じて、国内資源の動員を強化する。">
                    <label for="targetGroup${impact}-1">17.1 課税及び徴税能力の向上のため、開発途上国への国際的な支援なども通じて、国内資源の動員を強化する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-2" name="targetGroup${impact}" value="17.2 先進国は、開発途上国に対するODAをGNI比0.7%に、後発開発途上国に対するODAをGNI比0.15～0.20%にするという目標を達成するとの多くの国によるコミットメントを含むODAに係るコミットメントを完全に実施する。ODA供与国が、少なくともGNI比0.20%のODAを後発開発途上国に供与するという目標の設定を検討することを奨励する。">
                    <label for="targetGroup${impact}-2">17.2 先進国は、開発途上国に対するODAをGNI比0.7%に、後発開発途上国に対するODAをGNI比0.15～0.20%にするという目標を達成するとの多くの国によるコミットメントを含むODAに係るコミットメントを完全に実施する。ODA供与国が、少なくともGNI比0.20%のODAを後発開発途上国に供与するという目標の設定を検討することを奨励する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-3" name="targetGroup${impact}" value="17.3 複数の財源から、開発途上国のための追加的資金源を動員する。">
                    <label for="targetGroup${impact}-3">17.3 複数の財源から、開発途上国のための追加的資金源を動員する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-4" name="targetGroup${impact}" value="17.4 必要に応じた負債による資金調達、債務救済及び債務再編の促進を目的とした協調的な政策により、開発途上国の長期的な債務の持続可能性の実現を支援し、重債務貧困国（HIPC）の対外債務への対応により債務リスクを軽減する。">
                    <label for="targetGroup${impact}-4">17.4 必要に応じた負債による資金調達、債務救済及び債務再編の促進を目的とした協調的な政策により、開発途上国の長期的な債務の持続可能性の実現を支援し、重債務貧困国（HIPC）の対外債務への対応により債務リスクを軽減する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-5" name="targetGroup${impact}" value="17.5 後発開発途上国のための投資促進枠組みを導入及び実施する。">
                    <label for="targetGroup${impact}-5">17.5 後発開発途上国のための投資促進枠組みを導入及び実施する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-6" name="targetGroup${impact}" value="17.6 科学技術イノベーション（STI）及びこれらへのアクセスに関する南北協力、南南協力及び地域的・国際的な三角協力を向上させる。また、国連レベルをはじめとする既存のメカニズム間の調整改善や、全世界的な技術促進メカニズムなどを通じて、相互に合意した条件において知識共有を進める。">
                    <label for="targetGroup${impact}-6">17.6 科学技術イノベーション（STI）及びこれらへのアクセスに関する南北協力、南南協力及び地域的・国際的な三角協力を向上させる。また、国連レベルをはじめとする既存のメカニズム間の調整改善や、全世界的な技術促進メカニズムなどを通じて、相互に合意した条件において知識共有を進める。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-7" name="targetGroup${impact}" value="17.7 開発途上国に対し、譲許的・特恵的条件などの相互に合意した有利な条件の下で、環境に配慮した技術の開発、移転、普及及び拡散を促進する。">
                    <label for="targetGroup${impact}-7">17.7 開発途上国に対し、譲許的・特恵的条件などの相互に合意した有利な条件の下で、環境に配慮した技術の開発、移転、普及及び拡散を促進する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-8" name="targetGroup${impact}" value="17.8 2017年までに、後発開発途上国のための技術バンク及び科学技術イノベーション能力構築メカニズムを完全運用させ、情報通信技術（ICT）をはじめとする実現技術の利用を強化する。">
                    <label for="targetGroup${impact}-8">17.8 2017年までに、後発開発途上国のための技術バンク及び科学技術イノベーション能力構築メカニズムを完全運用させ、情報通信技術（ICT）をはじめとする実現技術の利用を強化する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-9" name="targetGroup${impact}" value="17.9 全ての持続可能な開発目標を実施するための国家計画を支援するべく、南北協力、南南協力及び三角協力などを通じて、開発途上国における効果的かつ的をしぼった能力構築の実施に対する国際的な支援を強化する。">
                    <label for="targetGroup${impact}-9">17.9 全ての持続可能な開発目標を実施するための国家計画を支援するべく、南北協力、南南協力及び三角協力などを通じて、開発途上国における効果的かつ的をしぼった能力構築の実施に対する国際的な支援を強化する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-10" name="targetGroup${impact}" value="17.10 ドーハ・ラウンド（DDA）交渉の受諾を含むWTOの下での普遍的でルールに基づいた、差別的でない、公平な多角的貿易体制を促進する。">
                    <label for="targetGroup${impact}-10">17.10 ドーハ・ラウンド（DDA）交渉の受諾を含むWTOの下での普遍的でルールに基づいた、差別的でない、公平な多角的貿易体制を促進する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-11" name="targetGroup${impact}" value="17.11 開発途上国による輸出を大幅に増加させ、特に2020年までに世界の輸出に占める後発開発途上国のシェアを倍増させる。">
                    <label for="targetGroup${impact}-11">17.11 開発途上国による輸出を大幅に増加させ、特に2020年までに世界の輸出に占める後発開発途上国のシェアを倍増させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-12" name="targetGroup${impact}" value="17.12 後発開発途上国からの輸入に対する特恵的な原産地規則が透明で簡略的かつ市場アクセスの円滑化に寄与するものとなるようにすることを含む世界貿易機関（WTO）の決定に矛盾しない形で、全ての後発開発途上国に対し、永続的な無税・無枠の市場アクセスを適時実施する。">
                    <label for="targetGroup${impact}-12">17.12 後発開発途上国からの輸入に対する特恵的な原産地規則が透明で簡略的かつ市場アクセスの円滑化に寄与するものとなるようにすることを含む世界貿易機関（WTO）の決定に矛盾しない形で、全ての後発開発途上国に対し、永続的な無税・無枠の市場アクセスを適時実施する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-13" name="targetGroup${impact}" value="17.13 政策協調や政策の首尾一貫性などを通じて、世界的なマクロ経済の安定を促進する。">
                    <label for="targetGroup${impact}-13">17.13 政策協調や政策の首尾一貫性などを通じて、世界的なマクロ経済の安定を促進する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-14" name="targetGroup${impact}" value="17.14 持続可能な開発のための政策の一貫性を強化する。">
                    <label for="targetGroup${impact}-14">17.14 持続可能な開発のための政策の一貫性を強化する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-15" name="targetGroup${impact}" value="17.15 貧困撲滅と持続可能な開発のための政策の確立・実施にあたっては、各国の政策空間及びリーダーシップを尊重する。">
                    <label for="targetGroup${impact}-15">17.15 貧困撲滅と持続可能な開発のための政策の確立・実施にあたっては、各国の政策空間及びリーダーシップを尊重する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-16" name="targetGroup${impact}" value="17.16 全ての国々、特に開発途上国での持続可能な開発目標の達成を支援すべく、知識、専門的知見、技術及び資金源を動員、共有するマルチステークホルダー・パートナーシップによって補完しつつ、持続可能な開発のためのグローバル・パートナーシップを強化する。">
                    <label for="targetGroup${impact}-16">17.16 全ての国々、特に開発途上国での持続可能な開発目標の達成を支援すべく、知識、専門的知見、技術及び資金源を動員、共有するマルチステークホルダー・パートナーシップによって補完しつつ、持続可能な開発のためのグローバル・パートナーシップを強化する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-17" name="targetGroup${impact}" value="17.17 さまざまなパートナーシップの経験や資源戦略を基にした、効果的な公的、官民、市民社会のパートナーシップを奨励・推進する。">
                    <label for="targetGroup${impact}-17">17.17 さまざまなパートナーシップの経験や資源戦略を基にした、効果的な公的、官民、市民社会のパートナーシップを奨励・推進する。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-18" name="targetGroup${impact}" value="17.18 2020年までに、後発開発途上国及び小島嶼開発途上国を含む開発途上国に対する能力構築支援を強化し、所得、性別、年齢、人種、民族、居住資格、障害、地理的位置及びその他各国事情に関連する特性別の質が高く、タイムリーかつ信頼性のある非集計型データの入手可能性を向上させる。">
                    <label for="targetGroup${impact}-18">17.18 2020年までに、後発開発途上国及び小島嶼開発途上国を含む開発途上国に対する能力構築支援を強化し、所得、性別、年齢、人種、民族、居住資格、障害、地理的位置及びその他各国事情に関連する特性別の質が高く、タイムリーかつ信頼性のある非集計型データの入手可能性を向上させる。</label>
                </div>
                <div>
                    <input type="checkbox" id="targetGroup${impact}-19" name="targetGroup${impact}" value="17.19 2030年までに、持続可能な開発の進捗状況を測るGDP以外の尺度を開発する既存の取組を更に前進させ、開発途上国における統計に関する能力構築を支援する。">
                    <label for="targetGroup${impact}-19">17.19 2030年までに、持続可能な開発の進捗状況を測るGDP以外の尺度を開発する既存の取組を更に前進させ、開発途上国における統計に関する能力構築を支援する。</label>
                </div>
            </fieldset>
        `
    }

    // Modify target DOM
    document.getElementById(`target${impact}`).innerHTML = target
}

// Prefill impact data
if (data.impact[0].sdg === "") {  // If no impact, create a blank impact group
    const childNodeObjectiveLabel = document.createElement('p')
    const childNodeObjective = document.createElement('textarea')
    const childNodeSdgLabel = document.createElement('p')
    const childNodeSdg = document.createElement('select')
    const childNodeTarget = document.createElement('div')
    const childNodeBr = document.createElement('br')
    const childNodeHr = document.createElement('hr')

    childNodeObjectiveLabel.setAttribute('id', `objective1Label`)
    childNodeObjectiveLabel.setAttribute('class', `black-small`)

    childNodeObjective.setAttribute('id', `objective1`)
    childNodeObjective.setAttribute('placeholder', `目標番号を指定します #1 この目標に対応するSDGsの目標を選択します。`)
    
    childNodeSdgLabel.setAttribute('id', `sdg1Label`)
    childNodeSdgLabel.setAttribute('class', `black-small`)

    childNodeSdg.setAttribute('id', `sdg1`)
    childNodeSdg.setAttribute('name', `sdg1`)
    childNodeSdg.setAttribute('onchange', `filterTarget(1)`)

    childNodeTarget.setAttribute('id', `target1`)

    childNodeBr.setAttribute('id', `impact1Br`)

    childNodeHr.setAttribute('id', `impact1Hr`)

    impactWrapper.append(childNodeObjectiveLabel)
    childNodeObjectiveLabel.innerHTML = `目標番号を指定します #1`

    impactWrapper.append(childNodeObjective)

    impactWrapper.append(childNodeSdgLabel)
    childNodeSdgLabel.innerHTML = `SDG目標を選択する`

    impactWrapper.append(childNodeSdg)

    document.getElementById(`sdg1`).innerHTML = `
        <option value="" disabled selected>--- SDG目標を選択する ---</option>
        <option value="目標1 貧困をなくそう">目標1 貧困をなくそう</option>
        <option value="目標2 飢餓をゼロに">目標2 飢餓をゼロに</option>
        <option value="目標3 全ての人に健康と福祉を">目標3 全ての人に健康と福祉を</option>
        <option value="目標4 質の高い教育をみんなに">目標4 質の高い教育をみんなに</option>
        <option value="目標5 ジェンダー平等を実現しよう">目標5 ジェンダー平等を実現しよう</option>
        <option value="目標6 安全な水とトイレを世界中に">目標6 安全な水とトイレを世界中に</option>
        <option value="目標7 エネルギーをみんなにそしてクリーンに">目標7 エネルギーをみんなにそしてクリーンに</option>
        <option value="目標8 働きがいも経済成長も">目標8 働きがいも経済成長も</option>
        <option value="目標9 産業と技術革新の基盤をつくろう">目標9 産業と技術革新の基盤をつくろう</option>
        <option value="目標10 人や国の不平等をなくそう">目標10 人や国の不平等をなくそう</option>
        <option value="目標11 住み続けられるまちづくりを">目標11 住み続けられるまちづくりを</option>
        <option value="目標12 つくる責任つかう責任">目標12 つくる責任つかう責任</option>
        <option value="目標13 気候変動に具体的な対策を">目標13 気候変動に具体的な対策を</option>
        <option value="目標14 海の豊かさを守ろう">目標14 海の豊かさを守ろう</option>
        <option value="目標15 陸の豊かさを守ろう">目標15 陸の豊かさを守ろう</option>
        <option value="目標16 平和と公正をすべての人に">目標16 平和と公正をすべての人に</option>
        <option value="目標17 パートナーシップで目標を達成しよう">目標17 パートナーシップで目標を達成しよう</option>
    `

    impactWrapper.append(childNodeTarget)
    impactWrapper.append(childNodeBr)
    impactWrapper.append(childNodeHr)
} else {  // If there's at least 1 filled impact
    for (let i=1; i <= data.impact.length; i++) {  // For each impact
        const childNodeObjectiveLabel = document.createElement('p')
        const childNodeObjective = document.createElement('textarea')
        const childNodeSdgLabel = document.createElement('p')
        const childNodeSdg = document.createElement('select')
        const childNodeTarget = document.createElement('div')
        const childNodeBr = document.createElement('br')
        const childNodeHr = document.createElement('hr')

        childNodeObjectiveLabel.setAttribute('id', `objective${i}Label`)
        childNodeObjectiveLabel.setAttribute('class', `black-small`)

        childNodeObjective.setAttribute('id', `objective${i}`)
        childNodeObjective.setAttribute('placeholder', `目標番号を指定します #${i} この目標に対応するSDGsの目標を選択します。`)
        
        childNodeSdgLabel.setAttribute('id', `sdg${i}Label`)
        childNodeSdgLabel.setAttribute('class', `black-small`)

        childNodeSdg.setAttribute('id', `sdg${i}`)
        childNodeSdg.setAttribute('name', `sdg${i}`)
        childNodeSdg.setAttribute('onchange', `filterTarget(${i})`)
        
        childNodeTarget.setAttribute('id', `target${i}`)
        
        childNodeBr.setAttribute('id', `impact${i}Br`)

        childNodeHr.setAttribute('id', `impact${i}Hr`)

        impactWrapper.append(childNodeObjectiveLabel)
        childNodeObjectiveLabel.innerHTML = `目標番号を指定します #${i}`

        impactWrapper.append(childNodeObjective)

        impactWrapper.append(childNodeSdgLabel)
        childNodeSdgLabel.innerHTML = `SDG目標を選択する`

        impactWrapper.append(childNodeSdg)

        document.getElementById(`sdg${i}`).innerHTML = `
            <option value="" disabled selected>--- SDG目標を選択する ---</option>
            <option value="目標1 貧困をなくそう">目標1 貧困をなくそう</option>
            <option value="目標2 飢餓をゼロに">目標2 飢餓をゼロに</option>
            <option value="目標3 全ての人に健康と福祉を">目標3 全ての人に健康と福祉を</option>
            <option value="目標4 質の高い教育をみんなに">目標4 質の高い教育をみんなに</option>
            <option value="目標5 ジェンダー平等を実現しよう">目標5 ジェンダー平等を実現しよう</option>
            <option value="目標6 安全な水とトイレを世界中に">目標6 安全な水とトイレを世界中に</option>
            <option value="目標7 エネルギーをみんなにそしてクリーンに">目標7 エネルギーをみんなにそしてクリーンに</option>
            <option value="目標8 働きがいも経済成長も">目標8 働きがいも経済成長も</option>
            <option value="目標9 産業と技術革新の基盤をつくろう">目標9 産業と技術革新の基盤をつくろう</option>
            <option value="目標10 人や国の不平等をなくそう">目標10 人や国の不平等をなくそう</option>
            <option value="目標11 住み続けられるまちづくりを">目標11 住み続けられるまちづくりを</option>
            <option value="目標12 つくる責任つかう責任">目標12 つくる責任つかう責任</option>
            <option value="目標13 気候変動に具体的な対策を">目標13 気候変動に具体的な対策を</option>
            <option value="目標14 海の豊かさを守ろう">目標14 海の豊かさを守ろう</option>
            <option value="目標15 陸の豊かさを守ろう">目標15 陸の豊かさを守ろう</option>
            <option value="目標16 平和と公正をすべての人に">目標16 平和と公正をすべての人に</option>
            <option value="目標17 パートナーシップで目標を達成しよう">目標17 パートナーシップで目標を達成しよう</option>
        `

        impactWrapper.append(childNodeTarget)
        impactWrapper.append(childNodeBr)
        impactWrapper.append(childNodeHr)

        // Prefill value
        document.getElementById(`objective${i}`).value = data.impact[i-1].objective
        document.getElementById(`sdg${i}`).value = data.impact[i-1].sdg

        // Call filterTarget function to reveal target
        filterTarget(i)

        // Map target checkboxes with data's target array element
        // THIS SAVES A THOUSAND LINES OF CODE COMPARING TO MANUAL SELECTION !
        data.impact[i-1].target.forEach((target) => {
            document.querySelector(`input[type='checkbox'][value='${target}']`).checked = true
        })
    }
}

// Prefill team data
if (data.team[0].name === "") {  // If no team, create a blank team group
    const childNodeNameLabel = document.createElement('p')
    const childNodeName = document.createElement('input')
    const childNodePositionLabel = document.createElement('p')
    const childNodePosition = document.createElement('input')
    const childNodeClear = document.createElement('div')
    const childNodeHr = document.createElement('hr')

    childNodeNameLabel.setAttribute('id', `team${teamNum+1}NameLabel`)
    childNodeNameLabel.setAttribute('class', `black-small`)

    childNodeName.setAttribute('id', `team${teamNum+1}Name`)
    childNodeName.setAttribute('type', `text`)
    childNodeName.setAttribute('placeholder', `名前`)
    
    childNodePositionLabel.setAttribute('id', `team${teamNum+1}PositionLabel`)
    childNodePositionLabel.setAttribute('class', `black-small`)

    childNodePosition.setAttribute('id', `team${teamNum+1}Position`)
    childNodePosition.setAttribute('type', `text`)
    childNodePosition.setAttribute('placeholder', `職位`)
    
    childNodeClear.setAttribute('id', `team${teamNum+1}Clear`)
    childNodeClear.setAttribute('class', 'clear')

    childNodeHr.setAttribute('id', `team${teamNum+1}Hr`)

    teamWrapper.append(childNodeNameLabel)
    childNodeNameLabel.innerHTML = `名前 #${teamNum+1}`

    teamWrapper.append(childNodeName)
    teamWrapper.append(childNodePositionLabel)
    childNodePositionLabel.innerHTML = '職位'
    teamWrapper.append(childNodePosition)
    teamWrapper.append(childNodeClear)
    teamWrapper.append(childNodeHr)
} else {
    for (let i=1; i <= data.team.length; i++) {
        const childNodeNameLabel = document.createElement('p')
        const childNodeName = document.createElement('input')
        const childNodePositionLabel = document.createElement('p')
        const childNodePosition = document.createElement('input')
        const childNodeClear = document.createElement('div')
        const childNodeHr = document.createElement('hr')

        childNodeNameLabel.setAttribute('id', `team${i}NameLabel`)
        childNodeNameLabel.setAttribute('class', `black-small`)

        childNodeName.setAttribute('id', `team${i}Name`)
        childNodeName.setAttribute('type', `text`)
        childNodeName.setAttribute('placeholder', `名前`)
        childNodeName.setAttribute('value', data.team[i-1].teamName)

        childNodePositionLabel.setAttribute('id', `team${i}PositionLabel`)
        childNodePositionLabel.setAttribute('class', `black-small`)
        
        childNodePosition.setAttribute('id', `team${i}Position`)
        childNodePosition.setAttribute('type', `text`)
        childNodePosition.setAttribute('placeholder', `職位`)
        childNodePosition.setAttribute('value', data.team[i-1].teamPosition)
        
        childNodeClear.setAttribute('id', `team${i}Clear`)
        childNodeClear.setAttribute('class', 'clear')

        childNodeHr.setAttribute('id', `team${i}Hr`)

        teamWrapper.append(childNodeNameLabel)
        childNodeNameLabel.innerHTML = `名前 #${i}`
        teamWrapper.append(childNodeName)
        teamWrapper.append(childNodePositionLabel)
        childNodePositionLabel.innerHTML = '職位'
        teamWrapper.append(childNodePosition)
        teamWrapper.append(childNodeClear)
        teamWrapper.append(childNodeHr)
    }
}

// Pre-select published checkbox
if (data.published === true) {
    published.checked = true
} else {
    published.checked = false
}

// impact add/minus functions
let impactNum = data.impact.length  // Initial number of impact from existing data

function impactAdd() {
    const childNodeObjectiveLabel = document.createElement('p')
    const childNodeObjective = document.createElement('textarea')
    const childNodeSdgLabel = document.createElement('p')
    const childNodeSdg = document.createElement('select')
    const childNodeTarget = document.createElement('div')
    const childNodeBr = document.createElement('br')
    const childNodeHr = document.createElement('hr')

    childNodeObjectiveLabel.setAttribute('id', `objective${impactNum+1}Label`)
    childNodeObjectiveLabel.setAttribute('class', `black-small`)

    childNodeObjective.setAttribute('id', `objective${impactNum+1}`)
    childNodeObjective.setAttribute('placeholder', `目標番号を指定します #${impactNum+1} この目標に対応するSDGsの目標を選択します。`)
    
    childNodeSdgLabel.setAttribute('id', `sdg${impactNum+1}Label`)
    childNodeSdgLabel.setAttribute('class', `black-small`)

    childNodeSdg.setAttribute('id', `sdg${impactNum+1}`)
    childNodeSdg.setAttribute('name', `sdg${impactNum+1}`)
    childNodeSdg.setAttribute('onchange', `filterTarget(${impactNum+1})`)
    
    childNodeTarget.setAttribute('id', `target${impactNum+1}`)
    
    childNodeBr.setAttribute('id', `impact${impactNum+1}Br`)

    childNodeHr.setAttribute('id', `impact${impactNum+1}Hr`)

    impactWrapper.append(childNodeObjectiveLabel)
    childNodeObjectiveLabel.innerHTML = `目標番号を指定します #${impactNum+1}`

    impactWrapper.append(childNodeObjective)

    impactWrapper.append(childNodeSdgLabel)
    childNodeSdgLabel.innerHTML = `SDG目標を選択する`

    impactWrapper.append(childNodeSdg)

    document.getElementById(`sdg${impactNum+1}`).innerHTML = `
        <option value="" disabled selected>--- SDG目標を選択する ---</option>
        <option value="目標1 貧困をなくそう">目標1 貧困をなくそう</option>
        <option value="目標2 飢餓をゼロに">目標2 飢餓をゼロに</option>
        <option value="目標3 全ての人に健康と福祉を">目標3 全ての人に健康と福祉を</option>
        <option value="目標4 質の高い教育をみんなに">目標4 質の高い教育をみんなに</option>
        <option value="目標5 ジェンダー平等を実現しよう">目標5 ジェンダー平等を実現しよう</option>
        <option value="目標6 安全な水とトイレを世界中に">目標6 安全な水とトイレを世界中に</option>
        <option value="目標7 エネルギーをみんなにそしてクリーンに">目標7 エネルギーをみんなにそしてクリーンに</option>
        <option value="目標8 働きがいも経済成長も">目標8 働きがいも経済成長も</option>
        <option value="目標9 産業と技術革新の基盤をつくろう">目標9 産業と技術革新の基盤をつくろう</option>
        <option value="目標10 人や国の不平等をなくそう">目標10 人や国の不平等をなくそう</option>
        <option value="目標11 住み続けられるまちづくりを">目標11 住み続けられるまちづくりを</option>
        <option value="目標12 つくる責任つかう責任">目標12 つくる責任つかう責任</option>
        <option value="目標13 気候変動に具体的な対策を">目標13 気候変動に具体的な対策を</option>
        <option value="目標14 海の豊かさを守ろう">目標14 海の豊かさを守ろう</option>
        <option value="目標15 陸の豊かさを守ろう">目標15 陸の豊かさを守ろう</option>
        <option value="目標16 平和と公正をすべての人に">目標16 平和と公正をすべての人に</option>
        <option value="目標17 パートナーシップで目標を達成しよう">目標17 パートナーシップで目標を達成しよう</option>
    `

    impactWrapper.append(childNodeTarget)
    impactWrapper.append(childNodeBr)
    impactWrapper.append(childNodeHr)

    impactNum += 1
}

function impactMinus() {
    if (impactNum > 1) {
        impactWrapper.removeChild(document.getElementById(`objective${impactNum}Label`))
        impactWrapper.removeChild(document.getElementById(`objective${impactNum}`))
        impactWrapper.removeChild(document.getElementById(`sdg${impactNum}Label`))
        impactWrapper.removeChild(document.getElementById(`sdg${impactNum}`))
        impactWrapper.removeChild(document.getElementById(`target${impactNum}`))
        impactWrapper.removeChild(document.getElementById(`impact${impactNum}Br`))
        impactWrapper.removeChild(document.getElementById(`impact${impactNum}Hr`))

        impactNum -= 1
    }
}

// team add/minus functions
let teamNum = data.team.length  // Initial number of team from existing data

function teamAdd() {
    const childNodeNameLabel = document.createElement('p')
    const childNodeName = document.createElement('input')
    const childNodePositionLabel = document.createElement('p')
    const childNodePosition = document.createElement('input')
    const childNodeClear = document.createElement('div')
    const childNodeHr = document.createElement('hr')

    childNodeNameLabel.setAttribute('id', `team${teamNum+1}NameLabel`)
    childNodeNameLabel.setAttribute('class', `black-small`)

    childNodeName.setAttribute('id', `team${teamNum+1}Name`)
    childNodeName.setAttribute('type', `text`)
    childNodeName.setAttribute('placeholder', `名前`)

    childNodePositionLabel.setAttribute('id', `team${teamNum+1}PositionLabel`)
    childNodePositionLabel.setAttribute('class', `black-small`)

    childNodePosition.setAttribute('id', `team${teamNum+1}Position`)
    childNodePosition.setAttribute('type', `text`)
    childNodePosition.setAttribute('placeholder', `職位`)

    childNodeClear.setAttribute('id', `team${teamNum+1}Clear`)
    childNodeClear.setAttribute('class', 'clear')

    childNodeHr.setAttribute('id', `team${teamNum+1}Hr`)

    teamWrapper.append(childNodeNameLabel)
    childNodeNameLabel.innerHTML = `名前 #${teamNum+1}`

    teamWrapper.append(childNodeName)
    teamWrapper.append(childNodePositionLabel)
    childNodePositionLabel.innerHTML = '職位'
    teamWrapper.append(childNodePosition)
    teamWrapper.append(childNodeClear)
    teamWrapper.append(childNodeHr)

    teamNum += 1
}

function teamMinus() {
    if (teamNum > 1) {
        teamWrapper.removeChild(document.getElementById(`team${teamNum}NameLabel`))
        teamWrapper.removeChild(document.getElementById(`team${teamNum}Name`))
        teamWrapper.removeChild(document.getElementById(`team${teamNum}PositionLabel`))
        teamWrapper.removeChild(document.getElementById(`team${teamNum}Position`))
        teamWrapper.removeChild(document.getElementById(`team${teamNum}Clear`))
        teamWrapper.removeChild(document.getElementById(`team${teamNum}Hr`))

        teamNum -= 1
    }
}

// Form submission
function fetchSubmit() {
    // Create validation variable
    // Ref: https://stackoverflow.com/a/12643073
    const regexNumber = /^[0-9]+$/;
    const regexFloat = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/;

    let durationValid = false
    let budgetValid = false

    // Check if duration is an integer
    if (duration.value.match(regexNumber)) {
        console.log('Duration is an interger')
        durationValid = true
        durationGuide.style.display = 'none'
    } else {
        console.log('Duration is NOT an interger')
        durationValid = false
        durationGuide.style.display = 'block'
    }

    // Check if budget is a float
    if (budget.value.match(regexFloat)) {
        console.log('Budget is a float')
        budgetValid = true
        budgetGuide.style.display = 'none'
    } else {
        console.log('Budget is NOT a float')
        budgetValid = false
        budgetGuide.style.display = 'block'
    }

    // Continue of all validations pass
    if (durationValid === true && budgetValid === true) {
        // Create teamArray
        let teamArray = []

        for (let i=1; i <= teamNum; i++) {
            teamArray.push({
                teamName: document.getElementById(`team${i}Name`).value, 
                teamPosition: document.getElementById(`team${i}Position`).value, 
            })
        }

        // Create impactArray
        let impactArray = []

        for (let i=1; i <= impactNum; i++) {
            // Prep target checkbox values
            let target = []
            const targetCheckboxes = document.querySelectorAll(`input[name="targetGroup${i}"]:checked`)

            targetCheckboxes.forEach((checkbox) => {
                target.push(checkbox.value)
            })

            impactArray.push({
                objective: document.getElementById(`objective${i}`).value, 
                sdg: document.getElementById(`sdg${i}`).value, 
                target: target 
            })
        }

        // Create published boolean
        let publishedBool = false

        if (published.checked === true) {
            publishedBool = true
        } else {
            publishedBool = false
        }

        // Build final formData
        formData = {
            title: title.value, 
            impact: impactArray, 
            summary: summary.value, 
            duration: Number(duration.value), 
            budget: Number(budget.value),
            team: teamArray, 
            published: publishedBool
        }

        // console.log(formData)

        fetch('/project/' + projectId + '/edit', {
            method: 'post', 
            credentials: 'include',
            cache: "no-cache", 
            headers: {
                'Content-Type': 'application/json', 
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            window.location.replace('/project/' + projectId)
        })
        .catch((error) => {
            console.error('Error: ', error);
        })
    }
}