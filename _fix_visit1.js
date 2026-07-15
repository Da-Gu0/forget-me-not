const fs = require('fs');
const path = require('path');
const file = 'G:\\GAOGAOZHEN\\github\\github-projects\\heikesong\\visit1.html';
let content = fs.readFileSync(file, 'utf-8');

// ========== 1. CSS: 花盆和竹签初始隐藏，closeup-mode 时显示 ==========

// 1a. 修改 .pot-slot 基础样式，添加初始 opacity:0
content = content.replace(
  /\.pot-slot \{\n  position:absolute; bottom:16px;\n  width:64px; height:64px;\n  border-radius:50%;\n  background: rgba\(255,255,255,0\.3\);\n  border: 1px solid rgba\(255,255,255,0\.2\);\n  display:flex; align-items:center; justify-content:center;\n  cursor:pointer; z-index:15;\n  transition: transform 0\.3s, opacity 0\.3s;\n\}/,
  `.pot-slot {
  position:absolute; bottom:16px;
  width:64px; height:64px;
  border-radius:50%;
  background: rgba(255,255,255,0.3);
  border: 1px solid rgba(255,255,255,0.2);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; z-index:15;
  transition: transform 0.3s, opacity 0.3s;
  opacity: 0; pointer-events: none;
}`
);

// 1b. 修改 #bamboo-stick 基础样式，添加初始 opacity:0
content = content.replace(
  /\/\* 竹签探针（窗台） \*\/\n#bamboo-stick \{\n  position:absolute; right:60px; bottom:80px;\n  width: 80px; height: auto;\n  z-index:21;\n  opacity:0; pointer-events:none; transition: all 0\.4s;\n  transform: rotate\(-30deg\);\n  cursor: pointer;\n\}/,
  `/* 竹签探针（窗台） */
#bamboo-stick {
  position:absolute; right:60px; bottom:80px;
  width: 80px; height: auto;
  z-index:21;
  opacity: 0; pointer-events: none; transition: all 0.4s;
  transform: rotate(-30deg);
  cursor: pointer;
}`
);

// 1c. closeup-mode 下显示花盆和竹签
content = content.replace(
  /#scene-layer\.closeup-mode \.pot-slot\.left \{\n  right: auto; left: 32%; bottom: 20%;\n  width: 140px; height: auto;\n\}/,
  `#scene-layer.closeup-mode .pot-slot.left {
  right: auto; left: 32%; bottom: 20%;
  width: 140px; height: auto;
  opacity: 1; pointer-events: all;
}`
);

content = content.replace(
  /#scene-layer\.closeup-mode #bamboo-stick \{\n  right: 18%; bottom: 22%;\n  width: 100px;\n\}/,
  `#scene-layer.closeup-mode #bamboo-stick {
  right: 18%; bottom: 22%;
  width: 100px;
  opacity: 1; pointer-events: all;
}`
);

// ========== 2. CSS: 对话框半透明 ==========
content = content.replace(
  /#dialogue-area \{\n  height: 160px; flex-shrink:0;\n  background: linear-gradient\(0deg, rgba\(244,248,252,0\.99\), rgba\(235,242,248,0\.97\)\);\n  border-top: 2px solid rgba\(107,163,190,0\.25\);\n  position:relative; z-index:15;\n  display:flex; flex-direction:column;\n\}/,
  `#dialogue-area {
  height: 160px; flex-shrink:0;
  background: linear-gradient(0deg, rgba(244,248,252,0.72), rgba(235,242,248,0.68));
  border-top: 2px solid rgba(107,163,190,0.25);
  position:relative; z-index:15;
  display:flex; flex-direction:column;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}`
);

