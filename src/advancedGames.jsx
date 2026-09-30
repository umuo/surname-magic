import MontyGame from './MontyGame';
import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { NextButton, PlayingCard, Transition, useTurnLock } from './components/Common';
import { BASE_SQUARE, MAGIC_LINES, PERMUTATIONS, decodeFour, encodeFive, forceChoice, fullDeck, kruskalPath, magicSquare, shuffle } from './advancedLogic';

const OBJECTS = ['铜钱', '折扇', '印章', '玉环'];
const OBJECT_MARKS = ['◉', '扇', '印', '◎'];
function EndActions({ onExplain, onReset }) { return <div className="action-row ending-actions"><button className="button primary" onClick={onExplain}>揭开原理 <ArrowRight size={16} /></button><button className="button secondary" onClick={onReset}><RotateCcw size={15} /> 重新体验</button></div>; }

export function EquivoqueGame({ onExplain }) {
  const [remaining, setRemaining] = useState(OBJECTS);
  const [selected, setSelected] = useState([]);
  const [history, setHistory] = useState([]);
  const [replay, setReplay] = useState(false);
  const { busy, run } = useTurnLock();
  const finished = remaining.length === 1;
  function reset() { setRemaining(OBJECTS); setSelected([]); setHistory([]); setReplay(false); }
  function submit() { run(() => { const record = forceChoice(remaining, selected); setHistory([...history, record]); setRemaining(record.kept); setSelected([]); }); }
  return <div className="advanced-game"><div className="sealed-banner"><span>预言已封存</span><b>{finished ? '最后留下的是：铜钱' : '完成选择后打开'}</b></div>{!finished ? <><h2>{remaining.length === 4 ? '请触碰其中两件物品。' : '再触碰其中一件。'}</h2>{history.length > 0 && <p role="status">{history.at(-1).rule}。现在桌上剩下两件。</p>}<div className="object-grid">{remaining.map(item => <button key={item} aria-pressed={selected.includes(item)} onClick={() => setSelected(selected.includes(item) ? selected.filter(x => x !== item) : selected.length < remaining.length / 2 ? [...selected,item] : selected)}><b>{OBJECT_MARKS[OBJECTS.indexOf(item)]}</b><span>{item}</span></button>)}</div><NextButton disabled={busy || selected.length !== remaining.length / 2} onClick={submit}>选好了，继续</NextButton></> : <Transition><div className="force-result">◉</div><h2>你留下的，正是预言中的铜钱。</h2><p>你确实作出了选择。但选择是否真的改变了结果？</p><button className="button primary" onClick={() => setReplay(!replay)} aria-expanded={replay}>{replay ? '收起回放' : '回放：规则在哪里变了'}</button>{replay && <div className="replay-list">{history.map((record,i)=><div key={i}><small>第 {i+1} 次</small><p>你触碰：<b>{record.chosen.join('、')}</b></p><p>主持人说：<mark>{record.rule}</mark></p><p>留下：{record.kept.join('、')}</p></div>)}<div className="insight-box"><h3>“触碰”没有提前约定含义。</h3><p>如果你碰到铜钱所在的一组，就“保留”；否则就“排除”。换一条路线，预言仍然一样。真正改变的是主持人对选择的解释。</p></div></div>}<EndActions onExplain={onExplain} onReset={reset} /></Transition>}</div>;
}

