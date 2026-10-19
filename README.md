# 姐弟厨师团 —— 乐理课

一个可以"动手弄响"的乐理互动课。不啃符号、不背公式，每一块内容都能点、能听、能改参数——
大调小调、七个调式、五声、和弦进行、行板、拍号、移调、十二种表达维度，主流的音乐语言一次玩透。

> 线上试玩：**https://musictheory.2025120.xyz**（Cloudflare Workers 静态资产）

## 运行

工程已从单文件拆分为多文件（HTML / CSS / JS / 图片分离），仍是**零运行时依赖**的静态站，
无构建、无网络请求（声音全部由浏览器实时合成，插图与图标都是本地 PNG）。

直接双击 `index.html` 用浏览器打开即可；或起个本地服务：

```bash
npm start            # 等价于 python3 -m http.server 8000
# 打开 http://localhost:8000
```

建议用桌面端 Chrome / Edge / Safari，手机竖屏同样适配（底部有常驻钢琴）。

## 版本号

**每次改动都要升版本号。** 唯一真源是 `js/app.js` 的 `VERSION` 常量，
`applyVersion()` 把它写进标签页标题、页面 H1、侧栏 brand 三处。

```bash
npm run version          # 自检：四处一致 + 是否比上次提交高
npm run bump -- 1.17     # 一键升到 1.17（日期自动取当天）
```

`npm test` 之前会自动跑一次自检（`pretest`）。改了代码却没升版本会被拦住并提示该改成什么；
确认是纯文档改动可显式跳过：`SKIP_VERSION_BUMP=1 npm test`。

**不要手改那四处**——`npm run bump` 一次改齐并自带写后校验。

## 目录结构

```
musictheory/
├── index.html               # 页面骨架：13 节 <section> + 底栏钢琴 + 脚本装载
├── package.json             # 脚本：start / build / test / version / bump
├── css/
│   └── main.css             # 全站样式（版面宽度由 :root 三个变量统一推导）
├── js/
│   ├── data.js              # 课程数据层：调式/音阶/织体/音色/噪声/12 维场景配方……
│   ├── utils.js             # 工具层：$ / MIDI↔音名↔频率 / triad / spellUp
│   ├── audio.js             # 音频引擎层：TONES 查表合成 + NOISES 环境声 + 节拍器
│   ├── keyboard.js          # 钢琴键盘组件：绘制、亮键、闪灯、视口管理
│   ├── svg.js               # 示意图层：音阶图/旋律图/调式全貌/和弦对比……
│   ├── playback.js          # 播放调度层：sceneEvents 纯函数排程 + 各节播放
│   ├── sections.js          # 交互装配层：逐节生成 chips/表格/场景卡并绑定播放
│   └── app.js               # 入口层：VERSION + 全局状态 + init + 全局事件
├── assets/
│   └── images/
│       ├── hero-art.png     # 页头插图（透明底 PNG）
│       ├── favicon.png      # 图标源图 256×256
│       └── favicon.ico      # 多尺寸 ICO（6 档，PNG 压缩编码）
└── tests/
    ├── run-tests.js         # 自动化测试 31 项（jsdom + 声学验证）
    ├── acoustics.js         # 迷你离线合成器：渲染 PCM 并分析起始点/音高/亮度
    └── bump-version.js      # 版本号自检与一键升级
```

模块均为经典 `<script>`（非 ES Module），按上表顺序共享全局作用域——
**双击 index.html 也能离线跑**，不需要服务器。

## 测试

```bash
npm install     # 安装开发依赖 jsdom
npm test
```

31 项检查，其中 F 组是**声学验证**——把每张场景卡片真的渲染成 PCM 波形，
再做起始点检测 / Goertzel 音高跟踪 / 频谱质心 / 最小音程分析，
逐条核对"听起来的速度、调式、明暗、力度"是否与卡片描述相符。

覆盖范围：

- **资源与版本**：外链资源就位、favicon 三种声明与 ICO 尺寸档位、版本号四处一致、版面宽度对齐不变式
- **页面装配**：13 节导航、两架键盘键数、各表格行数、SVG 方块数、71 张场景卡与 12 维筛选
- **乐理函数**：音名 / MIDI / 频率 / 三和弦 / 罗马数字 / 音名拼写
- **交互冒烟**：桩 AudioContext 下点播各节按钮，验证出声 + 点亮链路无报错
- **声学验证**：听感速度与描述同向（含"热血必须快过悬疑"回归）、音区/亮度/力度/空间/协和度与语义一致

## 内容（13 节）

| 节 | 内容 |
|---|---|
| 00 | 先弄响一架钢琴（点键即出声，选调即亮键） |
| 01 | 半音、全音与音程 |
| 02 | 大调与小调 |
| 03 | 七个调式（同串白键，换个音起步） |
| 04 | 五声音阶与偏音 + 四种特色音阶 |
| 05 | 和弦与和声 |
| 06 | 终止式与副歌抬升 |
| 07 | 速度（行板在这） |
| 08 | 拍号与节奏 |
| 09 | 移调与调号 |
| 10 | 音乐的十二种表达维度（71 张可播放配方） |
| 11 | 转调与七和弦 |
| 12 | 速查表 |

## 技术要点

- **Web Audio API 实时合成**：每个音 = 3 个振荡器（基频 / 八度 / 十二度泛音）+ 低通包络，
  参数全部查 `TONES` 表（12 种音色 = 起音时间/泛音配比/滤波亮度）；无任何音频文件
- **听感速度 = 音头密度**：耳朵判断快慢靠"每秒多少个音头"，不是 BPM 数字。
  织体表 `TEX` 声明每个和弦周期内音头落在第几拍，密度 = `hits.length × BPM ÷ 120`。
  卡片同时显示标称 BPM 与实测密度，两者不一致时以密度为准
- **键盘音域 C3–D7**：可视窗固定两八度（C4–B5），超出部分左右溢出；
  播放时发声键自动贴边缘进入视口，键灭后 0.5s 滑回；支持鼠标/触屏拖动平移
- **版面宽度三层推导**：`--read`(790) → `--card-out`(834) → `--wrap-out`(898)。
  正文与卡片内文字都落在同一条内容框内，只有卡片边框向外突出
- **注释密度**：所有 js/css 文件按"文件头 → 分区横幅 → 函数级注释"三级写满，
  含历史踩坑记录（如键盘音域必须实测、pointer capture 会吞 click、
  只对齐宽度不缩进左缘则右边缘照样错开等）

## 部署

线上地址（Cloudflare Workers 静态资产）：

- **https://musictheory.2025120.xyz**

纯静态站，入口即 `index.html`，无构建步骤。Cloudflare Workers 通过 Git 集成
（`github.com/Tairraos/musictheory`）自动构建部署：push `master` 后
Cloudflare 跑 `npm run build` 产出 `dist/`，再由 `npx wrangler deploy` 发布。

```bash
# 手动触发一次部署
npm run build && npx wrangler deploy
```

> 注：git remote 使用 SSH 地址（`git@github.com:Tairraos/musictheory.git`），
> 因为部分网络环境下 HTTPS 推送到 github.com 会被代理拦截。
> `npm test` 的 pretest 会先校验版本号，改了代码记得先 `npm run bump`。
