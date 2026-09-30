export const SUITS = ['♣', '♦', '♥', '♠'];
export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const PERMUTATIONS = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
export function fullDeck() { return SUITS.flatMap((suit, s) => RANKS.map((rank, r) => ({ id: `${suit}${rank}`, suit, rank, value: r + 1, order: s * 13 + r }))); }
export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export function encodeFive(cards) {
  if (cards.length !== 5 || new Set(cards.map(card => card.id)).size !== 5) throw new Error('需要五张不同的牌');
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
    if (cards[i].suit !== cards[j].suit) continue;
    let base = cards[i], hidden = cards[j];
    let distance = (hidden.value - base.value + 13) % 13;
    if (distance > 6) { [base, hidden] = [hidden, base]; distance = 13 - distance; }
    const rest = cards.filter(card => card.id !== base.id && card.id !== hidden.id).sort((a,b) => a.order - b.order);
    return { base, hidden, distance, rest, shown: [base, ...PERMUTATIONS[distance - 1].map(i => rest[i])] };
  }
  throw new Error('牌组无效');
}
export function decodeFour(shown) {
  const [base, ...rest] = shown;
  const sorted = [...rest].sort((a,b) => a.order - b.order);
  const order = rest.map(card => sorted.findIndex(item => item.id === card.id));
  const distance = PERMUTATIONS.findIndex(p => p.every((value, i) => value === order[i])) + 1;
  if (!base || rest.length !== 3 || !distance) throw new Error('需要四张编码牌');
  return fullDeck().find(card => card.suit === base.suit && card.value === (base.value - 1 + distance) % 13 + 1);
}
export function forceChoice(remaining, selected, target = '铜钱') {
  const keepSelected = selected.includes(target);
  return { chosen: [...selected], kept: remaining.filter(item => keepSelected ? selected.includes(item) : !selected.includes(item)), rule: keepSelected ? '保留你选中的' : '排除你选中的' };
}
export function kruskalPath(deck, start) {
  const path = [];
  let current = start;
  while (current < deck.length) { path.push(current); const value = deck[current].value; current += value > 10 ? 5 : value; }
  return path;
}
// A standard 4x4 square. Each row, column and main diagonal contains
// exactly one adjustable cell (a transversal), keeping all sums equal.
export const BASE_SQUARE = [16,2,3,13, 5,11,10,8, 9,7,6,12, 4,14,15,1];
export function magicSquare(total) {
  if (!Number.isInteger(total) || total < 34 || total > 999) throw new Error('请输入 34～999 的整数');
  return BASE_SQUARE.map((value, index) => value + ([0, 7, 9, 14].includes(index) ? total - 34 : 0));
}
export const MAGIC_LINES = [
  ...Array.from({length:4},(_,r)=>({ label:`第 ${r+1} 行`, indices:[0,1,2,3].map(c=>r*4+c) })),
  ...Array.from({length:4},(_,c)=>({ label:`第 ${c+1} 列`, indices:[0,1,2,3].map(r=>r*4+c) })),
  {label:'左上至右下',indices:[0,5,10,15]}, {label:'右上至左下',indices:[3,6,9,12]}
];