const PATTERN_PAIRS = [['同心圆','波纹'],['菱格','星点'],['横纹','棋格']];
export function Pattern({ name }) { return <span className={`pattern pattern-${PATTERN_PAIRS.flat().indexOf(name)}`} role="img" aria-label={name} />; }
export function BlindnessGame({ onExplain }) {
  const [round, setRound] = useState(0);
  const [swapRound, setSwapRound] = useState(() => Math.floor(Math.random()*3));
  const [selection, setSelection] = useState(null);
  const [records, setRecords] = useState([]);
  const [reason, setReason] = useState('');
  const { busy, run } = useTurnLock();
  function reset() { setRound(0); setSwapRound(Math.floor(Math.random()*3)); setSelection(null); setRecords([]); setReason(''); }
  function confirm(noticed) { run(() => { setRecords([...records,{ chosen:selection, shown:round===swapRound ? PATTERN_PAIRS[round].find(x=>x!==selection) : selection, noticed, reason:reason.trim() }]); setSelection(null); setReason(''); setRound(round+1); }); }
  if (round === 3) return <div className="advanced-game"><div className="eyebrow">三轮记录 · 现在全部公开</div><h2>其中一轮，展示结果被调换了。</h2><p>下面是你实际点击与随后看到的内容。发现与否都正常，不能用一次演示判断记忆或性格。</p><div className="blind-replay">{records.map((record,i)=><div key={i}><h3>第 {i+1} 轮 · {record.chosen===record.shown ? '没有调换' : '发生调换'}</h3><div className="pattern-comparison"><div><Pattern name={record.chosen}/><small>实际选择：{record.chosen}</small></div><ArrowRight size={20}/><div><Pattern name={record.shown}/><small>随后展示：{record.shown}</small></div></div><p>{record.noticed ? '你提出了“不一致”。' : '你确认了展示结果。'}{record.reason && ` 你当时写下：“${record.reason}”`}</p></div>)}</div><EndActions onExplain={onExplain} onReset={reset}/></div>;
  return <Transition id={`${round}-${selection}`} className="advanced-game"><div className="round-label"><span>纹样偏好与核对</span><b>{round+1} / 3</b></div>{!selection ? <><h2>这两幅纹样，你更喜欢哪一个？</h2><div className="pattern-choices">{PATTERN_PAIRS[round].map(name=><button key={name} disabled={busy} onClick={()=>run(()=>setSelection(name))} aria-label={`选择${name}`}><Pattern name={name}/><span>选择这幅</span></button>)}</div></> : <><h2>这是刚才的选择，对吗？</h2><div className="chosen-pattern"><Pattern name={round===swapRound ? PATTERN_PAIRS[round].find(x=>x!==selection) : selection}/></div><label className="field-label">如果愿意，说说喜欢它的理由（可跳过）<textarea aria-label="喜欢的理由" value={reason} onChange={e=>setReason(e.target.value)} maxLength={180} placeholder="比如形状、节奏、联想到的事物……" /></label><div className="action-row"><button className="button secondary" disabled={busy} onClick={()=>confirm(true)}>这不是我选的</button><button className="button primary" disabled={busy} onClick={()=>confirm(false)}>是的，继续</button></div></>}</Transition>;
}

