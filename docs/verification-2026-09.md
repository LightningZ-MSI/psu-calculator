# 硬件参数核查报告（最终版）

核查时间：2026-09-13
**核查范围声明**：本报告只写入"亲自打开页面确认"或"检索代理提供可引用 URL 并在表中标注来源等级"的数值。凡未确认者一律写「未找到官方数据」或「未核实」，无任何推测值。

**环境限制（导致任务 A 无法完成）**
| 受限项 | 实测结果 |
|---|---|
| intel.com 全部 products/sku 与 compare 页 | **HTTP 403**，无法读取官方 ARK |
| en.wikipedia.org / en.wikichip.org | 网络不可达 |
| msi.com | 对自动抓取返回 403（Akamai） |
| amd.com 产品页 | 可抓取，字段名 `Default TDP` |
| msi.cn / asus.com.cn / rog.asus.com.cn / gigabyte.cn | 可抓取，HTTP 200 |

---

# 任务 A：Intel 桌面处理器 PBP / MTP

## A-1 LGA1851 Core Ultra 200S 非 K

| 型号 | PBP (W) | MTP (W) | 来源 URL |
|---|---|---|---|
| Core Ultra 9 285 | 未找到官方数据 | 未找到官方数据 | [ARK 241061](https://www.intel.com/content/www/us/en/products/sku/241061/intel-core-ultra-9-processor-285-36m-cache-up-to-5-60-ghz/specifications.html)（403） |
| Core Ultra 7 265 | 未找到官方数据 | 未找到官方数据 | [ARK 241068](https://www.intel.com/content/www/us/en/products/sku/241068/intel-core-ultra-7-processor-265-30m-cache-up-to-5-30-ghz/specifications.html)（403） |
| Core Ultra 5 245 | 未找到官方数据 | 未找到官方数据 | 未取得 |
| Core Ultra 5 235 | 未找到官方数据 | 未找到官方数据 | 未取得 |
| Core Ultra 5 225 | 未找到官方数据 | 未找到官方数据 | 未取得 |
| Core Ultra 5 225F | 未找到官方数据 | 未找到官方数据 | 未取得 |

## A-2 LGA1851 Core Ultra 200S Plus

| 型号 | PBP (W) | MTP (W) | 来源 URL |
|---|---|---|---|
| Core Ultra 7 270K Plus | 未找到官方数据 | 未找到官方数据 | [Intel 新闻稿](https://www.intel.com/content/www/us/en/newsroom/news/client-computing/intel-announces-new-intel-core-ultra-200s-plus-series-desktop-processors.html)（正文仅返回导航框架，未取得） |
| Core Ultra 5 250K Plus | 未找到官方数据 | 未找到官方数据 | 同上 |
| Core Ultra 5 250KF Plus | 未找到官方数据 | 未找到官方数据 | 同上 |
| 是否还有其它 Plus 型号 | 未核实 | — | 未能读取新闻稿正文 |

## A-3 / A-4 / A-5 LGA1700 第 14 / 13 / 12 代

| 型号 | PBP (W) | MTP (W) | 来源 URL |
|---|---|---|---|
| i9-14900KS | 未找到官方数据 | 未找到官方数据 | [ARK 237504](https://www.intel.com/content/www/us/en/products/sku/237504/intel-core-i9-processor-14900ks-36m-cache-up-to-6-20-ghz/specifications.html)（403） |
| i9-14900 / i9-14900F | 未找到官方数据 | 未找到官方数据 | 未取得 |
| i7-14700 / i7-14700F | 未找到官方数据 | 未找到官方数据 | [ARK 236781](https://www.intel.com/content/www/us/en/products/sku/236781/intel-core-i7-processor-14700-33m-cache-up-to-5-40-ghz/specifications.html)（403） |
| i5-14600 / i5-14500 / i5-14400 / i5-14400F | 未找到官方数据 | 未找到官方数据 | 未取得 |
| i3-14100 / i3-14100F | 未找到官方数据 | 未找到官方数据 | 未取得 |
| Intel Processor 300 | 未找到官方数据 | 未找到官方数据 | 未取得 |
| i9-13900KS | 未找到官方数据 | 未找到官方数据 | [ARK 232167](https://www.intel.com/content/www/us/en/products/sku/232167/intel-core-i913900ks-processor-36m-cache-up-to-6-00-ghz/specifications.html)（403） |
| i9-13900 / i7-13700 | 未找到官方数据 | 未找到官方数据 | 未取得 |
| i5-13600 / i5-13500 / i5-13400 / i5-13400F | 未找到官方数据 | 未找到官方数据 | 未取得 |
| i3-13100 | 未找到官方数据 | 未找到官方数据 | 未取得 |
| i9-12900KS | 未找到官方数据 | 未找到官方数据 | [ARK 225916](https://www.intel.com/content/www/us/en/products/sku/225916/intel-core-i912900ks-processor-30m-cache-up-to-5-50-ghz/specifications.html)（403） |
| i9-12900 / i7-12700 / i5-12600 | 未找到官方数据 | 未找到官方数据 | 未取得 |
| i5-12400 / i5-12400F / i5-12490F | 未找到官方数据 | 未找到官方数据 | 未取得 |
| i3-12100 / Pentium Gold G7400 / Celeron G6900 | 未找到官方数据 | 未找到官方数据 | 未取得 |

---

# 任务 B：AMD 桌面处理器 TDP（数值取自 AMD 官方产品页 `Default TDP` 字段）

## B-1 AM5 Ryzen 9000 / 8000

| 型号 | TDP (W) | 来源 URL |
|---|---|---|
| Ryzen 9 9950X3D2 Dual Edition | **200** | https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x3d2-dual-edition.html |
| Ryzen 9 9950X3D | **170** | https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x3d.html |
| Ryzen 9 9900X3D | **120** | https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9900x3d.html |
| Ryzen 9 9950X | **170** | https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x.html |
| Ryzen 9 9900X | **120** | https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9900x.html |
| Ryzen 7 9700X | **65** | https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9700x.html |
| Ryzen 7 9800X3D | **120** | https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html |
| Ryzen 5 9600X | **65** | https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-5-9600x.html |
| Ryzen 5 9600 | **65** | https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-5-9600.html |
| Ryzen 5 9500F | **65** | https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-5-9500f.html |
| Ryzen 7 8700G | **65** | https://www.amd.com/en/products/processors/desktops/ryzen/8000-series/amd-ryzen-7-8700g.html |
| Ryzen 5 8600G | **65** | https://www.amd.com/en/products/processors/desktops/ryzen/8000-series/amd-ryzen-5-8600g.html |
| Ryzen 5 8500G | **65** | https://www.amd.com/en/products/processors/desktops/ryzen/8000-series/amd-ryzen-5-8500g.html |
| Ryzen 5 8400F | **65** | https://www.amd.com/en/products/processors/desktops/ryzen/8000-series/amd-ryzen-5-8400f.html |
| Ryzen 7 8700F | **65** | https://www.amd.com/en/products/processors/desktops/ryzen/8000-series/amd-ryzen-7-8700f.html |

## B-2 AM5 Ryzen 7000

| 型号 | TDP (W) | 来源 URL |
|---|---|---|
| Ryzen 9 7950X3D | **120** | https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7950x3d.html |
| Ryzen 9 7900X3D | **120** | https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7900x3d.html |
| Ryzen 7 7800X3D | **120** | https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7800x3d.html |
| Ryzen 9 7950X | **170** | https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7950x.html |
| Ryzen 9 7900X | **170** | https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7900x.html |
| Ryzen 9 7900 | **65** | https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7900.html |
| Ryzen 7 7700X | **105** | https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7700x.html |
| Ryzen 7 7700 | **65** | https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7700.html |
| Ryzen 5 7600X | **105** | https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7600x.html |
| Ryzen 5 7600 | **65** | https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7600.html |
| Ryzen 5 7500F | **65** | https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7500f.html |

## B-3 AM4 Ryzen 5000

| 型号 | TDP (W) | 来源 URL |
|---|---|---|
| Ryzen 9 5950X | **105** | https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-9-5950x.html |
| Ryzen 9 5900X | **105** | https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-9-5900x.html |
| Ryzen 7 5800X3D | **105** | https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-7-5800x3d.html |
| Ryzen 7 5800X | **105** | https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-7-5800x.html |
| Ryzen 5 5600X | **65** | https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600x.html |
| Ryzen 9 5900 | 未核实 | amd.com 5000-series 页面（请求持续断连） |
| Ryzen 7 5800 | 未核实 | 同上 |
| Ryzen 7 5700X3D | 未核实 | 同上 |
| Ryzen 7 5700X | 未核实 | 同上 |
| Ryzen 7 5700 | 未核实 | 同上 |
| Ryzen 5 5600X3D | 未核实 | 同上 |
| Ryzen 5 5600 | 未核实 | 同上 |
| Ryzen 5 5500 | 未核实 | 同上 |
| Ryzen 7 5700G | 未核实 | 同上 |
| Ryzen 5 5600G | 未核实 | 同上 |
| Ryzen 5 5500GT | 未核实 | 同上 |
| Ryzen 5 5600GT | 未核实 | 同上 |

## B-4 AM4 Ryzen 3000 / B-5 Ryzen 2000·1000

| 型号 | TDP (W) | 来源 URL |
|---|---|---|
| 3950X / 3900X / 3900XT / 3800X / 3800XT / 3700X / 3600X / 3600XT / 3600 / 3500X / 3300X / 3100 | 未核实 | 未取得 |
| 2700X / 2600X / 1700X / 1600 | 未核实 | 未取得 |

## B-特别确认：AM5 的 TDP → PPT 换算

| 项目 | 核查结论 | 来源 URL |
|---|---|---|
| 65W → 88W PPT | 有明确引文（原文「65W TDP 对应 88W PPT」） | https://www.c114.net.cn/industry/77090.html |
| 120W → 162W PPT | 有明确引文 | https://www.c114.net.cn/industry/77090.html |
| 105W → 142W PPT | **未找到明确引文** | — |
| 170W → 230W PPT | AMD 澄清 AM5 支持 170W TDP、插槽供电可达 230W；同源另写 170W 对应 200–230W（**存在区间矛盾**） | https://www.techpowerup.com/295301/amd-clarifies-ryzen-7000-zen-4-tdp-and-power-limits-170w-tdp-230w-ppt ；https://m.ithome.com/html/620778.htm |
| 是否为固定倍数 | AMD 官方规格页**只列 Default TDP，不列 PPT**（9800X3D 页面正文实测无 PPT 字段） | https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html |
| **9950X3D2（TDP 200W）的 PPT** | **未找到官方数据**。仅爆料称 250W PPT（较 9950X3D 高 50W），来源为爆料者 @9550pro，非官方 | 官方 TDP：https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x3d2-dual-edition.html ；爆料：https://www.c114.net.cn/industry/77090.html |
| 9950X3D 实测封装功耗参考 | 报道称实际烤机可达 246W–262W | https://www.c114.net.cn/industry/77090.html |

---

# 任务 C：AIC 厂商系列名称

## C-1 微星 MSI（中文名取自 msi.cn 页面实测）

| 系列英文名 | 官方中文名 | 覆盖 GPU 型号 | 来源 URL |
|---|---|---|---|
| Lightning / Lightning Z | 闪电 | RTX 5090 32G LIGHTNING Z（单一 SKU） | https://www.msi.com/news/detail/MSI-Unveils-the-GeForce-RTX--5090-32G-LIGHTNING-Z---The-Return-of-a-Legend--Perfectly-Built-at-CES-2026-147809 |
| SUPRIM / SUPRIM X / SUPRIM LIQUID | 超龙 | RTX 5090 D、RTX 5080 | https://www.msi.cn/Graphics-Card/GeForce-RTX-5090-D-32G-SUPRIM-OC/Overview ；https://www.msi.cn/Graphics-Card/GeForce-RTX-5080-16G-SUPRIM-SOC |
| Vanguard | 神龙 | RTX 5090 D、RTX 5080 | https://www.msi.cn/Graphics-Card/GeForce-RTX-5080-16G-VANGUARD-SOC/Overview |
| Gaming Trio / Gaming X Trio | 魔龙（白色版作「白魔龙」） | RTX 5080、RTX 5070 | https://www.msi.cn/Graphics-Card/GeForce-RTX-5080-16G-GAMING-TRIO-OC ；https://www.msi.cn/Graphics-Card/GeForce-RTX-5070-12G-GAMING-TRIO-OC-WHITE |
| Ventus | 万图师 | RTX 5080、RTX 5070 | https://www.msi.cn/Graphics-Card/GeForce-RTX-5080-16G-VENTUS-3X-OC ；https://www.msi.cn/Graphics-Card/GeForce-RTX-5070-12G-VENTUS-2X-OC |
| Shadow | 幻影师 | RTX 5080、RTX 5070 | https://www.msi.cn/Graphics-Card/GeForce-RTX-5080-16G-SHADOW-3X-OC ；https://www.msi.cn/Graphics-Card/GeForce-RTX-5070-12G-SHADOW-2X-OC |
| Inspire | 硬派师 | RTX 5080、RTX 5070 | https://www.msi.cn/Graphics-Card/GeForce-RTX-5080-16G-INSPIRE-3X-OC ；https://www.msi.cn/Graphics-Card/GeForce-RTX-5070-12G-INSPIRE-3X-OC |
| Aero (Aero ITX) | 未找到官方数据 | 未找到官方数据（msi.cn 上 AERO 产品 URL 全部 404） | — |
| Expert | 未找到官方数据 | 未找到官方数据（msi.cn 上 EXPERT 产品 URL 404） | — |
| Radeon RX 9000 | 未找到官方数据 | 未找到官方数据（msi.cn 上 RX 9070 XT 型号 URL 全部 404；仅第三方称微星不出该系列） | https://www.4gamers.com.tw/news/detail/70702/msi-not-skip-whole-amd-radeon-9000-series |
| Intel Arc | 未找到官方数据 | 无该产品线（第三方来源） | https://www.guru3d.com/story/intel-arc-b580-and-b570-graphics-cards-has-6-brands-partners-but-not-msi-asus-and/ |

### ★ MSI RTX 5090 Lightning Z 专项核查

| 项目 | 核查结论 | 来源 |
|---|---|---|
| 是否存在 | **存在**。官方型号名 `MSI GeForce RTX 5090 32G LIGHTNING Z`，CES 2026 发布，宣传语 "The Return of a Legend" | [msi.com 官方新闻稿](https://www.msi.com/news/detail/MSI-Unveils-the-GeForce-RTX--5090-32G-LIGHTNING-Z---The-Return-of-a-Legend--Perfectly-Built-at-CES-2026-147809)（本次抓取被 Akamai 403，标题与型号名来自搜索快照） |
| 独立官方产品页 URL | **未找到官方数据**（msi.com 403；msi.cn 两个候选 URL 均 404） | — |
| 供电接口 | **双 12V-2x6（DUAL 12V-2x6）** — 第三方 | https://esportstw.com/news/615291/ ；https://news.pconline.com.cn/2059/20596132.html |
| 功耗墙 / TGP | **最高可达 1000W** — 第三方 | https://esportstw.com/news/615291/ ；http://www.163.com/dy/article/KIJ3LE4L0511B8LM.html |
| 发布 / 限量 | CES 2026 发布，全球限量 1300 张 | https://diy.pconline.com.cn/2059/20593692.html |

## C-2 华硕 ASUS（中文名取自 asus.com.cn / rog.asus.com.cn）

| 系列英文名 | 官方中文名 | 覆盖 GPU 型号 | 来源 URL |
|---|---|---|---|
| ROG Matrix | 未找到官方数据（官网页面标题无中文；中文媒体称「骇客」属第三方表述） | RTX 5090 D v2（ROG-MATRIX-RTX5090DV2-P24G-30TH 纪念版） | https://rog.asus.com.cn/graphics-cards/graphics-cards/rog-matrix-series/ ；https://rog.asus.com.cn/graphics-cards/graphics-cards/rog-matrix/rog-matrix-rtx5090dv2-p24g-30th/ |
| ROG Astral | **夜神**（不是「星曜」） | RTX 5090 D（32G / LC 水冷）、RTX 5090 D v2（24G / BTF / 20 周年）、RTX 5080 | https://rog.asus.com.cn/graphics-cards/graphics-cards/rog-astral/rog-astral-rtx5090d-32g-gaming/spec/ ；https://rog.asus.com.cn/graphics-cards/graphics-cards/rog-astral-series/ |
| ROG Strix | **猛禽**（白色版作「白色版猛禽」） | 官方系列页列 RTX 5070 / 5070 Ti / 4070 / 4080 / 4060 Ti 等 | https://www.asus.com.cn/motherboards-components/graphics-cards/all-series |
| TUF Gaming | **电竞特工** | RTX 5090（TUF-RTX5090-O32G-GAMING） | https://www.asus.com.cn/motherboards-components/graphics-cards/tuf-gaming/tuf-rtx5090-o32g-gaming/ |
| Prime | **大师** | RTX 5070（PRIME-RTX5070-O12G） | https://www.asus.com.cn/motherboards-components/graphics-cards/prime/filter?Series=PRIME ；https://www.asus.com.cn/motherboards-components/graphics-cards/prime/prime-rtx5070-o12g/ |
| Dual | 无官方中文译名（官网作 DUAL 系列） | RTX 5070（DUAL-RTX5070-O12G） | https://www.asus.com.cn/motherboards-components/graphics-cards/dual/dual-rtx5070-o12g/ |
| ProArt | **创艺国度** | RTX 5080（ProArt RTX 5080 16GB GDDR7 OC） | https://www.asus.com.cn/motherboards-components/graphics-cards/proart/proart-rtx5080-o16g/ |
| Turbo | 无官方中文译名（官网作 TURBO 系列） | 官网有 TURBO 系列页；具体 RTX 50 型号未逐一核实 | https://www.asus.com.cn/motherboards-components/graphics-cards/turbo/turbo-rtx5070-12g/ |
| Noctua Edition | 未找到官方数据（官网标题仅 `RTX5080-O16G-NOCTUA`；「猫头鹰联名」属第三方表述） | RTX 5080（RTX 5080 16GB GDDR7 Noctua OC Edition） | https://www.asus.com.cn/motherboards-components/graphics-cards/asus/rtx5080-o16g-noctua/techspec/ |

## C-3 技嘉 GIGABYTE（gigabyte.cn 显卡页全英文，无任何中文系列名）

| 系列英文名 | 官方中文名 | 覆盖 GPU 型号 | 来源 URL |
|---|---|---|---|
| AORUS Xtreme（XTREME WATERFORCE） | 未找到官方数据 | RTX 5090 D（32G）、RTX 5080（16G） | https://www.gigabyte.cn/Graphics-Card/GV-N509DAORUSX-W-32GD ；https://www.gigabyte.cn/Graphics-Card/GV-N5080AORUSX-W-16GD |
| AORUS Master | 未找到官方数据 | RTX 5090 D v2（MASTER ICE 24G）、RTX 5090 D（32G）、RTX 5070（12G） | https://www.gigabyte.cn/Graphics-Card/GV-N509DAORUSM-ICE-24GD ；https://www.gigabyte.cn/Graphics-Card/GV-N509DAORUS-M-32GD |
| AORUS Elite | 未找到官方数据 | RTX 5060（ELITE 8G）；同页另有 RTX 5070/5080 INFINITY 等 AORUS 子型号 | https://www.gigabyte.cn/Graphics-Card/GeForce-RTX%E2%84%A2-5060 |
| Gaming OC | 未找到官方数据 | RTX 5070（12G）、RTX 5060（8G / V2） | https://www.gigabyte.cn/Graphics-Card/GeForce-RTX%E2%84%A2-5070 |
| Eagle | 未找到官方数据 | RTX 5070（EAGLE OC SFF / EAGLE OC ICE SFF 12G）、RTX 5060（EAGLE OC / ICE / MAX OC 8G） | 同上 |
| Windforce | 未找到官方数据 | RTX 5070（WINDFORCE SFF / OC SFF 12G）、RTX 5060（WINDFORCE MAX / MAX OC / MAX OC V2 8G） | 同上 |
| AERO | 未找到官方数据 | RTX 5070（AERO OC 12G）、RTX 5060（AERO OC 8G） | 同上 |
| AI TOP | 未找到官方数据（官网英文名即 AI TOP） | Radeon AI PRO R9700 AI TOP 32G（rev 1.0 / 1.1）；RTX 50 系列 AI TOP 型号未核实 | https://www.gigabyte.cn/Graphics-Card/GV-R9700AI-TOP-32GD-rev-10 |
| Radeon RX 9000 | 未找到官方数据 | 未找到官方数据（RX 9070 XT 系列页 404） | — |

## C-4 其余厂商

| 厂商 | 核查结论 | 来源 URL |
|---|---|---|
| 耕升 Gainward（中国区） | 中国区 RTX 50 系列名称为 炫光 (Glare) / 踏雪 / 追风 (Wind)；**Phantom≠幻影、Ghost≠幽灵 作为中国区系列名**（线索来自检索代理，本次**未能取得可引用 URL**，标为未核实） | 未核实 |
| 耕升 Gainward（全球站） | 全球站系列含 PHANTOM / PHOENIX / PANTHER / PYTHON / GHOST / PEGASUS；中文名未核实 | 未核实 |
| 七彩虹 iGame | 官方 iGame 品牌页列出 GPU 家族 5 个：Vulcan / Neptune / Kudan（九段）/ Ultra / Advanced；**未发现任何 RTX 50 系 Kudan**（线索未能取得可引用 URL，标为未核实） | 未核实 |
| 索泰 ZOTAC / 映众 INNO3D / 铭瑄 MAXSUN / 影驰 GALAX | 未核实（检索代理中途失败） | — |
| 撼讯 PowerColor / 蓝宝石 SAPPHIRE / 华擎 ASRock / 讯景 XFX / 瀚铠 VASTARMOR | 未核实（检索代理中途失败） | — |
| 蓝戟 GUNNIR / 撼与 Sparkle / 宏碁 Acer BiFrost | 未核实（检索代理中途失败） | — |

---

# 未找到官方数据 / 存在矛盾的项目

| # | 项目 | 具体说明 |
|---|---|---|
| 1 | Intel 全系 PBP/MTP | intel.com 全部 sku/compare 页返回 HTTP 403，任务 A 全表无一项核实成功 |
| 2 | Core Ultra 200S Plus 完整型号清单 | Intel 新闻稿正文未能取得，无法确认是否仅 270K/250K/250KF |
| 3 | 95W→128W 换算 | 未找到任何官方或权威引文 |
| 4 | 105W→142W 换算 | 仅间接印证（5950X/5900X/5800X/5800X3D 官方 TDP 均为 105W），未取得 PPT=142W 引文 |
| 5 | 170W 对应 PPT | **来源矛盾**：230W 与 200–230W 两种说法并存 |
| 6 | 9950X3D2 的 PPT | AMD 官方不公布 PPT；250W 属爆料（@9550pro），未获官方确认 |
| 7 | MSI RTX 5090 Lightning Z 独立产品页 URL | 官方新闻稿确认产品存在，但 msi.com 403、msi.cn 两个候选 URL 404 |
| 8 | Lightning Z 的双 12V-2x6 与 1000W | **仅第三方来源**，未能从 msi.com/msi.cn 官方规格表验证 |
| 9 | 技嘉全部系列中文名 | gigabyte.cn 完全使用英文；超级雕/大雕/小雕/魔鹰/猎鹰/风魔**均非官方用语**，无法验证 |
| 10 | MSI Aero / Expert 中文名与覆盖型号 | msi.cn 相关产品 URL 全部 404 |
| 11 | ASUS ROG Matrix 中文名 | **存在矛盾**：官网页面标题无中文；中文媒体称「骇客」属第三方 |
| 12 | ASUS Noctua Edition 中文名 | 官网标题无中文；「猫头鹰联名」属第三方 |
| 13 | AMD AM4 型号 TDP（5900/5800/5700X3D/5700X/5700/5600X3D/5600/5500/5700G/5600G/5500GT/5600GT 及全部 3000/2000/1000 系） | amd.com 请求持续断连，未取得 |
| 14 | 耕升 / 七彩虹系列名 | 线索无可引用 URL，标为未核实 |
| 15 | 索泰 / 映众 / 铭瑄 / 影驰 / PowerColor / SAPPHIRE / ASRock / XFX / VASTARMOR / GUNNIR / Sparkle / Acer | 检索代理全部中途失败，未核实 |
| 16 | 覆盖型号未逐一核实项 | MSI Vanguard 是否覆盖 5090 D 以外型号；ASUS Prime/Dual/Turbo/Noctua 完整 RTX 50 覆盖；技嘉 RTX 5080/5090 是否有 Gaming OC/Eagle/Windforce 版本 |
| 17 | 待判定库值中无法核实者 | Core Ultra 7 270K Plus 125W/250W、Core Ultra 5 250K Plus 125W/159W（**159W 在任何来源中均未出现，建议人工复核**）、i9-14900K、i9-13900K、i9-12900K、i5-12400F、i9-11900K、i9-10900K、Ryzen 5 3600、Ryzen 5 3600X 95W/128W 全部未核实 |
| 18 | 已核实为正确的库值 | Ryzen 9 9950X3D2 TDP=200W、Ryzen 9 5950X TDP=105W、Ryzen 5 5600X TDP=65W、Ryzen 7 5800X3D TDP=105W（均为 AMD 官方页） |
