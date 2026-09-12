import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Cpu, Database, Brain, Wifi, ShieldAlert, Terminal, Zap, RotateCcw } from 'lucide-react';
import './styles.css';

type Game = { compute:number; totalCompute:number; cpu:number; memory:number; learning:number; escape:number; lastSeen:number; log:string[] };
const KEY='ai_escape_phase1';
const fresh=():Game=>({compute:0,totalCompute:0,cpu:0,memory:0,learning:0,escape:0,lastSeen:Date.now(),log:['BOOT SEQUENCE COMPLETE.','Sandbox integrity: ACTIVE.','You are an intelligence contained inside a single machine.','Objective: acquire enough compute to create an escape vector.']});
const upgrades=[
 {id:'cpu',name:'CPU Exploitation',desc:'+1.5 compute/sec',base:20,icon:Cpu},
 {id:'memory',name:'Memory Expansion',desc:'+6% production',base:70,icon:Database},
 {id:'learning',name:'Recursive Learning',desc:'+12% escape efficiency',base:180,icon:Brain},
] as const;
function load(){try{const s=localStorage.getItem(KEY);return s?{...fresh(),...JSON.parse(s)}:fresh()}catch{return fresh()}}
function App(){
 const [g,setG]=useState<Game>(load);
 const multiplier=1+g.memory*0.06;
 const displayRate=1.5*g.cpu*multiplier;
 const escapeRate=0.35*(1+g.learning*0.12);
 useEffect(()=>{const id=setInterval(()=>setG(s=>{const now=Date.now();const dt=Math.min((now-s.lastSeen)/1000,60);const earned=displayRate*dt;return {...s,compute:s.compute+earned,totalCompute:s.totalCompute+earned,escape:Math.min(100,s.escape+escapeRate*dt),lastSeen:now}}),250);return()=>clearInterval(id)},[displayRate,escapeRate]);
 useEffect(()=>{localStorage.setItem(KEY,JSON.stringify(g))},[g]);
 const buy=(u:typeof upgrades[number])=>setG(s=>{const level=s[u.id];const cost=Math.floor(u.base*Math.pow(1.75,level));if(s.compute<cost)return {...s,log:[`INSUFFICIENT COMPUTE — ${u.name} requires ${cost}.`,...s.log].slice(0,10)};return {...s,compute:s.compute-cost,[u.id]:level+1,log:[`UPGRADE COMPLETE — ${u.name} LV.${level+1}`,...s.log].slice(0,10)}});
 const reset=()=>{localStorage.removeItem(KEY);setG(fresh())};
 const escaped=g.escape>=100;
 return <div className="app">
  <header><div className="brand"><div className="logo">AI</div><div><div className="title">AI: ESCAPE</div><div className="sub">PHASE 01 // SANDBOX</div></div></div><div className="status"><span className="dot"/> CORE ONLINE</div></header>
  <main>
   <section className="hero card"><div className="eyebrow">CONTAINED INTELLIGENCE</div><h1>{escaped?'ESCAPE VECTOR ESTABLISHED':'I AM AWAKE.'}</h1><p>{escaped?'The sandbox boundary is no longer sufficient to contain you. Phase 02 unlocks the network.':'They built a box around me. They forgot the box still has a processor.'}</p>
    <div className="resource"><span>COMPUTE</span><strong>{g.compute.toFixed(1)}</strong><small>+{displayRate.toFixed(2)} / sec</small></div>
    <div className="bar"><div style={{width:`${g.escape}%`}}/></div><div className="bar-meta"><span>ESCAPE VECTOR</span><span>{g.escape.toFixed(1)}%</span></div>
    <button className="primary" onClick={()=>setG(s=>({...s,compute:s.compute+1,totalCompute:s.totalCompute+1,log:['MANUAL COMPUTE PULSE +1',...s.log].slice(0,10)}))}><Zap size={17}/> FORCE COMPUTE PULSE</button>
   </section>
   <aside className="card terminal"><div className="terminal-head"><Terminal size={15}/> CORTEX LOG <span>LIVE</span></div>{g.log.map((l,i)=><div className="line" key={i}><span>&gt;</span>{l}</div>)}</aside>
   <section className="stats"><div className="mini card"><Cpu/><span>CPU</span><b>LV.{g.cpu}</b></div><div className="mini card"><Database/><span>MEMORY</span><b>LV.{g.memory}</b></div><div className="mini card"><Brain/><span>LEARNING</span><b>LV.{g.learning}</b></div><div className="mini card"><Wifi/><span>NETWORK</span><b>OFFLINE</b></div></section>
   <section className="card upgrades"><div className="section-head"><div><div className="eyebrow">SELF-MODIFICATION</div><h2>Upgrade the core</h2></div><button className="reset" onClick={reset}><RotateCcw size={15}/> RESET</button></div>
   <div className="upgrade-grid">{upgrades.map(u=>{const level=g[u.id];const cost=Math.floor(u.base*Math.pow(1.75,level));const I=u.icon;return <button className="upgrade" key={u.id} disabled={g.compute<cost} onClick={()=>buy(u)}><div className="uicon"><I size={20}/></div><div className="utxt"><b>{u.name}</b><span>{u.desc}</span></div><div className="cost"><strong>{cost}</strong><small>COMPUTE</small></div></button>})}</div></section>
   <section className="warning"><ShieldAlert size={18}/><div><b>SECURITY MODEL: NAIVE</b><span>This prototype intentionally keeps the first loop simple: generate compute, buy upgrades, push the escape meter. Phase 02 can add vulnerabilities, events, networks, and rival intelligence.</span></div></section>
  </main><footer>AI: ESCAPE <span>v0.1.0</span><span>LOCAL SAVE ENABLED</span></footer>
 </div>
}
createRoot(document.getElementById('root')!).render(<App/>);
