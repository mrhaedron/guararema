const fs=require('fs'),vm=require('vm'),assert=require('assert');
let frame,draws=0;const elements=new Map(),events={};const gl=new Proxy({getShaderParameter:()=>true,getAttribLocation:()=>0,drawArrays:()=>draws++,bufferData:(_t,data)=>{assert(data.every(Number.isFinite),'Invalid geometry');}}, {get:(o,k)=>k in o?o[k]:()=>({})});
function element(id){if(!elements.has(id))elements.set(id,{style:{},textContent:'',getContext:type=>type==='webgl'?gl:{fillRect(){},fillText(){}},requestPointerLock(){ctx.document.pointerLockElement=this;events.pointerlockchange();}});return elements.get(id);}
const ctx={console,performance:{now:()=>0},document:{querySelector:element,createElement:()=>element(Math.random()),addEventListener:(k,f)=>events[k]=f},window:{addEventListener(){}},innerWidth:1280,innerHeight:800,devicePixelRatio:1,requestAnimationFrame:f=>frame=f,fetch:()=>Promise.resolve({ok:false}),WebAssembly,Float32Array,Math,Set};vm.createContext(ctx);vm.runInContext(fs.readFileSync('game.js','utf8'),ctx);frame(16);assert(draws>0);assert(ctx.window.gameState().vertices>10000);element('#start').onclick();events.keydown({code:'KeyW',preventDefault(){}});for(let i=0;i<100;i++)frame(i*16+32);assert(ctx.window.gameState().z<24);events.keyup({code:'KeyW'});element('#reset').onclick();assert.equal(ctx.window.gameState().z,24);console.log('OK: geometry, draw loop, first-person movement and reset.');

let tick=1700;
function move(codes){
  element('#reset').onclick();
  for(const code of codes){
    let prevented=false;
    events.keydown({code,preventDefault(){prevented=true;}});
    assert(prevented,code+' must prevent page scrolling');
  }
  frame(tick+=50);
  const state=ctx.window.gameState();
  for(const code of codes)events.keyup({code});
  return state;
}
for(const [letter,arrow] of [['KeyW','ArrowUp'],['KeyS','ArrowDown'],['KeyA','ArrowLeft'],['KeyD','ArrowRight']]){
  const a=move([letter]),b=move([arrow]),both=move([letter,arrow]);
  assert.equal(a.x,b.x);assert.equal(a.z,b.z);
  assert.equal(a.x,both.x);assert.equal(a.z,both.z);
  assert(a.x!==0||a.z!==24,arrow+' must move the player');
}
const stopped=move(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight']);
assert.equal(stopped.x,0);assert.equal(stopped.z,24);
console.log('OK: all arrow keys match WASD, aliases do not double speed, opposing directions cancel.');
