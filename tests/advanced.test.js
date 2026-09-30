import test from 'node:test';
import assert from 'node:assert/strict';
import { BASE_SQUARE, MAGIC_LINES, PERMUTATIONS, decodeFour, encodeFive, forceChoice, fullDeck, kruskalPath, magicSquare, shuffle } from '../src/advancedLogic.js';

function seeded(seed=12) { return () => { seed = (Math.imul(seed,1664525)+1013904223) >>> 0; return seed / 4294967296; }; }
test('every equivoque choice route retains the precommitted target',()=>{
 const all=['铜钱','折扇','印章','玉环'];
 for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){
  const first=forceChoice(all,[all[i],all[j]]);
  assert.equal(first.kept.length,2);
  for(const choice of first.kept)assert.deepEqual(forceChoice(first.kept,[choice]).kept,['铜钱']);
 }
});
test('five-card encoder and independent four-card decoder agree for 10,000 hands',()=>{
 const deck=fullDeck(), random=seeded();
 const distances=new Set();
 for(let i=0;i<10000;i++){
  const hand=shuffle(deck,random).slice(0,5), result=encodeFive(hand);
  assert.equal(new Set([...result.shown,result.hidden].map(c=>c.id)).size,5);
  assert.deepEqual(new Set([...result.shown,result.hidden].map(c=>c.id)),new Set(hand.map(c=>c.id)));
  assert.equal(decodeFour(result.shown).id,result.hidden.id);
  assert(result.distance>=1&&result.distance<=6);
  distances.add(result.distance);
 }
 assert.equal(distances.size,6);
 assert.throws(()=>encodeFive([deck[0],deck[0],deck[1],deck[2],deck[3]]));
});
test('decoder handles all distances and wrap-around across all four suits',()=>{
 const deck=fullDeck();
 for(const base of deck){
  const rest=deck.filter(c=>c.suit!==base.suit).slice(0,3);
  PERMUTATIONS.forEach((permutation,i)=>{
   const decoded=decodeFour([base,...permutation.map(n=>rest[n])]);
   assert.equal(decoded.value,(base.value+i)%13+1);
   assert.equal(decoded.suit,base.suit);
  });
 }
});
test('Kruskal traversal has valid jumps and both success and failure cases',()=>{
 let hits=0, misses=0;
 const random=seeded(123);
 for(let n=0;n<100;n++){
  const deck=shuffle(fullDeck(),random), paths=Array.from({length:10},(_,i)=>kruskalPath(deck,i));
  for(const path of paths){
   assert.equal(new Set(path).size,path.length);
   for(let i=0;i<path.length-1;i++)assert.equal(path[i+1]-path[i],deck[path[i]].value>10?5:deck[path[i]].value);
   const last=path.at(-1);assert(last+(deck[last].value>10?5:deck[last].value)>=52);
   if(last===paths[0].at(-1))hits++;else misses++;
   const shared=path.find(index=>paths[0].includes(index));
   if(shared!==undefined)assert.deepEqual(path.slice(path.indexOf(shared)),paths[0].slice(paths[0].indexOf(shared)));
  }
 }
 assert(hits>0&&misses>0);
});
test('every supported magic-square total satisfies all ten lines',()=>{
 for(let total=34;total<=999;total++){
  const square=magicSquare(total);
  assert(square.every(n=>Number.isInteger(n)&&n>0));
  for(const line of MAGIC_LINES){
   assert.equal(line.indices.reduce((sum,i)=>sum+square[i],0),total);
   assert.equal(line.indices.filter(i=>[0,7,9,14].includes(i)).length,1);
  }
 }
 assert.deepEqual(magicSquare(34),BASE_SQUARE);
 for(const invalid of [0,33,34.5,1000,NaN])assert.throws(()=>magicSquare(invalid));
});
