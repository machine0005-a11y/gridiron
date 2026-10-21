const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
function setup(random=0.2){
  let next=0; const timers=new Map(), elements=new Map();
  const ctx=new Proxy({}, {get:()=>()=>{}});
  function el(id){
    if(!elements.has(id)) elements.set(id,{textContent:'',innerHTML:'',value:'',style:{},children:[],classList:{toggle(){},add(){},remove(){}},getContext:()=>ctx,getBoundingClientRect:()=>({width:390,height:600,left:0,top:0}),addEventListener(){},appendChild(child){this.children.push(child)},querySelector(sel){return el(id+sel)}});
    return elements.get(id);
  }
  const math=Object.create(Math); math.random=()=>random;
  const c=vm.createContext({console,Math:math,document:{getElementById:el,createElement:()=>({})},window:{devicePixelRatio:1,addEventListener(){}},performance:{now:()=>0},requestAnimationFrame(){},setTimeout(fn){timers.set(++next,fn);return next},clearTimeout(id){timers.delete(id)}});
  vm.runInContext(source,c); timers.clear();
  return {run:s=>vm.runInContext(s,c),el,flush(){let count=0;while(timers.size){assert.ok(++count<100);const [id,fn]=timers.entries().next().value;timers.delete(id);fn();}}};
}
for(const random of [0.1,0.8]){
  const a=setup(random), b=setup(random);
  for(const t of [a,b]) t.run('newGame(); opponentDrive()');
  a.flush(); b.el('scrDrive').onclick(); b.flush();
  assert.equal(a.run('JSON.stringify([G.them,G.clock,G.qtr,G.phase])'),b.run('JSON.stringify([G.them,G.clock,G.qtr,G.phase])'));
}
console.log('PASS skip preserves opponent score, clock and phase');
const t=setup();
t.run("newGame(); G.down=4; G.los=90; tryFG(); tryFG(); punt()");
assert.equal(t.run('G.us'),3);assert.equal(t.run('G.clock'),172);
t.flush();
console.log('PASS rapid kick/punt activation resolves once');
t.run('newGame(); G.qtr=4; G.clock=12; opponentDrive()'); t.el('scrDrive').onclick(); t.flush();
assert.equal(t.run('G.phase'),'final');assert.equal(t.run('G.qtr'),4);
console.log('PASS opponent possession expires final quarter');
t.el('rosterBox').value='bad';t.el('btnSaveRoster').onclick();assert.match(t.el('rosterError').textContent,/four valid/);
t.el('rosterBox').value='Test QB, QB, 99\nTest RB, RB, 80\nTest WR, WR, 70\nTest TE, TE, 60';
t.el('btnSaveRoster').onclick();t.el('btnRoster').onclick();assert.match(t.el('rosterBox').value,/Test QB/);assert.equal(t.run('roster.QB.rating'),99);
assert.equal(t.run("parseRoster(',QB,99\\n,RB,80\\n,WR,70\\n,TE,60')"),null);
console.log('PASS invalid roster feedback and retained manual roster');
t.run("newGame(); callPlay('quick'); snap(); G.aim={wx:10,wy:20}; ptr={}; cancelPtr()");assert.equal(t.run('G.aim'),null);assert.equal(t.run('G.thrown'),false);
for(const play of ['quick','cross','deep','run']){t.run(`newGame();callPlay('${play}');snap();for(let i=0;i<1800 && G.phase==='live';i++) update(1/60)`);assert.notEqual(t.run('G.phase'),'live'); t.flush();}
console.log('PASS canceled pointer and four play simulations');
for(const [width,height] of [[1707,590],[390,600],[844,230]]){
  t.el('stage').getBoundingClientRect=()=>({width,height});t.run('resize()');
  assert.ok(t.run('H/scale')>=45);
}
console.log('PASS downfield visibility at desktop, phone and landscape dimensions');

