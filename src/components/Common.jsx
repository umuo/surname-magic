import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen, RotateCcw } from 'lucide-react';
export function useTurnLock() {
  const locked = useRef(false);
  const timer = useRef(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  function run(callback) {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    callback();
    timer.current = setTimeout(() => {
      locked.current = false;
      setBusy(false);
    }, 400);
  }
  return {
    busy,
    run
  };
}
export function Transition({
  children,
  id,
  className = ''
}) {
  const reduced = useReducedMotion();
  return <motion.div key={id} className={className} initial={{
    opacity: 0,
    y: reduced ? 0 : 9
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: reduced ? 0 : .28
  }}>{children}</motion.div>;
}
export function Result({
  label = '答案揭晓',
  children,
  note,
  onReset,
  onExplain
}) {
  return <Transition className="result-panel"><div className="eyebrow">{label}</div><div className="result-value" aria-live="polite">{children}</div>{note && <p>{note}</p>}<div className="action-row"><button className="button primary" onClick={onExplain}><BookOpen size={17} /> 揭开原理</button><button className="button secondary" onClick={onReset}><RotateCcw size={16} /> 再试一次</button></div></Transition>;
}
export function Steps({
  items
}) {
  return <ol className="steps">{items.map((text, index) => <li key={index}><span>{index + 1}</span><p>{text}</p></li>)}</ol>;
}
export function NextButton({
  children,
  ...props
}) {
  return <button className="button primary" {...props}>{children}<ArrowRight size={17} /></button>;
}
export function PlayingCard({
  card,
  large = false
}) {
  return <div className={`playing-card ${['♥', '♦'].includes(card.suit) ? 'red-suit' : ''} ${large ? 'large-card' : ''}`} aria-label={`${card.suit}${card.rank}`}><span>{card.rank}<small>{card.suit}</small></span><b aria-hidden="true">{card.suit}</b></div>;
}
