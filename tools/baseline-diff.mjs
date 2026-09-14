/* ============================================================================
 *  基线差异分类器 —— 重抓基线前必须先跑这个
 * ----------------------------------------------------------------------------
 *  背景：《04-构建方案.md》的硬门禁是「数字逐位不变」。
 *  但数据库扩容（补老卡、加型号）必然会改变「升级建议推荐哪块卡」这类
 *  **由数据派生的文案**，却完全不该改变任何瓦数。
 *
 *  这两件事必须能分开证明，否则「重抓基线」就会变成掩盖回归的万能借口。
 *  本工具逐字段对比旧基线，并把差异标成两类：
 *    [数字] —— subtotal / recFloor / recIdeal / 逐项功耗 / 问题码 / 项数。
 *              出现任何一条都说明计算层真的被改了，退出码 2。
 *    [文案] —— upgradeMaxGpu 这类建议字符串。允许变化，但必须在
 *              test/baseline.json 的 _revisionNote 里写清原因。
 *
 *  用法：node tools/baseline-diff.mjs        （必须在 --capture 之前跑）
 *  退出码：0 = 只有文案变化（或完全无差异）；2 = 计算值发生变化
 * ==========================================================================*/
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const require = createRequire(import.meta.url);
const engine = require(path.join(root, 'js', 'engine.js'));

const base = JSON.parse(fs.readFileSync(path.join(root, 'test', 'baseline.json'), 'utf8'));

/* 只复现 baseline.mjs 的指纹逻辑（不 import 那个文件，因为它会 process.exit） */
const mod = fs.readFileSync(path.join(root, 'tools', 'baseline.mjs'), 'utf8');
const fixturesSrc = mod.slice(mod.indexOf('const FIXTURES = {'), mod.indexOf('/* ------------------------------------------------------------- 提取指纹 --'));
const FIXTURES = eval('(' + fixturesSrc.replace(/^const FIXTURES = /, '').replace(/;\s*$/, '') + ')');

function fingerprint(cfg) {
  const r = engine.calculate(cfg);
  return {
    subtotal: r.subtotal, expected: r.expected, transient: r.transient,
    redundancy: r.redundancy, recFloor: r.recFloor, recIdeal: r.recIdeal,
    gpuWatts: r.gpuWatts, cpuWatts: r.cpuWatts,
    upgradeHeadroom: r.upgrade ? r.upgrade.headroomWatts : null,
    upgradeMaxGpu: r.upgrade ? r.upgrade.maxGpu : null,
    itemCount: r.items.length,
    items: r.items.map(i => i.label + '=' + i.watts),
    issueCodes: r.issues.map(i => i.code).sort(),
    pickWatts: {
      value: r.picks.value ? r.picks.value.watts : null,
      balanced: r.picks.balanced ? r.picks.balanced.watts : null,
      flagship: r.picks.flagship ? r.picks.flagship.watts : null
    }
  };
}

/* 这些键是「结论数字」——任何变化都必须当作计算层被改动的证据 */
const NUMERIC = new Set(['subtotal', 'expected', 'transient', 'redundancy', 'recFloor',
  'recIdeal', 'gpuWatts', 'cpuWatts', 'upgradeHeadroom', 'itemCount', 'items',
  'issueCodes', 'pickWatts']);

const diffs = [];
function walk(a, b, p) {
  if (a === b) return;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    diffs.push({ path: p, from: a, to: b });
    return;
  }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], p + '.' + k);
}

for (const [name, cfg] of Object.entries(FIXTURES)) {
  walk(base.expected[name], fingerprint(cfg), name);
}

if (!diffs.length) { console.log('✓ 无任何差异'); process.exit(0); }

const numericDiffs = diffs.filter(d => {
  const seg = d.path.split('.');
  return seg.some(s => NUMERIC.has(s));
});

console.log('差异 ' + diffs.length + ' 处：');
diffs.forEach(d => console.log('  [' + (numericDiffs.includes(d) ? '数字' : '文案') + '] ' +
  d.path + '\n      ' + JSON.stringify(d.from) + '\n   →  ' + JSON.stringify(d.to)));

console.log('\n计算值（瓦数 / 项数 / 问题码）差异: ' + numericDiffs.length);
process.exit(numericDiffs.length ? 2 : 0);