// ========== 3. JS: onPotEnter 修复 - 删除 soil 引用，改为背景图闪烁 ==========
content = content.replace(
  /  onPotEnter\(potEl\) \{\n    if \(!this\.interactMode \|\| this\.hoverPaused\) return;\n    if \(potEl\._hovering\) return;\n    if \(this\.hoverStabilized\.has\(potEl\.dataset\.pot\)\) return;\n    potEl\._hovering = true;\n    \n    const potId = potEl\.dataset\.pot;\n    const soil = potEl\.querySelector\('\.soil-display'\);\n    const tooltip = potEl\.querySelector\('\.hover-tooltip'\);\n    const progBar = potEl\.querySelector\('\.hover-progress'\);\n    const progFill = potEl\.querySelector\('\.hover-progress-fill'\);\n    \n    \/\/ 初始状态：记忆浮现\n    potEl\.classList\.add\('memory-active'\);\n    potEl\.classList\.remove\('memory-fading'\);\n    soil\.classList\.remove\('soil-dry'\);\n    soil\.classList\.add\('soil-wet'\);\n    \n    progBar\.classList\.add\('show'\);\n    progFill\.style\.width = '0%';\n    \n    \/\/ 3秒进度 \+ 认知残影闪烁\n    const startTime = Date\.now\(\);\n    const pot = potEl;\n    const self = this;\n    \n    function updateProgress\(\) \{\n      if \(!pot\._hovering \|\| !self\.interactMode \|\| self\.hoverPaused\) \{\n        progBar\.classList\.remove\('show'\);\n        pot\._hovering = false;\n        return;\n      \}\n      const elapsed = Date\.now\(\) - startTime;\n      const pct = Math\.min\(elapsed \/ 3000 \* 100, 100\);\n      progFill\.style\.width = pct \+ '%';\n      \n      \/\/ 0-1\.5s: 慢闪烁\n      \/\/ 1\.5-2\.5s: 加速闪烁\n      \/\/ 2\.5-3s: 极速闪烁\n      if \(pct < 100\) \{\n        let interval;\n        if \(pct < 50\) interval = 600;\n        else if \(pct < 80\) interval = 300;\n        else interval = 120;\n        \n        const phase = Math\.floor\(elapsed \/ interval\) % 2;\n        if \(phase === 0\) \{\n          pot\.classList\.remove\('memory-active'\);\n          pot\.classList\.add\('memory-fading'\);\n          soil\.classList\.remove\('soil-wet'\);\n          soil\.classList\.add\('soil-dry'\);\n        \} else \{\n          pot\.classList\.add\('memory-active'\);\n          pot\.classList\.remove\('memory-fading'\);\n          soil\.classList\.remove\('soil-dry'\);\n          soil\.classList\.add\('soil-wet'\);\n        \}\n        pot\._animFrame = requestAnimationFrame\(updateProgress\);\n      \} else \{\n        \/\/ 3秒到：稳定现实\n        pot\.classList\.remove\('memory-active', 'memory-fading'\);\n        soil\.classList\.remove\('soil-wet'\);\n        soil\.classList\.add\('soil-dry'\);\n        progBar\.classList\.remove\('show'\);\n        self\.hoverStabilized\.add\(potId\);\n        self\.potsHovered\.add\(potId\);\n        self\.onHoverStabilized\(potId\);\n      \}\n    \}\n    \n    pot\._animFrame = requestAnimationFrame\(updateProgress\);\n  \},/,
  `  onPotEnter(potEl) {
    if (!this.interactMode || this.hoverPaused) return;
    if (potEl._hovering) return;
    if (this.hoverStabilized.has(potEl.dataset.pot)) return;
    potEl._hovering = true;
    
    const potId = potEl.dataset.pot;
    const tooltip = potEl.querySelector('.hover-tooltip');
    const progBar = potEl.querySelector('.hover-progress');
    const progFill = potEl.querySelector('.hover-progress-fill');
    
    progBar.classList.add('show');
    progFill.style.width = '0%';
    
    // 3秒进度 + 背景闪烁交叠
    const startTime = Date.now();
    const pot = potEl;
    const self = this;
    
    function updateProgress() {
      if (!pot._hovering || !self.interactMode || self.hoverPaused) {
        progBar.classList.remove('show');
        pot._hovering = false;
        // 恢复背景为纯背景
        self.el.scene.style.backgroundImage = "url('sucai/zhao/想象中勿忘我的近景（纯背景无花无竹签）.png')";
        return;
      }
      const elapsed = Date.now() - startTime;
      const pct = Math.min(elapsed / 3000 * 100, 100);
      progFill.style.width = pct + '%';
      
      // 0-1.5s: 慢闪烁
      // 1.5-2.5s: 加速闪烁
      // 2.5-3s: 极速闪烁
      if (pct < 100) {
        let interval;
        if (pct < 50) interval = 600;
        else if (pct < 80) interval = 300;
        else interval = 120;
        
        const phase = Math.floor(elapsed / interval) % 2;
        if (phase === 0) {
          // 现实：枯萎近景
          self.el.scene.style.backgroundImage = "url('sucai/zhao/实际上勿忘我的近景.png')";
        } else {
          // 记忆：纯背景
          self.el.scene.style.backgroundImage = "url('sucai/zhao/想象中勿忘我的近景（纯背景无花无竹签）.png')";
        }
        pot._animFrame = requestAnimationFrame(updateProgress);
      } else {
        // 3秒到：稳定在当前画面（纯背景），弹出文案
        self.el.scene.style.backgroundImage = "url('sucai/zhao/想象中勿忘我的近景（纯背景无花无竹签）.png')";
        progBar.classList.remove('show');
        self.hoverStabilized.add(potId);
        self.potsHovered.add(potId);
        self.onHoverStabilized(potId);
      }
    }
    
    pot._animFrame = requestAnimationFrame(updateProgress);
  },`
);

