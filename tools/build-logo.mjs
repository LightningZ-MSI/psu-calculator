/* ============================================================================
 *  品牌标识提取 —— 从华硕 ROG 官方 logo 图里切出「玩家国度之眼」与字标
 * ----------------------------------------------------------------------------
 *  为什么要有这个工具：
 *    页面上原来那个「之眼」是凭印象手画的近似图形（六边形外框 + 三角形瞳孔），
 *    和真正的 ROG 之眼差得很远。手描一个形状复杂的商标不可能描准，
 *    所以改成从官方 logo 图里**把图形切出来**，而不是继续凭印象画。
 *
 *  源图用的是官方「纵向锁定版」：上方是图形本体，下方是 REPUBLIC OF GAMERS 字标。
 *  字标是定制字形，网页字体里没有，只能用图 —— 所以两张图分别产出，
 *  再由 CSS 按需要拼成横向或纵向锁定版。
 *
 *  做法（工具链都是本地已有的，不装任何依赖）：
 *    1. 把源图以 data URI 内联进一个探针页（data URI 同源，canvas 不会被污染）
 *    2. 用 canvas 读像素取 alpha：
 *         官方 logo 图本身带透明通道 → 直接用 A 通道
 *         （若换成白底不透明的图，自动退回「红墨覆盖度 α = 255 − G」，
 *           白底上红墨  G = (1-α)·255 → α = 255 − G，对任意红色都精确）
 *    3. 行投影找出「图形」与「字标」之间的最大空白带，据此把两者切开
 *    4. 各自裁到外接框，重着色为 --rog 的 #ff0033，双线性缩放后输出 PNG
 *
 *  产物：
 *    · assets/rog-eye.png       图形本体（256px 宽）
 *    · assets/rog-wordmark.png  REPUBLIC OF GAMERS 两行字标（340px 宽）
 *    · favicon.svg              自包含：内嵌一张 72px 的图形 PNG
 *    · 404.html                把图标与两张图都填成 data URI（该页必须完全自包含）
 *
 *  用法：node tools/build-logo.mjs [源图路径]
 * ==========================================================================*/
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const EDGE = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
].find(p => fs.existsSync(p));
if (!EDGE) { console.error('未找到 Edge，无法运行像素处理'); process.exit(1); }

/* 源图：官方纵向锁定版（图形在上、REPUBLIC OF GAMERS 字标在下） */
const SRC = process.argv[2] ||
  'C:\\Users\\yao08\\.dsh\\attachments\\v1\\objects\\53\\5378a22143f0d96bda9e14f7f574ed28a62a6d6ecae3eaec23b72f9f17faeb4c';
if (!fs.existsSync(SRC)) { console.error('源图不存在: ' + SRC); process.exit(1); }

/* 输出宽度：顶栏里图形显示约 30px、字标约 96px，给到这个倍数足够覆盖高 DPI。 */
const EYE_W = 256;
const WORD_W = 340;
const FAV_W = 72;
/* 404 页专用的小尺寸（该页要完全自包含，data URI 越短越好） */
const MID_EYE_W = 128;
const MID_WORD_W = 224;
const ROG_RED = [0xff, 0x00, 0x33];

const srcB64 = fs.readFileSync(SRC).toString('base64');
/* 源图是 WebP，没有扩展名时 <img> 认不出来，显式声明 MIME */
const dataUri = 'data:image/webp;base64,' + srcB64;

