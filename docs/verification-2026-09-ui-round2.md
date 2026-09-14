# 改版核查记录 —— ROG 皮肤第二轮（六项需求）

核查日期：2026-09-13
数据版本：`2026.09.5` → **`2026.09.6`**
涉及文件：`index.html`、`404.html`、`favicon.svg`、`assets/style.css`、
`js/db-cpus.js`、`js/db.js`、`js/db-aib.js`、`js/engine.js`、`js/app.js`、`js/ui.js`、
`tools/*`、`test/baseline.json`

需求原文（六条）：

1. 页面默认开启时要把选项收起来，供用户自行打开
2. 把图标换成 ROG 玩家国度之眼，并且 UI 整体带有 ROG 斜切文化，凸显 ROG 专为游戏而生的特点
3. 去除数据来源的这个界面，并且打开该页面时生成声明弹窗
4. 把 GPU 选择页面的声明去除，加入到弹窗当中
5. 把 CPU 选择页面同 GPU 页面一样进行分类筛选
6. 增加到 900 系到 30 系的老卡数据，关切久远硬件的参与

---

## 一、逐条落实与证据

### 1. 默认收起

`js/ui.js` 的 `ALWAYS_OPEN` 由 `[1, 2, 3]` 改为 `[]`。

- 10 张配置卡默认全部折叠，标题右侧显示 `card-summary` 已选摘要。
- `#guideCard`（使用方法）不参与编号，保持展开作为入口，避免「全收起后无从下手」。
- 折叠记忆仍然生效：用户手动展开过的卡片下次打开保持展开，**不会被强行再收起**。

证据：`browsertest.mjs` ——「默认全部收起（需求：打开页面时选项收起来）」断言
`collapsed.length === cfgCards.length`（10 / 10），以及「点开关可展开卡片」/「再点一次可收起」
双向可用。

### 2. ROG 之眼 + 斜切语言

**之眼**：新画的斜切六边形眼廓 + 倾斜瞳孔，纯内联 SVG，四处复用同一形状 ——
顶栏 `.logo .eye`、声明弹窗 `.modal-head .eye`、`favicon.svg`、`404.html`。
原来的闪电图标（含 `404.html` 里的 `⚡` emoji）已全部移除。

**斜切**：统一用 `clip-path` 实现，落实在两处：

| 类别 | 位置 |
|---|---|
| 切角容器（不可聚焦） | `.logo .eye`、`.answer-chip`（右侧六边切）、`.modal-card`（左上 + 右下切）、`.modal-head .eye`、`404.html` 的主按钮 |
| 斜切指示条（纯装饰 `::after`） | `.scenario.on`（场景选择器）、`.seg button.on`（品牌筛选）、`.reco .big`（关键数值下划条）、`.psu-pick .role`（三档电源档位标记）、`.modal-head`（弹窗标题下）、`.modal-body h3`（弹窗小标题） |

两条自制约束（写在 `style.css` 注释里，并被 `designcheck.mjs` 间接守住）：

- **斜切只切形状，不切文字**。全站零 `transform: skew` 落在文本上 ——
  `01-设计系统-ROG奥创.md` 明确禁止斜切文字。
- **不对可聚焦元素本身用 `clip-path`**。`clip-path` 会连 `:focus-visible` 的焦点环一起裁掉，
  键盘用户就看不到焦点了。所以 `button` / `a` / `input` / `select` 一律保持矩形，
  斜切改用其内部 `::after` 装饰条表达。

证据：`designcheck.mjs` 三条铁律 + 可达性全部通过；
红色用量原本因新增斜切标记涨到 34 处（预算 ≤30），
通过**删掉没被用上的 `.cut*` 工具类**（死代码）与把弹窗小标题的短棒改为灰色降回 29 处，
而不是放宽预算。

### 3 & 4. 数据来源界面 → 声明弹窗；GPU 声明移入弹窗

| 原来在哪儿 | 现在在哪儿 |
|---|---|
| 结果列末尾的 `<section class="card"><h2>数据来源</h2><ul id="sources">` | 已删除该 `<section>`；`<ul id="sources">` 原样搬进 `#disclaimerModal` |
| 顶部 `<details class="banner">数据为估算值` | 已删除；正文搬进弹窗第 1 段 |
| 显卡卡里的 `.note accent`（关于显卡适配主板） | 已删除；正文搬进弹窗第 2 段 |
| 显卡卡里的 `#aibCatalogNote`（AIC 数据可靠性声明） | 已删除该 `div`；`<div id="aibCatalogNote">` 原样搬进弹窗第 3 段 |

