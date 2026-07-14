
  // ==============================
  //  探访三 · 勿忘我（自我美化的记忆）
  // ==============================

  startVisit3: function() {
    this.currentVisit = 3;
    document.getElementById('chapter-label').textContent = '赵奶奶 · 探访三 · 勿忘我';
    document.title = '勿忘我 · 赵奶奶篇 · 探访三 · 勿忘我';
    document.querySelectorAll('.pot-slot').forEach(function(p){ p.style.display='none'; });
    this.el.toolBox.classList.remove('visible');
    this.el.stick.classList.remove('equipped','poking','pull');
    this.el.hint.classList.remove('visible');
    this.el.zhaoArea.classList.remove('facing-player','turning');
    this.el.zhaoHand.classList.remove('reaching');
    var vs = document.getElementById('visit2-scene');
    if (vs) vs.classList.remove('active');
    var si = document.getElementById('suitcase-items');
    if (si) si.classList.remove('visible');
    this.el.specimenDetail && this.el.specimenDetail.classList.remove('show');
    this.el.fieldNotesDetail && this.el.fieldNotesDetail.classList.remove('show');
    this.el.workIdDetail && this.el.workIdDetail.classList.remove('show');
    this.el.letterDetail && this.el.letterDetail.classList.remove('show');
    this.el.v2CloseAll && this.el.v2CloseAll.classList.remove('visible');
    this.startPhase('v3_intro');
  },

  // ------ v3 阶段1: 开场 ------
  doV3Intro: function() {
    this.el.choices.classList.remove('active');
    var self = this;
    this.runDialogueQueue([
      { speaker:'narrator', text:'你下午再来的时候，赵奶奶正坐在桌前。桌上摊着两样东西：左边是一张泛黄的进修通知书，右边是一幅蜡笔画。' },
      { speaker:'narrator', text:'她没在看你。她看着那两样东西，像看着一道解不开的题。' },
      { speaker:'zhao', text:'那时候……我选了带孩子。', cb:function(){ self.el.zhaoArea.classList.add('turning'); setTimeout(function(){ self.el.zhaoArea.classList.remove('turning'); },2500); } },
      { speaker:'player', text:'您以前想过去北京？' },
      { speaker:'zhao', text:'他们让我去。学两年。回来能升职称。' },
      { speaker:'narrator', text:'她看向那幅画。画上小女孩的脸——圆圆的，带着天真笑容。' },
      { speaker:'zhao', text:'……孩子那时候刚上小学。' },
      { speaker:'narrator', text:'桌上左边是【进修通知书】，右边是【蜡笔画】。你注意到通知书上写着"1989年7月"，实验记录本也摊在旁边。' },
      { speaker:'narrator', text:'🎮 把【进修通知书】和【旧实验记录本】并排放置，可能会发现什么。', cb:function(){ self.startPhase('v3_side_by_side'); } },
    ]);
  },

  // ------ v3 阶段2: 并排放置，虚实证伪 ------
  doV3SideBySide: function() {
    var self = this;
    this.showSceneHint('拖拽【进修通知书】和【实验记录本】并排放置', 5000);
    // 模拟并排放置交互——自动触发
    setTimeout(function(){
      self.showDialogue('narrator', '你把"进修通知书"和"旧实验记录本"并排放在桌上。', function(){
        self.showDialogue('narrator', '💭 赵奶奶会告诉你："我选了留在昆明带孩子。我是自己选的，不后悔。"', function(){
          self.showDialogue('narrator', '🔍 但并排放置后，通知书日期——1989年7月——和记录本某一页日期完全重合。', function(){
            self.showDialogue('narrator', '那一页写着："7月14日，授粉关键期。连续守夜第12天。北京来信了，没拆。拆了也没用。走不开。"', function(){
              self.showDialogue('narrator', '这两件事发生在同一个月、同一个星期、同一种状态下。', function(){
                // 翻到下一页，隐藏字条出现
                if (self._memoryFlash) clearTimeout(self._memoryFlash);
                self._memoryFlash = setTimeout(function(){
                  var mf = document.getElementById('memory-flash');
                  if (mf) { mf.classList.add('flashing'); setTimeout(function(){ mf.classList.remove('flashing'); }, 500); }
                }, 300);
                self.showDialogue('narrator', '你翻到下一页，夹着一张折叠的字条。展开来，是她自己的笔迹——比记录本上的字更轻、更慢：', function(){
                  self.showDialogue('narrator', '"不是选孩子。是选不了。两样都没捞着。"', function(){
                    self.showDialogue('narrator', '字条出现时，画面闪过赵奶奶年轻时在苗圃与家门口之间来回走动的残影。', function(){
                      self.showDialogue('player', '您看到这个了吗？', function(){
                        self.showDialogue('zhao', '……什么？', function(){
                          self.showDialogue('narrator', '她没有回头。她可能不想看。也可能她早就看过，只是选择不记得。', function(){
                            self.startPhase('v3_crayon');
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    }, 2000);
  },

  // ------ v3 阶段3: 蜡笔画 · 空白的脸 ------
  doV3Crayon: function() {
    var self = this;
    this.showDialogue('narrator', '你拿起那幅蜡笔画。画上是一个小女孩和一个人——大人的身体是完整的，但脸是一片空白。', function(){
      self.showDialogue('player', '这画的是谁？', function(){
        self.showDialogue('zhao', '……不知道。看不清楚。', function(){
          self.showDialogue('narrator', '她的手指在画上的人脸位置碰了碰。', function(){
            self.showDialogue('zhao', '可能是孩子她爸。也可能是我。', function(){
              self.showDialogue('player', '您怎么看不清？', function(){
                self.showDialogue('zhao', '没画完吧。', function(){
                  self.showDialogue('zhao', '那时候老不在家。在苗圃。孩子画我的时候，可能不记得我长什么样了。', function(){
                    // 闪回：人脸短暂浮现
                    if (self._memoryFlash) clearTimeout(self._memoryFlash);
                    self._memoryFlash = setTimeout(function(){
                      var mf = document.getElementById('memory-flash');
                      if (mf) { mf.classList.add('flashing'); setTimeout(function(){ mf.classList.remove('flashing'); }, 800); }
                    }, 300);
                    self.showDialogue('narrator', '🔍 当你触摸画上空白人脸位置时，人脸短暂浮现——是一张年轻的、微笑的脸（赵奶奶30多岁的样子）——然后迅速消失。', function(){
                      self.showDialogue('narrator', '💭 赵奶奶没有看到这个闪回。她的目光仍然落在空白处。对她来说，那张脸从来没有出现过。', function(){
                        self.startPhase('v3_choice');
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  },

  // ------ v3 阶段4: 两样东西的选择 ------
  doV3Choice: function() {
    var self = this;
    this.showDialogue('narrator', '桌上两样东西：左边是进修通知书，右边是孩子的画。你无法替她选。', function(){
      self.showDialogue('narrator', '但你注意到——她的目光在两者之间移动，最终停在了画上。', function(){
        self.showDialogue('player', '您再看一眼这个。', function(){
          self.showDialogue('narrator', '她把画拿起来，看了很久。她的手指沿着孩子画的轮廓线移动——那些歪歪扭扭的线条，像是小手当时还不太会握笔。', function(){
            self.showDialogue('zhao', '……以前总觉得来得及。下次再陪。下次再去。下次……', function(){
              self.showDialogue('narrator', '她把画折起来，放回抽屉。', function(){
                self.showDialogue('zhao', '……没有下次了。', function(){
                  self.showDialogue('narrator', '窗外走廊传来脚步声。有人抱着床单经过——林姐。她朝屋里看了一眼，但赵奶奶没有抬头。', function(){
                    self.showDialogue('narrator', '🔍 窗玻璃的倒影中，短暂映出林姐的脸——一闪而过。赵奶奶的余光捕捉到了，但她没有转头。', function(){
                      self.startPhase('v3_ending');
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  },

  // ------ v3 阶段5: 场景收尾 ------
  doV3Ending: function() {
    var self = this;
    this.runDialogueQueue([
      { speaker:'zhao', text:'这些事……我都记不清了。但身体记得。' },
      { speaker:'zhao', text:'每次走到那个苗圃的位置，腿就自己停下来。' },
      { speaker:'narrator', text:'她摸了摸通知书，又摸了摸画。两样东西都放回抽屉里。抽屉关上的声音很轻，像关上了一个年代的重量。', cb:function(){
        self.addFragment(
          3,
          '她说"我选了家庭"。但通知书和实验记录本上的日期重叠了。她当时根本没得选——授粉期走不开，事业被卡住，家庭被挤占。\n她给自己编了一个"主动选择"的故事，不然太痛了。\n孩子的画里，大人的脸是空白的。\n她连自己长什么样都没留给孩子。',
          '陈述为自我美化的记忆',
          '证据：日期重叠 + 字条"两样都没捞着"'
        );
        self.showToast('碎片 3/5 收集完成');
      }},
      { speaker:'narrator', text:'📓 虚实对账本已记录碎片 3/5', cb:function(){
        self.showSceneHint('探访三 · 完', 5000);
      }},
    ]);
  },