export function FiveCardsGame({ onExplain }) {
  const [chosen, setChosen] = useState(() => shuffle(fullDeck()).slice(0,5));
  const [stage, setStage] = useState('choose');
  const [manual, setManual] = useState(false);
  const [encoding, setEncoding] = useState(null);
  const [guess, setGuess] = useState(null);
  function reset() { setChosen(shuffle(fullDeck()).slice(0,5)); setStage('choose'); setManual(false); setEncoding(null); setGuess(null); }
  if (stage === 'choose') return <div className="advanced-game"><h2>这五张牌，由你决定。</h2><p>随机发牌，或展开整副牌手选。助手随后决定藏起哪一张，不是任意指定隐藏牌。</p><div className="five-hand">{chosen.map(card=><PlayingCard key={card.id} card={card}/>)}</div><div className="action-row"><button className="button secondary" onClick={()=>setChosen(shuffle(fullDeck()).slice(0,5))}>随机换五张</button><button className="button secondary" onClick={()=>setManual(!manual)} aria-expanded={manual}>手动选牌（{chosen.length}/5）</button></div>{manual && <div className="deck-picker">{fullDeck().map(card=><button key={card.id} aria-label={`选牌${card.id}`} aria-pressed={chosen.some(c=>c.id===card.id)} disabled={chosen.length===5 && !chosen.some(c=>c.id===card.id)} onClick={()=>setChosen(chosen.some(c=>c.id===card.id) ? chosen.filter(c=>c.id!==card.id) : [...chosen,card])}>{card.id}</button>)}</div>}<NextButton disabled={chosen.length!==5} onClick={()=>{setEncoding(encodeFive(chosen));setStage('encoded');}}>交给助手排列</NextButton></div>;
  const decoded = decodeFour(encoding.shown);
  return <div className="advanced-game"><div className="eyebrow">{stage==='encoded' ? '助手留下的四张明牌' : '四张牌，就已足够传信'}</div><div className="five-hand encoded-hand">{encoding.shown.map((card,i)=><div key={card.id}><small>位置 {i+1}</small><PlayingCard card={card}/></div>)}<div><small>隐藏牌</small>{stage==='encoded' ? <div className="card-hidden">？</div> : <PlayingCard card={decoded}/>}</div></div>{stage==='encoded' ? <><p>“读心者”只根据这四张明牌的顺序解码，没有读取隐藏牌。</p><NextButton onClick={()=>setStage('revealed')}>请读心者报出答案</NextButton></> : <><h2>隐藏牌是 {decoded.id}。</h2><div className="insight-box"><h3>第一张定花色，后三张传距离。</h3><p>{encoding.base.id} 与隐藏牌同花色。后三张按约定大小排列，代表向前数 {encoding.distance} 步；超过 K 回到 A。</p><p>大小约定：先按 ♣ &lt; ♦ &lt; ♥ &lt; ♠，同花色按 A～K。三个不同物件共有 3! = 6 种顺序。</p></div><h3>轮到你：把 {encoding.distance} 编成排列</h3><p>小 = {encoding.rest[0].id}，中 = {encoding.rest[1].id}，大 = {encoding.rest[2].id}。选一个编码，再核对。</p><div className="permutation-options">{PERMUTATIONS.map((order,i)=><button key={i} aria-pressed={guess===i} onClick={()=>setGuess(i)}>{order.map(v=>['小','中','大'][v]).join(' → ')}</button>)}</div>{guess!==null && <p className="challenge-feedback" role="status">{guess+1===encoding.distance ? '编码正确！你也能传递这张隐藏牌了。' : `这组顺序表示 ${guess+1} 步，还不是 ${encoding.distance}。再试试。`}</p>}<details className="encoding-key"><summary>查看六种排列对照</summary>{PERMUTATIONS.map((order,i)=><p key={i}>{i+1} = {order.map(v=>['小','中','大'][v]).join(' → ')}</p>)}</details><EndActions onExplain={onExplain} onReset={reset}/></>}</div>;
}

function PathMap({ paths, user }) {
  const point = n => `${25+(n%13)*46},${25+Math.floor(n/13)*51}`;
  return <div className="path-map"><svg viewBox="0 0 605 205" role="img" aria-label="十个起点的牌路汇合图，相交后共享后续路线">{paths.map((path,i)=><polyline key={i} points={path.map(point).join(' ')} fill="none" stroke={i===user?'#a64f31':'#748966'} strokeOpacity={i===user?1:.22} strokeWidth={i===user?3:1.5}/>)}{Array.from({length:52},(_,n)=><g key={n}><circle cx={25+n%13*46} cy={25+Math.floor(n/13)*51} r="8" fill={paths[user]?.includes(n)?'#a64f31':'#edeede'}/><text x={25+n%13*46} y={28+Math.floor(n/13)*51} textAnchor="middle" fontSize="7" fill={paths[user]?.includes(n)?'#fff':'#5d6e50'}>{n+1}</text></g>)}</svg><p className="small muted">圆点标的是第几张牌。橙色为你的路线，绿色为其他起点。</p></div>;
}
export function KruskalGame({ onExplain }) {
  const [deck,setDeck]=useState(()=>shuffle(fullDeck()));
  const [start,setStart]=useState(null);
  const [steps,setSteps]=useState(1);
  const [showMap,setShowMap]=useState(false);
  const {busy,run}=useTurnLock();
  const paths=Array.from({length:10},(_,i)=>kruskalPath(deck,i));
  const prediction=paths[0].at(-1);
  const path=start===null?[]:paths[start];
  const complete=start!==null && steps>=path.length;
  function reset(){setDeck(shuffle(fullDeck()));setStart(null);setSteps(1);setShowMap(false);}
  return <div className="advanced-game"><div className="sealed-banner"><span>{complete ? '预测采用第 1 张出发的路线' : '本轮预测已在你选择之前确定'}</span><b>{complete?`预测：第 ${prediction+1} 张 ${deck[prediction].id}`:'预测已封存，结束后揭晓'}</b></div>{start===null ? <><h2>从前十张里选一个起点。</h2><p>按牌面数值向后移动对应的张数；例如在第 3 张遇到 4，下一步就是第 7 张。</p></> : <div className="round-label"><span>{complete?'行走结束':`当前：第 ${path[steps-1]+1} 张 ${deck[path[steps-1]].id}`}</span><b>{steps} 步</b></div>}<div className="walk-deck">{deck.map((card,i)=><button key={card.id} aria-label={`第 ${i+1} 张 ${card.id}${i<10?'，可作起点':''}`} disabled={start!==null||i>=10} className={`${path.slice(0,steps).includes(i)?'walk-visited':''} ${i===path[steps-1]?'walk-current':''}`} onClick={()=>setStart(i)}><small>{i+1}</small><b>{card.id}</b><span>走 {card.value>10?5:card.value}</span></button>)}</div>{start!==null && !complete && <NextButton disabled={busy} onClick={()=>run(()=>setSteps(steps+1))}>按当前牌点数前进</NextButton>}{complete && <Transition><h2>{path.at(-1)===prediction ? '两条路线，抵达了同一张牌。' : '这次没有猜中，路线没有汇合。'}</h2><p>你的终点：第 {path.at(-1)+1} 张 {deck[path.at(-1)].id}。本轮十个起点中，有 {paths.filter(p=>p.at(-1)===prediction).length} 个与预测终点相同。这是当前牌局的结果，不是普遍命中率。</p><div className="path-sequence">你的路线：{path.map(n=>n+1).join(' → ')}</div><button className="button secondary" aria-expanded={showMap} onClick={()=>setShowMap(!showMap)}>{showMap?'收起汇合图':'展开十条路线，看在哪里相遇'}</button>{showMap&&<PathMap paths={paths} user={start}/>}<EndActions onExplain={onExplain} onReset={reset}/></Transition>}</div>;
}