**关键设计决定：保留 `id="sources"` 与 `id="aibCatalogNote"`，只换父节点。**
`app.js` 是 `document.getElementById` 绑定并直接写 `innerHTML` 的，
搬家时保留 id 意味着交互层一行都不用改 —— 改动面越小，回归风险越小。

弹窗行为：

- 打开页面时自动出现（`ui.js` 的 `setupDisclaimer()`）。
- 关闭路径：右上 ×、底部「我已了解，开始使用」、点遮罩、`Esc`。
- `Tab` 焦点锁在弹窗内；打开时保存并恢复焦点；打开期间 `body.modal-open` 禁止背后滚动。
- **勾了「不再提示」才写入 localStorage**，且记的是**数据版本号**而不是布尔值 ——
  数据库升版后会重新提示一次。没勾就下次打开还会提示，声明不会被动消失。
- 顶栏新增「数据声明」按钮可随时重开。
- `role="dialog"` / `aria-modal="true"` / `aria-labelledby="dmTitle"` 挂在内层 `.modal-card` 上
  （`#disclaimerModal` 只是遮罩层）。
- 窄屏（≤640px）变成整屏抽屉。

**抑制开关**：URL 带 `?nodisclaimer=1`（或 `#nodisclaimer`）时不弹。
这是给工具链用的 —— 截图、分享图、以及其余所有回归测试都必须带它，
否则 `position: fixed` 的弹窗会盖住整页，让布局与可见性断言全部失真。
另暴露 `window.__PSU_DISCLAIMER__` 供测试直接调用。

证据：`browsertest.mjs` 新增独立段落「数据声明弹窗检查」13 条，
这一轮**故意不带** `?nodisclaimer=1`；其余各段都带，并断言抑制开关生效。

### 5. CPU 分类筛选（与 GPU 同构）

CPU 从「一个 164 项的大下拉」改成三级联动：

| 级 | 控件 | 内容 |
|---|---|---|
| ① 品牌 | `#cpuBrand` 按钮组 | Intel（102 款）/ AMD（62 款） |
| ② 系列 / 世代 | `#cpuGen` 下拉 | 按 `CPU_GEN_ORDER` 排序；带年份与款数；optgroup 分段为「当前在售 / 已停产 · 二手常见 / 未发布 / 前瞻」；另有「全部世代（N 款）」一档 |
| ③ 型号 | `#cpuSelect` 下拉 | 按世代分组，组内按 TDP 降序；标签含插槽 / TDP / 锁频 / 未发布 |

世代元数据（`db-cpus.js` 新增 `CPU_GEN_MAP` / `CPU_GEN_ORDER`，`db.js` 导出
`cpuGenOrder` / `cpuGenMeta`）给每颗 CPU 补上 `gen` / `genLabel` / `year` / `segment`，
做法与 `db.js` 里 GPU 的 `GEN_MAP` 完全一致。14 个世代：

```
cu200splus(2026) cu200s(2024) ryzen9000(2024) intel14(2023) ryzen7000(2022)
intel13(2022) intel12(2021) ryzen5000(2020) intel11(2020) intel10(2020)
ryzen3000(2019) ryzen2000(2018)   ← 以上 12 段已在库
zen6(2027, future) novalake(2027, future)
```

顺带把 **GPU 也补上了世代筛选**（`#gpuGen`），因为 66 款 GPU 塞进一个下拉同样难用，
而且需求 6 要求老卡「够得着」—— 世代下拉是让 GTX 1060 能被直接筛出来的最短路径。
所以两边现在是同一套心智模型：CPU 三级、GPU 四级（多一级 AIC 板型）。

**修掉的一个交互 bug**：初版把「筛选器与已选型号不一致时的修正」写在了
`refreshCpuCascade()` / `refreshGpuCascade()` 里，结果是 —— 用户选好 12 代 i5 之后，
再去点「Core Ultra 200S」世代，刷新函数立刻把 `S.cpuGen` 改回 `intel12`，**筛选器按不动**。
现在改为：修正只在**启动时**（`normalizeCpuFilter()` / `normalizeGpuFilter()`）
与**载入示例时**执行一次；交互期的一致性由事件处理器保证 ——
换品牌必清型号，换世代只在「已选型号掉到新范围之外」时才清。
另外给两个型号下拉加了兜底：已选型号一定出现在列表里，
绝不会出现「下拉显示请选择、引擎却已经把它算进去」的自相矛盾。

