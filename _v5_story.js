
  // ==============================
  //  探访五 · 种下去（最终场景）
  // ==============================

  startVisit5: function() {
    this.currentVisit = 5;
    document.getElementById('chapter-label').textContent = '赵奶奶 · 探访五 · 种下去';
    document.title = '勿忘我 · 赵奶奶篇 · 探访五 · 种下去';
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
    // 黄昏末尾色调
    var gl = document.getElementById('game-wrapper');
    if (gl) gl.style.background = 'linear-gradient(180deg, #3A4250 0%, #2A3240 50%, #1A2230 100%)';
    this.startPhase('v5_intro');
  },

  // ------ v5 阶段1: 开场 ------
  doV5Intro: function() {
    var self = this;
    this.el.choices.classList.remove('active');
    this.runDialogueQueue([
      { speaker:'narrator', text:'你收拾东西准备离开。走到走廊尽头时，赵奶奶的门开了。' },
      { speaker:'narrator', text:'她走出来，穿着那件灰开衫——白天林姐给她披上的那件。她手里攥着几粒深褐色的种子。' },
      { speaker:'zhao', text:'你还没走啊。', cb:function(){ self.el.zhaoArea.classList.add('facing-player'); } },
      { speaker:'narrator', text:'她的声音不一样了——平稳、清晰。没有混乱，没有颤抖。像是一个从深水里浮上来的人，终于吸到了一口空气。' },
      { speaker:'player', text:'……准备走了。' },
      { speaker:'narrator', text:'她走到你面前，把种子放在你手心。她的手指碰到你掌心的那一刻，是温的。' },
      { speaker:'zhao', text:'拿着吧。随手撒就行。不用特别照顾。种不出来也没事。' },
      { speaker:'player', text:'这是什么种子？' },
      { speaker:'zhao', text:'我育了三年才稳定下来的。第三批。' },
      { speaker:'zhao', text:'我一直没给它取过名字。', cb:function(){ self.startPhase('v5_meta'); } },
    ]);
  },

  // ------ v5 阶段2: 元叙事·她知道 ------
  doV5Meta: function() {
    var self = this;
    this.showDialogue('narrator', '她看着你，眼神不是混乱的——是那种几十年观察植物练出来的专注。', function(){
      self.showDialogue('zhao', '你不是我孙女。', function(){
        self.showDialogue('narrator', '不是问句。语气平静。', function(){
          self.showDialogue('player', '……不是。', function(){
            self.showDialogue('zhao', '你来这么多天，我问你的事你都答不上来。你爷爷叫什么，你小时候住哪条街——你都接不上。', function(){
              self.showDialogue('zhao', '你是写东西的人吧？', function(){
                self.showDialogue('player', '……是。', function(){
                  self.showDialogue('zhao', '那你为什么来做这些？', function(){
                    self.showDialogue('narrator', '💭 她是清醒的——真正的清醒。她知道你在收集故事。她甚至可能知道更多。但她没有愤怒。她只是想知道。', function(){
                      self.showDialogue('narrator', '🎮 你怎么回答她？', function(){
                        self.showChoices([
                          { label:'A', text:'我外婆也患过这个病，我想了解她那样的人。', cb:function(){ self._v5PlayerChoice = 'A'; self.startPhase('v5_dialogue'); }},
                          { label:'B', text:'我承认，我是一名作家，我在找故事。', cb:function(){ self._v5PlayerChoice = 'B'; self.startPhase('v5_dialogue'); }},
                          { label:'C', text:'我在体验一个讲认知症的游戏。', cb:function(){ self._v5PlayerChoice = 'C'; self.startPhase('v5_dialogue'); }},
                          { label:'D', text:'我来参加比赛，需要完成这个项目。', cb:function(){ self._v5PlayerChoice = 'D'; self.startPhase('v5_dialogue'); }},
                        ]);
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

  // ------ v5 阶段3: 最终对话 ------
  doV5Dialogue: function() {
    var self = this;
    var c = this._v5PlayerChoice || 'A';
    this.runDialogueQueue([
      { speaker:'narrator', text:'她"嗯"了一声，没有评判。她看了一眼你手心里的种子，又看向你。' },
      { speaker:'zhao', text:'不管你为什么来的……你听完我的事了。' },
      { speaker:'narrator', text:'窗外的天几乎全黑了，只剩一线暗蓝。她看着你的眼睛。' },
      { speaker:'zhao', text:'那你记住一句话。' },
      { speaker:'zhao', text:'我年轻的时候，是国内最早一批做植物育种的女性之一。我走过很多山，收集过很多标本。后来我有了自己的名字：赵秀兰。' },
      { speaker:'zhao', text:'后来我结了婚。你爷爷是植物画家，他画得好。所有人都说——你们天生一对。然后我就成了张家铭的妻子。' },
      { speaker:'zhao', text:'不出差，别人只问先生最近画了什么。我发表论文，别人只说，张家铭家属来了。' },
      { speaker:'zhao', text:'家里需要人。他有画展要去，有书画要带。我得留在家里。' },
      { speaker:'zhao', text:'等我再想做自己的时候——已经来不及了。我的那些标本，那些数据，被别人接手了。整篇论文，署名没有我。' },
      { speaker:'zhao', text:'你将来如果要走一条自己的路——别停下来。别为了任何人停下来。' },
      { speaker:'zhao', text:'别像我一样。用一辈子去证明，我不只是他的妻子。' },
      { speaker:'narrator', text:'她顿了一下。然后她的目光越过你，看向你身后的某个地方。', cb:function(){
        // 屏幕边缘微微变暗
        var gl = document.getElementById('game-wrapper');
        if (gl) { gl.style.boxShadow = 'inset 0 0 80px 40px rgba(0,0,0,0.3)'; gl.style.transition = 'box-shadow 1.5s'; }
        self.showDialogue('zhao', '你写完了……体验完了……比完赛了……', function(){
          self.showDialogue('zhao', '你会记得我吗？', function(){
            self.showDialogue('zhao', '还是只会记得——我玩过一个关于老人的游戏？', function(){
              self.showDialogue('narrator', '她没等你回答。她转身走回房间。走到门口，停了一下，没回头。', function(){
                self.showDialogue('zhao', '你帮我叫林姐过来。', function(){
                  self.startPhase('v5_call');
                });
              });
            });
          });
        });
      }},
    ]);
  },

  // ------ v5 阶段4: 叫林姐 ------
  doV5Call: function() {
    var self = this;
    this.showDialogue('narrator', '你走到走廊另一端。林姐站在窗边，手里拿着那件外套，像是已经站在那里很久了。', function(){
      self.showDialogue('player', '她叫你。', function(){
        self.showDialogue('narrator', '林姐走进房间。', function(){
          self.startPhase('v5_embrace');
        });
      });
    });
  },

  // ------ v5 阶段5: 最后的拥抱 ------
  doV5Embrace: function() {
    var self = this;
    this.runDialogueQueue([
      { speaker:'narrator', text:'林姐走到赵奶奶身边，没有说话。' },
      { speaker:'zhao', text:'你每天来陪我，每天给我换水，每天帮我把花转个方向。你做了很多年了。' },
      { speaker:'narrator', text:'林姐没有说话。她的嘴唇动了一下，但没有发出声音。' },
      { speaker:'zhao', text:'辛苦了。' },
      { speaker:'narrator', text:'赵奶奶站起来。她的脚步有一点不稳，但她很稳地走过来——她抱住了林姐。很轻。但很稳。' },
      { speaker:'narrator', text:'林姐的手慢慢抬起来，放在她背上。她没有说话，也没有哭出声。但她抱着她，抱了很久。', cb:function(){
        self.showDialogue('narrator', '💭 她可能还是不完全记得林姐是谁。但她记得"这个人在"。她记得"这个人一直在"。这就够了。', function(){
          self.startPhase('v5_input');
        });
      }},
    ]);
  },

  // ------ v5 阶段6: 玩家输入 ------
  doV5Input: function() {
    var self = this;
    this.runDialogueQueue([
      { speaker:'narrator', text:'赵奶奶松开林姐。她看着门口的方向——你站在那里，手里攥着那个种子袋。' },
      { speaker:'zhao', text:'那些种子，你带回去种吧。' },
      { speaker:'zhao', text:'如果种出来了，你就知道。她确实活过。' },
      { speaker:'narrator', text:'屏幕下方出现一个输入框：' },
      { speaker:'narrator', text:'"你会为现实中的认知症老人做一件事吗？哪怕只是一句话。"' },
      { speaker:'narrator', text:'🎮 输入你想说的话，或直接继续跳过去。', cb:function(){
        self._v5InputDone = true;
        self.startPhase('v5_ending');
      }},
    ]);
  },

  // ------ v5 阶段7: 最终收尾 ------
  doV5Ending: function() {
    var self = this;
    this.runDialogueQueue([
      { speaker:'zhao', text:'她转回身去，看着窗台上那盆新种下的勿忘我。窗外最后一缕光落在花瓣的位置——这里没有花，只有泥土和新长出的希望。' },
      { speaker:'narrator', text:'你走出时光驿站的大门。外面的天已经黑透了。路灯亮了，照在门口的小路上。' },
      { speaker:'narrator', text:'你低头看了一眼手心——那几粒种子还在。深褐色的，很小，像是随时会被风吹走。' },
      { speaker:'narrator', text:'你回头看了一眼。赵奶奶房间的灯还亮着，昏黄的，暖暖的。林姐的身影从窗前经过，拉上了窗帘。' },
      { speaker:'narrator', text:'你走远了几步。风很轻。种子在你手心里，像几粒深褐色的句号。', cb:function(){
        self.addFragment(
          5,
          '她问："你记得我吗？"\n她说："别像我一样。用一辈子去证明，我不只是他的妻子。"\n她不是在问主角。她是在问屏幕前的你。',
          '信度条 5/5 点亮',
          '种子在你手心里。'
        );
        self.showToast('碎片 5/5 收集完成 · 全部信度点亮');
        var gl = document.getElementById('game-wrapper');
        if (gl) { gl.style.background = ''; gl.style.boxShadow = ''; }
        self.showSceneHint('勿忘我 · 赵奶奶篇 · 完', 8000);
      }},
    ]);
  },
