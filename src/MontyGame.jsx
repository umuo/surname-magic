import { useRef, useState } from 'react';
import { Transition } from './components/Common';
import { openEmptyDoor, otherDoor, simulateDoors } from './montyLogic';

const freshRound = () => ({ prize: Math.floor(Math.random() * 3), selected: null, opened: null, final: null });
export default function MontyGame({ onExplain }) {
  const [round, setRound] = useState(freshRound);
  const [history, setHistory] = useState([]);
  const [simulation, setSimulation] = useState({ total: 0, stay: 0, swap: 0 });
  const settled = useRef(false);
  const finished = round.final !== null;
  function choose(selected) {
    setRound(current => current.selected !== null ? current : { ...current, selected, opened: openEmptyDoor(current.prize, selected) });
  }
  function settle(switchDoor) {
    if (settled.current || round.selected === null) return;
    settled.current = true;
    const final = switchDoor ? otherDoor(round.selected, round.opened) : round.selected;
    setRound({ ...round, final });
    setHistory(items => [...items, { switched: switchDoor, won: final === round.prize }]);
  }
  function next() { settled.current = false; setRound(freshRound()); }
  function simulate() {
    const batch = simulateDoors(1000);
    setSimulation(current => ({ total: current.total + batch.total, stay: current.stay + batch.stay, swap: current.swap + batch.swap }));
  }
  return <div className="advanced-game monty-game">
    <div className="sealed-banner"><span>规则先公开 · 奖品开局已固定</span><b>主持人知道答案，每局必开一扇未选的空门，并提供换门机会。</b></div>
    <h2>{finished ? (round.final === round.prize ? '这次，你找到了宝物。' : '这次，与宝物擦肩而过。') : round.selected === null ? '三扇门，一件宝物。先选一扇。' : '空门已揭开：坚持，还是换门？'}</h2>
    <div className="monty-doors">{[0, 1, 2].map(door => {
      const revealed = finished || door === round.opened;
      return <button key={door} className={`monty-door ${revealed ? 'is-open' : ''} ${door === round.selected ? 'is-picked' : ''} ${finished && door === round.prize ? 'has-prize' : ''}`} disabled={round.selected !== null} onClick={() => choose(door)} aria-label={`${door + 1}号门${revealed ? door === round.prize ? '，宝物' : '，空门' : ''}${door === round.selected ? '，最初选择' : ''}`}>
        <span>{door + 1} 号门</span><b aria-hidden="true">{revealed ? door === round.prize ? '宝' : '空' : '？'}</b><small>{finished && door === round.final ? '最终选择' : door === round.selected ? '最初选择' : door === round.opened ? '主持人打开' : revealed ? '答案公开' : round.selected !== null ? '待揭晓' : '点击选择'}</small>
      </button>;
    })}</div>
    {round.selected !== null && !finished && <div className="action-row"><button className="button secondary" onClick={() => settle(false)}>坚持 {round.selected + 1} 号门</button><button className="button primary" onClick={() => settle(true)}>换到 {otherDoor(round.selected, round.opened) + 1} 号门</button></div>}
    {finished && <Transition><p role="status">你最初选了 {round.selected + 1} 号门，主持人打开 {round.opened + 1} 号空门。宝物一直在 {round.prize + 1} 号门后，过程中没有移动。</p><div className="action-row"><button className="button primary" onClick={next}>再来一局</button><button className="button secondary" onClick={onExplain}>揭开原理</button></div></Transition>}
    {history.length > 0 && <div className="monty-history"><h3>你的实战记录 · {history.length} 局</h3><p>找到宝物 {history.filter(item => item.won).length} 次。单局输赢不能证明哪种策略更好。</p><div aria-label="最近十局">{history.slice(-10).map((item, index) => <span key={index}>{item.switched ? '换门' : '坚持'} · {item.won ? '中' : '空'}</span>)}</div></div>}
    <section className="monty-lab"><div className="eyebrow">概率实验室</div><h3>让两种策略，面对同样的局面。</h3><p>每次随机生成 1,000 局，对每局同时计算坚持与换门的结果。模拟独立于上方实战，不更改当前宝物。</p><button className="button secondary" onClick={simulate}>模拟 1,000 局</button>
      {simulation.total > 0 && <div aria-live="polite"><p>已模拟 {simulation.total.toLocaleString()} 局 · 随机结果会波动</p>{[['stay', '坚持原选'], ['swap', '总是换门']].map(([key, label]) => <div className="monty-stat" key={key}><div><span>{label}</span><b>{simulation[key].toLocaleString()} 次 · {(simulation[key] / simulation.total * 100).toFixed(1)}%</b></div><meter min="0" max={simulation.total} value={simulation[key]} aria-label={`${label}获奖比例`} /></div>)}<button className="text-button" onClick={() => setSimulation({ total: 0, stay: 0, swap: 0 })}>清空模拟记录</button></div>}
    </section>
  </div>;
}
