import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, RotateCcw, Check, X, Search, MoveUpRight, Eye, Layers, Wand2 } from 'lucide-react';
import { SURNAMES, TOTAL_CARDS, CARDS } from './surnames';

const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: 0.25 } };

function CardBack({ className = '' }) {
  return <div className={`card-back ${className}`} aria-hidden="true">
    <span className="card-corner">✧</span><span className="card-corner bottom">✧</span>
    <div className="card-emblem"><div className="emblem-orbit" /><Sparkles strokeWidth={1} /><span>百家姓</span><small>SURNAME MAGIC</small></div>
  </div>;
}

export default function App() {
  const [step, setStep] = useState('intro');
  const [answers, setAnswers] = useState([]);
  const [busy, setBusy] = useState(false);
  const [directory, setDirectory] = useState(false);
  const [query, setQuery] = useState('');
  const dialogRef = useRef(null);
  const headingRef = useRef(null);
  const locked = useRef(false);
  const reduceMotion = useReducedMotion();
  const cardIndex = answers.length;
  const sum = answers.reduce((total, answer, index) => total + (answer ? 1 << index : 0), 0);
  const result = SURNAMES[sum];

  useEffect(() => {
    if (!busy) return;
    const timer = setTimeout(() => { locked.current = false; setBusy(false); }, reduceMotion ? 120 : 650);
    return () => clearTimeout(timer);
  }, [busy, reduceMotion]);
  useEffect(() => {
    if (directory) { dialogRef.current.showModal(); document.body.style.overflow = 'hidden'; }
    else { dialogRef.current.close(); document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [directory]);

  function start() { locked.current = false; setBusy(false); setAnswers([]); setStep('playing'); }
  function answer(value) {
    if (locked.current) return;
    locked.current = true; setBusy(true);
    setAnswers(previous => [...previous, value]);
    if (cardIndex === TOTAL_CARDS - 1) setStep('result');
  }
  function back() {
    if (locked.current) return;
    locked.current = true; setBusy(true);
    setAnswers(previous => previous.slice(0, -1));
    setStep('playing');
  }

  return <MotionConfig reducedMotion="user"><div className={`app-shell step-${step}`}>
    <div className="ambient" aria-hidden="true" />
    <header className="site-header">
      <button className="brand" onClick={() => setStep('intro')} aria-label="返回首页"><span className="brand-symbol"><Sparkles size={20} /></span><span>姓氏秘语<small>SURNAME MAGIC</small></span></button>
      <button className="text-button directory-trigger" onClick={() => setDirectory(true)}>收录的姓氏 <MoveUpRight size={15} /></button>
    </header>
    <main className={`main-content ${step === 'intro' ? 'intro-main' : ''}`}>
      <AnimatePresence mode="wait">
        {step === 'intro' && <motion.section key="intro" {...fade} className="intro-layout">
          <div className="intro-copy">
            <div className="eyebrow"><span /> 一场关于你的微小魔术</div>
            <h1>你的姓氏，<br />藏在<span className="gold-text">第七张牌</span>之后。</h1>
            <p className="intro-description">不用说出口，也不必输入。<br />只需在心里默念，让七张卡牌读懂你的秘密。</p>
            <button className="button primary start-button" onClick={start}>开启读心之旅 <ArrowRight size={19} /></button>
            <div className="intro-meta"><span>7 张卡牌</span><i /> <span>约 1 分钟</span><i /><span>无需输入姓名</span></div>
          </div>
          <div className="intro-art"><div className="stage-ring ring-one" /><div className="stage-ring ring-two" /><span className="stage-star star-one">✧</span><span className="stage-star star-two">✦</span><span className="stage-star star-three">✧</span><div className="card-fan"><CardBack className="fan-left" /><CardBack className="fan-right" /><CardBack className="fan-front" /></div><div className="art-caption"><span /> THE ANSWER IS ALREADY IN YOUR MIND <span /></div></div>
          <div className="how-it-works">
            {[{ icon: Eye, title: '默念一个姓氏', text: '你的，或心里那个 TA 的。' }, { icon: Layers, title: '看牌，回答有或没有', text: '慢慢找，每一次选择都算数。' }, { icon: Wand2, title: '见证答案揭晓', text: '七次选择后，秘密即将浮现。' }].map(({ icon: Icon, title, text }, index) => <div className="instruction" key={title}><span className="instruction-icon"><Icon size={20} strokeWidth={1.5} /></span><div><small>0{index + 1}</small><h2>{title}</h2><p>{text}</p></div></div>)}
          </div>
        </motion.section>}
        {step === 'playing' && <motion.section key="playing" {...fade} onAnimationComplete={() => headingRef.current?.focus({ preventScroll: true })} className="game-layout">
          <div className="section-heading"><div className="eyebrow">FOLLOW YOUR INTUITION</div><h1 ref={headingRef} tabIndex={-1}>这张牌上，有你的姓氏吗？</h1><p>仔细看一看，只需告诉我「有」或「没有」。</p></div>
          <div className="game-stage">
            <div className="progress-label"><span>寻找心里的那个字</span><span aria-live="polite"><b>{String(Math.min(cardIndex + 1, 7)).padStart(2, '0')}</b> / 07</span></div>
            <div className="progress-track" aria-label={`第 ${cardIndex + 1} 张，共 7 张`}>{CARDS.map((_, i) => <span key={i} className={i < cardIndex ? 'complete' : i === cardIndex ? 'current' : ''} />)}</div>
            <div className="card-perspective"><AnimatePresence mode="wait"><motion.div key={cardIndex} initial={{ opacity: 0, rotateY: reduceMotion ? 0 : -30, y: 8 }} animate={{ opacity: 1, rotateY: 0, y: 0 }} exit={{ opacity: 0, rotateY: reduceMotion ? 0 : 30, y: -8 }} transition={{ duration: reduceMotion ? 0 : 0.24 }} className="surname-card">
              <div className="card-label"><span>姓氏秘语</span><Sparkles size={16} /><span>NO. {String(cardIndex + 1).padStart(2, '0')}</span></div>
              <div className="surname-grid">{CARDS[cardIndex]?.map(name => <span key={name}>{name}</span>)}</div>
              <div className="card-footnote"><span /> 心有所念 · 牌有所应 <span /></div>
            </motion.div></AnimatePresence></div>
            <div className="answer-buttons"><button className="button secondary" onClick={() => answer(false)} disabled={busy}><X size={19} /> 没有我的姓氏</button><button className="button primary" onClick={() => answer(true)} disabled={busy}><Check size={19} /> 有我的姓氏</button></div>
            <div className="game-bottom"><button className="text-button" onClick={back} disabled={busy || !cardIndex}><ArrowLeft size={15} /> 上一张</button><span>不着急，魔术会等你。</span></div>
          </div>
        </motion.section>}
        {step === 'result' && <motion.section key="result" {...fade} onAnimationComplete={() => headingRef.current?.focus({ preventScroll: true })} className="result-layout">
          <div className="section-heading"><div className="eyebrow">THE MOMENT OF REVELATION</div><h1 ref={headingRef} tabIndex={-1}>{result ? '心里的秘密，终于相见。' : '这次，秘密还没有揭晓。'}</h1><p>{result ? '七张牌，七次心意，指向同一个答案。' : '可能未收录这个姓氏，也可能有一张牌看漏了。'}</p></div>
          <motion.div className="reveal-card" initial={{ opacity: 0, rotateY: reduceMotion ? 0 : -80 }} animate={{ opacity: 1, rotateY: 0 }} transition={{ duration: 0.7, delay: 0.15 }}><Sparkles size={23} strokeWidth={1.2} /><span>{result ? '你默念的姓氏是' : '未找到对应姓氏'}</span><strong>{result || '？'}</strong><small>{result ? '一字为姓，万千故事。' : '再试一次，让心意更清晰。'}</small><div className="reveal-seal">姓氏秘语</div></motion.div>
          <button className="button primary replay-button" onClick={start}><RotateCcw size={18} /> 再体验一次</button><button className="text-button" onClick={back} disabled={busy}><ArrowLeft size={15} /> 返回检查上一张</button>
        </motion.section>}
      </AnimatePresence>
    </main>
    <footer className="site-footer"><span>一点好奇，一点不可思议。</span><span>127 个姓氏 · 7 次心意</span></footer>
    <dialog ref={dialogRef} className="directory-dialog" onCancel={() => setDirectory(false)} onClick={event => { if (event.target === dialogRef.current) setDirectory(false); }} aria-labelledby="directory-title"><div className="dialog-inner"><div className="dialog-heading"><div><div className="eyebrow">THE COLLECTION</div><h2 id="directory-title">找到你的姓氏</h2></div><button className="icon-button" onClick={() => setDirectory(false)} aria-label="关闭姓氏列表"><X size={22} /></button></div><p>目前收录 127 个姓氏。开始前，确认心里的姓氏在这里。</p><label className="search-field"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="输入姓氏查找" aria-label="搜索收录的姓氏" /></label><div className="directory-grid">{SURNAMES.filter(name => name && name.includes(query.trim())).map(name => <span key={name}>{name}</span>)}</div>{!SURNAMES.some(name => name && name.includes(query.trim())) && <p className="empty-state">还没有收录这个姓氏，试试另一个吧。</p>}</div></dialog>
  </div></MotionConfig>;
}
