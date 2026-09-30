import AdvancedExplanation from './advancedExplanations';
import { useState } from 'react';
import { BARNUM_LINES } from './tricks';
import { SURNAMES } from './surnames';
import { calendarSquare } from './logic';
function SurnameExplanation() {
  const [name, setName] = useState('王');
  const index = SURNAMES.indexOf(name);
  const values = [1, 2, 4, 8, 16, 32, 64];
  return <><h2>七个回答，组成一个二进制编号。</h2><p>每个姓氏都有一个 1～127 的编号。七张牌分别代表 1、2、4、8、16、32、64；只有编号含有对应二进制位的姓氏，才会出现在那张牌上。</p><div className="demo-box"><label>换一个姓氏，看看它的编码<select value={name} onChange={event => setName(event.target.value)}>{SURNAMES.filter(Boolean).map(item => <option key={item}>{item}</option>)}</select></label><div className="binary-demo">{values.map((value, bit) => <div key={value} className={index & value ? 'lit' : ''}><small>第 {bit + 1} 张</small><b>{index & value ? '有' : '无'}</b><span>{value}</span></div>)}</div><div className="formula">{values.filter(value => index & value).join(' + ')} = {index}</div><p>编号 {index} 对应「{name}」。七个回答提供了定位所需的信息。</p></div><h3>为什么最多是 127 个姓氏？</h3><p>七个二选一回答共有 2⁷ = 128 种组合。本游戏把全选“没有”的 0 留给未匹配状态，余下 127 种组合用于姓氏。未收录的姓氏无法可靠识别。</p></>;
}
function SymbolExplanation() {
  const [number, setNumber] = useState(47);
  const x = Math.floor(number / 10),
    y = number % 10;
  return <><h2>看起来选了很多数，最后只剩九种可能。</h2><p>把两位数写作 10x + y，减去十位和个位的和，个位 y 就被消掉了。</p><div className="formula">(10x + y) − (x + y) = 9x</div><div className="demo-box"><label htmlFor="number-demo">亲自验证：{number}<input id="number-demo" type="range" min="10" max="99" value={number} onChange={event => setNumber(Number(event.target.value))} /></label><div className="formula">{number} − ({x} + {y}) = <strong>{9 * x}</strong></div><p>不管个位怎么变，结果始终是 9 的倍数。</p></div><h3>符号表才是机关。</h3><div className="multiples">{[9, 18, 27, 36, 45, 54, 63, 72, 81].map(n => <span key={n}><small>{n}</small>✧</span>)}</div><p>这些位置全部放同一个符号，其余位置用随机符号分散注意。每次重玩会更换目标符号，所以两次答案不同，也仍然能“猜中”。本页的 ✧ 仅作原理示意。</p><p className="source-note">早期网络上也常把这个游戏称作“吉普赛读心术”。这里采用原理名称，避免把数学把戏归因于任何族群。</p></>;
}
function CardsExplanation() {
  return <><h2>每次把你的那一列，夹在中间。</h2><p>牌依次按行发到三列，每列从上往下收。当你指出一列后，把它完整放在另外两列之间，你的牌就被向牌堆中央挤近一步。</p><div className="convergence">{[['起初', '1—21', '21 个可能位置'], ['第一轮', '8—14', '只剩 7 个位置'], ['第二轮', '10—12', '只剩 3 个位置'], ['第三轮', '11', '唯一位置']].map(([label, value, text]) => <div key={label}><small>{label}</small><b>{value}</b><span>{text}</span></div>)}</div><div className="formula">新位置 = 7 + ⌈原位置 / 3⌉</div><p>⌈ ⌉ 表示向上取整。三轮后，第 11 张牌就是答案。过程并不读取牌面，而是在利用你提供的列数固定位置。</p><h3>哪些操作会让它失效？</h3><p>必须始终追踪同一张牌，并按固定顺序发牌和收牌；任意洗牌、换牌，或把目标列放到两端，都会破坏这个结论。</p></>;
}
function CalendarExplanation() {
  const [center, setCenter] = useState(15);
  return <><h2>九个数字，围绕一个中心对称。</h2><p>普通日历里，左右相差 1，上下相差 7。与中心相对的两格之和，总是中心的两倍。</p><div className="demo-box"><label htmlFor="center-demo">改变中心数：{center}<input id="center-demo" type="range" min="9" max="23" value={center} onChange={event => setCenter(Number(event.target.value))} /></label><div className="square-demo">{calendarSquare(center).map((value, index) => <span key={index} className={index === 4 ? 'middle' : `pair-${Math.min(index, 8 - index)}`}>{value}</span>)}</div><div className="formula">总和 = 中心数 × 9 = {center * 9}</div><p>四组对称数 + 中心：4 × 2 × {center} + {center} = {center * 9}</p></div><h3>“秒算”的前提</h3><p>九格必须全部属于同一个月、没有空白，且真的是连续的三行三列。原理演示中的滑块是数字矩阵；体验页会按实际月份检查日期边界。</p></>;
}
function BarnumExplanation() {
  const [selected, setSelected] = useState(0);
  return <><h2>“说得像我”，不等于“只可能是我”。</h2><p>巴纳姆效应指人们容易将笼统、普遍适用的人格描述视为特别符合自己。体验中的文字对所有人都一样，不是根据评分生成的。</p><div className="statement-list">{BARNUM_LINES.map((line, index) => <button key={line.label} aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{line.text}</button>)}</div><div className="insight-box" aria-live="polite"><h3>{BARNUM_LINES[selected].label}</h3><p>{BARNUM_LINES[selected].explanation}</p></div><h3>冷读术不只是几句模糊描述。</h3><p>实际冷读还可能借助观察、试探提问和对方反馈来调整说法。本体验只演示通用描述，不能据此判断某个人的人格，也不是心理测评。</p><h3>试着多问一句</h3><p>“这句话对多少其他人也成立？有哪些明确、能验证的细节？”把命中和没命中的内容都记下来，比只凭印象更有帮助。</p><div className="source-note">延伸阅读：<a href="https://pubmed.ncbi.nlm.nih.gov/18110193/" target="_blank" rel="noreferrer">Forer（1949），个人验证谬误的课堂演示</a> · <a href="https://dictionary.apa.org/barnum-effect" target="_blank" rel="noreferrer">APA：巴纳姆效应</a></div></>;
}
function PredictionExplanation() {
  return <><h2>它押了一个答案，并没有控制你的选择。</h2><p>体验开始前，答案就固定为“红色的锤子”。输入只用来展示你的选择，没有参与生成预测。不同语言、文化、经验与提示方式，都可能改变一个人最先想到的词。</p><div className="comparison"><div><small>数学把戏</small><h3>条件满足，就必然成立</h3><p>例如九的倍数，可以用代数证明。</p></div><div><small>这次心理猜测</small><h3>可能命中，也可能落空</h3><p>没有可靠命中率数据，不能夸大为普遍规律。</p></div></div><h3>“快一点”不等于“被植入”。</h3><p>限时、排除选项和熟悉度可能影响选择，但本演示没有计时实验或对照组。一次命中无法证明潜意识植入，更不能证明读心能力。</p><h3>如果想检验，怎么做？</h3><p>先写下预测；使用相同提示，独立记录每个人的第一反应；同时保留猜错的结果。要判断提示是否真的起作用，还需要比较有无提示的不同组，而不是只展示成功片段。</p><div className="insight-box"><h3>记住：没猜中，也是一条证据。</h3><p>对“绝大多数都能猜中”的说法，先看样本、条件和完整记录。这个网站不虚构成功率，也不会把你没选中的答案解释成“你在抵抗”。</p></div></>;
}
const EXPLANATIONS = {
  surname: SurnameExplanation,
  symbols: SymbolExplanation,
  cards: CardsExplanation,
  calendar: CalendarExplanation,
  barnum: BarnumExplanation,
  prediction: PredictionExplanation
};
export default function Explanation({
  id
}) {
  const Content = EXPLANATIONS[id];
  return <article className="explanation"><div className="eyebrow">机关，原来在这里</div>{Content ? <Content /> : <AdvancedExplanation id={id} />}</article>;
}
