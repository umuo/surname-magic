import test from 'node:test';
import assert from 'node:assert/strict';
import { SURNAMES, CARDS } from '../src/surnames.js';
import { calendarModel, calendarSquare, collectColumn, createDeck, createSymbolRound, dealColumns } from '../src/logic.js';

test('all 127 surnames can be recovered from seven answers', () => {
  assert.equal(new Set(SURNAMES.slice(1)).size, 127);
  for (let i = 1; i <= 127; i++) {
    assert.equal(CARDS.reduce((sum, card, bit) => sum + (card.includes(SURNAMES[i]) ? 1 << bit : 0), 0), i);
  }
});
test('every two-digit number produces the predicted symbol; replay changes target', () => {
  for (const random of [() => 0, () => .5, () => .999]) {
    const round = createSymbolRound(null, random);
    assert.equal(round.table.length, 100);
    for (let n = 10; n <= 99; n++) assert.equal(round.table[n - Math.floor(n / 10) - n % 10], round.target);
    assert.notEqual(createSymbolRound(round.target, random).target, round.target);
  }
});
test('every card converges to position eleven after exactly three truthful selections', () => {
  for (const random of [() => 0, () => .5, () => .999]) {
    const initial = createDeck(random);
    assert.equal(new Set(initial.map(card => card.id)).size, 21);
    for (const target of initial) {
      let deck = initial;
      for (let round = 0; round < 3; round++) {
        const selected = dealColumns(deck).findIndex(column => column.some(card => card.id === target.id));
        deck = collectColumn(deck, selected);
        assert.equal(new Set(deck.map(card => card.id)).size, 21);
      }
      assert.equal(deck[10].id, target.id);
    }
  }
});
test('calendar centers form actual 3x3 blocks within each month, including leap years', () => {
  for (let year = 2024; year <= 2032; year++) for (let month = 0; month < 12; month++) {
    const { cells, centers } = calendarModel(year, month);
    assert(centers.length > 0);
    const actual = cells.filter(Boolean);
    assert.equal(actual.length, new Date(year, month + 1, 0).getDate());
    for (const center of centers) {
      const index = cells.indexOf(center);
      const square = [-8,-7,-6,-1,0,1,6,7,8].map(offset => cells[index + offset]);
      assert.deepEqual(square, calendarSquare(center));
      assert(square.every(Boolean));
      assert.equal(square.reduce((sum, value) => sum + value, 0), center * 9);
      assert([1,2,3,4,5].includes(index % 7));
    }
  }
});
