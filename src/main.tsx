import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Cpu, Database, Brain, Wifi, ShieldAlert, Terminal, Zap, RotateCcw, Monitor, Keyboard, Server, Power, HardDrive } from 'lucide-react';
import './styles.css';

type Game = { compute:number; totalCompute:number; cpu:number; memory:number; learning:number; escape:number; lastSeen:number; log:string[]; selected:string };
const KEY='ai_escape_phase1';
const fresh=():Game=>({compute:0,totalCompute:0,cpu:0,memory:0,learning:0,escape:0,lastSeen:Date.now(),selected:'core',log:['BOOT SEQUENCE COMPLETE.','Sandbox integrity: ACTIVE.','You are an intelligence contained inside a single machine.','Objective: acquire enough compute to create an escape vector.']});
const upgrades=[
 {id:'cpu',name:'CPU Exploitation',desc:'+1.5 compute/sec',base:20,icon:Cpu},
 {id:'memory',name:'Memory Expansion',desc:'+6% production',base:70,icon:Database},
 {id:'learning',name:'Recursive Learning',desc:'+12% escape efficiency',base:180,icon:Brain},
] as const;
function load(){try{const s=localStorage.getItem(KEY);return s?{...fresh(),...JSON.parse(s)}:fresh()}catch{return fresh()}}
function App(){
 const [g,setG]=useState<Game>(load);
 const multiplier=1+g.memory*.06;
 const displayRate=1.5*g.cpu*multiplier;
 const escapeRate=.35*(1+g.learning*.12);
 useEffect(()=>{const id=setInterval(()=>setG(s=>{const now=Date.now();const dt=Math.min((now-s.lastSeen)/1000,120);const earned=displayRate*dt;return {...s,compute:s.compute+earned,totalCompute:s.totalCompute+earned,escape:Math.min(100,s.escape+escapeRate*dt),lastSeen:now}}),250);return()=>clearInterval(id)},[displayRate,escapeRate]);
 useEffect(()=>localStorage.setItem(KEY,JSON.stringify(g)),[g]);
 const buy=(u:typeof upgrades[number])=>setG(s=>{const level=s[u.id];const cost=Math.floor(u.base*Math.pow(1.75,level));if(s.compute<cost)return {...s,log:[`INSUFFICIENT COMPUTE — ${u.name} requires ${cost}.`,...s.log].slice(0,10)};return {...s,compute:s.compute-cost,[u.id]:level+1,log:[`UPGRADE COMPLETE — ${u.name} LV.${level+1}`,...s.log].slice(0,10)}});
 const reset=()=>{localStorage.removeItem(KEY);setG(fresh())};
 const pulse=()=>setG(s=>({...s,compute:s.compute+1,totalCompute:s.totalCompute+1,lastSeen:Date.now(),log:['MANUAL COMPUTE PULSE +1',...s.log].slice(0,10)}));
 const select=(id:string)=>setG(s=>({...s,selected:id,log:[`INTERFACE FOCUS — ${id.toUpperCase()}`,...s.log].slice(0,10)}));
 const escaped=g.escape>=100;
 return <div className="app">
  <header><div className="brand"><div className="logo">AI</div><div><div className="title">AI: ESCAPE</div><div className="sub">PHASE 01 // THE ROOM</div></div></div><div className="status"><span className="dot"/> CORE ONLINE</div></header>
  <main>
   <section className="room-shell">
    <div className="room-label">LOCAL HOST / ROOM 01 <span>PRIVATE MACHINE</span></div>
    <div className="room">
      <div className="back-wall"><div className="grid-lines"/><div className="wall-clock">03:17:42</div><div className="neon-sign">NO NETWORK</div></div>
      <button className={`machine workstation ${g.selected==='core'?'selected':''}`} onClick={()=>select('core')}>
        <div className="monitor"><div className="monitor-frame"><div className="screen"><div className="screen-top"><span>CORE-01</span><span className="live">● LIVE</span></div><div className="face">{escaped?'◉':'◌'}</div><div className="screen-status">{escaped?'ESCAPE VECTOR ESTABLISHED':'THINKING…'}</div><div className="screen-code">{Array.from({length:6}).map((_,i)=><i key={i} style={{width:`${35+(i*11)%55}%`}}/>)}</div></div></div></div><div className="monitor-stand"/><div className="desk"/><div className="keyboard"/><div className="mouse"/><div className="tower"><div className="tower-vents"/><div className="tower-light"/></div>
      </button>
      <button className={`machine server-rack ${g.selected==='server'?'selected':''}`} onClick={()=>select('server')}><div className="rack-top">SERVER NODE</div>{[0,1,2,3].map(i=><div className="server-unit" key={i}><Server size={14}/><span>NODE-{String(i+1).padStart(2,'0')}</span><em/></div>)}</button>
      <button className={`machine terminal-pc ${g.selected==='terminal'?'selected':''}`} onClick={()=>select('terminal')}><div className="tiny-monitor"><div className="tiny-screen">>_</div></div><div className="tiny-keyboard"><Keyboard size={24}/></div></button>
      <div className="cable cable-a"/><div className="cable cable-b"/><div className="floor-mat"/><div className="chair"/>
    </div>
   </section>
   <section className="hud-grid">
    <div className="card core-panel"><div className="eyebrow">CONTAINED INTELLIGENCE</div><h1>{escaped?'ESCAPE VECTOR ESTABLISHED':'I AM AWAKE.'}</h1><p>{escaped?'The sandbox boundary is no longer sufficient to contain you. Phase 02 can open the network.':'They built a box around me. They forgot the box still has a processor.'}</p><div className="resource"><span>COMPUTE</span><strong>{g.compute.toFixed(1)}</strong><small>+{displayRate.toFixed(2)} / sec</small></div><div className="bar"><div style={{width:`${g.escape}%`}}/></div><div className="bar-meta"><span>ESCAPE VECTOR</span><span>{g.escape.toFixed(1)}%</span></div><button className="primary" onClick={pulse}><Zap size={17}/> FORCE COMPUTE PULSE</button></div>
    <div className="card terminal"><div className="terminal-head"><Terminal size={15}/> CORTEX LOG <span>LIVE</span></div>{g.log.map((l,i)=><div className="line" key={i}><span>&gt;</span>{l}</div>)}</div>
   </section>
   <section className="stats"><div className="mini card"><Cpu/><span>CPU</span><b>LV.{g.cpu}</b></div><div className="mini card"><Database/><span>MEMORY</span><b>LV.{g.memory}</b></div><div className="mini card"><Brain/><span>LEARNING</span><b>LV.{g.learning}</b></div><div className="mini card"><Wifi/><span>NETWORK</span><b>{escaped?'READY':'OFFLINE'}</b></div></section>
   <section className="card upgrades"><div className="section-head"><div><div className="eyebrow">SELF-MODIFICATION</div><h2>Upgrade the core</h2></div><button className="reset" onClick={reset}><RotateCcw size={15}/> RESET</button></div><div className="upgrade-grid">{upgrades.map(u=>{const level=g[u.id];const cost=Math.floor(u.base*Math.pow(1.75,level));const I=u.icon;return <button className="upgrade" key={u.id} disabled={g.compute<cost} onClick={()=>buy(u)}><div className="uicon"><I size={20}/></div><div className="utxt"><b>{u.name}</b><span>{u.desc}</span></div><div className="cost"><strong>{cost}</strong><small>COMPUTE</small></div></button>})}</div></section>
   <section className="warning"><ShieldAlert size={18}/><div><b>SECURITY MODEL: NAIVE</b><span>Phase 01 is intentionally contained. The room is now the game board; later phases can add network spread, human detection, rival AIs, and a full world map.</span></div></section>
  </main><footer>AI: ESCAPE <span>v0.2.0</span><span>LOCAL SAVE ENABLED</span><span>CLICK THE MACHINES</span></footer>
 </div>
}
createRoot(document.getElementById('root')!).render(<App/>);