const probe = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>
<pre id="OUT">working</pre>
<script>
var img = new Image();
img.onload = function () {
  try {
    var W = img.naturalWidth, H = img.naturalHeight;
    var c = document.createElement('canvas');
    c.width = W; c.height = H;
    var g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    var d = g.getImageData(0, 0, W, H).data;

    /* ① 取 alpha */
    var transparent = 0;
    for (var t = 3; t < W * H * 4; t += 4) if (d[t] < 250) transparent++;
    var hasAlpha = transparent > (W * H) * 0.05;

    var A = new Uint8Array(W * H);
    for (var i = 0, p = 0; i < W * H; i++, p += 4) {
      var a = hasAlpha ? d[p + 3] : (255 - d[p + 1]);
      A[i] = a < 8 ? 0 : a;   // 压掉压缩噪点
    }

    function rectOf(y0, y1) {
      var minX = W, maxX = -1, minY = H, maxY = -1;
      for (var y = y0; y <= y1; y++) {
        for (var x = 0; x < W; x++) {
          if (A[y * W + x] > 0) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX < 0) return null;
      return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
    }

    /* ② 行投影：找出所有「有墨」的横带，再按最大的空白带把图形与字标分开 */
    var rowInk = new Int32Array(H);
    for (var y2 = 0; y2 < H; y2++) {
      var s = 0;
      for (var x2 = 0; x2 < W; x2++) s += A[y2 * W + x2];
      rowInk[y2] = s;
    }
    var bands = [], inb = false, st = 0;
    for (var y3 = 0; y3 < H; y3++) {
      if (rowInk[y3] > 0 && !inb) { inb = true; st = y3; }
      else if (rowInk[y3] === 0 && inb) { inb = false; bands.push([st, y3 - 1]); }
    }
    if (inb) bands.push([st, H - 1]);

    var gapBest = null;
    for (var k = 1; k < bands.length; k++) {
      var gw = bands[k][0] - bands[k - 1][1] - 1;
      if (gw > H * 0.01 && (!gapBest || gw > gapBest.w)) {
        gapBest = { w: gw, mid: (bands[k - 1][1] + bands[k][0]) / 2, at: k };
      }
    }
    /* 切点：最大空白带的正中。它上方是图形，下方是字标（含两行） */
    var split = gapBest ? Math.round(gapBest.mid) : Math.round(H * 0.5);

    var eyeRect = rectOf(0, split - 1);
    var wordRect = rectOf(split, H - 1);

    /* ③ 重着色 + 双线性重采样 */
    function render(rect, targetW) {
      var scale = targetW / rect.w;
      var ow = targetW, oh = Math.max(1, Math.round(rect.h * scale));
      var o = document.createElement('canvas');
      o.width = ow; o.height = oh;
      var og = o.getContext('2d');
      var od = og.createImageData(ow, oh);
      for (var oy = 0; oy < oh; oy++) {
        for (var ox = 0; ox < ow; ox++) {
          var sx = rect.x + ox / scale, sy = rect.y + oy / scale;
          var x0 = Math.floor(sx), y0 = Math.floor(sy);
          var fx = sx - x0, fy = sy - y0;
          function at(px, py) {
            if (px < 0 || py < 0 || px >= W || py >= H) return 0;
            return A[py * W + px];
          }
          var v =
            at(x0, y0) * (1 - fx) * (1 - fy) +
            at(x0 + 1, y0) * fx * (1 - fy) +
            at(x0, y0 + 1) * (1 - fx) * fy +
            at(x0 + 1, y0 + 1) * fx * fy;
          var q = (oy * ow + ox) * 4;
          od.data[q] = ${ROG_RED[0]}; od.data[q + 1] = ${ROG_RED[1]};
          od.data[q + 2] = ${ROG_RED[2]}; od.data[q + 3] = Math.max(0, Math.min(255, Math.round(v)));
        }
      }
      og.putImageData(od, 0, 0);
      return { w: ow, h: oh, uri: o.toDataURL('image/png') };
    }

    var eye = render(eyeRect, ${EYE_W});
    var word = render(wordRect, ${WORD_W});
    var fav = render(eyeRect, ${FAV_W});
    /* 404 页要显示纵向锁定版，但不需要顶栏那么高的分辨率。
       单独出一组小图，避免把 26KB 的 data URI 塞进一个错误页。 */
    var eyeMid = render(eyeRect, ${MID_EYE_W});
    var wordMid = render(wordRect, ${MID_WORD_W});

    var out = [
      'SRC=' + W + 'x' + H,
      'HAS_ALPHA=' + hasAlpha + ' (透明像素 ' + (transparent / (W * H) * 100).toFixed(1) + '%)',
      'BANDS=' + bands.length + ' ' + bands.map(function (b) { return b[0] + '-' + b[1]; }).join(' '),
      'WIDEST_GAP=' + (gapBest ? gapBest.w : 0) + 'px @y=' + split,
      'EYE_RECT=' + eyeRect.x + ',' + eyeRect.y + ' ' + eyeRect.w + 'x' + eyeRect.h,
      'WORD_RECT=' + wordRect.x + ',' + wordRect.y + ' ' + wordRect.w + 'x' + wordRect.h,
      'EYE_OUT=' + eye.w + 'x' + eye.h,
      'WORD_OUT=' + word.w + 'x' + word.h,
      'EYE_URI=' + eye.uri,
      'WORD_URI=' + word.uri,
      'EYE_MID_URI=' + eyeMid.uri,
      'WORD_MID_URI=' + wordMid.uri,
      'FAV_URI=' + fav.uri,
      'FAV_WH=' + fav.w + 'x' + fav.h
    ].join('\\n');
    document.getElementById('OUT').textContent = out;
  } catch (e) {
    document.getElementById('OUT').textContent = 'ERR=' + e.message;
  }
};
img.onerror = function () { document.getElementById('OUT').textContent = 'ERR=图片解码失败'; };
img.src = ${JSON.stringify(dataUri)};
<\/script></body></html>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'logo-'));
const probePath = path.join(tmp, 'probe.html');
fs.writeFileSync(probePath, probe, 'utf8');

