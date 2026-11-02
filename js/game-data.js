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
      "goal": "调（主音）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "调（主音）"
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
      "goal": "先量两个音之间有多远",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "先量两个音之间有多远"
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
      "title": "小调的三种形态",
      "goal": "小调的三种形态 自然小调就是上面那样。",
      "estimatedSeconds": 52,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "小调的三种形态"
        },
        {
          "type": "text",
          "text": "自然小调就是上面那样。把第七级临时抬高半格，叫和声小调； 上行把第六、七级一起抬、下行还原，叫旋律小调——两者只差第六级这一个音， 听感却从\"送别\"变成\"西化的甜\"。 那一下抬高的半格会产生强烈的\"要回家\"的拉力——《舒伯特小夜曲》里那种叹气就是它。"
        }
      ],
      "skip": true,
      "order": 8,
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
      "order": 9,
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
      "id": "music.s-modes.c2",
      "course": "music",
      "chapter": "03 七个调式：同一串白键，换个音起步",
      "title": "七个调式的全貌",
      "goal": "七个调式的全貌",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "七个调式的全貌"
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
      "order": 13,
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
      "goal": "五声音阶：砍掉两个音，就有了中国味 · 1",
      "estimatedSeconds": 105,
      "blocks": [
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
        }
      ],
      "skip": true,
      "order": 14,
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
      "goal": "五个音，五种调（换个主音就换味道） 国风与和风：两套音阶的\"家规\" 第 13 节讲「文化与风格」时要用到。",
      "estimatedSeconds": 104,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "五个音，五种调（换个主音就换味道）"
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
      "order": 16,
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
      "goal": "大三 vs 小三：根音五音对齐，只有中间那根动了",
      "estimatedSeconds": 109,
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
        }
      ],
      "skip": true,
      "order": 17,
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
      "goal": "音级上的和弦：级数与功能 在调式音阶上，每一级都能叠出一个三和弦。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "音级上的和弦：级数与功能"
        },
        {
          "type": "text",
          "text": "在调式音阶上，每一级都能叠出一个三和弦。 写歌时你只需要说\"来一个 6 级\"，全世界吉他手都知道该弹什么。"
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
      "id": "music.s-chord.c3",
      "course": "music",
      "chapter": "05 和弦与和声：把音叠起来",
      "title": "和弦进行：让和弦一个接一个\"走\"起来",
      "goal": "和弦进行：让和弦一个接一个\"走\"起来 和弦单独听只是\"颜色\"，接起来才有情绪走向。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "和弦进行：让和弦一个接一个\"走\"起来"
        },
        {
          "type": "text",
          "text": "和弦单独听只是\"颜色\"，接起来才有情绪走向。下面六个进行覆盖了流行乐一大半的歌， 每个和弦块可以点开单独听，也能整条播放、调速、循环。"
        }
      ],
      "skip": true,
      "order": 19,
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
      "order": 20,
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
      "goal": "五种收尾方式（点一下听）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "五种收尾方式（点一下听）"
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
      "id": "music.s-cadence.c2",
      "course": "music",
      "chapter": "06 乐句怎么落点：终止式",
      "title": "副歌怎么把情绪\"抬\"起来",
      "goal": "副歌怎么把情绪\"抬\"起来",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "副歌怎么把情绪\"抬\"起来"
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
      "order": 23,
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
      "goal": "点一个术语：同一段旋律，只换速度（点两次可以对比）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "点一个术语：同一段旋律，只换速度（点两次可以对比）"
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
      "id": "music.s-tempo.c2",
      "course": "music",
      "chapter": "07 速度：行板就在这一节",
      "title": "节拍器",
      "goal": "节拍器",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "节拍器"
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
      "order": 26,
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
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "两种让节奏\"活\"起来的办法"
        },
        {
          "type": "text",
          "text": "下面每组都会全程打着拍点（\"嗒、嗒、嗒…\"），你再听旋律是踩在点上还是抢在点前——单听旋律两者几乎一样，有节拍器才分得出来。"
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
      "order": 28,
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
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "① 三个决定：密度、重音、音长"
        },
        {
          "type": "text",
          "text": "看到一段节奏觉得\"好听但说不清为什么\"，就把它拆成这三栏。三栏一念出来，它是什么性格就清楚了。"
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
      "id": "music.s-groove.c2",
      "course": "music",
      "chapter": "09 律动：节奏型怎么设计",
      "title": "② 听一遍：同一段和声，五种打法",
      "goal": "② 听一遍：同一段和声，五种打法 五张卡用的是同一段和声、同一个速度（104 BPM）， 只有节奏型不同。",
      "estimatedSeconds": 50,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "② 听一遍：同一段和声，五种打法"
        },
        {
          "type": "text",
          "text": "五张卡用的是同一段和声、同一个速度（104 BPM）， 只有节奏型不同。所以听到的所有差别，都只能来自\"怎么打\"。 图上八个小格＝两拍（十六分一格）：实心块是重音，浅色是弱拍音头，方块右边那条尾巴是音长。"
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
      "id": "music.s-groove.c3",
      "course": "music",
      "chapter": "09 律动：节奏型怎么设计",
      "title": "③ 选型表：不问哪个好听，问这一段要它干什么",
      "goal": "③ 选型表：不问哪个好听，问这一段要它干什么 写歌时纠结\"配什么节奏\"，通常是因为在问审美问题。",
      "estimatedSeconds": 46,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "③ 选型表：不问哪个好听，问这一段要它干什么"
        },
        {
          "type": "text",
          "text": "写歌时纠结\"配什么节奏\"，通常是因为在问审美问题。改问功能问题就有答案了： 这一段要它干什么活？左列是场合，右列是被逼出来的唯一选择。顺序就是优先级。"
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
      "id": "music.s-groove.c4",
      "course": "music",
      "chapter": "09 律动：节奏型怎么设计",
      "title": "④ 织体总览：15 种织体各管哪一段",
      "goal": "④ 织体总览：15 种织体各管哪一段 上面那张表只讲了最常用的几种。",
      "estimatedSeconds": 51,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "④ 织体总览：15 种织体各管哪一段"
        },
        {
          "type": "text",
          "text": "上面那张表只讲了最常用的几种。整个项目里一共做了 15 种织体—— 每一行都是一种\"这套节奏型怎么打\"的完整配方（音头落在哪几拍、音能拖多长、用什么音色）。 这张表把 15 种一次摊开，让你能按功能查，而不是靠试。"
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
      "order": 33,
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
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "① 十二格：前八格在原地打转，第九格才离开家"
        },
        {
          "type": "text",
          "text": "按播放，格子会一格一格亮过去。别看词，先看颜色什么时候变： 前四格是同一条 I7，第五格转到 IV7，第九格才第一次出现 V7。"
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
      "id": "music.s-form.c2",
      "course": "music",
      "chapter": "10 曲式：12 小节布鲁斯",
      "title": "② 布鲁斯的另一半：两个八分音符不是均分的",
      "goal": "② 布鲁斯的另一半：两个八分音符不是均分的 谱子上写\"每拍两个八分\"，可它没写第二个到底落在哪儿。",
      "estimatedSeconds": 58,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "② 布鲁斯的另一半：两个八分音符不是均分的"
        },
        {
          "type": "text",
          "text": "谱子上写\"每拍两个八分\"，可它没写第二个到底落在哪儿。 古典的默认是均分：落在一半。布鲁斯把后半往后拖到 ⅔——这个位置正好是三连音的第三格， 于是每一拍变成\"长—短、长—短\"，像拖着一条腿走路。底下两行是同一段两拍， 音高一个没改，只有第二下的位置不同：上下对比着看，注意块有没有踩在虚线上。"
        }
      ],
      "skip": true,
      "order": 35,
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
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "③ 为什么前两句必须一模一样"
        },
        {
          "type": "text",
          "text": "三行词各占四格。把\"和声有没有动\"和\"词有没有动\"两件事并排看， 就会发现它们是同一件事："
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
      "order": 38,
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
      "estimatedSeconds": 49,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "① 倒字：旋律拧着字调走"
        },
        {
          "type": "text",
          "text": "普通话四个声调各是一条曲线：阴平平着走（55）、阳平往上挑（35）、 上声压到最低再起（214）、去声高起直落（51）。旋律的每一次滑动都应该和这条曲线同向。 把线翻过来听一遍——这就是\"倒字\"。"
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
      "id": "music.s-lyric.c2",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "② 重音给谁：关键词落在第几拍",
      "goal": "② 重音给谁：关键词落在第几拍 同一句词，音高一个都不改，只改每个字占多长、落在第几拍。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "② 重音给谁：关键词落在第几拍"
        },
        {
          "type": "text",
          "text": "同一句词，音高一个都不改，只改每个字占多长、落在第几拍。 底下一直打着拍点（4/4，第 1 拍最重）——你听的是\"实词有没有落在强位上\"。"
        }
      ],
      "skip": true,
      "order": 40,
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
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "③ 一字一音，还是一字多音"
        },
        {
          "type": "text",
          "text": "同样八个字、同样四拍。一个字配几个音符， 是\"说话\"和\"唱\"最直接的分界。"
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
      "id": "music.s-lyric.c4",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "④ 气口：一口气能唱几个字",
      "goal": "④ 气口：一口气能唱几个字 同样一口气，字数越多，每个字分到的时间越少。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "④ 气口：一口气能唱几个字"
        },
        {
          "type": "text",
          "text": "同样一口气，字数越多，每个字分到的时间越少。 方块越窄，唱的人越没地方换气——这是\"词写得太满\"唯一能被听出来的证据。"
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
      "id": "music.s-lyric.c5",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "⑤ 十三辙：押韵的单位是\"辙\"，不是韵母",
      "goal": "⑤ 十三辙：押韵的单位是\"辙\"，不是韵母 十三辙把汉语韵母归成十三类。",
      "estimatedSeconds": 51,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "⑤ 十三辙：押韵的单位是\"辙\"，不是韵母"
        },
        {
          "type": "text",
          "text": "十三辙把汉语韵母归成十三类。an / ian / uan / üan 是同一个辙—— 所以\"天\"能押\"年\"，虽然它们不是同一个韵母。这条最反直觉，也最实用。 下表按响度排：越往上开口越大、越亮，越往下越暗、越紧。"
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
      "id": "music.s-lyric.c6",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "⑥ 一张专辑怎么分配辙口",
      "goal": "⑥ 一张专辑怎么分配辙口 了解了十三辙，就能把它当工具用：一张多首歌的专辑， 让每首落在不同的辙上，听感自然会分开。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "⑥ 一张专辑怎么分配辙口"
        },
        {
          "type": "text",
          "text": "了解了十三辙，就能把它当工具用：一张多首歌的专辑， 让每首落在不同的辙上，听感自然会分开。下面是《水慢慢流》十首的分配——"
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
      "id": "music.s-lyric.c7",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "⑦ 计时法：中文数「字」，英文数「重音」",
      "goal": "⑦ 计时法：中文数「字」，英文数「重音」 上面全在讲汉语。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "⑦ 计时法：中文数「字」，英文数「重音」"
        },
        {
          "type": "text",
          "text": "上面全在讲汉语。换一种语言，最先失效的不是押韵，是计时。 三条时间轴都是 8 拍——时间一样长，装进去的字数却完全不同。先看宽度，再听。"
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
      "id": "music.s-lyric.c8",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "⑧ 粤语：九声六调，而且入声不许落长音",
      "goal": "⑧ 粤语：九声六调，而且入声不许落长音 粤语不是\"另一种普通话\"。",
      "estimatedSeconds": 53,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "⑧ 粤语：九声六调，而且入声不许落长音"
        },
        {
          "type": "text",
          "text": "粤语不是\"另一种普通话\"。它有 9 个声调，其中三个是入声—— 韵尾 -p / -t / -k，发音时口腔先\"塞住\"。塞音自带一个长度：入声字在语言里就是短的。 所以给粤语写词，第一关不是押韵，是协音；协音里最硬的一条是别把入声拖长。"
        }
      ],
      "skip": true,
      "order": 46,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-lyric.c9",
      "course": "music",
      "chapter": "11 词曲咬合：歌词怎么长在旋律上",
      "title": "⑨ 人声舒适音区：有些音根本唱不上去",
      "goal": "⑨ 人声舒适音区：有些音根本唱不上去 前面八张卡讲的都是字与旋律怎么对齐。",
      "estimatedSeconds": 52,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "⑨ 人声舒适音区：有些音根本唱不上去"
        },
        {
          "type": "text",
          "text": "前面八张卡讲的都是字与旋律怎么对齐。 但还有一条更基础的约束没讲：这个音你根本唱不上去。 词写得再好，旋律要一个高八度的 C，多数人张嘴就是破音—— 那不是\"咬合\"的问题，是这条旋律压根不该这么写。 所以先看人声能待在哪儿："
        }
      ],
      "skip": true,
      "order": 47,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
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
      "order": 48,
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
      "goal": "抬升或降低",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "抬升或降低"
        }
      ],
      "skip": true,
      "order": 49,
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
      "order": 51,
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
      "estimatedSeconds": 57,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "为什么\"速度\"这件事，方块常在说谎"
        },
        {
          "type": "text",
          "text": "耳朵判断快慢，靠的是每秒敲出多少个音头，不是方块上印的那个 BPM 数字。 同样是 92 BPM，一个织体一拍敲一下、另一个织体敲四下，听起来能差出好几倍。所以每张卡片上现在同时标了两个数： 标称 BPM（和弦周期有多快）和 听感速度（音头密度，个/秒）——后者才是耳朵真正在意的那个。"
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
      "order": 53,
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
      "estimatedSeconds": 112,
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
      "id": "music.s-emotion.c4",
      "course": "music",
      "chapter": "13 音乐能表达什么：十三个维度",
      "title": "它到底表达的是什么情绪？——不是一种，是一条弧线",
      "goal": "它到底表达的是什么情绪？",
      "estimatedSeconds": 90,
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
          "text": "所以答案不是\"豪迈\"或\"怅惘\"这种单一情绪，而是： 豪放的外壳里包着孤独的内核，最后一秒从苍凉翻成豁达。 那个转折点就是第④句「豪情还剩了一襟晚照」——被誉为全词神句： 壮美还在，怅惘已经漫上来，因为年华向晚。"
        },
        {
          "type": "text",
          "text": "这条弧线正好对应本节第 10 部分的五张场景卡（在「心情」维度里，标题带「·」的那几张）。 它们刻意用了五声族——因为这首歌本身就是纯五声写的： 「清风·寂寥」降到羽调式（忧郁）、压到最低音区、拉成十二秒一声的长音； 「苍生·豁达」回到宫调式（明亮）、音区回到中段、旋律开始上行。 不是回到天真，是回到\"想清楚了还能笑\"。"
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
      "id": "music.s-emotion.c5",
      "course": "music",
      "chapter": "13 音乐能表达什么：十三个维度",
      "title": "十三个维度分别靠什么承载",
      "goal": "十三个维度分别靠什么承载",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "十三个维度分别靠什么承载"
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
      "id": "music.s-emotion.c6",
      "course": "music",
      "chapter": "13 音乐能表达什么：十三个维度",
      "title": "写东西时的通用配方",
      "goal": "写东西时的通用配方",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "写东西时的通用配方"
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
      "order": 58,
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
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "① 三格定位：任何乐器都在其中一格"
        },
        {
          "type": "text",
          "text": "问\"这里该加什么乐器\"之前，先问\"这里缺哪一格\"。缺低音就补低音， 缺亮就补亮——不是缺\"更好听的乐器\"。"
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
      "id": "music.s-ensemble.c2",
      "course": "music",
      "chapter": "14 配器：谁唱主、谁铺底",
      "title": "② 听三遍：同一条旋律，换三次主乐",
      "goal": "② 听三遍：同一条旋律，换三次主乐 下面三种编制，旋律一个音都没改（都是同一条 8 拍）， 只有\"谁来唱\"和\"其余两层怎么让\"不同。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "② 听三遍：同一条旋律，换三次主乐"
        },
        {
          "type": "text",
          "text": "下面三种编制，旋律一个音都没改（都是同一条 8 拍）， 只有\"谁来唱\"和\"其余两层怎么让\"不同。听的时候盯住一个问题：哪一层在你的耳朵前面。"
        }
      ],
      "skip": true,
      "order": 60,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "music.s-ensemble.c3",
      "course": "music",
      "chapter": "14 配器：谁唱主、谁铺底",
      "title": "③ 再往上一步：整张专辑就是一条能量曲线",
      "goal": "③ 再往上一步：整张专辑就是一条能量曲线 一首歌好不好听是词曲的事，一张专辑好不好听是排序的事。",
      "estimatedSeconds": 48,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "③ 再往上一步：整张专辑就是一条能量曲线"
        },
        {
          "type": "text",
          "text": "一首歌好不好听是词曲的事，一张专辑好不好听是排序的事。 八首歌、同样的内容，只换顺序，听感完全不同。下面是同一批歌的两种排法： 点的高度是听感密度（音头/秒），点下面是调。"
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
      "id": "music.s-ensemble.c4",
      "course": "music",
      "chapter": "14 配器：谁唱主、谁铺底",
      "title": "④ 最后一条线：第 8 首必须让第 1 首重新响一次",
      "goal": "④ 最后一条线：第 8 首必须让第 1 首重新响一次 ③ 管的是横向——首与首之间的能量曲线。",
      "estimatedSeconds": 51,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "④ 最后一条线：第 8 首必须让第 1 首重新响一次"
        },
        {
          "type": "text",
          "text": "③ 管的是横向——首与首之间的能量曲线。叙事专辑还多一条纵向的线： 听众要觉得\"合上了\"，靠的不是词里写一句\"我又回到这里\"，是同一段音乐真的又响了一次。 手段只有三个把手，而这三个都不是文字能做到的。"
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
      "id": "music.s-ensemble.c5",
      "course": "music",
      "chapter": "14 配器：谁唱主、谁铺底",
      "title": "⑤ 再往前一步：动机本身怎么生成",
      "goal": "⑤ 再往前一步：动机本身怎么生成 ④ 讲的是变形——轮廓一个音都不改，只改时值与配器。",
      "estimatedSeconds": 55,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "⑤ 再往前一步：动机本身怎么生成"
        },
        {
          "type": "text",
          "text": "④ 讲的是变形——轮廓一个音都不改，只改时值与配器。 但只会变形的人，写到第三首就没招了：同一个形状换四种速度，还是那一句。 这一节讲另一半：动机本身从哪儿来。母动机是四个音——根、全音、小三度、五度， 一步一级往上爬。下面五种手法，各从这个母动机派生出一个新的："
        }
      ],
      "skip": true,
      "order": 63,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
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
      "order": 64,
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
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "七和弦：在三和弦上再叠一个三度"
        },
        {
          "type": "text",
          "text": "本来三个音，现在四个音。多出来的那个音决定了味道：梦幻、想回家、顺滑、还是悬着。 方块按音高排列，最后一个就是新叠上去的那个。"
        }
      ],
      "skip": true,
      "order": 65,
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
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "转调：同一段旋律，换一套音阶"
        },
        {
          "type": "text",
          "text": "旋律的音高关系一个都不改，只把整套音阶搬家。副歌最后升高全音或半音是华语流行最常用的\"炸开\"手法， 听一次你就认出这个感觉。"
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
      "id": "music.s-cheat.c1",
      "course": "music",
      "chapter": "16 全部速查",
      "title": "写完一首歌的自查清单",
      "goal": "写完一首歌的自查清单",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "写完一首歌的自查清单"
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
      "goal": "两层判据：能数的 / 只能人读的",
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
      "goal": "一条贯穿全页的换算：中文字数 ≈ 英文重音数",
      "estimatedSeconds": 45,
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
      "goal": "这套体裁对\"预期被满足\"的容忍度",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "这套体裁对\"预期被满足\"的容忍度"
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
      "goal": "韵脚五型",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "韵脚五型"
        }
      ],
      "skip": true,
      "order": 8,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-rhyme.c2",
      "course": "lyric",
      "chapter": "02 韵脚五型与方案字母表",
      "title": "八种押韵方案",
      "goal": "八种押韵方案",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "八种押韵方案"
        }
      ],
      "skip": true,
      "order": 9,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
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
      "goal": "句式与切分",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "句式与切分"
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
      "id": "lyric.s-cn.c2",
      "course": "lyric",
      "chapter": "03 中文：字数、顿点、开口度",
      "title": "字数参考（不是规定，是安全区）",
      "goal": "字数参考（不是规定，是安全区）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "字数参考（不是规定，是安全区）"
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
      "estimatedSeconds": 49,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "开口度：副歌为什么偏爱江阳、发花"
        },
        {
          "type": "text",
          "text": "十三辙按响度排下来，最响的是 江阳（ang） 与 发花（a）， 最暗最沉的是 一七（i / ü） 与 姑苏（u）。这不是审美排序，是声学事实： 韵腹开口度越大，第一共振峰越高，听着就越响。"
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
      "estimatedSeconds": 50,
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
      "goal": "优雅五条（全是动作，不是形容词）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "优雅五条（全是动作，不是形容词）"
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
      "goal": "两条传统：选一条，别混着走",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "两条传统：选一条，别混着走"
        }
      ],
      "skip": true,
      "order": 19,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
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
        }
      ],
      "skip": true,
      "order": 20,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
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
      "goal": "四条路：让名动错位，或者整个换掉",
      "estimatedSeconds": 45,
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
      "goal": "五类可用素材（按最不容易撞车排序）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "五类可用素材（按最不容易撞车排序）"
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
      "id": "lyric.s-image.c3",
      "course": "lyric",
      "chapter": "05 意象：把情绪挂到物件上",
      "title": "七种修辞：五种管一句，两种管一段",
      "goal": "七种修辞：五种管一句，两种管一段 只讲通感和矛盾是不够的——那是两种\"听起来聪明\"的技法， 用多了整首词像同一个人在同一个展厅来回走。",
      "estimatedSeconds": 47,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "七种修辞：五种管一句，两种管一段"
        },
        {
          "type": "text",
          "text": "只讲通感和矛盾是不够的——那是两种\"听起来聪明\"的技法， 用多了整首词像同一个人在同一个展厅来回走。下面七种按责任范围分两层： 句内的用错了废一句，跨句的用错了废一段。"
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
      "id": "lyric.s-image.c4",
      "course": "lyric",
      "chapter": "05 意象：把情绪挂到物件上",
      "title": "国风意象库：48 个词，按情绪分成六组",
      "goal": "国风意象库：48 个词，按情绪分成六组 国风真正的坑不是词少，是四个意象服务四种情绪，一句也没立住。",
      "estimatedSeconds": 52,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "国风意象库：48 个词，按情绪分成六组"
        },
        {
          "type": "text",
          "text": "国风真正的坑不是词少，是四个意象服务四种情绪，一句也没立住。 所以这张表不按\"山水 / 人事 / 器物\"分（那是词性分类，帮不上忙）， 而是按这一组只服务哪一种情绪分，每组配一组只属于它的动词。 拿错了组，立刻就变成堆辞藻。"
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
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "九段：每一段只干一件事"
        },
        {
          "type": "text",
          "text": "下面按实际出现的顺序排，不是按重要性排—— 你可以拿它对着一首你熟的歌逐段核对。第四列是判据，答不出来就说明这一段没干自己的活。"
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
      "id": "lyric.s-parts.c2",
      "course": "lyric",
      "chapter": "06 段落：主歌铺、副歌砸、桥段翻",
      "title": "四条纪律：按顺序错都不会错",
      "goal": "四条纪律：按顺序错都不会错",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "四条纪律：按顺序错都不会错"
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
      "goal": "术语：这几个词写歌的人天天挂在嘴上",
      "estimatedSeconds": 45,
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
      "id": "lyric.s-hook.c2",
      "course": "lyric",
      "chapter": "07 钩子七型",
      "title": "三条硬指标（七型同时生效）",
      "goal": "三条硬指标（七型同时生效）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "三条硬指标（七型同时生效）"
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
      "id": "lyric.s-hook.c3",
      "course": "lyric",
      "chapter": "07 钩子七型",
      "title": "歌名：钩子的最短版本",
      "goal": "歌名：钩子的最短版本 歌名不属于正文，却决定别人点不点开——它几乎总是从钩子里掐出来的那一截。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "歌名：钩子的最短版本"
        },
        {
          "type": "text",
          "text": "歌名不属于正文，却决定别人点不点开——它几乎总是从钩子里掐出来的那一截。 写完之后再做这一步，别一开始就取名字：先取名字会逼着你往那个词上凑。"
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
      "order": 33,
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
      "goal": "三种力",
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
      "id": "lyric.s-school.c2",
      "course": "lyric",
      "chapter": "08 八派：这一句靠什么成立",
      "title": "组合纪律（比选派对更容易翻车的地方）",
      "goal": "组合纪律（比选派对更容易翻车的地方）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "组合纪律（比选派对更容易翻车的地方）"
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
      "id": "lyric.s-school.c3",
      "course": "lyric",
      "chapter": "08 八派：这一句靠什么成立",
      "title": "症状 → 该调哪一派",
      "goal": "症状 → 该调哪一派",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "症状 → 该调哪一派"
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
      "order": 37,
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
      "goal": "三种型：点一下看它长什么样",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "三种型：点一下看它长什么样"
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
      "id": "lyric.s-guofeng.c2",
      "course": "lyric",
      "chapter": "09 古风 / 国风：先选一种，再动笔",
      "title": "古风是体裁外套，不是第九派",
      "goal": "古风是体裁外套，不是第九派 八派解决「这一句凭什么打动人」，古风解决「用什么词汇系统和押韵方案」。",
      "estimatedSeconds": 47,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "古风是体裁外套，不是第九派"
        },
        {
          "type": "text",
          "text": "八派解决「这一句凭什么打动人」，古风解决「用什么词汇系统和押韵方案」。 同一件古风外套，可以套在四派上——所以别把古风当成第八派之外多出来的一派， 它是横着穿过去的一层。"
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
      "id": "lyric.s-guofeng.c3",
      "course": "lyric",
      "chapter": "09 古风 / 国风：先选一种，再动笔",
      "title": "四条硬纪律（比辞藻重要得多）",
      "goal": "四条硬纪律（比辞藻重要得多）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "四条硬纪律（比辞藻重要得多）"
        }
      ],
      "skip": true,
      "order": 40,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-guofeng.c4",
      "course": "lyric",
      "chapter": "09 古风 / 国风：先选一种，再动笔",
      "title": "八类意象：它们为什么管用",
      "goal": "八类意象：它们为什么管用 这张表和第 05 节的「48 词库」分工不同，两套并存： 第 05 节那六组是挑词工具（按情绪挑，每组配专属动词）， 这里八类是控密度",
      "estimatedSeconds": 48,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "八类意象：它们为什么管用"
        },
        {
          "type": "text",
          "text": "这张表和第 05 节的「48 词库」分工不同，两套并存： 第 05 节那六组是挑词工具（按情绪挑，每组配专属动词）， 这里八类是控密度工具（这一类为什么管用）。挑词去 05 节，控密度看这里。"
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
      "order": 42,
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
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "物候时序表：动笔前查一次"
        },
        {
          "type": "text",
          "text": "按公历记。写词时按你设定的季节取一组，不许跨季混取。 时序一乱，整段作废——听众未必说得出哪里错，但会觉得「不对劲」。"
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
      "id": "lyric.s-guofeng-craft.c2",
      "course": "lyric",
      "chapter": "10 古风手艺：物候、句法、禁用清单",
      "title": "文言浓度：主歌高、副歌低",
      "goal": "文言浓度：主歌高、副歌低",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "文言浓度：主歌高、副歌低"
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
      "id": "lyric.s-guofeng-craft.c3",
      "course": "lyric",
      "chapter": "10 古风手艺：物候、句法、禁用清单",
      "title": "文言浓度要付三笔代价，第三笔最贵",
      "goal": "文言浓度要付三笔代价，第三笔最贵 浓度不是一个风格偏好，是一笔账。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "文言浓度要付三笔代价，第三笔最贵"
        },
        {
          "type": "text",
          "text": "浓度不是一个风格偏好，是一笔账。 写得越文，付得越多——而且第三笔不是「听着别扭」，是这首歌没法传唱。"
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
        }
      ],
      "skip": true,
      "order": 46,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-guofeng-craft.c5",
      "course": "lyric",
      "chapter": "10 古风手艺：物候、句法、禁用清单",
      "title": "古风专用禁用清单",
      "goal": "古风专用禁用清单 这一节和第 12 节的黑名单不是一回事： 黑名单管的是「AI 味」，这里管的是「古风味」——两种味道都不该有。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "古风专用禁用清单"
        },
        {
          "type": "text",
          "text": "这一节和第 12 节的黑名单不是一回事： 黑名单管的是「AI 味」，这里管的是「古风味」——两种味道都不该有。"
        }
      ],
      "skip": true,
      "order": 47,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
      }
    },
    {
      "id": "lyric.s-guofeng-craft.c6",
      "course": "lyric",
      "chapter": "10 古风手艺：物候、句法、禁用清单",
      "title": "古风四诊：按症状开处方",
      "goal": "古风四诊：按症状开处方",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "古风四诊：按症状开处方"
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
      "order": 49,
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
      "goal": "锁定纪律：",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "锁定纪律："
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
      "id": "lyric.s-frame.c3",
      "course": "lyric",
      "chapter": "11 五种框景：先定从哪儿切进去",
      "title": "人称：决定了听众站在哪儿",
      "goal": "人称：决定了听众站在哪儿 框景管\"在哪个处境里\"，人称管\"离听众多远\"。",
      "estimatedSeconds": 48,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "人称：决定了听众站在哪儿"
        },
        {
          "type": "text",
          "text": "框景管\"在哪个处境里\"，人称管\"离听众多远\"。 同样一件事，换成\"他\"就变成别人的故事，换成\"你\"就变成一次当面质问—— 句子一个字都没改，听感全变了。所以人称必须在动笔前定，不能写着看。"
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
      "id": "lyric.s-frame.c4",
      "course": "lyric",
      "chapter": "11 五种框景：先定从哪儿切进去",
      "title": "多视角写作（进阶，也最容易翻车）",
      "goal": "多视角写作（进阶，也最容易翻车） 主歌一＝叙述者，主歌二＝被说的人，桥段＝两个声音之间的空隙。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "多视角写作（进阶，也最容易翻车）"
        },
        {
          "type": "text",
          "text": "主歌一＝叙述者，主歌二＝被说的人，桥段＝两个声音之间的空隙。 危险在于让\"感觉\"决定何时换视角——必须逐段指定谁在说话，否则听众会跟丢。"
        }
      ],
      "skip": true,
      "order": 53,
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
      "order": 54,
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
      "id": "lyric.s-ban.c2",
      "course": "lyric",
      "chapter": "12 黑名单：这些词一出现，就像机器写的",
      "title": "英文",
      "goal": "英文",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "英文"
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
      "id": "lyric.s-ban.c3",
      "course": "lyric",
      "chapter": "12 黑名单：这些词一出现，就像机器写的",
      "title": "配对使用：禁用 + 必需",
      "goal": "配对使用：禁用 + 必需",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "配对使用：禁用 + 必需"
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
      "order": 58,
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
      "goal": "硬押的那句移出不押韵的位置",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "硬押的那句移出不押韵的位置"
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
      "id": "lyric.s-fix.c2",
      "course": "lyric",
      "chapter": "13 怎么改词：五个动作，按顺序做",
      "title": "改词交付格式（必须带\"为什么\"）",
      "goal": "改词交付格式（必须带\"为什么\"）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "改词交付格式（必须带\"为什么\"）"
        }
      ],
      "skip": true,
      "order": 60,
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
      "order": 61,
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
      "goal": "最常见的失败：跳过专辑层",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "最常见的失败：跳过专辑层"
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
      "id": "lyric.s-album.c2",
      "course": "lyric",
      "chapter": "14 专辑规划：从\"写一首\"到\"做一张\"",
      "title": "九项必问（一轮列完，每项带默认值）",
      "goal": "九项必问（一轮列完，每项带默认值）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "九项必问（一轮列完，每项带默认值）"
        }
      ],
      "skip": true,
      "order": 63,
      "task": {
        "type": "action",
        "prompt": "读完这一页后过页",
        "label": "我读完了",
        "explain": "先看懂再往下走；卡住了就跳过，进度不会因此清零。"
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
      "id": "lyric.s-album.c4",
      "course": "lyric",
      "chapter": "14 专辑规划：从\"写一首\"到\"做一张\"",
      "title": "结构：序章 + 分组 + 收尾",
      "goal": "结构：序章 + 分组 + 收尾",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "结构：序章 + 分组 + 收尾"
        }
      ],
      "skip": true,
      "order": 65,
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
      "estimatedSeconds": 57,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "叙事专辑：八首各自分担故事的一段（串行，挪一步就断）"
        },
        {
          "type": "text",
          "text": "上面那块骨架是\"三块\"，管的是厚薄；这张表是\"八个阶段\"，管的是先后。 两者不能互相顶替：骨架可以换组，阶段一步也挪不得——第 6 首的崩塌必须发生在第 5 首的真相之后， 挪到第 4 首就没人看得懂。先有这张表，再动笔写词；反过来一定是八首各自漂亮、放在一起没有故事。"
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
      "id": "lyric.s-album.c6",
      "course": "lyric",
      "chapter": "14 专辑规划：从\"写一首\"到\"做一张\"",
      "title": "意象系统：同一个词，第二次出现必须变了意思",
      "goal": "意象系统：同一个词，第二次出现必须变了意思 叙事专辑靠的不是新词，是旧词换了意思。",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "意象系统：同一个词，第二次出现必须变了意思"
        },
        {
          "type": "text",
          "text": "叙事专辑靠的不是新词，是旧词换了意思。 同一套意象要横穿全专辑，每次复现都往前挪一格；原样复述不是呼应，是无能。"
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
      "id": "lyric.s-album.c7",
      "course": "lyric",
      "chapter": "14 专辑规划：从\"写一首\"到\"做一张\"",
      "title": "词管不到、但必须一起定的四样",
      "goal": "词管不到、但必须一起定的四样",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "词管不到、但必须一起定的四样"
        },
        {
          "type": "list",
          "ordered": false,
          "items": [
            "N 首 BPM 必须全不同，且分散在至少 3 个速度区（慢 ≤75 / 中 76–100 / 快 ≥101）。全是 88 会像同一首的 N 个段落。",
            "任意两首最多 2 根轴相同（拍号 / 调式 / 主奏乐器 / 编制 / 音区 / BPM 区间）。唯一例外：序章 × 收尾，那是故意呼应，上限放宽到 4 根。",
            "靠名词区分，不靠形容词。「比第 1 首更温暖」是废话，「D dorian, 7/8, 84 BPM, cello」才是区分。"
          ]
        }
      ],
      "skip": true,
      "order": 68,
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
      "order": 69,
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
      "goal": "不联网、不上传，全部在本地算完",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "text",
          "text": "不联网、不上传，全部在本地算完"
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
      "id": "lyric.s-check.c2",
      "course": "lyric",
      "chapter": "15 自检：把能数的先数掉",
      "title": "人读清单（脚本管不了这 11 条）",
      "goal": "人读清单（脚本管不了这 11 条）",
      "estimatedSeconds": 45,
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "人读清单（脚本管不了这 11 条）"
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
    }
  ]
};
});