// ========== 4. JS: onPotLeave 修复 - 删除 soil 引用 ==========
content = content.replace(
  /  onPotLeave\(potEl\) \{\n    if \(!potEl\._hovering\) return;\n    potEl\._hovering = false;\n    if \(potEl\._animFrame\) cancelAnimationFrame\(potEl\._animFrame\);\n    clearTimeout\(potEl\._timer1\);\n    clearTimeout\(potEl\._timer2\);\n    \n    \/\/ 如果已稳定，不重置\n    if \(this\.hoverStabilized\.has\(potEl\.dataset\.pot\)\) \{\n      potEl\.querySelector\('\.hover-progress'\)\.classList\.remove\('show'\);\n      return;\n    \}\n    \n    potEl\.classList\.remove\('memory-active', 'memory-fading'\);\n    const soil = potEl\.querySelector\('\.soil-display'\);\n    soil\.classList\.remove\('soil-wet'\);\n    soil\.classList\.add\('soil-dry'\);\n    potEl\.querySelector\('\.hover-tooltip'\)\.classList\.remove\('visible'\);\n    potEl\.querySelector\('\.hover-progress'\)\.classList\.remove\('show'\);\n  \},/,
  `  onPotLeave(potEl) {
    if (!potEl._hovering) return;
    potEl._hovering = false;
    if (potEl._animFrame) cancelAnimationFrame(potEl._animFrame);
    clearTimeout(potEl._timer1);
    clearTimeout(potEl._timer2);
    
    // 如果已稳定，不重置
    if (this.hoverStabilized.has(potEl.dataset.pot)) {
      potEl.querySelector('.hover-progress').classList.remove('show');
      return;
    }
    
    // 恢复背景为纯背景
    this.el.scene.style.backgroundImage = "url('sucai/zhao/想象中勿忘我的近景（纯背景无花无竹签）.png')";
    potEl.querySelector('.hover-tooltip').classList.remove('visible');
    potEl.querySelector('.hover-progress').classList.remove('show');
  },`
);

