export const TRICKS = [{
  id: 'surname',
  number: '01',
  category: 'math',
  title: '七张牌，猜中你的姓',
  subtitle: '百家姓读心术',
  description: '不用开口，只回答七次有或没有。你的姓氏，为什么会自己浮现？',
  principle: '二进制编码',
  time: '约 1 分钟',
  mark: '姓',
  theme: 'sage',
  intro: '在心里选一个收录的姓氏。每张牌都仔细找一找，再告诉我它是否出现。'
}, {
  id: 'symbols',
  number: '02',
  category: 'math',
  title: '被看穿的神秘符号',
  subtitle: '九的倍数读心术',
  description: '一个两位数，一次简单计算。你记住的符号，早已写进了答案。',
  principle: '九的倍数',
  time: '约 1 分钟',
  mark: '✧',
  theme: 'rust',
  intro: '默想一个两位数，用它减去十位与个位的和，再在对照表里记住结果对应的符号。'
}, {
  id: 'cards',
  number: '03',
  category: 'math',
  title: '消失在牌堆里的秘密',
  subtitle: '21 张扑克牌找牌',
  description: '记住一张牌，只说它在哪一列。三轮之后，它会走向同一个位置。',
  principle: '位置收敛',
  time: '约 2 分钟',
  mark: '♠',
  theme: 'ink',
  intro: '默记下方的一张牌，不必点击它。每轮只告诉我：那张牌现在在哪一列？'
}, {
  id: 'calendar',
  number: '04',
  category: 'math',
  title: '一眼算出九个日期',
  subtitle: '日历九宫格速算',
  description: '框住九个日期，瞬间说出总和。真的是心算过人，还是另有捷径？',
  principle: '对称与等差',
  time: '约 30 秒',
  mark: '9',
  theme: 'ochre',
  intro: '选择一个月份，再点击一个可选日期，把它作为完整 3 × 3 九宫格的中心。'
}, {
  id: 'barnum',
  number: '05',
  category: 'mind',
  title: '这段话，怎么这么像我',
  subtitle: '巴纳姆效应与冷读术',
  description: '一份看似专属的性格描述。让你觉得“很准”的，到底是哪句话？',
  principle: '普遍描述的个人化',
  time: '约 1 分钟',
  mark: '相',
  theme: 'clay',
  intro: '先读一段“性格解读”，按自己的真实感受评分。这里没有标准答案。'
}, {
  id: 'prediction',
  number: '06',
  category: 'mind',
  title: '你真的自由选择了吗',
  subtitle: '颜色与工具的概率猜测',
  description: '快速想到一种颜色、一件工具。一张提前写好的纸条，会碰巧说中吗？',
  principle: '联想与选择偏向',
  time: '约 30 秒',
  mark: '？',
  theme: 'olive',
  intro: '凭第一反应想一种颜色和一件工具。可以猜中，也完全可能猜错。'
}];
TRICKS.push(
  { id: 'equivoque', number: '07', category: 'mind', title: '你怎么选，都在预言里', subtitle: '魔术师的选择', description: '四件物品，两次决定。一封先写好的预言，为什么总能命中？', principle: '歧义迫选', time: '约 2 分钟', theme: 'rust', intro: '随心选择桌上的物品。结束后可以回看每一步，也可以尝试另一条路线。' },
  { id: 'blindness', number: '08', category: 'mind', title: '这真是你刚才的选择吗', subtitle: '选择盲视实验', description: '选择喜欢的纹样，再说说理由。记忆中的决定，和记录一致吗？', principle: '选择与结果错位', time: '约 2 分钟', theme: 'clay', intro: '完成三轮纹样选择与核对。本体验包含视觉变化，结束后会公开全部记录；不是心理测评。' },
  { id: 'fivecards', number: '09', category: 'math', title: '四张明牌，一封密信', subtitle: '五张牌传心术', description: '任选五张牌，藏起其中一张。只看另外四张，就能读出隐藏答案。', principle: '排列编码', time: '约 3 分钟', theme: 'ink', intro: '你决定五张牌，助手决定藏起哪一张并排列余下四张。随后挑战自己成为编码者。' },
  { id: 'kruskal', number: '10', category: 'math', title: '不同的路，同一张终点', subtitle: '克鲁斯卡尔数牌', description: '选个起点，按牌面向前走。两条陌生的路线，可能在途中相遇。', principle: '随机路径汇合', time: '约 2 分钟', theme: 'sage', intro: 'A 算 1，J、Q、K 算 5，其余按点数。从前十张中选一个起点，走到下一跳越界为止。' },
  { id: 'blessing', number: '11', category: 'story', title: '陌生人为何知道你的家事', subtitle: '祈福消灾局', description: '街头偶遇、神秘高人、步步催促。你会在哪一步停下来核实？', principle: '信息串通与恐惧施压', time: '约 3 分钟', theme: 'ochre', intro: '根据警方警示改编的虚构分支故事。站在当事人一侧作选择，最后拆解人物关系与信息来源。' },
  { id: 'square', number: '12', category: 'math', title: '横竖斜看，都是你的数字', subtitle: '指定数字幻方', description: '报出一个数，十条线都得到同一个和。逐条检查，再亲手拆掉机关。', principle: '幻方与等量调整', time: '约 2 分钟', theme: 'olive', intro: '输入 34～999 的整数，生成 4 × 4 幻方。点击行、列或对角线验证，再查看结构。' },
  { id: 'monty', number: '13', category: 'math', title: '最后两扇门，真是五五开吗', subtitle: '三门换奖局', description: '先选一扇门，再看主持人揭开空门。坚持还是换门？用一千局实验检验直觉。', principle: '条件概率', time: '约 2 分钟', theme: 'rust', intro: '经典三门问题的互动改编。体验选择、揭晓与策略对照，拆解“剩下两个选项就各占一半”的直觉。' }
);
export const CATEGORIES = { math: '数学规律', mind: '心理话术', story: '骗局档案' };
export const BARNUM_LINES = [{
  text: '你享受与人相处，但有些时候，也很需要一个人安静待着。',
  label: '两头都包含',
  explanation: '社交与独处都是常见需求；没有限定时间、场景或程度，很容易找到符合的经历。'
}, {
  text: '你希望别人认可你，却不愿为了所有人的期待，失去自己的判断。',
  label: '正向、普遍的愿望',
  explanation: '认可与自主通常都令人向往。这句话没有提供能区分你与其他人的具体信息。'
}, {
  text: '你有过没有表现出来的犹豫，也会在事后重新思考自己的决定。',
  label: '难以证伪的内心描述',
  explanation: '只要回忆起一次犹豫，就能觉得被说中；“有过”几乎没有限制。'
}, {
  text: '你觉得自己还有潜力没有发挥，只是在等一个更合适的时机。',
  label: '令人舒服的解释',
  explanation: '它既肯定潜力，又解释现状，容易让人接受，却没有说明如何验证。'
}];