同时修掉一个同源的老问题：**点显卡品牌不再自动选中一块显卡**。
原来点「NVIDIA」会自动挑该品牌第一款（最新旗舰）并立刻计入功耗 ——
用户只是想看看有哪些型号，整机功耗却已经变成 5090 的值了。

证据：`browsertest.mjs` ——「切 AMD -> CPU 型号列表只剩 AMD」「点 CPU 品牌不自动选中型号」
「CPU 型号已选中」「点品牌不自动选中显卡」「未选型号时 AIC 下拉只有一个占位项」
「世代筛选收窄型号列表且老卡可选中」。

### 6. 补 900 系到 30 系老卡

| 指标 | 改版前 | 改版后 |
|---|---|---|
| GPU 型号 | 22 | **66** |
| GPU 世代 | 7 | **14** |
| AIC 板型 | 826 | **2427** |
| 其中已停产（`segment: 'legacy'`） | — | **45 款 GPU** |

新增的 44 款型号：

- NVIDIA：GTX 950 / 960 / 970 / 980 / 980 Ti、GTX 1050 / 1050 Ti / 1060 / 1650 /
  1660 / 1660 SUPER / 1660 Ti、GTX 1070 / 1070 Ti / 1080 / 1080 Ti、
  RTX 2060 / 2060 SUPER / 2070 / 2070 SUPER / 2080 / 2080 SUPER / 2080 Ti、
  RTX 3050 / 3060 / 3060 Ti / 3070 / 3070 Ti / 3080 / 3080 Ti / 3090 / 3090 Ti
- AMD：RX 580、RX 5700 / 5700 XT、RX 6600 / 6600 XT / 6650 XT / 6700 XT / 6750 XT、
  RX 6800 / 6800 XT / 6900 XT / 6950 XT

老卡的可见性设计（这是「关切久远硬件的参与」的落点，不是把数据塞进去就算完）：

- 世代下拉的 optgroup 分组名直接写「**已停产 · 二手常见**」；
- 型号标签带 `[已停产]`；
- 弹窗新增第 4 段「纯血老卡与二手硬件的提醒」（规则推算的功耗墙 + 老化导致功耗抖动 +
  只能买二手，建议多留一档余量）；
- README「已知限制」新增第 11 条。

**AIC 系列的 `since` 年份约束**：老卡入库后暴露出一个严重的组合爆炸问题 ——
规则生成器原本只按品牌 + TBP 区间匹配系列，于是「ROG Astral（2025 年才发布）」
会挂到 2014 年的 GTX 970 上。`db-aib.js` 的 12 个系列补上了 `since` 字段
（rog-matrix 2025、rog-astral 2025、lightning-z 2026、vanguard 2025、shadow 2025、
noctua 2022、aorus-xtreme 2020、ichill-frostbite 2020、aqua 2019、mercury 2019、
liquid-devil 2019、gaming-x 2016），`build()` 据此过滤。

已逐条验证的约束（改版时用一次性脚本核对，逻辑现由 `dataaudit.mjs` 守）：

| 组合 | 期望 | 实测 |
|---|---|---|
| GTX 970 × ROG Astral | 排除 | ✅ 排除 |
| GTX 970 × Lightning Z | 排除 | ✅ 排除 |
| RTX 3080 × ROG Astral | 排除 | ✅ 排除 |
| GTX 1060 × AQUA | 排除 | ✅ 排除 |
| ROG Astral 覆盖型号 | 恰好 8 个 50 系 | ✅ rtx5090 / 5080 / 5070ti / 5070 / 5080super / 5070tisuper / 5070super |
| ROG Strix 覆盖型号 | 跨越到老卡 | ✅ 40 个型号 |

---

## 二、计算层回归 —— 硬门禁

`04-构建方案.md` 的硬门槛是**「数字逐位不变」**。数据库扩容必然会改变
「升级建议推荐哪块卡」这类**由数据派生的文案**，但完全不该改变任何瓦数。
这两件事必须能分开证明，否则「重抓基线」就变成了掩盖回归的万能借口。