// ========== 5. JS: onHoverStabilized 修复 - 删除 mid/right tips ==========
content = content.replace(
  /  onHoverStabilized\(potId\) \{\n    \/\/ 悬停3秒后触发——第一次稳定时切换为枯萎近景\n    if \(this\.hoverStabilized\.size === 0\) \{\n      this\.setSceneBackground\('sucai\/zhao\/实际上勿忘我的近景\.png'\);\n    \}\n    const tips = \{\n      left:  '土干透了，茎都塌平了。',\n      mid:   '半死不活的，勉强立着。',\n      right: '这盆还撑着——土面干裂，但茎还在。',\n    \};/,
  `  onHoverStabilized(potId) {
    const tips = {
      left: '土干透了，茎都塌平了。',
    };`
);

// ========== 6. JS: doHoverMode 背景修改 ==========
content = content.replace(
  "this.setSceneBackground('sucai/zhao/想象中勿忘我的近景.png');",
  "this.setSceneBackground('sucai/zhao/想象中勿忘我的近景（纯背景无花无竹签）.png');"
);

// ========== 7. JS: doProbeStick 修复 - 删除 toolBox 相关 ==========
content = content.replace(
  /  doProbeStick\(\) \{\n    this\.hasStick = false;\n    this\.hoverPaused = true;\n    this\.interactMode = false;\n    this\.el\.stick\.classList\.remove\('equipped', 'poking', 'pull'\);\n    this\.el\.toolBox\.classList\.remove\('picked'\);\n    this\.el\.toolBox\.classList\.add\('visible'\);\n    \n    \/\/ 只播放前导对话，交互后由 _postProbeStick 继续\n    this\.runDialogueQueue\(\[\n      \{\n        speaker: 'narrator',\n        text: '旁边有个旧铁盒，里面放着几根细长的竹签——像是她以前用来测土壤湿度的。拿一根吧。',\n        speed: 50,\n      \},\n      \{\n        speaker: 'narrator',\n        text: '点击右侧的工具盒拿起竹签，然后戳进花盆的土里。',\n        speed: 50,\n        cb: \(\) => \{\n          this\.showSceneHint\('🥢 点击工具盒拿竹签，再点花盆戳土。', 5000\);\n        \},\n      \},\n    \]\);\n  \},/,
  `  doProbeStick() {
    this.hasStick = false;
    this.hoverPaused = true;
    this.interactMode = false;
    this.el.stick.classList.remove('equipped', 'poking', 'pull');
    
    // 只播放前导对话，交互后由 _postProbeStick 继续
    this.runDialogueQueue([
      {
        speaker: 'narrator',
        text: '窗台上放着几根细长的竹签——像是她以前用来测土壤湿度的。拿一根吧。',
        speed: 50,
      },
      {
        speaker: 'narrator',
        text: '点击右侧的竹签，然后戳进花盆的土里。',
        speed: 50,
        cb: () => {
          this.showSceneHint('🥢 点击竹签拿起来，再点花盆戳土。', 5000);
        },
      },
    ]);
  },`
);

// 同时删除 doProbeAction 中的 toolBox 引用
content = content.replace(
  /    this\.el\.stick\.classList\.add\('poking'\);\n    this\.hoverPaused = true;\n    this\.el\.toolBox\.classList\.remove\('visible'\);\n    \n    \/\/ 戳入动画\n/,
  `    this.el.stick.classList.add('poking');
    this.hoverPaused = true;
    
    // 戳入动画
`
);

// ========== 8. JS: playAnimation memory_flash 时同步切换背景 ==========
content = content.replace(
  /      case 'memory_flash':\n        this\.el\.memFlash\.classList\.add\('flashing'\);\n        setTimeout\(\(\) => this\.el\.memFlash\.classList\.remove\('flashing'\), 600\);\n        break;/,
  `      case 'memory_flash':
        this.setSceneBackground('sucai/zhao/赵奶奶眼中的房间.png');
        this.el.memFlash.classList.add('flashing');
        setTimeout(() => this.el.memFlash.classList.remove('flashing'), 600);
        break;`
);

// 同时删除 doTouchFlower 中该条对话的 cb（因为已经移到 playAnimation 中）
content = content.replace(
  /      \{\n        speaker: 'zhao', text: '……不对，我浇过了。我今天早上浇过了。', speed: 90,\n        anim: 'memory_flash',\n        cb: \(\) => \{ this\.setSceneBackground\('sucai\/zhao\/赵奶奶眼中的房间\.png'\); \},\n      \},/,
  `      {
        speaker: 'zhao', text: '……不对，我浇过了。我今天早上浇过了。', speed: 90,
        anim: 'memory_flash',
      },`
);

// ========== 9. 文案修改: "三盆花" → "一盆花" ==========
content = content.replace(/去看看那三盆花吧/g, '去看看那盆花吧');
content = content.replace(/其中一盆枯花的茎秆/g, '枯花的茎秆');

// ========== 10. 删除指定文案 ==========
content = content.replace(
  /      \{\n        speaker: 'narrator',\n        text: '你低头看了一眼。土是干裂的，裂纹铺满整个盆面。她顺着你的目光也低头看了一眼。她没有说话。手指在花盆边缘停了一下，收了回去。',\n        speed: 50, anim: 'hand_retract',\n      \},\n/,
  ''
);

// 由于删除了上一条，hand_retract 动画可能不再被使用，但它不影响功能

// ========== 保存 ==========
fs.writeFileSync(file, content, 'utf-8');
console.log('visit1.html modifications complete.');