const STORY = [
  {title:'街口的一次“偶遇”',speaker:'陌生路人',text:'一位路人询问附近有没有“看得很准的老师傅”，接着热情地聊起你的家人。',choices:[['随口说起家人的近况','detail'],['不透露家事，离开','leave'],['先问清对方身份','verify']],clue:'第一处信息入口：闲聊中透露的家庭情况，可能被转告给后续出现的人。'},
  {title:'恰好出现的“热心人”',speaker:'第二位路人',text:'另一个人加入，说自己受过老师傅帮助，愿意带路。两位陌生人的说法听起来互相印证。',choices:[['跟着去看看','follow'],['联系家人，核实说法','verify'],['停止接触，离开','leave']],clue:'第二个证据陷阱：两个人的说法可能来自同一个团伙，并非两份独立证据。'},
  {title:'“高人”说出了你的家事',speaker:'自称高人的人',text:'对方提到你刚才聊过的家人近况，随后声称即将有灾祸，必须立即处理，还要求别告诉家人。',choices:[['先留下来听解决办法','listen'],['指出信息可能来自刚才的闲聊','verify'],['拒绝保密要求并离开','leave']],clue:'信息被包装成神通，再叠加恐惧、时间压力和保密要求，使人难以独立核实。'},
  {title:'“祈福”需要交出财物',speaker:'自称高人的人',text:'对方要求把现金和首饰交给他“祈福”，并承诺之后返还。你现在可以作出最后决定。',choices:[['拒绝交付，联系可信的人','verify'],['离开现场，保留线索','leave'],['查看如果交付会有什么风险','risk']],clue:'风险落在财物转移：所谓祈福可能伴随调包或卷款。口头返还承诺不能消除损失风险。'}
];
export function BlessingGame({onExplain}) {
  const [records,setRecords]=useState([]);
  const [ended,setEnded]=useState(false);
  const {busy,run}=useTurnLock();
  const current=STORY[records.length];
  function select(label,action){run(()=>{setRecords([...records,{label,action,stage:records.length}]);if(action!=='detail'&&action!=='follow'&&action!=='listen')setEnded(true);});}
  return <div className="advanced-game"><div className="story-caption">虚构情境 · 不要求输入个人资料或支付</div>{!ended ? <Transition id={records.length}><div className="eyebrow">场景 {records.length+1} / 4 · {current.speaker}</div><h2>{current.title}</h2><blockquote className="story-scene">{current.text}</blockquote><div className="story-choices">{current.choices.map(([label,action])=><button key={action} disabled={busy} onClick={()=>select(label,action)}>{label}<ArrowRight size={16}/></button>)}</div></Transition> : <Transition><h2>{records.at(-1).action==='risk'?'交付财物后，返还没有保障。':'你在这一步暂停了骗局。'}</h2><p>这不是对受害者的评判。团伙会利用担心家人的情绪。暂缓决定、独立核实，是给自己留出判断空间。</p><div className="replay-list">{records.map(record=><div key={record.stage}><small>场景 {record.stage+1} · 你的选择</small><h3>{record.label}</h3><p>{STORY[record.stage].clue}</p></div>)}</div><div className="information-flow"><span>闲聊者收集信息</span><ArrowRight size={17}/><span>同伙转述、互相背书</span><ArrowRight size={17}/><span>“高人”包装成预知</span></div><details className="encoding-key"><summary>查看完整四步与每步的止损机会</summary>{STORY.map((scene,i)=><div key={scene.title}><h3>{i+1}. {scene.title}</h3><p>{scene.clue}</p></div>)}</details><div className="insight-box"><h3>把核实交给独立来源。</h3><p>用自己已知的联系方式联系家人；不要只向同一伙人确认。如已交付财物，尽快联系当地警方；涉及转账时联系银行。</p></div><EndActions onExplain={onExplain} onReset={()=>{setRecords([]);setEnded(false);}}/></Transition>}</div>;
}