因此新增 `tools/baseline-diff.mjs`：逐字段对比旧基线，把差异标成 `[数字]` 与 `[文案]`
两类，出现 `[数字]` 就退出码 2（不许重抓）。

扩容后的实际差异：

```
差异 1 处：
  [文案] 老平台 DDR4（12 代 + B760）.upgradeMaxGpu
      "Arc A770（225W）"
   →  "GeForce RTX 4070 SUPER（220W）"

计算值（瓦数 / 项数 / 问题码）差异: 0
```

**只有 1 处差异，且落在文案类，计算值差异为 0。** 重抓后的基线在
`test/baseline.json` 的 `_revisionNote` 里记录了原因。

### 差异背后的一个真 bug

第一版扩容后，差异出现在「仅 CPU（核显办公）」那组：建议从 `Arc B580（190W）`
变成 `GeForce RTX 2070 SUPER（215W）`。

原因不是计算错了，而是引擎的升级推演写的是「预算内 TBP 最大者胜」：

```js
if (g.tbp <= gpuBudget && (!best || g.tbp > best.tbp)) best = g;
```

TBP 高 ≠ 性能好，更 ≠ 买得到。给一个 2026 年要升级显卡的人推荐 2019 年的
RTX 2070 SUPER 是坏建议。修法：**优先在当前在售的型号里挑**，
只有预算内一块在售卡都放不下时才退回老卡，并在文案里明说
「这个余量只够上已停产的老卡」。`upgrade` 结果新增 `legacyOnly` 字段，
`renderAdvice` 据此把提示从 `info` 降级为 `warn`。

---

## 三、测试结果

| 脚本 | 结果 | 退出码 |
|---|---|---|
| `node tools/baseline.mjs` | ✅ 11 / 11 组夹具数字逐位不变 | 0 |
| `node tools/baseline-diff.mjs` | ✅ 无差异（0 处计算值变化） | 0 |
| `node tools/selftest.mjs` | ✅ 189 / 189 | 0 |
| `node tools/browsertest.mjs` | ✅ 交互 144 / 144 · 单文件 11 / 11 · 部署检查全部通过（含 86 个 id 对账）· 窄屏全部通过 · 布局全部通过 · **声明弹窗 13 / 13** | 0 |
| `node tools/dataaudit.mjs` | ✅ 自洽性全部通过，仅剩 1 条既有的非阻断提醒（`air-stock-amd` 缺 Intel 插槽） | 0 |
| `node tools/designcheck.mjs` | ✅ 三条铁律 + 可达性 + 打印保障全部通过 | 0 |
| `node tools/build-standalone.mjs` | ✅ 构建成功，`dist/整机功耗计算器.html` 为最新 | 0 |
| `node tools/build-og.mjs` | ✅ 1200×630 · 72 KB · 无渐变辉光 · 无 emoji | 0 |
| `node tools/shots.mjs` | ✅ 7 张截图（空态/载入/浅色/移动端/打印/404/声明弹窗），已逐张人工核对 | 0 |
| UTF-8 完整性扫描 | ✅ 项目内所有源码与文档均为合法 UTF-8、无 BOM、无 U+FFFD（仅 `docs/asrock-gpu-models.txt` 这个原始证据文件的行尾混用 CRLF/LF，未改动） | — |

### 测试断言本身的改动（都是行为变更导致，不是"改测试让测试过"）

| 断言 | 改动 |
|---|---|
| 「默认展开前 3 张、折叠其余 7 张」 | → 「默认全部收起」（需求 1） |
| 「点开关可折叠卡片 / 再点一次可展开」 | → 反转为「点开关可展开 / 再点可收起」（默认态变了） |
| 「免责声明为默认收起的折叠条」 | → 换成弹窗三条断言（`details.banner` 已删除） |
| 「AIC 列表已填充」等 | 补上「先选型号」这一步（点品牌不再自动选卡） |
| 「`var(--rog)` 用量 ≤ 30」 | 未放宽，靠删死代码 + 弹窗小标题改灰降到 29 |
| 新增 | 弹窗 13 条、世代筛选 6 条、CPU 三级 4 条、老卡可见性 3 条、DOM id 对账 1 条 |

### 关于需求 2 里「凸显 ROG 专为游戏而生」

