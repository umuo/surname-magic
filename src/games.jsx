import { ADVANCED_GAMES } from './advancedGames';
import { useState } from 'react';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { SURNAMES, CARDS } from './surnames';
import { BARNUM_LINES } from './tricks';
import { calendarModel, calendarSquare, collectColumn, createDeck, createSymbolRound, dealColumns } from './logic';
import { NextButton, PlayingCard, Result, Steps, Transition, useTurnLock } from './components/Common';
export function SurnameGame({
  onExplain
}) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [query, setQuery] = useState('');
  const {
    busy,
    run
  } = useTurnLock();
  const sum = answers.reduce((total, value, bit) => total + (value ? 1 << bit : 0), 0);
  if (answers.length === 7) return <><Result onExplain={onExplain} onReset={() => setAnswers([])} note={sum ? '七次选择，找到了这个字。它真的读懂了你的心吗？' : '没有匹配到姓氏。可能未收录，或某张牌看漏了。'}>{SURNAMES[sum] || '未找到'}</Result><button className="text-button" disabled={busy} onClick={() => run(() => setAnswers(answers.slice(0, -1)))}><ArrowLeft size={15} /> 返回检查上一张</button></>;
  if (!started) return <div className="game-intro"><div className="intro-glyph">姓</div><h2>先把一个姓氏，放在心里。</h2><p>目前收录 127 个单姓。可以先查一查，避免选中尚未收录的姓氏。</p><details className="surname-directory"><summary>查看 / 搜索收录的姓氏</summary><label className="search-field"><Search size={17} /><input aria-label="搜索姓氏" placeholder="输入一个姓氏" value={query} onChange={event => setQuery(event.target.value)} /></label><div className="directory-grid">{SURNAMES.filter(name => name && name.includes(query.trim())).map(name => <span key={name}>{name}</span>)}</div>{!SURNAMES.some(name => name && name.includes(query.trim())) && <p role="status">暂未收录，请换一个姓氏体验。</p>}</details><NextButton onClick={() => setStarted(true)}>记好了，开始翻牌</NextButton></div>;
  return <div className="surname-game"><div className="round-label"><span>这张牌上，有你的姓氏吗？</span><b aria-live="polite">{answers.length + 1} / 7</b></div><div className="progress-track">{CARDS.map((_, i) => <span key={i} className={i <= answers.length ? 'active' : ''} />)}</div><Transition id={answers.length} className="surname-card"><div className="card-label"><span>百家姓 · 第 {answers.length + 1} 张</span><span>仔细看，不着急</span></div><div className="surname-grid">{CARDS[answers.length].map(name => <span key={name}>{name}</span>)}</div></Transition><div className="answer-buttons"><button className="button secondary" disabled={busy} onClick={() => run(() => setAnswers([...answers, false]))}><X size={18} /> 没有</button><button className="button primary" disabled={busy} onClick={() => run(() => setAnswers([...answers, true]))}><Check size={18} /> 有我的姓氏</button></div><button className="text-button" disabled={busy || !answers.length} onClick={() => run(() => setAnswers(answers.slice(0, -1)))}><ArrowLeft size={15} /> 上一张</button></div>;
}
export function SymbolGame({
  onExplain
}) {
  const [round, setRound] = useState(() => createSymbolRound());
  const [stage, setStage] = useState('prepare');
  function reset() {
    setRound(createSymbolRound(round.target));
    setStage('prepare');
  }
  if (stage === 'result') return <Result onExplain={onExplain} onReset={reset} note="如果计算正确，心里记住的就是这个符号。你从未告诉我那个数字。">{round.target}</Result>;
  return <div>{stage === 'prepare' ? <div className="game-intro"><div className="intro-glyph">✧</div><h2>想一个 10 到 99 的整数。</h2><Steps items={['把十位和个位相加。', '用原来的数，减去刚刚得到的和。', '在下一页找到结果，默记它旁边的符号。']} /><div className="example-note">例如：47 → 4 + 7 = 11 → 47 − 11 = 36</div><NextButton onClick={() => setStage('table')}>算好了，查看符号表</NextButton></div> : <><div className="round-label"><span>找到计算结果，记住它的符号</span><b>00—99</b></div><p className="muted small">不需要点击，也不要告诉我。往下滚动可查看完整对照表。</p><div className="symbol-table">{round.table.map((symbol, number) => <div key={number}><small>{String(number).padStart(2, '0')}</small><span>{symbol}</span></div>)}</div><div className="sticky-actions"><NextButton onClick={() => setStage('result')}>记住了，揭晓符号</NextButton></div><button className="text-button" onClick={() => setStage('prepare')}><ArrowLeft size={15} /> 再看计算步骤</button></>}</div>;
}
export function CardsGame({
  onExplain
}) {
  const [history, setHistory] = useState(() => [createDeck()]);
  const {
    busy,
    run
  } = useTurnLock();
  const round = history.length - 1;
  const deck = history.at(-1);
  if (round === 3) return <><Result onExplain={onExplain} onReset={() => setHistory([createDeck()])} note="这是第 11 张牌。只要三次列数都选对，答案就会落在这里。"><PlayingCard card={deck[10]} large /></Result><button className="text-button" disabled={busy} onClick={() => run(() => setHistory(history.slice(0, -1)))}><ArrowLeft size={15} /> 返回检查第三轮</button></>;
  return <div><div className="round-label"><span>{round ? '还是同一张牌，现在在哪一列？' : '默记一张牌，只告诉我列数'}</span><b aria-live="polite">{round + 1} / 3</b></div><p className="muted small">每列从上往下看。三轮都追踪最初选定的同一张牌。</p><Transition id={round} className="playing-columns">{dealColumns(deck).map((column, index) => <div className="playing-column" key={index}><span className="column-label">第 {index + 1} 列</span>{column.map(card => <PlayingCard key={card.id} card={card} />)}<button className="button secondary" disabled={busy} onClick={() => run(() => setHistory([...history, collectColumn(deck, index)]))} aria-label={`我的牌在第 ${index + 1} 列`}>在这一列</button></div>)}</Transition><button className="text-button" disabled={busy || !round} onClick={() => run(() => setHistory(history.slice(0, -1)))}><ArrowLeft size={15} /> 上一轮</button></div>;
}
export function CalendarGame({
  onExplain
}) {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth()
    };
  });
  const [center, setCenter] = useState(null);
  const [shown, setShown] = useState(false);
  const model = calendarModel(month.year, month.month);
  const selected = center ? calendarSquare(center) : [];
  function changeMonth(delta) {
    const date = new Date(month.year, month.month + delta, 1);
    setMonth({
      year: date.getFullYear(),
      month: date.getMonth()
    });
    setCenter(null);
    setShown(false);
  }
  return <div><div className="calendar-toolbar"><button className="icon-button" onClick={() => changeMonth(-1)} aria-label="上个月"><ChevronLeft size={20} /></button><h2>{month.year} 年 {month.month + 1} 月</h2><button className="icon-button" onClick={() => changeMonth(1)} aria-label="下个月"><ChevronRight size={20} /></button></div><p className="muted small">点击带圆点的日期，选定九宫格中心。灰色日期不能作为中心。</p><div className="calendar-grid">{['一', '二', '三', '四', '五', '六', '日'].map(day => <span className="weekday" key={day}>{day}</span>)}{model.cells.map((day, index) => day ? <button key={index} disabled={!model.centers.includes(day)} className={`${selected.includes(day) ? 'selected-date' : ''} ${center === day ? 'center-date' : ''}`} aria-label={`${day} 日${model.centers.includes(day) ? '，可选为中心' : ''}`} aria-pressed={center === day} onClick={() => {
        setCenter(day);
        setShown(false);
      }}>{day}{model.centers.includes(day) && <i />}</button> : <span key={index} />)}</div>{shown ? <Transition className="calendar-answer"><span>这九个日期的总和是</span><strong aria-live="polite">{center * 9}</strong><p>{selected.join(' + ')} = {center * 9}</p><button className="button primary" onClick={onExplain}>一眼看出总和的秘密</button></Transition> : <div className="calendar-answer"><p aria-live="polite">{center ? `已框选以 ${center} 日为中心的 9 个日期。` : '先选一个九宫格，再见证“秒算”。'}</p><NextButton disabled={!center} onClick={() => setShown(true)}>揭晓总和</NextButton></div>}</div>;
}
export function BarnumGame({
  onExplain
}) {
  const [rating, setRating] = useState(null);
  const [revealed, setRevealed] = useState(false);
  return <div><div className="reading-sheet"><div className="eyebrow">一段看似为你写下的解读</div><h2>关于你，和没说出口的自己。</h2>{BARNUM_LINES.map(line => <p key={line.label}>{line.text}</p>)}<span className="reading-signature">—— 一位“很懂你”的解读者</span></div>{!revealed ? <div className="rating-panel"><h3>你觉得有多像自己？</h3><div className="rating-buttons" role="group" aria-label="描述准确度评分">{[1, 2, 3, 4, 5].map(value => <button key={value} aria-pressed={rating === value} onClick={() => setRating(value)}>{value}</button>)}</div><div className="rating-labels"><span>完全不像</span><span>非常像</span></div><NextButton disabled={!rating} onClick={() => setRevealed(true)}>提交感受，看看真相</NextButton></div> : <Transition className="insight-box"><div className="eyebrow">你给了 {rating} / 5 分</div><h2>每个人，看到的都是同一段话。</h2><p>{rating >= 4 ? '觉得贴切很正常。广泛适用的描述，也能让人联想到自己的具体经历。' : '你没有觉得特别准确，这同样正常。巴纳姆效应描述一种倾向，不代表每个人都会接受。'} 这里没有分析你的生日、经历或个人资料。</p><button className="button primary" onClick={onExplain}>逐句拆解这段话</button></Transition>}</div>;
}
export function PredictionGame({
  onExplain
}) {
  const [stage, setStage] = useState('intro');
  const [color, setColor] = useState('');
  const [tool, setTool] = useState('');
  const [matched, setMatched] = useState(null);
  function reset() {
    setStage('intro');
    setColor('');
    setTool('');
    setMatched(null);
  }
  if (stage === 'intro') return <div className="game-intro"><div className="sealed-note"><span>一张提前写好的纸条</span><b>？</b><small>先选择 · 后揭晓</small></div><h2>跟随直觉，别想太久。</h2><p>接下来会有两个小问题。写下脑海里最先出现的答案，不需要任何个人信息。</p><NextButton onClick={() => setStage('color')}>开始直觉实验</NextButton></div>;
  if (stage === 'color' || stage === 'tool') return <Transition id={stage} className="choice-stage"><div className="eyebrow">问题 {stage === 'color' ? '01 / 02' : '02 / 02'}</div><h2>{stage === 'color' ? '想一种颜色。' : '想一件工具。'}</h2><p>{stage === 'color' ? '除了黑色和白色，脑海里第一个出现的是什么？' : '随便什么工具，写下你的第一反应。'}</p><form onSubmit={event => {
      event.preventDefault();
      if ((stage === 'color' ? color : tool).trim()) setStage(stage === 'color' ? 'tool' : 'result');
    }}><input key={stage} aria-label={stage === 'color' ? '你想到的颜色' : '你想到的工具'} placeholder={stage === 'color' ? '写下颜色' : '写下工具'} value={stage === 'color' ? color : tool} onChange={event => stage === 'color' ? setColor(event.target.value) : setTool(event.target.value)} maxLength={30} autoComplete="off" required /><NextButton disabled={!(stage === 'color' ? color : tool).trim()} type="submit">{stage === 'color' ? '下一题' : '打开纸条'}</NextButton></form></Transition>;
  return <div className="prediction-result"><div className="eyebrow">纸条上始终写着</div><div className="hammer-illustration" aria-hidden="true"><i /><b /></div><h2>红色的锤子</h2><p>你的答案：<strong>{color} · {tool}</strong></p><p className="muted">它并未根据你的输入改变。两个答案都猜中了吗？</p><div className="action-row"><button className={`button ${matched === true ? 'primary' : 'secondary'}`} aria-pressed={matched === true} onClick={() => setMatched(true)}>都猜中了</button><button className={`button ${matched === false ? 'primary' : 'secondary'}`} aria-pressed={matched === false} onClick={() => setMatched(false)}>没有全中</button></div>{matched !== null && <div className="insight-box" role="status"><h3>{matched ? '一次命中，不等于拥有读心能力。' : '没猜中，正好看清它的边界。'}</h3><p>这只是提前选定的一个常见组合，不是必然结果。不能仅凭一次体验断定“潜意识被控制”，也不能宣称“绝大多数人都会选它”。</p><button className="button primary" onClick={onExplain}>了解概率与选择</button><button className="text-button" onClick={reset}>重新体验</button></div>}</div>;
}
export const GAMES = {
  ...ADVANCED_GAMES,
  surname: SurnameGame,
  symbols: SymbolGame,
  cards: CardsGame,
  calendar: CalendarGame,
  barnum: BarnumGame,
  prediction: PredictionGame
};