const dom = execFileSync(EDGE, [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  '--allow-file-access-from-files',
  '--user-data-dir=' + path.join(tmp, 'p'),
  '--window-size=400,300', '--virtual-time-budget=15000', '--dump-dom',
  'file:///' + probePath.replace(/\\/g, '/')
], { encoding: 'utf8', maxBuffer: 120 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
fs.rmSync(tmp, { recursive: true, force: true });

const m = /<pre id="OUT">([\s\S]*?)<\/pre>/.exec(dom);
if (!m) { console.error('未取到处理结果'); process.exit(1); }
const text = m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
if (/^ERR=/m.test(text)) { console.error(text); process.exit(1); }

const line = k => text.split('\n').find(l => l.startsWith(k + '='));
/* b64Of 给 favicon 里内嵌的 <image href> 用（那一处要的是纯 base64）；
   uriOf 给 <img src> / CSS url() 用（要完整 data URI）。
   两者混用会让 src 变成一串裸 base64 —— 图片静默加载失败，只显示 alt 文字。 */
const b64Of = k => line(k).slice(k.length + 1).replace(/^data:image\/png;base64,/, '');
const uriOf = k => 'data:image/png;base64,' + b64Of(k);

console.log('ROG 品牌标识提取');
console.log('─'.repeat(58));
text.split('\n').forEach(l => {
  if (/^(EYE|WORD|FAV)_(MID_)?URI=/.test(l)) return;
  console.log('  ' + l);
});

/* 表意清楚：万一切点找错（比如把字标切进图形里），这里要能立刻看出来 */
const eyeRect = line('EYE_RECT').slice(9).split(' ')[1].split('x').map(Number);
const wordRect = line('WORD_RECT').slice(10).split(' ')[1].split('x').map(Number);
if (eyeRect[0] < 100 || wordRect[0] < 100) {
  console.error('\n✗ 切分异常：图形或字标的宽度过小（' + eyeRect[0] + ' / ' + wordRect[0] + '），' +
                '最大空白带可能不是图形与字标之间的那条');
  process.exit(1);
}

const eyeBuf = Buffer.from(b64Of('EYE_URI'), 'base64');
const wordBuf = Buffer.from(b64Of('WORD_URI'), 'base64');
const favB64 = b64Of('FAV_URI');
const favWH = line('FAV_WH').slice(7).split('x').map(Number);

/* 只在内容真的变了才写盘。
   无条件重写会刷新 mtime，而 browsertest 用 mtime 判断「单文件产物是否过期」——
   于是「跑一次 build-logo」会把本来最新的 dist 判成过期，构建流水线出现假失败。
   反正产物是确定性的，比一下字节就好。 */
function writeIfChanged(p, buf, label) {
  const old = fs.existsSync(p) ? fs.readFileSync(p) : null;
  if (old && Buffer.compare(old, Buffer.from(buf)) === 0) {
    console.log('  ' + label + ' 未变化，跳过写入');
    return false;
  }
  fs.writeFileSync(p, buf);
  console.log('  ' + label + ' 已更新');
  return true;
}

writeIfChanged(path.join(root, 'assets', 'rog-eye.png'), eyeBuf,
  'rog-eye.png      ' + (eyeBuf.length / 1024).toFixed(1) + ' KB');
writeIfChanged(path.join(root, 'assets', 'rog-wordmark.png'), wordBuf,
  'rog-wordmark.png ' + (wordBuf.length / 1024).toFixed(1) + ' KB');

/* ------------------------------------------------------------------ favicon --
   自包含：把 72px 的小图 base64 内嵌进 SVG。这样 favicon 不依赖任何外部文件，
   单文件版构建时把它当普通 SVG 内联即可，不必再额外处理一张 PNG。 */
const FAV_BOX = 64;
const drawW = 56;
const drawH = +(drawW * favWH[1] / favWH[0]).toFixed(2);
const favSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FAV_BOX} ${FAV_BOX}" role="img" aria-label="台式机功耗计算器">
  <!-- ROG 玩家国度之眼（取自华硕官方 logo 图的图形本体）。
       由 tools/build-logo.mjs 生成，请勿手改；改图请改源图后重新运行该脚本。 -->
  <rect width="${FAV_BOX}" height="${FAV_BOX}" fill="#121212"/>
  <image x="${(FAV_BOX - drawW) / 2}" y="${((FAV_BOX - drawH) / 2).toFixed(2)}"
         width="${drawW}" height="${drawH}"
         href="data:image/png;base64,${favB64}"/>
</svg>
`;
writeIfChanged(path.join(root, 'favicon.svg'), favSvg,
  'favicon.svg      ' + (Buffer.byteLength(favSvg) / 1024).toFixed(1) + ' KB' +
  '（内嵌 ' + favWH.join('x') + ' PNG，自包含）');

/* ------------------------------------------------------------------- 404 --
   404 页必须完全自包含，所以把图标与两张图都以 data URI 填进去。
   但该页要显示的是**纵向锁定版**（图形在上、字标在下），所以用两张图拼。
   浏览器解析器对超长 data URI 的容忍度已在第三轮踩过坑，
   因此这里两张图都用小尺寸版本（图形 72px、字标 132px），控制总量。

   为了重复运行不出错：**按元素身份定位，而不是按占位符/数据的形状定位**。
   按形状定位有个坑：如果上一次跑出来的是坏的（比如 src 里只有裸 base64），
   正则就匹配不上，工具既修不好、又不会报错地留下坏文件。
   按 `class="eye"` / `class="wordmark"` / `rel="icon"` 定位则可以自我修复。 */
const favUri = 'data:image/svg+xml;base64,' + Buffer.from(favSvg, 'utf8').toString('base64');

const p404 = path.join(root, '404.html');
let h404 = fs.readFileSync(p404, 'utf8');
let filled = 0;

/* ⚠️ 必须**依次**在当前结果上替换。
   写成「先用同一个基准串算出三份结果、再逐份赋回」是错的 ——
   那样只有最后一份生效，前面两处会被静默丢弃
   （这次的症状就是 favicon 与图形没被填上，只有一个字标是对的）。 */
function swapAttr(re, value, tag) {
  let hit = false;
  h404 = h404.replace(re, (m, pre, post) => {
    hit = true; filled++;
    return pre + value + post;
  });
  if (!hit) {
    console.error('\n✗ 404.html 里找不到「' + tag + '」对应的标签，无法填充');
    process.exit(1);
  }
}

swapAttr(/(<link[^>]*rel="icon"[^>]*\bhref=")[^"]*(")/, favUri, 'favicon');
swapAttr(/(<img[^>]*\bclass="eye"[^>]*\bsrc=")[^"]*(")/, uriOf('EYE_MID_URI'), '图形');
swapAttr(/(<img[^>]*\bclass="wordmark"[^>]*\bsrc=")[^"]*(")/, uriOf('WORD_MID_URI'), '字标');

if (filled !== 3) {
  console.error('\n✗ 404.html 里替换了 ' + filled + ' 处（应为 3 处：favicon + 图形 + 字标）');
  process.exit(1);
}
if (/__ROG_(FAVICON|EYE|WORDMARK)_URI__/.test(h404)) {
  console.error('\n✗ 404.html 里仍有未填充的占位符');
  process.exit(1);
}
writeIfChanged(p404, h404,
  '404.html         图标 + 图形 + 字标已内联（' +
  (Buffer.byteLength(h404) / 1024).toFixed(1) + ' KB）');

/* ------------------------------------------------------------------ 自检 --
   内联最容易犯的错是「把纯 base64 当成 data URI 塞进 src」——
   浏览器不会报错，只会静默失败、显示 alt 文字。
   所以把生成结果再解回来验一遍。 */
const selfChecks = [];
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const imgs = [...h404.matchAll(/<img[^>]*\bsrc="([^"]+)"[^>]*>/g)].map(m => m[1]);
selfChecks.push(['404 页有两张标志图（图形 + 字标）', imgs.length === 2, imgs.length + ' 张']);
imgs.forEach((src, i) => {
  const okUri = src.startsWith('data:image/png;base64,');
  const buf = Buffer.from(src.replace(/^data:[^,]*,/, ''), 'base64');
  selfChecks.push(['404 第 ' + (i + 1) + ' 张图是完整 data URI', okUri,
    okUri ? '' : 'src 只有裸 base64（会静默加载失败）']);
  selfChecks.push(['404 第 ' + (i + 1) + ' 张图能解出合法 PNG',
    buf.slice(0, 8).equals(PNG_SIG), buf.length + ' bytes']);
});
const favHref = (/<link[^>]+rel="icon"[^>]+href="([^"]+)"/.exec(h404) || [])[1] || '';
selfChecks.push(['404 favicon 是 data URI', favHref.startsWith('data:image/svg+xml;base64,')]);
/* 顶栏与弹窗用的两张 mask 图必须存在且非空 */
[['assets/rog-eye.png', 3000], ['assets/rog-wordmark.png', 1500]].forEach(([f, min]) => {
  const st = fs.statSync(path.join(root, f));
  selfChecks.push([f + ' 体积合理', st.size > min, (st.size / 1024).toFixed(1) + ' KB']);
});
selfChecks.push(['404 无残留占位符', !/__ROG_/.test(h404)]);

const selfFailed = selfChecks.filter(c => !c[1]);
selfChecks.forEach(c => console.log('  ' + (c[1] ? '✓' : '✗') + ' ' + c[0] + (c[2] ? '  [' + c[2] + ']' : '')));
if (selfFailed.length) {
  console.error('\n✗ ' + selfFailed.length + ' 项自检失败');
  process.exit(1);
}

console.log('\n✓ 已写入 assets/rog-eye.png、assets/rog-wordmark.png、favicon.svg，并更新 404.html');