这一句理解为**前两个动作要达到的效果**，而不是第三个独立交付物：
之眼 + 斜切 + ROG 红本身就是 ROG 的游戏身份标识，不需要再额外贴一句口号。
所以**没有**加 "FOR THOSE WHO DARE" 这类 ROG 官方标语 ——
本工具是第三方爱好者工具，不是华硕产品，加上官方标语会模糊这层关系。
界面上表达「游戏」的方式是默认场景停在「游戏 · 重度游戏」，
以及分享卡片与页面的文案本身。

### 测试工具本身的修复

- 所有浏览器测量都改用 `?nodisclaimer=1`，否则弹窗会盖住整页。
- **`shots.mjs` 的移动端 iframe 漏了参数**：外层包装页的 `?nodisclaimer=1`
  传不进 iframe，所以第一版「移动端截图」拍到的其实是盖在弹窗上面的那一层。
  已改成 `<iframe src="_shot-loaded.html?nodisclaimer=1">`。
  —— 这个是靠**看截图**发现的，说明自动断言之外的人工核对仍然必要。
- `browsertest.mjs` 的 `srcFiles`（产物过期检测）漏了 `js/ui.js`，已补上 ——
  这个遗漏意味着只改 `ui.js` 时不会触发「产物过期」告警，会拿旧产物做冒烟测试。
- `<optgroup>` 的分组名要读 `.label`（属性），不在 `textContent` 里。
  世代下拉的「已停产 · 二手常见」是靠 optgroup label 表达的，
  初版断言用 `textContent` 所以误判为「无」。
- `shots.mjs` 增加浅色主题、404 页、声明弹窗三张截图 ——
  404 页不引外部样式表、样式全内联，是改版最容易漏掉的文件。

### 新增的结构性守卫：DOM 契约（id 对账）

`app.js` / `ui.js` 全部靠 `getElementById` 绑定，所以「JS 引用了某个 id，
但 HTML 里已经没有这个节点」是一整类会立刻炸掉页面的 bug。
本项目已经踩过两次：

- `refreshGpuCascade` 引用了不存在的 `gpu` 变量 → 整页空白、0W、下拉全空；
- 删掉「数据来源」卡片时若不同时保留 `id="sources"`，`app.js` 会直接 TypeError。

`browsertest.mjs` 的部署检查段新增静态对账：抽出 `js/app.js` 与 `js/ui.js` 里
所有 `$('x')` / `getElementById('x')` 的 id，与 `index.html` 的 `id="..."` 求差集。
当前 **86 个 id 全部对得上**。

**这条检查立刻抓到了一个真实的陈旧缺陷**：`app.js` 里写着

```js
var d = $('dbDate');
if (d) d.textContent = DB.meta.updated;   // ← 一直被 if 挡住，从没执行过
```

而 HTML 里**根本没有 `id="dbDate"`** —— 也就是说「数据截止日期」在之前的某次改版中
被从界面上删掉了，代码却留着，被 `if (d)` 静默兜住。
现在把 `dbDate` 加回了顶栏（「数据版本 2026.09.6 · 截止 2026-09-13」）——
对一个数据驱动的工具来说，数据截止日期本身就是可信度的一部分，不该消失。

---

## 四、已知遗留（本轮**没有**做）

1. **`04-构建方案.md` 的 Phase 2（数据层拆分 + 老平台扩展）与 Phase 3（向导式流程）
   依然没做**，与本轮六项需求无关，按原计划跳过。
2. **CPU 覆盖仍不含 LGA1151/1150/AM3+ 等更早平台**（见 README 已知限制第 10 条）。
   需求 6 点名的是显卡世代，CPU 侧只补到了 10 代 / Zen。
3. **单文件产物的冒烟测试里「示例配置已计算」这一条偏弱**：
   `browsertest.mjs` 的主测试与单文件测试共用同一个 `--user-data-dir`，
   主测试写入的 localStorage 会泄漏给单文件测试，所以那条断言实际验证的是
   「状态恢复」而不是「示例载入」。这是既有设计，本轮未改动，记录在此以免误判为强验证。
4. **弹窗「不再提示」的 localStorage 键与数据版本号绑定**，
   所以每次数据库升版都会再弹一次。这是有意为之（新数据 = 新的数据局限需要告知），
   但如果后续升版频繁，可能需要改成「每 N 个版本提示一次」。
