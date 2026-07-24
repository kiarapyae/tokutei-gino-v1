import React, { useState } from 'react';
import {
  FileSpreadsheet,
  ShieldCheck,
  Thermometer,
  AlertOctagon,
  Layers,
  Sparkles,
  AlertTriangle,
  Factory
} from 'lucide-react';

export const ReferenceGuide: React.FC = () => {
  const [activeGuideTab, setActiveGuideTab] = useState<
    '5s' | 'bacteria' | 'temps' | 'allergens' | 'haccp' | 'safety'
  >('bacteria');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Title & Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
            <span>High-Yield Cheat Sheets & Reference</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quick reference tables and rules from the official Japanese Food Manufacturing textbook (第4版).
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveGuideTab('bacteria')}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeGuideTab === 'bacteria'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Bacteria & Viruses (食中毒菌)</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('temps')}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeGuideTab === 'temps'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Thermometer className="w-4 h-4" />
            <span>Storage Temps (保管温度)</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('allergens')}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeGuideTab === 'allergens'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Allergens (アレルゲン)</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('5s')}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeGuideTab === '5s'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>5S & Factory Zoning</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('haccp')}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeGuideTab === 'haccp'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>HACCP 7 Principles</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('safety')}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeGuideTab === 'safety'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Workplace Safety & PPE</span>
          </button>
        </div>
      </div>

      {/* BACTERIA & VIRUSES MATRIX */}
      {activeGuideTab === 'bacteria' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-x-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Food Poisoning Microbes Matrix (代表的な食中毒菌とウイルス)
            </h2>

            <table className="w-full text-left text-xs font-jp border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  <th className="p-3 rounded-l-xl">Microbe Name (名称)</th>
                  <th className="p-3">Source Food (原因食品)</th>
                  <th className="p-3">Main Symptoms (主な症状)</th>
                  <th className="p-3 rounded-r-xl">Key Prevention Rule (予防・殺菌)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="p-3 font-bold text-sky-600 dark:text-sky-400">
                    カンピロバクター
                  </td>
                  <td className="p-3">Raw poultry meat (鶏肉・食肉)</td>
                  <td className="p-3">Diarrhea, fever, belly pain</td>
                  <td className="p-3">Core temp 75℃ for 1+ min</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-sky-600 dark:text-sky-400">
                    サルモネラ属菌
                  </td>
                  <td className="p-3">Eggs (鶏卵), poultry/meat</td>
                  <td className="p-3">Fever, diarrhea, abdominal pain</td>
                  <td className="p-3">Refrigeration & thorough cooking</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-sky-600 dark:text-sky-400">
                    腸炎ビブリオ
                  </td>
                  <td className="p-3">Seafood & raw fish (魚介類)</td>
                  <td className="p-3">Severe diarrhea, stomach cramps</td>
                  <td className="p-3">Keep raw seafood ≤5℃, rinse tap water</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-sky-600 dark:text-sky-400">
                    腸管出血性大腸菌 (O157)
                  </td>
                  <td className="p-3">Beef (牛肉), raw veggies, well water</td>
                  <td className="p-3 font-semibold text-rose-500">Bloody diarrhea, severe pain</td>
                  <td className="p-3">Core temp 75℃ for 1+ min</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-rose-500">
                    黄色ブドウ球菌 ★
                  </td>
                  <td className="p-3">Human skin, hand cuts, rice balls</td>
                  <td className="p-3">Nausea, vomiting</td>
                  <td className="p-3 font-bold text-rose-400">
                    Toxin is heat resistant! Workers with cuts CANNOT prep!
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-amber-500">
                    セレウス菌 / ウェルシュ菌 ★
                  </td>
                  <td className="p-3">Grains, cooked curries, stews</td>
                  <td className="p-3">Diarrhea, vomiting</td>
                  <td className="p-3">
                    Forms heat-resistant spores (芽胞). Cool to &lt;20℃ in 30 mins!
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-purple-400">
                    ボツリヌス菌 ★
                  </td>
                  <td className="p-3">Canned, bottled, retort vacuum food</td>
                  <td className="p-3 font-bold text-rose-400">Breathing difficulty (呼吸困難)</td>
                  <td className="p-3">High pressure heat (120℃ 4 mins)</td>
                </tr>

                <tr className="bg-sky-50/50 dark:bg-sky-950/20">
                  <td className="p-3 font-extrabold text-sky-500">
                    ノロウイルス (Virus) ★
                  </td>
                  <td className="p-3">Oysters/bivalves (二枚貝), human feces</td>
                  <td className="p-3">Severe vomiting, diarrhea</td>
                  <td className="p-3 font-bold text-sky-400">
                    Alcohol does NOT kill! Heat 85~90℃ 90s+ or 200ppm Chlorine.
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-emerald-500">
                    アニサキス (Parasite)
                  </td>
                  <td className="p-3">Raw mackerel (サバ), salmon, squid</td>
                  <td className="p-3">Intense stomach pain</td>
                  <td className="p-3">Heat 70℃+ or freeze -20℃ for 24+ hours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STORAGE TEMPERATURES */}
      {activeGuideTab === 'temps' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Food Item Storage Temperature Criteria (原材料の保管温度)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-jp">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-sky-600 dark:text-sky-400 text-sm">
                Refrigerated Storage (冷蔵 10℃以下)
              </span>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                <li>&bull; <strong className="text-slate-900 dark:text-white">Meat (食肉) & Meat Products:</strong> 10℃ or lower</li>
                <li>&bull; <strong className="text-slate-900 dark:text-white">Fresh Seafood (生鮮魚介類):</strong> 5℃ or lower</li>
                <li>&bull; <strong className="text-slate-900 dark:text-white">Shell Eggs (殻付き卵):</strong> 10℃ or lower</li>
                <li>&bull; <strong className="text-slate-900 dark:text-white">Liquid Eggs (液卵):</strong> 8℃ or lower</li>
                <li>&bull; <strong className="text-slate-900 dark:text-white">Milk, Cream:</strong> 10℃ or lower</li>
                <li>&bull; <strong className="text-slate-900 dark:text-white">Butter, Cheese:</strong> 15℃ or lower</li>
                <li>&bull; <strong className="text-slate-900 dark:text-white">Rice (米穀類):</strong> 15℃ or lower</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-indigo-500 text-sm">
                Frozen Storage (冷凍 -15℃以下 / -18℃以下)
              </span>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                <li>&bull; <strong className="text-slate-900 dark:text-white">Frozen Meat (冷凍食肉):</strong> -15℃ or lower</li>
                <li>&bull; <strong className="text-slate-900 dark:text-white">Frozen Seafood (冷凍水産物):</strong> -18℃ or lower</li>
                <li>&bull; <strong className="text-slate-900 dark:text-white">Frozen Processed Foods:</strong> -18℃ or lower</li>
                <li>&bull; <strong className="text-slate-900 dark:text-white">Frozen Eggs (凍結卵):</strong> -18℃ or lower</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ALLERGENS */}
      {activeGuideTab === 'allergens' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Allergen Labeling Standards (アレルギー物質表示)
            </h2>
            <p className="text-xs text-slate-500">
              Legally mandatory items (8 items) vs recommended items (20 items).
            </p>
          </div>

          <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <AlertOctagon className="w-5 h-5" />
              <span>Mandatory Display Items (特定原材料 8品目)</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              {['えび (Shrimp)', 'かに (Crab)', 'くるみ (Walnut ★ Added Mar 2023)', '小麦 (Wheat)', 'そば (Buckwheat)', '卵 (Egg)', '乳 (Milk)', '落花生/ピーナッツ (Peanut)'].map((item) => (
                <span key={item} className="bg-rose-500 text-white px-3 py-1 rounded-full shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-2">
            <span className="font-bold text-xs text-slate-600 dark:text-slate-300 uppercase">
              Recommended Display Items (特定原材料に準ずるもの 20品目)
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-jp">
              アーモンド, あわび, いか, いくら, オレンジ, カシューナッツ, キウイフルーツ, 牛肉, ごま, さけ, さば, 大豆, 鶏肉, バナナ, 豚肉, まつたけ, 桃, やまいも, りんご, ゼラチン
            </p>
          </div>
        </div>
      )}

      {/* 5S & ZONING */}
      {activeGuideTab === '5s' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              The 5S Framework (５Ｓ活動)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              <div className="bg-sky-50 dark:bg-slate-800 p-3 rounded-xl border border-sky-200 dark:border-slate-700">
                <span className="font-extrabold text-sky-600 dark:text-sky-400 block text-sm">1. 整理 (Seiri)</span>
                <p className="text-slate-600 dark:text-slate-300 mt-1">Sort & discard unnecessary tools.</p>
              </div>
              <div className="bg-sky-50 dark:bg-slate-800 p-3 rounded-xl border border-sky-200 dark:border-slate-700">
                <span className="font-extrabold text-sky-600 dark:text-sky-400 block text-sm">2. 整頓 (Seiton)</span>
                <p className="text-slate-600 dark:text-slate-300 mt-1">Set tools in easy reachable places.</p>
              </div>
              <div className="bg-sky-50 dark:bg-slate-800 p-3 rounded-xl border border-sky-200 dark:border-slate-700">
                <span className="font-extrabold text-sky-600 dark:text-sky-400 block text-sm">3. 清掃 (Seisou)</span>
                <p className="text-slate-600 dark:text-slate-300 mt-1">Clean & remove dirt/dust daily.</p>
              </div>
              <div className="bg-sky-50 dark:bg-slate-800 p-3 rounded-xl border border-sky-200 dark:border-slate-700">
                <span className="font-extrabold text-sky-600 dark:text-sky-400 block text-sm">4. 清潔 (Seiketsu)</span>
                <p className="text-slate-600 dark:text-slate-300 mt-1">Maintain sanitized conditions.</p>
              </div>
              <div className="bg-sky-50 dark:bg-slate-800 p-3 rounded-xl border border-sky-200 dark:border-slate-700">
                <span className="font-extrabold text-sky-600 dark:text-sky-400 block text-sm">5. 習慣付け</span>
                <p className="text-slate-600 dark:text-slate-300 mt-1">Sustain & strictly follow rules.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Factory Zoning Division (ゾーニング / 区分衛生管理)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-jp">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm block">
                  清潔作業区域 (Clean Zone)
                </span>
                <p className="mt-1">
                  Final assembly, topping, packaging of cooked/sterilized foods.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm block">
                  準清潔作業区域 (Semi-Clean Zone)
                </span>
                <p className="mt-1">
                  Raw food prep, washing, cooking prior to sterilization.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200">
                <span className="font-bold text-rose-600 dark:text-rose-400 text-sm block">
                  汚染作業区域 (Contaminated Zone)
                </span>
                <p className="mt-1">
                  Receiving raw ingredients, outer cardboard handling, shipping.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HACCP */}
      {activeGuideTab === 'haccp' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            HACCP 7 Principles (HACCPの7原則)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-jp">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <strong className="text-sky-600 dark:text-sky-400 block">原則1: 危害要因分析 (Hazard Analysis)</strong>
              <span>Analyze potential physical, chemical, and biological hazards.</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <strong className="text-sky-600 dark:text-sky-400 block">原則2: 重要管理点（CCP）の決定</strong>
              <span>Determine Critical Control Points to eliminate hazards.</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <strong className="text-sky-600 dark:text-sky-400 block">原則3: 管理基準（CL）の設定</strong>
              <span>Set critical temperature/time parameters (e.g. 75℃ 1 min).</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <strong className="text-sky-600 dark:text-sky-400 block">原則4: 監視（モニタリング）方法の設定</strong>
              <span>Continuous monitoring of temperatures and operational limits.</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <strong className="text-sky-600 dark:text-sky-400 block">原則5: 改善措置の設定 (Corrective Actions)</strong>
              <span>Action plan if CL is breached (e.g. discard undercooked food).</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <strong className="text-sky-600 dark:text-sky-400 block">原則6: 検証方法の設定 (Verification)</strong>
              <span>Periodic verification testing to ensure the HACCP plan works.</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 sm:col-span-2">
              <strong className="text-sky-600 dark:text-sky-400 block">原則7: 記録 (Record Keeping)</strong>
              <span>Documenting monitoring data, dates, and inspector signatures immediately.</span>
            </div>
          </div>
        </div>
      )}

      {/* SAFETY & HEINRICH'S LAW */}
      {activeGuideTab === 'safety' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-amber-500 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Heinrich’s Law (ハインリッヒの法則: 1 : 29 : 300)</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Behind every <strong>1 major fatal accident (重い災害)</strong>, there are <strong>29 minor injuries (軽いケガ)</strong> and <strong>300 near-miss incidents (ヒヤリ・ハット)</strong>. Reporting and reducing near-misses is key to preventing major plant disasters!
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Top 3 Food Factory Accidents (~60% of total)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-extrabold text-sky-500 block text-sm">1. 転倒 (Falls/Slips)</span>
                <span className="text-slate-400">31.3% of total accidents</span>
                <p className="text-slate-600 dark:text-slate-300 mt-1">Caused by wet floors & cluttered walkways.</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-extrabold text-amber-500 block text-sm">2. はさまれ・巻き込まれ</span>
                <span className="text-slate-400">19.2% of total accidents</span>
                <p className="text-slate-600 dark:text-slate-300 mt-1">Conveyor belts & cutter machines without power lockout.</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-extrabold text-rose-500 block text-sm">3. 切れ・こすれ (Cuts)</span>
                <span className="text-slate-400">10.8% of total accidents</span>
                <p className="text-slate-600 dark:text-slate-300 mt-1">Requires cut-resistant mesh gloves (くさり手袋).</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
