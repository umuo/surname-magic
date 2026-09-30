import { MAGIC_LINES, BASE_SQUARE } from './advancedLogic';
const CONTENT = {
  monty: {
    title: '主持人有意打开空门，信息就不是随机删去的。',
    paragraphs: ['第一次选中宝物的概率是 1/3，选错的概率是 2/3。若一开始选对，坚持会赢；若一开始选错，主持人排除另一扇空门后，换门就会赢。因此总是换门的长期获奖概率是 2/3，坚持是 1/3。', '关键条件是：宝物随机放置，主持人知道答案，总是打开未选中的空门，而且每局都允许换门。本演示在有两扇可开空门时随机选择一扇，奖品不会随决定移动。', '若主持人不知道答案、可能开出宝物，或只在特定情况下允许换门，就不能直接套用上述结论。这是一道概率游戏，本身不等于诈骗；它帮助我们识别把条件隐藏在话术中的误导。'],
    takeaway: '假设你固定先选 1 号门，分别把宝物放在 1、2、3 号门后：坚持赢一次，换门赢两次。模拟会接近这一比例，但不能保证下一局一定获奖。',
    source: 'https://www.stat.berkeley.edu/pub/users/stark/SticiGui/Text/montyHall.htm', label: 'UC Berkeley：The Monty Hall Problem'
  },
  equivoque: {
    title:'选择是真的，选择的含义却被临时改写。',
    paragraphs:['“触碰两件物品”没有承诺选中后要保留还是排除。主持人根据铜钱所在位置，才决定如何解释动作。每条路径都能保住同一个目标。','本演示的铜钱从一开始就固定。它属于结果迫选，不需要你按某种概率偏好作选择，也不是预测未来。'],
    takeaway:'体验页的回放会记录你碰了什么、主持人说了什么，以及剩下什么。重玩时试着反着选，重点观察“保留”和“排除”的切换。',
    source:'https://research.gold.ac.uk/29234/1/Equivoque-Revised_final.pdf', label:'Goldsmiths：The Magician’s Choice 研究论文'
  },
  blindness: {
    title:'我们有时会接受与原先选择不一致的结果。',
    paragraphs:['选择盲视研究考察：当选择的结果被悄悄替换，人是否会察觉，是否会为原本没选的选项给出理由。它描述实验中观察到的现象，不是人人都会出现的规律。','本演示三轮中有一轮被预先随机指定为替换轮，其余轮保留原选择。真实点击与展示结果分别记录；你可以拒绝确认，也可以不填写理由。','图案演示只是研究思路的简化改编，没有复现实验条件，没有对照样本，不能报告心理测评结果或引用研究命中率作为本站的成功率。'],
    takeaway:'不要只凭最终解释判断自己当时做了什么。回看原始选择记录，并同时检查未被替换的轮次。',
    source:'https://www.lucs.lu.se/research/choice-blindness-lab/home/', label:'隆德大学：Choice Blindness Lab'
  },
  fivecards: {
    title:'四张牌的顺序，是一条完整的编码消息。',
    paragraphs:['五张牌只有四种花色，至少两张同花色。助手把这两张放在 A～K 的循环上，总能找到一个方向，让两张之间的距离在 1～6 步内。','前一张先展示，后一张藏起。余下三张牌共有 6 种排列，刚好分别表示 1～6。解码者读取第一张的花色和点数，再按排列得到距离，就能还原隐藏牌。','这里预先约定大小顺序：♣ < ♦ < ♥ < ♠，同花色 A < 2 < … < K。不同约定同样可以使用，但编码者和解码者必须一致。'],
    takeaway:'隐藏牌必须由助手从五张里挑选。若观众任意指定藏哪张，上述同花色编码不一定成立。体验中的解码函数只接收四张明牌。',
    source:'https://nrich.maths.org/problems/best-card-trick?tab=help',label:'剑桥 NRICH：The Best Card Trick?'
  },
  kruskal: {
    title:'一旦踩到同一张牌，后面的路就一样了。',
    paragraphs:['一副固定牌中，每张牌决定下一步走到哪里。两条路径只要经过相同位置，此后就会使用相同跳数，直到共同结束。','本演示先洗牌，以第 1 张为预测路线的起点。你的起点选定后才逐步展示路径，但预测不会更改。A=1，J/Q/K=5，其余为点数；下一跳超过第 52 张时停下。','不同起点并不必然汇合。牌序、跳数规则和牌堆长度都会影响汇合机会。研究将这种现象与马尔可夫链的耦合联系起来。'],
    takeaway:'展开十条路线查看交点；多次重新洗牌也会看到失败。界面只统计当前牌局十个起点，不把它当作总体命中率。',
    source:'https://arxiv.org/abs/math/0110143',label:'Lagarias、Rains、Vanderbei：The Kruskal Count'
  },
  blessing: {
    title:'“神准的信息”，可能只是被转述的信息。',
    paragraphs:['祈福党案例中，陌生人会以攀谈、引路、介绍高人等身份出现，让受害人以为获得了多方印证。若信息都来自同一伙人，就不是独立证据。','把先前套得的家庭情况说出来，再附加灾祸、紧迫性和保密要求，会使人难以从容核实。最后的财物交付可能带来调包或失财风险。','本故事参考警方公开警示，人物和对白均为虚构压缩场景，不代表所有案件都遵循相同顺序。民俗信仰本身也不等于诈骗。'],
    takeaway:'认识来源比“说得准”更重要。暂停交付，联系自己认识的家人或可信人士；已发生损失时及时联系当地警方及相关银行。',
    source:'https://www.police.gov.hk/info/doc/spc/201705_text.pdf',label:'香港警方：耆乐警讯第六期街头骗案警示'
  },
  square: {
    title:'十条线都只多出同一份差值。',
    paragraphs:['基础方阵的每行、每列和两条主对角线之和都是 34。取四个位置，保证每条线恰好经过其中一个，在这些位置各加上“指定总和 − 34”。','例如指定 88，则四格各加 54。每条受检查的线都从 34 变成 88。它是结构变化，而不是逐条独立心算。','本实现允许 34～999 的整数，保证数字为正。调整后可能出现重复数字，不是要求使用连续且互异数字的标准幻方竞赛题。也不声称任意四格都等于指定总和。'],
    takeaway:'在体验页开启结构视图，再逐条检查十条线。你会看到每次都恰好经过一个调整格。',
    source:'https://www.rigb.org/learning/activities-and-resources/shelf-masterclass-magic-squares',label:'Royal Institution：Magic Squares 教学资源'
  }
};
export default function AdvancedExplanation({id}) {
  const content=CONTENT[id];
  return <><h2>{content.title}</h2>{content.paragraphs.map(text=><p key={text}>{text}</p>)}{id==='square'&&<div className="square-proof"><div className="magic-grid">{BASE_SQUARE.map((n,i)=><div className={[0,7,9,14].includes(i)?'magic-adjusted':''} key={i}><b>{n}</b><small>{[0,7,9,14].includes(i)?'+ 差值':'不变'}</small></div>)}</div><p>可检查的十条线：{MAGIC_LINES.map(line=>line.label).join('、')}。</p></div>}<div className="insight-box"><h3>怎么亲手验证？</h3><p>{content.takeaway}</p></div><div className="source-note">资料来源：<a href={content.source} target="_blank" rel="noreferrer">{content.label}</a>。互动界面与情境为本站改编。</div></>;
}