export function SquareGame({onExplain}) {
  const [input,setInput]=useState('88');
  const [total,setTotal]=useState(null);
  const [line,setLine]=useState(0);
  const [checked,setChecked]=useState([]);
  const [structure,setStructure]=useState(false);
  const value=Number(input);
  const valid=input.trim()!==''&&Number.isInteger(value)&&value>=34&&value<=999;
  const square=total===null?[]:magicSquare(total);
  function reset(){setTotal(null);setChecked([]);setLine(0);setStructure(false);}
  return <div className="advanced-game"><h2>给十条线，同一个答案。</h2><form className="number-form" onSubmit={e=>{e.preventDefault();if(valid){setTotal(value);setLine(0);setChecked([0]);setStructure(false);}}}><label className="field-label">你指定的总和<input aria-label="指定总和" type="number" min="34" max="999" step="1" value={input} onChange={e=>setInput(e.target.value)}/></label><button className="button primary" disabled={!valid}>生成幻方</button></form>{!valid&&<p role="status">请输入 34～999 的整数。</p>}{total!==null&&<Transition id={total}><div className="round-label"><span>点击下方按钮，检查任意一条线</span><b>已验 {checked.length}/10</b></div><div className="magic-grid">{square.map((n,i)=><div key={i} className={`${MAGIC_LINES[line].indices.includes(i)?'magic-active':''} ${structure&&[0,7,9,14].includes(i)?'magic-adjusted':''}`}><b>{n}</b>{structure&&<small>{BASE_SQUARE[i]}{[0,7,9,14].includes(i)?` + ${total-34}`:''}</small>}</div>)}</div><div className="line-options">{MAGIC_LINES.map((item,i)=><button key={item.label} aria-pressed={line===i} onClick={()=>{setLine(i);setChecked([...new Set([...checked,i])]);}}>{item.label}{checked.includes(i)?' ✓':''}</button>)}</div><div className="formula" aria-live="polite">{MAGIC_LINES[line].indices.map(i=>square[i]).join(' + ')} = {total}</div><button className="button secondary" onClick={()=>setStructure(!structure)} aria-pressed={structure}>{structure?'隐藏调整结构':'拆开机关：哪些格子变了'}</button>{structure&&<div className="insight-box"><h3>基础总和 34，加上同一个差值。</h3><p>四个标记格各加 {total-34}。每行、每列和两条对角线恰好经过一个标记格，所以都从 34 变为 {total}。数字可能重复；本演示保证十条线同和，不保证 16 个数字互不相同。</p></div>}<EndActions onExplain={onExplain} onReset={reset}/></Transition>}</div>;
}
export const ADVANCED_GAMES={monty:MontyGame,equivoque:EquivoqueGame,blindness:BlindnessGame,fivecards:FiveCardsGame,kruskal:KruskalGame,blessing:BlessingGame,square:SquareGame};
