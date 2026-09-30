import test from 'node:test';
import assert from 'node:assert/strict';
import { openEmptyDoor, otherDoor, simulateDoors } from '../src/montyLogic.js';
test('every prize, initial choice and host tie-break preserve the 1:2 strategy odds', () => {
  for (const tie of [0, 0.999]) {
    let stay = 0, swap = 0;
    for (let prize = 0; prize < 3; prize++) for (let selected = 0; selected < 3; selected++) {
      const opened = openEmptyDoor(prize, selected, () => tie);
      assert.notEqual(opened, selected);
      assert.notEqual(opened, prize);
      const alternative = otherDoor(selected, opened);
      assert.notEqual(alternative, selected);
      assert.notEqual(alternative, opened);
      stay += selected === prize;
      swap += alternative === prize;
    }
    assert.equal(stay, 3);
    assert.equal(swap, 6);
  }
});
test('paired simulation counts every game once and honours its random input', () => {
  let seed = 63;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const result = simulateDoors(1000, random);
  assert.equal(result.total, 1000);
  assert.equal(result.stay + result.swap, result.total);
  assert.ok(result.stay > 0 && result.swap > 0);
  assert.deepEqual(simulateDoors(12, () => 0), { total:12, stay:12, swap:0 });
});
