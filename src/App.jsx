import { useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Check, Clock3, Eye, Grid2X2, Sparkles } from 'lucide-react';
import { TRICKS, CATEGORIES } from './tricks';
import { GAMES } from './games';
import Explanation from './Explanations';
function readRoute() {
  const [id, mode] = window.location.hash.slice(1).split('/');
  return {
    id: TRICKS.some(trick => trick.id === id) ? id : null,
    mode: mode === 'explain' ? 'explain' : 'play',
    anchor: ['about', 'experiences'].includes(id) ? id : null
  };
}
function Artwork({
  id,
  hero = false
}) {
  return <div className={`exhibit-art art-${id} ${hero ? 'hero-art' : ''}`} aria-hidden="true">
    {id === 'surname' && <div className="surname-art"><span>赵 钱 孙 李<br />周 吴 郑 王<br />冯 陈 褚 卫</span><b>姓</b></div>}
    {id === 'symbols' && <div className="symbols-art"><span>☽</span><span>✧</span><span>◇</span><span>✿</span><b>9</b><span>♠</span></div>}
    {id === 'cards' && <div className="cards-art"><i>7<small>♣</small></i><i>A<small>♥</small></i><i>3<small>♠</small></i></div>}
    {id === 'calendar' && <div className="calendar-art"><span>MON · TUE · WED</span><div>{[7, 8, 9, 14, 15, 16, 21, 22, 23].map(n => <b key={n}>{n}</b>)}</div></div>}
    {id === 'barnum' && <div className="barnum-art"><span>“</span><p>你有时热爱人群，<br />有时更享受独处。</p><i>这，说的不就是我吗？</i></div>}
    {id === 'prediction' && <div className="prediction-art"><div className="hammer-illustration"><i /><b /></div><span>一个早已写好的答案。</span></div>}

    {id === 'equivoque' && <div className="advanced-art force-art"><span>扇</span><b>◉</b><span>印</span><small>每条路，都指向同一个答案</small></div>}
    {id === 'blindness' && <div className="advanced-art blind-art"><i>◉</i><span>⇄</span><i>◇</i><small>选择与记忆之间</small></div>}
    {id === 'fivecards' && <div className="cards-art"><i>4<small>♦</small></i><i>？<small>？</small></i><i>A<small>♣</small></i></div>}
    {id === 'kruskal' && <div className="advanced-art route-art"><span>↘</span><b>∞</b><span>↙</span><small>不同起点 · 可能相同的终点</small></div>}
    {id === 'blessing' && <div className="advanced-art story-art"><b>局</b><small>看清来路，识破迷局</small></div>}
    {id === 'square' && <div className="calendar-art"><span>EVERY LINE · SAME SUM</span><div>{[16,2,3,5,11,10,9,7,6].map(n=><b key={n}>{n}</b>)}</div></div>}
    {id === 'monty' && <div className="advanced-art monty-art"><i>壹</i><i>空</i><i>叁</i><small>留下，还是换一扇？</small></div>}
    <span className="art-index">{TRICKS.find(trick => trick.id === id)?.number} / {TRICKS.length} 则奇谈</span>
  </div>;
}
function Home({
  visited
}) {
  const [filter, setFilter] = useState('all');
  const displayed = TRICKS.filter(trick => filter === 'all' || trick.category === filter);
  return <>
    <section className="home-hero"><div className="hero-copy"><div className="eyebrow"><span className="tiny-square" /> 民俗骗术揭秘 · 互动档案馆</div><h1>神机妙算？<br />不过<span>有迹可循。</span></h1><p>那些让人啧啧称奇的“读心”与“神算”，<br className="desktop-break" />藏着数学的规律，也藏着心理的盲点。</p><div className="hero-actions"><a className="button primary" href="#surname">从猜姓氏开始 <ArrowRight size={17} /></a><a className="text-button" href="#experiences">浏览全部 <ArrowDown size={16} /></a></div><div className="hero-note"><span>先亲自体验</span><i /> <span>再拆开机关</span><i /> <span>把惊奇留给求知</span></div></div><div className="hero-display"><div className="hero-orbit" /><div className="display-paper"><span className="paper-top">民 间 奇 术 · 解 密 手 记</span><div className="hero-cards"><i>相<small>识人</small></i><i>数<small>知数</small></i><i>姓<small>读心</small></i></div><div className="paper-bottom"><span>看似玄妙，皆有来处。</span><b>破<br />相</b></div></div><span className="margin-note">不止看热闹，更要看门道。</span></div></section>
    <div className="museum-strip"><div><BookOpen size={18} /><span><b>{String(TRICKS.length).padStart(2, '0')}</b> 则互动档案</span></div><div><Grid2X2 size={18} /><span><b>{String(Object.keys(CATEGORIES).length).padStart(2, '0')}</b> 类探索主题</span></div><div><Eye size={18} /><span>体验之后，真相公开</span></div></div>
    <section className="exhibits" id="experiences"><div className="collection-header"><div><div className="eyebrow">THE COLLECTION</div><h2>选一则奇谈，亲自试试。</h2></div><div className="filter-tabs" role="group" aria-label="筛选体验">{[['all', '全部', String(TRICKS.length)], ...Object.entries(CATEGORIES).map(([id, label]) => [id, label, String(TRICKS.filter(item => item.category === id).length).padStart(2, '0')])].map(([id, label, count]) => <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}<small>{count}</small></button>)}</div></div><div className="exhibit-grid">{displayed.map(trick => <a className={`exhibit-card theme-${trick.theme}`} href={`#${trick.id}`} key={trick.id}><Artwork id={trick.id} /><div className="exhibit-content"><div className="exhibit-meta"><span>{CATEGORIES[trick.category]} / {trick.principle}</span>{visited.includes(trick.id) && <span className="read-badge"><Check size={11} /> 已揭秘</span>}</div><h3>{trick.title}</h3><p>{trick.description}</p><div className="exhibit-bottom"><span><Clock3 size={13} /> {trick.time}</span><b>进入体验 <ArrowRight size={16} /></b></div></div></a>)}</div>{displayed.length > 0 && <p className="collection-count" role="status">{filter === 'all' ? '全部' : CATEGORIES[filter]} · {displayed.length} 则档案</p>}</section>
    <section className="about-note" id="about"><span className="about-seal">求<br />真</span><div><div className="eyebrow">关于这间小馆</div><h2>保留好奇，也保留一点怀疑。</h2><p>民俗值得了解，把戏值得欣赏。但当表演被包装成超能力、用来骗取信任时，知道原理就是多一分判断力。本站以互动演示拆解常见套路，不把民俗文化与欺诈画等号。</p></div><span className="about-flower" aria-hidden="true">✳</span></section>
  </>;
}
export default function App() {
  const [route, setRoute] = useState(readRoute);
  const [visited, setVisited] = useState(() => {
    try {
      const value = JSON.parse(localStorage.getItem('folk-museum-read') || '[]');
      return Array.isArray(value) ? value.filter(id => TRICKS.some(t => t.id === id)) : [];
    } catch {
      return [];
    }
  });
  const [attempt, setAttempt] = useState(0);
  const heading = useRef(null);
  const previousRoute = useRef(route);
  const trick = TRICKS.find(item => item.id === route.id);
  useEffect(() => {
    const handle = () => setRoute(readRoute());
    window.addEventListener('hashchange', handle);
    return () => window.removeEventListener('hashchange', handle);
  }, []);
  useEffect(() => {
    document.title = trick ? `${trick.subtitle} · 破相民俗骗术揭秘` : '破相 · 民俗骗术揭秘互动馆';
    if (!route.id && route.anchor) document.getElementById(route.anchor)?.scrollIntoView({
      behavior: 'instant'
    });
    else window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
    heading.current?.focus({
      preventScroll: true
    });
  }, [route.id, route.anchor]);
  useEffect(() => {
    if (route.id && route.mode === 'explain') setVisited(previous => {
      if (previous.includes(route.id)) return previous;
      const next = [...previous, route.id];
      try {
        localStorage.setItem('folk-museum-read', JSON.stringify(next));
      } catch {/* Reading progress is optional. */}
      return next;
    });
  }, [route.id, route.mode]);
  useEffect(() => {
    if (previousRoute.current.id === route.id && previousRoute.current.mode !== route.mode) {
      document.querySelector('.experience-tabs')?.scrollIntoView({
        block: 'start',
        behavior: 'instant'
      });
      document.getElementById(route.mode === 'explain' ? 'explain-tab' : 'play-tab')?.focus({
        preventScroll: true
      });
    }
    previousRoute.current = route;
  }, [route]);
  function explain() {
    window.location.hash = `${route.id}/explain`;
  }
  const Game = trick ? GAMES[trick.id] : null;
  return <MotionConfig reducedMotion="user"><div className="museum-app"><a className="skip-link" href="#main-content" onClick={event => {
        event.preventDefault();
        document.getElementById('main-content').focus();
      }}>跳转到主要内容</a><header className="site-header"><a className="brand" href="#" aria-label="破相，返回首页"><span className="brand-seal">破相</span><span>民俗骗术揭秘<small>BEHIND THE MYSTERY</small></span></a><nav aria-label="主导航"><a className={!trick ? 'active' : ''} href="#">互动馆</a><a href="#about">关于</a><span className="nav-note">好奇入场，清醒离场 <Sparkles size={13} /></span></nav></header><main id="main-content" tabIndex={-1}>
      {!trick ? <Home visited={visited} /> : <div className="detail-page"><a className="back-link" href="#"><ArrowLeft size={16} /> 返回互动馆</a><div className="detail-heading"><div className="eyebrow">档案 {trick.number} / {CATEGORIES[trick.category]}</div><h1 ref={heading} tabIndex={-1}>{trick.subtitle}</h1><p>{trick.intro}</p></div><div className="detail-layout"><div className="interactive-panel"><div className="experience-tabs" role="tablist" aria-label="体验与揭秘"><button role="tab" id="play-tab" aria-selected={route.mode === 'play'} aria-controls="play-panel" tabIndex={route.mode === 'play' ? 0 : -1} onKeyDown={event => {
                  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
                    event.preventDefault();
                    explain();
                    document.getElementById('explain-tab').focus();
                  }
                }} onClick={() => {
                  window.location.hash = trick.id;
                }}><Eye size={17} /> 亲自体验</button><button role="tab" id="explain-tab" aria-selected={route.mode === 'explain'} aria-controls="explain-panel" tabIndex={route.mode === 'explain' ? 0 : -1} onKeyDown={event => {
                  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
                    event.preventDefault();
                    window.location.hash = trick.id;
                    document.getElementById('play-tab').focus();
                  }
                }} onClick={explain}><BookOpen size={17} /> 揭开原理</button></div><div id="play-panel" role="tabpanel" aria-labelledby="play-tab" hidden={route.mode !== 'play'} className="panel-body"><Game key={`${trick.id}-${attempt}`} onExplain={explain} /></div><div id="explain-panel" role="tabpanel" aria-labelledby="explain-tab" hidden={route.mode !== 'explain'} className="panel-body"><Explanation key={trick.id} id={trick.id} /></div></div><aside className="detail-sidebar"><div className={`sidebar-art theme-${trick.theme}`}><Artwork id={trick.id} /></div><div className="sidebar-text"><span className="eyebrow">观展提示</span><h2>{trick.category === 'story' ? '先暂停，再独立核实。' : trick.category === 'math' ? '答案可验证，神秘可拆解。' : '察觉与否，都值得回看。'}</h2><p>{trick.category === 'story' ? '场景根据公开警示改编。随时停止接触也是有效选择；结尾可以回看信息如何流转。' : trick.category === 'math' ? '先完成体验，再打开原理。所有“神机妙算”，都有成立的条件。' : '这是一段互动演示，不是心理诊断。个体反应不同，也没有虚构的命中率。'}</p><span className="time-note"><Clock3 size={14} /> {trick.time}</span><button className="text-button" onClick={() => {
                  setAttempt(n => n + 1);
                  window.location.hash = trick.id;
                }}>重新开始本项 <ArrowRight size={15} /></button></div><div className="next-exhibit"><small>继续逛逛</small><a href={`#${TRICKS[(TRICKS.indexOf(trick) + 1) % TRICKS.length].id}`}>{TRICKS[(TRICKS.indexOf(trick) + 1) % TRICKS.length].subtitle}<ArrowRight size={17} /></a></div></aside></div></div>}
    </main><footer className="site-footer"><span><b>破相</b> 看见表象之后的原理。</span><span>数学有规律，人心有差异。</span></footer></div></MotionConfig>;
}
