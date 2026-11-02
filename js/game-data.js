/* ==========================================================================
 * 《姐弟厨师团》 · 互动课内容配置（js/game-data.js）
 * --------------------------------------------------------------------------
 * 本文件由 tools/build-game-config.js 从当前 index.html / lyric.html 生成。
 * 请不要手改；教程内容更新后重新运行生成器。
 * ========================================================================== */
(function(root, factory){
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.COURSE_CONFIG = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
'use strict';
return {
  "schemaVersion": 1,
  "contentVersion": "v1.38-derived",
  "generatedAt": "2026-11-02",
  "courses": [
    {
      "id": "music",
      "title": "乐理课",
      "short": "听出来",
      "intro": "把乐理课的每一张卡片变成一页可玩、可跳过的知识点。",
      "accent": "purple"
    },
    {
      "id": "lyric",
      "title": "作词课",
      "short": "改出来",
      "intro": "把作词课的每一张卡片变成一页可查、可练、可跳过的判据。",
      "accent": "amber"
    }
  ],
  "pages": [
    {
      "id": "music.s-start.intro",
      "course": "music",
      "chapter": "00 先弄响一架钢琴",
      "title": "先弄响一架钢琴",
      "goal": "先确认音箱开着。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "先确认音箱开着。下面这架键盘是活的：点白键黑键都会出声； 选好\"调\"和\"调式\"后，属于这个音阶的键会亮起来——你能直接看见哪些音被选中，这就是调式的全部秘密。"
        }
      ],
      "skip": true,
      "order": 1,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-start.c1",
      "course": "music",
      "chapter": "00 先弄响一架钢琴",
      "title": "先弄响一架钢琴 · 1",
      "goal": "调（主音） 调式 当前：C 大调（Ionian） 规则：2 2 1 2 2 2 明亮 · 稳定",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "调（主音）"
        },
        {
          "type": "text",
          "text": "调式"
        },
        {
          "type": "tip",
          "text": "当前：C 大调（Ionian） 规则：2 2 1 2 2 2 明亮 · 稳定"
        }
      ],
      "skip": true,
      "order": 2,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-halfnote.intro",
      "course": "music",
      "chapter": "01 半音、全音与音程",
      "title": "半音、全音与音程",
      "goal": "音乐的最小单位是半音（钢琴上相邻的两个键，中间没有别的键）。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "音乐的最小单位是半音（钢琴上相邻的两个键，中间没有别的键）。 两个半音是一个全音。所有\"风格差异\"都能还原成一串半音的排布——记住这句话，后面全部内容都是它的推论。"
        }
      ],
      "skip": true,
      "order": 3,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-halfnote.c1",
      "course": "music",
      "chapter": "01 半音、全音与音程",
      "title": "先量两个音之间有多远",
      "goal": "先量两个音之间有多远 起点 终点 音程名称 大三度 包含几个半音 4 个 C4 → E4：亮、宽。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "先量两个音之间有多远"
        },
        {
          "type": "text",
          "text": "起点"
        },
        {
          "type": "text",
          "text": "终点"
        },
        {
          "type": "text",
          "text": "音程名称"
        },
        {
          "type": "text",
          "text": "大三度"
        },
        {
          "type": "text",
          "text": "包含几个半音"
        },
        {
          "type": "text",
          "text": "4 个"
        },
        {
          "type": "tip",
          "text": "C4 → E4：亮、宽。大调的味道就在这。"
        }
      ],
      "skip": true,
      "order": 4,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-halfnote.c2",
      "course": "music",
      "chapter": "01 半音、全音与音程",
      "title": "十三个音程的听感（点一行听一下）",
      "goal": "十三个音程的听感（点一行听一下）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "十三个音程的听感（点一行听一下）"
        },
        {
          "type": "table",
          "headers": [
            "音程",
            "半音数",
            "听感关键词",
            ""
          ],
          "rows": [
            [
              "纯一度",
              "0",
              "同一个音。静止、不动",
              "▶"
            ],
            [
              "小二度",
              "1",
              "刺耳、悬着、想解决（恐怖片最爱）",
              "▶"
            ],
            [
              "大二度",
              "2",
              "全音。走两步，叙事感",
              "▶"
            ],
            [
              "小三度",
              "3",
              "暗、柔。小调的味道就在这",
              "▶"
            ],
            [
              "大三度",
              "4",
              "亮、宽。大调的味道就在这",
              "▶"
            ],
            [
              "纯四度",
              "5",
              "开阔、踏实（婚礼进行曲开头）",
              "▶"
            ],
            [
              "三全音",
              "6",
              "极不安。中世纪叫\"音乐里的魔鬼\"",
              "▶"
            ],
            [
              "纯五度",
              "7",
              "最稳。空，像在高原上",
              "▶"
            ],
            [
              "小六度",
              "8",
              "怀旧、有点酸",
              "▶"
            ],
            [
              "大六度",
              "9",
              "温柔、舒展",
              "▶"
            ],
            [
              "小七度",
              "10",
              "爵士味、未解决的渴望",
              "▶"
            ],
            [
              "大七度",
              "11",
              "差一点就到家了，最揪心",
              "▶"
            ],
            [
              "纯八度",
              "12",
              "回到同一个音，只是更高",
              "▶"
            ]
          ]
        }
      ],
      "skip": true,
      "order": 5,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-majmin.intro",
      "course": "music",
      "chapter": "02 大调与小调：差的就是一个半音",
      "title": "大调与小调：差的就是一个半音",
      "goal": "大调的排列规则是\"全 全 半 全 全 全 半\"，小调是\"全 半 全 全 半 全 全\"。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "大调的排列规则是\"全 全 半 全 全 全 半\"，小调是\"全 半 全 全 半 全 全\"。 两列唯一本质的区别是第三级往下掉了半格。那一格就是阳光和忧伤的分界线——小调听起来\"暗\"不是玄学，是物理。"
        }
      ],
      "skip": true,
      "order": 6,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-majmin.c1",
      "course": "music",
      "chapter": "02 大调与小调：差的就是一个半音",
      "title": "大调 全 全 半 全 全 全 半",
      "goal": "大调 全 全 半 全 全 全 半 C C♯ D D♯ E F F♯ G G♯ A A♯ B C4 1 D4 2 E4 3 F4 4 G4 5 A4 6 B4 7",
      "estimatedSeconds": 100,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "大调 全 全 半 全 全 全 半"
        },
        {
          "type": "text",
          "text": "C"
        },
        {
          "type": "text",
          "text": "C♯"
        },
        {
          "type": "text",
          "text": "D"
        },
        {
          "type": "text",
          "text": "D♯"
        },
        {
          "type": "text",
          "text": "E"
        },
        {
          "type": "text",
          "text": "F"
        },
        {
          "type": "text",
          "text": "F♯"
        },
        {
          "type": "text",
          "text": "G"
        },
        {
          "type": "text",
          "text": "G♯"
        },
        {
          "type": "text",
          "text": "A"
        },
        {
          "type": "text",
          "text": "A♯"
        },
        {
          "type": "text",
          "text": "B"
        },
        {
          "type": "text",
          "text": "C4"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "D4"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "E4"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "F4"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "G4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "A4"
        },
        {
          "type": "text",
          "text": "6"
        },
        {
          "type": "text",
          "text": "B4"
        },
        {
          "type": "text",
          "text": "7"
        },
        {
          "type": "text",
          "text": "C5"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "audio",
          "label": "播放大调音阶",
          "notes": [
            60,
            62,
            64,
            65,
            67,
            69,
            71,
            72
          ],
          "gap": 0.3
        },
        {
          "type": "audio",
          "label": "配个大三和弦",
          "notes": [
            60,
            64,
            67
          ],
          "gap": 0.45
        },
        {
          "type": "tip",
          "text": "第三级到主音是大三度（4 个半音）→ 敞亮。儿歌、节日、阳光几乎全在这。"
        }
      ],
      "skip": true,
      "order": 7,
      "task": {
        "type": "action",
        "prompt": "听完演示后过页",
        "label": "我听完了",
        "explain": "听到比记住更重要；没听清可以回上一页再听。"
      }
    },
    {
      "id": "music.s-majmin.c2",
      "course": "music",
      "chapter": "02 大调与小调：差的就是一个半音",
      "title": "小调 全 半 全 全 半 全 全",
      "goal": "小调 全 半 全 全 半 全 全 C C♯ D D♯ E F F♯ G G♯ A A♯ B C4 1 D4 2 D♯4 3 F4 4 G4 5 G♯4 6 A♯",
      "estimatedSeconds": 100,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "小调 全 半 全 全 半 全 全"
        },
        {
          "type": "text",
          "text": "C"
        },
        {
          "type": "text",
          "text": "C♯"
        },
        {
          "type": "text",
          "text": "D"
        },
        {
          "type": "text",
          "text": "D♯"
        },
        {
          "type": "text",
          "text": "E"
        },
        {
          "type": "text",
          "text": "F"
        },
        {
          "type": "text",
          "text": "F♯"
        },
        {
          "type": "text",
          "text": "G"
        },
        {
          "type": "text",
          "text": "G♯"
        },
        {
          "type": "text",
          "text": "A"
        },
        {
          "type": "text",
          "text": "A♯"
        },
        {
          "type": "text",
          "text": "B"
        },
        {
          "type": "text",
          "text": "C4"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "D4"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "D♯4"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "F4"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "G4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "G♯4"
        },
        {
          "type": "text",
          "text": "6"
        },
        {
          "type": "text",
          "text": "A♯4"
        },
        {
          "type": "text",
          "text": "7"
        },
        {
          "type": "text",
          "text": "C5"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "audio",
          "label": "播放小调音阶",
          "notes": [
            60,
            62,
            63,
            65,
            67,
            68,
            70,
            72
          ],
          "gap": 0.3
        },
        {
          "type": "audio",
          "label": "配个小三和弦",
          "notes": [
            60,
            63,
            67
          ],
          "gap": 0.45
        },
        {
          "type": "tip",
          "text": "第三级掉半格，换成小三度（3 个半音）→ 一开口就是深夜。"
        }
      ],
      "skip": true,
      "order": 8,
      "task": {
        "type": "action",
        "prompt": "听完演示后过页",
        "label": "我听完了",
        "explain": "听到比记住更重要；没听清可以回上一页再听。"
      }
    },
    {
      "id": "music.s-majmin.c3",
      "course": "music",
      "chapter": "02 大调与小调：差的就是一个半音",
      "title": "同一条旋律，两副面孔",
      "goal": "同一条旋律，两副面孔 两句用的级数完全一样（都是 1 3 5 5 3 2 3 2 1），只是第一句按大调、第二句按小调。",
      "estimatedSeconds": 95,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "同一条旋律，两副面孔"
        },
        {
          "type": "text",
          "text": "两句用的级数完全一样（都是 1 3 5 5 3 2 3 2 1），只是第一句按大调、第二句按小调。 调式一换，同一串级数的脸色就变了——放一次你就能听出差别在哪。"
        },
        {
          "type": "audio",
          "label": "大调版：1 3 5 5 3 2 3 2 1",
          "notes": [
            60,
            64,
            67,
            67,
            64,
            62,
            64,
            62,
            60
          ],
          "gap": 0.36
        },
        {
          "type": "audio",
          "label": "小调版：1 3 5 5 3 2 3 2 1",
          "notes": [
            60,
            63,
            67,
            67,
            63,
            62,
            63,
            62,
            60
          ],
          "gap": 0.36
        }
      ],
      "skip": true,
      "order": 9,
      "task": {
        "type": "action",
        "prompt": "听完演示后过页",
        "label": "我听完了",
        "explain": "听到比记住更重要；没听清可以回上一页再听。"
      }
    },
    {
      "id": "music.s-majmin.c4",
      "course": "music",
      "chapter": "02 大调与小调：差的就是一个半音",
      "title": "小调的三种形态",
      "goal": "小调的三种形态 自然小调就是上面那样。",
      "estimatedSeconds": 53,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "小调的三种形态"
        },
        {
          "type": "text",
          "text": "自然小调就是上面那样。把第七级临时抬高半格，叫和声小调； 上行把第六、七级一起抬、下行还原，叫旋律小调——两者只差第六级这一个音， 听感却从\"送别\"变成\"西化的甜\"。 那一下抬高的半格会产生强烈的\"要回家\"的拉力——《舒伯特小夜曲》里那种叹气就是它。"
        },
        {
          "type": "tip",
          "text": "点一个听。"
        }
      ],
      "skip": true,
      "order": 10,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-modes.intro",
      "course": "music",
      "chapter": "03 七个调式：同一串白键，换个音起步",
      "title": "七个调式：同一串白键，换个音起步",
      "goal": "钢琴上 C 到 B 是七个白键。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "钢琴上 C 到 B 是七个白键。从不同的白键起步、只用白键上下行，你会得到七种不同的味道—— 这就是教会调式。它们不是七个新音阶，而是同一串音的七种落点。"
        }
      ],
      "skip": true,
      "order": 11,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-modes.c1",
      "course": "music",
      "chapter": "03 七个调式：同一串白键，换个音起步",
      "title": "从哪个音起步？（点一下，键盘会亮，同时出声）",
      "goal": "从哪个音起步？",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "从哪个音起步？（点一下，键盘会亮，同时出声）"
        },
        {
          "type": "tip",
          "text": "点一个音开始。"
        }
      ],
      "skip": true,
      "order": 12,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-modes.c2",
      "course": "music",
      "chapter": "03 七个调式：同一串白键，换个音起步",
      "title": "七个调式的全貌",
      "goal": "七个调式的全貌 同一串白键，七种起点（紫 = 相对大调改动过的音，红 = 正在发声） 调式 ↓ C C♯ D D♯ E F F♯ G G♯ A A♯ B 大调",
      "estimatedSeconds": 87,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "七个调式的全貌"
        },
        {
          "type": "text",
          "text": "同一串白键，七种起点（紫 = 相对大调改动过的音，红 = 正在发声）"
        },
        {
          "type": "text",
          "text": "调式 ↓"
        },
        {
          "type": "text",
          "text": "C"
        },
        {
          "type": "text",
          "text": "C♯"
        },
        {
          "type": "text",
          "text": "D"
        },
        {
          "type": "text",
          "text": "D♯"
        },
        {
          "type": "text",
          "text": "E"
        },
        {
          "type": "text",
          "text": "F"
        },
        {
          "type": "text",
          "text": "F♯"
        },
        {
          "type": "text",
          "text": "G"
        },
        {
          "type": "text",
          "text": "G♯"
        },
        {
          "type": "text",
          "text": "A"
        },
        {
          "type": "text",
          "text": "A♯"
        },
        {
          "type": "text",
          "text": "B"
        },
        {
          "type": "text",
          "text": "大调"
        },
        {
          "type": "text",
          "text": "Ionian"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "6"
        },
        {
          "type": "text",
          "text": "7"
        },
        {
          "type": "text",
          "text": "多利亚"
        },
        {
          "type": "text",
          "text": "Dorian"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "6"
        },
        {
          "type": "text",
          "text": "7"
        },
        {
          "type": "text",
          "text": "弗里几亚"
        },
        {
          "type": "text",
          "text": "Phrygian"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "6"
        },
        {
          "type": "text",
          "text": "7"
        },
        {
          "type": "text",
          "text": "利底亚"
        },
        {
          "type": "text",
          "text": "Lydian"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "6"
        },
        {
          "type": "text",
          "text": "7"
        },
        {
          "type": "text",
          "text": "混合利底亚"
        },
        {
          "type": "text",
          "text": "Mixolydian"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "6"
        },
        {
          "type": "text",
          "text": "7"
        },
        {
          "type": "text",
          "text": "自然小调"
        },
        {
          "type": "text",
          "text": "Aeolian"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "6"
        },
        {
          "type": "text",
          "text": "7"
        },
        {
          "type": "text",
          "text": "洛克里亚"
        },
        {
          "type": "text",
          "text": "Locrian"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "6"
        },
        {
          "type": "text",
          "text": "7"
        },
        {
          "type": "text",
          "text": "与大调相同"
        },
        {
          "type": "text",
          "text": "相对大调改动过的音（调式的性格就在这） 纵轴即音高"
        },
        {
          "type": "text",
          "text": "正在发声"
        },
        {
          "type": "tip",
          "text": "横轴是十二个半音格，纵向位置就是真实音高。橙色块的上下移动，就是这个调式的性格来源。"
        }
      ],
      "skip": true,
      "order": 13,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-modes.c3",
      "course": "music",
      "chapter": "03 七个调式：同一串白键，换个音起步",
      "title": "逐个听、逐个认（点一行播放）",
      "goal": "逐个听、逐个认（点一行播放）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "逐个听、逐个认（点一行播放）"
        },
        {
          "type": "table",
          "headers": [
            "调式",
            "怎么从大调改",
            "性格",
            "你大概听过的",
            ""
          ],
          "rows": [
            [
              "大调Ionian",
              "基准，无改动",
              "明亮 · 稳定",
              "小星星、欢乐颂、儿歌",
              "▶"
            ],
            [
              "多利亚Dorian",
              "第6级升高",
              "暗，但透光",
              "Scarborough Fair、爱的罗曼史、很多民谣",
              "▶"
            ],
            [
              "弗里几亚Phrygian",
              "第2级降低",
              "暗 · 异域 · 危险",
              "佛拉明戈、金属riff",
              "▶"
            ],
            [
              "利底亚Lydian",
              "第4级升高",
              "极亮 · 梦幻 · 飘",
              "《辛普森一家》主题、《海绵宝宝》片头",
              "▶"
            ],
            [
              "混合利底亚Mixolydian",
              "第7级降低",
              "痞 · 不服输",
              "Sweet Home Alabama、布鲁斯摇滚",
              "▶"
            ],
            [
              "自然小调Aeolian",
              "第3、6、7级降低",
              "忧郁 · 影视标配",
              "大量苦情歌、史诗配乐",
              "▶"
            ],
            [
              "洛克里亚Locrian",
              "第2、3、5、6、7级降低",
              "极不稳定",
              "少用整曲，多见于金属riff和音效",
              "▶"
            ]
          ]
        }
      ],
      "skip": true,
      "order": 14,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-penta.intro",
      "course": "music",
      "chapter": "04 五声音阶：砍掉两个音，就有了中国味",
      "title": "五声音阶：砍掉两个音，就有了中国味",
      "goal": "把大调的 fa（第4级）和 si（第7级） 拿掉，剩下 do、re、mi、sol、la 五个音。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "把大调的 fa（第4级）和 si（第7级） 拿掉，剩下 do、re、mi、sol、la 五个音。 五个音之间没有任何半音，所以它不会咬你、不会紧张，只会稳稳托着你——这就是\"东方味\"的物理来源。"
        }
      ],
      "skip": true,
      "order": 15,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-penta.c1",
      "course": "music",
      "chapter": "04 五声音阶：砍掉两个音，就有了中国味",
      "title": "五声音阶：砍掉两个音，就有了中国味 · 1",
      "goal": "C C♯ D D♯ E F F♯ G G♯ A A♯ B C4 1 D4 2 E4 3 G4 4 A4 5 C5 1 纯五声太顺滑，容易听过就忘。",
      "estimatedSeconds": 124,
      "blocks": [
        {
          "type": "text",
          "text": "C"
        },
        {
          "type": "text",
          "text": "C♯"
        },
        {
          "type": "text",
          "text": "D"
        },
        {
          "type": "text",
          "text": "D♯"
        },
        {
          "type": "text",
          "text": "E"
        },
        {
          "type": "text",
          "text": "F"
        },
        {
          "type": "text",
          "text": "F♯"
        },
        {
          "type": "text",
          "text": "G"
        },
        {
          "type": "text",
          "text": "G♯"
        },
        {
          "type": "text",
          "text": "A"
        },
        {
          "type": "text",
          "text": "A♯"
        },
        {
          "type": "text",
          "text": "B"
        },
        {
          "type": "text",
          "text": "C4"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "D4"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "E4"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "G4"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "A4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "C5"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "audio",
          "label": "播放五声",
          "notes": [
            60,
            62,
            64,
            67,
            69,
            72
          ],
          "gap": 0.3
        },
        {
          "type": "audio",
          "label": "借个偏音 fa",
          "notes": [
            60,
            62,
            64,
            65,
            67,
            69,
            72
          ],
          "gap": 0.3
        },
        {
          "type": "audio",
          "label": "借个偏音 si",
          "notes": [
            60,
            62,
            64,
            67,
            69,
            71,
            72
          ],
          "gap": 0.3
        },
        {
          "type": "tip",
          "text": "纯五声太顺滑，容易听过就忘。偶尔借一个偏音进来，那一下摩擦就是记忆点——《东风破》比纯民歌多出的惆怅就在这。"
        }
      ],
      "skip": true,
      "order": 16,
      "task": {
        "type": "action",
        "prompt": "听完演示后过页",
        "label": "我听完了",
        "explain": "听到比记住更重要；没听清可以回上一页再听。"
      }
    },
    {
      "id": "music.s-penta.c2",
      "course": "music",
      "chapter": "04 五声音阶：砍掉两个音，就有了中国味",
      "title": "五个音，五种调（换个主音就换味道）",
      "goal": "五个音，五种调（换个主音就换味道） 宫=do、商=re、角=mi、徵=sol、羽=la。",
      "estimatedSeconds": 130,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "五个音，五种调（换个主音就换味道）"
        },
        {
          "type": "tip",
          "text": "宫=do、商=re、角=mi、徵=sol、羽=la。哪个音当主音，就叫什么调。"
        },
        {
          "type": "heading",
          "level": 3,
          "text": "国风与和风：两套音阶的\"家规\""
        },
        {
          "type": "text",
          "text": "第 13 节讲「文化与风格」时要用到。它们不是七个教会调式里的任何一个，而是各有地域与流派身份的调式—— 调式选择几乎就是风格选择。点一下听听。"
        },
        {
          "type": "text",
          "text": "中国：五声（宫商角徵羽）是同一组五个音换起点，所以你会了宫调，另外四个免费； 要更丰富的色彩就请两个「偏音」进屋——清角与变徵（第 4 级）、变宫与闰（第 7 级）， 请哪两位决定气质：雅乐（变徵+变宫）庄重、清乐（清角+变宫）明快、燕乐（清角+闰）悲怆。 秦腔把这套用到了极致：欢音徵调、苦音把本位 si 压成闰并用清角。"
        },
        {
          "type": "text",
          "text": "日本：音乐学家小泉文夫发现，邦乐音阶都符合同一个公式—— 两段「完全四度」骨架叠起来，每段里各放一个中间音；中间音放低一点或高一点，就成了不同的调式。 所以 Japanese 的四种基本调式只是同一个滑杆的四个位置：律（小二）、都节（更低）、 民谣（小三度）、琉球（最高）。都节把中间音放得最低，两个半音因此挨得最近， 那就是\"一耳朵听出日本\"的原因。"
        },
        {
          "type": "tip",
          "text": "都节音阶 日本 · 都节都节（平调子）= 1 2 ♭3 5 ♭6。小泉文夫发现：日本音阶都是「两个四度骨架 + 一个中间音」，都节把中间音放得最低，所以两个半音挨得最近——这就是一耳朵听出\"日本\"的原因。《樱花》就是它。"
        }
      ],
      "skip": true,
      "order": 17,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-chord.intro",
      "course": "music",
      "chapter": "05 和弦与和声：把音叠起来",
      "title": "和弦与和声：把音叠起来",
      "goal": "旋律是横着走的线，和弦是竖着堆的块。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "旋律是横着走的线，和弦是竖着堆的块。最常见的叠法是隔一个音取一个（三度叠置）。 大小调的全部差别，压缩到和弦上就一句话：中间那个音离根音是 4 个半音还是 3 个半音。"
        }
      ],
      "skip": true,
      "order": 18,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-chord.c1",
      "course": "music",
      "chapter": "05 和弦与和声：把音叠起来",
      "title": "大三 vs 小三：根音五音对齐，只有中间那根动了",
      "goal": "大三 vs 小三：根音五音对齐，只有中间那根动了 大三和弦（三音距根音 4 个半音） 小三和弦（三音距根音 3 个半音） 根音 距根音 0 个半音 C 三音 距",
      "estimatedSeconds": 157,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "大三 vs 小三：根音五音对齐，只有中间那根动了"
        },
        {
          "type": "audio",
          "label": "弹大三",
          "notes": [
            60,
            64,
            67
          ],
          "gap": 0.45
        },
        {
          "type": "audio",
          "label": "弹小三",
          "notes": [
            60,
            63,
            67
          ],
          "gap": 0.45
        },
        {
          "type": "audio",
          "label": "只弹那个三音",
          "notes": [
            60,
            64,
            63
          ],
          "gap": 0.6
        },
        {
          "type": "text",
          "text": "大三和弦（三音距根音 4 个半音）"
        },
        {
          "type": "text",
          "text": "小三和弦（三音距根音 3 个半音）"
        },
        {
          "type": "text",
          "text": "根音"
        },
        {
          "type": "text",
          "text": "距根音 0 个半音"
        },
        {
          "type": "text",
          "text": "C"
        },
        {
          "type": "text",
          "text": "三音"
        },
        {
          "type": "text",
          "text": "距根音 4 个半音"
        },
        {
          "type": "text",
          "text": "E"
        },
        {
          "type": "text",
          "text": "五音"
        },
        {
          "type": "text",
          "text": "距根音 7 个半音"
        },
        {
          "type": "text",
          "text": "G"
        },
        {
          "type": "text",
          "text": "根音"
        },
        {
          "type": "text",
          "text": "距根音 0 个半音"
        },
        {
          "type": "text",
          "text": "C"
        },
        {
          "type": "text",
          "text": "三音"
        },
        {
          "type": "text",
          "text": "距根音 3 个半音"
        },
        {
          "type": "text",
          "text": "E♭"
        },
        {
          "type": "text",
          "text": "五音"
        },
        {
          "type": "text",
          "text": "距根音 7 个半音"
        },
        {
          "type": "text",
          "text": "G"
        },
        {
          "type": "text",
          "text": "只低 1 个半音"
        },
        {
          "type": "text",
          "text": "0"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "7"
        },
        {
          "type": "text",
          "text": "半音↓"
        },
        {
          "type": "text",
          "text": "虚线横贯两列的地方，就是\"根音\"和\"五音\"的位置——它们一模一样，只有三音那根条动了。"
        },
        {
          "type": "tip",
          "text": "横虚线跨过两列的位置就是根音和五音——它们完全没动。只有三音往下挪了半格（图里那根 1 格高的双向箭头）。 这 1 个半音，就是\"亮\"与\"暗\"的全部分界线。跟着上面选的主音走，图会一起变。"
        }
      ],
      "skip": true,
      "order": 19,
      "task": {
        "type": "action",
        "prompt": "听完演示后过页",
        "label": "我听完了",
        "explain": "听到比记住更重要；没听清可以回上一页再听。"
      }
    },
    {
      "id": "music.s-chord.c2",
      "course": "music",
      "chapter": "05 和弦与和声：把音叠起来",
      "title": "音级上的和弦：级数与功能",
      "goal": "音级上的和弦：级数与功能 调性 在调式音阶上，每一级都能叠出一个三和弦。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "音级上的和弦：级数与功能"
        },
        {
          "type": "text",
          "text": "调性"
        },
        {
          "type": "text",
          "text": "在调式音阶上，每一级都能叠出一个三和弦。 写歌时你只需要说\"来一个 6 级\"，全世界吉他手都知道该弹什么。"
        },
        {
          "type": "table",
          "headers": [
            "级数",
            "和弦",
            "性质",
            "功能角色",
            ""
          ],
          "rows": [
            [
              "I",
              "C4",
              "大三",
              "主",
              "▶ 弹"
            ],
            [
              "ii",
              "D4m",
              "小三",
              "下属",
              "▶ 弹"
            ],
            [
              "iii",
              "E4m",
              "小三",
              "色彩",
              "▶ 弹"
            ],
            [
              "IV",
              "F4",
              "大三",
              "下属",
              "▶ 弹"
            ],
            [
              "V",
              "G4",
              "大三",
              "属",
              "▶ 弹"
            ],
            [
              "vi",
              "A4m",
              "小三",
              "色彩",
              "▶ 弹"
            ],
            [
              "vii°",
              "B4dim",
              "减",
              "属",
              "▶ 弹"
            ]
          ]
        }
      ],
      "skip": true,
      "order": 20,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-chord.c3",
      "course": "music",
      "chapter": "05 和弦与和声：把音叠起来",
      "title": "和弦进行：让和弦一个接一个\"走\"起来",
      "goal": "和弦进行：让和弦一个接一个\"走\"起来 和弦单独听只是\"颜色\"，接起来才有情绪走向。",
      "estimatedSeconds": 56,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "和弦进行：让和弦一个接一个\"走\"起来"
        },
        {
          "type": "text",
          "text": "和弦单独听只是\"颜色\"，接起来才有情绪走向。下面六个进行覆盖了流行乐一大半的歌， 每个和弦块可以点开单独听，也能整条播放、调速、循环。"
        },
        {
          "type": "text",
          "text": "速度"
        },
        {
          "type": "text",
          "text": "88"
        },
        {
          "type": "text",
          "text": "循环"
        },
        {
          "type": "text",
          "text": "I"
        },
        {
          "type": "text",
          "text": "C4"
        },
        {
          "type": "text",
          "text": "大"
        },
        {
          "type": "text",
          "text": "V"
        },
        {
          "type": "text",
          "text": "G4"
        },
        {
          "type": "text",
          "text": "大"
        },
        {
          "type": "text",
          "text": "vi"
        },
        {
          "type": "text",
          "text": "A4m"
        },
        {
          "type": "text",
          "text": "小"
        },
        {
          "type": "text",
          "text": "IV"
        },
        {
          "type": "text",
          "text": "F4"
        },
        {
          "type": "text",
          "text": "大"
        },
        {
          "type": "tip",
          "text": "I – V – vi – IV — 万能流行，最安全的一挂"
        }
      ],
      "skip": true,
      "order": 21,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-cadence.intro",
      "course": "music",
      "chapter": "06 乐句怎么落点：终止式",
      "title": "乐句怎么落点：终止式",
      "goal": "和弦进行是\"句子\"，终止式就是\"句号\"。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "和弦进行是\"句子\"，终止式就是\"句号\"。同样一串和弦，收尾方式不同，听感能从\"踏实落地\"变成\"悬在半空\"。 副歌最后两拍怎么放，基本由这一条决定。"
        }
      ],
      "skip": true,
      "order": 22,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-cadence.c1",
      "course": "music",
      "chapter": "06 乐句怎么落点：终止式",
      "title": "五种收尾方式（点一下听）",
      "goal": "五种收尾方式（点一下听） V G4 大 I C4 大 正格终止 V → I — 最硬的回家。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "五种收尾方式（点一下听）"
        },
        {
          "type": "text",
          "text": "V"
        },
        {
          "type": "text",
          "text": "G4"
        },
        {
          "type": "text",
          "text": "大"
        },
        {
          "type": "text",
          "text": "I"
        },
        {
          "type": "text",
          "text": "C4"
        },
        {
          "type": "text",
          "text": "大"
        },
        {
          "type": "tip",
          "text": "正格终止 V → I — 最硬的回家。属和弦把耳朵一把拽到主和弦上，\"噔——定\"。流行副歌结尾九成用它。"
        }
      ],
      "skip": true,
      "order": 23,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-cadence.c2",
      "course": "music",
      "chapter": "06 乐句怎么落点：终止式",
      "title": "副歌怎么把情绪\"抬\"起来",
      "goal": "副歌怎么把情绪\"抬\"起来 副歌 · 高八度 主歌 · 中低音区 C5 C3 D5 D3 E5 E3 F5 F3 G5 G3 F5 F3 E5 E3 D5 D3",
      "estimatedSeconds": 66,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "副歌怎么把情绪\"抬\"起来"
        },
        {
          "type": "text",
          "text": "副歌 · 高八度"
        },
        {
          "type": "text",
          "text": "主歌 · 中低音区"
        },
        {
          "type": "text",
          "text": "C5"
        },
        {
          "type": "text",
          "text": "C3"
        },
        {
          "type": "text",
          "text": "D5"
        },
        {
          "type": "text",
          "text": "D3"
        },
        {
          "type": "text",
          "text": "E5"
        },
        {
          "type": "text",
          "text": "E3"
        },
        {
          "type": "text",
          "text": "F5"
        },
        {
          "type": "text",
          "text": "F3"
        },
        {
          "type": "text",
          "text": "G5"
        },
        {
          "type": "text",
          "text": "G3"
        },
        {
          "type": "text",
          "text": "F5"
        },
        {
          "type": "text",
          "text": "F3"
        },
        {
          "type": "text",
          "text": "E5"
        },
        {
          "type": "text",
          "text": "E3"
        },
        {
          "type": "text",
          "text": "D5"
        },
        {
          "type": "text",
          "text": "D3"
        },
        {
          "type": "text",
          "text": "↑八度"
        },
        {
          "type": "text",
          "text": "两行形状一模一样——同一段旋律搬到高音区，情绪就\"扬\"起来了。"
        },
        {
          "type": "tip",
          "text": "最省力的一招：同一段旋律，主歌放在中低音区\"说\"，副歌原样搬到高音区\"喊\"。 写的时候不用另写一条新旋律，情绪却直接翻倍。除了抬八度，还有四招同样有效——加快节奏密度、力度推强、配器加厚、以及减少休止。"
        }
      ],
      "skip": true,
      "order": 24,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-tempo.intro",
      "course": "music",
      "chapter": "07 速度：行板就在这一节",
      "title": "速度：行板就在这一节",
      "goal": "乐谱左上角那些意大利语词是速度指令，本质是\"每分钟几拍\"的粗略规定。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "乐谱左上角那些意大利语词是速度指令，本质是\"每分钟几拍\"的粗略规定。 最常搞错的是行板（Andante）不等于慢——它是\"从容地走\"，约 76～108 BPM，和你散步的速度差不多。"
        }
      ],
      "skip": true,
      "order": 25,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-tempo.c1",
      "course": "music",
      "chapter": "07 速度：行板就在这一节",
      "title": "点一个术语：同一段旋律，只换速度（点两次可以对比）",
      "goal": "点一个术语：同一段旋律，只换速度（点两次可以对比） 1 2 3 4 行板 Andante · 约 88 BPM · 像散步，抒情歌最常用",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "点一个术语：同一段旋律，只换速度（点两次可以对比）"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "tip",
          "text": "行板 Andante · 约 88 BPM · 像散步，抒情歌最常用"
        }
      ],
      "skip": true,
      "order": 26,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-tempo.c2",
      "course": "music",
      "chapter": "07 速度：行板就在这一节",
      "title": "节拍器",
      "goal": "节拍器 每小节 速度 90 1 2 3 4 第一拍重，其余轻。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "节拍器"
        },
        {
          "type": "text",
          "text": "每小节"
        },
        {
          "type": "text",
          "text": "速度"
        },
        {
          "type": "text",
          "text": "90"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "tip",
          "text": "第一拍重，其余轻。觉得\"行板\"抽象的话，把它调到 80～90 拍——那就是行板的走路感。"
        }
      ],
      "skip": true,
      "order": 27,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-meter.intro",
      "course": "music",
      "chapter": "08 拍号与节奏：音乐怎么\"摆\"",
      "title": "拍号与节奏：音乐怎么\"摆\"",
      "goal": "上面数字＝每小节几拍，下面＝几分音符算一拍。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "上面数字＝每小节几拍，下面＝几分音符算一拍。4/4 是流行乐标配（一二三四）， 3/4 是圆舞曲的荡动感，6/8 是两个三拍组（一二三 二二三），慢歌用它特别抒情。"
        }
      ],
      "skip": true,
      "order": 28,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-meter.c1",
      "course": "music",
      "chapter": "08 拍号与节奏：音乐怎么\"摆\"",
      "title": "拍号与节奏：音乐怎么\"摆\" · 1",
      "goal": "强 · 4/4 · 流行标配 · 四拍一循环第1拍最重、第3拍次重。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "强"
        },
        {
          "type": "text",
          "text": "·"
        },
        {
          "type": "tip",
          "text": "4/4 · 流行标配 · 四拍一循环第1拍最重、第3拍次重。一二三四，人的心跳和走路都在这上面。"
        }
      ],
      "skip": true,
      "order": 29,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-meter.c2",
      "course": "music",
      "chapter": "08 拍号与节奏：音乐怎么\"摆\"",
      "title": "两种让节奏\"活\"起来的办法",
      "goal": "两种让节奏\"活\"起来的办法 下面每组都会全程打着拍点（\"嗒、嗒、嗒…\"），你再听旋律是踩在点上还是抢在点前——单听旋律两者几乎一样，有节拍器才分得出来。",
      "estimatedSeconds": 165,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "两种让节奏\"活\"起来的办法"
        },
        {
          "type": "text",
          "text": "下面每组都会全程打着拍点（\"嗒、嗒、嗒…\"），你再听旋律是踩在点上还是抢在点前——单听旋律两者几乎一样，有节拍器才分得出来。"
        },
        {
          "type": "text",
          "text": "弱起"
        },
        {
          "type": "text",
          "text": "：抢在正拍前进来 1/5 拍，一句立刻有了\"冲出去\"的劲。"
        },
        {
          "type": "audio",
          "label": "正拍进（踩点）",
          "notes": [
            60,
            62,
            64,
            65,
            67,
            65,
            64,
            62
          ],
          "gap": 0.4,
          "lead": 1.6,
          "clicks": [
            0,
            0.4,
            0.8,
            1.2000000000000002,
            1.6,
            2,
            2.4000000000000004,
            2.8000000000000003,
            3.2,
            3.6,
            4,
            4.4,
            4.800000000000001
          ]
        },
        {
          "type": "audio",
          "label": "弱起进（抢拍）",
          "notes": [
            60,
            62,
            64,
            65,
            67,
            65,
            64,
            62
          ],
          "gap": 0.4,
          "lead": 1.4,
          "clicks": [
            0,
            0.4,
            0.8,
            1.2000000000000002,
            1.6,
            2,
            2.4000000000000004,
            2.8000000000000003,
            3.2,
            3.6,
            4,
            4.4,
            4.800000000000001
          ]
        },
        {
          "type": "text",
          "text": "切分"
        },
        {
          "type": "text",
          "text": "：把重音挪到反拍，节奏就从\"走路\"变成\"歪着想走\"。"
        },
        {
          "type": "audio",
          "label": "正拍（踩点）",
          "notes": [
            60,
            60,
            62,
            62,
            64,
            64,
            65,
            65
          ],
          "gap": 0.4,
          "lead": 0,
          "clicks": [
            0,
            0.4,
            0.8,
            1.2000000000000002,
            1.6,
            2,
            2.4000000000000004,
            2.8000000000000003,
            3.2
          ]
        },
        {
          "type": "audio",
          "label": "切分（落在两点之间）",
          "notes": [
            60,
            60,
            62,
            62,
            64,
            64,
            65,
            65
          ],
          "gap": 0.4,
          "lead": 0.2,
          "clicks": [
            0,
            0.4,
            0.8,
            1.2000000000000002,
            1.6,
            2,
            2.4000000000000004,
            2.8000000000000003,
            3.2
          ]
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "6"
        },
        {
          "type": "text",
          "text": "7"
        },
        {
          "type": "text",
          "text": "8"
        },
        {
          "type": "tip",
          "text": "圆点＝节拍器的\"嗒\"，会一路陪到旋律结束。盯住圆点看：旋律的第一个音是正好落在圆点上，还是抢在圆点前面。"
        }
      ],
      "skip": true,
      "order": 30,
      "task": {
        "type": "action",
        "prompt": "听完演示后过页",
        "label": "我听完了",
        "explain": "听到比记住更重要；没听清可以回上一页再听。"
      }
    },
    {
      "id": "music.s-groove.intro",
      "course": "music",
      "chapter": "09 律动：节奏型怎么设计",
      "title": "律动：节奏型怎么设计",
      "goal": "上一节解决的是\"一拍里有几个单位\"（4/4 还是 3/4，第 08 节）。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "上一节解决的是\"一拍里有几个单位\"（4/4 还是 3/4，第 08 节）。这一节解决这些单位上怎么打。 同一段和声、同一个速度，只把打法换一换，听感能从\"宣誓\"变成\"赶路\"。 节奏型看着花样很多，其实只由三个决定构成——一拍里打几下、哪一下最响、两下之间留多久。 三个都定了，性格就定了，剩下的只是挑哪个。"
        }
      ],
      "skip": true,
      "order": 31,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-groove.c1",
      "course": "music",
      "chapter": "09 律动：节奏型怎么设计",
      "title": "① 三个决定：密度、重音、音长",
      "goal": "① 三个决定：密度、重音、音长 看到一段节奏觉得\"好听但说不清为什么\"，就把它拆成这三栏。",
      "estimatedSeconds": 99,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "① 三个决定：密度、重音、音长"
        },
        {
          "type": "text",
          "text": "看到一段节奏觉得\"好听但说不清为什么\"，就把它拆成这三栏。三栏一念出来，它是什么性格就清楚了。"
        },
        {
          "type": "text",
          "text": "决定一 · 密度"
        },
        {
          "type": "text",
          "text": "一拍打几下"
        },
        {
          "type": "text",
          "text": "这就是\"听感快慢\"的来源："
        },
        {
          "type": "text",
          "text": "每拍一个音头"
        },
        {
          "type": "text",
          "text": "是走路，"
        },
        {
          "type": "text",
          "text": "每拍四个"
        },
        {
          "type": "text",
          "text": "是跑起来。 速度（BPM）只管时钟走多快，密度才决定耳朵觉得快不快。"
        },
        {
          "type": "text",
          "text": "决定二 · 重音"
        },
        {
          "type": "text",
          "text": "哪一下最响"
        },
        {
          "type": "text",
          "text": "重音是\"让人点头\"的那一下。它落在正拍，人跟着踩；落在反拍，人会晃。"
        },
        {
          "type": "text",
          "text": "重音换了位置，同一个节奏型就换了一种身体动作。"
        },
        {
          "type": "text",
          "text": "决定三 · 音长"
        },
        {
          "type": "text",
          "text": "两下之间留多久"
        },
        {
          "type": "text",
          "text": "音长越短越\"颗粒\"，越长越\"连成片\"。同样四个音头，"
        },
        {
          "type": "text",
          "text": "0.35 拍是紧张，0.85 拍是流水"
        },
        {
          "type": "text",
          "text": "——差别不在打了几下，在每一一下能拖多远。"
        },
        {
          "type": "tip",
          "text": "这三条不是新东西：第 13 节会把\"音头密度＝每秒几个音头\"单独讲透， 而织体表 `TEX` 记的就是\"音头落在第几拍 + 音多长\"。这一节要做的只是把它当设计工具用—— 不是\"有哪些节奏型\"，而是\"我这一段该选哪个\"。"
        }
      ],
      "skip": true,
      "order": 32,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-groove.c2",
      "course": "music",
      "chapter": "09 律动：节奏型怎么设计",
      "title": "② 听一遍：同一段和声，五种打法",
      "goal": "② 听一遍：同一段和声，五种打法 五张卡用的是同一段和声、同一个速度（104 BPM）， 只有节奏型不同。",
      "estimatedSeconds": 90,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "② 听一遍：同一段和声，五种打法"
        },
        {
          "type": "text",
          "text": "五张卡用的是同一段和声、同一个速度（104 BPM）， 只有节奏型不同。所以听到的所有差别，都只能来自\"怎么打\"。 图上八个小格＝两拍（十六分一格）：实心块是重音，浅色是弱拍音头，方块右边那条尾巴是音长。"
        },
        {
          "type": "text",
          "text": "拍 1"
        },
        {
          "type": "text",
          "text": "拍 2"
        },
        {
          "type": "text",
          "text": "一格＝十六分 · 实心块＝音头（深色那下是重音）· 格下细条＝音长（2.00 拍）"
        },
        {
          "type": "text",
          "text": "块状"
        },
        {
          "type": "text",
          "text": "（织体"
        },
        {
          "type": "text",
          "text": "block"
        },
        {
          "type": "text",
          "text": "）· 每拍"
        },
        {
          "type": "text",
          "text": "0.5"
        },
        {
          "type": "text",
          "text": "个音头 · 听感"
        },
        {
          "type": "text",
          "text": "0.87"
        },
        {
          "type": "text",
          "text": "音头/秒 · 每个音长"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "拍"
        },
        {
          "type": "text",
          "text": "重音落在：每个和弦的第一下，其余都是弱拍"
        },
        {
          "type": "text",
          "text": "性格：沉、稳、有分量 · 什么时候用：一句话一锤：宣言、仪式、开场第一下"
        },
        {
          "type": "tip",
          "text": "注意\"碎音\"和\"琶音\"的格子长得一模一样——音头位置完全相同，只有音长不同。 碎音听起来紧、琶音听起来流，差别就在那条尾巴上。这就是\"决定三\"最直接的证据。"
        }
      ],
      "skip": true,
      "order": 33,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-groove.c3",
      "course": "music",
      "chapter": "09 律动：节奏型怎么设计",
      "title": "③ 选型表：不问哪个好听，问这一段要它干什么",
      "goal": "③ 选型表：不问哪个好听，问这一段要它干什么 写歌时纠结\"配什么节奏\"，通常是因为在问审美问题。",
      "estimatedSeconds": 62,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "③ 选型表：不问哪个好听，问这一段要它干什么"
        },
        {
          "type": "text",
          "text": "写歌时纠结\"配什么节奏\"，通常是因为在问审美问题。改问功能问题就有答案了： 这一段要它干什么活？左列是场合，右列是被逼出来的唯一选择。顺序就是优先级。"
        },
        {
          "type": "table",
          "headers": [
            "这一段需要它",
            "织体",
            "密度",
            "为什么是它"
          ],
          "rows": [
            [
              "一句话要一锤定音，中间不能有人插嘴",
              "块状block",
              "1 / 2 拍0.87 音头/秒",
              "音头少＝留白多，重音自然落在字上"
            ],
            [
              "要人跟着走，脚步不能乱",
              "进行march",
              "2 / 2 拍1.73 音头/秒",
              "八分一步，密度刚好是走路的心跳"
            ],
            [
              "要流动、不停下来、把人往前带",
              "琶音arp",
              "4 / 2 拍3.47 音头/秒",
              "每半拍一个音，缝隙被填满，听感是\"在走\""
            ],
            [
              "要绷着——紧张、机械、数着拍子等",
              "碎音pulse",
              "4 / 2 拍3.47 音头/秒",
              "极短音＋全重音，耳朵听到的是颗粒不是旋律"
            ],
            [
              "要抬起来：副歌、冲刺、最后一段",
              "驱动drive",
              "4 / 2 拍3.47 音头/秒",
              "正拍反拍对着推，密度和力度同时到顶"
            ],
            [
              "要空——长音、留白、让声音自己在空气里散",
              "铺底pad",
              "1 / 6 拍0.29 音头/秒",
              "一个和弦占 6 拍、响 4 拍留 2 拍，密度低到没有节奏，只剩空间"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "最后一条\"留白\"用的不是节奏型，是不安排节奏型——pad 一个和弦拖 6 拍（响 4 拍、留 2 拍），整段听下来几乎没有节奏。 很多歌听起来累，不是节奏不够花，是一句空隙都没留。"
        }
      ],
      "skip": true,
      "order": 34,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-groove.c4",
      "course": "music",
      "chapter": "09 律动：节奏型怎么设计",
      "title": "④ 织体总览：15 种织体各管哪一段",
      "goal": "④ 织体总览：15 种织体各管哪一段 上面那张表只讲了最常用的几种。",
      "estimatedSeconds": 84,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "④ 织体总览：15 种织体各管哪一段"
        },
        {
          "type": "text",
          "text": "上面那张表只讲了最常用的几种。整个项目里一共做了 15 种织体—— 每一行都是一种\"这套节奏型怎么打\"的完整配方（音头落在哪几拍、音能拖多长、用什么音色）。 这张表把 15 种一次摊开，让你能按功能查，而不是靠试。"
        },
        {
          "type": "table",
          "headers": [
            "织体",
            "音头数",
            "和弦周期",
            "密度",
            "听感",
            "什么时候用"
          ],
          "rows": [
            [
              "铺底pad",
              "1",
              "6 拍",
              "0.28音头/秒",
              "一个音拖满，没有节奏——密度低到几乎没有",
              "留白、静止、让声音自己在空气里散"
            ],
            [
              "空五度openair",
              "1",
              "7 拍",
              "0.24音头/秒",
              "只有纯五和纯八，听着没有一点毛刺",
              "要\"干净\"：冰冷、空旷、纯净、一点摩擦都不能有"
            ],
            [
              "长音drone",
              "1",
              "6 拍",
              "0.28音头/秒",
              "低到胸腔里，音符之间留着空",
              "要\"大\"：巨大、压迫、死亡的底子"
            ],
            [
              "块状block",
              "1",
              "2 拍",
              "0.83音头/秒",
              "每个和弦敲一下，重音自然落在字上",
              "一句话要一锤定音，中间不能有人插嘴"
            ],
            [
              "粗粝stone",
              "1",
              "2.4 拍",
              "0.69音头/秒",
              "块状但音色发闷发石，像堵着",
              "要闷：逼仄、压抑、喘不过气"
            ],
            [
              "进行march",
              "2",
              "2 拍",
              "1.67音头/秒",
              "八分音符，一步一下",
              "要人跟着走，脚步不能乱"
            ],
            [
              "钟鸣bell",
              "2",
              "3 拍",
              "1.11音头/秒",
              "敲一下，余音拖很久",
              "敲一下、余音很长：仪式、幽深、钟"
            ],
            [
              "丝绸silk",
              "2",
              "2 拍",
              "1.67音头/秒",
              "软起音，音拖得长，贴着人",
              "要贴身：温柔、缠绵、不想惊动谁"
            ],
            [
              "琶音arp",
              "4",
              "2 拍",
              "3.33音头/秒",
              "四个音往上爬，缝隙被填满",
              "要流动、不停下来、把人往前带"
            ],
            [
              "碎音pulse",
              "4",
              "2 拍",
              "3.33音头/秒",
              "极短音，颗粒感，耳朵听到的是颗粒不是旋律",
              "要绷着：紧张、机械、数着拍子等"
            ],
            [
              "驱动drive",
              "4",
              "2 拍",
              "3.33音头/秒",
              "八分踩到底，音区推着走",
              "要抬起来：副歌、冲刺、最后一段"
            ],
            [
              "微光shimmer",
              "8",
              "2 拍",
              "6.67音头/秒",
              "十六分，但音量极轻——密而轻",
              "要\"闪\"：微光、梦境、亮而稀"
            ],
            [
              "颤音trem",
              "8",
              "2 拍",
              "6.67音头/秒",
              "十六分，密而干",
              "要焦：压迫、焦虑、癫狂"
            ],
            [
              "碾压grind",
              "16",
              "2 拍",
              "13.33音头/秒",
              "三十二分的低音墙，密度到耳朵只剩压力",
              "要闷到顶：热浪、窒息、闷"
            ],
            [
              "旋转swirl",
              "6",
              "2 拍",
              "5.00音头/秒",
              "三连音，转圈",
              "要转：不稳定、循环、眩晕"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "读这张表先看密度那一列——它才是耳朵判断快慢的依据， 而和弦周期决定了一个音能拖多久、两个和弦之间隔多久。 长音织体（铺底 6 拍、空五度 7 拍、钟鸣 3 拍）的周期比普通织体长得多， 所以同样\"一个音头\"，听感密度只有普通织体的三分之一。 密度列是按 100 BPM 折算的（每和弦音头数 ÷ 和弦周期秒数）， 这样 15 行才能横向比较——真实卡片的密度还要按它自己的 BPM 算。"
        }
      ],
      "skip": true,
      "order": 35,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-form.intro",
      "course": "music",
      "chapter": "10 曲式：12 小节布鲁斯",
      "title": "曲式：12 小节布鲁斯",
      "goal": "前面都在讲\"一句话怎么落点\"（第 06 节终止式）。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "前面都在讲\"一句话怎么落点\"（第 06 节终止式）。这一节讲几句怎么拼成一首。 最小的完整曲式是 12 小节布鲁斯：三个和弦、十二格。它值得单独一节，是因为这里有一件反直觉的事—— 歌词的三行结构不是歌手约好的，是被和声逼出来的。 另外这里还有一张卡专门讲布鲁斯的律动：它不在和弦里，在两个八分音符的间距里。"
        }
      ],
      "skip": true,
      "order": 36,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-form.c1",
      "course": "music",
      "chapter": "10 曲式：12 小节布鲁斯",
      "title": "① 十二格：前八格在原地打转，第九格才离开家",
      "goal": "① 十二格：前八格在原地打转，第九格才离开家 按播放，格子会一格一格亮过去。",
      "estimatedSeconds": 99,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "① 十二格：前八格在原地打转，第九格才离开家"
        },
        {
          "type": "text",
          "text": "按播放，格子会一格一格亮过去。别看词，先看颜色什么时候变： 前四格是同一条 I7，第五格转到 IV7，第九格才第一次出现 V7。"
        },
        {
          "type": "text",
          "text": "十二格 · 三行词：前八格和声在原地打转，第九格才第一次离开家"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "I7"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "I7"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "I7"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "I7"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "IV7"
        },
        {
          "type": "text",
          "text": "6"
        },
        {
          "type": "text",
          "text": "IV7"
        },
        {
          "type": "text",
          "text": "7"
        },
        {
          "type": "text",
          "text": "I7"
        },
        {
          "type": "text",
          "text": "8"
        },
        {
          "type": "text",
          "text": "I7"
        },
        {
          "type": "text",
          "text": "9"
        },
        {
          "type": "text",
          "text": "V7"
        },
        {
          "type": "text",
          "text": "10"
        },
        {
          "type": "text",
          "text": "IV7"
        },
        {
          "type": "text",
          "text": "11"
        },
        {
          "type": "text",
          "text": "I7"
        },
        {
          "type": "text",
          "text": "12"
        },
        {
          "type": "text",
          "text": "V7"
        },
        {
          "type": "text",
          "text": "A"
        },
        {
          "type": "text",
          "text": "天没亮就出门"
        },
        {
          "type": "text",
          "text": "乐器接话"
        },
        {
          "type": "text",
          "text": "6 字"
        },
        {
          "type": "text",
          "text": "A"
        },
        {
          "type": "text",
          "text": "天没亮就出门"
        },
        {
          "type": "text",
          "text": "乐器接话"
        },
        {
          "type": "text",
          "text": "6 字"
        },
        {
          "type": "text",
          "text": "B"
        },
        {
          "type": "text",
          "text": "等我回身灯已经灭了"
        },
        {
          "type": "text",
          "text": "乐器接话"
        },
        {
          "type": "text",
          "text": "9 字"
        },
        {
          "type": "text",
          "text": "下划线＝真正唱出来的长度（一字一拍）；剩下的空档是留给乐器的。B 行多三个字，所以会挤进第三格。"
        },
        {
          "type": "tip",
          "text": "布鲁斯的三个和弦全是属七。大调里只有 V 级是属七，它把 I 和 IV 也做成了属七—— 每个和弦都带一个小七度，永远不干净，永远想往前走。这是\"布鲁斯味\"的第一个来源：和声。 第二个来源在下一卡——它不在和弦里，在两个八分音符的间距里。"
        }
      ],
      "skip": true,
      "order": 37,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-form.c2",
      "course": "music",
      "chapter": "10 曲式：12 小节布鲁斯",
      "title": "② 布鲁斯的另一半：两个八分音符不是均分的",
      "goal": "② 布鲁斯的另一半：两个八分音符不是均分的 谱子上写\"每拍两个八分\"，可它没写第二个到底落在哪儿。",
      "estimatedSeconds": 137,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "② 布鲁斯的另一半：两个八分音符不是均分的"
        },
        {
          "type": "text",
          "text": "谱子上写\"每拍两个八分\"，可它没写第二个到底落在哪儿。 古典的默认是均分：落在一半。布鲁斯把后半往后拖到 ⅔——这个位置正好是三连音的第三格， 于是每一拍变成\"长—短、长—短\"，像拖着一条腿走路。底下两行是同一段两拍， 音高一个没改，只有第二下的位置不同：上下对比着看，注意块有没有踩在虚线上。"
        },
        {
          "type": "text",
          "text": "直的八分"
        },
        {
          "type": "text",
          "text": "后半悬在 ½ 处，两根格线之间"
        },
        {
          "type": "text",
          "text": "拍 1"
        },
        {
          "type": "text",
          "text": "拍 2"
        },
        {
          "type": "text",
          "text": "shuffle"
        },
        {
          "type": "text",
          "text": "后半正好踩在 ⅔ 那根格线上"
        },
        {
          "type": "text",
          "text": "拍 1"
        },
        {
          "type": "text",
          "text": "拍 2"
        },
        {
          "type": "text",
          "text": "虚线＝三连音的格线（每拍三格）· 格下细条＝这个音多长 · 音高一模一样，只有位置和长短不同"
        },
        {
          "type": "tip",
          "text": "直的八分：每拍两下等分，后半正好在一半的位置。听起来是进行曲、是正步——干净，但一步也不晃。第 1 下 0.50 拍 · 第 2 下 0.50 拍 · 第 2 下落在一拍的 50% 处（正好均分）"
        },
        {
          "type": "tip",
          "text": "别小看这 1/6 拍。它不改速度、不改重音、不改音头数——每拍还是两下， 变的只是两下之间的距离。所以\"快\"和\"晃\"是两件事：把 BPM 拉到 160 也不会晃， 把后半挪到 ⅔ 立刻就晃了。 这也是为什么谱子上写不出它：五线谱没有\"一半偏后\"的记号，只能标一个 shuffle 或 swing 的字样，或者干脆改写成 12/8。写不出来，就只能听。 爵士里的 swing 是同一件事，只是\"拖多少\"更自由（⅔ 到 ¾ 都有人用）；而鼓和贝斯要是一个直一个 shuffle， 整首歌会听起来打架——那不是演奏不准，是两套网格没对齐。"
        }
      ],
      "skip": true,
      "order": 38,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-form.c3",
      "course": "music",
      "chapter": "10 曲式：12 小节布鲁斯",
      "title": "③ 为什么前两句必须一模一样",
      "goal": "③ 为什么前两句必须一模一样 三行词各占四格。",
      "estimatedSeconds": 83,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "③ 为什么前两句必须一模一样"
        },
        {
          "type": "text",
          "text": "三行词各占四格。把\"和声有没有动\"和\"词有没有动\"两件事并排看， 就会发现它们是同一件事："
        },
        {
          "type": "text",
          "text": "第 1–4 格 · A 行"
        },
        {
          "type": "text",
          "text": "I7 一动不动"
        },
        {
          "type": "text",
          "text": "和声原地踏步，词也只能原地踏步——"
        },
        {
          "type": "text",
          "text": "重复是被允许的，因为它本来就没走"
        },
        {
          "type": "text",
          "text": "。"
        },
        {
          "type": "text",
          "text": "第 5–8 格 · A 行再来一次"
        },
        {
          "type": "text",
          "text": "出去两格又回来了"
        },
        {
          "type": "text",
          "text": "IV7 只待两格就回 I7——它还是\"家\"。"
        },
        {
          "type": "text",
          "text": "第 9–12 格 · B 行"
        },
        {
          "type": "text",
          "text": "V7 第一次出现"
        },
        {
          "type": "text",
          "text": "全曲唯一一次真正离开主和弦。"
        },
        {
          "type": "text",
          "text": "词必须在这里给新东西"
        },
        {
          "type": "text",
          "text": "，否则这一下白费。"
        },
        {
          "type": "tip",
          "text": "所以\"重复\"在这里的功能不是偷懒，是把不动的和声填满；B 行之所以是全曲最重的一句， 因为它是唯一有新和声的地方。写不出 B 行，往往不是词的问题，是那一段和声本来就没给你新东西。"
        }
      ],
      "skip": true,
      "order": 39,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-form.c4",
      "course": "music",
      "chapter": "10 曲式：12 小节布鲁斯",
      "title": "④ 四种曲式：词的行数不是习惯，是除法",
      "goal": "④ 四种曲式：词的行数不是习惯，是除法 曲式＝段落怎么排。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "④ 四种曲式：词的行数不是习惯，是除法"
        },
        {
          "type": "text",
          "text": "曲式＝段落怎么排。段落长度定下来，词要写几行、哪几行要重复， 基本就被算出来了——所以\"这一首写几行\"不该拍脑袋定。"
        },
        {
          "type": "table",
          "headers": [
            "曲式",
            "词的行数",
            "和声怎么走",
            "怎么一眼认出它"
          ],
          "rows": [
            [
              "12 小节布鲁斯AAB",
              "3 行（A 重复一次）",
              "I7 ×4 → IV7 ×2 → I7 ×2 → V7 · IV7 · I7 · V7",
              "第 9 小节第一次出现 V7，词也恰好在那换——重复由和声决定，不由心情决定"
            ],
            [
              "32 小节标准曲AABA",
              "4 段 × 8 小节（A 出现两次）",
              "A 段一个调 · B 段（bridge）换到远关系调再回来",
              "B 段是\"离家\"，回来那一次 A 才有\"回家\"的意思；爵士标准曲的默认形状"
            ],
            [
              "民谣四行ABCB",
              "4 行，2/4 押",
              "四句一循环，和声换得不快",
              "第 2、4 行押韵、第 1、3 行不押——叙述在前，落点在后"
            ],
            [
              "流行主副歌ABAB",
              "主歌 4 行 · 副歌 4 行",
              "主歌换和弦、副歌钉在同一组上",
              "副歌重复的是和声，所以副歌的词也必须重复得让人能跟着唱"
            ]
          ]
        }
      ],
      "skip": true,
      "order": 40,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-lyric.intro",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "词曲咬合：歌词怎么长在旋律上",
      "goal": "歌词不是\"写完再配曲\"。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "歌词不是\"写完再配曲\"。汉语每个字自带一条音高曲线——四声就是四条不同的曲线， 旋律要是拧着它走，字就倒了：听众听到的是另一个字。这一节只讲一件事： 词和旋律接在哪、怎么接才不打架。押韵只是其中一个接口，而且是最不吃音乐的那一个—— 押错了顶多不够顺耳；重音和字调错了，意思直接变。⑦⑧ 两张卡会把这套规则搬到英文和粤语： 三种语言，三套计时法——同一条旋律换种语言就不成立。 最后还有一条更基础的约束：旋律不能高到唱不上去——第九张卡讲人声的舒适音区。"
        }
      ],
      "skip": true,
      "order": 41,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-lyric.c1",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "① 倒字：旋律拧着字调走",
      "goal": "① 倒字：旋律拧着字调走 普通话四个声调各是一条曲线：阴平平着走（55）、阳平往上挑（35）、 上声压到最低再起（214）、去声高起直落（51）。",
      "estimatedSeconds": 91,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "① 倒字：旋律拧着字调走"
        },
        {
          "type": "text",
          "text": "普通话四个声调各是一条曲线：阴平平着走（55）、阳平往上挑（35）、 上声压到最低再起（214）、去声高起直落（51）。旋律的每一次滑动都应该和这条曲线同向。 把线翻过来听一遍——这就是\"倒字\"。"
        },
        {
          "type": "text",
          "text": "顺字 · 旋律跟着字调走"
        },
        {
          "type": "text",
          "text": "倒字 · 旋律拧着字调走"
        },
        {
          "type": "text",
          "text": "慢"
        },
        {
          "type": "text",
          "text": "4声"
        },
        {
          "type": "text",
          "text": "板"
        },
        {
          "type": "text",
          "text": "3声"
        },
        {
          "type": "text",
          "text": "岁"
        },
        {
          "type": "text",
          "text": "4声"
        },
        {
          "type": "text",
          "text": "月"
        },
        {
          "type": "text",
          "text": "4声"
        },
        {
          "type": "text",
          "text": "一"
        },
        {
          "type": "text",
          "text": "1声"
        },
        {
          "type": "text",
          "text": "摇"
        },
        {
          "type": "text",
          "text": "2声"
        },
        {
          "type": "text",
          "text": "一"
        },
        {
          "type": "text",
          "text": "1声"
        },
        {
          "type": "text",
          "text": "摇"
        },
        {
          "type": "text",
          "text": "2声"
        },
        {
          "type": "text",
          "text": "竖线＝一个字内部的音高滑动，虚线＝整句轮廓。两行平均音高相同，只有滑动方向相反——差别全部来自\"字\"，不是\"调\"。"
        },
        {
          "type": "tip",
          "text": "例句取自 #3《慢板岁月》副歌首句。声调序列 4-3-4-4-1-2-1-2（去声、上声、去声、去声、阴平、阳平、阴平、阳平）。上半是顺字版——旋律的每一次滑动都和字的调值同向，唱出来就是这句话；下半把每一根线翻过来，字就\"倒\"了，听到的很可能是别的字。"
        }
      ],
      "skip": true,
      "order": 42,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-lyric.c2",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "② 重音给谁：关键词落在第几拍",
      "goal": "② 重音给谁：关键词落在第几拍 同一句词，音高一个都不改，只改每个字占多长、落在第几拍。",
      "estimatedSeconds": 63,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "② 重音给谁：关键词落在第几拍"
        },
        {
          "type": "text",
          "text": "同一句词，音高一个都不改，只改每个字占多长、落在第几拍。 底下一直打着拍点（4/4，第 1 拍最重）——你听的是\"实词有没有落在强位上\"。"
        },
        {
          "type": "text",
          "text": "重心在「秋天」"
        },
        {
          "type": "text",
          "text": "口"
        },
        {
          "type": "text",
          "text": "袋"
        },
        {
          "type": "text",
          "text": "里"
        },
        {
          "type": "text",
          "text": "的"
        },
        {
          "type": "text",
          "text": "秋"
        },
        {
          "type": "text",
          "text": "天"
        },
        {
          "type": "text",
          "text": "平铺（谁也不重）"
        },
        {
          "type": "text",
          "text": "口"
        },
        {
          "type": "text",
          "text": "袋"
        },
        {
          "type": "text",
          "text": "里"
        },
        {
          "type": "text",
          "text": "的"
        },
        {
          "type": "text",
          "text": "秋"
        },
        {
          "type": "text",
          "text": "天"
        },
        {
          "type": "text",
          "text": "重心错给「的」"
        },
        {
          "type": "text",
          "text": "口"
        },
        {
          "type": "text",
          "text": "袋"
        },
        {
          "type": "text",
          "text": "里"
        },
        {
          "type": "text",
          "text": "的"
        },
        {
          "type": "text",
          "text": "秋"
        },
        {
          "type": "text",
          "text": "天"
        },
        {
          "type": "tip",
          "text": "重心在「秋天」 · #7《口袋里的秋天》副歌首句实词吃满后三拍。\"秋天\"两个字一出口，这句就是在说秋天。"
        }
      ],
      "skip": true,
      "order": 43,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-lyric.c3",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "③ 一字一音，还是一字多音",
      "goal": "③ 一字一音，还是一字多音 同样八个字、同样四拍。",
      "estimatedSeconds": 62,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "③ 一字一音，还是一字多音"
        },
        {
          "type": "text",
          "text": "同样八个字、同样四拍。一个字配几个音符， 是\"说话\"和\"唱\"最直接的分界。"
        },
        {
          "type": "text",
          "text": "说话版 · 一字一音"
        },
        {
          "type": "text",
          "text": "慢"
        },
        {
          "type": "text",
          "text": "板"
        },
        {
          "type": "text",
          "text": "岁"
        },
        {
          "type": "text",
          "text": "月"
        },
        {
          "type": "text",
          "text": "一"
        },
        {
          "type": "text",
          "text": "摇"
        },
        {
          "type": "text",
          "text": "一"
        },
        {
          "type": "text",
          "text": "摇"
        },
        {
          "type": "text",
          "text": "抒情版 · 末字拖腔"
        },
        {
          "type": "text",
          "text": "慢"
        },
        {
          "type": "text",
          "text": "板"
        },
        {
          "type": "text",
          "text": "岁"
        },
        {
          "type": "text",
          "text": "月"
        },
        {
          "type": "text",
          "text": "一"
        },
        {
          "type": "text",
          "text": "摇"
        },
        {
          "type": "text",
          "text": "一"
        },
        {
          "type": "text",
          "text": "摇"
        },
        {
          "type": "tip",
          "text": "同样八个字、同样四拍。上面每字半拍，密度和说话一样，所以听着像念词；下面把七个字挤进不到一拍半，\"摇\"字一个人吃掉两拍半，还拐了三个音——一个字配几个音符，本身就是一种表情。"
        }
      ],
      "skip": true,
      "order": 44,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-lyric.c4",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "④ 气口：一口气能唱几个字",
      "goal": "④ 气口：一口气能唱几个字 同样一口气，字数越多，每个字分到的时间越少。",
      "estimatedSeconds": 87,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "④ 气口：一口气能唱几个字"
        },
        {
          "type": "text",
          "text": "同样一口气，字数越多，每个字分到的时间越少。 方块越窄，唱的人越没地方换气——这是\"词写得太满\"唯一能被听出来的证据。"
        },
        {
          "type": "text",
          "text": "六个字"
        },
        {
          "type": "text",
          "text": "1.33 拍/字"
        },
        {
          "type": "text",
          "text": "灯"
        },
        {
          "type": "text",
          "text": "先"
        },
        {
          "type": "text",
          "text": "亮"
        },
        {
          "type": "text",
          "text": "夜"
        },
        {
          "type": "text",
          "text": "随"
        },
        {
          "type": "text",
          "text": "后"
        },
        {
          "type": "text",
          "text": "从容"
        },
        {
          "type": "text",
          "text": "灯先亮 夜随后"
        },
        {
          "type": "text",
          "text": "#8 钩子"
        },
        {
          "type": "text",
          "text": "九个字"
        },
        {
          "type": "text",
          "text": "0.89 拍/字"
        },
        {
          "type": "text",
          "text": "一"
        },
        {
          "type": "text",
          "text": "江"
        },
        {
          "type": "text",
          "text": "晨"
        },
        {
          "type": "text",
          "text": "光"
        },
        {
          "type": "text",
          "text": "淌"
        },
        {
          "type": "text",
          "text": "得"
        },
        {
          "type": "text",
          "text": "多"
        },
        {
          "type": "text",
          "text": "宽"
        },
        {
          "type": "text",
          "text": "敞"
        },
        {
          "type": "text",
          "text": "正常"
        },
        {
          "type": "text",
          "text": "一江晨光 淌得多宽敞"
        },
        {
          "type": "text",
          "text": "#1 副歌"
        },
        {
          "type": "text",
          "text": "十二个字"
        },
        {
          "type": "text",
          "text": "0.67 拍/字"
        },
        {
          "type": "text",
          "text": "回"
        },
        {
          "type": "text",
          "text": "头"
        },
        {
          "type": "text",
          "text": "望"
        },
        {
          "type": "text",
          "text": "了"
        },
        {
          "type": "text",
          "text": "一"
        },
        {
          "type": "text",
          "text": "眼"
        },
        {
          "type": "text",
          "text": "城"
        },
        {
          "type": "text",
          "text": "市"
        },
        {
          "type": "text",
          "text": "里"
        },
        {
          "type": "text",
          "text": "的"
        },
        {
          "type": "text",
          "text": "屋"
        },
        {
          "type": "text",
          "text": "顶"
        },
        {
          "type": "text",
          "text": "赶"
        },
        {
          "type": "text",
          "text": "回头望了一眼 城市里的屋顶"
        },
        {
          "type": "text",
          "text": "#8 主歌"
        },
        {
          "type": "tip",
          "text": "同样一口气（8 拍，76 BPM ≈ 6.3 秒），字数越多每个字分到的时间越少。低于 0.75 拍/字（约 0.6 秒/字）就开始赶，后半句换不上气——这时删字永远比加气有效：把\"城市里的屋顶\"删成\"城市屋顶\"，一句话立刻顺了。"
        }
      ],
      "skip": true,
      "order": 45,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-lyric.c5",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "⑤ 十三辙：押韵的单位是\"辙\"，不是韵母",
      "goal": "⑤ 十三辙：押韵的单位是\"辙\"，不是韵母 十三辙把汉语韵母归成十三类。",
      "estimatedSeconds": 66,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "⑤ 十三辙：押韵的单位是\"辙\"，不是韵母"
        },
        {
          "type": "text",
          "text": "十三辙把汉语韵母归成十三类。an / ian / uan / üan 是同一个辙—— 所以\"天\"能押\"年\"，虽然它们不是同一个韵母。这条最反直觉，也最实用。 下表按响度排：越往上开口越大、越亮，越往下越暗、越紧。"
        },
        {
          "type": "table",
          "headers": [
            "辙",
            "收哪些韵母",
            "响度",
            "情绪底色",
            "例字"
          ],
          "rows": [
            [
              "江阳",
              "ang / iang / uang",
              "●●●●●",
              "开阔 · 昂扬 · 收尾最稳",
              "江 光 长 上"
            ],
            [
              "发花",
              "a / ia / ua",
              "●●●●●",
              "呼喊 · 明亮 · 最外放",
              "花 家 话 沙"
            ],
            [
              "言前",
              "an / ian / uan / üan",
              "●●●●●",
              "舒展 · 叙事 · 能押的字最多",
              "前 天 远 年"
            ],
            [
              "遥条",
              "ao / iao",
              "●●●●●",
              "悠远 · 摇曳 · 有余味",
              "好 少 遥 笑"
            ],
            [
              "中东",
              "eng / ing / ong / iong",
              "●●●●●",
              "轰鸣 · 穿透 · 适合叠和声",
              "风 中 情 声"
            ],
            [
              "怀来",
              "ai / uai",
              "●●●●●",
              "爽利 · 轻快 · 收得干脆",
              "来 开 白 外"
            ],
            [
              "梭波",
              "o / e / uo",
              "●●●●●",
              "平和 · 陈述 · 不抢戏",
              "河 多 说 过"
            ],
            [
              "人辰",
              "en / in / un / ün",
              "●●●●●",
              "内敛 · 沉吟 · 收得住",
              "人 心 春 深"
            ],
            [
              "由求",
              "ou / iou(iu)",
              "●●●●●",
              "柔软 · 缠绵 · 略带倦",
              "秋 流 后 头"
            ],
            [
              "灰堆",
              "ei / uei(ui)",
              "●●●●●",
              "呢喃 · 疲惫 · 私语感",
              "谁 回 泪 醉"
            ],
            [
              "乜斜",
              "ie / üe",
              "●●●●●",
              "清冷 · 夜晚 · 略带涩",
              "夜 别 雪 月"
            ],
            [
              "一七",
              "i / ü / er",
              "●●●●●",
              "细 · 紧 · 最考验气息",
              "一 你 雨 事"
            ],
            [
              "姑苏",
              "u",
              "●●●●●",
              "最暗 · 最沉 · 像呜咽",
              "路 苦 书 湖"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "响度不是审美排序，是声学事实：韵腹开口度越大，第一共振峰越高，听着就越响。 所以副歌高潮用江阳、发花，呢喃段用一七、姑苏——不是\"这样更好听\"， 是闭口韵在长高音上根本撑不住。"
        }
      ],
      "skip": true,
      "order": 46,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-lyric.c6",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "⑥ 一张专辑怎么分配辙口",
      "goal": "⑥ 一张专辑怎么分配辙口 了解了十三辙，就能把它当工具用：一张多首歌的专辑， 让每首落在不同的辙上，听感自然会分开。",
      "estimatedSeconds": 62,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "⑥ 一张专辑怎么分配辙口"
        },
        {
          "type": "text",
          "text": "了解了十三辙，就能把它当工具用：一张多首歌的专辑， 让每首落在不同的辙上，听感自然会分开。下面是《水慢慢流》十首的分配——"
        },
        {
          "type": "table",
          "headers": [
            "曲目",
            "辙",
            "为什么是这个辙"
          ],
          "rows": [
            [
              "早安，江水",
              "江阳",
              "ang 一开口就是开阔，配江面"
            ],
            [
              "露水未干",
              "言前",
              "an 舒展，像清早说话"
            ],
            [
              "慢板岁月",
              "遥条",
              "ao 有余味，适合\"一晃一晃\"这个词"
            ],
            [
              "阳光偏了偏",
              "言前",
              "ian 比 an 细一点，正好配\"偏\"这个动作"
            ],
            [
              "乘水旅行的叶子",
              "梭波",
              "e/o 平和，不抢\"旅行\"的叙事"
            ],
            [
              "让一步给风",
              "中东",
              "eng 有鼻音穿透，配\"风\"这个字的天性"
            ],
            [
              "口袋里的秋天",
              "由求",
              "ou 柔软，配\"攒\"和\"熬\"的粘稠感"
            ],
            [
              "灯先亮，夜随后",
              "姑苏",
              "u 最暗最沉，正好是入夜"
            ],
            [
              "晚风给我斟一杯",
              "灰堆",
              "ei 有点微醺的懒，像喝到第三杯"
            ],
            [
              "枕一片蓝色的夜",
              "乜斜",
              "ie/üe 收得窄，像闭眼"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "十首歌用了九个辙：言前用了两次（#2 与 #4）。这不是疏忽—— 言前是十三辙里最宽的，能押的字最多，最不容易写坏；宽辙适合高频使用，窄辙留给必须出彩的那首。 而 #2 是 an、#4 是 ian，听起来像两个韵，其实同一个辙。"
        }
      ],
      "skip": true,
      "order": 47,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-lyric.c7",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "⑦ 计时法：中文数「字」，英文数「重音」",
      "goal": "⑦ 计时法：中文数「字」，英文数「重音」 上面全在讲汉语。",
      "estimatedSeconds": 100,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "⑦ 计时法：中文数「字」，英文数「重音」"
        },
        {
          "type": "text",
          "text": "上面全在讲汉语。换一种语言，最先失效的不是押韵，是计时。 三条时间轴都是 8 拍——时间一样长，装进去的字数却完全不同。先看宽度，再听。"
        },
        {
          "type": "text",
          "text": "普通话 · 按字计时"
        },
        {
          "type": "text",
          "text": "灯"
        },
        {
          "type": "text",
          "text": "亮"
        },
        {
          "type": "text",
          "text": "着"
        },
        {
          "type": "text",
          "text": "人"
        },
        {
          "type": "text",
          "text": "已"
        },
        {
          "type": "text",
          "text": "经"
        },
        {
          "type": "text",
          "text": "走"
        },
        {
          "type": "text",
          "text": "了"
        },
        {
          "type": "text",
          "text": "8 个字，每个字一样长"
        },
        {
          "type": "text",
          "text": "英文 · 8 音节"
        },
        {
          "type": "text",
          "text": "I"
        },
        {
          "type": "text",
          "text": "left"
        },
        {
          "type": "text",
          "text": "your"
        },
        {
          "type": "text",
          "text": "coat"
        },
        {
          "type": "text",
          "text": "out"
        },
        {
          "type": "text",
          "text": "side"
        },
        {
          "type": "text",
          "text": "door"
        },
        {
          "type": "text",
          "text": "I left your coat outside · 4 个重音"
        },
        {
          "type": "text",
          "text": "英文 · 11 音节"
        },
        {
          "type": "text",
          "text": "leave"
        },
        {
          "type": "text",
          "text": "your"
        },
        {
          "type": "text",
          "text": "coat"
        },
        {
          "type": "text",
          "text": "out"
        },
        {
          "type": "text",
          "text": "side"
        },
        {
          "type": "text",
          "text": "the"
        },
        {
          "type": "text",
          "text": "door"
        },
        {
          "type": "text",
          "text": "I was gonna leave your coat outside the door · 还是那 4 个重音"
        },
        {
          "type": "text",
          "text": "↕ 窄到写不进字的音节画成细条，悬停可查是哪个词——第二行 1 条，第三行 4 条，拍数完全一样。"
        },
        {
          "type": "tip",
          "text": "8 拍，8 个字，每个字正好一格。中文里一个字就是时间的一个单位——字数定了，句子的长度基本就定了。所以写中文词的第一件事是数字数。"
        }
      ],
      "skip": true,
      "order": 48,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-lyric.c8",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "⑧ 粤语：九声六调，而且入声不许落长音",
      "goal": "⑧ 粤语：九声六调，而且入声不许落长音 粤语不是\"另一种普通话\"。",
      "estimatedSeconds": 76,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "⑧ 粤语：九声六调，而且入声不许落长音"
        },
        {
          "type": "text",
          "text": "粤语不是\"另一种普通话\"。它有 9 个声调，其中三个是入声—— 韵尾 -p / -t / -k，发音时口腔先\"塞住\"。塞音自带一个长度：入声字在语言里就是短的。 所以给粤语写词，第一关不是押韵，是协音；协音里最硬的一条是别把入声拖长。"
        },
        {
          "type": "table",
          "headers": [
            "调",
            "调值",
            "例字",
            "能不能拖长"
          ],
          "rows": [
            [
              "阴平",
              "55",
              "分",
              "可以"
            ],
            [
              "阴上",
              "35",
              "粉",
              "可以"
            ],
            [
              "阴去",
              "33",
              "训",
              "可以"
            ],
            [
              "阳平",
              "21",
              "焚",
              "可以"
            ],
            [
              "阳上",
              "13",
              "奋",
              "可以"
            ],
            [
              "阳去",
              "22",
              "份",
              "可以"
            ],
            [
              "阴入",
              "55 · 短",
              "忽",
              "不可以"
            ],
            [
              "中入",
              "33 · 短",
              "发",
              "不可以"
            ],
            [
              "阳入",
              "22 · 短",
              "佛",
              "不可以"
            ]
          ]
        },
        {
          "type": "text",
          "text": "硬拖满两拍"
        },
        {
          "type": "text",
          "text": "十"
        },
        {
          "type": "text",
          "text": "停住"
        },
        {
          "type": "text",
          "text": "一拍就断开"
        },
        {
          "type": "text",
          "text": "十"
        },
        {
          "type": "text",
          "text": "停住"
        },
        {
          "type": "tip",
          "text": "听的不是发音，是时值：两次都是同一个字——十（sap6，阳入，-p 收尾）， 同一个音高，只有长度不同。 合成器发不出 -p，所以\"对\"的那一版用一个极短的收尾示意\"收住\"。 入声被拖长时，听到的不再是那个字，是一声堵住的气。"
        }
      ],
      "skip": true,
      "order": 49,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-lyric.c9",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "⑨ 人声舒适音区：有些音根本唱不上去",
      "goal": "⑨ 人声舒适音区：有些音根本唱不上去 前面八张卡讲的都是字与旋律怎么对齐。",
      "estimatedSeconds": 141,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "⑨ 人声舒适音区：有些音根本唱不上去"
        },
        {
          "type": "text",
          "text": "前面八张卡讲的都是字与旋律怎么对齐。 但还有一条更基础的约束没讲：这个音你根本唱不上去。 词写得再好，旋律要一个高八度的 C，多数人张嘴就是破音—— 那不是\"咬合\"的问题，是这条旋律压根不该这么写。 所以先看人声能待在哪儿："
        },
        {
          "type": "text",
          "text": "人声舒适音区（以中央 C 为基准）"
        },
        {
          "type": "text",
          "text": "高音区"
        },
        {
          "type": "text",
          "text": "中高音区"
        },
        {
          "type": "text",
          "text": "中音区"
        },
        {
          "type": "text",
          "text": "中低音区"
        },
        {
          "type": "text",
          "text": "低音区"
        },
        {
          "type": "text",
          "text": "换声点"
        },
        {
          "type": "text",
          "text": "C4"
        },
        {
          "type": "text",
          "text": "C5"
        },
        {
          "type": "text",
          "text": "C3"
        },
        {
          "type": "text",
          "text": "C6"
        },
        {
          "type": "text",
          "text": "低 ← 音高 → 高"
        },
        {
          "type": "text",
          "text": "（半音数为相对中央 C 的偏移）"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "规则一 · 主歌待在舒适区"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "规则二 · 副歌高一个八度以内"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "规则三 · 极限音只用一次"
        },
        {
          "type": "table",
          "headers": [
            "分区",
            "音高",
            "共鸣",
            "听感",
            "什么时候用",
            "要注意"
          ],
          "rows": [
            [
              "低音区（胸声）",
              "C3 – B3",
              "胸腔共鸣",
              "厚、沉、有重量",
              "叙事歌的主歌、安静段落、男声低音线",
              "低音需要气息托着，音越高越容易\"挤\"——写低音时旋律要少往上冲"
            ],
            [
              "中低音区（换声点下）",
              "C4 – D♯4",
              "喉部半开",
              "厚实、贴着说话",
              "绝大多数华语流行歌的主音区——副歌之前的叙述段",
              "紧挨换声点，声音会突然变薄或发紧"
            ],
            [
              "中音区（换声点）",
              "E4 – G4",
              "头腔与胸腔混合",
              "最亮、最有穿透力",
              "副歌高潮、需要\"喊出来\"的那一句",
              "**换声点就在这里**（最常见的一档约 E4–G4，钢琴上中央 C 上方四五个键）。硬冲这个高度多数人会破音，绕开它就没问题"
            ],
            [
              "中高音区",
              "G♯4 – D5",
              "头腔共鸣为主",
              "轻、亮、飘",
              "情绪抬升后的副歌、bridge 的高音段",
              "连续唱会很累，而且字容易糊——长句别都放这儿"
            ],
            [
              "高音区（极限区）",
              "D♯5 – C6",
              "几乎全靠头腔",
              "有张力、也脆弱",
              "**用一次就够**——爆点、最后一句的长音",
              "这是效果不是常态。整首歌都在这里唱＝全程在喊，听众三分钟就累了"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "换声点（约 E4–G4）：这个高度上，喉部的闭合方式会从\"厚\"切换到\"薄\"，多数人没经过训练，一冲上去就挤嗓或破音。所以写旋律时，要么让它待在胸声区，要么干脆越过去落到头声区，**最难受的是刚好卡在这个高度上**。（这里取的是最常见的一档：男声感觉到的换声点更低（约 E3），女声更高（约 A4）——同一首歌给不同声部唱，换声点的位置不一样。）"
        },
        {
          "type": "text",
          "text": "落在低音区"
        },
        {
          "type": "text",
          "text": "（厚、暗，像贴着耳朵说）"
        },
        {
          "type": "text",
          "text": "叙事歌的主歌常在这儿。字咬得最清楚，情绪往里收。"
        },
        {
          "type": "tip",
          "text": "上面三个按钮是同一串音高关系（do-re-mi-sol-mi-re）落在三个不同的音区—— 音程一个都没改，变的只是绝对高度。所以你听到的差别一定来自音区，不是\"换了条旋律\"。 这就是本节的全部用法：写完旋律先问一句\"这句落在哪个区\"。 顺带记住一件事：音域是极限（偶尔够得着），舒适区是能连续唱很久还不累的那一段—— 两者的差别，就是专业歌手和普通人的差别。"
        }
      ],
      "skip": true,
      "order": 50,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-key.intro",
      "course": "music",
      "chapter": "12 移调与调号",
      "title": "移调与调号",
      "goal": "把一首歌整体抬高或压低，旋律一个音都没改，但情绪会变——唱不上去是实际问题，听起来\"更亮更开阔\"是审美问题。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "把一首歌整体抬高或压低，旋律一个音都没改，但情绪会变——唱不上去是实际问题，听起来\"更亮更开阔\"是审美问题。 \"调号\"就是记这件事的记号：升号降号越多，离 C 大调越远。"
        }
      ],
      "skip": true,
      "order": 51,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-key.c1",
      "course": "music",
      "chapter": "12 移调与调号",
      "title": "抬升或降低",
      "goal": "抬升或降低 C 大调 （相对 C 移了 0 半音） 无升降号 低 6 个半音 原位 C 高 6 个半音 1 2 3 4 5 6 7 8 9 C4 1 D4 2",
      "estimatedSeconds": 60,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "抬升或降低"
        },
        {
          "type": "text",
          "text": "C 大调"
        },
        {
          "type": "text",
          "text": "（相对 C 移了 0 半音）"
        },
        {
          "type": "text",
          "text": "无升降号"
        },
        {
          "type": "text",
          "text": "低 6 个半音"
        },
        {
          "type": "text",
          "text": "原位 C"
        },
        {
          "type": "text",
          "text": "高 6 个半音"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "6"
        },
        {
          "type": "text",
          "text": "7"
        },
        {
          "type": "text",
          "text": "8"
        },
        {
          "type": "text",
          "text": "9"
        },
        {
          "type": "text",
          "text": "C4"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "D4"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "E4"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "F4"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "G4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "F4"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "E4"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "D4"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "C4"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "tip",
          "text": "横轴是第几个音，纵轴是音高——图里就是即将播放的 9 个音。拖动滑杆再听： 旋律的相对起伏一个都没变，只是整体搬了家，这就是移调。"
        }
      ],
      "skip": true,
      "order": 52,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-key.c2",
      "course": "music",
      "chapter": "12 移调与调号",
      "title": "常用调的调号（点一下切过去）",
      "goal": "常用调的调号（点一下切过去）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "常用调的调号（点一下切过去）"
        },
        {
          "type": "table",
          "headers": [
            "调",
            "升降号",
            "几个",
            "适合什么"
          ],
          "rows": [
            [
              "C",
              "—",
              "0",
              "最白、入门"
            ],
            [
              "G",
              "F♯",
              "1",
              "民谣吉他默认"
            ],
            [
              "D",
              "F♯ C♯",
              "2",
              "小提琴、吉他常用"
            ],
            [
              "A",
              "F♯ C♯ G♯",
              "3",
              "古典、明亮"
            ],
            [
              "F",
              "B♭",
              "1",
              "铜管、稍暗"
            ],
            [
              "B♭",
              "B♭ E♭",
              "2",
              "爵士乐队常见"
            ],
            [
              "E♭",
              "B♭ E♭ A♭",
              "3",
              "蓝调、爵士"
            ]
          ]
        }
      ],
      "skip": true,
      "order": 53,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-emotion.intro",
      "course": "music",
      "chapter": "13 音乐能表达什么：十三个维度",
      "title": "音乐能表达什么：十三个维度",
      "goal": "前面所有参数，最终都是为这个服务的。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "前面所有参数，最终都是为这个服务的。音乐不只表达心情——它还能表达天气、冷热、时间、空间、 重量、材质、运动、事件、身体状态，甚至文化风格。因为音乐模拟的不是情绪，是物理量： 音高听起来像高低和大小，响度像重量和距离，时值像开阔还是逼仄。"
        }
      ],
      "skip": true,
      "order": 54,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-emotion.c1",
      "course": "music",
      "chapter": "13 音乐能表达什么：十三个维度",
      "title": "为什么\"速度\"这件事，方块常在说谎",
      "goal": "为什么\"速度\"这件事，方块常在说谎 耳朵判断快慢，靠的是每秒敲出多少个音头，不是方块上印的那个 BPM 数字。",
      "estimatedSeconds": 90,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "为什么\"速度\"这件事，方块常在说谎"
        },
        {
          "type": "text",
          "text": "耳朵判断快慢，靠的是每秒敲出多少个音头，不是方块上印的那个 BPM 数字。 同样是 92 BPM，一个织体一拍敲一下、另一个织体敲四下，听起来能差出好几倍。所以每张卡片上现在同时标了两个数： 标称 BPM（和弦周期有多快）和 听感速度（音头密度，个/秒）——后者才是耳朵真正在意的那个。"
        },
        {
          "type": "tip",
          "text": "卡片的音头密度按这个公式算：密度 = 每和弦音头数 × BPM ÷（和弦周期拍数 × 60）。 分母里的\"和弦周期\"就是那个织体一个和弦真正占几拍——普通织体是 2 拍， 而长音织体要长得多（铺底 6 拍、空五度 7 拍、钟鸣 3 拍）， 因为一个音得拖满、还得留出空隙。分子分母都算对了， 这个数字才真的等于耳朵听到的快慢。自动化测试会拿每一张卡片的实测值跟它自报的数字对账，对不上就构建失败。"
        }
      ],
      "skip": true,
      "order": 55,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-emotion.c2",
      "course": "music",
      "chapter": "13 音乐能表达什么：十三个维度",
      "title": "第十三个维度：文化与风格——调式就是文化的载体",
      "goal": "第十三个维度：文化与风格——调式就是文化的载体 前十二个维度回答\"这是什么感觉\"，这一个回答\"这是哪里的音乐\"。",
      "estimatedSeconds": 93,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "第十三个维度：文化与风格——调式就是文化的载体"
        },
        {
          "type": "text",
          "text": "前十二个维度回答\"这是什么感觉\"，这一个回答\"这是哪里的音乐\"。它由三层叠成： 调式定地域（五声=中国，都节=日本）、偏音定流派（秦腔的苦音）、音色定腔调（竹笛还是尺八）。"
        },
        {
          "type": "text",
          "text": "最能说明问题的一组对照是秦腔的苦音与欢音：苦音是燕乐七声（把本位 si 压成闰、用清角）， 欢音是干净的徵调式——只差两个偏音，一个听起来是泣，一个听起来是喜。 这不是\"像不像中国风\"的问题，而是物理上的差异：五声族相邻音最小音程是全音（无摩擦，含蓄）， 七声族与都节族有半音（有摩擦，有张力）。测试会拿这个数值对账。"
        },
        {
          "type": "text",
          "text": "日本那边也有自己的\"家规\"：律、都节、民谣、琉球其实只是同一个滑杆的四个位置， 音乐学家小泉文夫把它总结成了同一个公式。其中都节把中间音放得最低， 两个半音挨得最近——所以它最像\"日本\"。公式怎么来的，见第 04 节。"
        }
      ],
      "skip": true,
      "order": 56,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-emotion.c3",
      "course": "music",
      "chapter": "13 音乐能表达什么：十三个维度",
      "title": "一个具体例子：《沧海一声笑》到底用了几个音？",
      "goal": "一个具体例子：《沧海一声笑》到底用了几个音？",
      "estimatedSeconds": 124,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "一个具体例子：《沧海一声笑》到底用了几个音？"
        },
        {
          "type": "text",
          "text": "很多人知道《沧海一声笑》（黄霑词曲、顾嘉辉编曲，1990 年电影《笑傲江湖》主题曲）简单得出奇， 常见说法是\"七个键就能弹\"。实际查证下来，这个说法站不住：它用的是纯五声音阶， 而黄霑自己说过主旋律是「宫商角徵羽反过来用」——也就是 la–sol–mi–re–do 这一串下行， 五个音就够了。首句级数大致是 6 5 3 2 1 | 3 2 1 6 5 | …， 通篇不出现 fa 与 si（清角、变宫），所以既没有导音的急切，也没有小二度摩擦。"
        },
        {
          "type": "text",
          "text": "至于它算宫调式还是羽调式，学界有两种记法。这里有个容易搞混的地方值得说清： 宫调式与羽调式的音集其实不同（宫是 do-re-mi-sol-la，羽是 la-si-do-mi-re）， 所以\"同一串音既是宫又是羽\"字面上并不成立。真正的差别是—— 同一串物理音高，你把哪个音当\"家\"：底下铺 do，落音恰是主音，听感明亮开阔； 底下换成 la，落音变成徵音，立刻暗下来、沉思起来。 学界归到\"羽调式色彩\"，说的正是后一种\"以 la 为支点\"的感觉。 下面两个按钮就是这两种框法，旋律一个音都没改："
        },
        {
          "type": "tip",
          "text": "宫调式（重心在 do） 同一条 la–sol–mi–re–do，下面铺 do。落音是主音 do，听感明亮、正、开阔——这是「宫」的说法。"
        }
      ],
      "skip": true,
      "order": 57,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-emotion.c4",
      "course": "music",
      "chapter": "13 音乐能表达什么：十三个维度",
      "title": "它到底表达的是什么情绪？——不是一种，是一条弧线",
      "goal": "它到底表达的是什么情绪？",
      "estimatedSeconds": 124,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "它到底表达的是什么情绪？——不是一种，是一条弧线"
        },
        {
          "type": "text",
          "text": "《沧海一声笑》最妙的地方在于：全词只用了一个字——「笑」，却写了五次。 而每一次\"笑\"的情绪都不一样，五次连起来是一条完整的弧线："
        },
        {
          "type": "text",
          "text": "① 沧海笑"
        },
        {
          "type": "text",
          "text": "，滔滔两岸潮"
        },
        {
          "type": "text",
          "text": "格局拉到最大。天地、沧海、浪潮。豪迈、开阔、没有边界。"
        },
        {
          "type": "text",
          "text": "② 苍天笑"
        },
        {
          "type": "text",
          "text": "，纷纷世上潮"
        },
        {
          "type": "text",
          "text": "看破世人的输赢执念。超脱、淡然——不是高兴，是\"想开了\"。"
        },
        {
          "type": "text",
          "text": "③ 江山笑"
        },
        {
          "type": "text",
          "text": "，烟雨遥"
        },
        {
          "type": "text",
          "text": "大浪淘沙，名利皆是泡影。苍茫、沧桑，有宋词气象。"
        },
        {
          "type": "text",
          "text": "④ 清风笑"
        },
        {
          "type": "text",
          "text": "，竟惹寂寥"
        },
        {
          "type": "text",
          "text": "★ 全词最苍凉的一笔：前面都看开了，还是逃不过知音难觅的寂寥。"
        },
        {
          "type": "text",
          "text": "⑤ 苍生笑"
        },
        {
          "type": "text",
          "text": "，不再寂寥"
        },
        {
          "type": "text",
          "text": "若世人都释然，孤独便不复存在。历经沧桑仍保留一腔赤诚——豁达。"
        },
        {
          "type": "text",
          "text": "所以答案不是\"豪迈\"或\"怅惘\"这种单一情绪，而是： 豪放的外壳里包着孤独的内核，最后一秒从苍凉翻成豁达。 那个转折点就是第④句「豪情还剩了一襟晚照」——被誉为全词神句： 壮美还在，怅惘已经漫上来，因为年华向晚。"
        },
        {
          "type": "text",
          "text": "这条弧线正好对应本节第 10 部分的五张场景卡（在「心情」维度里，标题带「·」的那几张）。 它们刻意用了五声族——因为这首歌本身就是纯五声写的： 「清风·寂寥」降到羽调式（忧郁）、压到最低音区、拉成十二秒一声的长音； 「苍生·豁达」回到宫调式（明亮）、音区回到中段、旋律开始上行。 不是回到天真，是回到\"想清楚了还能笑\"。"
        }
      ],
      "skip": true,
      "order": 58,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-emotion.c5",
      "course": "music",
      "chapter": "13 音乐能表达什么：十三个维度",
      "title": "十三个维度分别靠什么承载",
      "goal": "十三个维度分别靠什么承载 拆解的结论：一个维度通常由 3–5 个参数联合承载，任何一个单独拧到底都会失真。",
      "estimatedSeconds": 48,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "十三个维度分别靠什么承载"
        },
        {
          "type": "table",
          "headers": [
            "维度",
            "它在问什么",
            "靠什么承载",
            "卡片"
          ],
          "rows": [
            [
              "心情",
              "我现在的感受是什么？",
              "调式给底色 · 音头密度给唤醒度 · 音区给姿态 · 协和度给稳定性",
              "14"
            ],
            [
              "态度与性格",
              "这个声音是什么性格的人？",
              "装饰音密度定\"端着还是随意\" · 切分定\"皮还是乖\" · 音域跨度定张开还是收拢",
              "6"
            ],
            [
              "天气",
              "外面是什么天气？",
              "噪声层是主角 · 噪声与旋律的音量比决定它是背景还是前景",
              "7"
            ],
            [
              "温度",
              "现在多少度？",
              "协和度是主轴（冷=纯五，热=小二度摩擦）· 低通截止定通透还是黏",
              "5"
            ],
            [
              "时间",
              "这是几点？时间在怎么流？",
              "速度=流速 · 音区=时间的高度 · 音头密度=心跳感",
              "5"
            ],
            [
              "光与色",
              "这里亮不亮？什么颜色？",
              "泛音数量=亮度 · 低通截止=通透度 · 高频噪声=刺眼程度",
              "5"
            ],
            [
              "空间",
              "这地方有多空旷？离我多远？",
              "时值长度=空间大小（最可靠的一条）· 织体密度=远近 · 长音=纵深",
              "6"
            ],
            [
              "大小与重量",
              "这声音有多重？有多大？",
              "音区主导（低音=重/大，高音=轻/小）· 力度加固 · 起音时间决定有无撞击质量",
              "5"
            ],
            [
              "材质与触感",
              "我碰到的是什么？",
              "包络形状=材质（6ms 脆响=玻璃/金属，180ms 慢起=丝绸）· 噪声颗粒度=粗糙度",
              "5"
            ],
            [
              "运动状态",
              "它在往哪动？动得多快？",
              "速度曲线=加速度 · 音高走向=方向 · 节拍规则性=是否打滑",
              "6"
            ],
            [
              "叙事与事件",
              "正在发生什么事？",
              "和声张力—释放=戏剧结构 · 力度包络=事件强度 · 密度对比=场面调度",
              "6"
            ],
            [
              "身体与生理",
              "我的身体怎么了？",
              "节拍可直接对齐生理值（心跳 60–100，呼吸 12–20）· 低频脉冲=体腔共振",
              "6"
            ],
            [
              "文化与风格",
              "这是哪里的音乐？",
              "调式定地域（五声=中国，都节=日本）· 偏音定流派（苦音=秦腔）· 音色定乐器与腔调",
              "15"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "拆解的结论：一个维度通常由 3–5 个参数联合承载，任何一个单独拧到底都会失真。 比如「闷热」不是\"快\"，是\"慢而黏\"——低音区 + 偏属和弦 + 带风噪 + 中等密度，四件事一起才是闷热。"
        }
      ],
      "skip": true,
      "order": 59,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-emotion.c6",
      "course": "music",
      "chapter": "13 音乐能表达什么：十三个维度",
      "title": "写东西时的通用配方",
      "goal": "写东西时的通用配方 音区：低＝胸口发闷，中＝说话，高＝飘。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "写东西时的通用配方"
        },
        {
          "type": "table",
          "headers": [
            "你想要的",
            "调式",
            "速度",
            "音区",
            "织体",
            "力度"
          ],
          "rows": [
            [
              "阳光 / 欢快",
              "大调 或 利底亚",
              "快板",
              "中高",
              "琶音 / 碎音",
              "中强"
            ],
            [
              "温柔 / 睡前",
              "大调",
              "行板",
              "中",
              "琶音",
              "轻"
            ],
            [
              "忧伤 / 回忆",
              "小调、多利亚",
              "柔板",
              "中低",
              "琶音",
              "轻"
            ],
            [
              "孤独 / 深夜",
              "弗里几亚、小调",
              "广板",
              "低",
              "块状（极简）",
              "极轻"
            ],
            [
              "紧张 / 危险",
              "弗里几亚、洛克里亚",
              "急板",
              "高",
              "碎音、小二度",
              "强"
            ],
            [
              "烂漫 / 梦",
              "利底亚",
              "行板",
              "高",
              "微光琶音",
              "极轻"
            ],
            [
              "史诗 / 燃",
              "混合利底亚、大调",
              "快板",
              "全音域",
              "块状",
              "强"
            ],
            [
              "东方 / 古典",
              "五声（羽调、宫调）",
              "行板",
              "中",
              "散板琶音",
              "中"
            ],
            [
              "雨 / 雪 / 雾",
              "小调、五声",
              "柔板、广板",
              "中",
              "长音、雨噪",
              "极轻"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "音区：低＝胸口发闷，中＝说话，高＝飘。织体：块状和弦＝宣誓，琶音＝流水，碎音＝心动。"
        }
      ],
      "skip": true,
      "order": 60,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-ensemble.intro",
      "course": "music",
      "chapter": "14 配器：谁唱主、谁铺底",
      "title": "配器：谁唱主、谁铺底",
      "goal": "上一节把\"一个声音\"拆成十三个维度（明暗、空间、材质……）。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "上一节把\"一个声音\"拆成十三个维度（明暗、空间、材质……）。这一节把几个声音放在一起。 配器不是\"再加一件乐器\"，是分工：任何一件乐器在编曲里只占三格——音区、密度、起音。 三格里撞了两格，两件乐器就开始打架，这就是\"配器冲突\"的真身。最后三块留给整张专辑： 曲序是一条能听见的曲线，叙事专辑还得让第 8 首把第 1 首重新唱一次， 而动机本身怎么造——只会变形的人，写到第三首就没招了。"
        }
      ],
      "skip": true,
      "order": 61,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-ensemble.c1",
      "course": "music",
      "chapter": "14 配器：谁唱主、谁铺底",
      "title": "① 三格定位：任何乐器都在其中一格",
      "goal": "① 三格定位：任何乐器都在其中一格 问\"这里该加什么乐器\"之前，先问\"这里缺哪一格\"。",
      "estimatedSeconds": 81,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "① 三格定位：任何乐器都在其中一格"
        },
        {
          "type": "text",
          "text": "问\"这里该加什么乐器\"之前，先问\"这里缺哪一格\"。缺低音就补低音， 缺亮就补亮——不是缺\"更好听的乐器\"。"
        },
        {
          "type": "text",
          "text": "格一 · 音区"
        },
        {
          "type": "text",
          "text": "它在多高"
        },
        {
          "type": "text",
          "text": "低音垫底（听得见但听不清是什么乐器）、中音说话（人声和主乐都抢这里）、 高音发亮（一加就\"通\"）。"
        },
        {
          "type": "text",
          "text": "两个乐器抢同一个音区，就一定要有一个让。"
        },
        {
          "type": "text",
          "text": "格二 · 密度"
        },
        {
          "type": "text",
          "text": "它多忙"
        },
        {
          "type": "text",
          "text": "同一时刻只能有"
        },
        {
          "type": "text",
          "text": "一个东西在动"
        },
        {
          "type": "text",
          "text": "。主乐密、副乐就得疏； 副乐在跑琶音，主乐就该唱长音。"
        },
        {
          "type": "text",
          "text": "两件乐器都很忙，等于谁都没在说。"
        },
        {
          "type": "text",
          "text": "格三 · 起音"
        },
        {
          "type": "text",
          "text": "它多快出来"
        },
        {
          "type": "text",
          "text": "2 毫秒是\"敲\"，200 毫秒是\"吹\"。起音快的排在拍点上， 起音慢的就别塞进密集节奏里——"
        },
        {
          "type": "text",
          "text": "慢起音＋十六分音符＝一团糊"
        },
        {
          "type": "text",
          "text": "。"
        }
      ],
      "skip": true,
      "order": 62,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-ensemble.c2",
      "course": "music",
      "chapter": "14 配器：谁唱主、谁铺底",
      "title": "② 听三遍：同一条旋律，换三次主乐",
      "goal": "② 听三遍：同一条旋律，换三次主乐 下面三种编制，旋律一个音都没改（都是同一条 8 拍）， 只有\"谁来唱\"和\"其余两层怎么让\"不同。",
      "estimatedSeconds": 97,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "② 听三遍：同一条旋律，换三次主乐"
        },
        {
          "type": "text",
          "text": "下面三种编制，旋律一个音都没改（都是同一条 8 拍）， 只有\"谁来唱\"和\"其余两层怎么让\"不同。听的时候盯住一个问题：哪一层在你的耳朵前面。"
        },
        {
          "type": "text",
          "text": "旋律 · 8 拍"
        },
        {
          "type": "text",
          "text": "C5"
        },
        {
          "type": "text",
          "text": "D♯5"
        },
        {
          "type": "text",
          "text": "G5"
        },
        {
          "type": "text",
          "text": "G♯5"
        },
        {
          "type": "text",
          "text": "C6"
        },
        {
          "type": "text",
          "text": "A♯5"
        },
        {
          "type": "text",
          "text": "G5"
        },
        {
          "type": "text",
          "text": "D♯5"
        },
        {
          "type": "text",
          "text": "D6"
        },
        {
          "type": "text",
          "text": "A♯5"
        },
        {
          "type": "table",
          "headers": [
            "角色",
            "乐器",
            "音区",
            "密度",
            "起音"
          ],
          "rows": [
            [
              "主乐",
              "钢琴 piano",
              "C5 起",
              "1.8 音头/秒",
              "12 ms"
            ],
            [
              "和声",
              "钢琴 piano",
              "C4 起",
              "1.4 音头/秒",
              "12 ms"
            ],
            [
              "铺底",
              "低音 bass",
              "C2 起",
              "0.7 音头/秒",
              "20 ms"
            ]
          ]
        },
        {
          "type": "text",
          "text": "钢琴一个人包办"
        },
        {
          "type": "text",
          "text": "（钢琴 + 低音）"
        },
        {
          "type": "text",
          "text": "主乐和副乐是同一件乐器：音色一样，只能靠音区区分（右手旋律、左手和声）。它最省，也最容易糊——两条线同一个音色，听众只能靠\"谁在动\"去猜谁在说。"
        },
        {
          "type": "tip",
          "text": "盯住\"密度\"那一列：主乐永远是 1.8 音头/秒（十个旋律音摊在 8 拍里，三版都一样）， 副乐依次是 1.4 / 1.4 / 0.7——没有一版让副乐忙过主乐。三版各演示一件事： A 版主乐与副乐同音色，只能靠音区区分，所以最容易糊；B 版只换音色不换密度， 唯一的变量就是乐器；C 版换音区、并把中频让出来。主乐不动，副乐让位——这就是配器的全部动作。"
        }
      ],
      "skip": true,
      "order": 63,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-ensemble.c3",
      "course": "music",
      "chapter": "14 配器：谁唱主、谁铺底",
      "title": "③ 再往上一步：整张专辑就是一条能量曲线",
      "goal": "③ 再往上一步：整张专辑就是一条能量曲线 一首歌好不好听是词曲的事，一张专辑好不好听是排序的事。",
      "estimatedSeconds": 139,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "③ 再往上一步：整张专辑就是一条能量曲线"
        },
        {
          "type": "text",
          "text": "一首歌好不好听是词曲的事，一张专辑好不好听是排序的事。 八首歌、同样的内容，只换顺序，听感完全不同。下面是同一批歌的两种排法： 点的高度是听感密度（音头/秒），点下面是调。"
        },
        {
          "type": "text",
          "text": "按写出来的顺序"
        },
        {
          "type": "text",
          "text": "Am"
        },
        {
          "type": "text",
          "text": "1.1"
        },
        {
          "type": "text",
          "text": "Am"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "Em"
        },
        {
          "type": "text",
          "text": "4.2"
        },
        {
          "type": "text",
          "text": "C"
        },
        {
          "type": "text",
          "text": "2.2"
        },
        {
          "type": "text",
          "text": "C"
        },
        {
          "type": "text",
          "text": "3.6"
        },
        {
          "type": "text",
          "text": "F"
        },
        {
          "type": "text",
          "text": "1.6"
        },
        {
          "type": "text",
          "text": "Am"
        },
        {
          "type": "text",
          "text": "4.6"
        },
        {
          "type": "text",
          "text": "Am"
        },
        {
          "type": "text",
          "text": "1.3"
        },
        {
          "type": "text",
          "text": "按能量曲线重排"
        },
        {
          "type": "text",
          "text": "Am"
        },
        {
          "type": "text",
          "text": "1.1"
        },
        {
          "type": "text",
          "text": "Am"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "C"
        },
        {
          "type": "text",
          "text": "2.2"
        },
        {
          "type": "text",
          "text": "Em"
        },
        {
          "type": "text",
          "text": "4.2"
        },
        {
          "type": "text",
          "text": "F"
        },
        {
          "type": "text",
          "text": "1.6"
        },
        {
          "type": "text",
          "text": "C"
        },
        {
          "type": "text",
          "text": "3.6"
        },
        {
          "type": "text",
          "text": "Am"
        },
        {
          "type": "text",
          "text": "4.6"
        },
        {
          "type": "text",
          "text": "Am"
        },
        {
          "type": "text",
          "text": "1.3"
        },
        {
          "type": "text",
          "text": "纵轴＝听感密度（音头/秒）· 珊瑚红的点＝与上一首同调（连续同调最容易疲）"
        },
        {
          "type": "text",
          "text": "同样的八首，只换了顺序：原序第 2、3 首都是高能量，第 4、5 首都是 C 调——连着听两首就疲。重排把它们隔开，曲线起了两座山（4.2 与 4.6），收尾回到最低的那一格。"
        },
        {
          "type": "text",
          "text": "判据一 · 要有起伏"
        },
        {
          "type": "text",
          "text": "一路往上＝听一半就累，一路平＝听不出哪首是主打。"
        },
        {
          "type": "text",
          "text": "两起两落最稳"
        },
        {
          "type": "text",
          "text": "：第一座小山定调性，第二座大山放最好的那首。"
        },
        {
          "type": "text",
          "text": "判据二 · 相邻别同调"
        },
        {
          "type": "text",
          "text": "连着两首同一个调，第二首会被听成第一首的\"重播\"。"
        },
        {
          "type": "text",
          "text": "同调的隔开两首以上"
        },
        {
          "type": "text",
          "text": "，这是排序里最便宜也最有效的一刀。"
        },
        {
          "type": "text",
          "text": "判据三 · 收尾要落"
        },
        {
          "type": "text",
          "text": "最后一句决定\"听完记得什么\"。"
        },
        {
          "type": "text",
          "text": "落到最低那一格"
        },
        {
          "type": "text",
          "text": "（慢、疏、暗）， 人才会有\"完了\"的感觉；用最高能量收尾，等于没有结尾。"
        },
        {
          "type": "tip",
          "text": "专辑的另一半——辙口怎么分布、题材怎么分配、标题怎么排——属于文字，不看耳朵， 在作词课第 14 节。两页合起来才是一张完整的专辑： 这一页管\"听起来怎么起落\"，那一页管\"读起来怎么起落\"。"
        }
      ],
      "skip": true,
      "order": 64,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-ensemble.c4",
      "course": "music",
      "chapter": "14 配器：谁唱主、谁铺底",
      "title": "④ 最后一条线：第 8 首必须让第 1 首重新响一次",
      "goal": "④ 最后一条线：第 8 首必须让第 1 首重新响一次 ③ 管的是横向——首与首之间的能量曲线。",
      "estimatedSeconds": 100,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "④ 最后一条线：第 8 首必须让第 1 首重新响一次"
        },
        {
          "type": "text",
          "text": "③ 管的是横向——首与首之间的能量曲线。叙事专辑还多一条纵向的线： 听众要觉得\"合上了\"，靠的不是词里写一句\"我又回到这里\"，是同一段音乐真的又响了一次。 手段只有三个把手，而这三个都不是文字能做到的。"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "6"
        },
        {
          "type": "text",
          "text": "7"
        },
        {
          "type": "text",
          "text": "8"
        },
        {
          "type": "text",
          "text": "拍"
        },
        {
          "type": "text",
          "text": "动机原形：4 拍走完，只有一层长垫"
        },
        {
          "type": "text",
          "text": "第 8 首：同一个轮廓，8 拍才走完"
        },
        {
          "type": "text",
          "text": "第 1 首 · 动机原形"
        },
        {
          "type": "text",
          "text": "（原形：4 拍走完，1 层）"
        },
        {
          "type": "text",
          "text": "四个音，一步一级往上爬，走完四拍就停在五度上——话没说完。配器只有一条旋律加一层长垫，世界的规模还很小。"
        },
        {
          "type": "table",
          "headers": [
            "把手",
            "怎么动",
            "听出来的意思",
            "做错了会怎样"
          ],
          "rows": [
            [
              "动机变形",
              "轮廓不动，只改时值、音区或配器",
              "\"又是它\"——不需要任何提示，听众自己认出来",
              "轮廓跟着改了 → 那是新歌，不是呼应。改轮廓是最常见的假呼应"
            ],
            [
              "调性闭环",
              "末曲回到首曲的调；或者，故意换一个远关系调",
              "\"回去了\" / \"回不去\"——一个字都不用写",
              "一直停在同一个调里 → 从头到尾一个世界，等于没有旅程"
            ],
            [
              "配器收放",
              "层数从 1 走到 5（或者反过来）",
              "世界的规模变了：独处 → 有人 → 一群人 → 只剩自己",
              "全程同一个厚度 → 十首歌听起来像同一首的十个版本"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "上面两条线纵向完全重合：四个音一个都没改（根 → 全音 → 小三度 → 五度）， 只把时值全部加倍、配器从一层加到四层。听完再问自己一句： 这一段如果换成文字说，还成立吗？不成立——\"回去了\"从来不是一句话，是一个形状又出现了一次。 这正是叙事专辑必须两页合写的原因：词决定讲什么，乐决定它在第几分钟真的响起来。"
        }
      ],
      "skip": true,
      "order": 65,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-ensemble.c5",
      "course": "music",
      "chapter": "14 配器：谁唱主、谁铺底",
      "title": "⑤ 再往前一步：动机本身怎么生成",
      "goal": "⑤ 再往前一步：动机本身怎么生成 ④ 讲的是变形——轮廓一个音都不改，只改时值与配器。",
      "estimatedSeconds": 112,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "⑤ 再往前一步：动机本身怎么生成"
        },
        {
          "type": "text",
          "text": "④ 讲的是变形——轮廓一个音都不改，只改时值与配器。 但只会变形的人，写到第三首就没招了：同一个形状换四种速度，还是那一句。 这一节讲另一半：动机本身从哪儿来。母动机是四个音——根、全音、小三度、五度， 一步一级往上爬。下面五种手法，各从这个母动机派生出一个新的："
        },
        {
          "type": "text",
          "text": "0"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "拍"
        },
        {
          "type": "text",
          "text": "0"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "6"
        },
        {
          "type": "text",
          "text": "9"
        },
        {
          "type": "text",
          "text": "12"
        },
        {
          "type": "text",
          "text": "半音"
        },
        {
          "type": "text",
          "text": "母动机"
        },
        {
          "type": "text",
          "text": "节奏化（生成结果）"
        },
        {
          "type": "text",
          "text": "节奏化"
        },
        {
          "type": "text",
          "text": "："
        },
        {
          "type": "text",
          "text": "音高一个都不改"
        },
        {
          "type": "text",
          "text": "，只把四个音重新分配时长与位置"
        },
        {
          "type": "text",
          "text": "听出来是：还是那几个音，但\"说话的方式\"变了——同一句话换个语气"
        },
        {
          "type": "text",
          "text": "同样的四个音，但前两个挤成半拍、后两个拉长——还是那句话，语速和停顿改了。"
        },
        {
          "type": "table",
          "headers": [
            "手法",
            "怎么动",
            "听出来是",
            "做错了会怎样"
          ],
          "rows": [
            [
              "节奏化",
              "音高一个都不改，只把四个音重新分配时长与位置",
              "还是那几个音，但\"说话的方式\"变了——同一句话换个语气",
              "音高改了就不再是同一句了；只改节奏时也可能听着像节奏没变"
            ],
            [
              "移位",
              "音高与节奏都不改，整条挪到别的拍上",
              "同一句素材，只是换了出场的时间点——像同一句话说第二遍",
              "挪得太远就听不出是它；挪一点点又像没挪"
            ],
            [
              "逆行",
              "音高顺序整个倒过来（7 3 2 0），节奏不变",
              "认得出是它，但方向反了——像把一句话倒着念",
              "倒过来之后往往不像原来那么\"顺\"，用多了会显得刻意"
            ],
            [
              "移调",
              "整条挪到另一个音高（升纯四度），音程关系一个不改",
              "还是那条旋律，但情绪换了——同一首歌换了调",
              "移得太远就换了调性；移调不能替代\"重新写一条\""
            ],
            [
              "增减音",
              "加一个音或减一个音，其余不动——唯一会改变音头数量的手法",
              "还是那条旋律，但多了一口气（长音）或少了一口气（切分）",
              "加的音放错位置会突兀；减掉了骨干音就散架了"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "先听母动机、再听生成结果——这才是这一节的用法。 图上两条线，浅色虚线是母动机、深色实线是生成结果： 节奏化两条线在音高上完全重合（只有点错开了）， 移位整条平移，逆行左右翻转，移调平行上移， 增减音多一个点。改的是哪一样，图上一眼就看得出来，不用背。 顺序上也有讲究：先用节奏化（最安全）、再用移位与移调（换位置换高度）， 逆行与增减音留到最后——这两样最容易被听腻，用多了整首歌会显得刻意。"
        }
      ],
      "skip": true,
      "order": 66,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-advance.intro",
      "course": "music",
      "chapter": "15 再往上一步：转调与七和弦",
      "title": "再往上一步：转调与七和弦",
      "goal": "这两个是\"从顺口到动人\"最关键的两级台阶。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "这两个是\"从顺口到动人\"最关键的两级台阶。转调负责把情绪炸开，七和弦负责让色彩从三原色变成水彩。"
        }
      ],
      "skip": true,
      "order": 67,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-advance.c1",
      "course": "music",
      "chapter": "15 再往上一步：转调与七和弦",
      "title": "七和弦：在三和弦上再叠一个三度",
      "goal": "七和弦：在三和弦上再叠一个三度 本来三个音，现在四个音。",
      "estimatedSeconds": 59,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "七和弦：在三和弦上再叠一个三度"
        },
        {
          "type": "text",
          "text": "本来三个音，现在四个音。多出来的那个音决定了味道：梦幻、想回家、顺滑、还是悬着。 方块按音高排列，最后一个就是新叠上去的那个。"
        },
        {
          "type": "text",
          "text": "C"
        },
        {
          "type": "text",
          "text": "C♯"
        },
        {
          "type": "text",
          "text": "D"
        },
        {
          "type": "text",
          "text": "D♯"
        },
        {
          "type": "text",
          "text": "E"
        },
        {
          "type": "text",
          "text": "F"
        },
        {
          "type": "text",
          "text": "F♯"
        },
        {
          "type": "text",
          "text": "G"
        },
        {
          "type": "text",
          "text": "G♯"
        },
        {
          "type": "text",
          "text": "A"
        },
        {
          "type": "text",
          "text": "A♯"
        },
        {
          "type": "text",
          "text": "B"
        },
        {
          "type": "text",
          "text": "C4"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "E4"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "G4"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "B4"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "tip",
          "text": "大七 maj7 拼：根 三 五 七 最梦幻、最慵懒。像午后阳光里慢慢飘的灰尘，久石让常用。"
        }
      ],
      "skip": true,
      "order": 68,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-advance.c2",
      "course": "music",
      "chapter": "15 再往上一步：转调与七和弦",
      "title": "转调：同一段旋律，换一套音阶",
      "goal": "转调：同一段旋律，换一套音阶 旋律的音高关系一个都不改，只把整套音阶搬家。",
      "estimatedSeconds": 56,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "转调：同一段旋律，换一套音阶"
        },
        {
          "type": "text",
          "text": "旋律的音高关系一个都不改，只把整套音阶搬家。副歌最后升高全音或半音是华语流行最常用的\"炸开\"手法， 听一次你就认出这个感觉。"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "6"
        },
        {
          "type": "text",
          "text": "7"
        },
        {
          "type": "text",
          "text": "8"
        },
        {
          "type": "text",
          "text": "9"
        },
        {
          "type": "text",
          "text": "C4"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "text",
          "text": "D4"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "E4"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "F4"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "G4"
        },
        {
          "type": "text",
          "text": "5"
        },
        {
          "type": "text",
          "text": "F4"
        },
        {
          "type": "text",
          "text": "4"
        },
        {
          "type": "text",
          "text": "E4"
        },
        {
          "type": "text",
          "text": "3"
        },
        {
          "type": "text",
          "text": "D4"
        },
        {
          "type": "text",
          "text": "2"
        },
        {
          "type": "text",
          "text": "C4"
        },
        {
          "type": "text",
          "text": "1"
        },
        {
          "type": "tip",
          "text": "C 大调（原位） 基准，最平稳。"
        }
      ],
      "skip": true,
      "order": 69,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-cheat.c1",
      "course": "music",
      "chapter": "16 全部速查",
      "title": "术语速查",
      "goal": "术语速查",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "术语速查"
        },
        {
          "type": "table",
          "headers": [],
          "rows": [
            [
              "半音 Half step",
              "钢琴相邻两键。音乐的最小单位"
            ],
            [
              "全音 Whole step",
              "两个半音"
            ],
            [
              "音程 Interval",
              "两个音之间的距离，按半音数命名"
            ],
            [
              "调 Key",
              "主音 + 调式。例如\"C 大调\""
            ],
            [
              "调号 Key signature",
              "谱上的升降号，告诉你哪些音要动"
            ],
            [
              "调式 Mode",
              "从不同音起步得到的七种音阶性格"
            ],
            [
              "和弦 Chord",
              "三个以上音同时响"
            ],
            [
              "三和弦 Triad",
              "三个音、隔一个音叠起来的和弦"
            ],
            [
              "三度 Third",
              "跨过一级的距离。大=亮，小=暗"
            ],
            [
              "和声进行 Progression",
              "和弦一个接一个走，像句子"
            ],
            [
              "终止式 Cadence",
              "乐句怎么停下/回家。V→I 最满足"
            ],
            [
              "强弱 Dynamics",
              "p 轻、f 强、crescendo 渐强"
            ],
            [
              "织体 Texture",
              "音符是堆成块、拆成琶音、还是散着"
            ],
            [
              "弱起 Anacrusis",
              "抢在正拍前进来的那半拍"
            ],
            [
              "切分 Syncopation",
              "重音挪到反拍"
            ],
            [
              "转调 Modulation",
              "中途换调，情绪炸开的常用手段"
            ],
            [
              "七和弦 Seventh chord",
              "四个音、隔一个音叠三层的和弦"
            ],
            [
              "属七 Dominant 7th",
              "大三和弦 + 小七度，天生\"想解决\""
            ],
            [
              "琶音 Arpeggio",
              "和弦音依次快速奏出"
            ],
            [
              "主音 Tonic",
              "音阶第一个音，也就是\"家\""
            ],
            [
              "偏音",
              "五声之外借进来的音，制造苦味"
            ],
            [
              "挂留 Sus2 / Sus4",
              "把三度换成二度/四度，悬着不落，制造期待"
            ],
            [
              "辙口",
              "十三辙。按韵母归类的押韵单位，不是韵母本身"
            ],
            [
              "倒字",
              "旋律走向和字调打架，\"想\"被唱成了\"像\""
            ],
            [
              "气口",
              "一句话留出的换气点。逗号必须落在这"
            ],
            [
              "开口音 / 闭口音",
              "a 最响、i/u 最暗。长高音优先开口韵"
            ],
            [
              "一字多音",
              "一个字配好几个音符，拖腔就是它"
            ]
          ]
        }
      ],
      "skip": true,
      "order": 70,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "music.s-cheat.c2",
      "course": "music",
      "chapter": "16 全部速查",
      "title": "顺口溜",
      "goal": "顺口溜",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "顺口溜"
        },
        {
          "type": "list",
          "ordered": false,
          "items": [
            "大调亮，小调暗，差别只在第三间",
            "行板是走路，柔板是叹气，快板是小跑，急板是冲刺",
            "多利亚 = 小调抬六，暗里透光",
            "利底亚 = 大调升四，亮得上天",
            "混合利底亚 = 大调降七，痞且不服",
            "五声无半音，所以不咬人；借个偏音，才咬得住",
            "大和弦宣誓，小和弦诉说，减和弦卡住",
            "4/4 走路，3/4 荡秋千，6/8 划船",
            "低音区沉，中音区真，高音区仙",
            "想学会写歌，先学会\"用音区说话\""
          ]
        }
      ],
      "skip": true,
      "order": 71,
      "task": {
        "type": "action",
        "prompt": "按顺序读完后过页",
        "label": "我读完了",
        "explain": "顺序本身就是知识的一部分；跳过也不会卡进度。"
      }
    },
    {
      "id": "music.s-cheat.c3",
      "course": "music",
      "chapter": "16 全部速查",
      "title": "写完一首歌的自查清单",
      "goal": "写完一首歌的自查清单 按这张表过一遍，比再学十个新概念都管用。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "写完一首歌的自查清单"
        },
        {
          "type": "table",
          "headers": [
            "检查项",
            "达标感觉"
          ],
          "rows": [
            [
              "主歌是否比副歌低？",
              "同一段旋律，主歌中低音、副歌高八度，情绪自然分层"
            ],
            [
              "副歌结尾有没有清楚的\"回家\"？",
              "用 V→I 正格终止，别停在悬着的和弦上"
            ],
            [
              "和弦进行是否只在安全区打转？",
              "试试 IV–V–iii–vi 或 ii–V–I，再回 1645"
            ],
            [
              "有没有一处\"意外\"？",
              "阻碍终止 V→vi、借一个偏音、或突然转调，三选一"
            ],
            [
              "情绪有没有被推高一次？",
              "副歌升全音/半音，或整体加厚配器"
            ],
            [
              "有没有留白？",
              "最长的一句之后接一个空拍，比继续填满更有力"
            ],
            [
              "弱起/切分用了吗？",
              "至少一处，节奏立刻从\"走路\"变成\"说话\""
            ],
            [
              "力度曲线是什么形状？",
              "轻起→渐强→收，别从头到尾一个音量"
            ],
            [
              "念一遍，有没有字听着别扭？",
              "不唱只念。哪个字念着不顺，唱出来一定倒字"
            ],
            [
              "最高音落在哪个字上？",
              "那个字就是主题词。若是\"的\"\"了\"，说明重音给错了人"
            ],
            [
              "一口气能唱完一句吗？",
              "唱不顺就是字太密。删字比加气更有效"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "按这张表过一遍，比再学十个新概念都管用。"
        }
      ],
      "skip": true,
      "order": 72,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-rule.intro",
      "course": "lyric",
      "chapter": "00 先分清：词不是诗",
      "title": "先分清：词不是诗",
      "goal": "写词和写诗共享材料，不共享判据。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "写词和写诗共享材料，不共享判据。诗靠读，词靠唱—— 每一句都要塞得进旋律，还要在旋律上不露破绽。更麻烦的是，词的毛病分两种： 一种能数出来，一种只能读出来。分不清这两层，就会拿\"读着还行\"糊弄自己。"
        }
      ],
      "skip": true,
      "order": 1,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-rule.c1",
      "course": "lyric",
      "chapter": "00 先分清：词不是诗",
      "title": "两层判据：能数的 / 只能人读的",
      "goal": "两层判据：能数的 / 只能人读的 下面每一节都会标出它属于哪一层。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "两层判据：能数的 / 只能人读的"
        },
        {
          "type": "table",
          "headers": [
            "层级",
            "判据",
            "判法"
          ],
          "rows": [
            [
              "能数",
              "抽象名词 ≤2 个；连续全韵 ≤2 行；一段形容词 ≤3 个；句长方差；钩子 3–10 字",
              "手动按阈值数。本页末尾的自检器能替你数掉一半"
            ],
            [
              "只能人读",
              "画面是否成立（删掉情绪词还剩下什么）；主歌二是否真的发展了； 语义有没有被韵脚破坏；念着顺不顺",
              "朗读。这四条没有替代品，脚本碰不了"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "下面每一节都会标出它属于哪一层。凡标「人读」的， 本页不会假装能自动检查——说查过而没查，比不查更糟。"
        }
      ],
      "skip": true,
      "order": 2,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-rule.c2",
      "course": "lyric",
      "chapter": "00 先分清：词不是诗",
      "title": "一条贯穿全页的换算：中文字数 ≈ 英文重音数",
      "goal": "一条贯穿全页的换算：中文字数 ≈ 英文重音数 这张表是第 03、04 两节的索引。",
      "estimatedSeconds": 47,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "一条贯穿全页的换算：中文字数 ≈ 英文重音数"
        },
        {
          "type": "table",
          "headers": [
            "维度",
            "中文（普通话）",
            "英文"
          ],
          "rows": [
            [
              "计时方式",
              "按字计时：每个字约等长",
              "按重音计时：重音等距，虚词被压缩"
            ],
            [
              "数什么",
              "字数",
              "重音数（音节数是次要的）"
            ],
            [
              "一句话的直觉",
              "8 字一句",
              "一行 3–5 个重音（音节可以 8–12 个）"
            ],
            [
              "第一硬门",
              "押韵方案（按体裁定）",
              "prosody：重音必须落强拍"
            ],
            [
              "成熟标志",
              "敢用近韵",
              "敢用斜韵"
            ],
            [
              "最大俗气",
              "霓虹 / 破碎 / 永恒",
              "love / forever / destiny"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "这张表是第 03、04 两节的索引。它和乐理课第 11 节的「计时法」是同一件事的两种说法： 那边用三条时间轴把它播出来听，这边用它决定\"一句该写几个字\"。"
        }
      ],
      "skip": true,
      "order": 3,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-genre.intro",
      "course": "lyric",
      "chapter": "01 体裁决定押韵：先查表，再动笔",
      "title": "体裁决定押韵：先查表，再动笔",
      "goal": "没有普适默认。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "没有普适默认。每种体裁有自己的押韵约定——给民谣 ballad 用 AABB 密集尾韵、 给说唱用\"押韵少一点\"，都会立刻露出外行感。你最该改掉的坏习惯， 是拿\"我记得的流行歌怎么押\"去套所有歌。点体裁看它的约定："
        }
      ],
      "skip": true,
      "order": 4,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-genre.c1",
      "course": "lyric",
      "chapter": "01 体裁决定押韵：先查表，再动笔",
      "title": "体裁决定押韵：先查表，再动笔 · 1",
      "goal": "流行 Pop Pop 默认押韵方案 X A X A 第 1–4 行（X ＝ 不押） 严格度 低 句式 7–11 字/句，对仗不严 副歌用开口韵；",
      "estimatedSeconds": 90,
      "blocks": [
        {
          "type": "text",
          "text": "流行 Pop"
        },
        {
          "type": "text",
          "text": "Pop"
        },
        {
          "type": "text",
          "text": "默认押韵方案"
        },
        {
          "type": "text",
          "text": "X"
        },
        {
          "type": "text",
          "text": "A"
        },
        {
          "type": "text",
          "text": "X"
        },
        {
          "type": "text",
          "text": "A"
        },
        {
          "type": "text",
          "text": "第 1–4 行（X ＝ 不押）"
        },
        {
          "type": "text",
          "text": "严格度"
        },
        {
          "type": "text",
          "text": "低"
        },
        {
          "type": "text",
          "text": "句式"
        },
        {
          "type": "text",
          "text": "7–11 字/句，对仗不严"
        },
        {
          "type": "text",
          "text": "副歌用开口韵；近韵优于硬全韵"
        },
        {
          "type": "tip",
          "text": "严格度不是\"好不好\"，是这套体裁对\"预期被满足\"的容忍度： 说唱要塞满韵脚才撑得住 flow，R&B 押松了才不打断转音。同一段词换个体裁，可能完全不合格。"
        },
        {
          "type": "tip",
          "text": "三个词要解释，因为中文里常被混着用： ballad 是\"民谣叙事曲\"——它靠讲故事推进，所以押韵可以疏（ABCB）， 不等于中文口语里的\"抒情慢歌\"（后者更接近 power ballad）。 flow 是说唱里字落在拍子上的流动感：韵脚越密、句内韵越多，flow 越站得住； 词写得再漂亮，落不到拍子上就没有 flow。 R&B 是节奏布鲁斯，唱腔转音多，所以词必须松——每个字都咬死就没法转了。"
        }
      ],
      "skip": true,
      "order": 5,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-genre.c2",
      "course": "lyric",
      "chapter": "01 体裁决定押韵：先查表，再动笔",
      "title": "三种典型翻车",
      "goal": "三种典型翻车",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "三种典型翻车"
        },
        {
          "type": "table",
          "headers": [
            "翻车",
            "表现",
            "修法"
          ],
          "rows": [
            [
              "给民谣用密集全韵",
              "每句都在喊，像儿歌",
              "改 ABCB，只押 2/4 行"
            ],
            [
              "给说唱用抒情式散押",
              "词写得好，但唱不出 flow",
              "改严格 AABB + 补句内韵"
            ],
            [
              "给古风堆辞藻",
              "通篇意象，没有情绪落点",
              "每个意象必须指向同一种情绪，砍掉无用的"
            ]
          ]
        }
      ],
      "skip": true,
      "order": 6,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-rhyme.intro",
      "course": "lyric",
      "chapter": "02 韵脚五型与方案字母表",
      "title": "韵脚五型与方案字母表",
      "goal": "押韵不是\"押上\"或\"没押上\"两档。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "押韵不是\"押上\"或\"没押上\"两档。押得准、押得偏、押在句子里——是三种不同的工具， 混着用才不会腻。而\"哪几行押\"这件事有字母表，写之前先选一种，一段之内不许中途换方案。"
        }
      ],
      "skip": true,
      "order": 7,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-rhyme.c1",
      "course": "lyric",
      "chapter": "02 韵脚五型与方案字母表",
      "title": "韵脚五型",
      "goal": "韵脚五型 全韵密集会像儿歌，全是斜韵会显得懒。",
      "estimatedSeconds": 85,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "韵脚五型"
        },
        {
          "type": "table",
          "headers": [
            "类型",
            "英文（为什么叫这个）",
            "定义",
            "例",
            "怎么用"
          ],
          "rows": [
            [
              "全韵",
              "perfect rhyme\"完全的\"韵：韵母一模一样，严丝合缝",
              "韵母完全相同",
              "冷 / 静",
              "只留给情绪转折那一次"
            ],
            [
              "斜韵",
              "slant rhyme\"斜的\"韵：擦着边、没对准，也叫 near rhyme",
              "韵腹近、韵尾不同",
              "丢 / 走",
              "主力。留一点\"没解决\"的张力"
            ],
            [
              "元音韵",
              "assonanceassonance 管元音：只元音相同，韵尾不管（A 记元音）",
              "只元音相同，韵尾可以不同",
              "湖 / 路 / 苦（都是 u）",
              "句中、行内"
            ],
            [
              "辅音韵",
              "consonanceconsonance 管辅音：只收尾辅音相同（C 记辅音）",
              "韵尾辅音相同",
              "心 / 深（-n 收尾）",
              "句中"
            ],
            [
              "句内韵",
              "internal rhyme\"内部的\"韵：不跨行，一行里自己跟自己押",
              "一行之内就押上",
              "火烧眉毛，才想起水",
              "说唱与 Trap 的主力，流行一段 1–2 处"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "全韵密集会像儿歌，全是斜韵会显得懒。全韵留在一两个关键位置， 其余用斜韵托着——那个\"没解决\"的张力才是成熟的听感。"
        },
        {
          "type": "tip",
          "text": "两个英文词要拆开看：perfect 是\"完全的\"——韵母一模一样，严丝合缝； slant 是\"斜的\"——擦着边、没对准。所以全韵／斜韵不是\"好／坏\"两档， 是对准与没对准。同理 assonance 管元音、consonance 管辅音（首字母 A / C 就是记法）。 一个术语要纠正：有些资料把 assonance 叫「头韵」，那是笔误。 头韵（alliteration）指词首辅音相同，如 helplessly hoping； 元音韵（assonance）才是韵母相同，如 lake / fate。 叫混了会在跟人讨论时露怯。"
        }
      ],
      "skip": true,
      "order": 8,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-rhyme.c2",
      "course": "lyric",
      "chapter": "02 韵脚五型与方案字母表",
      "title": "八种押韵方案",
      "goal": "八种押韵方案 不押的行写 X。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "八种押韵方案"
        },
        {
          "type": "table",
          "headers": [
            "方案",
            "结构",
            "听感",
            "风险"
          ],
          "rows": [
            [
              "AABB",
              "两行一押",
              "稳、当场解决",
              "连续用＝童谣感"
            ],
            [
              "ABAB",
              "隔行押",
              "经典、延迟解决",
              "太整齐会假"
            ],
            [
              "ABCB",
              "偶数行押",
              "松、叙事感强（民谣-ballad 标准）",
              "太平，需要 hook 撑"
            ],
            [
              "AAB",
              "三行式",
              "布鲁斯标志（第三行应答第一行）",
              "只在布鲁斯里成立"
            ],
            [
              "AAAAX",
              "四行同韵 + 意外收尾",
              "强铺垫、反转收尾",
              "收尾必须真的意外"
            ],
            [
              "XAXA",
              "松散",
              "口语感（流行/摇滚常用）",
              "松过头就没记忆点"
            ],
            [
              "AABA",
              "三行同 + 变奏",
              "爵士标准（32 小节）",
              "要唱功撑"
            ],
            [
              "ABBA",
              "抱韵",
              "首尾同韵、环形呼应（中文韵文传统）",
              "中间两行容易被忘"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "不押的行写 X。同一字母＝同一组韵。"
        }
      ],
      "skip": true,
      "order": 9,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-rhyme.c3",
      "course": "lyric",
      "chapter": "02 韵脚五型与方案字母表",
      "title": "三条纪律",
      "goal": "三条纪律",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "三条纪律"
        },
        {
          "type": "list",
          "ordered": false,
          "items": [
            "主歌低密度，副歌转折处放一个全韵。全韵是重音，不是常态。",
            "连续全韵不超过 2 行（民谣 AABB 例外，但它靠旋律区分）。",
            "一段之内不许中途换方案，换段可以。"
          ]
        }
      ],
      "skip": true,
      "order": 10,
      "task": {
        "type": "action",
        "prompt": "按顺序读完后过页",
        "label": "我读完了",
        "explain": "顺序本身就是知识的一部分；跳过也不会卡进度。"
      }
    },
    {
      "id": "lyric.s-cn.intro",
      "course": "lyric",
      "chapter": "03 中文：字数、顿点、开口度",
      "title": "中文：字数、顿点、开口度",
      "goal": "中文按字计时，所以中文写词的第一件事是数。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "中文按字计时，所以中文写词的第一件事是数。 但字数只是下限——同样七个字，切分不同就是两句话。切分（顿点）决定旋律在哪里呼吸。"
        }
      ],
      "skip": true,
      "order": 11,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-cn.c1",
      "course": "lyric",
      "chapter": "03 中文：字数、顿点、开口度",
      "title": "句式与切分",
      "goal": "句式与切分 同一段素材，把两种切分都试读一遍，选最贴合旋律呼吸的那个。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "句式与切分"
        },
        {
          "type": "table",
          "headers": [
            "句式",
            "常见切分",
            "适配",
            "例"
          ],
          "rows": [
            [
              "四言",
              "2+2",
              "短促、好记",
              "意味 / 阑珊"
            ],
            [
              "五言",
              "2+3（沉稳）",
              "国风、叙事",
              "明月 / 几时有"
            ],
            [
              "五言",
              "3+2（灵动）",
              "轻快的叙述",
              "把酒 / 问青天"
            ],
            [
              "七言",
              "4+3（最稳）",
              "华语流行主力",
              "想你时 / 你在天边"
            ],
            [
              "七言",
              "2+2+3",
              "R&B、中快板",
              "开了灯 / 眼前 / 的模样"
            ],
            [
              "八言",
              "4+4",
              "副歌大段抒情",
              "开了灯 / 眼前的模样"
            ],
            [
              "长句",
              "不强求工整",
              "叙事、抓逻辑重音",
              "靠换气口断句，不靠字数"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "同一段素材，把两种切分都试读一遍，选最贴合旋律呼吸的那个。 同一段内交错切分比通篇一种更鲜活；长短句穿插，层次立刻拉开。 破格只给情绪需要的那一句。"
        }
      ],
      "skip": true,
      "order": 12,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-cn.c2",
      "course": "lyric",
      "chapter": "03 中文：字数、顿点、开口度",
      "title": "字数参考（不是规定，是安全区）",
      "goal": "字数参考（不是规定，是安全区） 主歌 5–9 字 古风可长句化；",
      "estimatedSeconds": 53,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "字数参考（不是规定，是安全区）"
        },
        {
          "type": "text",
          "text": "主歌"
        },
        {
          "type": "text",
          "text": "5–9 字"
        },
        {
          "type": "text",
          "text": "古风可长句化；民谣可口语化放宽"
        },
        {
          "type": "text",
          "text": "副歌"
        },
        {
          "type": "text",
          "text": "7–11 字"
        },
        {
          "type": "text",
          "text": "超了就得靠拖腔或删字，别硬塞"
        },
        {
          "type": "tip",
          "text": "字数超了怎么办：删字永远比加气有效。这一条在乐理课第 11 节「气口」那张卡上 是能被听出来的（低于 0.75 拍/字就开始赶），这里只给结论。"
        }
      ],
      "skip": true,
      "order": 13,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-cn.c3",
      "course": "lyric",
      "chapter": "03 中文：字数、顿点、开口度",
      "title": "开口度：副歌为什么偏爱江阳、发花",
      "goal": "开口度：副歌为什么偏爱江阳、发花 十三辙按响度排下来，最响的是 江阳（ang） 与 发花（a）， 最暗最沉的是 一七（i / ü） 与 姑苏（u）。",
      "estimatedSeconds": 96,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "开口度：副歌为什么偏爱江阳、发花"
        },
        {
          "type": "text",
          "text": "十三辙按响度排下来，最响的是 江阳（ang） 与 发花（a）， 最暗最沉的是 一七（i / ü） 与 姑苏（u）。这不是审美排序，是声学事实： 韵腹开口度越大，第一共振峰越高，听着就越响。"
        },
        {
          "type": "text",
          "text": "副歌高潮 → 开口辙"
        },
        {
          "type": "text",
          "text": "江阳 · 发花 · 言前 · 遥条。闭口韵在长高音上"
        },
        {
          "type": "text",
          "text": "根本撑不住"
        },
        {
          "type": "text",
          "text": "。"
        },
        {
          "type": "text",
          "text": "呢喃段 → 闭口辙"
        },
        {
          "type": "text",
          "text": "一七 · 姑苏 · 由求 · 中东。细、紧、私语感。"
        },
        {
          "type": "tip",
          "text": "完整十三辙表（含每辙收哪些韵母、响度几颗点）在乐理课第 11 节—— 那边是表格加声学解释，这边不重复造一遍。"
        },
        {
          "type": "tip",
          "text": "两个声学术语，一句话讲完：一个音节分成韵头 + 韵腹 + 韵尾， 韵腹是中间最响的那个元音（\"江\"jiang 里是 a）， 韵尾是它后面的收音（ng）。 开口度说的就是韵腹：a 嘴张得最大，i / u 几乎闭着。 押韵押的是韵腹 + 韵尾这一整段，所以\"江 / 光\"能押，\"江 / 机\"不能。"
        }
      ],
      "skip": true,
      "order": 14,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-cn.c4",
      "course": "lyric",
      "chapter": "03 中文：字数、顿点、开口度",
      "title": "「念」比「读」重要",
      "goal": "「念」比「读」重要 写完大声念出来。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "「念」比「读」重要"
        },
        {
          "type": "text",
          "text": "写完大声念出来。念着顺，唱才会顺；念着卡，是句子太长或重音不对。 「读」是看字，「念」是让嘴唇和肺替你检查——这是人读层最便宜的一次验证，也是最容易被跳过的一次。"
        }
      ],
      "skip": true,
      "order": 15,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-en.intro",
      "course": "lyric",
      "chapter": "04 英文：数重音，不数字节",
      "title": "英文：数重音，不数字节",
      "goal": "中文那套「字数 / 十三辙 / 开口韵」在英文里全部失效——不是不好用，是量错了东西。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "中文那套「字数 / 十三辙 / 开口韵」在英文里全部失效——不是不好用，是量错了东西。 英文的第一硬门是 prosody（词曲贴合）：词的自然重音必须落在旋律的强拍或长音上。 这一条比押韵重要得多。"
        }
      ],
      "skip": true,
      "order": 16,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-en.c1",
      "course": "lyric",
      "chapter": "04 英文：数重音，不数字节",
      "title": "为什么重音比押韵要紧",
      "goal": "为什么重音比押韵要紧 我们说 to-GE-ther，不说 TO-ge-ther。",
      "estimatedSeconds": 56,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "为什么重音比押韵要紧"
        },
        {
          "type": "text",
          "text": "我们说 to-GE-ther，不说 TO-ge-ther。 把重音唱错位置，母语听众会立刻觉得「这歌手不会唱英文」—— 这是英文版的「倒字」，但后果更重：中文倒字只是别扭，英文 misstress 直接毁掉可信度。"
        },
        {
          "type": "list",
          "ordered": false,
          "items": [
            "按正常说话语速念这一行；",
            "用笔标出重读音节（大写）；",
            "回头看旋律：这些大写音节有没有落在强拍或长音上。"
          ]
        },
        {
          "type": "tip",
          "text": "改法只有两条：换词序，或换词。不许靠改旋律迁就词——词是来服务旋律的。"
        }
      ],
      "skip": true,
      "order": 17,
      "task": {
        "type": "action",
        "prompt": "按顺序读完后过页",
        "label": "我读完了",
        "explain": "顺序本身就是知识的一部分；跳过也不会卡进度。"
      }
    },
    {
      "id": "lyric.s-en.c2",
      "course": "lyric",
      "chapter": "04 英文：数重音，不数字节",
      "title": "优雅五条（全是动作，不是形容词）",
      "goal": "优雅五条（全是动作，不是形容词） 克制 不出现 love，让事实说话。",
      "estimatedSeconds": 126,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "优雅五条（全是动作，不是形容词）"
        },
        {
          "type": "text",
          "text": "克制"
        },
        {
          "type": "text",
          "text": "不出现 love，让事实说话。优雅来自"
        },
        {
          "type": "text",
          "text": "说得比感受少"
        },
        {
          "type": "text",
          "text": "。"
        },
        {
          "type": "text",
          "text": "✗ I love you more than anything"
        },
        {
          "type": "text",
          "text": "✓ If you're ever in the city, the key's still under the mat"
        },
        {
          "type": "text",
          "text": "具体"
        },
        {
          "type": "text",
          "text": "给真实的时间、地点、物件。"
        },
        {
          "type": "text",
          "text": "具体名词是可信度的证据。"
        },
        {
          "type": "text",
          "text": "✗ your beautiful eyes"
        },
        {
          "type": "text",
          "text": "✓ the way you check the stove twice before we leave"
        },
        {
          "type": "text",
          "text": "斜韵优于全韵"
        },
        {
          "type": "text",
          "text": "连续 4 行全韵 = 儿歌。敢用斜韵才是成熟的标志。"
        },
        {
          "type": "text",
          "text": "✗ heart / apart / start / part"
        },
        {
          "type": "text",
          "text": "✓ heart / hard · home / gone"
        },
        {
          "type": "text",
          "text": "动词优于形容词"
        },
        {
          "type": "text",
          "text": "形容词是主张，动词是证据。"
        },
        {
          "type": "text",
          "text": "一段形容词超过 3 个，回去改动词。"
        },
        {
          "type": "text",
          "text": "✗ She was beautiful."
        },
        {
          "type": "text",
          "text": "✓ She tucked her hair behind her ear before every hard sentence."
        },
        {
          "type": "text",
          "text": "留白"
        },
        {
          "type": "text",
          "text": "省掉宾语，让听众自己填。省掉的必须是最重的那一个词。一首最多两处。"
        },
        {
          "type": "text",
          "text": "✗ I will always remember everything about that night"
        },
        {
          "type": "text",
          "text": "✓ And if you ever…"
        }
      ],
      "skip": true,
      "order": 18,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-en.c3",
      "course": "lyric",
      "chapter": "04 英文：数重音，不数字节",
      "title": "两条传统：选一条，别混着走",
      "goal": "两条传统：选一条，别混着走 先定一条，整首不换。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "两条传统：选一条，别混着走"
        },
        {
          "type": "table",
          "headers": [
            "",
            "wit 传统",
            "plain 传统"
          ],
          "rows": [
            [
              "来源",
              "爵士标准曲 / 音乐剧",
              "民谣 / 现代独立"
            ],
            [
              "优雅来自",
              "聪明：巧妙的韵、双关、都市感",
              "诚实：极简、克制、不解释"
            ],
            [
              "手法",
              "多音节韵、行内韵、反转句——一句话里塞两个意思",
              "短句、白描、一个物件走到底——一句话只说一件事"
            ],
            [
              "风险",
              "炫技、油腻、听不懂",
              "平淡、没钩子"
            ],
            [
              "中文对照",
              "对应中文的「金句派」",
              "对应中文的「口语派」"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "先定一条，整首不换。副歌想燃 → 走 wit；想戳心 → 走 plain。 混用的结果是两头不讨好：既不够聪明，也不够诚实。"
        }
      ],
      "skip": true,
      "order": 19,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-en.c4",
      "course": "lyric",
      "chapter": "04 英文：数重音，不数字节",
      "title": "改英文词的五动作（按顺序做）",
      "goal": "改英文词的五动作（按顺序做）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "改英文词的五动作（按顺序做）"
        },
        {
          "type": "table",
          "headers": [
            "#",
            "动作",
            "判据"
          ],
          "rows": [
            [
              "1",
              "删抽象名词到 ≤2",
              "逐个问：这个词能拍下来吗？不能就换"
            ],
            [
              "2",
              "形容词换动词",
              "一段形容词 >3 个，必改"
            ],
            [
              "3",
              "全韵换斜韵（除转折那句）",
              "连续 3 行全韵 → 换中间一行"
            ],
            [
              "4",
              "长句拆两句",
              "一行超过 12 音节 → 拆"
            ],
            [
              "5",
              "念一遍找 misstress",
              "重音落不到强拍 → 换词序，别改旋律"
            ]
          ]
        }
      ],
      "skip": true,
      "order": 20,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-image.intro",
      "course": "lyric",
      "chapter": "05 意象：把情绪挂到物件上",
      "title": "意象：把情绪挂到物件上",
      "goal": "抽象情绪直接写出来是空的。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "抽象情绪直接写出来是空的。把它挂到一个具体物件上，就有了画面。 只有一条判据：名词负责可信，动词负责意外——两样里至少要有一处不按常理。"
        }
      ],
      "skip": true,
      "order": 21,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-image.c1",
      "course": "lyric",
      "chapter": "05 意象：把情绪挂到物件上",
      "title": "四条路：让名动错位，或者整个换掉",
      "goal": "四条路：让名动错位，或者整个换掉 四条路选一条。",
      "estimatedSeconds": 50,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "四条路：让名动错位，或者整个换掉"
        },
        {
          "type": "table",
          "headers": [
            "原词",
            "改造后",
            "错位在哪"
          ],
          "rows": [
            [
              "思念",
              "思念生锈",
              "抽象名词 + 具体动作"
            ],
            [
              "街",
              "这条街认生了",
              "具体名词 + 抽象动作（拟人就是这一路）"
            ],
            [
              "时间",
              "旧 T 恤晒得发白 / 六楼的灯亮了又灭",
              "全换成物件，抽象词不出现"
            ],
            [
              "释然",
              "把伞留在门口",
              "全换成动作，抽象词不出现"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "四条路选一条。名词和动词都各就各位，就是白描，不是意象——\"我很孤独\"不叫画面， \"孤独\"配上一个它不该有的动作（生锈、发霉、被叠好塞进抽屉）才有画面。 判据：删掉全部情绪词，画面还在吗？在 → 成立。"
        }
      ],
      "skip": true,
      "order": 22,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-image.c2",
      "course": "lyric",
      "chapter": "05 意象：把情绪挂到物件上",
      "title": "五类可用素材（按最不容易撞车排序）",
      "goal": "五类可用素材（按最不容易撞车排序） 大词（星星、月亮、大海）不是不能用，是用之前先问：我能不能换成一个我摸得到的东西。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "五类可用素材（按最不容易撞车排序）"
        },
        {
          "type": "table",
          "headers": [
            "类别",
            "例",
            "可靠度",
            "为什么"
          ],
          "rows": [
            [
              "声音",
              "锅铲刮锅底、电梯到站的叮、楼下电动车刹车",
              "●●●",
              "最不易撞车"
            ],
            [
              "温度",
              "凉掉的粥、贴脸的手、结霜的窗",
              "●●●",
              "身体先于情绪"
            ],
            [
              "触感",
              "起球的毛衣、硌手的扶手",
              "●●●",
              "写磨损就有人"
            ],
            [
              "光",
              "路灯下的雨、反光条、窗帘缝的光",
              "●●●",
              "略常见，要加细节"
            ],
            [
              "大词",
              "星星 / 月亮 / 大海",
              "●●●",
              "空泛——换成你身边能摸到的东西"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "大词（星星、月亮、大海）不是不能用，是用之前先问：我能不能换成一个我摸得到的东西。"
        }
      ],
      "skip": true,
      "order": 23,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-image.c3",
      "course": "lyric",
      "chapter": "05 意象：把情绪挂到物件上",
      "title": "七种修辞：五种管一句，两种管一段",
      "goal": "七种修辞：五种管一句，两种管一段 只讲通感和矛盾是不够的——那是两种\"听起来聪明\"的技法， 用多了整首词像同一个人在同一个展厅来回走。",
      "estimatedSeconds": 67,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "七种修辞：五种管一句，两种管一段"
        },
        {
          "type": "text",
          "text": "只讲通感和矛盾是不够的——那是两种\"听起来聪明\"的技法， 用多了整首词像同一个人在同一个展厅来回走。下面七种按责任范围分两层： 句内的用错了废一句，跨句的用错了废一段。"
        },
        {
          "type": "table",
          "headers": [
            "修辞",
            "层级",
            "怎么用",
            "例",
            "踩雷点"
          ],
          "rows": [
            [
              "比喻metaphor",
              "句内",
              "把一个东西说成另一个。带\"像/如\"是明喻，不带是暗喻。两个东西差得越远，越有效——这叫\"远取譬\"。",
              "我的思念是一场慢性的雨",
              "喻体和本体必须有一个能被指出来的共同点。\"你的眼睛像眼睛\"不是比喻，是废话"
            ],
            [
              "借代metonymy",
              "句内",
              "不写人，写与他绑定的那件物；不写整体，写局部。一个物件顶一个人。（用局部代整体叫提喻 synecdoche，是它的一个特例）",
              "门口那双鞋，我一直没收",
              "借来的物必须全曲只指一个人；出现第三件同类物，听众就对不上号了"
            ],
            [
              "移就transferred epithet",
              "句内",
              "把修饰 A 的词挪去修饰 B。\"潮湿\"本是天气的，给了\"沉默\"。",
              "潮湿的沉默 / 失眠的路灯",
              "挪完必须还读得通；一句只挪一次，挪两次就是病句"
            ],
            [
              "通感synesthesia",
              "句内",
              "把一种感官写成另一种感官——其实是移就的特例，但值得单列，因为它最难做假。",
              "心跳声像秒针敲打玻璃（听 → 触）",
              "一首歌 1–2 处即够，第三处开始像在炫技"
            ],
            [
              "矛盾oxymoron",
              "句内",
              "两个打架的词放在一起，让它们互相拉扯。副歌张力的主要来源。",
              "拥挤的孤独 / 最温柔的伤口",
              "只准在副歌或桥段。主歌里用，会因为还没铺垫而显得用力过猛"
            ],
            [
              "顶真anadiplosis",
              "跨句",
              "上一句的结尾，做下一句的开头。句子像接力一样往前传，不给换气的机会。",
              "雨落在屋檐／屋檐下那盏灯／灯我去年就关了",
              "两句有推进感，三句以上变绕口令；说唱可以连四个，抒情最多两个"
            ],
            [
              "反讽irony",
              "跨句",
              "说的字面和真实的意思是反的，靠上下文翻面。听众得先知道真相，才听得出来。",
              "我很好，真的好／好到听见你名字要先扶住墙",
              "全曲只能用一次，且真相必须在前一段交出来，否则听众会当成真话"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "选哪几个不是口味问题。一首词里句内修辞 2–3 种就够， 跨句修辞最多一种——顶真和反讽同时用，整段会变成\"作者在表演修辞\"。 而比喻是唯一可以反复用的（人话里本来就有），但每次都要远取譬： 喻体和本体差得越远越好，前提是那个共同点能被指出来。"
        }
      ],
      "skip": true,
      "order": 24,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-image.c4",
      "course": "lyric",
      "chapter": "05 意象：把情绪挂到物件上",
      "title": "国风意象库：48 个词，按情绪分成六组",
      "goal": "国风意象库：48 个词，按情绪分成六组 国风真正的坑不是词少，是四个意象服务四种情绪，一句也没立住。",
      "estimatedSeconds": 150,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "国风意象库：48 个词，按情绪分成六组"
        },
        {
          "type": "text",
          "text": "国风真正的坑不是词少，是四个意象服务四种情绪，一句也没立住。 所以这张表不按\"山水 / 人事 / 器物\"分（那是词性分类，帮不上忙）， 而是按这一组只服务哪一种情绪分，每组配一组只属于它的动词。 拿错了组，立刻就变成堆辞藻。"
        },
        {
          "type": "text",
          "text": "思念"
        },
        {
          "type": "text",
          "text": "江月 · 孤雁 · 夜雨 · 梧桐 · 残烛 · 锦书 · 旧梦 · 归期"
        },
        {
          "type": "text",
          "text": "配这些动作："
        },
        {
          "type": "text",
          "text": "等、数、写信、推窗"
        },
        {
          "type": "text",
          "text": "这一组全是\"还没发生\"的东西，动作必须停在等与数上"
        },
        {
          "type": "text",
          "text": "离别"
        },
        {
          "type": "text",
          "text": "长亭 · 渡口 · 驿路 · 柳枝 · 阳关 · 暮雪 · 兰舟 · 关山"
        },
        {
          "type": "text",
          "text": "配这些动作："
        },
        {
          "type": "text",
          "text": "折、送、回头、解缆"
        },
        {
          "type": "text",
          "text": "动作必须是一次性的——送走就是送走了，加\"再等等\"就废"
        },
        {
          "type": "text",
          "text": "江湖"
        },
        {
          "type": "text",
          "text": "青锋 · 浊酒 · 马蹄 · 风霜 · 故人 · 柴门 · 十年 · 天涯"
        },
        {
          "type": "text",
          "text": "配这些动作："
        },
        {
          "type": "text",
          "text": "饮、仗剑、敲门、上路"
        },
        {
          "type": "text",
          "text": "这一组要\"在路上\"，动作不准停下来；一停就成乡愁"
        },
        {
          "type": "text",
          "text": "岁月"
        },
        {
          "type": "text",
          "text": "流年 · 铜镜 · 白发 · 旧檐 · 青苔 · 故纸 · 西窗 · 更漏"
        },
        {
          "type": "text",
          "text": "配这些动作："
        },
        {
          "type": "text",
          "text": "照、数、拂、吹"
        },
        {
          "type": "text",
          "text": "全部是\"慢慢发生的\"，配一个急动作就露馅"
        },
        {
          "type": "text",
          "text": "孤寂"
        },
        {
          "type": "text",
          "text": "空庭 · 寒砧 · 疏帘 · 断弦 · 深雪 · 独酌 · 余烬 · 冷灶"
        },
        {
          "type": "text",
          "text": "配这些动作："
        },
        {
          "type": "text",
          "text": "坐、听、拨、添"
        },
        {
          "type": "text",
          "text": "这一组的动作幅度必须极小；一有声响，孤寂就散了"
        },
        {
          "type": "text",
          "text": "重逢"
        },
        {
          "type": "text",
          "text": "灯花 · 长街 · 朱门 · 半阙 · 青梅 · 薄酒 · 旧疾 · 旧钥匙"
        },
        {
          "type": "text",
          "text": "配这些动作："
        },
        {
          "type": "text",
          "text": "认、唤、递、怔"
        },
        {
          "type": "text",
          "text": "落点必须是\"认出\"或\"认不出\"——没有这一下，重逢就不算发生"
        },
        {
          "type": "tip",
          "text": "⚠ 库里的词只是可信的名词。情绪不由名词给，由动词给—— \"江月\"本身没有情绪，\"江月照着我喝了第三杯\"才有。 一次只选一组：思念的词配到江湖里，前半句还端着，后半句就散了。"
        }
      ],
      "skip": true,
      "order": 25,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-parts.intro",
      "course": "lyric",
      "chapter": "06 段落：主歌铺、副歌砸、桥段翻",
      "title": "段落：主歌铺、副歌砸、桥段翻",
      "goal": "一首歌不是\"一段词重复几遍\"。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "一首歌不是\"一段词重复几遍\"。它是几个职责不同、长度不同的段落拼起来的， 每一段只干一件事。写词之前先画这张表，比先想句子有用得多—— 因为\"这一句放哪儿\"决定它该写成什么样。同样一句\"我一个人吃饭\"， 放在主歌一是交代处境，放在副歌是自怜，放在桥段是对照。"
        }
      ],
      "skip": true,
      "order": 26,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-parts.c1",
      "course": "lyric",
      "chapter": "06 段落：主歌铺、副歌砸、桥段翻",
      "title": "九段：每一段只干一件事",
      "goal": "九段：每一段只干一件事 下面按实际出现的顺序排，不是按重要性排—— 你可以拿它对着一首你熟的歌逐段核对。",
      "estimatedSeconds": 61,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "九段：每一段只干一件事"
        },
        {
          "type": "text",
          "text": "下面按实际出现的顺序排，不是按重要性排—— 你可以拿它对着一首你熟的歌逐段核对。第四列是判据，答不出来就说明这一段没干自己的活。"
        },
        {
          "type": "table",
          "headers": [
            "段",
            "这一段干什么",
            "词要交什么",
            "判据"
          ],
          "rows": [
            [
              "前奏intro4–8 小节",
              "定速度、定音色、定空间。不承担信息",
              "不写词。要写也只留一声气口或一句残句",
              "把前奏里的词删掉，歌有没有变差？没变就差"
            ],
            [
              "主歌一verse 18–16 小节",
              "建立\"谁、在哪儿、缺什么\"",
              "只给处境，不给结论；不许出现情绪词",
              "读完前四句，能不能指出一件具体的东西？"
            ],
            [
              "预副歌pre-chorus4–8 小节",
              "加速：和声往上抬、密度变大，把副歌\"顶\"出来",
              "只做一件事——把副歌的第一句提前预告（可以不给全）",
              "把它删掉，副歌还会不会\"砸\"下来？会就没必要留"
            ],
            [
              "副歌chorus8–16 小节",
              "每遍词都一样，听众会跟着唱的那一段",
              "钩子住这里（3–10 字）；一句只说一件事；只有这一段允许整段停在抽象上",
              "离开主歌单独听，它还站得住吗？"
            ],
            [
              "主歌二verse 2同主歌一",
              "换证据，不换形容词",
              "必须发生一件新的事，而不是把主歌一再说一遍",
              "和主歌一比，多了哪一件具体的事？答不出就是重复"
            ],
            [
              "桥段bridge4–8 小节（2 或 4 行）",
              "全曲唯一能换视角、换时态、换地点的地方",
              "只准换一样；换完必须回得来",
              "桥段之后接回副歌，听众会不会跟丢？"
            ],
            [
              "间奏solo / interlude8–16 小节",
              "喘口气，通常在这里升调或转调",
              "不写词。要写就是一段念白，且只能一次",
              "这段里人声停下来的理由是什么？"
            ],
            [
              "尾副歌final chorus同副歌",
              "最后一次砸，也是全曲的落点",
              "至少改一句，通常改末句（改一个词也算）",
              "末句改了，整首的意思有没有跟着翻？"
            ],
            [
              "尾奏outro2–8 小节",
              "收。把听众放回现实",
              "留一句没说完的话，或者干脆没有词",
              "最后 3 秒，听众带走的是哪一句？"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "中文流行最常见的拼法是 V-C-V-C-B-C（主歌–副歌各两遍，桥段，尾副歌）。 布鲁斯是另一套：12 小节一轮，AAB 三句，没有副歌也没有桥段—— 所以它的\"重复\"由和声管，不由段落管（那套在乐理课第 10 节）。"
        }
      ],
      "skip": true,
      "order": 27,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-parts.c2",
      "course": "lyric",
      "chapter": "06 段落：主歌铺、副歌砸、桥段翻",
      "title": "四条纪律：按顺序错都不会错",
      "goal": "四条纪律：按顺序错都不会错 ① 主歌二换证据，不换形容词 \"更孤独了\"不是发展，\"他开始把两只杯子都洗了\"才是。",
      "estimatedSeconds": 81,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "四条纪律：按顺序错都不会错"
        },
        {
          "type": "text",
          "text": "① 主歌二换证据，不换形容词"
        },
        {
          "type": "text",
          "text": "\"更孤独了\"不是发展，\"他开始把两只杯子都洗了\"才是。 主歌二的唯一任务，是发生"
        },
        {
          "type": "text",
          "text": "一件主歌一没有的具体的事"
        },
        {
          "type": "text",
          "text": "。"
        },
        {
          "type": "text",
          "text": "② 预副歌只做预告，不做总结"
        },
        {
          "type": "text",
          "text": "把副歌第一句提前说一半，让听众在副歌真到的时候\"认出它\"。 写成\"所以啊人生就是这样\"就废了——那是总结，不是预告。"
        },
        {
          "type": "text",
          "text": "③ 桥段只准换一样"
        },
        {
          "type": "text",
          "text": "换人、换时间、换地点——三样里挑一样。"
        },
        {
          "type": "text",
          "text": "换两样听众就跟丢"
        },
        {
          "type": "text",
          "text": "， 而且桥段之后必须回得来：它的功能是\"翻一下\"，不是\"另起一首\"。"
        },
        {
          "type": "text",
          "text": "④ 尾副歌必须改一句"
        },
        {
          "type": "text",
          "text": "一个字也算。原样重复第三遍＝把前面攒的全扔掉。 通常改末句，因为末句是全曲的落点——改完要让前面某一句"
        },
        {
          "type": "text",
          "text": "回头变成另一个意思"
        },
        {
          "type": "text",
          "text": "。"
        }
      ],
      "skip": true,
      "order": 28,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-parts.c3",
      "course": "lyric",
      "chapter": "06 段落：主歌铺、副歌砸、桥段翻",
      "title": "术语：这几个词写歌的人天天挂在嘴上",
      "goal": "术语：这几个词写歌的人天天挂在嘴上 这些词不是黑话，但用错会露怯：最常见的是把 hook 当成\"副歌\"的同义词说—— 副歌可以没有钩子（那样的歌通常记不住），钩",
      "estimatedSeconds": 56,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "术语：这几个词写歌的人天天挂在嘴上"
        },
        {
          "type": "table",
          "headers": [
            "英文",
            "中文",
            "一句人话"
          ],
          "rows": [
            [
              "verse",
              "主歌",
              "\"叙事段\"：每遍词都不一样，负责推进。缩写 V"
            ],
            [
              "chorus",
              "副歌",
              "\"重复段\"：每遍词一样，负责被记住。hook 就住在这一段里"
            ],
            [
              "pre-chorus",
              "预副歌",
              "副歌前面那段\"爬坡\"，缩写 PC；中文也写作\"导歌\""
            ],
            [
              "bridge",
              "桥段",
              "\"桥\"是从副歌走回副歌的那一截，所以它两头都得接得上。缩写 B"
            ],
            [
              "hook",
              "钩子",
              "全曲最容易被记住的那一下（可以是一句、一个词、一个音型）。不等于副歌：钩子是副歌里最尖的那一点"
            ],
            [
              "outro",
              "尾奏",
              "\"出口\"。相对的 intro 是入口"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "这些词不是黑话，但用错会露怯：最常见的是把 hook 当成\"副歌\"的同义词说—— 副歌可以没有钩子（那样的歌通常记不住），钩子也可以提前出现在主歌里。 这一节讲的是一首歌内部怎么分段；几张歌之间怎么排（序章 / 分组 / 收尾、叙事专辑的八个阶段） 是另一层的事，在第 14 节。"
        }
      ],
      "skip": true,
      "order": 29,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-hook.intro",
      "course": "lyric",
      "chapter": "07 钩子七型",
      "title": "钩子七型",
      "goal": "副歌是钩子的载体。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "副歌是钩子的载体。先定钩子，再写副歌——反过来做，副歌会变成\"把主歌的话再说一遍\"。 七型里前四型通用，后三型各挂一个派别：选了哪一派，就优先从该派对应的那一型里找。"
        }
      ],
      "skip": true,
      "order": 30,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-hook.c1",
      "course": "lyric",
      "chapter": "07 钩子七型",
      "title": "钩子七型 · 1",
      "goal": "钩子七型 · 1",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "table",
          "headers": [
            "型",
            "怎么造",
            "例",
            "踩雷点"
          ],
          "rows": [
            [
              "① 环形句",
              "首尾用同一句短语，给\"完成感\"",
              "不要叫我 ← → 不要叫我",
              "首尾那句必须真的同字，改一个词就不算环形"
            ],
            [
              "② 列表升级",
              "给三样递进的东西，第三样最狠",
              "我留了你的外套、你的马克杯、和你说要删掉的那个号码",
              "三样必须同属一类，否则是杂货单"
            ],
            [
              "③ 金句",
              "一个带矛盾的判断句",
              "我走进去像付了钱要被看见 / 我的笑有收据",
              "一段只留一句，多了就是格言腔"
            ],
            [
              "④ 回扣句",
              "把主歌的意象拧一下再出现",
              "植物还朝着窗户倾斜 → 植物现在朝着门倾斜",
              "主歌必须真的先出现过那个物"
            ],
            [
              "⑤ 反向定义型",
              "先立一个通行标准，再用一句掀翻它",
              "谁说站在光里的才算英雄",
              "一首先行标准只能掀一次，掀两次就变抱怨"
            ],
            [
              "⑥ 物态变化型",
              "不写判断，靠同一件物在两个时间点的状态差",
              "伞立在门口 → 伞在柜顶落了灰",
              "后一次必须带新的修饰，否则听众不知道你在说哪把伞"
            ],
            [
              "⑦ 概念贯穿型",
              "把一个系统术语落到最日常的一句上",
              "我们只是熵增到某一刻",
              "术语只准出现这一个，两个就没人记得住"
            ]
          ]
        }
      ],
      "skip": true,
      "order": 31,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-hook.c2",
      "course": "lyric",
      "chapter": "07 钩子七型",
      "title": "三条硬指标（七型同时生效）",
      "goal": "三条硬指标（七型同时生效） 3–10 字 能独立站住，脱离上下文也成立 落强拍 / 长音 埋在密集小字里＝记不住 开口元音多 好唱、好记、能拖 第三条是声学的：",
      "estimatedSeconds": 52,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "三条硬指标（七型同时生效）"
        },
        {
          "type": "text",
          "text": "3–10 字"
        },
        {
          "type": "text",
          "text": "能独立站住，脱离上下文也成立"
        },
        {
          "type": "text",
          "text": "落强拍 / 长音"
        },
        {
          "type": "text",
          "text": "埋在密集小字里＝记不住"
        },
        {
          "type": "text",
          "text": "开口元音多"
        },
        {
          "type": "text",
          "text": "好唱、好记、能拖"
        },
        {
          "type": "tip",
          "text": "第三条是声学的：开口元音的第一共振峰高，唱到高音时不用挤嗓子。 这条和乐理课第 11 节的十三辙响度是同一个道理。"
        }
      ],
      "skip": true,
      "order": 32,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-hook.c3",
      "course": "lyric",
      "chapter": "07 钩子七型",
      "title": "歌名：钩子的最短版本",
      "goal": "歌名：钩子的最短版本 歌名不属于正文，却决定别人点不点开——它几乎总是从钩子里掐出来的那一截。",
      "estimatedSeconds": 87,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "歌名：钩子的最短版本"
        },
        {
          "type": "text",
          "text": "歌名不属于正文，却决定别人点不点开——它几乎总是从钩子里掐出来的那一截。 写完之后再做这一步，别一开始就取名字：先取名字会逼着你往那个词上凑。"
        },
        {
          "type": "text",
          "text": "从钩子里剪"
        },
        {
          "type": "text",
          "text": "副歌里最能独立站住的那 2–5 个字。剪完要还读得通—— \"说好不哭的人哭了\"→《说好不哭》，剪掉的正是解释部分。"
        },
        {
          "type": "text",
          "text": "用物件，不用情绪"
        },
        {
          "type": "text",
          "text": "《外套》《六楼的灯》比《思念》《遗憾》好——"
        },
        {
          "type": "text",
          "text": "歌名是搜索结果，不是心情标签"
        },
        {
          "type": "text",
          "text": "：情绪词重名率极高，物件不会。"
        },
        {
          "type": "text",
          "text": "不许剧透结尾"
        },
        {
          "type": "text",
          "text": "名字要把人勾进来，不能替他把话说完。桥段才交出去的真相， 别写进标题——那是把门票和结局一起卖了。"
        },
        {
          "type": "tip",
          "text": "一条检验：把歌名单独发给一个没听过这首歌的人，问他\"你觉得这是讲什么的\"。 答得出方向、但答不出结局，就是对的；答\"不知道\"太虚，答得太准就剧透了。"
        }
      ],
      "skip": true,
      "order": 33,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-school.intro",
      "course": "lyric",
      "chapter": "08 八派：这一句靠什么成立",
      "title": "八派：这一句靠什么成立",
      "goal": "词写得没毛病，但不动人——问题几乎总在\"用力用错了路\"。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "词写得没毛病，但不动人——问题几乎总在\"用力用错了路\"。 打动人只有三条路：被看见、被说破、被抬高。认错路，再努力也白费。"
        }
      ],
      "skip": true,
      "order": 34,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-school.c1",
      "course": "lyric",
      "chapter": "08 八派：这一句靠什么成立",
      "title": "三种力",
      "goal": "三种力 用法：先定主派（决定整首骨架），最多再加一个辅派 （只用在副歌或桥段）。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "三种力"
        },
        {
          "type": "table",
          "headers": [
            "力",
            "听众的感受",
            "靠什么实现",
            "对应派别"
          ],
          "rows": [
            [
              "被看见",
              "「这说的就是我」",
              "准确的具体——具体到他自己都没说出口",
              "物证派 · 私语派 · 意象派"
            ],
            [
              "被说破",
              "「原来是这样」",
              "一句判断——把说不清的东西一次说清",
              "金句派 · 口语派 · 概念派"
            ],
            [
              "被抬高",
              "「原来我也可以」",
              "把个人接到更大的东西上",
              "时代派 · 宣言派"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "用法：先定主派（决定整首骨架），最多再加一个辅派 （只用在副歌或桥段）。一首歌最多两派——三派以上必然互相打架，最后什么都不是。"
        }
      ],
      "skip": true,
      "order": 35,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-school.c2",
      "course": "lyric",
      "chapter": "08 八派：这一句靠什么成立",
      "title": "组合纪律（比选派对更容易翻车的地方）",
      "goal": "组合纪律（比选派对更容易翻车的地方） 能配的 不许同时用的 三条总纪律：主派只能一个（副歌换派＝换了一首歌）；",
      "estimatedSeconds": 50,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "组合纪律（比选派对更容易翻车的地方）"
        },
        {
          "type": "text",
          "text": "能配的"
        },
        {
          "type": "table",
          "headers": [],
          "rows": [
            [
              "物证 + 口语",
              "民谣标配：物证做骨架，口语做对话感"
            ],
            [
              "意象 + 时代",
              "影视主题曲：意象做画面，时代做收尾拉远"
            ],
            [
              "金句 + 概念",
              "R&B / 独立：概念做骨架，金句做钩子"
            ],
            [
              "私语 + 金句",
              "都市情歌：私语写主歌，金句只留副歌一句"
            ]
          ]
        },
        {
          "type": "text",
          "text": "不许同时用的"
        },
        {
          "type": "table",
          "headers": [],
          "rows": [
            [
              "宣言 × 私语",
              "音量冲突：一个在喊，一个在耳语"
            ],
            [
              "意象 × 概念",
              "两套符号系统打架：一个靠工序，一个靠因果"
            ],
            [
              "口语 × 意象",
              "语体冲突：一个要像说话，一个要像文物"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "三条总纪律：主派只能一个（副歌换派＝换了一首歌）； 辅派只准出现在副歌或桥段（主歌里出现辅派＝骨架被拆）； 派别不写进交付正文——只说\"这一段用了哪种手法\"，不贴派名当标签。"
        }
      ],
      "skip": true,
      "order": 36,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-school.c3",
      "course": "lyric",
      "chapter": "08 八派：这一句靠什么成立",
      "title": "症状 → 该调哪一派",
      "goal": "症状 → 该调哪一派 一次最多调两派。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "症状 → 该调哪一派"
        },
        {
          "type": "table",
          "headers": [
            "你的说法",
            "真实问题",
            "该调"
          ],
          "rows": [
            [
              "「太飘了 / 不落地」",
              "只有情绪没有物",
              "物证派"
            ],
            [
              "「太直白 / 像日记」",
              "什么都说了，没留缝",
              "私语派"
            ],
            [
              "「记不住 / 没金句」",
              "没有能被引用的一句",
              "金句派"
            ],
            [
              "「太 AI / 太文艺」",
              "修辞过载，没人味",
              "口语派"
            ],
            [
              "「古风好空 / 堆词」",
              "只有材料没有工序",
              "意象派"
            ],
            [
              "「格局小 / 只讲自己」",
              "个人没接到更大的东西",
              "时代派"
            ],
            [
              "「副歌不够燃」",
              "字太多、动作太少",
              "宣言派"
            ],
            [
              "「没深度 / 听完就忘」",
              "没有骨架，只有情绪",
              "概念派"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "一次最多调两派。用户说「都不对」时不要八派全上—— 先回去确认主题和框景，八成是那两处没锁住。"
        }
      ],
      "skip": true,
      "order": 37,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-guofeng.intro",
      "course": "lyric",
      "chapter": "09 古风 / 国风：先选一种，再动笔",
      "title": "古风 / 国风：先选一种，再动笔",
      "goal": "古风不是一种写法，是三种。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "古风不是一种写法，是三种。动笔前先选一种，它决定文言浓度、句长与人称—— 不是「写得文一点就行」。型选错了，后面每一句都在跟自己的型较劲。"
        }
      ],
      "skip": true,
      "order": 38,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-guofeng.c1",
      "course": "lyric",
      "chapter": "09 古风 / 国风：先选一种，再动笔",
      "title": "三种型：点一下看它长什么样",
      "goal": "三种型：点一下看它长什么样 乙 · 文白间杂型 默认 语体 ：白话为骨架，古典意象与文言词点缀 特征 ：主歌偏文，副歌偏白；",
      "estimatedSeconds": 67,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "三种型：点一下看它长什么样"
        },
        {
          "type": "text",
          "text": "乙 · 文白间杂型"
        },
        {
          "type": "text",
          "text": "默认"
        },
        {
          "type": "text",
          "text": "语体"
        },
        {
          "type": "text",
          "text": "：白话为骨架，古典意象与文言词点缀"
        },
        {
          "type": "text",
          "text": "特征"
        },
        {
          "type": "text",
          "text": "：主歌偏文，副歌偏白；好唱、好懂"
        },
        {
          "type": "text",
          "text": "适合谁"
        },
        {
          "type": "text",
          "text": "：商业古风、影视插曲、大多数场合"
        },
        {
          "type": "text",
          "text": "怎么认出这一型"
        },
        {
          "type": "text",
          "text": "：对方说「要周杰伦那种」——或者"
        },
        {
          "type": "text",
          "text": "什么都没说"
        },
        {
          "type": "text",
          "text": "默认选这一型"
        },
        {
          "type": "text",
          "text": "：可唱性最好，主副歌配比也最不容易翻车。"
        },
        {
          "type": "tip",
          "text": "⚠ 三型不许混。主歌甲、副歌乙还勉强成立（文言浓度的配比见 第 10 节）；主歌丙、副歌甲基本必败—— 语体跳档，听众会觉得「换了个人在唱」。"
        }
      ],
      "skip": true,
      "order": 39,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-guofeng.c2",
      "course": "lyric",
      "chapter": "09 古风 / 国风：先选一种，再动笔",
      "title": "古风是体裁外套，不是第九派",
      "goal": "古风是体裁外套，不是第九派 八派解决「这一句凭什么打动人」，古风解决「用什么词汇系统和押韵方案」。",
      "estimatedSeconds": 62,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "古风是体裁外套，不是第九派"
        },
        {
          "type": "text",
          "text": "八派解决「这一句凭什么打动人」，古风解决「用什么词汇系统和押韵方案」。 同一件古风外套，可以套在四派上——所以别把古风当成第八派之外多出来的一派， 它是横着穿过去的一层。"
        },
        {
          "type": "table",
          "headers": [
            "套在哪派",
            "适配",
            "长什么样",
            "备注"
          ],
          "rows": [
            [
              "物证派",
              "●●●",
              "一件旧物（琴 / 镜 / 钗 / 灯）从用到停，人不在物还在",
              "古风最稳的骨架"
            ],
            [
              "意象派",
              "●●●",
              "一句里走完「材料 + 工艺 + 时间」（制墨、烧瓷、斫琴）",
              "最「文化」的一路"
            ],
            [
              "宣言派",
              "●●●",
              "四言五言、实词密、可合唱（刀、酒、马、山）",
              "国风豪放支"
            ],
            [
              "金句派",
              "●●●",
              "反向定义、抽象写成物理量",
              "当辅派，每段 ≤1 句"
            ]
          ]
        },
        {
          "type": "text",
          "text": "两对不许同时用的"
        },
        {
          "type": "table",
          "headers": [],
          "rows": [
            [
              "古风 + 口语派",
              "语体打架：「手机」「加班」一进来就破功"
            ],
            [
              "古风 + 概念派",
              "系统冲突：用「熵」讲离别，神仙难救"
            ]
          ]
        },
        {
          "type": "text",
          "text": "最常走的一条路"
        },
        {
          "type": "text",
          "text": "物证派撑骨架（人退场、物留在原位）＋ 金句派点一次题。 这条路能撑住「有故事、有物、有一句能被记住」三个要求——古风最常见的组合，不是唯一正确的组合。"
        }
      ],
      "skip": true,
      "order": 40,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-guofeng.c3",
      "course": "lyric",
      "chapter": "09 古风 / 国风：先选一种，再动笔",
      "title": "四条硬纪律（比辞藻重要得多）",
      "goal": "四条硬纪律（比辞藻重要得多） 四条里最容易忽略的是纪律 3：把一句念给自己听，问「这句话如果换成白话，说得通吗？",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "四条硬纪律（比辞藻重要得多）"
        },
        {
          "type": "table",
          "headers": [
            "编号",
            "纪律",
            "怎么做",
            "典型错"
          ],
          "rows": [
            [
              "纪律 1",
              "每个意象都要「干活」",
              "意象不是装饰，是替一种情绪值岗。写完逐个问：它替哪种情绪说话？指不出来的，删——不管它多美。",
              "✗ 「梅雨初歇饮一杯春酒闲卧杏花前」——梅雨是六七月，杏花是三四月，后面又出现蝉声（夏）。三个意象各自都美，凑在一起是错的。"
            ],
            [
              "纪律 2",
              "物候与时序不许错配",
              "古风的「古意」有一半来自季节感。时序一乱，整段作废——听众未必说得出哪里错，但会觉得「不对劲」。这是最隐蔽也最致命的错。",
              "✗ 查下一节的物候时序表，锁定一季再动笔。"
            ],
            [
              "纪律 3",
              "语义不许冗余或自相矛盾",
              "自检很简单：把一句念给自己听，问「这句话如果换成白话，说得通吗？」说不通就是语法断了。",
              "✗ 「白了华发」——「华发」本就是白发；「清平闲事」里把「渊明」拆成「渊」——名词不许随便省略；一句里塞「孤雁、残阳、古道、西风、瘦马」五个意象，谁也没空干活。"
            ],
            [
              "纪律 4",
              "不许套公式化句式",
              "古风最出名的笑柄，就是几套句式被反复套用。套了就是「AI 味」的古风版——它们共同的毛病是全部由抽象词收尾，看着对仗，读完什么都没留下。",
              "✗ 查下一节的五套禁用句式。"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "四条里最容易忽略的是纪律 3：把一句念给自己听，问「这句话如果换成白话，说得通吗？」 说不通就是语法断了。古风最常见的病不是词不好，是句子本身不成立。"
        }
      ],
      "skip": true,
      "order": 41,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-guofeng.c4",
      "course": "lyric",
      "chapter": "09 古风 / 国风：先选一种，再动笔",
      "title": "八类意象：它们为什么管用",
      "goal": "八类意象：它们为什么管用 这张表和第 05 节的「48 词库」分工不同，两套并存： 第 05 节那六组是挑词工具（按情绪挑，每组配专属动词）， 这里八类是控密度",
      "estimatedSeconds": 70,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "八类意象：它们为什么管用"
        },
        {
          "type": "text",
          "text": "这张表和第 05 节的「48 词库」分工不同，两套并存： 第 05 节那六组是挑词工具（按情绪挑，每组配专属动词）， 这里八类是控密度工具（这一类为什么管用）。挑词去 05 节，控密度看这里。"
        },
        {
          "type": "table",
          "headers": [
            "类别",
            "可用意象",
            "为什么它管用"
          ],
          "rows": [
            [
              "送别",
              "长亭 · 渡口 · 柳 · 折柳 · 帆 · 酒盏 · 阳关 · 马 · 驿路",
              "这些物都自带「到此为止」的空间感"
            ],
            [
              "思念",
              "月 · 雁 · 灯 · 尺素 / 锦书 · 更漏 · 砧声 · 窗 · 镜",
              "都是「单向传递」的——送得出去，回不来"
            ],
            [
              "时间流逝",
              "流水 · 落花 · 青苔 · 铜镜 · 旧衣 · 木纹 · 蛛网 · 阶前草",
              "都是「会留下痕迹」的物，痕迹即时间"
            ],
            [
              "江湖",
              "剑 · 马 · 酒 · 关山 · 风沙 · 孤城 · 长河 · 篝火 · 刀",
              "空间大、人小，落差自己会生豪气"
            ],
            [
              "文人雅事",
              "琴 · 棋 · 书 · 画 · 砚 · 墨 · 茶 · 香 · 印 · 笺",
              "都是「需要坐下来做」的，自带静的质地"
            ],
            [
              "建筑空间",
              "檐 · 廊 · 阶 · 窗 · 院 · 门 · 栏 · 井 · 墙 · 瓦",
              "限定「人在哪」，一句话就把场景钉住"
            ],
            [
              "天象",
              "月 · 星 · 霜 · 露 · 云 · 雨 · 雪 · 风 · 烟",
              "用来做「空镜」，收尾最好用"
            ],
            [
              "闺阁器物",
              "梳 · 镜 · 钗 · 灯 · 扇 · 伞 · 舟 · 剪 · 线 · 香囊",
              "都是「被手反复摸过」的，最适合写磨损"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "三条取用纪律，比「词够不够」重要： 1. 一句最多两个意象。三个以上就开始互相稀释——这是「堆词」最直接的成因。2. 一个意象全篇不超过 2 次，第二次必须带新状态（见物证派第三条动作）。3. 同一个情绪，只选同一类里的意象。送别段里突然出现「铜镜」，是跨类串味。"
        }
      ],
      "skip": true,
      "order": 42,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-guofeng-craft.intro",
      "course": "lyric",
      "chapter": "10 古风手艺：物候、句法、禁用清单",
      "title": "古风手艺：物候、句法、禁用清单",
      "goal": "古风的「古意」有一半来自季节感，另一半来自句子本身怎么搭。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "古风的「古意」有一半来自季节感，另一半来自句子本身怎么搭。 这一节全是可以照着做的：先锁一季，再选骨架，最后查禁用清单。"
        }
      ],
      "skip": true,
      "order": 43,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-guofeng-craft.c1",
      "course": "lyric",
      "chapter": "10 古风手艺：物候、句法、禁用清单",
      "title": "物候时序表：动笔前查一次",
      "goal": "物候时序表：动笔前查一次 按公历记。",
      "estimatedSeconds": 46,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "物候时序表：动笔前查一次"
        },
        {
          "type": "text",
          "text": "按公历记。写词时按你设定的季节取一组，不许跨季混取。 时序一乱，整段作废——听众未必说得出哪里错，但会觉得「不对劲」。"
        },
        {
          "type": "table",
          "headers": [
            "季",
            "月份",
            "花木",
            "天象物候",
            "节日时点"
          ],
          "rows": [
            [
              "春",
              "2–4 月",
              "梅（春梅，早春）· 杏（3–4 月，早于桃）· 桃（3–4 月）· 梨 · 海棠 · 柳（抽芽）· 柳絮（4–5 月）",
              "东风 · 微雨 · 倒春寒 · 燕归来",
              "上元（正月十五）· 清明 · 上巳"
            ],
            [
              "夏",
              "5–7 月",
              "荷 / 莲（6–9 月）· 榴花（5–6 月）· 栀子 · 槐",
              "梅雨（6 月中–7 月上，江南） · 蝉（6–8 月）· 雷雨",
              "端午（五月初五）· 七夕（七月初七）"
            ],
            [
              "秋",
              "8–10 月",
              "桂（9–10 月）· 菊（9–11 月）· 枫 · 芦花 · 梧桐落叶",
              "霜（10–11 月）· 雁南飞（9–10 月） · 西风 · 白露",
              "中秋 · 重阳（九月初九）"
            ],
            [
              "冬",
              "11–1 月",
              "腊梅 · 枯枝 · 松柏",
              "雪 · 冰 · 炉火 · 朔风",
              "冬至 · 腊八 · 除夕"
            ]
          ]
        },
        {
          "type": "text",
          "text": "三条最常踩的"
        },
        {
          "type": "table",
          "headers": [],
          "rows": [
            [
              "梅有两个季节",
              "腊梅是冬，春梅是早春。写「踏雪寻梅」是冬；写「梅子黄时雨」是夏（梅雨）。别混。"
            ],
            [
              "梅雨 ≠ 春雨",
              "梅雨专指江南六七月，跟杏花桃花不同季。这一条被点名批评过。"
            ],
            [
              "雁南飞在秋，雁北归在春",
              "写「雁字回时」要确认是哪一个方向。"
            ]
          ]
        },
        {
          "type": "text",
          "text": "时辰（更漏钟鼓最容易写错）"
        },
        {
          "type": "table",
          "headers": [],
          "rows": [
            [
              "三更",
              "23:00–01:00"
            ],
            [
              "五更",
              "03:00–05:00"
            ],
            [
              "月落",
              "多在后半夜到拂晓。写「三更月落」勉强可以，写「黄昏月落」是错的——黄昏月刚升。"
            ]
          ]
        }
      ],
      "skip": true,
      "order": 44,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-guofeng-craft.c2",
      "course": "lyric",
      "chapter": "10 古风手艺：物候、句法、禁用清单",
      "title": "文言浓度：主歌高、副歌低",
      "goal": "文言浓度：主歌高、副歌低 ⚠ 反过来（副歌文言、主歌白话）几乎必败。",
      "estimatedSeconds": 48,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "文言浓度：主歌高、副歌低"
        },
        {
          "type": "table",
          "headers": [
            "段落",
            "文言词占比",
            "理由"
          ],
          "rows": [
            [
              "主歌",
              "30–50%",
              "意象密集，撑住「古意」"
            ],
            [
              "预副歌",
              "20–30%",
              "过渡，往白话走"
            ],
            [
              "副歌",
              "0–10%",
              "要唱得响、记得住；文言词多则咬字难、记忆成本高"
            ],
            [
              "桥段 / 尾声",
              "10–30%",
              "可以再文一点收束"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "⚠ 反过来（副歌文言、主歌白话）几乎必败。副歌是记忆点，文言词一多， 听众记不住词、歌手咬不住字，钩子白做。 怎么数：抽副歌 20 个字，数其中文言词与古意词，超过 2 个（10%）就往下压。"
        }
      ],
      "skip": true,
      "order": 45,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-guofeng-craft.c3",
      "course": "lyric",
      "chapter": "10 古风手艺：物候、句法、禁用清单",
      "title": "文言浓度要付三笔代价，第三笔最贵",
      "goal": "文言浓度要付三笔代价，第三笔最贵 浓度不是一个风格偏好，是一笔账。",
      "estimatedSeconds": 68,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "文言浓度要付三笔代价，第三笔最贵"
        },
        {
          "type": "text",
          "text": "浓度不是一个风格偏好，是一笔账。 写得越文，付得越多——而且第三笔不是「听着别扭」，是这首歌没法传唱。"
        },
        {
          "type": "table",
          "headers": [
            "代价",
            "为什么",
            "怎么办"
          ],
          "rows": [
            [
              "难读难懂",
              "听众的大脑在解码语义，就没有余力去听别的东西了。文言不是「高级」，它对听众来说就是外语——用得越多，听得越累。",
              "主歌可以文（那是「读」的位置）；副歌必须降到白话（那是「唱」的位置）。"
            ],
            [
              "韵脚被埋",
              "韵脚只能落在分句的末字上，而文言虚词（之乎者也矣焉兮）最爱占的就是这个位置——那个字押不了韵。写得越文，能押韵的地方越少。",
              "写完数一遍：几个分句里有几个末字是「之乎者也矣焉兮」？那些位置全都不是韵脚。"
            ],
            [
              "可押的字变少",
              "白话里同韵的字极多（麻 / 花 / 家 / 沙 / 他），文言用字范围窄得多，同一韵部能挑的字少。浓度一高，可选的韵脚池直接缩水。",
              "先定韵再写词：把这一段要用的韵列出来，看还剩哪些字能用。"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "第二笔是这一节最要紧的一句：韵脚只能落在分句的末字上。 而文言虚词（之乎者也矣焉兮）最爱占的就是末字那个位置——那个字押不了韵。 写得越文，能押韵的地方越少；副歌尤其不能文，因为副歌全靠韵脚立住。 这一条能数：第 15 节的自检器会告诉你「几个分句里有几个末字被文言虚词占了」， 那个数字就是你这首歌真正能押韵的位置数。"
        }
      ],
      "skip": true,
      "order": 46,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-guofeng-craft.c4",
      "course": "lyric",
      "chapter": "10 古风手艺：物候、句法、禁用清单",
      "title": "六种句法骨架",
      "goal": "六种句法骨架 ⚠ 给的是骨架，不是句子。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "六种句法骨架"
        },
        {
          "type": "text",
          "text": "⚠ 给的是骨架，不是句子。照骨架填自己的内容才算写词；照句子改是抄。"
        },
        {
          "type": "table",
          "headers": [
            "骨架",
            "句式",
            "为什么管用",
            "雷点"
          ],
          "rows": [
            [
              "名词并置（镜头剪辑）",
              "[名词] [名词] [名词] —— 三个名词，不加动词、不加连接",
              "物自己站成一幅画，情绪由并置产生。这是「不解释」的最高效写法。",
              "✗ 只给起手句或转句用，通篇都这样就成词表。"
            ],
            [
              "物态 + 人事并置",
              "[物] 在 [做某件慢事]，而 / 却 [人] 在 [做同一件事的对应动作]",
              "同一个动词，两处状态相反，情绪落差自己就出来了，不用写一个「难过」。茶烟自己在梁上散，而我还坐着等它散",
              "✗ 古风最好用的一招。"
            ],
            [
              "数量 + 动作 + 空间（副歌造境）",
              "一 [量词] [起 / 落 / 过]，[景物]；一 [量词] [起 / 落 / 过]，[另一景物]",
              "对仗造两个空镜，情绪交给第二个空镜收。副歌最稳的开法之一。",
              "✗ 上下句的景物要同距离（都是远景，或都是近景），一远一近会散。"
            ],
            [
              "让步转折（点题用）",
              "[先认一个通行说法]，[再一句掀翻它]：不是 A，是 B ／ 最难 X 的从来不是 C，而是 D",
              "这是「金句派」的反向定义。一句就把整首的立场立住。",
              "✗ 一首先行标准只能掀一次，掀两次第二次就变成抱怨。"
            ],
            [
              "四字密集（炼字用）",
              "[名词][动词][形容词 / 名词] —— 四字里塞进一个动作与一个通感",
              "省略全部逻辑连接，直抵画面——这是古典构词法的核心。砚底沉霜（砚 + 沉 + 霜：视觉、触觉、时间三层）",
              "✗ 全曲 ≤2 处。超过两处就成骈文，唱起来像念说明书，且听众记不住。"
            ],
            [
              "叠词起手",
              "[叠词]，[叠词]，[一句实写]",
              "叠词给节奏，实写给画面。",
              "✗ 只放在段首或转入副歌那一句，别句中乱插。"
            ]
          ]
        }
      ],
      "skip": true,
      "order": 47,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-guofeng-craft.c5",
      "course": "lyric",
      "chapter": "10 古风手艺：物候、句法、禁用清单",
      "title": "古风专用禁用清单",
      "goal": "古风专用禁用清单 这一节和第 12 节的黑名单不是一回事： 黑名单管的是「AI 味」，这里管的是「古风味」——两种味道都不该有。",
      "estimatedSeconds": 103,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "古风专用禁用清单"
        },
        {
          "type": "text",
          "text": "这一节和第 12 节的黑名单不是一回事： 黑名单管的是「AI 味」，这里管的是「古风味」——两种味道都不该有。"
        },
        {
          "type": "text",
          "text": "① 万能高频词（不是全禁，是限次）"
        },
        {
          "type": "text",
          "text": "天下"
        },
        {
          "type": "text",
          "text": "千年"
        },
        {
          "type": "text",
          "text": "倾城"
        },
        {
          "type": "text",
          "text": "旧人"
        },
        {
          "type": "text",
          "text": "奈何"
        },
        {
          "type": "text",
          "text": "断弦"
        },
        {
          "type": "text",
          "text": "陌路"
        },
        {
          "type": "text",
          "text": "笑靥"
        },
        {
          "type": "text",
          "text": "三生"
        },
        {
          "type": "text",
          "text": "落花"
        },
        {
          "type": "text",
          "text": "离殇"
        },
        {
          "type": "text",
          "text": "仓皇"
        },
        {
          "type": "text",
          "text": "陌上"
        },
        {
          "type": "text",
          "text": "墨香"
        },
        {
          "type": "text",
          "text": "微凉"
        },
        {
          "type": "text",
          "text": "断肠"
        },
        {
          "type": "text",
          "text": "未央"
        },
        {
          "type": "text",
          "text": "长安"
        },
        {
          "type": "text",
          "text": "烟雨"
        },
        {
          "type": "text",
          "text": "桃花"
        },
        {
          "type": "text",
          "text": "回眸"
        },
        {
          "type": "text",
          "text": "公子"
        },
        {
          "type": "text",
          "text": "红颜"
        },
        {
          "type": "text",
          "text": "青冢"
        },
        {
          "type": "text",
          "text": "白衣"
        },
        {
          "type": "text",
          "text": "情深缘浅"
        },
        {
          "type": "text",
          "text": "似水流年"
        },
        {
          "type": "text",
          "text": "整首最多 3 个，且每个只能用一次。"
        },
        {
          "type": "text",
          "text": "换法：不要「落花」，写「"
        },
        {
          "type": "text",
          "text": "它落了几瓣在你袖口"
        },
        {
          "type": "text",
          "text": "」；不要「断肠」，写「"
        },
        {
          "type": "text",
          "text": "我数到第七个夜才承认"
        },
        {
          "type": "text",
          "text": "」。 万能词是懒惰的抽象，换成具体就活了。"
        },
        {
          "type": "text",
          "text": "② 五套公式化句式（直接禁）"
        },
        {
          "type": "table",
          "headers": [
            "编号",
            "句式"
          ],
          "rows": [
            [
              "✗ 1",
              "[名词]，[名词]，[名词]了[名词]"
            ],
            [
              "✗ 2",
              "[四字]，[四字]，不过是一场[抽象词]"
            ],
            [
              "✗ 3",
              "你说[××]，我说[××]，最后不过[××]"
            ],
            [
              "✗ 4",
              "[名词]，[名词]，许我一场[抽象词]"
            ],
            [
              "✗ 5",
              "你说[××][××]，后来[××][××]"
            ]
          ]
        },
        {
          "type": "text",
          "text": "这五套是「拼出来的古风」的指纹。 它们的共同毛病："
        },
        {
          "type": "text",
          "text": "全部由抽象词收尾"
        },
        {
          "type": "text",
          "text": "，句子看着对仗，读完什么都没留下。 看到自己的句子长成这个样子，就重写。"
        },
        {
          "type": "text",
          "text": "③ 现代词与明喻词"
        },
        {
          "type": "table",
          "headers": [
            "类别",
            "词",
            "为什么"
          ],
          "rows": [
            [
              "现代词",
              "手机 · 网络 · 直播 · 地铁 · 加班 · 内卷 · 躺平 · 治愈 · 破防",
              "语体破功——一个现代词就能把整段古意的架子拆掉"
            ],
            [
              "明喻词",
              "像 · 如同 · 仿佛",
              "古风用暗喻与并置，不用「像」 ✗ 你的笑像春风 ✓ 你一笑，檐下那串冰就化了"
            ]
          ]
        },
        {
          "type": "text",
          "text": "另有一条硬规矩："
        },
        {
          "type": "text",
          "text": "用典只当背景色，不当内容"
        },
        {
          "type": "text",
          "text": "—— 听众要查才知道你在说什么，就是失败。还有：生僻字一律换掉（古意不等于冷僻）； 不许化用他人词句的原句——那不叫致敬，叫抄。"
        }
      ],
      "skip": true,
      "order": 48,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-guofeng-craft.c6",
      "course": "lyric",
      "chapter": "10 古风手艺：物候、句法、禁用清单",
      "title": "古风四诊：按症状开处方",
      "goal": "古风四诊：按症状开处方 能数的部分，第 15 节的自检器已经替你查了（万能词超限与重复、公式句指纹、物候互斥）；",
      "estimatedSeconds": 48,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "古风四诊：按症状开处方"
        },
        {
          "type": "table",
          "headers": [
            "症状",
            "真实问题",
            "处置"
          ],
          "rows": [
            [
              "古风好空 / 堆词",
              "意象不服务情绪",
              "逐个问「它替哪种情绪值岗」，指不出的删；一句留 ≤2 个意象"
            ],
            [
              "看着像古风，但读不懂",
              "句法断裂（缺主语的省略被滥用）",
              "每句补回一个可读的语法主干，删掉撑不住的省略"
            ],
            [
              "词很美，但不动人",
              "只有景，没有人",
              "加一个身体能做的动作或一个人的位置（倚、坐、数、收、系）"
            ],
            [
              "唱不出来 / 拗口",
              "文言密度过高、生僻字、四字连排",
              "副歌降到白话（0–10%）；四字短语 ≤2 处"
            ],
            [
              "时序混乱",
              "物候错配",
              "查物候时序表，锁定一季"
            ],
            [
              "像 AI 写的",
              "撞万能词 + 套公式句",
              "换具体物 + 换句法骨架（六种）"
            ],
            [
              "副歌不够燃",
              "字太多、动作太少",
              "缩句 + 加一个身体动词（起、落、断、收、回头）"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "能数的部分，第 15 节的自检器已经替你查了（万能词超限与重复、公式句指纹、物候互斥）； 只报嫌疑，不判对错——文言浓度、四字短语数、单句意象数、用典是否需注释， 这四条脚本一律不查，只能人读。"
        }
      ],
      "skip": true,
      "order": 49,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-frame.intro",
      "course": "lyric",
      "chapter": "11 五种框景：先定从哪儿切进去",
      "title": "五种框景：先定从哪儿切进去",
      "goal": "不要直接写词。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "不要直接写词。先给五个切入角度，每个只出一句方向。 框景一旦定下，全篇不会飘——因为\"谁在什么处境里说话\"被锁住了。"
        }
      ],
      "skip": true,
      "order": 50,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-frame.c1",
      "course": "lyric",
      "chapter": "11 五种框景：先定从哪儿切进去",
      "title": "五种框景：先定从哪儿切进去 · 1",
      "goal": "锁定纪律：选定后锁死框景，主歌一必须在这里；",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "table",
          "headers": [
            "#",
            "框景",
            "说明"
          ],
          "rows": [
            [
              "1",
              "一封信",
              "写给某人或某物；口吻一旦定下，全篇不会飘"
            ],
            [
              "2",
              "一次通话",
              "对方说的最后一句话"
            ],
            [
              "3",
              "一个房间的某个时刻",
              "记忆里的具体空间"
            ],
            [
              "4",
              "一段独白",
              "没说出口的那段话"
            ],
            [
              "5",
              "一段没发生的对话",
              "如果那天说了会怎样"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "锁定纪律：选定后锁死框景，主歌一必须在这里；主歌二换场景但不换情绪核心。"
        }
      ],
      "skip": true,
      "order": 51,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-frame.c2",
      "course": "lyric",
      "chapter": "11 五种框景：先定从哪儿切进去",
      "title": "古风专用：另外三个框景",
      "goal": "古风专用：另外三个框景 上面五个是通用的。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "古风专用：另外三个框景"
        },
        {
          "type": "text",
          "text": "上面五个是通用的。写古风时，这三个更贴， 优先从这三个里挑——它们共同的特点是自带时间刻度。 古风最怕「没有时间的古意」：只有景没有年岁，就成了布景。"
        },
        {
          "type": "table",
          "headers": [
            "框景",
            "说明"
          ],
          "rows": [
            [
              "一件旧物的视角",
              "物还在原位，人不在了。物是见证者，不是道具。"
            ],
            [
              "一页残稿",
              "旧谱、旧信、旧账本，只读到一半；「没写完」本身就是情节。"
            ],
            [
              "一处旧宅的门",
              "门换过、主人换过、院里草长起来了；人被时间推着走。"
            ]
          ]
        }
      ],
      "skip": true,
      "order": 52,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-frame.c3",
      "course": "lyric",
      "chapter": "11 五种框景：先定从哪儿切进去",
      "title": "人称：决定了听众站在哪儿",
      "goal": "人称：决定了听众站在哪儿 框景管\"在哪个处境里\"，人称管\"离听众多远\"。",
      "estimatedSeconds": 60,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "人称：决定了听众站在哪儿"
        },
        {
          "type": "text",
          "text": "框景管\"在哪个处境里\"，人称管\"离听众多远\"。 同样一件事，换成\"他\"就变成别人的故事，换成\"你\"就变成一次当面质问—— 句子一个字都没改，听感全变了。所以人称必须在动笔前定，不能写着看。"
        },
        {
          "type": "table",
          "headers": [
            "人称",
            "听感",
            "什么时候用",
            "踩雷点"
          ],
          "rows": [
            [
              "我first person",
              "最贴，像在耳边说",
              "私语派、口语派、物证派——一句话能说到耳朵里的都靠它",
              "全篇\"我\"容易滑成自怜；副歌可以换成\"我们\"，人会松一格"
            ],
            [
              "你second person",
              "逼问感或倾诉感——取决于有没有\"我\"在场",
              "告别、指责、情书",
              "只有\"你\"没有\"我\"，就是在跟空气说话；\"我—你\"必须搁在一个具体场景里"
            ],
            [
              "他 / 她third person",
              "有距离，像在看一部片",
              "叙事、时代派、群像",
              "最容易写成人物简介；必须给一个只有他会做的动作"
            ],
            [
              "我们first person plural",
              "拉人入伙，假设有共同记忆",
              "副歌、时代派、宣言派",
              "一开口就\"我们\"，等于替听众先同意了一次；主歌里慎用"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "一段之内不许换人称（换人称＝换说话人，等同换视角，那是桥段的特权）。 要换就在段落边界换，且只换一样——第 06 节第③条纪律管的就是这个。"
        }
      ],
      "skip": true,
      "order": 53,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-frame.c4",
      "course": "lyric",
      "chapter": "11 五种框景：先定从哪儿切进去",
      "title": "多视角写作（进阶，也最容易翻车）",
      "goal": "多视角写作（进阶，也最容易翻车） 主歌一＝叙述者，主歌二＝被说的人，桥段＝两个声音之间的空隙。",
      "estimatedSeconds": 49,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "多视角写作（进阶，也最容易翻车）"
        },
        {
          "type": "text",
          "text": "主歌一＝叙述者，主歌二＝被说的人，桥段＝两个声音之间的空隙。 危险在于让\"感觉\"决定何时换视角——必须逐段指定谁在说话，否则听众会跟丢。"
        },
        {
          "type": "tip",
          "text": "判据：把每一段前面标上「谁在说」，标不出来就是没锁住。"
        }
      ],
      "skip": true,
      "order": 54,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-ban.intro",
      "course": "lyric",
      "chapter": "12 黑名单：这些词一出现，就像机器写的",
      "title": "黑名单：这些词一出现，就像机器写的",
      "goal": "黑名单不是为了\"禁止\"，是为了逼出具体。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "黑名单不是为了\"禁止\"，是为了逼出具体。 只禁用会把词逼进剩下的空地说套话，所以它必须和必需物清单配对使用。"
        }
      ],
      "skip": true,
      "order": 55,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-ban.c1",
      "course": "lyric",
      "chapter": "12 黑名单：这些词一出现，就像机器写的",
      "title": "中文",
      "goal": "中文",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "中文"
        },
        {
          "type": "table",
          "headers": [
            "类别",
            "词与意象"
          ],
          "rows": [
            [
              "光污染",
              "霓虹 · 灯光 · 城市光 · 烟花"
            ],
            [
              "破碎类",
              "破碎 · 崩塌 · 碎裂 · 支离破碎"
            ],
            [
              "时间占位",
              "永恒 · 永远 · 今晚 · 某一天"
            ],
            [
              "眼神类",
              "迷失在你眼里 · 倒映在瞳孔"
            ],
            [
              "陈词",
              "心如刀割 · 如鲠在喉 · 泪如雨下 · 撕心裂肺"
            ],
            [
              "万能句式",
              "你和我一起 · 你终于明白 · 我还在原地"
            ]
          ]
        }
      ],
      "skip": true,
      "order": 56,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-ban.c2",
      "course": "lyric",
      "chapter": "12 黑名单：这些词一出现，就像机器写的",
      "title": "英文",
      "goal": "英文 纪律：整首歌的抽象名词 ≤2 个。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "英文"
        },
        {
          "type": "table",
          "headers": [
            "类别",
            "词与意象"
          ],
          "rows": [
            [
              "抽象名词",
              "love · heart · soul · forever · destiny · fate · eternity · dreams · angel"
            ],
            [
              "烂意象",
              "stars in your eyes · heart on fire · lost in your smile · ocean 代表感情深 · light 代表希望"
            ],
            [
              "烂句式",
              "you complete me · I can't live without you · you're my everything · together forever · meant to be · more than words"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "纪律：整首歌的抽象名词 ≤2 个。超了就删到 2 个，其余全部换成物件、动作或地点。 这一条比改十遍旋律都管用。"
        }
      ],
      "skip": true,
      "order": 57,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-ban.c3",
      "course": "lyric",
      "chapter": "12 黑名单：这些词一出现，就像机器写的",
      "title": "配对使用：禁用 + 必需",
      "goal": "配对使用：禁用 + 必需 只禁用 → 继续偷懒 模型（和人）会在剩下的空间里换一批同样空的词，比如把「霓虹」换成「街灯」。",
      "estimatedSeconds": 55,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "配对使用：禁用 + 必需"
        },
        {
          "type": "text",
          "text": "只禁用 → 继续偷懒"
        },
        {
          "type": "text",
          "text": "模型（和人）会在剩下的空间里换一批同样空的词，比如把「霓虹」换成「街灯」。"
        },
        {
          "type": "text",
          "text": "禁用 + 必需物 → 逼出具体"
        },
        {
          "type": "text",
          "text": "例：禁用上表全部"
        },
        {
          "type": "text",
          "text": "+ 这首必须出现：一杯凉掉的咖啡、一个航班号、一颗松掉的衣扣"
        },
        {
          "type": "text",
          "text": "。"
        },
        {
          "type": "tip",
          "text": "用户给了禁忌清单时，以用户的为准，这份默认清单退为参考。"
        }
      ],
      "skip": true,
      "order": 58,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-fix.intro",
      "course": "lyric",
      "chapter": "13 怎么改词：五个动作，按顺序做",
      "title": "怎么改词：五个动作，按顺序做",
      "goal": "改词不是重写。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "改词不是重写。重写的代价是前面调好的也要重调。 五个动作按优先级排，能靠第 1 个解决就别动第 2 个。"
        }
      ],
      "skip": true,
      "order": 59,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-fix.c1",
      "course": "lyric",
      "chapter": "13 怎么改词：五个动作，按顺序做",
      "title": "怎么改词：五个动作，按顺序做 · 1",
      "goal": "第 4 条最容易被忽略：硬押的那句移出不押韵的位置，一个词都不用改， 硬押感就消失了。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "table",
          "headers": [
            "#",
            "动作",
            "做法",
            "例"
          ],
          "rows": [
            [
              "1",
              "换框景",
              "抽象 → 具体。整句换掉，不是换词",
              "「很孤单」→「把伞留在门口」"
            ],
            [
              "2",
              "换动词",
              "形容词是主张，动词是证据",
              "「她很好看」→「她说狠话前先把头发别到耳后」"
            ],
            [
              "3",
              "调句长",
              "只为情绪需要爆发的那一句加长",
              "副歌最后一句突然变长，前面都别动"
            ],
            [
              "4",
              "挪韵脚",
              "硬押的那句移出押韵位置——不必改词，改位置",
              "把凑韵的那行换到第 3 行（不押的位置）"
            ],
            [
              "5",
              "换韵不改词",
              "用近韵收尾，而不是掰语法",
              "「心」押不上就找「人 / 深 / 春」，别硬造词"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "第 4 条最容易被忽略：硬押的那句移出不押韵的位置，一个词都不用改， 硬押感就消失了。"
        }
      ],
      "skip": true,
      "order": 60,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-fix.c2",
      "course": "lyric",
      "chapter": "13 怎么改词：五个动作，按顺序做",
      "title": "改词交付格式（必须带\"为什么\"）",
      "goal": "改词交付格式（必须带\"为什么\"） 改前：<原文> 改后：<新文> 理由：<为什么这么改 —— 指向具体判据> 影响：<只动了第几段，别处未改> 只改对应段落，不",
      "estimatedSeconds": 52,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "改词交付格式（必须带\"为什么\"）"
        },
        {
          "type": "text",
          "text": "改前：<原文> 改后：<新文> 理由：<为什么这么改 —— 指向具体判据> 影响：<只动了第几段，别处未改>"
        },
        {
          "type": "tip",
          "text": "只改对应段落，不整首重写；改完重跑校验（改韵脚可能引入新的硬押）； 用户说「整首推翻」时，先问清他嫌的是哪一部分再动手。"
        }
      ],
      "skip": true,
      "order": 61,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-album.intro",
      "course": "lyric",
      "chapter": "14 专辑规划：从\"写一首\"到\"做一张\"",
      "title": "专辑规划：从\"写一首\"到\"做一张\"",
      "goal": "先回答一个该问的问题：专辑规划算作词范畴吗？",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "先回答一个该问的问题：专辑规划算作词范畴吗？ 答案是一半。它属于「专辑策划」，比作词大一圈——但它和词直接相关的四件事 （主题分工、辙口分布、钩子密度、命名）确实是作词的延伸。 另一半（BPM、拍号、调式、编制）属于乐理，不由词决定。"
        }
      ],
      "skip": true,
      "order": 62,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-album.c1",
      "course": "lyric",
      "chapter": "14 专辑规划：从\"写一首\"到\"做一张\"",
      "title": "最常见的失败：跳过专辑层",
      "goal": "最常见的失败：跳过专辑层 专辑层没做，直接写 N 个独立的东西——结果每个都能用， 放在一起像同一台机器出的货。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "最常见的失败：跳过专辑层"
        },
        {
          "type": "table",
          "headers": [
            "层",
            "是什么",
            "作用"
          ],
          "rows": [
            [
              "专辑层",
              "音色锚点、结构分配、差异矩阵、拍号与调式口径",
              "保证 N 首是一张专辑，不是 N 首的拼盘"
            ],
            [
              "单曲层",
              "每首的风格栏、歌词标签、意象与结构",
              "保证每首能直接用"
            ],
            [
              "文本层",
              "结构化数据（曲目表就是唯一真源）",
              "两份交付物都由它渲染，改一处全篇重算"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "专辑层没做，直接写 N 个独立的东西——结果每个都能用， 放在一起像同一台机器出的货。第二常见：文档和清单各写一遍，改了一处忘了另一处。"
        }
      ],
      "skip": true,
      "order": 63,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-album.c2",
      "course": "lyric",
      "chapter": "14 专辑规划：从\"写一首\"到\"做一张\"",
      "title": "九项必问（一轮列完，每项带默认值）",
      "goal": "九项必问（一轮列完，每项带默认值） 纪律：只问一轮，用户能答几条答几条；",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "九项必问（一轮列完，每项带默认值）"
        },
        {
          "type": "table",
          "headers": [
            "#",
            "项",
            "问法",
            "不答就用"
          ],
          "rows": [
            [
              "1",
              "专辑名",
              "这张专辑叫什么？不确定我先给候选",
              "先出候选"
            ],
            [
              "2",
              "用途",
              "个人发行 / 影视配乐 / 播客片头 / 其他",
              "个人发行"
            ],
            [
              "3",
              "集数 N",
              "一共几首？",
              "6（3–12 最稳）"
            ],
            [
              "4",
              "主题",
              "整张在讲什么？一句话",
              "从歌词主题里提炼"
            ],
            [
              "5",
              "歌词主题",
              "每首分别写什么？",
              "拆成 N 个不重叠的生活切片"
            ],
            [
              "6",
              "歌词风格",
              "治愈 / 冷峻 / 叙事 / 口语 / 古风 / 不写词",
              "治愈、有画面感"
            ],
            [
              "7",
              "风格锚点",
              "想靠近哪位作曲家或作品？",
              "必须落成一句可执行的话"
            ],
            [
              "8",
              "听感",
              "一句话说清整体听感",
              "安静、留白多、不煽情"
            ],
            [
              "9",
              "曲目名",
              "曲名定了吗？",
              "未定 → 先出候选清单"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "纪律：只问一轮，用户能答几条答几条；每项都带默认值不是为了省事， 是为了他不答时也能开工；补全项必须留痕——写进「假设与待替换」，不能当成用户说的。"
        }
      ],
      "skip": true,
      "order": 64,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-album.c3",
      "course": "lyric",
      "chapter": "14 专辑规划：从\"写一首\"到\"做一张\"",
      "title": "词这边要定的四件事",
      "goal": "词这边要定的四件事",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "词这边要定的四件事"
        },
        {
          "type": "table",
          "headers": [
            "事",
            "怎么做",
            "例"
          ],
          "rows": [
            [
              "主题分工",
              "N 首必须切成 N 个不重叠的生活切片，不是同一个主题写 N 遍。",
              "十首分别对应：出门 / 露水 / 慢 / 午后 / 叶子 / 让步 / 口袋 / 入夜 / 微醺 / 闭眼"
            ],
            [
              "辙口分布",
              "把十三辙当工具用：让每首落在不同的辙上，听感自然分开。",
              "《水慢慢流》十首用了九个辙；言前最宽所以用了两次（an / ian 是同一个辙）"
            ],
            [
              "钩子密度",
              "不是每首都要\"金句\"，但每首必须有一句能独立站住的 3–10 字。",
              "《让一步给风》标题本身就是钩子"
            ],
            [
              "命名策略",
              "曲名未定时给三组 × 五个，不是直接编 N 个名字就跑。",
              "A 意象直取 / B 时间地点 / C 动作或短句，每个候选注明意象来源"
            ]
          ]
        }
      ],
      "skip": true,
      "order": 65,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-album.c4",
      "course": "lyric",
      "chapter": "14 专辑规划：从\"写一首\"到\"做一张\"",
      "title": "结构：序章 + 分组 + 收尾",
      "goal": "结构：序章 + 分组 + 收尾 编制最薄 序章 1 首 最短、最少编制、只留 1–2 件乐器。",
      "estimatedSeconds": 70,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "结构：序章 + 分组 + 收尾"
        },
        {
          "type": "text",
          "text": "编制最薄"
        },
        {
          "type": "text",
          "text": "序章 1 首"
        },
        {
          "type": "text",
          "text": "最短、最少编制、只留 1–2 件乐器。主题是\"把门打开\"。"
        },
        {
          "type": "text",
          "text": "组内变、组间换"
        },
        {
          "type": "text",
          "text": "主体 2–3 组"
        },
        {
          "type": "text",
          "text": "每组一个共同基底（同一编制家族或同一调式家族），组内靠拍号与音区变化。"
        },
        {
          "type": "text",
          "text": "首尾呼应"
        },
        {
          "type": "text",
          "text": "收尾 1 首"
        },
        {
          "type": "text",
          "text": "回到序章的编制，但情绪已变（同一件乐器 + 不同和声）。这是\"专辑感\"的主要来源。"
        },
        {
          "type": "tip",
          "text": "收尾回到序章的编制、但情绪已变（同一件乐器 + 不同和声）—— 这是\"专辑感\"的主要来源。但 BPM 数字必须不同：连速度都一样，就听不出是两个极端了。"
        }
      ],
      "skip": true,
      "order": 66,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-album.c5",
      "course": "lyric",
      "chapter": "14 专辑规划：从\"写一首\"到\"做一张\"",
      "title": "叙事专辑：八首各自分担故事的一段（串行，挪一步就断）",
      "goal": "叙事专辑：八首各自分担故事的一段（串行，挪一步就断） 上面那块骨架是\"三块\"，管的是厚薄；",
      "estimatedSeconds": 78,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "叙事专辑：八首各自分担故事的一段（串行，挪一步就断）"
        },
        {
          "type": "text",
          "text": "上面那块骨架是\"三块\"，管的是厚薄；这张表是\"八个阶段\"，管的是先后。 两者不能互相顶替：骨架可以换组，阶段一步也挪不得——第 6 首的崩塌必须发生在第 5 首的真相之后， 挪到第 4 首就没人看得懂。先有这张表，再动笔写词；反过来一定是八首各自漂亮、放在一起没有故事。"
        },
        {
          "type": "table",
          "headers": [
            "位置",
            "功能",
            "这一首该发生什么",
            "交稿前问自己一句"
          ],
          "rows": [
            [
              "第 1 首",
              "起",
              "交出世界与处境：他在哪儿、缺的是什么",
              "听完这一首，听众知道\"坏在哪儿\"了吗？"
            ],
            [
              "第 2 首",
              "起",
              "交出诱因：一件事发生，日常被打破",
              "这件事能不能一句话说清，且不用解释前情？"
            ],
            [
              "第 3 首",
              "承",
              "试探：他第一次动手，用的还是旧办法",
              "这次没成的原因，和开头那个\"缺\"对得上吗？"
            ],
            [
              "第 4 首",
              "承",
              "代价：第一次真的损失了一样东西",
              "损失是具体物件还是关系？具体才听得见"
            ],
            [
              "第 5 首",
              "转",
              "真相：他知道了自己一直不知道的那件事",
              "这条信息在前四首埋过伏笔吗？"
            ],
            [
              "第 6 首",
              "转",
              "崩塌：旧办法全部失效，必须换一个",
              "这一首是全专辑最安静或最吵的那首吗？"
            ],
            [
              "第 7 首",
              "合",
              "选择：他自己决定，而不是被推着走",
              "这个决定能不能只用动作说，不用台词？"
            ],
            [
              "第 8 首",
              "合",
              "回望：回到第 1 首的地方，但那句话的意思变了",
              "第 1 首的意象在这一首翻面了吗？"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "功能只有四个字：起、承、转、合，每个用两次。 这不是格式，是顺序约束——同样八件事，把\"选择\"放在\"崩塌\"之前，故事就散了。 数量的下限由故事定（几段就几首），上限由注意力定：叙事专辑压住 8–12 首， 多出来的段并进相邻的曲子，而不是再加一轨。"
        }
      ],
      "skip": true,
      "order": 67,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-album.c6",
      "course": "lyric",
      "chapter": "14 专辑规划：从\"写一首\"到\"做一张\"",
      "title": "意象系统：同一个词，第二次出现必须变了意思",
      "goal": "意象系统：同一个词，第二次出现必须变了意思 叙事专辑靠的不是新词，是旧词换了意思。",
      "estimatedSeconds": 70,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "意象系统：同一个词，第二次出现必须变了意思"
        },
        {
          "type": "text",
          "text": "叙事专辑靠的不是新词，是旧词换了意思。 同一套意象要横穿全专辑，每次复现都往前挪一格；原样复述不是呼应，是无能。"
        },
        {
          "type": "table",
          "headers": [
            "意象",
            "第一次出现",
            "后来再次出现",
            "翻的是哪一格"
          ],
          "rows": [
            [
              "雨",
              "第 2 首：雨是留下来的理由——\"下雨了，所以我们没走\"",
              "第 7 首：雨是走不掉的障碍——\"雨停了，我还在等\"",
              "翻的是功能：从借口变成拦路的东西"
            ],
            [
              "门",
              "第 1 首：门关着，他在里面",
              "第 8 首：门开着，他已经不在里面",
              "翻的是哪一边：门没变，人在哪儿变了"
            ],
            [
              "糖",
              "第 3 首：糖是奖励——\"给你一颗，别哭\"",
              "第 6 首：糖是敷衍——\"别再拿糖糊我\"",
              "翻的是谁给谁：同一颗糖，第二次成了打发"
            ]
          ]
        },
        {
          "type": "tip",
          "text": "三条纪律：① 每个核心意象至少出现两次，第二次必须带变化； ② 一次只翻一个维度（温度 / 大小 / 方向 / 谁给谁），翻两个以上就不是同一样东西了； ③ 最后一次出现要回望改写第一次——让前面那句在事后变成另一个意思。 这一层调不出声音，所以它归这里；而\"同一动机在第 8 首真的又响了一次\"，归乐理课第 14 节。"
        }
      ],
      "skip": true,
      "order": 68,
      "task": {
        "type": "action",
        "prompt": "查完这张表后过页",
        "label": "我查完了",
        "explain": "表不是用来背的，是动笔/动耳前先查的工具。"
      }
    },
    {
      "id": "lyric.s-album.c7",
      "course": "lyric",
      "chapter": "14 专辑规划：从\"写一首\"到\"做一张\"",
      "title": "词管不到、但必须一起定的四样",
      "goal": "词管不到、但必须一起定的四样 BPM 拍号 调式 主奏乐器与编制 这四样的具体含义与配对纪律在乐理课：调式看第 03 节，拍号看第 08 节， 节奏型看第 09",
      "estimatedSeconds": 52,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "词管不到、但必须一起定的四样"
        },
        {
          "type": "text",
          "text": "BPM"
        },
        {
          "type": "text",
          "text": "拍号"
        },
        {
          "type": "text",
          "text": "调式"
        },
        {
          "type": "text",
          "text": "主奏乐器与编制"
        },
        {
          "type": "list",
          "ordered": false,
          "items": [
            "N 首 BPM 必须全不同，且分散在至少 3 个速度区（慢 ≤75 / 中 76–100 / 快 ≥101）。全是 88 会像同一首的 N 个段落。",
            "任意两首最多 2 根轴相同（拍号 / 调式 / 主奏乐器 / 编制 / 音区 / BPM 区间）。唯一例外：序章 × 收尾，那是故意呼应，上限放宽到 4 根。",
            "靠名词区分，不靠形容词。「比第 1 首更温暖」是废话，「D dorian, 7/8, 84 BPM, cello」才是区分。"
          ]
        },
        {
          "type": "tip",
          "text": "这四样的具体含义与配对纪律在乐理课：调式看第 03 节，拍号看第 08 节， 节奏型看第 09 节，曲式与段落长度看第 10 节，配器分工与整张的能量曲线看第 14 节。 本页只负责\"词这一侧\"。"
        }
      ],
      "skip": true,
      "order": 69,
      "task": {
        "type": "action",
        "prompt": "按顺序读完后过页",
        "label": "我读完了",
        "explain": "顺序本身就是知识的一部分；跳过也不会卡进度。"
      }
    },
    {
      "id": "lyric.s-check.intro",
      "course": "lyric",
      "chapter": "15 自检：把能数的先数掉",
      "title": "自检：把能数的先数掉",
      "goal": "下面这个框能替你数三件事：禁用词、抽象名词、句长与钩子；",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "下面这个框能替你数三件事：禁用词、抽象名词、句长与钩子； 写古风时还多查四项：万能词、公式句、物候错配，以及韵脚被文言虚词占了多少。 它不查押韵——押韵要拼音和韵母归并，而且人耳比脚本快。 也不查「画面成不成立」，那是人读层的事。"
        }
      ],
      "skip": true,
      "order": 70,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-check.c1",
      "course": "lyric",
      "chapter": "15 自检：把能数的先数掉",
      "title": "自检：把能数的先数掉 · 1",
      "goal": "不联网、不上传，全部在本地算完 还没有输入。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "不联网、不上传，全部在本地算完"
        },
        {
          "type": "text",
          "text": "还没有输入。粘一段词进来，能数的部分我替你数掉。"
        }
      ],
      "skip": true,
      "order": 71,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-check.c2",
      "course": "lyric",
      "chapter": "15 自检：把能数的先数掉",
      "title": "人读清单（脚本管不了这 11 条）",
      "goal": "人读清单（脚本管不了这 11 条） ⚠ 上面那几项只报嫌疑，不判对错——它们把可能有问题的位置摆出来， 算不算问题得你判断。",
      "estimatedSeconds": 58,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "人读清单（脚本管不了这 11 条）"
        },
        {
          "type": "list",
          "ordered": false,
          "items": [
            "每个情绪都落到了具体画面或动作上？（删掉情绪词，画面还在吗）",
            "有没有撞禁用清单里的词？",
            "押韵方案查过体裁表，不是凭记忆？",
            "主歌二换了场景，不是主歌一的逐句改写？",
            "副歌有一句 3–10 字、能独立站住的钩子？",
            "定过主派（八派之一），没叠到三派？",
            "有没有为押韵掰语法、生造词？",
            "同段句长规律，破格只有情绪需要的那一句？",
            "大声念过，念着顺？",
            "有没有编造具名实体、真实事件？",
            "有没有承诺效果（\"这样写一定能火\"）？"
          ]
        },
        {
          "type": "tip",
          "text": "⚠ 上面那几项只报嫌疑，不判对错——它们把可能有问题的位置摆出来， 算不算问题得你判断。古风判据里真正决定好坏的那几条（文言浓度、四字短语数、单句意象数、 用典是否需注释、每个意象是否真在干活）脚本一律不查。 这 11 条全部靠念、靠删、靠指认。一条都跳不过去—— 能跳过的那些，自检器已经替你做完了。"
        }
      ],
      "skip": true,
      "order": 72,
      "task": {
        "type": "action",
        "prompt": "按顺序读完后过页",
        "label": "我读完了",
        "explain": "顺序本身就是知识的一部分；跳过也不会卡进度。"
      }
    }
  ]
};
});
