const fs = require('fs');

console.log('Building merged index.html v2...');

// Normalize line endings to LF so multi-line string replacements work reliably
const v1 = fs.readFileSync('visit1.html', 'utf8').replace(/\r\n/g, '\n');
const v2 = fs.readFileSync('visit2.html', 'utf8').replace(/\r\n/g, '\n');

// ===== 1. Extract v2-specific parts =====

// V2 CSS additions (from pot-slot to v2-close-all hover)
const cssStart = v2.indexOf('.pot-slot {');
const cssEnd = v2.indexOf('</style>', v2.indexOf('#v2-close-all:hover { background: var(--blue-deep); }'));
// Also rename character selectors in v2cssLower to -v2 suffix to avoid overriding V1 definitions
const v2cssLower = v2.substring(cssStart, cssEnd)
  .replace(/#zhao-area\b/g, '#zhao-area-v2')
  .replace(/#zhao-back\b/g, '#zhao-back-v2')
  .replace(/#zhao-face\b/g, '#zhao-face-v2')
  .replace(/#zhao-hand\b/g, '#zhao-hand-v2')
  .replace(/#player-area\b/g, '#player-area-v2')
  .replace(/#player-normal\b/g, '#player-normal-v2')
  .replace(/#player-smile\b/g, '#player-smile-v2')
  .replace(/#lin-area\b/g, '#lin-area-v2')
  .replace(/#lin-sprite\b/g, '#lin-sprite-v2');

// V2 character CSS already included in v2cssLower (with -v2 suffix rename applied above)

// V2 HTML additions from body
const bodyStart = v2.indexOf('<body>');
const bodyEnd = v2.indexOf('<script>');
const v2body = v2.substring(bodyStart, bodyEnd);

// Helper: extract a block between two comment markers
function extractBlock(html, startComment, endComment) {
  const start = html.indexOf(startComment);
  if (start < 0) return '';
  const end = html.indexOf(endComment, start + startComment.length);
  if (end < 0) return '';
  return html.substring(start, end).trim();
}

// Extract V2 character HTML (zhao layers + lin + player layers)
// Use -v2 suffix IDs to avoid conflicting with V1 img-based character layers
const v2zhaoHtml = extractBlock(v2body, '<!-- 赵奶奶 -->', '<!-- 林姐 -->')
  .replace(/id="zhao-area"/g, 'id="zhao-area-v2"')
  .replace(/id="zhao-back"/g, 'id="zhao-back-v2"')
  .replace(/id="zhao-face"/g, 'id="zhao-face-v2"')
  .replace(/id="zhao-hand"/g, 'id="zhao-hand-v2"');
const v2linHtml = extractBlock(v2body, '<!-- 林姐 -->', '<!-- 主角 -->')
  .replace(/id="lin-area"/g, 'id="lin-area-v2"')
  .replace(/id="lin-sprite"/g, 'id="lin-sprite-v2"');
const v2playerHtml = extractBlock(v2body, '<!-- 主角 -->', '<!-- 工具盒 -->')
  .replace(/id="player-area"/g, 'id="player-area-v2"')
  .replace(/id="player-normal"/g, 'id="player-normal-v2"')
  .replace(/id="player-smile"/g, 'id="player-smile-v2"');
const v2potsHtml = extractBlock(v2body, '<!-- 一盆花 -->', '<!-- 记忆闪回层 -->');
const v2toolsHtml = extractBlock(v2body, '<!-- 工具盒 -->', '<!-- ===== 探访二');
const fnMatch = v2body.match(/<div id="field-notes-detail">[\s\S]*?<\/div>\s*\n\s*<!-- 工作证详情/);
const widMatch = v2body.match(/<div id="work-id-detail">[\s\S]*?<\/div>\s*\n\s*<!-- 未寄出的信/);
const letterMatch = v2body.match(/<div id="letter-detail">[\s\S]*?<\/div>\s*\n\s*<!-- 全部查看完毕/);

const v2fnHtml = fnMatch ? fnMatch[0].replace(/\n\s*<!-- 工作证详情$/, '') : '';
const v2widHtml = widMatch ? widMatch[0].replace(/\n\s*<!-- 未寄出的信$/, '') : '';
const v2letterHtml = letterMatch ? letterMatch[0].replace(/\n\s*<!-- 全部查看完毕$/, '') : '';

// V2 JS: extract from startVisit2 to end of Game object
const v2scriptStart = v2.indexOf('<script>');
const v2scriptEnd = v2.indexOf('</script>', v2scriptStart);
const v2js = v2.substring(v2scriptStart + '<script>'.length, v2scriptEnd);

// Find all methods from "探访二" section to the closing "};" of Game
const v2methodsStart = v2js.indexOf('//  探访二 · 标本盒');
if (v2methodsStart < 0) {
  console.error('Could not find v2 methods section!');
  process.exit(1);
}
// Find the "};" that closes the Game object (before init code)
// Handle both CRLF and LF line endings
const rf = v2js.lastIndexOf('\r\n};\r\n');
const lf = v2js.lastIndexOf('\n};\n');
const lastGameClose = rf >= 0 ? rf : lf;
if (lastGameClose < 0) {
  console.error('Could not find Game closing!');
  process.exit(1);
}
const v2methods = v2js.substring(v2methodsStart, lastGameClose);

console.log('v2 methods:', v2methods.length, 'chars');

// ===== 2. Build merged file from v1 template =====

// Start with v1
let merged = v1;

// ----- CSS: append v2 styles before </style> -----
const styleCloseIdx = merged.indexOf('</style>');

let cssInsert = '\n\n/* ===== V2新增 ===== */\n' + v2cssLower
  + '\n/* 合并版：V2花盆默认隐藏 */\n.pot-slot { display: none !important; }\n'
  + '\n/* 合并版：V1 img角色层不被对话框遮挡、位置恢复 */\n#zhao-area, #player-area { z-index: 16 !important; bottom: 160px !important; }\n'
  + '\n/* 合并版：V2 CSS层角色移到对话框上方（下方不留缝隙） */\n#zhao-area-v2, #player-area-v2, #lin-area-v2 { z-index: 16 !important; bottom: 160px !important; }\n'
  + '\n/* 合并版：隐藏左下角手掌UI，仅在伸手动画时显示 */\n#zhao-hand-v2 { display: none !important; }\n#zhao-hand-v2.reaching { display: block !important; opacity: 1; }\n';
merged = merged.substring(0, styleCloseIdx) + cssInsert + '\n' + merged.substring(styleCloseIdx);

// ----- Title -----
merged = merged.replace(
  '<title>勿忘我 · 赵奶奶篇 · 探访一</title>',
  '<title>勿忘我 · 赵奶奶篇</title>'
);

// ----- HTML: insert V2 elements -----

// Insert character layers before the img-based zhao-area
const charInsertMarker = '  <!-- 角色立绘 -->';
const charHtml = '\n  <!-- ===== V2: CSS层角色 ===== -->\n' 
  + '  <!-- 赵奶奶 -->\n' + v2zhaoHtml + '\n'
  + '  <!-- 林姐 -->\n' + v2linHtml + '\n'
  + '  <!-- 主角 -->\n' + v2playerHtml + '\n'
  + '\n  <!-- ===== V1: IMG角色 ===== -->\n';
merged = merged.replace(charInsertMarker, charHtml + '  <!-- V1角色立绘 -->');

// Insert pot slots, tools before v2-scene  
const v2sceneMarker = '    <!-- ===== 探访二 · 标本盒 场景元素 ===== -->';
const sceneHtml = '\n    <!-- V2: 三盆花 -->\n    ' + v2potsHtml.replace(/\n/g, '\n    ') + '\n\n'
  + '    <!-- V2: 工具盒 -->\n    ' + v2toolsHtml.replace(/\n/g, '\n    ') + '\n'
  + '\n    ' + v2sceneMarker.trim();
merged = merged.replace(v2sceneMarker, sceneHtml);

// Replace field-notes-detail
const fnOldStart = merged.indexOf('<div id="field-notes-detail">');
const fnOldEnd = merged.indexOf('<!-- 工作证详情 -->');
if (fnOldStart >= 0 && fnOldEnd >= 0) {
  merged = merged.substring(0, fnOldStart) + v2fnHtml + '\n      <!-- 工作证详情 -->'
    + merged.substring(fnOldEnd + '<!-- 工作证详情 -->'.length);
}

// Replace work-id-detail
const widOldStart = merged.indexOf('<div id="work-id-detail">');
// Find the real start of old work-id (may be after the comment)
const widOldEnd = merged.indexOf('<!-- 未寄出的信详情 -->');
if (widOldStart >= 0 && widOldEnd >= 0) {
  merged = merged.substring(0, widOldStart) + v2widHtml + '\n      <!-- 未寄出的信详情 -->'
    + merged.substring(widOldEnd + '<!-- 未寄出的信详情 -->'.length);
}

// Replace letter-detail
const ltOldStart = merged.indexOf('<div id="letter-detail">');
const ltOldEnd = merged.indexOf('<!-- 全部查看完毕按钮 -->');
if (ltOldStart >= 0 && ltOldEnd >= 0) {
  merged = merged.substring(0, ltOldStart) + v2letterHtml + '\n      <!-- 全部查看完毕按钮 -->'
    + merged.substring(ltOldEnd);
}

// ----- JS modifications -----

// 1. Add v2 state vars
merged = merged.replace(
  'v2LabelStabilized: false,',
  `v2LabelStabilized: false,
  v2LabelReady: false,
  v2FieldNotesPage: 1,
  v2FieldNotesMaxPage: 7,
  v2FieldNotesBusy: false,
  v2FieldNotesAllFlipped: false,
  v2SpecimenComplete: false,`
);

// 2. Add cacheDom entries (V2 layers use -v2 suffix to avoid conflicting with V1 img layers)
merged = merged.replace(
  "this.el.zhaoSprite = $('zhao-sprite');\n    this.el.playerSprite = $('player-sprite');",
  `this.el.zhaoSprite = $('zhao-sprite');
    this.el.zhaoAreaV2  = $('zhao-area-v2');
    this.el.zhaoBackV2  = $('zhao-back-v2');
    this.el.zhaoFaceV2  = $('zhao-face-v2');
    this.el.zhaoHandV2  = $('zhao-hand-v2');
    this.el.linAreaV2   = $('lin-area-v2');
    this.el.playerAreaV2 = $('player-area-v2');
    this.el.playerNormalV2 = $('player-normal-v2');
    this.el.playerSmileV2 = $('player-smile-v2');
    this.el.toolBox     = $('tool-box');
    this.el.stickV2     = $('bamboo-stick');
    this.el.playerSprite = $('player-sprite');`
);

// 4. Add exp/startCb support in _showNextInQueue
const showNextOld = `    // 处理表情立绘
    const exprMap = {
      '赵奶奶立绘-背影.png': '赵奶奶立绘-背影（透明）.png',
      '赵奶奶立绘-正常表情.png': '赵奶奶立绘-正常表情（透明）.png',
      '赵奶奶立绘-悲伤.png': '赵奶奶立绘-悲伤（透明）.png',
      '赵奶奶立绘-微笑.png': '赵奶奶立绘-正常表情（透明）.png',
      '主角（我）正面立绘.png': '主角（我）正面立绘（透明）.png',
    };
    if (entry.zhaoExpr) {
      this.el.zhaoSprite.src = 'assets/zhao/' + (exprMap[entry.zhaoExpr] || entry.zhaoExpr);
      this.el.zhaoArea.classList.remove('hidden');
    }
    if (entry.playerExpr) {
      this.el.playerSprite.src = 'assets/zhao/' + (exprMap[entry.playerExpr] || entry.playerExpr);
      this.el.playerArea.classList.remove('hidden');
    }`;

const showNextNew = `    // 支持v2的exp格式
    if (entry.exp) {
      if (entry.exp.zhao) this.setZhaoExpression(entry.exp.zhao);
      if (entry.exp.player) this.setPlayerExpression(entry.exp.player);
    }
    // 处理表情立绘（v1方式）
    const exprMap = {
      '赵奶奶立绘-背影.png': '赵奶奶立绘-背影（透明）.png',
      '赵奶奶立绘-正常表情.png': '赵奶奶立绘-正常表情（透明）.png',
      '赵奶奶立绘-悲伤.png': '赵奶奶立绘-悲伤（透明）.png',
      '赵奶奶立绘-微笑.png': '赵奶奶立绘-正常表情（透明）.png',
      '主角（我）正面立绘.png': '主角（我）正面立绘（透明）.png',
    };
    if (entry.zhaoExpr) {
      this.el.zhaoSprite.src = 'assets/zhao/' + (exprMap[entry.zhaoExpr] || entry.zhaoExpr);
      this.el.zhaoArea.classList.remove('hidden');
    }
    if (entry.playerExpr) {
      this.el.playerSprite.src = 'assets/zhao/' + (exprMap[entry.playerExpr] || entry.playerExpr);
      this.el.playerArea.classList.remove('hidden');
    }`;

merged = merged.replace(showNextOld, showNextNew);

// 5. Add startCb
const startCbOld = `    // 打字机效果
    this.typeText(entry.text, entry.speed || 50, () => {`;
const startCbNew = `    // v2入口回调
    if (entry.startCb) entry.startCb();
    // 打字机效果
    this.typeText(entry.text, entry.speed || 50, () => {`;
merged = merged.replace(startCbOld, startCbNew);

// 6. Add lin speaker
merged = merged.replace(
  "      case 'player':\n          name.textContent = '我';\n          this.el.playerArea.classList.remove('hidden');\n          this.el.zhaoArea.classList.add('hidden');\n          break;\n      }",
  `      case 'player':
          name.textContent = (this.currentVisit >= 2) ? '你' : '我';
          this.el.playerArea.classList.remove('hidden');
          this.el.zhaoArea.classList.add('hidden');
          break;
        case 'lin':
          name.textContent = '林姐';
          if (this.el.linArea) this.el.linArea.classList.remove('hidden');
          this.el.zhaoArea.classList.add('hidden');
          this.el.playerArea.classList.add('hidden');
          break;
      }`
);

// 7. Add setZhaoExpression/setPlayerExpression BEFORE playAnimation
const exprInsert = `

  setZhaoExpression(exp) {
    if (!exp) return;
    const area = this.el.zhaoAreaV2;
    if (!area) return;
    if (this.el.zhaoFaceV2) this.el.zhaoFaceV2.classList.remove('sad');
    if (exp === 'back') {
      area.classList.remove('facing-player');
      if (this.el.zhaoBackV2) this.el.zhaoBackV2.style.display = '';
      if (this.el.zhaoFaceV2) this.el.zhaoFaceV2.style.display = '';
    } else if (exp === 'normal') {
      area.classList.add('facing-player');
      if (this.el.zhaoBackV2) this.el.zhaoBackV2.style.display = '';
      if (this.el.zhaoFaceV2) this.el.zhaoFaceV2.style.display = '';
    } else if (exp === 'sad') {
      area.classList.add('facing-player');
      if (this.el.zhaoFaceV2) this.el.zhaoFaceV2.classList.add('sad');
      if (this.el.zhaoBackV2) this.el.zhaoBackV2.style.display = '';
      if (this.el.zhaoFaceV2) this.el.zhaoFaceV2.style.display = '';
    }
  },

  setPlayerExpression(exp) {
    const area = this.el.playerAreaV2;
    if (!area) return;
    if (this.el.playerNormalV2) this.el.playerNormalV2.style.display = '';
    if (this.el.playerSmileV2) this.el.playerSmileV2.style.display = '';
    if (exp === 'smile') area.classList.add('smile');
    else area.classList.remove('smile');
  },`;

merged = merged.replace('\n  playAnimation(name) {', exprInsert + '\n  playAnimation(name) {');

// 8. Add hand_reach animation
merged = merged.replace(
  "      case 'memory_flash':\n        this.setSceneBackground('sucai/zhao/赵奶奶眼中的房间.png');\n        this.el.memFlash.classList.add('flashing');\n        setTimeout(() => this.el.memFlash.classList.remove('flashing'), 600);\n        break;\n    }",
  `      case 'memory_flash':
        this.setSceneBackground('sucai/zhao/赵奶奶眼中的房间.png');
        this.el.memFlash.classList.add('flashing');
        setTimeout(() => this.el.memFlash.classList.remove('flashing'), 600);
        break;
      case 'hand_reach':
        if (this.el.suitcase) this.el.suitcase.classList.add('visible');
        if (this.el.zhaoHandV2) this.el.zhaoHandV2.classList.add('reaching');
        break;
      case 'hand_retract':
        if (this.el.zhaoHandV2) this.el.zhaoHandV2.classList.remove('reaching');
        break;
    }`
);

// 9. Modify doSceneEnding to transition to visit2
merged = merged.replace(
  "this.showSceneHint('探访一 · 完', 5000);",
  "this.showSceneHint('探访一 · 完', 2000);\n              setTimeout(() => this.startVisit2(), 2500);"
);

// 10. Modify resetScene for V2 elements
merged = merged.replace(
  'this.currentVisit = 1;\n    // 重置背景',
  `this.currentVisit = 1;
    // 隐藏CSS层角色
    if (this.el.zhaoBackV2) this.el.zhaoBackV2.style.display = 'none';
    if (this.el.zhaoFaceV2) this.el.zhaoFaceV2.style.display = 'none';
    if (this.el.playerNormalV2) this.el.playerNormalV2.style.display = 'none';
    if (this.el.playerSmileV2) this.el.playerSmileV2.style.display = 'none';
    if (this.el.linAreaV2) this.el.linAreaV2.classList.add('hidden');
    if (this.el.zhaoHandV2) this.el.zhaoHandV2.classList.remove('reaching');
    if (this.el.zhaoSprite) this.el.zhaoSprite.style.display = '';
    if (this.el.playerSprite) this.el.playerSprite.style.display = '';
    document.querySelectorAll('.pot-slot').forEach(p => p.classList.remove('v2-active'));
    if (this.el.toolBox) this.el.toolBox.classList.remove('visible', 'picked');
    if (this.el.stickV2) this.el.stickV2.classList.remove('equipped', 'poking', 'pull');
    // 重置背景`
);

// 11. Add v2 state resets
merged = merged.replace(
  'this.v2LabelStabilized = false;',
  `this.v2LabelStabilized = false;
    this.v2LabelReady = false;
    this.v2SpecimenComplete = false;
    this.v2FieldNotesPage = 1;
    this.v2FieldNotesAllFlipped = false;
    this.v2FieldNotesBusy = false;`
);

// 12. Add stick/hand/lin reset at v2 cleanup
merged = merged.replace(
  "this.el.letterDetail?.classList.remove('show');\n    this.el.v2CloseAll?.classList.remove('visible');",
  `this.el.letterDetail?.classList.remove('show');
    if (this.el.stickV2) this.el.stickV2.classList.remove('equipped', 'poking', 'pull');
    if (this.el.zhaoHandV2) this.el.zhaoHandV2.classList.remove('reaching');
    if (this.el.linAreaV2) this.el.linAreaV2.classList.add('hidden');
    this.el.v2CloseAll?.classList.remove('visible');`
);

// ===== 3. Insert v2 methods into the JS =====

// Find "  },\n\n};" or similar that marks end of Game object in v1
// Look for the pattern: the end of doSceneEnding -> ending of Game object
// Handle both CRLF and LF line endings
const rf2 = merged.lastIndexOf('\r\n};\r\n');
const lf2 = merged.lastIndexOf('\n};\n');
const lastLinePattern = rf2 >= 0 ? rf2 : lf2;
if (lastLinePattern < 0) {
  console.error('Cannot find Game closing }');
  process.exit(1);
}

// Insert v2 methods before the closing };
// Rewrite V2 element references to use V2-suffixed property names
let v2methodsFixed = v2methods
  .replace(/this\.el\.zhaoArea\b/g, 'this.el.zhaoAreaV2')
  .replace(/this\.el\.playerArea\b/g, 'this.el.playerAreaV2')
  .replace(/this\.el\.linArea\b/g, 'this.el.linAreaV2')
  .replace(/this\.el\.zhaoBack\b/g, 'this.el.zhaoBackV2')
  .replace(/this\.el\.zhaoFace\b/g, 'this.el.zhaoFaceV2')
  .replace(/this\.el\.zhaoHand\b/g, 'this.el.zhaoHandV2')
  .replace(/this\.el\.playerNormal\b/g, 'this.el.playerNormalV2')
  .replace(/this\.el\.playerSmile\b/g, 'this.el.playerSmileV2')
  .replace(/this\.el\.stick\b/g, 'this.el.stickV2');
merged = merged.substring(0, lastLinePattern + 1) 
  + '\n\n' + v2methodsFixed + '\n' 
  + merged.substring(lastLinePattern + 1);

// 13. Fix startVisit2: 清理场景过渡层 + 设置v2初始背景
merged = merged.replace(
  "startVisit2() {\n    this.currentVisit = 2;\n    document.getElementById('chapter-label').textContent = '赵奶奶 · 探访二 · 标本盒';\n    // 隐藏探访一专属元素",
  `startVisit2() {\n    this.currentVisit = 2;\n    document.getElementById('chapter-label').textContent = '赵奶奶 · 探访二 · 标本盒';\n    // 清理场景过渡层，设置探访二初始背景\n    if (this.el.scene) {\n      this.el.scene.querySelectorAll('.scene-transition').forEach(o => o.remove());\n      this.el.scene.style.backgroundImage = "url('assets/zhao/林姐走廊.png')";\n    }\n    // 隐藏探访一专属元素`
);

// ===== Write file =====
fs.writeFileSync('index.html', merged, 'utf8');
console.log('index.html written:', merged.length, 'bytes');
console.log('Done!');
