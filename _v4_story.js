
  // ==============================
  //  探访四 · 黄昏（日落综合征）
  // ==============================

  startVisit4: function() {
    this.currentVisit = 4;
    document.getElementById('chapter-label').textContent = '赵奶奶 · 探访四 · 黄昏';
    document.title = '勿忘我 · 赵奶奶篇 · 探访四 · 黄昏';
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
    // 黄昏色调
    var gl = document.getElementById('game-wrapper');
    if (gl) gl.style.background = 'linear-gradient(180deg, #FDF3E4 0%, #F5E6CC 30%, #E8D5B8 60%, #4A5A68 100%)';
    this.startPhase('v4_intro');
  },

  // ------ v4 阶段1: 黄昏开场 ------
  doV4Intro: function() {
    var self = this;
    this.el.choices.classList.remove('active');
    this.runDialogueQueue([
      { speaker:'narrator', text:'你黄昏时分推开门。房间里的光线正在变暗——从金黄变成橙红，再变成灰蓝。' },
      { speaker:'narrator', text:'窗台上那盆勿忘我的影子拉得很长，横跨整个桌面。' },
      { speaker:'narrator', text:'赵奶奶站在窗台前，手指反复捻着枯花的茎秆。她的视线频繁瞟向门口，像在等什么，又像在怕什么。' },
      { speaker:'zhao', text:'天黑了……', cb:function(){ self.el.zhaoArea.classList.add('turning'); } },
      { speaker:'zhao', text:'我得回去……苗圃还没关门……', cb:function(){ self.el.zhaoArea.classList.remove('turning'); } },
      { speaker:'player', text:'您坐着，我去帮您看看。' },
      { speaker:'narrator', text:'她没听你说话。她走到门口，又折返回来。' },
      { speaker:'zhao', text:'今天星期几？明天是不是要开会？' },
      { speaker:'narrator', text:'你还没回答，她自言自语。' },
      { speaker:'zhao', text:'……不对，我退休了。不用开会了。' },
      { speaker:'zhao', text:'那我要回家。我得回去。', cb:function(){ self.startPhase('v4_sundowning'); } },
    ]);
  },

  // ------ v4 阶段2: 日落综合征·认知干扰（不可操作60秒）------
  doV4Sundowning: function() {
    var self = this;
    this.showSceneHint('赵奶奶正在经历日落综合征……你无法阻止，只能陪伴。', 6000);
    // 屏幕边缘脉动
    var gl = document.getElementById('game-wrapper');
    if (gl) gl.style.filter = 'brightness(0.92) saturate(0.8)';
    var pulseCount = 0;
    var pulseTimer = setInterval(function(){
      if (gl) {
        if (pulseCount % 2 === 0) {
          gl.style.filter = 'brightness(0.88) saturate(0.75)';
          gl.style.transition = 'filter 1.5s ease-in-out';
        } else {
          gl.style.filter = 'brightness(0.92) saturate(0.8)';
          gl.style.transition = 'filter 1.5s ease-in-out';
        }
      }
      pulseCount++;
      if (pulseCount > 6) { clearInterval(pulseTimer); }
    }, 1500);

    // 赵奶奶混乱对白
    setTimeout(function(){
      self.showDialogue('zhao', '我要回家……要回去……花还没浇……', function(){
        self.showDialogue('narrator', '💭 她的大脑在"回家"和"守夜"两个指令之间撕裂。', function(){
          self.showDialogue('narrator', '她听到两个声音在说话：一个说"回家"，一个说"守夜"。两个声音都是她的。', function(){
            // 混乱持续10秒，然后林姐进场
            setTimeout(function(){
              if (gl) { gl.style.filter = ''; gl.style.background = 'linear-gradient(180deg, #F5ECD8 0%, #D8C8B0 50%, #3A4A5C 100%)'; }
              self.startPhase('v4_comfort');
            }, 3000);
          });
        });
      });
    }, 2000);
  },

  // ------ v4 阶段3: 林姐进场·安抚选择 ------
  doV4Comfort: function() {
    var self = this;
    this.showDialogue('narrator', '门开了。林姐端着水杯进来。穿围裙，脚步轻而快。', function(){
      self.showDialogue('zhao', '你是谁？', function(){
        self.showDialogue('narrator', '林姐没有立刻回答。🎮 选择安抚方式（限时8秒）：', function(){
          self.showChoices([
            { label:'A', text:'林姐说："妈，是我。"', cb:function(){
              self.showDialogue('narrator', '❌ 赵奶奶剧烈后退，碰倒了花盆。', function(){
                self.showDialogue('zhao', '你走开！我不认识你！', function(){
                  self.showDialogue('narrator', '💭 她的大脑处理不了"妈"这个词。在"我应该认识这个人"和"我不认识这个人"之间被撕扯。', function(){
                    self.showDialogue('narrator', '干扰加剧……林姐后退一步，给了她空间。赵奶奶渐渐平静了一些。', function(){
                      setTimeout(function(){ self.startPhase('v4_search'); }, 1000);
                    });
                  });
                });
              });
            }},
            { label:'B', text:'林姐说："赵阿姨，喝点水。"', cb:function(){
              self.showDialogue('narrator', '赵奶奶迟疑了一下，接过水杯。', function(){
                self.showDialogue('zhao', '……谢谢。', function(){
                  self.showDialogue('narrator', '但她仍在发抖。水杯里的水轻轻晃动。"赵阿姨"这个称呼让她感到熟悉，但焦虑还没有完全平息。', function(){
                    setTimeout(function(){ self.startPhase('v4_search'); }, 1000);
                  });
                });
              });
            }},
            { label:'C', text:'林姐不说话，把外套轻轻披在她肩上，然后退后半步。', cb:function(){
              self.showDialogue('narrator', '没有语言。只有动作。一件外套的重量落在赵奶奶肩上——熟悉的重量。', function(){
                self.showDialogue('narrator', '然后人退后半步——给她空间。她的身体先于她的认知做出了反应：她抓住了外套的领子。', function(){
                  self.showDialogue('zhao', '……谢谢。', function(){
                    self.showDialogue('narrator', '她的声音很轻，像是一个迷路的人终于找到了一件熟悉的东西。', function(){
                      self.showDialogue('narrator', '💭 她的身体记忆还在。她知道"这件外套是我的"。她知道"这个重量很熟悉"。她知道"后退半步"意味着"我不逼你"。', function(){
                        self.showDialogue('narrator', '✅ 最佳选择。林姐没有放弃沟通——她选择了赵奶奶当下还能理解的沟通方式。', function(){
                          setTimeout(function(){ self.startPhase('v4_search'); }, 1000);
                        });
                      });
                    });
                  });
                });
              });
            }},
          ]);
        });
      });
    });
  },

  // ------ v4 阶段4: 翻找线索（限时15秒·三选一）------
  doV4Search: function() {
    var self = this;
    this.showSceneHint('在林姐安抚赵奶奶时，你可以翻找一个线索……', 4000);
    setTimeout(function(){
      self.showChoices([
        { label:'①', text:'桌上倒扣的旧相框', cb:function(){
          self.showDialogue('narrator', '你翻过相框——年轻赵奶奶和小女孩站在花圃前。背面写着："1996年，小张5岁。"', function(){
            self.showDialogue('narrator', '🔍 小女孩的脸——耳垂的形状、眉弓的弧度——和眼前的林姐很像。', function(){
              self.startPhase('v4_overlay');
            });
          });
        }},
        { label:'②', text:'床头柜半开的抽屉', cb:function(){
          self.showDialogue('narrator', '值班表上，林姐名字后面括号里写着"家属（女儿）"。', function(){
            self.showDialogue('narrator', '🔍 "家属"两个字在"家属"与"护工"之间交替闪烁。', function(){
              self.showDialogue('narrator', '林姐不是护工。是女儿。', function(){
                self.startPhase('v4_quiet');
              });
            });
          });
        }},
        { label:'③', text:'墙上挂的围裙', cb:function(){
          self.showDialogue('narrator', '围裙口袋里有一张今天的超市小票，商品有"成人纸尿裤"。', function(){
            self.showDialogue('narrator', '🔍 日期是今天的。她每天都在做这些事。', function(){
              self.startPhase('v4_quiet');
            });
          });
        }},
      ]);
    }, 1500);
  },

  // ------ v4 阶段5: 叠图比对（仅选①时触发）------
  doV4Overlay: function() {
    var self = this;
    this.showDialogue('narrator', '你拖拽照片中小女孩的脸，到林姐现在的脸部轮廓上。重叠的一瞬间——', function(){
      self.showDialogue('narrator', '✅ 相似度92%', function(){
        self.showDialogue('narrator', '💭 赵奶奶看到了你比对的照片。她的目光落在小女孩的脸上。', function(){
          self.showDialogue('narrator', '🔍 你抬头看林姐：她正在帮赵奶奶整理外套的衣角。动作很轻、很熟练——做了很多年的那种。', function(){
            self.startPhase('v4_quiet');
          });
        });
      });
    });
  },

  // ------ v4 阶段6: 赵奶奶安静 + 林姐退场 ------
  doV4Quiet: function() {
    var self = this;
    this.showDialogue('narrator', '赵奶奶坐下来，喝了一口水。肩膀慢慢放松了。', function(){
      self.showDialogue('zhao', '……谢谢你，姑娘。', function(){
        self.showDialogue('narrator', '林姐没有纠正。她收拾好被碰倒的东西，扶赵奶奶坐稳。', function(){
          self.showDialogue('narrator', '林姐转头对你说：', function(){
            self.showDialogue('narrator', '"她到这个点就这样。夏天六七点，冬天四五点。习惯了。"', function(){
              self.showDialogue('narrator', '她推着赵奶奶的轮椅回房间。走到门口，赵奶奶回头看了你一眼，没说话——但她攥着外套领子的手指松开了。', function(){
                self.startPhase('v4_ending');
              });
            });
          });
        });
      });
    });
  },

  // ------ v4 阶段7: 场景收尾 ------
  doV4Ending: function() {
    var self = this;
    this.runDialogueQueue([
      { speaker:'narrator', text:'林姐说："你也早点回吧。天黑了。"她关上门。' },
      { speaker:'narrator', text:'你站在走廊里。门缝透出的光在黑暗中形成一条窄窄的亮线。', cb:function(){
        self.addFragment(
          4,
          '之前记录的"护工林姐"被划掉了。新写：\n不是护工。是女儿。\n她认不出她的时候，她就是护工。\n她每天黄昏都承受一次"被妈妈忘记"。\n她的方法是——不争辩，做该做的事。\n当语言失效的时候，一件外套和一个后退半步的动作，比任何话都管用。',
          '陈述为假',
          '证据：旧相框/值班表 + 叠图比对'
        );
        self.showToast('碎片 4/5 收集完成');
      }},
      { speaker:'narrator', text:'📓 虚实对账本已记录碎片 4/5', cb:function(){
        var gl = document.getElementById('game-wrapper');
        if (gl) gl.style.background = '';
        self.showSceneHint('探访四 · 完', 5000);
      }},
    ]);
  },
