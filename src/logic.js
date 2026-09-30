export const SYMBOLS = ['✦', '☽', '♣', '◇', '☀', '♠', '✿', '△', '♡', '✧', '☂', '♜'];
export function createSymbolRound(previous = null, random = Math.random) {
  const choices = SYMBOLS.filter(symbol => symbol !== previous);
  const target = choices[Math.floor(random() * choices.length)];
  const table = Array.from({
    length: 100
  }, (_, number) => number >= 9 && number <= 81 && number % 9 === 0 ? target : SYMBOLS[Math.floor(random() * SYMBOLS.length)]);
  return {
    target,
    table
  };
}
export function createDeck(random = Math.random) {
  const deck = ['♠', '♥', '♣'].flatMap(suit => ['A', '2', '3', '4', '5', '6', '7'].map(rank => ({
    id: `${suit}${rank}`,
    suit,
    rank
  })));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
export function dealColumns(deck) {
  return [0, 1, 2].map(column => deck.filter((_, index) => index % 3 === column));
}
export function collectColumn(deck, selected) {
  const columns = dealColumns(deck);
  const others = [0, 1, 2].filter(column => column !== selected);
  return [...columns[others[0]], ...columns[selected], ...columns[others[1]]];
}
export function calendarModel(year, month) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({
    length: Math.ceil((offset + days) / 7) * 7
  }, (_, i) => i >= offset && i < offset + days ? i - offset + 1 : null);
  const centers = cells.filter(day => day && (offset + day - 1) % 7 >= 1 && (offset + day - 1) % 7 <= 5 && day - 8 >= 1 && day + 8 <= days);
  return {
    cells,
    centers
  };
}
export function calendarSquare(center) {
  return [-8, -7, -6, -1, 0, 1, 6, 7, 8].map(offset => center + offset);
}
