import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  Brain, FileText, MessageSquare, Network, BarChart3, Upload,
  Search, Bell, Settings, LogOut, Sparkles, Zap, TrendingUp,
  Plus, Share2, Eye, Send, Mic, Shield, ChevronRight, Filter,
  Check, Layers, X, RotateCcw, ArrowRight, Play, Star,
  Globe, Database, Cpu, BookOpen, GitBranch, Hash, Activity,
  SlidersHorizontal, GitCompare, User, Tag, Link2, Lightbulb,
  ChevronDown, AlignLeft, BarChart2, Copy, Bookmark, Download,
  RefreshCw, AlertCircle, Info, CheckCircle2, Clock, Trash2,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Tooltip, CartesianGrid, LineChart, Line,
} from "recharts";

import ScrollFrameSequence from "../components/ScrollFrameSequence";
import VideoScrollBackground from "../components/VideoScrollBackground";
import apiService from "../services/api";

type Page = "landing" | "login" | "register" | "dashboard" | "documents" | "details" | "chat" | "graph" | "analytics" | "upload" | "compare" | "search" | "notifications" | "settings";
interface Msg { id: number; role: "ai" | "user"; content: string; sources?: string[]; }

const IMG = {
  aurora:  "https://images.unsplash.com/photo-1557264337-e8a93017fe92?w=1920&h=1080&fit=crop&auto=format",
  waves:   "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1920&h=1080&fit=crop&auto=format",
  tech:    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop&auto=format",
  finance: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1200&h=800&fit=crop&auto=format",
  product: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&h=800&fit=crop&auto=format",
  glow:    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=800&fit=crop&auto=format",
  dark:    "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=1200&h=800&fit=crop&auto=format",
  neon:    "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=1200&h=800&fit=crop&auto=format",
  dots:    "https://images.unsplash.com/photo-1770486036751-e55247238964?w=1200&h=800&fit=crop&auto=format",
  lines:   "https://images.unsplash.com/photo-1762278804798-dd7e493db051?w=1200&h=800&fit=crop&auto=format",
};

const weekData = [
  { t:"Mon",q:45,i:28 },{ t:"Tue",q:89,i:67 },{ t:"Wed",q:134,i:98 },
  { t:"Thu",q:76,i:54 },{ t:"Fri",q:167,i:123 },{ t:"Sat",q:52,i:35 },{ t:"Sun",q:34,i:21 },
];
const monthData = [
  { m:"Jan",docs:24,queries:156,insights:89 },{ m:"Feb",docs:31,queries:203,insights:124 },
  { m:"Mar",docs:45,queries:289,insights:167 },{ m:"Apr",docs:38,queries:241,insights:143 },
  { m:"May",docs:52,queries:334,insights:198 },{ m:"Jun",docs:67,queries:412,insights:234 },
  { m:"Jul",docs:58,queries:389,insights:215 },
];
const DOCS = [
  { id:1, title:"AI Strategy Report 2025", type:"PDF", size:"2.4 MB", date:"Jul 24", tags:["Strategy","AI"], score:94, status:"analyzed", clr:"#7c3aed", img:IMG.tech },
  { id:2, title:"Q2 Financial Overview", type:"DOCX", size:"1.1 MB", date:"Jul 22", tags:["Finance"], score:87, status:"analyzed", clr:"#22d3ee", img:IMG.finance },
  { id:3, title:"Product Roadmap H2 2025", type:"PDF", size:"3.8 MB", date:"Jul 20", tags:["Product"], score:91, status:"processing", clr:"#ec4899", img:IMG.product },
  { id:4, title:"Customer Research Findings", type:"PDF", size:"5.2 MB", date:"Jul 18", tags:["Research","UX"], score:88, status:"analyzed", clr:"#10b981", img:IMG.glow },
  { id:5, title:"Compliance Framework v3", type:"DOCX", size:"0.9 MB", date:"Jul 15", tags:["Legal"], score:79, status:"analyzed", clr:"#f59e0b", img:IMG.dark },
  { id:6, title:"Engineering Architecture Doc", type:"PDF", size:"4.1 MB", date:"Jul 12", tags:["Engineering"], score:96, status:"analyzed", clr:"#7c3aed", img:IMG.neon },
  { id:7, title:"Global Sustainability & ESG Report 2026", type:"PDF", size:"6.4 MB", date:"Jul 10", tags:["ESG","Strategy"], score:93, status:"analyzed", clr:"#10b981", img:IMG.glow },
  { id:8, title:"Q3 Enterprise Security Audit Log", type:"DOCX", size:"1.8 MB", date:"Jul 08", tags:["Security","Legal"], score:85, status:"analyzed", clr:"#22d3ee", img:IMG.tech },
  { id:9, title:"Healthcare AI Clinical Research Paper", type:"PDF", size:"8.2 MB", date:"Jul 05", tags:["Research","AI"], score:97, status:"analyzed", clr:"#ec4899", img:IMG.product },
  { id:10, title:"Supply Chain & Logistics H1 Analysis", type:"PDF", size:"3.1 MB", date:"Jul 03", tags:["Operations","Finance"], score:82, status:"processing", clr:"#f59e0b", img:IMG.finance },
  { id:11, title:"Data Governance & Privacy Architecture", type:"DOCX", size:"2.7 MB", date:"Jul 01", tags:["Legal","Engineering"], score:90, status:"analyzed", clr:"#7c3aed", img:IMG.dark },
  { id:12, title:"Cloud Microservices Infrastructure Benchmark", type:"PDF", size:"5.9 MB", date:"Jun 28", tags:["Engineering","AI"], score:95, status:"analyzed", clr:"#22d3ee", img:IMG.neon },
];
const NODES = [
  { id:"n1",x:400,y:200,label:"AI Strategy 2025",type:"doc",color:"#7c3aed",r:14 },
  { id:"n2",x:610,y:130,label:"Machine Learning",type:"concept",color:"#22d3ee",r:18 },
  { id:"n3",x:730,y:275,label:"Neural Networks",type:"concept",color:"#22d3ee",r:12 },
  { id:"n4",x:545,y:365,label:"Q4 Report 2024",type:"doc",color:"#7c3aed",r:11 },
  { id:"n5",x:255,y:305,label:"Enterprise AI",type:"concept",color:"#22d3ee",r:16 },
  { id:"n6",x:155,y:165,label:"DataOps 2025",type:"doc",color:"#7c3aed",r:10 },
  { id:"n7",x:455,y:78,label:"GPT-4 Analysis",type:"insight",color:"#ec4899",r:13 },
  { id:"n8",x:770,y:160,label:"Model Training",type:"concept",color:"#22d3ee",r:11 },
  { id:"n9",x:320,y:435,label:"Risk Assessment",type:"doc",color:"#7c3aed",r:12 },
  { id:"n10",x:650,y:430,label:"Compliance Hub",type:"entity",color:"#10b981",r:10 },
];
const EDGES=[["n1","n2"],["n1","n5"],["n2","n3"],["n2","n7"],["n3","n8"],["n4","n5"],["n4","n10"],["n5","n6"],["n5","n9"],["n7","n1"],["n9","n10"],["n2","n8"]];
const INIT_MSGS: Msg[] = [{ id:1, role:"ai", content:"Hello — I'm your AI knowledge assistant. 847 documents are indexed and ready. What shall we discover?", sources:[] }];
const WORDS = ["ANALYZE","DISCOVER","SYNTHESIZE","REASON","UNDERSTAND"];

/* ─── Global styles ──────────────────────────────────────────── */
const GStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; }
    body { background:#020510; font-family:'Plus Jakarta Sans',Inter,sans-serif; overflow-x:hidden; margin:0; }

    @keyframes blobA { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(4%,-6%) scale(1.1)} 66%{transform:translate(-3%,4%) scale(0.92)} }
    @keyframes blobB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-7%,6%) scale(1.13)} }
    @keyframes blobC { 0%,100%{transform:scale(1.05)} 50%{transform:scale(0.95) translate(5%,-3%)} }
    @keyframes spin1 { to{transform:rotateX(72deg) rotateZ(360deg)} }
    @keyframes spin2 { to{transform:rotateX(22deg) rotateY(55deg) rotateZ(-360deg)} }
    @keyframes spin3 { to{transform:rotateY(82deg) rotateZ(360deg)} }
    @keyframes cubeRot { to{transform:rotateX(18deg) rotateY(360deg)} }
    @keyframes levA { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-20px) rotate(2deg)} }
    @keyframes levB { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
    @keyframes levC { 0%,100%{transform:translateY(0px) rotate(-1deg)} 33%{transform:translateY(-8px) rotate(1deg)} 66%{transform:translateY(-16px) rotate(0deg)} }
    @keyframes softPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
    @keyframes glowRing { 0%,100%{box-shadow:0 0 20px rgba(124,58,237,.4),0 0 40px rgba(124,58,237,.1)} 50%{box-shadow:0 0 60px rgba(124,58,237,.9),0 0 120px rgba(124,58,237,.3)} }
    @keyframes scanMove { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
    @keyframes drift { 0%{transform:translateY(0) scale(1);opacity:0} 8%{opacity:1} 92%{opacity:.6} 100%{transform:translateY(-115vh) translateX(30px) scale(0);opacity:0} }
    @keyframes shimmer { from{background-position:-500% 0} to{background-position:500% 0} }
    @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    @keyframes wordIn { 0%,100%{opacity:0;transform:translateY(24px) scale(.88)} 15%,85%{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes borderFlow { 0%{border-color:rgba(124,58,237,.35)} 50%{border-color:rgba(34,211,238,.65)} 100%{border-color:rgba(124,58,237,.35)} }
    @keyframes holoSheen { 0%{background-position:0% 50%;filter:hue-rotate(0deg)} 50%{background-position:100% 50%;filter:hue-rotate(25deg)} 100%{background-position:0% 50%;filter:hue-rotate(0deg)} }
    @keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
    @keyframes depthFloat { 0%,100%{transform:perspective(600px) translateZ(0px) translateY(0px)} 50%{transform:perspective(600px) translateZ(20px) translateY(-10px)} }

    .blobA{animation:blobA 22s ease-in-out infinite}
    .blobB{animation:blobB 28s ease-in-out infinite}
    .blobC{animation:blobC 17s ease-in-out infinite}
    .ring1{animation:spin1 9s linear infinite;transform:rotateX(72deg) rotateZ(0deg)}
    .ring2{animation:spin2 14s linear infinite;transform:rotateX(22deg) rotateY(55deg) rotateZ(0deg)}
    .ring3{animation:spin3 6s linear infinite reverse;transform:rotateY(82deg) rotateZ(0deg)}
    .cubeRot{animation:cubeRot 12s linear infinite}
    .levA{animation:levA 6s ease-in-out infinite}
    .levB{animation:levB 4.5s ease-in-out infinite}
    .levC{animation:levC 7s ease-in-out infinite}
    .softPulse{animation:softPulse 3s ease-in-out infinite}
    .glowRing{animation:glowRing 3s ease-in-out infinite}
    .breathe{animation:breathe 4s ease-in-out infinite}
    .depthFloat{animation:depthFloat 5s ease-in-out infinite}

    .grad-text {
      background:linear-gradient(135deg,#f0abfc,#818cf8,#22d3ee,#34d399,#f472b6);
      background-size:300% 300%;
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      animation:gradShift 5s ease infinite;
    }
    .glass { background:rgba(255,255,255,.03); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,.07); }
    .glass-violet { background:rgba(124,58,237,.08); backdrop-filter:blur(24px); border:1px solid rgba(124,58,237,.25); box-shadow:0 0 40px rgba(124,58,237,.12),inset 0 1px 0 rgba(255,255,255,.06); }
    .glass-dark { background:rgba(2,5,16,.75); backdrop-filter:blur(32px); border:1px solid rgba(124,58,237,.12); }
    .card-lift { transition:all .45s cubic-bezier(.23,1,.32,1); }
    .card-lift:hover { transform:translateY(-8px) scale(1.025); box-shadow:0 32px 80px rgba(124,58,237,.28),0 0 0 1px rgba(124,58,237,.3); }
    .img-tilt { transition:transform .65s cubic-bezier(.23,1,.32,1); perspective:600px; }
    .img-tilt:hover { transform:perspective(600px) rotateX(6deg) rotateY(-6deg) translateY(-8px) scale(1.03); }
    .neon-btn { transition:all .25s ease; }
    .neon-btn:hover { transform:scale(1.06); box-shadow:0 0 40px rgba(124,58,237,.85),0 0 80px rgba(124,58,237,.35),0 0 160px rgba(124,58,237,.12); }
    .neon-btn:active { transform:scale(.96); }
    .cyan-neon:hover { box-shadow:0 0 40px rgba(34,211,238,.75),0 0 80px rgba(34,211,238,.3); }
    .feature-card { transition:all .4s cubic-bezier(.23,1,.32,1); }
    .feature-card:hover { transform:translateY(-10px) scale(1.03) perspective(400px) rotateX(3deg); box-shadow:0 40px 80px rgba(124,58,237,.22),inset 0 1px 0 rgba(255,255,255,.1); }
    .sidebar-active { background:linear-gradient(90deg,rgba(124,58,237,.2),transparent); border-left:2px solid #7c3aed; }
    .holo-border { animation:borderFlow 3.5s ease-in-out infinite; }
    .holo-shine { animation:holoSheen 6s ease-in-out infinite; }
    .depth-card { animation:depthFloat 5.5s ease-in-out infinite; }

    ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(124,58,237,.3);border-radius:2px}
  `}</style>
);

/* ─── Scroll reveal hook ─────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── Word cycler ────────────────────────────────────────────── */
function WordCycler() {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1) % WORDS.length), 2800); return () => clearInterval(t); }, []);
  return (
    <div className="relative overflow-hidden" style={{ height: 80 }}>
      {WORDS.map((w, i) => (
        <span key={w} className="absolute inset-0 flex items-center grad-text font-black"
          style={{ fontSize: 68, fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:"-3px",
            animation: i === idx ? "wordIn 2.8s ease forwards" : "none", opacity: i === idx ? 1 : 0 }}>
          {w}
        </span>
      ))}
    </div>
  );
}

/* ─── Animated counter ───────────────────────────────────────── */
function Counter({ to, suffix="" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const { ref, visible } = useReveal();
  useEffect(() => {
    if (!visible) return;
    let start: number | null = null;
    const step = (ts: number) => { if (!start) start = ts; const p = Math.min((ts-start)/1400, 1); setV(Math.floor(p*to)); if (p<1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [visible, to]);
  return <span ref={ref as React.RefObject<HTMLSpanElement>}>{v.toLocaleString()}{suffix}</span>;
}

/* ─── Aurora bg ──────────────────────────────────────────────── */
function Aurora({ img }: { img?: string }) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{ background:"#020510" }} />
      {img && <><img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity:.06, filter:"blur(2px)" }} /><div className="absolute inset-0" style={{ background:"rgba(2,5,16,.75)" }} /></>}
      <div className="blobA absolute rounded-full" style={{ top:"-25%", left:"-15%", width:"75vw", height:"75vw", background:"radial-gradient(circle,rgba(124,58,237,.32) 0%,rgba(76,29,149,.13) 40%,transparent 70%)" }} />
      <div className="blobB absolute rounded-full" style={{ bottom:"-20%", right:"-12%", width:"65vw", height:"65vw", background:"radial-gradient(circle,rgba(29,78,216,.2) 0%,rgba(30,58,138,.1) 40%,transparent 70%)" }} />
      <div className="blobC absolute rounded-full" style={{ top:"20%", right:"5%", width:"50vw", height:"50vw", background:"radial-gradient(circle,rgba(34,211,238,.13) 0%,transparent 65%)" }} />
      <div className="blobA absolute rounded-full" style={{ bottom:"5%", left:"20%", width:"40vw", height:"40vw", background:"radial-gradient(circle,rgba(236,72,153,.09) 0%,transparent 65%)", animationDelay:"9s" }} />
      <div className="absolute left-0 right-0" style={{ height:1.5, background:"linear-gradient(90deg,transparent,rgba(124,58,237,.5),rgba(34,211,238,.4),transparent)", animation:"scanMove 9s linear infinite", opacity:.6 }} />
      <div className="absolute inset-0" style={{ backgroundImage:"linear-gradient(rgba(124,58,237,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.06) 1px,transparent 1px)", backgroundSize:"64px 64px" }} />
      <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at 50% 50%,transparent 20%,rgba(2,5,16,.92) 100%)" }} />
    </div>
  );
}

/* ─── Particles ──────────────────────────────────────────────── */
function Particles() {
  const pts = Array.from({length:22},(_,i)=>({ id:i, left:`${4+(i*4.3)%92}%`, delay:`${(i*1.9)%14}s`, dur:`${9+(i*2.3)%16}s`, size:i%3===0?3:i%3===1?2:1.5, clr:i%5===0?"#7c3aed":i%5===1?"#22d3ee":i%5===2?"#ec4899":i%5===3?"#10b981":"#f59e0b" }));
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {pts.map(p => <div key={p.id} className="absolute bottom-0 rounded-full" style={{ left:p.left, width:p.size, height:p.size, background:p.clr, boxShadow:`0 0 8px ${p.clr}`, animation:`drift ${p.dur} ${p.delay} linear infinite` }} />)}
    </div>
  );
}

/* ─── 3D AI Core ─────────────────────────────────────────────── */
function AICore({ size=260, glow=true }: { size?: number; glow?: boolean }) {
  const r = size/2;
  return (
    <div className="relative flex items-center justify-center select-none" style={{ width:size, height:size, perspective:1000 }}>
      {glow && <div className="softPulse absolute rounded-full" style={{ width:size*2.6, height:size*2.6, top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"radial-gradient(circle,rgba(34,211,238,.35) 0%,rgba(124,58,237,.25) 45%,transparent 70%)" }} />}
      {glow && <div className="glowRing absolute rounded-full" style={{ width:size*.9, height:size*.9, borderRadius:"50%", border:"2px solid rgba(34,211,238,.8)", boxShadow:"0 0 35px rgba(34,211,238,.9), inset 0 0 25px rgba(124,58,237,.8)" }} />}
      
      {/* 3D Ring 1 - Cyan Laser Light Border */}
      <div className="ring1 absolute" style={{ width:r*1.75, height:r*1.75, border:"2px solid #22d3ee", borderRadius:"50%", boxShadow:"0 0 25px #22d3ee, 0 0 50px rgba(34,211,238,.6), inset 0 0 15px #22d3ee", transformStyle:"preserve-3d" }}>
        <div className="absolute w-3.5 h-3.5 rounded-full" style={{ background:"#ffffff", boxShadow:"0 0 18px #ffffff, 0 0 35px #22d3ee", top:-7, left:"50%", transform:"translateX(-50%)" }} />
      </div>

      {/* 3D Ring 2 - Electric Magenta Border */}
      <div className="ring2 absolute" style={{ width:r*1.38, height:r*1.38, border:"2px solid #ec4899", borderRadius:"50%", boxShadow:"0 0 22px #ec4899, 0 0 45px rgba(236,72,153,.5)", transformStyle:"preserve-3d" }}>
        <div className="absolute w-3 h-3 rounded-full" style={{ background:"#ffffff", boxShadow:"0 0 15px #ffffff, 0 0 30px #ec4899", bottom:-5, right:"15%" }} />
      </div>

      {/* 3D Ring 3 - Royal Violet Border */}
      <div className="ring3 absolute" style={{ width:r*2.1, height:r*2.1, border:"1.5px dashed #a78bfa", borderRadius:"50%", boxShadow:"0 0 20px rgba(167,139,250,.7)", transformStyle:"preserve-3d" }}>
        <div className="absolute w-2.5 h-2.5 rounded-full" style={{ background:"#10b981", boxShadow:"0 0 14px #10b981", top:"20%", left:-4 }} />
      </div>

      {/* Holographic Nucleus Core */}
      <div className="absolute rounded-full" style={{ width:r*.78, height:r*.78, background:"radial-gradient(circle at 30% 30%,#ffffff,#c4b5fd 25%,#7c3aed 55%,#3b0764 85%)", boxShadow:"0 0 60px rgba(124,58,237,1), 0 0 120px rgba(34,211,238,.8), inset 0 0 30px rgba(255,255,255,.9)" }} />
      <div className="absolute softPulse rounded-full" style={{ width:r*.35, height:r*.35, background:"radial-gradient(circle,#ffffff,rgba(34,211,238,.9),transparent)", filter:"blur(3px)" }} />
    </div>
  );
}

/* ─── Data Cube ──────────────────────────────────────────────── */
function DataCube({ size=64 }: { size?: number }) {
  const h = size/2;
  const face = (tr: string, bg: string, br: string, glow: string) => (
    <div 
      style={{ 
        position: "absolute", 
        width: size, 
        height: size, 
        transform: tr, 
        background: bg, 
        border: `1.5px solid ${br}`, 
        boxShadow: `0 0 15px ${glow}, inset 0 0 12px ${glow}`, 
        backdropFilter: "blur(6px)", 
        backfaceVisibility: "hidden" as const 
      }} 
    />
  );

  return (
    <div style={{ width:size, height:size, perspective:450, perspectiveOrigin:"60% 40%" }}>
      <div className="cubeRot" style={{ width:size, height:size, position:"relative", transformStyle:"preserve-3d" }}>
        {face(`translateZ(${h}px)`,"rgba(124,58,237,.35)","#a78bfa","rgba(124,58,237,.6)")}
        {face(`rotateY(180deg) translateZ(${h}px)`,"rgba(34,211,238,.3)","#22d3ee","rgba(34,211,238,.6)")}
        {face(`rotateY(-90deg) translateZ(${h}px)`,"rgba(124,58,237,.3)","#a78bfa","rgba(124,58,237,.6)")}
        {face(`rotateY(90deg) translateZ(${h}px)`,"rgba(167,139,250,.25)","#c4b5fd","rgba(167,139,250,.5)")}
        {face(`rotateX(90deg) translateZ(${h}px)`,"rgba(236,72,153,.25)","#ec4899","rgba(236,72,153,.5)")}
        {face(`rotateX(-90deg) translateZ(${h}px)`,"rgba(16,185,129,.25)","#10b981","rgba(16,185,129,.5)")}
      </div>
    </div>
  );
}

/* ─── 3D floating feature mini-panel ────────────────────────── */
function FeaturePanel({ title, icon: Icon, color, delay=0, posStyle, children }: {
  title: string;
  icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
  color: string;
  delay?: number;
  posStyle?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <div className="depth-card absolute" style={{ animationDelay:`${delay}s`, ...posStyle }}>
      <div 
        className="glass rounded-2xl p-4 relative overflow-hidden transition-all duration-300 hover:scale-105" 
        style={{ 
          border: `1.5px solid ${color}80`, 
          boxShadow: `0 0 25px ${color}35, 0 20px 60px rgba(0,0,0,.8), inset 0 0 15px ${color}20`, 
          backdropFilter: "blur(24px)", 
          minWidth: 185 
        }}
      >
        {/* Light Effect Top Border Glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background:`linear-gradient(90deg,transparent,${color},#ffffff,${color},transparent)`, boxShadow:`0 0 12px ${color}` }} />
        
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:`${color}25`, border:`1.5px solid ${color}60`, boxShadow:`0 0 12px ${color}40` }}>
            <Icon size={14} style={{ color, filter:`drop-shadow(0 0 6px ${color})` }} />
          </div>
          <span className="text-xs font-black text-white tracking-tight">{title}</span>
          <div className="ml-auto w-2 h-2 rounded-full softPulse" style={{ background:"#10b981", boxShadow:"0 0 10px #10b981" }} />
        </div>
        {children}
        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background:"linear-gradient(105deg,transparent 30%,rgba(255,255,255,.08) 50%,transparent 70%)", animation:"shimmer 4s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════════════ */
function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const heroY       = useTransform(scrollYProgress, [0, 0.25], [0, -180]);
  const cardsY      = useTransform(scrollYProgress, [0, 0.25], [0, -60]);
  const bgY         = useTransform(scrollYProgress, [0, 0.4],  [0, -320]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const heroScale   = useTransform(scrollYProgress, [0, 0.22], [1, 0.92]);

  return (
    <div ref={containerRef} className="relative z-10">
      {/* High Quality Video Scroll Background */}
      <VideoScrollBackground />

      {/* Fixed nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass-dark" style={{ borderBottom:"1px solid rgba(124,58,237,.12)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#7c3aed,#5b21b6)", boxShadow:"0 0 20px rgba(124,58,237,.7)" }}>
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <div className="font-black text-white text-sm leading-none" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>AI-KOS</div>
            <div className="text-[8px] tracking-[3px]" style={{ color:"rgba(167,139,250,.6)" }}>ENTERPRISE</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color:"rgba(180,185,230,.55)" }}>
          {["Features","Solutions","How It Works","Pricing","Resources"].map(l => (
            <button key={l} className="hover:text-white transition-colors duration-200">{l}</button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onGetStarted} className="text-sm px-4 py-2 rounded-xl transition-all hover:text-white" style={{ color:"rgba(167,139,250,.7)" }}>Log In</button>
          <button onClick={onGetStarted} className="neon-btn text-sm px-5 py-2.5 rounded-xl font-bold text-white" style={{ background:"linear-gradient(135deg,#7c3aed,#5b21b6)", boxShadow:"0 0 20px rgba(124,58,237,.55)" }}>Get Started →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Deep bg — slowest parallax layer */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at 50% 50%,transparent 35%,rgba(2,5,16,.75) 100%)" }} />
        </motion.div>

        <div className="relative w-full max-w-full px-12 md:px-20 py-20 flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left text — wrapped in premium black translucent box */}
          <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }} className="flex-1 max-w-2xl">
            <motion.div 
              initial={{ opacity:0, y:30 }} 
              animate={{ opacity:1, y:0 }} 
              transition={{ duration:.8 }}
              className="p-8 md:p-10 rounded-3xl bg-slate-950/80 border border-violet-500/30 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.85)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-80" />
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border mb-6" style={{ background:"rgba(124,58,237,.18)", border:"1px solid rgba(167,139,250,.4)", backdropFilter:"blur(12px)" }}>
                <div className="w-2 h-2 rounded-full softPulse" style={{ background:"#10b981", boxShadow:"0 0 8px #10b981" }} />
                <span className="text-xs font-mono font-bold tracking-wider" style={{ color:"#c4b5fd" }}>AI-POWERED KNOWLEDGE INTELLIGENCE</span>
              </div>
              <h1 className="font-black text-white leading-none mb-4" style={{ fontSize:"clamp(44px,5.8vw,76px)", fontFamily:"'Outfit', sans-serif", letterSpacing:"-2.5px" }}>
                AI-Powered<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-400 font-extrabold">Knowledge.</span>
              </h1>
              <div className="mb-6" style={{ height:80 }}><WordCycler /></div>
              <p className="text-base leading-relaxed mb-8 font-medium" style={{ color:"rgba(220,225,255,.85)", maxWidth:540 }}>
                AI-KOS Enterprise is the next-generation knowledge intelligence platform that helps organisations capture, understand, connect, and activate information using the power of AI.
              </p>
              <div className="flex items-center gap-4">
                <button onClick={onGetStarted} className="neon-btn flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-white text-sm" style={{ background:"linear-gradient(135deg,#7c3aed,#5b21b6)", boxShadow:"0 0 30px rgba(124,58,237,.65)" }}>
                  <Sparkles size={15} /> Explore Platform
                </button>
                <button className="cyan-neon flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm border transition-all hover:scale-105" style={{ borderColor:"rgba(34,211,238,.35)", color:"rgba(34,211,238,.9)", background:"rgba(34,211,238,.06)" }}>
                  <Play size={14} /> Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-6 mt-8">
                {["Enterprise Ready","AI-Powered","Privacy First"].map(b => (
                  <div key={b} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color:"rgba(200,210,250,.7)" }}>
                    <Check size={12} style={{ color:"#10b981" }} />{b}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Interactive Live AI Platform Workspace Preview */}
          <motion.div style={{ y: cardsY, width:640, flexShrink:0 }} className="hidden lg:block relative">
            <div className="relative rounded-3xl bg-slate-950/85 border border-cyan-500/40 backdrop-blur-2xl p-6 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(34,211,238,0.2)] overflow-hidden transition-all duration-500 hover:border-cyan-400 hover:shadow-[0_25px_90px_rgba(34,211,238,0.3)]">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-cyan-300/80 font-bold">AI-KOS Workspace Live Demo</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-[10px] font-bold text-cyan-300">
                  <Sparkles size={12} className="text-cyan-400" /> Interactive Mode
                </div>
              </div>

              {/* Main Feature Image Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-5 group cursor-pointer" onClick={onGetStarted}>
                <img src="/ui_dashboard_ai_analytics.png" alt="AI Platform Preview" className="w-full h-[260px] object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-white/20 backdrop-blur-md">
                    <Database size={14} className="text-cyan-400" />
                    <span className="text-xs font-bold text-white">ChromaDB Hybrid Search</span>
                  </div>
                  <button className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs shadow-[0_0_15px_#22d3ee] transition-all hover:scale-105">
                    Launch Interactive Hub →
                  </button>
                </div>
              </div>

              {/* Interactive Quick Action Bar */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Query AI Chat", icon: MessageSquare, color: "#7c3aed" },
                  { label: "Neural Graph", icon: Network, color: "#22d3ee" },
                  { label: "Deep Analysis", icon: FileText, color: "#ec4899" }
                ].map(({ label, icon: Icon, color }) => (
                  <button 
                    key={label}
                    onClick={onGetStarted}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-400/60 hover:bg-slate-800/80 transition-all duration-300 group"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${color}25`, border: `1px solid ${color}50` }}>
                      <Icon size={14} style={{ color }} />
                    </div>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div style={{ opacity: heroOpacity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-widest font-mono" style={{ color:"rgba(167,139,250,.45)" }}>SCROLL TO EXPLORE</span>
          <div className="w-px h-12 relative overflow-hidden" style={{ background:"rgba(124,58,237,.2)" }}>
            <div className="absolute w-full" style={{ height:"50%", background:"linear-gradient(180deg,transparent,#7c3aed)", animation:"scanMove 2s linear infinite" }} />
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="relative py-16">
        <motion.div initial={{ opacity:0, y:60, scale:.92 }} whileInView={{ opacity:1, y:0, scale:1 }} transition={{ duration:.8, ease:[.22,1,.36,1] }} viewport={{ once:true, margin:"-80px" }}>
          <div className="max-w-6xl mx-auto px-8">
            <div className="glass rounded-3xl p-8" style={{ border:"1px solid rgba(124,58,237,.15)", boxShadow:"0 0 60px rgba(124,58,237,.08)" }}>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { icon:Database, label:"Documents Processed", n:10000, suffix:"K+", color:"#7c3aed" },
                  { icon:Search, label:"Search Accuracy", n:98, suffix:"%", color:"#22d3ee" },
                  { icon:Zap, label:"Time Saved", n:50, suffix:"%+", color:"#ec4899" },
                  { icon:Shield, label:"Enterprise Security", n:0, suffix:"SOC2", color:"#10b981" },
                  { icon:Activity, label:"AI Availability", n:24, suffix:"/7", color:"#f59e0b" },
                ].map(({ icon:Icon, label, n, suffix, color }, i) => (
                  <motion.div key={label} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} transition={{ delay:i*.1, duration:.6 }} viewport={{ once:true }} className="text-center">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background:`${color}15`, border:`1px solid ${color}30` }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div className="text-2xl font-black text-white mb-1" style={{ fontFamily:"'Outfit', sans-serif" }}>
                      {n > 0 ? <><Counter to={n} />{suffix}</> : suffix}
                    </div>
                    <div className="text-[11px]" style={{ color:"rgba(180,185,230,.45)" }}>{label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img src={IMG.lines} alt="" className="w-full h-full object-cover" style={{ opacity:.07 }} />
          <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at 50% 50%,transparent 30%,rgba(2,5,16,.96) 100%)" }} />
        </div>

        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <motion.div initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:.8, ease:[.22,1,.36,1] }} viewport={{ once:true, margin:"-80px" }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-5" style={{ background:"rgba(124,58,237,.08)", border:"1px solid rgba(124,58,237,.25)" }}>
              <Sparkles size={12} style={{ color:"#a78bfa" }} />
              <span className="text-xs font-mono" style={{ color:"rgba(167,139,250,.8)" }}>FULL FEATURE SUITE</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-4" style={{ fontFamily:"'Outfit', sans-serif", letterSpacing:"-1.5px" }}>
              Your Enterprise Knowledge,<br /><span className="grad-text">Reimagined</span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color:"rgba(180,185,230,.5)" }}>
              AI-KOS Enterprise brings together AI, knowledge graphs, and advanced analytics to help you unlock the true value of your information.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              { icon:MessageSquare, title:"AI Chat & RAG Assistant", desc:"Conversational access to your entire knowledge base using vector similarity. Ask anything, get cited answers instantly.", color:"#7c3aed", img:"/ui_dashboard_ai_analytics.png", delay:0 },
              { icon:Search, title:"Vector Semantic Search", desc:"Go beyond basic keywords. Find exact semantic meaning with AI vector embedding search across all enterprise documents.", color:"#22d3ee", img:"/ui_knowledge_graph_3d.png", delay:.07 },
              { icon:Network, title:"3D Knowledge Neural Physics Graph", desc:"Visualise complex relationships, concepts, and entity connections across your entire document corpus interactively.", color:"#ec4899", img:"/ui_knowledge_graph_3d.png", delay:.14 },
              { icon:Sparkles, title:"Deep Document AI Intelligence", desc:"Automated summarisation, sentiment analysis, risk extraction, and key topic discovery in seconds.", color:"#10b981", img:"/ui_dashboard_ai_analytics.png", delay:.21 },
              { icon:GitBranch, title:"Side-by-Side Document Comparison", desc:"Compare complex contracts and technical spec documents with AI diff highlight analysis and risk delta tracking.", color:"#f59e0b", img:"/ui_dashboard_ai_analytics.png", delay:.28 },
              { icon:BarChart3, title:"Real-Time Executive Analytics", desc:"Live dashboards into knowledge retrieval trends, system throughput, and organizational search insights.", color:"#a78bfa", img:"/ui_dashboard_ai_analytics.png", delay:.35 },
            ].map(({ icon:Icon, title, desc, color, img, delay }) => (
              <motion.div key={title} initial={{ opacity:0, y:70, scale:.88 }} whileInView={{ opacity:1, y:0, scale:1 }} transition={{ delay, duration:.75, ease:[.22,1,.36,1] }} viewport={{ once:true, margin:"-60px" }}>
                <div className="feature-card rounded-3xl overflow-hidden cursor-pointer group h-full transition-all duration-300 hover:scale-[1.02] bg-slate-950/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.85)]" style={{ border:`1.5px solid ${color}50` }}>
                  <div className="relative overflow-hidden" style={{ height:180 }}>
                    <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" style={{ opacity:.85 }} />
                    <div className="absolute inset-0" style={{ background:`linear-gradient(180deg,${color}20 0%,rgba(2,5,16,.95) 100%)` }} />
                    <div className="absolute top-4 left-4">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg" style={{ background:`${color}35`, border:`1.5px solid ${color}70`, backdropFilter:"blur(12px)" }}>
                        <Icon size={20} style={{ color }} />
                      </div>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background:"linear-gradient(105deg,transparent 30%,rgba(255,255,255,.12) 50%,transparent 70%)" }} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-black text-white mb-2">{title}</h3>
                    <p className="text-xs leading-relaxed font-medium" style={{ color:"rgba(220,225,255,.8)" }}>{desc}</p>
                    <div className="flex items-center gap-1.5 mt-4 text-xs font-bold transition-all duration-300 group-hover:translate-x-1" style={{ color }}>
                      Explore Capability <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-[1450px] mx-auto px-12 relative z-10">
          <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:.7 }} viewport={{ once:true }} className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4" style={{ fontFamily:"'Outfit', sans-serif", letterSpacing:"-1.5px" }}>
              How <span className="grad-text">AI-KOS</span> Works
            </h2>
            <p className="text-base font-medium" style={{ color:"rgba(200,210,255,.7)" }}>Three steps from data to intelligence</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px hidden lg:block" style={{ background:"linear-gradient(180deg,transparent,rgba(124,58,237,.4) 20%,rgba(34,211,238,.4) 80%,transparent)" }} />
            {[
              { n:"01", title:"Upload & Index Documents", desc:"Connect PDFs, files, databases and enterprise cloud storage. AI-KOS instantly chunks and indexes everything with ChromaDB vector embeddings.", icon:Upload, color:"#7c3aed", img:"/ui_dashboard_ai_analytics.png", side:"left" },
              { n:"02", title:"Interactive 3D Knowledge Graph", desc:"The neural physics engine extracts entities, relationships and concepts automatically into an interactive graph.", icon:Network, color:"#22d3ee", img:"/ui_knowledge_graph_3d.png", side:"right" },
              { n:"03", title:"Natural Language AI Search & Chat", desc:"Ask complex questions in natural language. Get instant, cited answers with document page references backed by Gemini RAG.", icon:MessageSquare, color:"#ec4899", img:"/ui_dashboard_ai_analytics.png", side:"left" },
            ].map(({ n, title, desc, icon:Icon, color, img, side }, i) => (
              <motion.div key={n}
                initial={{ opacity:0, x: side==="left" ? -80 : 80, scale:.85 }}
                whileInView={{ opacity:1, x:0, scale:1 }}
                transition={{ delay:i*.15, duration:.85, ease:[.22,1,.36,1] }}
                viewport={{ once:true, margin:"-60px" }}
                className={`flex items-center gap-12 mb-20 last:mb-0 ${side==="right"?"flex-row-reverse":""}`}
              >
                <div className="flex-1 p-8 rounded-3xl bg-slate-950/80 border border-violet-500/30 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-6xl font-black" style={{ color:`${color}50`, fontFamily:"'Outfit', sans-serif", lineHeight:1 }}>{n}</span>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background:`${color}30`, border:`1.5px solid ${color}60` }}>
                      <Icon size={22} style={{ color }} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3" style={{ fontFamily:"'Outfit', sans-serif" }}>{title}</h3>
                  <p className="text-sm leading-relaxed font-medium" style={{ color:"rgba(220,225,255,.8)", maxWidth:460 }}>{desc}</p>
                </div>
                <div className="hidden lg:block flex-1 relative" style={{ height:260 }}>
                  <div className="img-tilt absolute inset-0 rounded-3xl overflow-hidden shadow-2xl" style={{ border:`1.5px solid ${color}40`, boxShadow:`0 20px 60px rgba(0,0,0,.7),0 0 30px ${color}20` }}>
                    <img src={img} alt={title} className="w-full h-full object-cover" style={{ opacity:.85 }} />
                    <div className="absolute inset-0" style={{ background:`linear-gradient(135deg,${color}20,transparent 60%,rgba(2,5,16,.7))` }} />
                    <div className="absolute top-4 right-4 text-6xl font-black" style={{ color:`${color}30`, fontFamily:"'Outfit', sans-serif", lineHeight:1 }}>{n}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOWCASE & HIGH RES IMAGE ── */}
      <section className="relative py-28 overflow-hidden">
        <motion.div initial={{ opacity:0, scale:.95 }} whileInView={{ opacity:1, scale:1 }} transition={{ duration:1, ease:[.22,1,.36,1] }} viewport={{ once:true, margin:"-100px" }}>
          <div className="max-w-[1550px] mx-auto px-10">
            <div className="relative rounded-3xl overflow-hidden bg-slate-950/85 border border-cyan-400/40 backdrop-blur-2xl p-14 shadow-[0_25px_90px_rgba(0,0,0,0.95)]">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background:"linear-gradient(90deg,transparent,#22d3ee,#a78bfa,#ec4899,transparent)" }} />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                <div className="flex-1 max-w-2xl">
                  <span className="font-['Space_Grotesk'] text-sm tracking-[4px] uppercase text-cyan-300 block mb-3 font-bold">Enterprise Knowledge Intelligence</span>
                  <h2 className="text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily:"'Outfit', sans-serif" }}>
                    Centralised Data.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-400 font-black">Infinite Mastery.</span>
                  </h2>
                  <div className="space-y-4 mb-8">
                    {[
                      "Real-Time Hybrid Vector Intelligence Engine",
                      "3D Neural Physics Data Graph Visualizer",
                      "Automated Document Summary & Risk Extraction"
                    ].map(f => (
                      <div key={f} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-cyan-500/20 border border-cyan-400/50 shadow-[0_0_12px_#22d3ee]">
                          <Check size={14} className="text-cyan-300" />
                        </div>
                        <span className="text-base font-semibold text-slate-200 font-['Outfit']">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={onGetStarted} className="neon-btn flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-white text-lg shadow-[0_0_40px_rgba(34,211,238,0.6)]" style={{ background:"linear-gradient(135deg,#7c3aed,#22d3ee)" }}>
                    Explore Platform <ArrowRight size={20} />
                  </button>
                </div>

                {/* High Resolution AI Enterprise Workspace Showcase Image */}
                <div className="relative flex-1 rounded-3xl overflow-hidden border border-violet-500/40 shadow-[0_0_60px_rgba(124,58,237,0.35),0_0_30px_rgba(34,211,238,0.2)] group cursor-pointer" onClick={onGetStarted}>
                  <img 
                    src="/ui_dashboard_ai_analytics.png" 
                    alt="AI Enterprise Command Hub" 
                    className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/90 border border-violet-400/40 backdrop-blur-md">
                      <Sparkles size={16} className="text-violet-400" />
                      <span className="text-sm font-bold text-white font-['Outfit']">AI Enterprise Intelligence Hub</span>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-violet-600 text-white font-extrabold text-xs shadow-[0_0_20px_#7c3aed] hover:scale-105 transition-all font-['Outfit']">
                      Launch Platform →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CLEAN BOTTOM VIEWPORT SPACING ── */}
      {/* Clean bottom viewport space to display the final video frame backdrop cleanly */}
      <div className="h-[80vh] relative pointer-events-none" />

      {/* Footer */}
      <footer className="py-10 border-t text-center" style={{ borderColor:"rgba(124,58,237,.1)" }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background:"linear-gradient(135deg,#7c3aed,#5b21b6)" }}><Brain size={12} className="text-white" /></div>
          <span className="font-black text-white text-sm">AI-KOS Enterprise</span>
        </div>
        <p className="text-xs" style={{ color:"rgba(180,185,230,.25)" }}>© 2026 AI-KOS. All rights reserved.</p>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function Glass({ children, className="", glow=false, hover=false, style }: { children:React.ReactNode; className?:string; glow?:boolean; hover?:boolean; style?:React.CSSProperties }) {
  return (
    <div className={`glass rounded-2xl ${glow?"glass-violet":""} ${hover?"card-lift cursor-pointer":""} ${className}`} style={style}>
      {children}
    </div>
  );
}
function VBtn({ children, onClick, icon, sm=false, cyan=false }: { children:React.ReactNode; onClick?:()=>void; icon?:React.ReactNode; sm?:boolean; cyan?:boolean }) {
  return (
    <button onClick={onClick} className={`neon-btn ${cyan?"cyan-neon":""} flex items-center gap-2 rounded-xl font-bold ${sm?"px-4 py-2 text-xs":"px-6 py-3 text-sm"} text-white`}
      style={{ background:cyan?"linear-gradient(135deg,#0e7490,#0891b2)":"linear-gradient(135deg,#7c3aed,#5b21b6)", boxShadow:cyan?"0 0 20px rgba(34,211,238,.4)":"0 0 20px rgba(124,58,237,.5)" }}>
      {icon}{children}
    </button>
  );
}
function GBtn({ children, onClick, active=false, sm=false }: { children:React.ReactNode; onClick?:()=>void; active?:boolean; sm?:boolean }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 rounded-xl border font-medium transition-all duration-200 ${sm?"px-3 py-1.5 text-[11px]":"px-4 py-2 text-xs"} ${active?"border-violet-500/50 text-violet-300":"border-white/10 text-white/40 hover:border-white/25 hover:text-white/80"}`}
      style={{ background:active?"rgba(124,58,237,.15)":"transparent" }}>
      {children}
    </button>
  );
}
function StatW({ label, n, delta, icon:Icon, color, onClick }: { label:string; n:number; delta:string; icon:React.FC<{size?:number;style?:React.CSSProperties}>; color:string; onClick?:()=>void }) {
  return (
    <Glass hover className="p-5 relative overflow-hidden cursor-pointer" onClick={onClick}>
      <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse at top right,${color}0d,transparent 70%)` }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:`${color}15`, border:`1px solid ${color}35` }}><Icon size={18} style={{ color }} /></div>
        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 px-2 py-1 rounded-full" style={{ background:"rgba(16,185,129,.12)", border:"1px solid rgba(16,185,129,.25)" }}><TrendingUp size={10}/>{delta}</span>
      </div>
      <div className="text-3xl font-black text-white mb-1" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:"-1px" }}>{n.toLocaleString()}</div>
      <div className="text-xs" style={{ color:"rgba(180,185,230,.5)" }}>{label}</div>
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background:`linear-gradient(90deg,transparent,${color}60,transparent)` }} />
    </Glass>
  );
}
function ChartTip({ active, payload, label }: { active?:boolean; payload?:Array<{name:string;value:number;color:string}>; label?:string }) {
  if (!active||!payload?.length) return null;
  return (
    <div className="px-3 py-2.5 rounded-xl text-xs border" style={{ background:"rgba(4,6,20,.95)", borderColor:"rgba(124,58,237,.35)", backdropFilter:"blur(16px)" }}>
      <div className="font-bold text-white mb-2">{label}</div>
      {payload.map((p,i)=><div key={i} className="flex items-center gap-2 mb-1 last:mb-0"><div className="w-2 h-2 rounded-full" style={{ background:p.color }}/><span style={{ color:"rgba(180,185,230,.7)" }}>{p.name}:</span><span className="font-bold text-white">{p.value}</span></div>)}
    </div>
  );
}

/* ─── Sidebar ────────────────────────────────────────────────── */
let globalUnreadCount = 3;
let forceRefreshApp: () => void = () => {};
let GLOBAL_NOTIFS = [
  { id:1, type:"success", icon:CheckCircle2, color:"#10b981", title:"Analysis complete", body:"AI Strategy Report 2025 has been fully analyzed. 34 insights extracted.", time:"2 min ago", read:false },
  { id:2, type:"info", icon:Sparkles, color:"#7c3aed", title:"New insights generated", body:"Knowledge graph updated with 13 new entity relationships from recent uploads.", time:"18 min ago", read:false },
  { id:3, type:"warning", icon:AlertCircle, color:"#f59e0b", title:"Processing delayed", body:"Product Roadmap H2 2025 analysis is taking longer than expected due to complex tables.", time:"1 hr ago", read:false },
  { id:4, type:"info", icon:Network, color:"#22d3ee", title:"Graph sync complete", body:"Knowledge graph successfully synced. 1,240 nodes and 3,891 edges now active.", time:"2 hr ago", read:true },
  { id:5, type:"success", icon:Upload, color:"#10b981", title:"Documents uploaded", body:"3 new documents added to the knowledge base and queued for AI analysis.", time:"3 hr ago", read:true },
  { id:6, type:"info", icon:MessageSquare, color:"#ec4899", title:"New AI conversation", body:"Team member Sarah Chen started a new knowledge chat session.", time:"4 hr ago", read:true },
  { id:7, type:"success", icon:Shield, color:"#10b981", title:"Security scan passed", body:"Weekly security audit completed. All systems operating within compliance parameters.", time:"Yesterday", read:true },
  { id:8, type:"info", icon:TrendingUp, color:"#7c3aed", title:"Monthly report ready", body:"Your June analytics report is available. Query volume up 23% month-over-month.", time:"Yesterday", read:true },
];

const NAV_GROUPS = [
  {
    label: "WORKSPACE",
    items: [
      { icon:Layers,      label:"Dashboard",       page:"dashboard"      as Page },
      { icon:FileText,    label:"Documents",        page:"documents"      as Page },
      { icon:Search,      label:"Search",           page:"search"         as Page },
      { icon:MessageSquare, label:"AI Chat",        page:"chat"           as Page },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { icon:Network,     label:"Knowledge Graph",  page:"graph"          as Page },
      { icon:GitCompare,  label:"Compare Docs",     page:"compare"        as Page, badge:"AI Diff" },
      { icon:BarChart3,   label:"Analytics",        page:"analytics"      as Page },
    ],
  },
  {
    label: "MANAGE",
    items: [
      { icon:Upload,      label:"Upload",           page:"upload"         as Page },
      { icon:Bell,        label:"Notifications",    page:"notifications"  as Page, get badge() { return globalUnreadCount || undefined; } },
      { icon:Settings,    label:"Settings",         page:"settings"       as Page },
    ],
  },
];
function Sidebar({ current, onNav, onHome }: { current:Page; onNav:(p:Page)=>void; onHome:()=>void }) {
  return (
    <aside className="flex flex-col h-screen glass-dark" style={{ width:256, minWidth:256, borderRight:"1px solid rgba(124,58,237,.12)" }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background:"linear-gradient(90deg,transparent,rgba(124,58,237,.6),rgba(34,211,238,.4),transparent)" }} />

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 cursor-pointer shrink-0" style={{ borderBottom:"1px solid rgba(124,58,237,.1)" }} onClick={onHome}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#7c3aed,#5b21b6)", boxShadow:"0 0 18px rgba(124,58,237,.7)" }}><Brain size={16} className="text-white" /></div>
        <div><div className="font-black text-white text-sm leading-none">AI-KOS</div><div className="text-[8px] tracking-[3px]" style={{ color:"rgba(167,139,250,.55)" }}>ENTERPRISE</div></div>
        <div className="ml-auto w-1.5 h-1.5 rounded-full softPulse" style={{ background:"#10b981", boxShadow:"0 0 6px #10b981" }} />
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-1 shrink-0">
        <button onClick={()=>onNav("search")} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all hover:border-violet-500/30" style={{ background:"rgba(255,255,255,.025)", borderColor:"rgba(255,255,255,.07)" }}>
          <Search size={11} style={{ color:"rgba(180,185,230,.35)" }} />
          <span className="text-xs flex-1" style={{ color:"rgba(180,185,230,.28)" }}>Search knowledge…</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background:"rgba(124,58,237,.2)", color:"rgba(167,139,250,.8)" }}>⌘K</span>
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-4">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <div className="text-[9px] font-bold tracking-[2.5px] px-3 py-1.5" style={{ color:"rgba(124,58,237,.5)" }}>{group.label}</div>
            <div className="space-y-0.5">
              {group.items.map(({ icon:Icon, label, page, badge }: { icon:React.FC<{size?:number;style?:React.CSSProperties}>, label:string, page:Page, badge?:number }) => {
                const active = current === page;
                return (
                  <button key={page} onClick={()=>onNav(page)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 relative overflow-hidden ${active?"sidebar-active":""}`} style={{ color:active?"#c4b5fd":"rgba(180,185,230,.45)" }}>
                    {active && <div className="absolute inset-0" style={{ background:"linear-gradient(90deg,rgba(124,58,237,.15),transparent)" }} />}
                    <Icon size={14} style={{ color:active?"#a78bfa":"rgba(180,185,230,.3)" }} />
                    <span className="relative z-10 flex-1 text-left">{label}</span>
                    {badge && !active && <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold z-10" style={{ background:"#7c3aed", color:"#fff" }}>{badge}</span>}
                    {active && <div className="w-1.5 h-1.5 rounded-full z-10" style={{ background:"#7c3aed", boxShadow:"0 0 6px #7c3aed" }} />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 pb-3 shrink-0" style={{ borderTop:"1px solid rgba(124,58,237,.1)" }}>
        <div className="flex items-center gap-2.5 px-3 py-3 mt-2 rounded-xl cursor-pointer transition-all hover:bg-white/[0.04]" style={{ background:"rgba(124,58,237,.06)", border:"1px solid rgba(124,58,237,.14)" }} onClick={()=>onNav("settings")}>
          <div className="w-7 h-7 rounded-full overflow-hidden border" style={{ borderColor:"rgba(124,58,237,.5)" }}><img src="https://i.pravatar.cc/64?img=47" alt="Avatar" className="w-full h-full object-cover" /></div>
          <div className="flex-1 min-w-0"><div className="text-[11px] font-bold text-white truncate">Alexandra Kim</div><div className="text-[9px]" style={{ color:"rgba(167,139,250,.55)" }}>Admin · Pro Plan</div></div>
          <LogOut size={11} style={{ color:"rgba(180,185,230,.28)" }} />
        </div>
      </div>
    </aside>
  );
}

/* ─── Top bar ────────────────────────────────────────────────── */
function TopBar({ title, subtitle, children, onNav }: { title:string; subtitle?:string; children?:React.ReactNode; onNav?:(p:Page)=>void }) {
  return (
    <div className="flex items-center justify-between px-8 py-5 sticky top-0 z-20" style={{ background:"rgba(2,5,16,.85)", borderBottom:"1px solid rgba(124,58,237,.08)", backdropFilter:"blur(20px)" }}>
      <div>
        <h1 className="text-lg font-black text-white leading-none" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:"-.5px" }}>{title}</h1>
        {subtitle && <p className="text-[11px] mt-0.5" style={{ color:"rgba(180,185,230,.45)" }}>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {children}
        <button onClick={()=>onNav?.("search")} className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all hover:border-violet-500/30 cursor-pointer" style={{ background:"rgba(255,255,255,.02)", borderColor:"rgba(255,255,255,.07)" }}>
          <Search size={12} style={{ color:"rgba(180,185,230,.35)" }}/><span className="text-xs" style={{ color:"rgba(180,185,230,.25)" }}>Quick search…</span>
        </button>
        <button onClick={()=>onNav?.("notifications")} className="relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all hover:border-violet-500/30 hover:bg-violet-500/10 cursor-pointer" style={{ borderColor:"rgba(255,255,255,.07)" }}>
          <Bell size={14} style={{ color:"rgba(180,185,230,.5)" }}/>{globalUnreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background:"#ec4899", boxShadow:"0 0 8px #ec4899" }}/>}
        </button>
        <button onClick={()=>onNav?.("settings")} className="w-8 h-8 rounded-full overflow-hidden border-2 cursor-pointer transition-transform hover:scale-105" style={{ borderColor:"rgba(124,58,237,.5)" }}><img src="https://i.pravatar.cc/64?img=47" alt="Avatar" className="w-full h-full object-cover"/></button>
      </div>
    </div>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────── */
function DashboardPage({ onNav, onSelectDoc }: { onNav: (p: Page) => void; onSelectDoc?: (doc: typeof DOCS[0]) => void }) {
  const [tab, setTab] = useState<"week"|"month">("week");
  return (
    <div>
      <TopBar title="Dashboard" subtitle="Sunday, Jul 26, 2026 · Good evening, Alexandra" onNav={onNav}/>
      <div className="px-8 py-6 space-y-6">
        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.7 }}>
          <div className="relative rounded-3xl overflow-hidden" style={{ minHeight:260, border:"1px solid rgba(124,58,237,.2)" }}>
            <img src={IMG.aurora} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity:.3 }}/>
            <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,rgba(2,5,16,.9) 0%,rgba(76,29,149,.3) 50%,rgba(2,5,16,.85) 100%)" }}/>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background:"linear-gradient(90deg,transparent,rgba(124,58,237,.8),rgba(34,211,238,.6),transparent)" }}/>
            <div className="relative z-10 flex items-center justify-between p-8">
              <div>
                <div className="flex items-center gap-2 mb-4"><div className="w-2 h-2 rounded-full softPulse" style={{ background:"#10b981", boxShadow:"0 0 8px #10b981" }}/><span className="text-[10px] font-mono tracking-widest" style={{ color:"rgba(16,185,129,.8)" }}>AI ENGINE ACTIVE · 847 DOCS</span></div>
                <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:"-1px" }}>Your knowledge is<br /><span className="grad-text">working for you</span></h2>
                <p className="text-sm mb-6" style={{ color:"rgba(200,205,240,.5)", maxWidth:420 }}>12,400 insights generated · Knowledge graph active with 1,240 nodes</p>
                <div className="flex gap-3"><VBtn icon={<Sparkles size={14}/>} onClick={()=>onNav("chat")}>Ask AI</VBtn><VBtn cyan onClick={()=>onNav("analytics")}>View Insights</VBtn></div>
              </div>
              <div className="levA hidden xl:block"><AICore size={170}/></div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, delay:.1 }} className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatW label="Total Documents" n={847} delta="+12%" icon={FileText} color="#7c3aed" onClick={()=>onNav("documents")}/>
          <StatW label="AI Queries Today" n={1247} delta="+34%" icon={MessageSquare} color="#22d3ee" onClick={()=>onNav("chat")}/>
          <StatW label="Insights Generated" n={12400} delta="+8%" icon={Sparkles} color="#ec4899" onClick={()=>onNav("analytics")}/>
          <StatW label="Knowledge Nodes" n={3891} delta="+5%" icon={Network} color="#10b981" onClick={()=>onNav("graph")}/>
        </motion.div>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, delay:.15 }} className="grid xl:grid-cols-3 gap-4">
          <Glass className="p-6 xl:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div><h3 className="text-sm font-bold text-white">Knowledge Activity</h3><p className="text-xs mt-0.5" style={{ color:"rgba(180,185,230,.4)" }}>Queries and insights over time</p></div>
              <div className="flex gap-1.5">{(["week","month"] as const).map(t=><GBtn key={t} sm onClick={()=>setTab(t)} active={tab===t}>{t==="week"?"7 days":"7 months"}</GBtn>)}</div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={tab==="week"?weekData:monthData} margin={{ top:0,right:0,left:-20,bottom:0 }}>
                <defs>
                  <linearGradient key="gq2" id="gQ2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7c3aed" stopOpacity={.4}/><stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/></linearGradient>
                  <linearGradient key="gi2" id="gI2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={.3}/><stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/>
                <XAxis dataKey={tab==="week"?"t":"m"} tick={{ fill:"rgba(180,185,230,.35)", fontSize:10 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:"rgba(180,185,230,.35)", fontSize:10 }} axisLine={false} tickLine={false}/>
                <Tooltip content={<ChartTip/>}/>
                <Area key="aq2" type="monotone" dataKey={tab==="week"?"q":"queries"} name="Queries" stroke="#7c3aed" strokeWidth={2.5} fill="url(#gQ2)"/>
                <Area key="ai2" type="monotone" dataKey={tab==="week"?"i":"insights"} name="Insights" stroke="#22d3ee" strokeWidth={2} fill="url(#gI2)"/>
              </AreaChart>
            </ResponsiveContainer>
          </Glass>
          <Glass className="p-5 flex flex-col hover:border-violet-500/30 cursor-pointer" onClick={()=>onNav("analytics")}>
            <h3 className="text-sm font-bold text-white mb-4">AI Processing Queue</h3>
            <div className="space-y-4 flex-1">
              {[{l:"AI Analysis",p:78,c:"#7c3aed"},{l:"Semantic Index",p:94,c:"#22d3ee"},{l:"Knowledge Graph",p:61,c:"#ec4899"},{l:"Embeddings",p:88,c:"#10b981"}].map(({l,p,c})=>(
                <div key={l}><div className="flex justify-between text-xs mb-1.5"><span style={{ color:"rgba(180,185,230,.65)" }}>{l}</span><span className="font-mono font-bold" style={{ color:c }}>{p}%</span></div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,.05)" }}><div className="h-full rounded-full relative overflow-hidden" style={{ width:`${p}%`, background:`linear-gradient(90deg,${c},${c}99)` }}><div className="absolute inset-0" style={{ background:"linear-gradient(90deg,transparent 50%,rgba(255,255,255,.25) 70%,transparent 90%)", animation:"shimmer 2s ease-in-out infinite" }}/></div></div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center pt-4" style={{ borderTop:"1px solid rgba(255,255,255,.05)" }}><div className="levB"><DataCube size={52}/></div></div>
          </Glass>
        </motion.div>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, delay:.2 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-black text-white" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-.5px" }}>Recent Documents</h3>
              <p className="text-xs" style={{ color: "rgba(180,185,230,.45)" }}>Click any document to inspect deep AI insights & knowledge graph connections</p>
            </div>
            <VBtn sm icon={<ChevronRight size={12}/>} onClick={()=>onNav("documents")}>View all 847</VBtn>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {DOCS.slice(0,3).map((doc,i)=>(
              <motion.div key={doc.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2+i*.07 }}>
                <div 
                  className="group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2"
                  style={{
                    height: 220,
                    background: "rgba(2,5,16,0.9)",
                    border: `1.5px solid ${doc.clr}40`,
                    boxShadow: `0 12px 40px rgba(0,0,0,0.7), 0 0 25px ${doc.clr}20`,
                  }}
                  onClick={() => onSelectDoc ? onSelectDoc(doc) : onNav("details")}
                >
                  {/* Top Glowing Gradient Line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] z-20" style={{ background: `linear-gradient(90deg,transparent,${doc.clr},#22d3ee,transparent)` }} />

                  {/* Rich Tech Background Image */}
                  <img src={doc.img} alt={doc.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" style={{ opacity:.55 }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(2,5,16,0.2) 0%, rgba(2,5,16,0.92) 80%)" }} />

                  {/* Top Header Pill Badges */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-xl font-mono tracking-wider" style={{ background: "rgba(2,5,16,0.75)", color: doc.clr, border: `1px solid ${doc.clr}50`, backdropFilter: "blur(12px)" }}>
                      {doc.type}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5" style={{ background: doc.status==="analyzed"?"rgba(16,185,129,0.2)":"rgba(245,158,11,0.2)", color: doc.status==="analyzed"?"#34d399":"#fbbf24", border: doc.status==="analyzed"?"1px solid rgba(16,185,129,0.4)":"1px solid rgba(245,158,11,0.4)", backdropFilter: "blur(12px)" }}>
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: doc.status==="analyzed"?"#34d399":"#fbbf24" }} />
                        {doc.status==="analyzed"?"AI Analyzed":"Processing"}
                      </span>
                      <span className="text-xs font-black px-2.5 py-1 rounded-xl" style={{ background: "rgba(0,0,0,0.75)", color: doc.score>90?"#10b981":doc.score>80?"#22d3ee":"#f59e0b", border: `1px solid ${doc.score>90?"rgba(16,185,129,0.5)":"rgba(34,211,238,0.5)"}`, backdropFilter: "blur(12px)" }}>
                        {doc.score}%
                      </span>
                    </div>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10 space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {doc.tags.map(t=>(
                        <span key={t} className="text-[9px] font-bold px-2.5 py-0.5 rounded-lg font-mono" style={{ background: `${doc.clr}20`, color: "#c4b5fd", border: `1px solid ${doc.clr}35` }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                    <h4 className="text-base font-extrabold text-white leading-snug group-hover:text-cyan-300 transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {doc.title}
                    </h4>
                    <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                      <span className="text-[11px] font-medium" style={{ color: "rgba(180,185,230,0.5)" }}>{doc.date} · {doc.size}</span>
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        Inspect AI <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Documents ──────────────────────────────────────────────── */
function DocumentsPage({ onNav, onSelectDoc }: { onNav: (p: Page) => void; onSelectDoc?: (doc: any) => void }) {
  const [docs, setDocs] = useState<any[]>(DOCS);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    apiService.getDocuments().then(data => {
      if (data && data.length > 0) {
        const mapped = data.map((d: any, i: number) => {
          const colors = ["#7c3aed", "#22d3ee", "#ec4899", "#10b981", "#f59e0b"];
          const images = [IMG.tech, IMG.finance, IMG.product, IMG.glow, IMG.dark, IMG.neon];
          return {
            id: d.doc_id,
            title: d.title || d.filename,
            type: (d.file_type || "TXT").toUpperCase(),
            size: d.file_size ? (d.file_size / 1024 / 1024).toFixed(1) + " MB" : "N/A",
            date: d.uploaded_at ? new Date(d.uploaded_at).toLocaleDateString() : "Just now",
            tags: [d.category || "General"],
            category: d.category || "General",
            score: Math.floor(Math.random() * 20) + 80,
            status: "analyzed",
            clr: colors[i % colors.length],
            img: images[i % images.length],
            raw: d
          };
        });
        setDocs(mapped);
      }
    }).catch(e => console.error("Failed to load real docs", e));
  }, []);

  const filtered = filter === "all" ? docs : docs.filter(d => {
    const tagsMatch = d.tags && Array.isArray(d.tags) && d.tags.some((t: string) => (t || "").toLowerCase() === filter);
    const typeMatch = (d.type || "").toLowerCase() === filter;
    const statusMatch = d.status === filter;
    return tagsMatch || typeMatch || statusMatch;
  });
  
  // Group by category
  const groupedDocs: Record<string, any[]> = {};
  filtered.forEach(d => {
    const cat = d.category || "General";
    if (!groupedDocs[cat]) groupedDocs[cat] = [];
    groupedDocs[cat].push(d);
  });

  return (
    <div>
      <TopBar title="Document Library" subtitle={`${docs.length} documents · Live Sync Active`} onNav={onNav}/>
      <div className="px-8 py-6">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}>
          <div className="relative rounded-2xl overflow-hidden mb-6" style={{ height:120 }}>
            <img src={IMG.dark} alt="" className="w-full h-full object-cover" style={{ opacity:.55 }}/>
            <div className="absolute inset-0" style={{ background:"linear-gradient(90deg,rgba(2,5,16,.9),rgba(124,58,237,.2) 50%,rgba(2,5,16,.8))" }}/>
            <div className="absolute inset-0 flex items-center px-8 gap-6">
              <div><h2 className="text-xl font-black text-white mb-1" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:"-.5px" }}>Knowledge Library</h2><p className="text-xs" style={{ color:"rgba(200,205,240,.5)" }}>Every document analyzed, indexed, and ready for AI-powered exploration</p></div>
              <div className="ml-auto flex gap-3"><VBtn sm icon={<Plus size={12}/>} onClick={()=>onNav("upload")}>Upload</VBtn><GBtn sm onClick={()=>onNav("search")}><Filter size={11}/>Filter</GBtn></div>
            </div>
          </div>
          <div className="flex gap-2 mb-5 flex-wrap">
            {["all","analyzed","processing","PDF","DOCX","AI","Finance","Legal","Engineering","ESG","Security","Research"].map(f=><GBtn key={f} sm onClick={()=>setFilter(f.toLowerCase())} active={filter===f.toLowerCase()}>{f==="all"?"All documents":f}</GBtn>)}
          </div>
          <div className="space-y-10">
            {Object.entries(groupedDocs).map(([category, catDocs]) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-wider font-['Outfit'] uppercase">{category}</h3>
                  <div className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-bold text-white/50">{catDocs.length}</div>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4"/>
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {catDocs.map((doc,i)=>(
                    <motion.div key={doc.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.06 }}>
                      <div className="glass card-lift rounded-2xl overflow-hidden cursor-pointer group" style={{ border:"1px solid rgba(255,255,255,.07)" }}>
                        <div className="relative overflow-hidden" style={{ height:120 }} onClick={() => onSelectDoc ? onSelectDoc(doc) : onNav("details")}>
                          <img src={doc.img} alt={doc.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" style={{ opacity:.7 }}/>
                          <div className="absolute inset-0" style={{ background:`linear-gradient(180deg,${doc.clr}18,rgba(2,5,16,.85))` }}/>
                          <div className="absolute top-3 left-3"><span className="text-[9px] font-bold px-2 py-1 rounded-md font-mono" style={{ background:"rgba(0,0,0,.5)", color:doc.clr, border:`1px solid ${doc.clr}40`, backdropFilter:"blur(8px)" }}>{doc.type}</span></div>
                          <div className="absolute top-3 right-3"><span className={`text-[9px] font-bold px-2 py-1 rounded-full ${doc.status==="analyzed"?"text-emerald-400":"text-amber-400"}`} style={{ background:doc.status==="analyzed"?"rgba(16,185,129,.15)":"rgba(245,158,11,.15)", border:doc.status==="analyzed"?"1px solid rgba(16,185,129,.3)":"1px solid rgba(245,158,11,.3)", backdropFilter:"blur(8px)" }}>{doc.status==="analyzed"?"✓ Analyzed":"⟳ Processing"}</span></div>
                          <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black" style={{ background:"rgba(0,0,0,.6)", border:`2px solid ${doc.score>90?"#10b981":doc.score>80?"#22d3ee":"#f59e0b"}`, color:doc.score>90?"#10b981":doc.score>80?"#22d3ee":"#f59e0b", backdropFilter:"blur(8px)" }}>{doc.score}</div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-sm font-bold text-white mb-2 leading-snug cursor-pointer" onClick={() => onSelectDoc ? onSelectDoc(doc) : onNav("details")}>{doc.title}</h4>
                          <div className="flex flex-wrap gap-1.5 mb-3">{doc.tags.map((t: string)=><span key={t} className="text-[10px] px-2 py-0.5 rounded-lg" style={{ background:"rgba(124,58,237,.12)", color:"rgba(167,139,250,.85)", border:"1px solid rgba(124,58,237,.22)" }}>{t}</span>)}</div>
                          <div className="text-[10px]" style={{ color:"rgba(180,185,230,.4)" }}>{doc.date} · {doc.size}</div>
                          <div className="flex gap-2 mt-3 pt-3 border-t opacity-90 group-hover:opacity-100 transition-all duration-300" style={{ borderColor:"rgba(255,255,255,.06)" }}>
                            <GBtn sm onClick={() => { if(onSelectDoc) onSelectDoc(doc); onNav("details"); }}><Eye size={10}/>View</GBtn>
                            <GBtn sm active onClick={() => { if(onSelectDoc) onSelectDoc(doc); onNav("compare"); }}><GitCompare size={10}/>Compare</GBtn>
                            <GBtn sm onClick={() => onNav("chat")}><Sparkles size={10}/>Ask AI</GBtn>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Chat ───────────────────────────────────────────────────── */
function ChatPage({ onNav, onSelectDoc }: { onNav?: (p: Page) => void; onSelectDoc?: (doc: typeof DOCS[0]) => void }) {
  const [msgs, setMsgs] = useState<Msg[]>(INIT_MSGS);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<{ docName: string; snippet: string; score: number } | null>(null);
  const [model, setModel] = useState("Gemini 3.1 Flash (RAG)");
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    bottomRef.current?.scrollIntoView({ behavior:"smooth" }); 
  }, [msgs, thinking, isTyping]);

  const sendQuery = useCallback(async (queryText: string) => {
    if (!queryText.trim() || thinking || isTyping) return;
    const q = queryText.trim();
    setInput("");
    
    // Add User Message
    const userMsgId = Date.now();
    setMsgs(m => [...m, { id: userMsgId, role: "user", content: q }]);
    setThinking(true);

    try {
      // Call API Service
      const res = await apiService.sendChatMessage(q);
      setThinking(false);

      const rawAnswer = res.answer || `Based on multi-document RAG analysis for "${q}":\n\n**Key Finding**: The indexed Knowledge Graph reveals strong alignment across enterprise vector clusters with a 97.4% confidence score.\n\n**Actionable Insight**: Recommended to review compliance parameters and cross-reference with Q2 financial performance metrics.`;
      const citationsList = res.citations ? res.citations.map((c: any) => c.filename || c.doc_id) : ["Q2 Financial Overview", "AI Strategy Report 2025", "Enterprise Compliance Policy"];

      // Typewriter Streaming Animation
      setIsTyping(true);
      const aiMsgId = Date.now() + 1;
      setMsgs(m => [...m, { id: aiMsgId, role: "ai", content: "", sources: citationsList }]);

      let charIdx = 0;
      const interval = setInterval(() => {
        charIdx += 3;
        if (charIdx >= rawAnswer.length) {
          setMsgs(m => m.map(item => item.id === aiMsgId ? { ...item, content: rawAnswer } : item));
          setIsTyping(false);
          clearInterval(interval);
        } else {
          setMsgs(m => m.map(item => item.id === aiMsgId ? { ...item, content: rawAnswer.slice(0, charIdx) + "▌" } : item));
        }
      }, 20);

    } catch (err) {
      setThinking(false);
      setMsgs(m => [...m, { id: Date.now() + 1, role: "ai", content: "Apologies, encountered a temporary issue connecting to the AI vector store. Please try again.", sources: [] }]);
    }
  }, [thinking, isTyping]);

  const toggleMic = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setInput("Summarize the top revenue drivers and AI strategy risks for 2026.");
        setIsListening(false);
      }, 2500);
    }
  };

  const SUGGESTIONS = [
    { text: "📊 Summarize Q2 Financial Performance", docId: 2 },
    { text: "⚡ Key takeaways from AI Strategy 2025", docId: 1 },
    { text: "🛡️ Audit Enterprise Compliance & Security", docId: 5 },
    { text: "🌱 Global ESG & Sustainability Guidelines", docId: 7 },
  ];

  return (
    <div className="flex flex-col" style={{ height:"100vh" }}>
      <TopBar title="AI RAG Chat Assistant" subtitle="Conversational Knowledge Base Intelligence · Multi-Doc RAG active" onNav={onNav}/>
      <div className="flex flex-1 overflow-hidden">
        {/* Main Chat Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none opacity-5"><img src={IMG.glow} alt="" className="w-full h-full object-cover"/></div>
          
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 relative">
            {/* Header Core Engine Status */}
            <div className="flex justify-center mb-2">
              <Glass glow className="px-6 py-3 flex items-center gap-5">
                <div style={{ transform:"scale(.55)", transformOrigin:"center", margin:"-24px -8px" }}><AICore size={110} glow={false}/></div>
                <div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-extrabold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>AIKOS Neural RAG Engine</div>
                    <select 
                      value={model} 
                      onChange={e=>setModel(e.target.value)} 
                      className="bg-black/60 text-[10px] font-mono text-cyan-300 border border-cyan-500/40 rounded-lg px-2 py-0.5 outline-none cursor-pointer"
                    >
                      <option value="Gemini 3.1 Flash (RAG)">Gemini 3.1 Flash</option>
                      <option value="GPT-4o Enterprise">GPT-4o Enterprise</option>
                      <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                    <span className="text-[10px] font-mono" style={{ color:"rgba(16,185,129,.9)" }}>Online · 12 Indexed Docs · Hybrid ChromaDB Vector Search</span>
                  </div>
                </div>
              </Glass>
            </div>

            {/* Quick Action Prompt Chips */}
            <div className="flex justify-center gap-2 flex-wrap pb-2">
              {SUGGESTIONS.map(({ text, docId }) => (
                <button
                  key={text}
                  onClick={() => sendQuery(text.replace(/^[^\s]+\s/, ''))}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 transition-all hover:scale-105 hover:text-white cursor-pointer"
                  style={{
                    background: "rgba(124, 58, 237, 0.12)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {text}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            {msgs.map(msg => (
              <motion.div key={msg.id} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:.35 }} className={`flex ${msg.role==="user"?"justify-end":"justify-start"}`}>
                <div className="max-w-[80%] space-y-2">
                  {msg.role==="ai" && (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center shadow-lg" style={{ background:"linear-gradient(135deg,#7c3aed,#5b21b6)", boxShadow:"0 0 14px rgba(124,58,237,.7)" }}>
                        <Brain size={13} className="text-white"/>
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color:"#c4b5fd" }}>AIKOS RAG ASSISTANT</span>
                    </div>
                  )}

                  <div 
                    className="px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-xl" 
                    style={msg.role==="user" ? { 
                      background:"linear-gradient(135deg,rgba(124,58,237,.45),rgba(91,33,182,.3))", 
                      border:"1.5px solid rgba(167,139,250,.5)", 
                      color:"#ffffff",
                      fontFamily: "'Outfit', sans-serif"
                    } : { 
                      background:"rgba(2,5,16,.85)", 
                      border:"1.5px solid rgba(255,255,255,.09)", 
                      color:"rgba(230,235,255,.95)",
                      backdropFilter: "blur(16px)"
                    }}
                  >
                    {msg.content.split("\n").map((line,i)=>(
                      <p key={i} className={i>0?"mt-2.5":""} dangerouslySetInnerHTML={{ __html:line.replace(/\*\*(.*?)\*\*/g,'<strong style="color:#22d3ee;font-weight:800">$1</strong>') }}/>
                    ))}
                  </div>

                  {/* Citation Source Badges */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[10px] font-mono text-slate-400">Sources:</span>
                      {msg.sources.map(s => (
                        <button
                          key={s}
                          onClick={() => {
                            const found = DOCS.find(d => d.title.toLowerCase().includes(s.toLowerCase())) || DOCS[0];
                            setSelectedCitation({
                              docName: found.title,
                              snippet: `Extracted Chunk from "${found.title}": RAG hybrid retrieval matched query vector with 96.8% cosine similarity score. Semantic index contains 48 pages.`,
                              score: found.score
                            });
                          }}
                          className="text-[10px] font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 hover:border-cyan-400"
                          style={{ background:"rgba(34,211,238,0.12)", color:"#22d3ee", border:"1px solid rgba(34,211,238,0.3)" }}
                        >
                          <FileText size={10}/> {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Thinking / Reasoning Pulse */}
            {thinking && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#7c3aed,#5b21b6)" }}>
                  <Brain size={13} className="text-white"/>
                </div>
                <div className="px-5 py-3.5 rounded-2xl flex items-center gap-3" style={{ background:"rgba(2,5,16,0.8)", border:"1px solid rgba(124,58,237,0.3)" }}>
                  <div className="flex gap-1.5">
                    {[0,1,2].map(i=>(
                      <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background:i===0?"#7c3aed":i===1?"#22d3ee":"#ec4899", animationDelay:`${i*0.2}s` }}/>
                    ))}
                  </div>
                  <span className="text-xs font-mono text-cyan-300">Searching ChromaDB vector store & synthesizing RAG context…</span>
                </div>
              </motion.div>
            )}

            <div ref={bottomRef}/>
          </div>

          {/* Input Bar */}
          <div className="px-8 py-5" style={{ borderTop:"1px solid rgba(124,58,237,.12)" }}>
            {isListening && (
              <div className="flex items-center justify-center gap-2 mb-3 py-2 px-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono animate-pulse">
                <Mic size={14}/> Listening... Speak your prompt clearly into microphone
              </div>
            )}

            <div className="glass-violet rounded-2xl flex items-end gap-3 p-3.5 holo-border" style={{ background:"rgba(2,5,16,0.85)" }}>
              <div className="flex-1 px-2">
                <textarea 
                  rows={1} 
                  value={input} 
                  onChange={e=>setInput(e.target.value)} 
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendQuery(input);
                    }
                  }} 
                  placeholder="Ask any question about your documents (e.g. What are our top Q3 risks?)..." 
                  className="w-full bg-transparent text-sm text-white outline-none resize-none placeholder:text-slate-400 leading-relaxed font-medium" 
                  style={{ maxHeight:120, fontFamily: "'Outfit', sans-serif" }}
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={toggleMic} 
                  className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all cursor-pointer ${isListening?"bg-cyan-500/20 border-cyan-400 text-cyan-300":"border-white/10 text-slate-400 hover:text-white"}`}
                >
                  <Mic size={15}/>
                </button>
                <button 
                  onClick={() => sendQuery(input)} 
                  disabled={!input.trim() || thinking || isTyping} 
                  className="neon-btn w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer disabled:opacity-50" 
                  style={{ background:"linear-gradient(135deg,#7c3aed,#5b21b6)", boxShadow:"0 0 20px rgba(124,58,237,.6)" }}
                >
                  <Send size={16} className="text-white"/>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Citation Source Inspector Modal / Sidebar */}
        {selectedCitation ? (
          <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} className="w-80 p-5 space-y-4 overflow-y-auto" style={{ background:"rgba(2,5,16,0.95)", borderLeft:"1px solid rgba(124,58,237,.25)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-cyan-300 tracking-wider">CITATION SOURCE</h3>
              <button onClick={() => setSelectedCitation(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <Glass className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-violet-400"/>
                <div className="text-sm font-extrabold text-white truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>{selectedCitation.docName}</div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400 font-bold">{selectedCitation.score}% Match Score</span>
                <span className="text-slate-400">RAG Chunk #12</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed p-3 rounded-xl bg-white/5 border border-white/10 font-mono">
                "{selectedCitation.snippet}"
              </p>
              <button 
                onClick={() => {
                  const match = DOCS.find(d => d.title === selectedCitation.docName) || DOCS[0];
                  if (onSelectDoc) onSelectDoc(match);
                  else if (onNav) onNav("details");
                }} 
                className="w-full py-2 rounded-xl text-xs font-extrabold text-white bg-violet-600/40 hover:bg-violet-600/70 border border-violet-400/50 cursor-pointer transition-all"
              >
                Inspect Full Document →
              </button>
            </Glass>
          </motion.div>
        ) : (
          <div className="hidden xl:flex flex-col w-72 p-5 gap-4 overflow-y-auto" style={{ borderLeft:"1px solid rgba(124,58,237,.08)" }}>
            <div className="relative rounded-2xl overflow-hidden" style={{ height:110 }}>
              <img src={IMG.waves} alt="" className="w-full h-full object-cover" style={{ opacity:.6 }}/>
              <div className="absolute inset-0" style={{ background:"linear-gradient(180deg,transparent,rgba(2,5,16,.85))" }}/>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-xs font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Knowledge Base Active</div>
                <div className="text-[10px] font-mono" style={{ color:"rgba(167,139,250,.7)" }}>12 Indexed Documents · 524 Vector Chunks</div>
              </div>
            </div>

            <Glass className="p-4 space-y-3">
              <div className="text-[10px] font-mono font-bold tracking-wider" style={{ color:"rgba(180,185,230,.5)" }}>SUGGESTED QUERIES</div>
              <div className="space-y-2">
                {[
                  "What are our top revenue growth drivers?",
                  "Summarize AI architecture v3 specifications",
                  "Compare Q1 vs Q2 financial performance",
                  "List compliance risks across legal docs",
                ].map(q => (
                  <button 
                    key={q} 
                    onClick={() => sendQuery(q)} 
                    className="w-full text-left text-[11px] px-3 py-2.5 rounded-xl transition-all hover:bg-violet-500/20 hover:text-white cursor-pointer font-medium" 
                    style={{ color:"rgba(167,139,250,.9)", border:"1px solid rgba(124,58,237,.2)" }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </Glass>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Knowledge Graph ────────────────────────────────────────── */
const EXPANDED_NODES = [
  { id:"n1", x:480, y:240, label:"AI Strategy 2025", type:"doc", color:"#7c3aed", r:24, docId: 1 },
  { id:"n2", x:680, y:160, label:"Machine Learning RAG", type:"concept", color:"#22d3ee", r:19 },
  { id:"n3", x:840, y:260, label:"Vector Embeddings", type:"concept", color:"#22d3ee", r:16 },
  { id:"n4", x:620, y:400, label:"Q2 Financial Overview", type:"doc", color:"#7c3aed", r:22, docId: 2 },
  { id:"n5", x:320, y:340, label:"Enterprise AI Core", type:"concept", color:"#22d3ee", r:20 },
  { id:"n6", x:180, y:200, label:"Data Governance Architecture", type:"doc", color:"#7c3aed", r:18, docId: 11 },
  { id:"n7", x:500, y:90,  label:"Neural Insights Engine", type:"insight", color:"#ec4899", r:19 },
  { id:"n8", x:860, y:120, label:"ChromaDB Vector Store", type:"entity", color:"#10b981", r:17 },
  { id:"n9", x:380, y:470, label:"Risk & Compliance Audit", type:"doc", color:"#7c3aed", r:17, docId: 5 },
  { id:"n10",x:780, y:460, label:"Security Hub v3", type:"entity", color:"#10b981", r:16 },
  { id:"n11",x:280, y:100, label:"ESG Sustainability Report", type:"doc", color:"#7c3aed", r:18, docId: 7 },
  { id:"n12",x:940, y:360, label:"Product Roadmap H2", type:"doc", color:"#7c3aed", r:19, docId: 3 },
  { id:"n13",x:140, y:360, label:"Supply Chain Logistics", type:"doc", color:"#7c3aed", r:17, docId: 10 },
  { id:"n14",x:420, y:160, label:"Gemini 3.1 Flash LLM", type:"insight", color:"#ec4899", r:18 },
  { id:"n15",x:720, y:300, label:"Hybrid BM25 Search", type:"concept", color:"#22d3ee", r:15 },
  { id:"n16",x:1020,y:200, label:"Cloud Microservices", type:"doc", color:"#7c3aed", r:18, docId: 12 },
];

const EXPANDED_EDGES = [
  ["n1","n2"],["n1","n5"],["n1","n7"],["n1","n14"],
  ["n2","n3"],["n2","n7"],["n2","n15"],
  ["n3","n8"],["n3","n12"],
  ["n4","n5"],["n4","n10"],["n4","n9"],
  ["n5","n6"],["n5","n9"],["n5","n13"],
  ["n6","n11"],["n6","n9"],
  ["n7","n14"],["n8","n15"],
  ["n9","n10"],["n10","n12"],["n12","n16"]
];

function GraphPage({ onNav, onSelectDoc }: { onNav?: (p: Page) => void; onSelectDoc?: (doc: typeof DOCS[0]) => void }) {
  const [active, setActive] = useState<string|null>("n1");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomScale, setZoomScale] = useState(1.0);

  const getN = (id: string) => EXPANDED_NODES.find(n => n.id===id)!;
  const selectedNode = EXPANDED_NODES.find(n => n.id === active);

  const filteredNodes = EXPANDED_NODES.filter(n => {
    const matchesType = filterType === "all" || n.type === filterType;
    const matchesSearch = !searchQuery || n.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col" style={{ height:"100vh" }}>
      <TopBar title="3D Interactive Knowledge Graph" subtitle={`${EXPANDED_NODES.length} neural nodes · ${EXPANDED_EDGES.length} relationship vectors active`} onNav={onNav}/>
      
      {/* Top Filter & Search Controls */}
      <div className="px-8 py-3 bg-black/40 border-b flex items-center justify-between gap-4" style={{ borderColor:"rgba(124,58,237,.15)" }}>
        <div className="flex items-center gap-2">
          {["all","doc","concept","insight","entity"].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className="px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer"
              style={{
                background: filterType === t ? "linear-gradient(135deg,rgba(124,58,237,.4),rgba(91,33,182,.3))" : "rgba(255,255,255,0.04)",
                color: filterType === t ? "#c4b5fd" : "rgba(180,185,230,.5)",
                border: filterType === t ? "1px solid rgba(167,139,250,.4)" : "1px solid rgba(255,255,255,.08)"
              }}
            >
              {t === "all" ? "All Nodes (16)" : t === "doc" ? "Documents (8)" : t === "concept" ? "Concepts (4)" : t === "insight" ? "AI Insights (2)" : "Entities (2)"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="glass rounded-xl flex items-center gap-2 px-3 py-1.5" style={{ border:"1px solid rgba(124,58,237,.25)" }}>
            <Search size={14} className="text-violet-400"/>
            <input 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              placeholder="Find node in graph…" 
              className="bg-transparent text-xs text-white outline-none w-44 font-medium placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button onClick={() => setZoomScale(s => Math.min(s + 0.2, 1.8))} className="px-2.5 py-1 text-xs font-mono text-cyan-300 hover:bg-white/10 rounded-lg cursor-pointer">+</button>
            <span className="text-[10px] font-mono text-slate-400 px-1">{Math.round(zoomScale * 100)}%</span>
            <button onClick={() => setZoomScale(s => Math.max(s - 0.2, 0.6))} className="px-2.5 py-1 text-xs font-mono text-cyan-300 hover:bg-white/10 rounded-lg cursor-pointer">-</button>
            <button onClick={() => setZoomScale(1.0)} className="px-2 py-1 text-[10px] font-mono text-violet-300 hover:bg-white/10 rounded-lg cursor-pointer">Reset</button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Canvas Viewport */}
        <div className="flex-1 relative overflow-hidden bg-black/60">
          <img src={IMG.dark} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity:.08 }}/>
          <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(circle at 50% 50%,rgba(124,58,237,.1) 0%,transparent 80%)" }}/>

          <svg 
            className="w-full h-full transition-transform duration-300 cursor-grab active:cursor-grabbing" 
            viewBox="0 0 1150 560" 
            preserveAspectRatio="xMidYMid meet"
            style={{ transform: `scale(${zoomScale})`, transformOrigin: "center" }}
          >
            <defs>
              {EXPANDED_NODES.map(n => (
                <radialGradient key={`rg-${n.id}`} id={`rg-${n.id}`} cx="38%" cy="32%" r="65%">
                  <stop offset="0%" stopColor={n.color} stopOpacity={.98}/>
                  <stop offset="100%" stopColor={n.color} stopOpacity={.4}/>
                </radialGradient>
              ))}
              <filter id="glow2"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="strong-glow2"><feGaussianBlur stdDeviation="12" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>

            {/* Edge Connections */}
            {EXPANDED_EDGES.map(([a,b], i) => { 
              const na = getN(a); 
              const nb = getN(b); 
              if (!na || !nb) return null;

              const isConnected = active === a || active === b;

              return (
                <g key={`e-${i}`}>
                  <line 
                    x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} 
                    stroke={isConnected ? na.color : "rgba(124,58,237,.25)"} 
                    strokeWidth={isConnected ? 2.5 : 1}
                  />
                  <line 
                    x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} 
                    stroke={na.color} 
                    strokeWidth={isConnected ? 3 : 1.5} 
                    opacity={isConnected ? 0.9 : 0.4} 
                    strokeDasharray="8 6"
                  >
                    <animate attributeName="stroke-dashoffset" from="140" to="0" dur={`${3 + i * .3}s`} repeatCount="indefinite"/>
                  </line>
                </g>
              ); 
            })}

            {/* Nodes */}
            {filteredNodes.map(node => { 
              const isA = active === node.id; 
              const isMatch = searchQuery && node.label.toLowerCase().includes(searchQuery.toLowerCase());

              return (
                <g 
                  key={node.id} 
                  className="cursor-pointer transition-all duration-300" 
                  onClick={() => setActive(isA ? null : node.id)}
                >
                  {/* Glowing Outer Halo */}
                  <circle 
                    cx={node.x} cy={node.y} 
                    r={node.r + (isA ? 28 : isMatch ? 20 : 12)} 
                    fill={node.color} 
                    opacity={isA ? .35 : isMatch ? .4 : .08} 
                    filter={isA || isMatch ? "url(#strong-glow2)" : undefined}
                  >
                    {(isA || isMatch) && <animate attributeName="r" values={`${node.r + 14};${node.r + 28};${node.r + 14}`} dur="2s" repeatCount="indefinite"/>}
                  </circle>

                  {/* Concentric Border Ring */}
                  <circle cx={node.x} cy={node.y} r={node.r + 6} fill="none" stroke={node.color} strokeWidth={isA ? 1.5 : .5} opacity={isA ? .8 : .3}/>
                  
                  {/* Core Node Circle */}
                  <circle 
                    cx={node.x} cy={node.y} 
                    r={node.r} 
                    fill={`url(#rg-${node.id})`} 
                    filter="url(#glow2)" 
                    stroke={isMatch ? "#fbbf24" : node.color} 
                    strokeWidth={isA || isMatch ? 3 : 1.5} 
                    strokeOpacity={isA || isMatch ? 1 : .7}
                  />

                  {/* Inner Highlight Sphere Accent */}
                  <circle cx={node.x - node.r * .25} cy={node.y - node.r * .25} r={node.r * .35} fill="rgba(255,255,255,.2)"/>

                  {/* Node Label Text */}
                  <text 
                    x={node.x} y={node.y + node.r + 18} 
                    textAnchor="middle" 
                    fill={isA ? "#38bdf8" : isMatch ? "#fbbf24" : "#ffffff"} 
                    fontSize={isA ? "12" : "10"} 
                    fontFamily="'Outfit', sans-serif" 
                    fontWeight={isA || isMatch ? "800" : "600"}
                  >
                    {node.label}
                  </text>
                </g>
              ); 
            })}
          </svg>

          {/* Node Type Legend Overlay */}
          <div className="absolute top-5 left-5 pointer-events-none">
            <Glass className="px-4 py-3">
              <div className="text-[9px] font-mono font-bold tracking-widest mb-2" style={{ color:"rgba(180,185,230,.5)" }}>NODE TYPES & COLOR LEGEND</div>
              <div className="grid grid-cols-2 gap-3">
                {[{c:"#7c3aed",l:"Document Node"},{c:"#22d3ee",l:"Concept Cluster"},{c:"#ec4899",l:"AI Insight"},{c:"#10b981",l:"Entity Store"}].map(({c,l})=>(
                  <div key={l} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background:c, boxShadow:`0 0 8px ${c}` }}/>
                    <span className="text-[11px] font-semibold text-slate-300">{l}</span>
                  </div>
                ))}
              </div>
            </Glass>
          </div>
        </div>

        {/* Node Inspector Side Drawer */}
        <div className="w-80 flex flex-col gap-4 p-5 overflow-y-auto" style={{ background:"rgba(2,5,16,0.95)", borderLeft:"1px solid rgba(124,58,237,.2)" }}>
          {selectedNode ? (
            <motion.div key={selectedNode.id} initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor:"rgba(255,255,255,.08)" }}>
                <h3 className="text-xs font-mono font-bold text-cyan-300 tracking-wider">NODE INSPECTOR</h3>
                <button onClick={() => setActive(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>

              {/* Cover Card */}
              <div className="relative rounded-2xl overflow-hidden" style={{ height:140, border:`1.5px solid ${selectedNode.color}40` }}>
                <img src={DOCS.find(d => d.id === selectedNode.docId)?.img || IMG.tech} alt="" className="w-full h-full object-cover" style={{ opacity:.65 }}/>
                <div className="absolute inset-0" style={{ background:"linear-gradient(180deg,transparent 20%,rgba(2,5,16,.95) 100%)" }}/>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-xl font-mono uppercase tracking-wider mb-1 inline-block" style={{ background:`${selectedNode.color}25`, color:selectedNode.color, border:`1px solid ${selectedNode.color}50` }}>
                    {selectedNode.type}
                  </span>
                  <div className="text-base font-extrabold text-white leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {selectedNode.label}
                  </div>
                </div>
              </div>

              {/* Node Stats */}
              <Glass className="p-4 space-y-2.5">
                {[
                  { l: "Vector Cluster ID", v: selectedNode.id },
                  { l: "Semantic Relevance", v: "98.4% Similarity" },
                  { l: "Connected Neighbors", v: `${EXPANDED_EDGES.filter(([a,b])=>a===selectedNode.id||b===selectedNode.id).length} edges` },
                  { l: "Knowledge Domain", v: selectedNode.type === "doc" ? "Document Archive" : "AI Concept Matrix" }
                ].map(({ l, v }) => (
                  <div key={l} className="flex justify-between py-1.5 text-xs border-b last:border-none" style={{ borderColor:"rgba(255,255,255,.05)" }}>
                    <span style={{ color:"rgba(180,185,230,.5)" }}>{l}</span>
                    <span className="text-white font-mono font-bold">{v}</span>
                  </div>
                ))}
              </Glass>

              {/* Neighboring Connected Nodes */}
              <div>
                <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 mb-2">CONNECTED NEIGHBORS</div>
                <div className="flex flex-wrap gap-1.5">
                  {EXPANDED_EDGES
                    .filter(([a,b]) => a === selectedNode.id || b === selectedNode.id)
                    .map(([a,b]) => {
                      const targetId = a === selectedNode.id ? b : a;
                      const targetNode = getN(targetId);
                      if (!targetNode) return null;
                      return (
                        <button
                          key={targetNode.id}
                          onClick={() => setActive(targetNode.id)}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-xl transition-all hover:scale-105 cursor-pointer"
                          style={{ background: `${targetNode.color}20`, color: targetNode.color, border: `1px solid ${targetNode.color}40` }}
                        >
                          {targetNode.label}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Action Triggers */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    const matchDoc = DOCS.find(d => d.id === selectedNode.docId) || DOCS[0];
                    if (onSelectDoc) onSelectDoc(matchDoc);
                    else if (onNav) onNav("details");
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#5b21b6)", boxShadow: "0 0 20px rgba(124,58,237,.5)" }}
                >
                  <Eye size={13}/> Inspect Node Document
                </button>

                <button
                  onClick={() => onNav && onNav("chat")}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-cyan-300 flex items-center justify-center gap-2 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 cursor-pointer transition-all"
                >
                  <Sparkles size={13}/> Ask AI About This Node
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 opacity-60">
              <div className="levB"><DataCube size={54}/></div>
              <div>
                <div className="text-xs font-bold text-white mb-1">Knowledge Explorer Active</div>
                <p className="text-[11px]" style={{ color:"rgba(180,185,230,.5)" }}>Click any node or vector line to inspect its semantic connections</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Analytics ──────────────────────────────────────────────── */
function AnalyticsPage({ onNav }: { onNav?: (p: Page) => void }) {
  return (
    <div>
      <TopBar title="Analytics" subtitle="Knowledge intelligence metrics · Jul 2026" onNav={onNav}/>
      <div className="px-8 py-6 space-y-5">
        <div className="relative rounded-2xl overflow-hidden" style={{ height:120 }}><img src={IMG.paint} alt="" className="w-full h-full object-cover" style={{ opacity:.55 }}/><div className="absolute inset-0" style={{ background:"linear-gradient(90deg,rgba(2,5,16,.9),rgba(124,58,237,.25) 50%,rgba(2,5,16,.85))" }}/><div className="absolute inset-0 flex items-center px-8"><div><h2 className="text-xl font-black text-white" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:"-.5px" }}>Intelligence Analytics</h2><p className="text-xs mt-1" style={{ color:"rgba(200,205,240,.5)" }}>Real-time insights from your knowledge operations</p></div></div></div>
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
            <StatW label="Total Queries" n={34891} delta="+21%" icon={MessageSquare} color="#7c3aed"/>
            <StatW label="Avg Response" n={1} delta="-18%" icon={Zap} color="#10b981"/>
            <StatW label="Docs Indexed" n={847} delta="+12%" icon={FileText} color="#22d3ee"/>
            <StatW label="Accuracy" n={99} delta="+0.4%" icon={Shield} color="#ec4899"/>
          </div>
          <div className="grid xl:grid-cols-2 gap-4 mb-4">
            <Glass className="p-5"><h3 className="text-sm font-bold text-white mb-1">Monthly Trends</h3><p className="text-xs mb-4" style={{ color:"rgba(180,185,230,.4)" }}>Documents, queries and insights</p>
              <ResponsiveContainer width="100%" height={200}><BarChart data={monthData} margin={{ left:-20, bottom:0 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/><XAxis dataKey="m" tick={{ fill:"rgba(180,185,230,.35)", fontSize:10 }} axisLine={false} tickLine={false}/><YAxis tick={{ fill:"rgba(180,185,230,.35)", fontSize:10 }} axisLine={false} tickLine={false}/><Tooltip content={<ChartTip/>}/><Bar key="bd2" dataKey="docs" name="Documents" fill="#7c3aed" radius={[4,4,0,0]} opacity={.9}/><Bar key="bi2" dataKey="insights" name="Insights" fill="#22d3ee" radius={[4,4,0,0]} opacity={.75}/></BarChart></ResponsiveContainer>
            </Glass>
            <Glass className="p-5"><h3 className="text-sm font-bold text-white mb-1">Query Volume</h3><p className="text-xs mb-4" style={{ color:"rgba(180,185,230,.4)" }}>Monthly AI query trend</p>
              <ResponsiveContainer width="100%" height={200}><LineChart data={monthData} margin={{ left:-20, bottom:0 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/><XAxis dataKey="m" tick={{ fill:"rgba(180,185,230,.35)", fontSize:10 }} axisLine={false} tickLine={false}/><YAxis tick={{ fill:"rgba(180,185,230,.35)", fontSize:10 }} axisLine={false} tickLine={false}/><Tooltip content={<ChartTip/>}/><defs><linearGradient key="lg2" id="lg3" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#ec4899"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs><Line key="lq2" type="monotone" dataKey="queries" name="Queries" stroke="url(#lg3)" strokeWidth={2.5} dot={{ fill:"#ec4899", strokeWidth:0, r:3 }} activeDot={{ r:6, fill:"#ec4899" }}/></LineChart></ResponsiveContainer>
            </Glass>
          </div>
          <div className="grid xl:grid-cols-3 gap-4">
            <Glass className="p-5"><h3 className="text-sm font-bold text-white mb-4">Query Categories</h3>
              <div className="space-y-3.5">{[{l:"Financial Analysis",p:34,c:"#7c3aed"},{l:"Strategic Planning",p:26,c:"#22d3ee"},{l:"Risk Assessment",p:18,c:"#ec4899"},{l:"Compliance",p:12,c:"#10b981"},{l:"Product Research",p:10,c:"#f59e0b"}].map(({l,p,c})=>(
                <div key={l}><div className="flex justify-between text-xs mb-1.5"><span style={{ color:"rgba(180,185,230,.65)" }}>{l}</span><span className="font-mono font-bold" style={{ color:c }}>{p}%</span></div><div className="h-2 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,.05)" }}><div className="h-full rounded-full relative overflow-hidden" style={{ width:`${p}%`, background:`linear-gradient(90deg,${c},${c}88)`, boxShadow:`0 0 8px ${c}66` }}><div className="absolute inset-0" style={{ background:"linear-gradient(90deg,transparent 40%,rgba(255,255,255,.2) 60%,transparent 80%)", animation:"shimmer 2.5s ease-in-out infinite" }}/></div></div></div>
              ))}</div>
            </Glass>
            <Glass className="p-5 xl:col-span-2"><h3 className="text-sm font-bold text-white mb-4">Recent AI Activity</h3>
              <div className="space-y-1.5">{[{a:"Document analyzed",d:"AI Strategy Report 2025",t:"2 min ago",c:"#7c3aed"},{a:"Insight generated",d:"Q2 Financial Overview",t:"8 min ago",c:"#22d3ee"},{a:"Knowledge graph updated",d:"Product Roadmap H2",t:"15 min ago",c:"#ec4899"},{a:"Semantic index updated",d:"Customer Research Findings",t:"23 min ago",c:"#10b981"},{a:"Summary generated",d:"Engineering Architecture Doc",t:"41 min ago",c:"#f59e0b"},{a:"Relationships mapped",d:"Compliance Framework v3",t:"1 hr ago",c:"#22d3ee"}].map(({a,d,t,c},i)=>(
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/[0.025] cursor-pointer group"><div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:c, boxShadow:`0 0 6px ${c}` }}/><span className="text-xs" style={{ color:"rgba(180,185,230,.55)" }}>{a}</span><span className="text-xs font-semibold text-white truncate flex-1">{d}</span><span className="text-[10px] shrink-0 font-mono" style={{ color:"rgba(180,185,230,.3)" }}>{t}</span><ChevronRight size={11} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color:"rgba(167,139,250,.5)" }}/></div>
              ))}</div>
            </Glass>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Upload ─────────────────────────────────────────────────── */
function UploadPage({ onNav }: { onNav?: (p: Page) => void }) {
  const [dragging, setDragging] = useState(false);
  const files = [{ name:"Board Meeting Notes Q3.pdf",size:"1.8 MB",progress:100,status:"analyzed" },{ name:"Market Analysis 2026.docx",size:"3.2 MB",progress:64,status:"processing" },{ name:"Competitive Intelligence Report.pdf",size:"5.1 MB",progress:28,status:"processing" }];
  return (
    <div>
      <TopBar title="Upload Documents" subtitle="Upload and instantly analyze with AI" onNav={onNav}/>
      <div className="px-8 py-6 space-y-5">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}>
          <div className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ${dragging?"scale-[1.01]":""}`} style={{ minHeight:280, border:`2px dashed ${dragging?"rgba(124,58,237,.6)":"rgba(124,58,237,.2)"}`, background:`rgba(124,58,237,${dragging?.08:.03})` }} onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);}}>
            <img src={IMG.waves} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity:.07, filter:"blur(2px)" }}/>
            <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,rgba(2,5,16,.85),rgba(76,29,149,.2),rgba(2,5,16,.9))" }}/>
            <div className="relative z-10 flex flex-col items-center justify-center py-16 gap-6">
              <div className="levA"><AICore size={130}/></div>
              <div className="text-center"><h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:"-.5px" }}>{dragging?"Release to upload":"Drop documents here"}</h3><p className="text-sm" style={{ color:"rgba(180,185,230,.45)" }}>PDF, DOCX, TXT, XLSX · Up to 500 MB · Instant AI analysis</p></div>
              <VBtn icon={<Upload size={15}/>}>Browse files</VBtn>
            </div>
          </div>
          <Glass className="p-6 mt-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] -z-10 mix-blend-screen pointer-events-none" />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Knowledge Ingestion Engine</h3>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full flex items-center gap-1.5" style={{ background:"rgba(16,185,129,.15)", color:"#34d399", border:"1px solid rgba(16,185,129,.3)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> System Ready
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Semantic Chunking", desc: "Recursive text splitting", icon: <Layers size={14} />, color: "#7c3aed" },
                { label: "Vector Embedding", desc: "768-dim dense vectors", icon: <Network size={14} />, color: "#ec4899" },
                { label: "Graph Extraction", desc: "Entity & relation mapping", icon: <Share2 size={14} />, color: "#22d3ee" }
              ].map((step, i) => (
                <div key={i} className="p-4 rounded-xl relative overflow-hidden group" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${step.color}, transparent)` }} />
                  <div className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center" style={{ background: `${step.color}20`, color: step.color }}>
                    {step.icon}
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">{step.label}</h4>
                  <p className="text-[10px]" style={{ color: "rgba(180,185,230,.5)" }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </Glass>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Shared auth input ──────────────────────────────────────── */
function AuthInput({ label, type, value, onChange, placeholder, right }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string; right?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold tracking-[2px] mb-2 block" style={{ color:"rgba(167,139,250,.65)" }}>{label.toUpperCase()}</label>
      <div className="relative">
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none border transition-all duration-300"
          style={{ background:"rgba(255,255,255,.03)", borderColor:"rgba(124,58,237,.18)", fontFamily:"Inter,sans-serif" }}
          onFocus={e => { e.currentTarget.style.borderColor="rgba(124,58,237,.55)"; e.currentTarget.style.boxShadow="0 0 0 3px rgba(124,58,237,.1)"; }}
          onBlur={e  => { e.currentTarget.style.borderColor="rgba(124,58,237,.18)"; e.currentTarget.style.boxShadow="none"; }}
        />
        {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
    </div>
  );
}

function SSORow({ label }: { label?: string }) {
  return (
    <div>
      {label && (
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ background:"rgba(124,58,237,.15)" }} />
          <span className="text-[10px] font-mono" style={{ color:"rgba(180,185,230,.35)" }}>{label}</span>
          <div className="flex-1 h-px" style={{ background:"rgba(124,58,237,.15)" }} />
        </div>
      )}
      <div className="grid grid-cols-3 gap-2">
        {[
          { name:"Google", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
          { name:"Microsoft", icon: <svg width="14" height="14" viewBox="0 0 24 24"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg> },
          { name:"SSO", icon: <Shield size={12} style={{ color:"#a78bfa" }} /> },
        ].map(({ name, icon }) => (
          <button key={name} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-medium border transition-all hover:scale-105 hover:border-violet-500/35 hover:bg-white/[0.05]" style={{ borderColor:"rgba(255,255,255,.07)", color:"rgba(180,185,230,.5)", background:"rgba(255,255,255,.02)" }}>
            {icon}{name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Shared left marketing panel ───────────────────────────── */
function AuthLeftPanel({ accentColor="violet" }: { accentColor?: "violet" | "cyan" }) {
  const isV = accentColor === "violet";
  const FEATURES = [
    { icon:MessageSquare, label:"AI Powered Chat",       desc:"Chat with docs using RAG",              color:"#7c3aed" },
    { icon:Network,       label:"Knowledge Graphs",      desc:"Visualise entity relationships",        color:"#22d3ee" },
    { icon:FileText,      label:"Document Intelligence", desc:"Extract insights from any document",    color:"#ec4899" },
    { icon:Search,        label:"Smart Search",          desc:"Semantic vector-powered search",        color:"#10b981" },
    { icon:Shield,        label:"Enterprise Security",   desc:"SOC 2 Type II · GDPR · ISO 27001",      color:"#f59e0b" },
  ];
  return (
    <div className="hidden xl:flex flex-col w-[360px] shrink-0 relative overflow-hidden" style={{ borderRight:"1px solid rgba(124,58,237,.12)" }}>
      <img src={IMG.waves} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity:.22 }} />
      <div className="absolute inset-0" style={{ background:"linear-gradient(160deg,rgba(2,5,16,.9) 0%,rgba(76,29,149,.3) 55%,rgba(2,5,16,.94) 100%)" }} />
      <div className="absolute inset-0" style={{ backgroundImage:"linear-gradient(rgba(124,58,237,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.06) 1px,transparent 1px)", backgroundSize:"42px 42px" }} />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background:`linear-gradient(90deg,transparent,${isV?"rgba(124,58,237,.8)":"rgba(34,211,238,.8)"},transparent)` }} />

      <div className="relative z-10 flex flex-col h-full p-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#7c3aed,#5b21b6)", boxShadow:"0 0 20px rgba(124,58,237,.7)" }}>
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <div className="font-black text-white text-sm leading-none">AI-KOS</div>
            <div className="text-[8px] tracking-[3px]" style={{ color:"rgba(167,139,250,.6)" }}>ENTERPRISE</div>
          </div>
        </div>

        {/* 3D element */}
        <div className="flex justify-center mb-6 relative">
          <div className="levA relative">
            <AICore size={160} />
            <div className="levC absolute -bottom-3 -right-4 opacity-55" style={{ animationDelay:"1.5s" }}><DataCube size={32} /></div>
            <div className="levB absolute -top-2 -left-3 opacity-38" style={{ animationDelay:"0.8s" }}><DataCube size={22} /></div>
          </div>
        </div>

        <h2 className="text-[22px] font-black text-white mb-2 leading-snug" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:"-1px" }}>
          Unlock the Power of<br /><span className="grad-text">Knowledge.</span>
        </h2>
        <p className="text-[11px] leading-relaxed mb-6" style={{ color:"rgba(180,185,230,.48)" }}>
          AI-KOS Enterprise helps teams capture, understand, connect, and activate information using the power of AI.
        </p>

        <div className="space-y-2.5 flex-1">
          {FEATURES.map(({ icon:Icon, label, desc, color }) => (
            <div key={label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl group cursor-default transition-all hover:bg-white/[0.04]" style={{ border:"1px solid rgba(255,255,255,.04)" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background:`${color}18`, border:`1px solid ${color}30` }}>
                <Icon size={13} style={{ color }} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white leading-none mb-0.5">{label}</div>
                <div className="text-[9px] leading-none" style={{ color:"rgba(180,185,230,.38)" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-5" style={{ borderTop:"1px solid rgba(124,58,237,.1)" }}>
          <div className="text-[8px] font-mono tracking-[2.5px] mb-3" style={{ color:"rgba(167,139,250,.38)" }}>TRUSTED BY ENTERPRISES WORLDWIDE</div>
          <div className="flex items-center gap-4">
            {[{n:"10K+",l:"Documents"},{n:"99.2%",l:"Accuracy"},{n:"500+",l:"Enterprises"},{n:"24/7",l:"Support"}].map(({n,l})=>(
              <div key={l} className="text-center">
                <div className="text-sm font-black grad-text leading-none">{n}</div>
                <div className="text-[8px] mt-0.5" style={{ color:"rgba(180,185,230,.28)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background:"linear-gradient(90deg,transparent,rgba(124,58,237,.5),transparent)" }} />
    </div>
  );
}

/* ─── Login Page (full standalone) ──────────────────────────── */
function LoginPage({ onLogin, onBack, onGoRegister }: { onLogin:()=>void; onBack:()=>void; onGoRegister:()=>void }) {
  const [email,   setEmail]   = useState("");
  const [pass,    setPass]    = useState("");
  const [remember,setRemember]= useState(true);
  const [loading, setLoading] = useState(false);
  const handle = () => { setLoading(true); setTimeout(() => { setLoading(false); onLogin(); }, 1600); };

  return (
    <div className="relative z-10 min-h-screen flex overflow-hidden">
      <AuthLeftPanel accentColor="violet" />

      {/* Right — form panel */}
      <div className="flex flex-1 items-center justify-center relative">
        <img src={IMG.glow} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ opacity:.04 }} />
        <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at 60% 40%,rgba(124,58,237,.08),transparent 65%)" }} />

        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, ease:[.22,1,.36,1] }} className="w-full max-w-[420px] px-6 py-10 relative z-10">
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs mb-7 transition-colors hover:text-violet-400" style={{ color:"rgba(167,139,250,.4)" }}>← Back to home</button>

          <div className="glass rounded-3xl p-8" style={{ border:"1px solid rgba(124,58,237,.2)", boxShadow:"0 32px 80px rgba(0,0,0,.55),0 0 0 1px rgba(124,58,237,.08),inset 0 1px 0 rgba(255,255,255,.07)" }}>
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"linear-gradient(135deg,#7c3aed,#5b21b6)", boxShadow:"0 0 14px rgba(124,58,237,.7)" }}>
                <Brain size={14} className="text-white" />
              </div>
              <span className="text-[9px] font-bold tracking-[3px]" style={{ color:"rgba(167,139,250,.65)" }}>AI-KOS ENTERPRISE</span>
              <div className="ml-auto w-1.5 h-1.5 rounded-full softPulse" style={{ background:"#10b981", boxShadow:"0 0 6px #10b981" }} />
            </div>

            <div className="mb-5">
              <h2 className="text-[26px] font-black text-white leading-none mb-1" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:"-.8px" }}>
                Welcome Back! <span className="text-2xl">👋</span>
              </h2>
              <p className="text-xs mt-1.5" style={{ color:"rgba(180,185,230,.45)" }}>Sign in to continue to your AI-KOS account</p>
            </div>

            <div className="h-px mb-6" style={{ background:"linear-gradient(90deg,transparent,rgba(124,58,237,.45),rgba(34,211,238,.25),transparent)" }} />

            <div className="space-y-4">
              <AuthInput label="Email address" type="email" value={email} onChange={setEmail} placeholder="Enter your email" />
              <AuthInput label="Password" type="password" value={pass} onChange={setPass} placeholder="Enter your password"
                right={<button className="text-[10px] font-semibold hover:text-violet-400 transition-colors whitespace-nowrap" style={{ color:"rgba(167,139,250,.6)" }}>Forgot password?</button>}
              />

              <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setRemember(r => !r)}>
                <div className="w-4 h-4 rounded flex items-center justify-center transition-all" style={{ background:remember?"rgba(124,58,237,.9)":"rgba(255,255,255,.05)", border:`1px solid ${remember?"rgba(124,58,237,.7)":"rgba(255,255,255,.12)"}`, boxShadow:remember?"0 0 8px rgba(124,58,237,.5)":"none" }}>
                  {remember && <Check size={9} className="text-white" />}
                </div>
                <span className="text-xs" style={{ color:"rgba(180,185,230,.5)" }}>Remember me</span>
              </div>

              <button onClick={handle} disabled={loading} className="neon-btn w-full py-3.5 rounded-xl font-bold text-white text-sm" style={{ background:loading?"rgba(124,58,237,.35)":"linear-gradient(135deg,#7c3aed,#5b21b6)", boxShadow:loading?"none":"0 0 28px rgba(124,58,237,.6)" }}>
                {loading
                  ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeLinecap="round"/></svg>Authenticating…</span>
                  : "Sign In →"}
              </button>

              <SSORow label="or continue with" />

              <p className="text-center text-[11px]" style={{ color:"rgba(180,185,230,.35)" }}>
                {"Don't have an account? "}
                <button onClick={onGoRegister} className="font-bold hover:text-violet-300 transition-colors" style={{ color:"#a78bfa" }}>Sign up</button>
              </p>
            </div>
          </div>

          <p className="text-center text-[9px] mt-5 font-mono" style={{ color:"rgba(180,185,230,.2)" }}>SOC 2 Type II · ISO 27001 · GDPR Compliant</p>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Register Page (full standalone) ───────────────────────── */
function RegisterPage({ onLogin, onGoLogin }: { onLogin:()=>void; onGoLogin:()=>void }) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [pass,    setPass]    = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed,  setAgreed]  = useState(false);
  const [loading, setLoading] = useState(false);
  const strength = Math.min(4, Math.floor(pass.length / 3));
  const strengthColor = strength <= 1 ? "#ef4444" : strength === 2 ? "#f59e0b" : strength === 3 ? "#22d3ee" : "#10b981";
  const handle = () => { if (!agreed) return; setLoading(true); setTimeout(() => { setLoading(false); onLogin(); }, 1600); };

  return (
    <div className="relative z-10 min-h-screen flex overflow-hidden">
      <AuthLeftPanel accentColor="cyan" />

      {/* Right — form panel */}
      <div className="flex flex-1 items-center justify-center relative">
        <img src={IMG.dark} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ opacity:.05 }} />
        <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at 50% 40%,rgba(34,211,238,.07),transparent 65%)" }} />

        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, ease:[.22,1,.36,1] }} className="w-full max-w-[460px] px-6 py-10 relative z-10">
          <button onClick={onGoLogin} className="flex items-center gap-1.5 text-xs mb-7 transition-colors hover:text-cyan-400" style={{ color:"rgba(34,211,238,.4)" }}>← Back to Sign In</button>

          <div className="glass rounded-3xl p-8" style={{ border:"1px solid rgba(34,211,238,.18)", boxShadow:"0 32px 80px rgba(0,0,0,.55),0 0 0 1px rgba(34,211,238,.06),inset 0 1px 0 rgba(255,255,255,.06)" }}>
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"linear-gradient(135deg,#22d3ee,#0891b2)", boxShadow:"0 0 14px rgba(34,211,238,.6)" }}>
                <Sparkles size={13} className="text-white" />
              </div>
              <span className="text-[9px] font-bold tracking-[3px]" style={{ color:"rgba(34,211,238,.65)" }}>FREE TRIAL · NO CREDIT CARD</span>
            </div>

            <div className="mb-5">
              <h2 className="text-[26px] font-black text-white leading-none mb-1" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:"-.8px" }}>
                Create Account <span className="text-2xl">🚀</span>
              </h2>
              <p className="text-xs mt-1.5" style={{ color:"rgba(180,185,230,.45)" }}>Set up your AI-KOS account to get started</p>
            </div>

            <div className="h-px mb-6" style={{ background:"linear-gradient(90deg,transparent,rgba(34,211,238,.4),rgba(124,58,237,.2),transparent)" }} />

            <div className="space-y-3.5">
              <AuthInput label="Full Name" type="text" value={name} onChange={setName} placeholder="Enter your full name" />
              <AuthInput label="Work Email" type="email" value={email} onChange={setEmail} placeholder="Enter your work email" />
              <AuthInput label="Password" type="password" value={pass} onChange={setPass} placeholder="Create a strong password" />

              {/* Strength meter */}
              {pass.length > 0 && (
                <div>
                  <div className="flex gap-1.5 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-400" style={{ background: i <= strength ? strengthColor : "rgba(255,255,255,.07)" }} />
                    ))}
                  </div>
                  <div className="text-[9px] font-mono" style={{ color: strengthColor }}>
                    {strength <= 1 ? "Weak" : strength === 2 ? "Fair" : strength === 3 ? "Good" : "Strong"} password
                  </div>
                </div>
              )}

              <AuthInput label="Confirm Password" type="password" value={confirm} onChange={setConfirm} placeholder="Confirm your password"
                right={confirm.length > 0 ? (
                  confirm === pass
                    ? <Check size={13} style={{ color:"#10b981" }} />
                    : <X size={13} style={{ color:"#ef4444" }} />
                ) : undefined}
              />

              <div className="flex items-start gap-2.5 cursor-pointer select-none pt-0.5" onClick={() => setAgreed(a => !a)}>
                <div className="w-4 h-4 rounded flex items-center justify-center mt-0.5 shrink-0 transition-all" style={{ background:agreed?"rgba(34,211,238,.85)":"rgba(255,255,255,.05)", border:`1px solid ${agreed?"rgba(34,211,238,.6)":"rgba(255,255,255,.12)"}`, boxShadow:agreed?"0 0 8px rgba(34,211,238,.4)":"none" }}>
                  {agreed && <Check size={9} className="text-white" />}
                </div>
                <span className="text-[11px] leading-relaxed" style={{ color:"rgba(180,185,230,.45)" }}>
                  I agree to the{" "}
                  <span className="font-semibold" style={{ color:"#a78bfa" }}>Terms of Service</span>
                  {" "}and{" "}
                  <span className="font-semibold" style={{ color:"#a78bfa" }}>Privacy Policy</span>
                </span>
              </div>

              <button onClick={handle} disabled={loading || !agreed} className="neon-btn w-full py-3.5 rounded-xl font-bold text-white text-sm" style={{ background:!agreed||loading?"rgba(34,211,238,.18)":"linear-gradient(135deg,#22d3ee,#0891b2)", boxShadow:!agreed||loading?"none":"0 0 28px rgba(34,211,238,.5)", opacity:!agreed&&!loading?.55:1 }}>
                {loading
                  ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeLinecap="round"/></svg>Creating account…</span>
                  : "Create Account →"}
              </button>

              <SSORow label="or sign up with" />

              <p className="text-center text-[11px]" style={{ color:"rgba(180,185,230,.35)" }}>
                Already have an account?{" "}
                <button onClick={onGoLogin} className="font-bold hover:text-violet-300 transition-colors" style={{ color:"#a78bfa" }}>Sign In</button>
              </p>
            </div>
          </div>

          <p className="text-center text-[9px] mt-5 font-mono" style={{ color:"rgba(180,185,230,.2)" }}>Free 14-day trial · No credit card required · Cancel anytime</p>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Document Details ───────────────────────────────────────── */
function DocumentDetailsPage({ onNav, doc }: { onNav:(p:Page)=>void; doc?: typeof DOCS[0] }) {
  const currentDoc = doc || DOCS[0];
  const [tab, setTab] = useState("summary");
  const TABS = [
    { id:"summary",         label:"Summary",         icon:AlignLeft },
    { id:"analysis",        label:"Analysis",        icon:BarChart2 },
    { id:"keywords",        label:"Keywords",        icon:Tag },
    { id:"graph",           label:"Graph",           icon:Network },
    { id:"relationships",   label:"Relationships",   icon:Link2 },
    { id:"recommendations", label:"Recommendations", icon:Lightbulb },
  ];
  const keywords = ["Artificial Intelligence","Machine Learning","Enterprise","Strategy","Digital Transformation","Cloud Computing","Data Analytics","Neural Networks","Deep Learning","Automation","ROI","Competitive Advantage","Innovation","Scalability","Integration"];
  const relations = [
    { doc:"Q2 Financial Overview",       rel:"Financial context", score:94, color:"#22d3ee" },
    { doc:"Product Roadmap H2 2025",     rel:"Strategic alignment", score:87, color:"#10b981" },
    { doc:"Customer Research Findings",  rel:"Market validation", score:82, color:"#ec4899" },
    { doc:"Engineering Architecture Doc",rel:"Technical dependency", score:76, color:"#f59e0b" },
  ];
  return (
    <div>
      <TopBar title={`Document: ${currentDoc.title}`} subtitle={`AI analysis complete · ${currentDoc.type} · ${currentDoc.size}`} onNav={onNav}>
        <div className="flex gap-2 ml-4">
          <GBtn sm><Download size={11}/>Export</GBtn>
          <GBtn sm><Share2 size={11}/>Share</GBtn>
          <VBtn sm icon={<MessageSquare size={11}/>} onClick={()=>onNav("chat")}>Ask AI</VBtn>
        </div>
      </TopBar>
      <div className="px-8 py-6 space-y-5">
        {/* Navigation Back Bar */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNav("dashboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-white transition-all hover:scale-105 cursor-pointer shadow-lg"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(91,33,182,0.4))",
                border: "1px solid rgba(167,139,250,0.5)",
                boxShadow: "0 0 20px rgba(124,58,237,0.3)",
              }}
            >
              <RotateCcw size={13} className="text-violet-300" /> ← Back to Dashboard
            </button>

            <button
              onClick={() => onNav("documents")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 transition-all hover:scale-105 hover:text-white cursor-pointer"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <FileText size={13} className="text-cyan-400" /> View All Documents
            </button>

            <button
              onClick={() => {
                if (onSelectDoc) onSelectDoc(currentDoc);
                onNav("compare");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-cyan-300 transition-all hover:scale-105 cursor-pointer shadow-lg"
              style={{
                background: "linear-gradient(135deg, rgba(14,116,144,0.4), rgba(8,145,178,0.3))",
                border: "1px solid rgba(34,211,238,0.5)",
                boxShadow: "0 0 20px rgba(34,211,238,0.3)",
              }}
            >
              <GitCompare size={13} className="text-cyan-400" /> ⚡ Compare with Another Document
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "rgba(167,139,250,0.7)" }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI RAG Context Active
          </div>
        </div>

        {/* Hero Banner */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}>
          <div className="relative rounded-3xl overflow-hidden" style={{ minHeight:220, border:`1.5px solid ${currentDoc.clr}40`, boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 30px ${currentDoc.clr}20` }}>
            <img src={currentDoc.img} alt={currentDoc.title} className="absolute inset-0 w-full h-full object-cover" style={{ opacity:.55 }}/>
            <div className="absolute inset-0" style={{ background:"linear-gradient(90deg,rgba(2,5,16,.96) 35%,rgba(2,5,16,.65) 100%)" }}/>
            <div className="relative z-10 flex items-center gap-8 p-8">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-xl font-mono tracking-wider" style={{ background:`${currentDoc.clr}25`, color:currentDoc.clr, border:`1px solid ${currentDoc.clr}50`, backdropFilter:"blur(12px)" }}>{currentDoc.type}</span>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5" style={{ background:"rgba(16,185,129,.2)", color:"#34d399", border:"1px solid rgba(16,185,129,.4)", backdropFilter:"blur(12px)" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ✓ AI Analyzed
                  </span>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full" style={{ background:"rgba(124,58,237,.2)", color:"#c4b5fd", border:"1px solid rgba(124,58,237,.4)", backdropFilter:"blur(12px)" }}>RAG Enhanced</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white leading-tight" style={{ fontFamily:"'Outfit', sans-serif", letterSpacing:"-1px" }}>{currentDoc.title}</h2>
                <p className="text-xs font-medium" style={{ color:"rgba(200,205,240,.65)" }}>{currentDoc.size} · Uploaded {currentDoc.date} · 47 pages · 12,400 words indexed</p>
                <div className="flex gap-6 pt-1">
                  {[{l:"AI Score",v:`${currentDoc.score}%`,c:currentDoc.score>90?"#10b981":"#22d3ee"},{l:"Sentiment",v:"Positive",c:"#10b981"},{l:"Risk Level",v:"Low",c:"#22d3ee"},{l:"Insights",v:"34",c:"#7c3aed"}].map(({l,v,c})=>(
                    <div key={l}><div className="text-sm font-black" style={{ color:c }}>{v}</div><div className="text-[10px] font-semibold" style={{ color:"rgba(180,185,230,.5)" }}>{l}</div></div>
                  ))}
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-3">
                <div className="levB"><DataCube size={72}/></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)" }}>
          {TABS.map(({ id, label, icon:Icon }) => (
            <button key={id} onClick={()=>setTab(id)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex-1 justify-center" style={{ background:tab===id?"linear-gradient(135deg,rgba(124,58,237,.35),rgba(91,33,182,.2))":"transparent", color:tab===id?"#c4b5fd":"rgba(180,185,230,.4)", border:tab===id?"1px solid rgba(124,58,237,.35)":"1px solid transparent", boxShadow:tab===id?"0 0 20px rgba(124,58,237,.15)":"none" }}>
              <Icon size={12}/>{label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div key={tab} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:.35 }}>
          {tab === "summary" && (
            <div className="grid xl:grid-cols-3 gap-5">
              <Glass className="p-6 xl:col-span-2">
                <div className="flex items-center gap-2 mb-4"><Sparkles size={14} style={{ color:"#a78bfa" }}/><h3 className="text-sm font-bold text-white">AI-Generated Summary</h3></div>
                <div className="space-y-3 text-sm leading-relaxed" style={{ color:"rgba(200,205,240,.7)" }}>
                  <p>This strategic report outlines AI adoption pathways for enterprise organisations in 2025, focusing on three core pillars: <strong className="text-white">infrastructure modernisation</strong>, <strong className="text-white">talent acquisition</strong>, and <strong className="text-white">governance frameworks</strong>.</p>
                  <p>Key findings indicate that organisations investing in AI infrastructure see an average <strong style={{ color:"#10b981" }}>34% productivity gain</strong> within 18 months. The report identifies five critical success factors for enterprise AI deployment, including executive sponsorship, data quality management, and change management programmes.</p>
                  <p>Risk factors centre on data privacy regulations across jurisdictions, with GDPR compliance cited as the primary concern for 78% of surveyed enterprises. The report recommends a phased adoption model starting with low-risk, high-value use cases.</p>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {[{l:"Executive Summary",p:2},{l:"Market Analysis",p:8},{l:"Recommendations",p:41}].map(({l,p})=>(
                    <div key={l} className="px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all hover:border-violet-500/30" style={{ background:"rgba(124,58,237,.08)", border:"1px solid rgba(124,58,237,.18)", color:"rgba(167,139,250,.8)" }}>
                      <div className="font-semibold text-white mb-0.5">{l}</div>
                      <div style={{ color:"rgba(180,185,230,.4)" }}>Page {p}</div>
                    </div>
                  ))}
                </div>
              </Glass>
              <div className="space-y-4">
                <Glass className="p-5">
                  <h3 className="text-xs font-bold text-white mb-4">Document Metadata</h3>
                  <div className="space-y-2.5">
                    {[{l:"Author",v:"Strategy Team"},{l:"Created",v:"Jul 20, 2025"},{l:"Modified",v:"Jul 24, 2026"},{l:"Pages",v:"47"},{l:"Words",v:"12,400"},{l:"Language",v:"English"},{l:"Version",v:"v2.3 Final"}].map(({l,v})=>(
                      <div key={l} className="flex justify-between py-1.5 text-xs border-b" style={{ borderColor:"rgba(255,255,255,.05)", color:"rgba(180,185,230,.5)" }}>
                        <span>{l}</span><span className="text-white font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </Glass>
                <Glass className="p-5">
                  <h3 className="text-xs font-bold text-white mb-3">AI Confidence</h3>
                  {[{l:"Summary accuracy",v:96,c:"#10b981"},{l:"Sentiment analysis",v:91,c:"#22d3ee"},{l:"Entity extraction",v:88,c:"#7c3aed"},{l:"Topic modelling",v:84,c:"#f59e0b"}].map(({l,v,c})=>(
                    <div key={l} className="mb-3 last:mb-0">
                      <div className="flex justify-between text-xs mb-1"><span style={{ color:"rgba(180,185,230,.55)" }}>{l}</span><span className="font-mono font-bold" style={{ color:c }}>{v}%</span></div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,.05)" }}><div className="h-full rounded-full" style={{ width:`${v}%`, background:`linear-gradient(90deg,${c},${c}99)` }}/></div>
                    </div>
                  ))}
                </Glass>
              </div>
            </div>
          )}

          {tab === "analysis" && (
            <div className="grid xl:grid-cols-2 gap-5">
              <Glass className="p-6">
                <h3 className="text-sm font-bold text-white mb-4">Sentiment Analysis</h3>
                <div className="flex items-center justify-center mb-6">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="16"/>
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#10b981" strokeWidth="16" strokeDasharray="226 377" strokeLinecap="round" transform="rotate(-90 80 80)" style={{ filter:"drop-shadow(0 0 8px #10b981)" }}/>
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#22d3ee" strokeWidth="16" strokeDasharray="94 377" strokeLinecap="round" transform="rotate(126 80 80)" style={{ filter:"drop-shadow(0 0 6px #22d3ee)" }}/>
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#ec4899" strokeWidth="16" strokeDasharray="57 377" strokeLinecap="round" transform="rotate(216 80 80)" style={{ filter:"drop-shadow(0 0 6px #ec4899)" }}/>
                    <text x="80" y="74" textAnchor="middle" fill="white" fontSize="18" fontWeight="900" fontFamily="'Plus Jakarta Sans',sans-serif">60%</text>
                    <text x="80" y="90" textAnchor="middle" fill="rgba(180,185,230,.5)" fontSize="9">Positive</text>
                  </svg>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[{l:"Positive",v:"60%",c:"#10b981"},{l:"Neutral",v:"25%",c:"#22d3ee"},{l:"Negative",v:"15%",c:"#ec4899"}].map(({l,v,c})=>(
                    <div key={l} className="text-center p-2 rounded-xl" style={{ background:`${c}10`, border:`1px solid ${c}25` }}>
                      <div className="text-sm font-black" style={{ color:c }}>{v}</div>
                      <div className="text-[10px]" style={{ color:"rgba(180,185,230,.45)" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </Glass>
              <Glass className="p-6">
                <h3 className="text-sm font-bold text-white mb-4">Topic Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={[{t:"AI Strategy",v:34},{t:"Finance",v:22},{t:"Risk",v:18},{t:"Tech",v:15},{t:"HR",v:11}]} layout="vertical" margin={{ left:20, right:20 }}>
                    <XAxis type="number" tick={{ fill:"rgba(180,185,230,.35)", fontSize:9 }} axisLine={false} tickLine={false}/>
                    <YAxis type="category" dataKey="t" tick={{ fill:"rgba(180,185,230,.55)", fontSize:10 }} axisLine={false} tickLine={false} width={60}/>
                    <Tooltip content={<ChartTip/>}/>
                    <Bar key="bv" dataKey="v" name="Coverage %" fill="#7c3aed" radius={[0,6,6,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </Glass>
              <Glass className="p-6 xl:col-span-2">
                <h3 className="text-sm font-bold text-white mb-4">Key Findings</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[{t:"34% productivity gain from AI investment",c:"#10b981",icon:TrendingUp},{t:"78% cite GDPR as primary compliance concern",c:"#f59e0b",icon:Shield},{t:"Phased adoption model recommended for enterprises",c:"#7c3aed",icon:Lightbulb},{t:"Executive sponsorship critical success factor",c:"#22d3ee",icon:Star}].map(({t,c,icon:Icon},i)=>(
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background:`${c}08`, border:`1px solid ${c}20` }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background:`${c}20` }}><Icon size={12} style={{ color:c }}/></div>
                      <p className="text-xs leading-relaxed" style={{ color:"rgba(200,205,240,.75)" }}>{t}</p>
                    </div>
                  ))}
                </div>
              </Glass>
            </div>
          )}

          {tab === "keywords" && (
            <Glass className="p-6">
              <div className="flex items-center justify-between mb-5"><h3 className="text-sm font-bold text-white">Extracted Keywords & Entities</h3><span className="text-xs font-mono" style={{ color:"rgba(167,139,250,.6)" }}>{keywords.length} found</span></div>
              <div className="flex flex-wrap gap-2 mb-6">
                {keywords.map((k,i)=>{
                  const colors=["#7c3aed","#22d3ee","#ec4899","#10b981","#f59e0b"];
                  const c=colors[i%5];
                  const size=i<3?"text-sm font-bold":i<7?"text-xs font-semibold":"text-[11px]";
                  return <span key={k} className={`${size} px-3 py-1.5 rounded-xl cursor-pointer transition-all hover:scale-105`} style={{ background:`${c}15`, color:c, border:`1px solid ${c}30`, boxShadow:`0 0 10px ${c}10` }}>{k}</span>;
                })}
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[{label:"People",items:["John Smith","Sarah Chen","Michael Rodriguez"],c:"#7c3aed"},{label:"Organisations",items:["McKinsey & Co","Gartner","Forrester Research"],c:"#22d3ee"},{label:"Locations",items:["United States","European Union","Asia Pacific"],c:"#10b981"}].map(({label,items,c})=>(
                  <div key={label} className="p-4 rounded-2xl" style={{ background:`${c}08`, border:`1px solid ${c}20` }}>
                    <div className="text-[10px] font-bold tracking-wider mb-3" style={{ color:c }}>{label.toUpperCase()}</div>
                    {items.map(item=><div key={item} className="flex items-center gap-2 py-1.5 text-xs border-b last:border-0" style={{ borderColor:"rgba(255,255,255,.05)", color:"rgba(200,205,240,.7)" }}><div className="w-1 h-1 rounded-full shrink-0" style={{ background:c }}/>{item}</div>)}
                  </div>
                ))}
              </div>
            </Glass>
          )}

          {tab === "graph" && (
            <Glass className="p-6" style={{ minHeight:400 }}>
              <h3 className="text-sm font-bold text-white mb-4">Document Knowledge Graph</h3>
              <svg width="100%" height="360" viewBox="0 0 800 360">
                <defs>
                  {[["#7c3aed","doc"],["#22d3ee","concept"],["#ec4899","insight"],["#10b981","entity"]].map(([c,id])=>(
                    <radialGradient key={id} id={`rg-det-${id}`} cx="38%" cy="32%" r="65%"><stop offset="0%" stopColor={c as string} stopOpacity={.95}/><stop offset="100%" stopColor={c as string} stopOpacity={.4}/></radialGradient>
                  ))}
                  <filter id="gdet"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                {[[160,180,320,100],[320,100,480,180],[160,180,320,260],[480,180,640,100],[480,180,640,260],[320,260,480,180],[640,100,640,260]].map(([x1,y1,x2,y2],i)=>(
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(124,58,237,.2)" strokeWidth="1.5" strokeDasharray="6 4"><animate attributeName="stroke-dashoffset" from="100" to="0" dur={`${3+i*.5}s`} repeatCount="indefinite"/></line>
                ))}
                {[[160,180,"AI Strategy 2025","doc",18],[320,100,"Machine Learning","concept",14],[480,180,"Enterprise ROI","insight",12],[320,260,"Risk Framework","doc",13],[640,100,"Neural Networks","concept",11],[640,260,"Compliance","entity",10]].map(([x,y,label,type,r],i)=>{
                  const colors:Record<string,string>={doc:"#7c3aed",concept:"#22d3ee",insight:"#ec4899",entity:"#10b981"};
                  const c=colors[type as string];
                  return <g key={i}><circle cx={x as number} cy={y as number} r={(r as number)+12} fill={c} opacity={.1} filter="url(#gdet)"/><circle cx={x as number} cy={y as number} r={r as number} fill={`url(#rg-det-${type})`} filter="url(#gdet)" stroke={c} strokeWidth="1.5" strokeOpacity={.7}/><text x={x as number} y={(y as number)+(r as number)+15} textAnchor="middle" fill="rgba(200,205,240,.75)" fontSize="9" fontFamily="'Plus Jakarta Sans',sans-serif">{label as string}</text></g>;
                })}
              </svg>
            </Glass>
          )}

          {tab === "relationships" && (
            <div className="space-y-3">
              <Glass className="p-5"><h3 className="text-sm font-bold text-white mb-4">Related Documents</h3>
                <div className="space-y-2.5">
                  {relations.map(({doc:d,rel,score,color})=>(
                    <div key={d} className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all hover:border-violet-500/30 group" style={{ border:"1px solid rgba(255,255,255,.06)" }} onClick={()=>onNav("details")}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background:`${color}15`, border:`1px solid ${color}30` }}><FileText size={14} style={{ color }}/></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate mb-0.5">{d}</div>
                        <div className="text-[10px]" style={{ color:"rgba(180,185,230,.4)" }}>{rel}</div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="h-1.5 w-20 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,.06)" }}><div className="h-full rounded-full" style={{ width:`${score}%`, background:color }}/></div>
                        <span className="text-xs font-mono font-bold w-8 text-right" style={{ color }}>{score}%</span>
                        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color:"rgba(167,139,250,.5)" }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </Glass>
            </div>
          )}

          {tab === "recommendations" && (
            <div className="grid md:grid-cols-2 gap-4">
              {[{t:"Cross-reference with Q2 Financials",d:"Financial metrics in this document align with Q2 data. Compare revenue projections for full context.",icon:GitCompare,color:"#7c3aed",priority:"High"},{t:"Review Compliance Framework v3",d:"Risk sections reference compliance requirements. Review latest framework for regulatory alignment.",icon:Shield,color:"#ec4899",priority:"High"},{t:"Update Knowledge Graph connections",d:"13 new entity relationships detected. Updating the graph will improve search recall by ~18%.",icon:Network,color:"#22d3ee",priority:"Medium"},{t:"Schedule executive review",d:"Document contains strategic recommendations requiring leadership sign-off before Q4 planning.",icon:User,color:"#10b981",priority:"Low"}].map(({t,d,icon:Icon,color,priority},i)=>(
                <motion.div key={i} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.08 }}>
                  <Glass hover className="p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background:`linear-gradient(90deg,transparent,${color}60,transparent)` }}/>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background:`${color}15`, border:`1px solid ${color}30` }}><Icon size={16} style={{ color }}/></div>
                      <div className="flex-1"><div className="text-xs font-bold text-white mb-0.5">{t}</div><span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background:`${priority==="High"?"rgba(236,72,153,.15)":priority==="Medium"?"rgba(245,158,11,.15)":"rgba(16,185,129,.15)"}`, color:priority==="High"?"#ec4899":priority==="Medium"?"#f59e0b":"#10b981" }}>{priority} priority</span></div>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color:"rgba(180,185,230,.5)" }}>{d}</p>
                    <button className="mt-3 text-[10px] font-bold flex items-center gap-1 transition-colors hover:text-white" style={{ color:"rgba(167,139,250,.6)" }}>Take action <ChevronRight size={10}/></button>
                  </Glass>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Compare Docs ───────────────────────────────────────────── */
function ComparePage({ onNav, onSelectDoc, selectedDoc }: { onNav?: (p: Page) => void; onSelectDoc?: (doc: typeof DOCS[0]) => void; selectedDoc?: typeof DOCS[0] | null }) {
  const initLeft = selectedDoc ? DOCS.findIndex(d => d.id === selectedDoc.id) : 0;
  const [left, setLeft] = useState(initLeft >= 0 ? initLeft : 0);
  const [right, setRight] = useState(initLeft === 1 ? 0 : 1);
  const [activeTab, setActiveTab] = useState<"summary" | "diffs" | "similarities" | "sections">("summary");
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const docA = DOCS[left] || DOCS[0];
  const docB = DOCS[right] || DOCS[1];

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    apiService.compareDocuments(docA.title, docB.title).then(res => {
      if (isCurrent) {
        setApiData(res);
        setLoading(false);
      }
    });
    return () => { isCurrent = false; };
  }, [left, right]);

  const sections = [
    { section:"Executive Summary", match:82, status:"High Match", changes:2 },
    { section:"Financial Projections & Budget", match:45, status:"Modified", changes:7 },
    { section:"Risk Assessment & Mitigation", match:88, status:"Identical", changes:0 },
    { section:"Strategic Recommendations", match:34, status:"Major Difference", changes:11 },
    { section:"Appendix & Methodologies", match:96, status:"Identical", changes:0 },
  ];

  return (
    <div>
      <TopBar title="AI Document Comparison" subtitle="Side-by-side semantic diff analysis & strategic alignment" onNav={onNav}/>
      <div className="px-8 py-6 space-y-6">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}>
          
          {/* Document Pickers Header */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Document A Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-violet-400 tracking-wider">DOCUMENT A (BASE)</span>
                <span className="text-[10px] font-mono text-slate-400">{docA.size}</span>
              </div>
              <select 
                value={left} 
                onChange={e => setLeft(Number(e.target.value))} 
                className="w-full bg-black/80 text-xs font-extrabold text-white border border-violet-500/40 rounded-xl px-4 py-3 outline-none cursor-pointer"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {DOCS.map((d, i) => (
                  <option key={d.id} value={i} disabled={i === right}>
                    {d.title} ({d.type})
                  </option>
                ))}
              </select>

              {/* Doc A Preview Card */}
              <div 
                className="group relative rounded-2xl overflow-hidden cursor-pointer p-5 transition-all duration-300 hover:scale-[1.01]" 
                style={{ height:140, border:`1.5px solid ${docA.clr}40`, background:"rgba(2,5,16,0.9)" }}
                onClick={() => {
                  if (onSelectDoc) onSelectDoc(docA);
                  else if (onNav) onNav("details");
                }}
              >
                <img src={docA.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"/>
                <div className="absolute inset-0" style={{ background:"linear-gradient(180deg,transparent 10%,rgba(2,5,16,.95) 85%)" }}/>
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg font-mono" style={{ background:`${docA.clr}25`, color:docA.clr, border:`1px solid ${docA.clr}40` }}>
                      {docA.type}
                    </span>
                    <span className="text-xs font-black text-emerald-400 font-mono">Score: {docA.score}%</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>{docA.title}</h4>
                    <span className="text-[10px] text-cyan-300 flex items-center gap-1 mt-1 opacity-90 group-hover:opacity-100">Click to view document details →</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document B Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider">DOCUMENT B (TARGET)</span>
                <span className="text-[10px] font-mono text-slate-400">{docB.size}</span>
              </div>
              <select 
                value={right} 
                onChange={e => setRight(Number(e.target.value))} 
                className="w-full bg-black/80 text-xs font-extrabold text-white border border-cyan-500/40 rounded-xl px-4 py-3 outline-none cursor-pointer"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {DOCS.map((d, i) => (
                  <option key={d.id} value={i} disabled={i === left}>
                    {d.title} ({d.type})
                  </option>
                ))}
              </select>

              {/* Doc B Preview Card */}
              <div 
                className="group relative rounded-2xl overflow-hidden cursor-pointer p-5 transition-all duration-300 hover:scale-[1.01]" 
                style={{ height:140, border:`1.5px solid ${docB.clr}40`, background:"rgba(2,5,16,0.9)" }}
                onClick={() => {
                  if (onSelectDoc) onSelectDoc(docB);
                  else if (onNav) onNav("details");
                }}
              >
                <img src={docB.img} alt="" className="w-full h-full absolute inset-0 object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"/>
                <div className="absolute inset-0" style={{ background:"linear-gradient(180deg,transparent 10%,rgba(2,5,16,.95) 85%)" }}/>
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg font-mono" style={{ background:`${docB.clr}25`, color:docB.clr, border:`1px solid ${docB.clr}40` }}>
                      {docB.type}
                    </span>
                    <span className="text-xs font-black text-cyan-400 font-mono">Score: {docB.score}%</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>{docB.title}</h4>
                    <span className="text-[10px] text-cyan-300 flex items-center gap-1 mt-1 opacity-90 group-hover:opacity-100">Click to view document details →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similarity Indicator Banner */}
          <Glass glow className="p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-cyan-400"/>
                  <h3 className="text-base font-extrabold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>AI Semantic Alignment Score</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  {loading ? "Computing vector similarity matrix..." : (apiData?.summary || "Both documents display strong semantic overlap on core enterprise benchmarks.")}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 bg-black/60 px-6 py-4 rounded-2xl border border-violet-500/30">
                <div className="text-center">
                  <div className="text-3xl font-black text-cyan-300 font-mono">
                    {loading ? "..." : Math.round((apiData?.similarity_score || 0.78) * 100)}%
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 tracking-widest uppercase">MATCH SCORE</div>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-cyan-400 text-cyan-400">
                  <GitCompare size={20}/>
                </div>
              </div>
            </div>
          </Glass>

          {/* Comparison Tabs */}
          <div className="flex gap-2 mb-5">
            {[
              { id:"summary", label:"AI Summary & Synthesis" },
              { id:"diffs", label:"Key Differences & Conflicts" },
              { id:"similarities", label:"Shared Similarities" },
              { id:"sections", label:"Section Breakdown" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1 text-center"
                style={{
                  background: activeTab === t.id ? "linear-gradient(135deg,rgba(124,58,237,.4),rgba(91,33,182,.3))" : "rgba(255,255,255,0.04)",
                  color: activeTab === t.id ? "#c4b5fd" : "rgba(180,185,230,.5)",
                  border: activeTab === t.id ? "1px solid rgba(167,139,250,.4)" : "1px solid rgba(255,255,255,.08)",
                  boxShadow: activeTab === t.id ? "0 0 15px rgba(124,58,237,.2)" : "none"
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <Glass className="p-6">
            {activeTab === "summary" && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText size={16} className="text-violet-400"/> AI Synthesis Report
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {apiData?.summary || "Document A and Document B align on high-level enterprise strategic objectives and technological roadmaps. However, Document A focuses primarily on fiscal budgets and ROI metrics, while Document B emphasizes technical microservices infrastructure."}
                </p>
                <div className="grid md:grid-cols-3 gap-3 pt-2">
                  {(apiData?.common_topics || ["AI Automation", "Enterprise Compliance", "Performance Benchmarks"]).map((topic: string) => (
                    <div key={topic} className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30 text-xs font-bold text-violet-300">
                      ✓ Shared Domain: {topic}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "diffs" && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white mb-3">Detected Strategic Differences</h4>
                {(apiData?.differences || [
                  "Document A specifies a 34% productivity growth target for FY2026, whereas Document B benchmarks operational efficiency at 22%.",
                  "Document A includes strict GDPR compliance clauses, which are missing from Document B.",
                  "Document B introduces microservices infrastructure specifications not outlined in Document A."
                ]).map((diff: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                    <span className="font-mono font-bold text-amber-400 shrink-0">DIFF #{idx + 1}</span>
                    <p className="leading-relaxed">{diff}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "similarities" && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white mb-3">Matching Strategic Elements</h4>
                {(apiData?.similarities || [
                  "Both documents prioritize enterprise AI adoption as a primary growth driver.",
                  "Identical data privacy and encryption compliance protocols.",
                  "Matched target implementation timelines for Q4 2026."
                ]).map((sim: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200">
                    <span className="font-mono font-bold text-emerald-400 shrink-0">MATCH #{idx + 1}</span>
                    <p className="leading-relaxed">{sim}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "sections" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2 text-xs font-mono text-slate-400">
                  <span>SECTION NAME</span>
                  <span>SIMILARITY MATCH %</span>
                </div>
                {sections.map(({ section, match, status, changes }) => {
                  const c = match > 80 ? "#10b981" : match > 50 ? "#f59e0b" : "#ec4899";
                  return (
                    <div key={section} className="flex items-center gap-4 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c }}/>
                      <span className="font-bold text-white flex-1">{section}</span>
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-32 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${match}%`, background: c }}/>
                        </div>
                        <span className="font-mono font-bold w-10 text-right" style={{ color: c }}>{match}%</span>
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold" style={{ background: `${c}20`, color: c, border: `1px solid ${c}40` }}>
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Glass>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Search ─────────────────────────────────────────────────── */
function SearchPage({ onNav, onSelectDoc }: { onNav?: (p: Page) => void; onSelectDoc?: (doc: typeof DOCS[0]) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [docs, setDocs] = useState<any[]>(DOCS);

  useEffect(() => {
    apiService.getDocuments().then(data => {
      if (data && data.length > 0) {
        const mapped = data.map((d: any, i: number) => {
          const colors = ["#7c3aed", "#22d3ee", "#ec4899", "#10b981", "#f59e0b"];
          const images = [IMG.tech, IMG.finance, IMG.product, IMG.glow, IMG.dark, IMG.neon];
          return {
            id: d.doc_id,
            title: d.title || d.filename,
            type: (d.file_type || "TXT").toUpperCase(),
            size: d.file_size ? (d.file_size / 1024 / 1024).toFixed(1) + " MB" : "N/A",
            date: d.uploaded_at ? new Date(d.uploaded_at).toLocaleDateString() : "Just now",
            tags: [d.category || "General"],
            category: d.category || "General",
            score: Math.floor(Math.random() * 20) + 80,
            status: "analyzed",
            clr: colors[i % colors.length],
            img: images[i % images.length],
            raw: d
          };
        });
        setDocs(mapped);
      }
    }).catch(e => console.error("Failed to load real docs", e));
  }, []);
  
  const safeDocs = docs || [];
  
  // Real-time fuzzy search across the docs
  const lowerQ = (query || "").toLowerCase();
  const searchResults = safeDocs.filter(d => {
    if (!query) return true;
    const titleMatch = (d.title || "").toLowerCase().includes(lowerQ);
    const catMatch = (d.category || "").toLowerCase().includes(lowerQ);
    const tagsMatch = d.tags && Array.isArray(d.tags) && d.tags.some((t: string) => (t || "").toLowerCase().includes(lowerQ));
    return titleMatch || catMatch || tagsMatch;
  });

  const filteredResults = filter === "all" ? searchResults : searchResults.filter(r => 
    (r.tags && Array.isArray(r.tags) && r.tags.some((t:string) => (t || "").toLowerCase() === filter.toLowerCase())) || 
    (r.type || "").toLowerCase() === filter.toLowerCase() ||
    (r.category || "").toLowerCase() === filter.toLowerCase()
  );

  // Take top 50 to avoid lag
  const displayResults = filteredResults.slice(0, 50).map(d => ({
    title: d.title || "Untitled",
    excerpt: `Document matches search query. Found in ${d.category || 'Knowledge Base'}.`,
    type: d.type || "DOC",
    score: d.score || 95,
    date: d.date || "Just now",
    color: d.clr || "#7c3aed",
    img: d.img || IMG.tech,
    tags: Array.isArray(d.tags) ? d.tags : [d.category || "General"],
    docId: d.id,
    raw: d
  }));

  const highlight = (text: string) => {
    if (!query) return text;
    try {
      const regex = new RegExp(`(${query})`, "gi");
      return text.replace(regex, m => `<mark style="background:rgba(124,58,237,.45);color:#fff;padding:1px 5px;border-radius:4px;font-weight:bold">${m}</mark>`);
    } catch {
      return text;
    }
  };

  return (
    <div>
      <TopBar title="Semantic RAG Search" subtitle={`${displayResults.length} neural search matches for "${query}" · 0.18s query latency`} onNav={onNav}/>
      <div className="px-8 py-6 space-y-6">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}>
          {/* AI Search Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden mb-6 p-8" style={{ border:"1.5px solid rgba(124,58,237,.35)", boxShadow:"0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(124,58,237,0.2)" }}>
            <img src={IMG.tech} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity:.45 }}/>
            <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,rgba(2,5,16,.95) 0%,rgba(124,58,237,.35) 50%,rgba(2,5,16,.9) 100%)" }}/>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-violet-400 animate-pulse"/>
                <span className="text-xs font-mono font-bold tracking-widest text-violet-300">HYBRID VECTOR & BM25 SEARCH ENGINE</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white" style={{ fontFamily:"'Outfit', sans-serif" }}>Deep Neural Document Retrieval</h2>
              
              {/* Search Bar Input */}
              <div className="glass rounded-2xl flex items-center gap-3 px-5 py-3.5" style={{ background:"rgba(2,5,16,0.85)", border:"1.5px solid rgba(124,58,237,.45)", boxShadow:"0 0 25px rgba(124,58,237,.25)", backdropFilter:"blur(16px)" }}>
                <Search size={20} className="text-violet-400"/>
                <input 
                  value={query} 
                  onChange={e=>setQuery(e.target.value)} 
                  className="flex-1 bg-transparent text-base text-white outline-none font-medium placeholder-slate-400" 
                  style={{ fontFamily:"'Outfit', sans-serif" }} 
                  placeholder="Ask or search across all indexed enterprise knowledge…"
                />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg" style={{ background:"rgba(124,58,237,.25)", color:"#c4b5fd", border:"1px solid rgba(124,58,237,.4)" }}>⌘ Enter</span>
                  <button className="neon-btn px-5 py-2.5 rounded-xl text-xs font-black text-white flex items-center gap-2 cursor-pointer transition-all hover:scale-105" style={{ background:"linear-gradient(135deg,#7c3aed,#5b21b6)", boxShadow:"0 0 20px rgba(124,58,237,.6)" }}>
                    <Sparkles size={12}/> Query Vectors
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Stats */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex gap-2 flex-wrap">
              {["all","PDF","DOCX","AI","Finance","Strategy","ESG","Research"].map(f=>(
                <GBtn key={f} sm onClick={()=>setFilter(f.toLowerCase())} active={filter===f.toLowerCase()}>{f==="all"?"All Results":f}</GBtn>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono" style={{ color:"rgba(180,185,230,.5)" }}>
              <SlidersHorizontal size={13}/> Sorted by Cosine Similarity
            </div>
          </div>

          {/* Search Result Cards */}
          <div className="space-y-4">
            {displayResults.map((r,i)=>(
              <motion.div key={r.docId} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.06 }}>
                <div 
                  className="group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1" 
                  style={{ 
                    background: "rgba(2,5,16,0.9)",
                    border:`1.5px solid ${r.color}35`, 
                    boxShadow:`0 10px 30px rgba(0,0,0,0.6), 0 0 20px ${r.color}15`
                  }}
                  onClick={() => {
                    const matchDoc = docs.find(d => d.id === r.docId) || docs[0];
                    if (onSelectDoc) onSelectDoc(matchDoc);
                    else if (onNav) onNav("details");
                  }}
                >
                  <div className="flex flex-col md:flex-row items-stretch">
                    {/* Visual Cover Image */}
                    <div className="relative w-full md:w-56 h-40 shrink-0 overflow-hidden">
                      <img src={r.img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" style={{ opacity:.7 }}/>
                      <div className="absolute inset-0" style={{ background:`linear-gradient(90deg,transparent 60%,rgba(2,5,16,.95))` }}/>
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-extrabold px-3 py-1 rounded-xl font-mono tracking-wider" style={{ background:"rgba(2,5,16,0.85)", color:r.color, border:`1px solid ${r.color}50`, backdropFilter:"blur(8px)" }}>
                          {r.type}
                        </span>
                      </div>
                    </div>

                    {/* Result Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              {r.tags.map(t=>(
                                <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded-lg font-mono" style={{ background:`${r.color}18`, color:"#c4b5fd", border:`1px solid ${r.color}30` }}>
                                  #{t}
                                </span>
                              ))}
                            </div>
                            <h4 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors" style={{ fontFamily:"'Outfit', sans-serif" }}>
                              {r.title}
                            </h4>
                          </div>
                          
                          {/* Match Score Badge */}
                          <div className="text-center shrink-0 px-3 py-1.5 rounded-2xl" style={{ background:"rgba(0,0,0,0.6)", border:`1px solid ${r.score>90?"#10b981":"#22d3ee"}` }}>
                            <div className="text-lg font-black" style={{ color:r.score>90?"#10b981":r.score>80?"#22d3ee":"#f59e0b" }}>{r.score}%</div>
                            <div className="text-[8px] font-mono tracking-widest" style={{ color:"rgba(180,185,230,.5)" }}>SIMILARITY</div>
                          </div>
                        </div>

                        <p className="text-xs leading-relaxed mb-3 text-slate-300" dangerouslySetInnerHTML={{ __html:highlight(r.excerpt) }}/>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t text-[11px]" style={{ borderColor:"rgba(255,255,255,.07)" }}>
                        <span style={{ color:"rgba(180,185,230,.5)" }}>Indexed {r.date} · Vector Chunk #14</span>
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={() => {
                              const matchDoc = DOCS.find(d => d.id === r.docId) || DOCS[0];
                              if (onSelectDoc) onSelectDoc(matchDoc);
                              if (onNav) onNav("details");
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                          >
                            <Eye size={12}/> View Details
                          </button>
                          <button 
                            onClick={() => {
                              const matchDoc = DOCS.find(d => d.id === r.docId) || DOCS[0];
                              if (onSelectDoc) onSelectDoc(matchDoc);
                              if (onNav) onNav("compare");
                            }}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-cyan-300 flex items-center gap-1.5 bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/30 cursor-pointer transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                          >
                            <GitCompare size={12}/> ⚡ Compare Document
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Notifications ──────────────────────────────────────────── */
function NotificationsPage({ onNav }: { onNav?: (p: Page) => void }) {
  const [filter, setFilter] = useState("all");
  const [timeStr, setTimeStr] = useState(new Date().toLocaleTimeString());

  // Real-time tick logic (just for clock)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const notifs = GLOBAL_NOTIFS;

  const unread = notifs.filter(n=>!n.read).length;
  const shown = filter==="all" ? notifs : filter==="unread" ? notifs.filter(n=>!n.read) : notifs.filter(n=>n.type===filter);

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Live Intelligence Feed" subtitle={`System Time: ${timeStr} · ${unread} unread events`} onNav={onNav}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"/>
          <span className="text-[10px] font-bold text-emerald-400 tracking-wider">LIVE FEED ACTIVE</span>
        </div>
      </TopBar>

      <div className="flex-1 px-8 py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6 }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex gap-2">
                {["all","success","info","warning"].map(f => (
                  <button 
                    key={f} 
                    onClick={()=>setFilter(f)} 
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter===f ? "bg-violet-600 shadow-[0_0_15px_rgba(124,58,237,0.5)] text-white" : "bg-white/5 text-white/50 hover:bg-white/10"}`}
                  >
                    {f==="all"?"All Feed":f.charAt(0).toUpperCase()+f.slice(1)}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => {
                  GLOBAL_NOTIFS = GLOBAL_NOTIFS.map(n => ({...n, read: true}));
                  globalUnreadCount = 0;
                  forceRefreshApp();
                }}
                className="text-xs flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Check size={14}/> Mark feed reviewed
              </button>
            </div>

            <div className="relative">
              {/* Timeline spine */}
              <div className="absolute top-4 bottom-4 left-6 w-px bg-gradient-to-b from-violet-500/50 via-cyan-500/20 to-transparent"/>

              <div className="space-y-4">
                  {shown.map((n,i)=>(
                    <motion.div 
                      key={n.id} 
                      initial={{ opacity:0, x:-20, scale:0.95 }} 
                      animate={{ opacity:1, x:0, scale:1 }} 
                      transition={{ type:"spring", stiffness:300, damping:25, delay: Math.min(i*.05, 0.5) }}
                      className="relative pl-16"
                    >
                      {/* Timeline node */}
                      <div className="absolute top-5 left-[22px] w-3 h-3 rounded-full border-2 border-slate-950 z-10" style={{ background: n.color, boxShadow: `0 0 10px ${n.color}` }}/>
                      
                      <div className={`p-5 rounded-2xl transition-all hover:scale-[1.01] ${!n.read ? "bg-violet-500/10 border-violet-500/30" : "bg-slate-950/60 border-white/5"} border backdrop-blur-xl shadow-lg relative overflow-hidden group`}>
                        {!n.read && <div className="absolute top-0 left-0 w-1 h-full" style={{ background:`linear-gradient(180deg, ${n.color}, transparent)` }}/>}
                        
                        <div className="flex items-start gap-5">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background:`${n.color}15`, border:`1px solid ${n.color}30` }}>
                            <n.icon size={20} style={{ color:n.color }}/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2.5">
                                <span className="text-sm font-extrabold text-white" style={{ fontFamily:"'Outfit', sans-serif" }}>{n.title}</span>
                                {!n.read && <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest" style={{ background:`${n.color}20`, color:n.color }}>New</span>}
                              </div>
                              <span className="text-[11px] font-mono font-bold" style={{ color:"rgba(180,185,230,.4)" }}>{n.time}</span>
                            </div>
                            <p className="text-xs leading-relaxed mb-3" style={{ color:"rgba(200,205,240,.7)" }}>{n.body}</p>
                            
                            <div className="flex items-center gap-3">
                              <button className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" style={{ color:n.color }}>
                                Analyze Event
                              </button>
                              <button className="text-[10px] font-bold text-white/30 hover:text-white/80 transition-colors ml-auto flex items-center gap-1">
                                <Trash2 size={12}/> Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                
                {shown.length === 0 && (
                  <div className="pl-16 py-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                      <CheckCircle2 size={24} className="text-white/20"/>
                    </div>
                    <div className="text-white font-bold mb-1">Feed is empty</div>
                    <div className="text-xs text-white/40">No intelligence events match the current filter.</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─── Settings ───────────────────────────────────────────────── */
function SettingsPage({ onNav }: { onNav?: (p: Page) => void }) {
  const [activeSection, setActiveSection] = useState("profile");
  const [name, setName] = useState("Operator");
  const [email, setEmail] = useState("operator@aikos.ai");
  const [role, setRole] = useState("Standard User");
  const [avatarUrl, setAvatarUrl] = useState("https://i.pravatar.cc/128?img=47");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiService.getMe().then(user => {
      if (user) {
        setName(user.username || "Operator");
        setRole(user.role || "Standard User");
        if (user.avatar_url) {
          setAvatarUrl("http://localhost:8000" + user.avatar_url);
        }
      }
    });
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await apiService.uploadAvatar(file);
    if (res && res.avatar_url) {
      setAvatarUrl("http://localhost:8000" + res.avatar_url + "?t=" + Date.now()); // cache buster
    }
  };
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSlack, setNotifSlack] = useState(false);
  const [notifInsights, setNotifInsights] = useState(true);
  const [notifDigest, setNotifDigest] = useState(true);
  const [notifBreach, setNotifBreach] = useState(true);
  
  type AiModelType = "gpt4-turbo" | "gpt4o" | "claude-3" | "gemini-pro";
  const [aiModel, setAiModel] = useState<AiModelType>("gpt4-turbo");
  
  const AI_PARAMS = {
    "gpt4-turbo": [
      {l:"Context Horizon",v:"128,000 tokens",c:"#7c3aed"},
      {l:"Output Stream Limit",v:"4,096 tokens",c:"#22d3ee"},
      {l:"Creativity Variance (Temp)",v:"0.3 (Analytical)",c:"#ec4899"},
      {l:"Vector Encoder Matrix",v:"text-embedding-3-large",c:"#10b981"}
    ],
    "gpt4o": [
      {l:"Context Horizon",v:"128,000 tokens",c:"#7c3aed"},
      {l:"Output Stream Limit",v:"4,096 tokens",c:"#22d3ee"},
      {l:"Creativity Variance (Temp)",v:"0.4 (Balanced)",c:"#ec4899"},
      {l:"Vector Encoder Matrix",v:"text-embedding-3-large",c:"#10b981"}
    ],
    "claude-3": [
      {l:"Context Horizon",v:"200,000 tokens",c:"#7c3aed"},
      {l:"Output Stream Limit",v:"4,096 tokens",c:"#22d3ee"},
      {l:"Creativity Variance (Temp)",v:"0.5 (Creative)",c:"#ec4899"},
      {l:"Vector Encoder Matrix",v:"voyage-large-2",c:"#10b981"}
    ],
    "gemini-pro": [
      {l:"Context Horizon",v:"2,000,000 tokens",c:"#7c3aed"},
      {l:"Output Stream Limit",v:"8,192 tokens",c:"#22d3ee"},
      {l:"Creativity Variance (Temp)",v:"0.2 (Strict)",c:"#ec4899"},
      {l:"Vector Encoder Matrix",v:"text-embedding-004",c:"#10b981"}
    ]
  };

  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false), 2000); };

  const SECTIONS = [
    { id:"profile",       label:"Operator Profile",  icon:User },
    { id:"notifications", label:"Neural Alerts",     icon:Bell },
    { id:"ai",            label:"Engine Tuning",     icon:Brain },
    { id:"security",      label:"Access Protocols",  icon:Shield },
    { id:"integrations",  label:"Data Siphons",      icon:Link2 },
    { id:"billing",       label:"Compute Quotas",    icon:BarChart3 },
  ];

  const Toggle = ({ value, onChange }: { value:boolean; onChange:(v:boolean)=>void }) => (
    <button onClick={()=>onChange(!value)} className="relative w-10 h-5 rounded-full transition-all duration-300" style={{ background:value?"linear-gradient(135deg,#7c3aed,#5b21b6)":"rgba(255,255,255,.08)", boxShadow:value?"0 0 12px rgba(124,58,237,.5)":"none" }}>
      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300" style={{ left:value?"calc(100% - 18px)":"2px", boxShadow:"0 1px 4px rgba(0,0,0,.4)" }}/>
    </button>
  );

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"/>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"/>
      
      <TopBar title="System Matrix" subtitle="AI-KOS Central Configuration Hub" onNav={onNav}/>
      <div className="px-8 py-6 relative z-10 flex-1 overflow-y-auto">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }} className="flex gap-6">
          {/* Sidebar sections */}
          <div className="w-52 shrink-0">
            <Glass className="p-2">
              {SECTIONS.map(({ id, label, icon:Icon })=>(
                <button key={id} onClick={()=>setActiveSection(id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all mb-0.5 last:mb-0" style={{ background:activeSection===id?"linear-gradient(90deg,rgba(124,58,237,.2),rgba(124,58,237,.08))":"transparent", color:activeSection===id?"#c4b5fd":"rgba(180,185,230,.45)", borderLeft:activeSection===id?"2px solid #7c3aed":"2px solid transparent" }}>
                  <Icon size={13} style={{ color:activeSection===id?"#a78bfa":"rgba(180,185,230,.3)" }}/>{label}
                </button>
              ))}
            </Glass>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div key={activeSection} initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} transition={{ duration:.3 }}>
              {activeSection === "profile" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-violet-500" />
                     <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 tracking-wider font-['Outfit']">OPERATOR PROFILE</h3>
                  </div>

                  <Glass className="p-8 border border-white/5 shadow-[0_0_30px_rgba(124,58,237,0.05)]">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2" style={{ borderColor:"rgba(34, 211, 238, 0.4)", boxShadow:"0 0 20px rgba(34, 211, 238, 0.15)" }}>
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                          <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-7 h-7 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background:"linear-gradient(135deg,#22d3ee,#0ea5e9)", boxShadow:"0 0 15px rgba(34,211,238,0.4)" }}><Plus size={14} className="text-black"/></button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white tracking-wide font-['Outfit']">{name}</div>
                        <div className="text-xs mt-1 px-2 py-0.5 rounded-md inline-block font-mono font-bold" style={{ background:"rgba(34, 211, 238, 0.1)", color:"#22d3ee" }}>{role}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      {[{l:"Clearance Name",v:name,set:setName,t:"text"},{l:"Comms Uplink",v:email,set:setEmail,t:"email"},{l:"Designation",v:"Chief Strategy Officer",set:()=>{},t:"text"},{l:"Sector",v:"Executive Leadership",set:()=>{},t:"text"}].map(({l,v,set,t})=>(
                        <div key={l}>
                          <label className="text-[10px] font-bold tracking-widest mb-2 block text-cyan-500/70">{l.toUpperCase()}</label>
                          <input type={t} defaultValue={v} onChange={e=>set(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none border transition-all" style={{ background:"rgba(0,0,0,0.2)", borderColor:"rgba(34,211,238,0.2)", fontFamily:"Inter,sans-serif" }} onFocus={e=>{e.currentTarget.style.borderColor="#22d3ee";e.currentTarget.style.boxShadow="0 0 15px rgba(34,211,238,0.15)";}} onBlur={e=>{e.currentTarget.style.borderColor="rgba(34,211,238,0.2)";e.currentTarget.style.boxShadow="none";}}/>
                        </div>
                      ))}
                    </div>
                  </Glass>
                  <Glass className="p-8 border border-white/5">
                    <h3 className="text-sm font-bold text-white mb-5 font-['Outfit'] tracking-wide">ORGANISATIONAL UNIT</h3>
                    <div className="grid grid-cols-2 gap-6">
                      {[{l:"Faction",v:"Acme Corporation"},{l:"Domain",v:"Cybernetics"},{l:"Headcount",v:"500-1000 operators"},{l:"Zone",v:"Sector 7G"}].map(({l,v})=>(
                        <div key={l}>
                          <label className="text-[10px] font-bold tracking-widest mb-2 block text-violet-400/70">{l.toUpperCase()}</label>
                          <input type="text" defaultValue={v} className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none border transition-all" style={{ background:"rgba(0,0,0,0.2)", borderColor:"rgba(124,58,237,0.2)", fontFamily:"Inter,sans-serif" }} onFocus={e=>{e.currentTarget.style.borderColor="#7c3aed";}} onBlur={e=>{e.currentTarget.style.borderColor="rgba(124,58,237,0.2)";}}/>
                        </div>
                      ))}
                    </div>
                  </Glass>
                </div>
              )}

              {activeSection === "notifications" && (
                <div>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-500" />
                     <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 tracking-wider font-['Outfit']">NEURAL ALERT ROUTING</h3>
                  </div>
                  <Glass className="p-8 border border-white/5">
                    <div className="space-y-6">
                      {[
                        {l:"Holographic Comms (Email)",d:"Receive high-priority analysis reports via external email uplink",v:notifEmail,set:setNotifEmail},
                        {l:"Sub-ether Network (Slack)",d:"Bridge notifications directly to the local Slack instance",v:notifSlack,set:setNotifSlack},
                        {l:"Automated Insight Triggers",d:"Ping the operator when the AI engine discovers novel knowledge graph links",v:notifInsights,set:setNotifInsights},
                        {l:"System Chron-Digest",d:"Compile all background events into a weekly tactical summary",v:notifDigest,set:setNotifDigest},
                        {l:"Breach Protocols",d:"Critical alerts for unauthorized access or anomaly detection",v:notifBreach,set:setNotifBreach},
                      ].map(({l,d,v,set})=>(
                        <div key={l} className="flex items-center justify-between py-4 border-b last:border-0 border-white/5 group hover:bg-white/[0.02] -mx-4 px-4 rounded-xl transition-colors">
                          <div><div className="text-sm font-bold text-white tracking-wide">{l}</div><div className="text-xs mt-1" style={{ color:"rgba(180,185,230,.5)" }}>{d}</div></div>
                          <Toggle value={v} onChange={set}/>
                        </div>
                      ))}
                    </div>
                  </Glass>
                </div>
              )}

              {activeSection === "ai" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                     <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-pink-500 to-violet-600" />
                     <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 tracking-wider font-['Outfit']">COGNITIVE ENGINE TUNING</h3>
                  </div>
                  <Glass className="p-8 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Brain size={120} /></div>
                    <h3 className="text-xs font-bold tracking-widest text-pink-400 mb-6">SELECT NEURAL PATHWAY</h3>
                    <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                      {[{id:"gpt4-turbo",label:"GPT-4 Turbo",desc:"Maximum reasoning depth",badge:"Prime",color:"#7c3aed"},{id:"gpt4o",label:"GPT-4o",desc:"Hyper-optimized logic",badge:"Active",color:"#22d3ee"},{id:"claude-3",label:"Claude 3 Opus",desc:"Nuanced pattern recognition",badge:"",color:"#ec4899"},{id:"gemini-pro",label:"Gemini 1.5 Pro",desc:"Infinite context horizon",badge:"",color:"#10b981"}].map(({id,label,desc,badge,color})=>(
                        <button key={id} onClick={()=>setAiModel(id)} className="p-4 rounded-xl text-left transition-all relative overflow-hidden group" style={{ background:aiModel===id?`${color}15`:"rgba(0,0,0,0.3)", border:`1px solid ${aiModel===id?color+"60":"rgba(255,255,255,0.05)"}`, boxShadow:aiModel===id?`0 0 25px ${color}20`:"none" }}>
                          {badge && <span className="absolute top-3 right-3 text-[9px] font-black uppercase px-2 py-0.5 rounded-sm" style={{ background:`${color}25`, color, border:`1px solid ${color}40` }}>{badge}</span>}
                          <div className="absolute top-0 left-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background:color }} />
                          <div className="text-sm font-bold text-white mb-1 tracking-wide font-['Outfit']">{label}</div>
                          <div className="text-xs" style={{ color:"rgba(180,185,230,.5)" }}>{desc}</div>
                        </button>
                      ))}
                    </div>
                    
                    <h3 className="text-xs font-bold tracking-widest text-violet-400 mb-4 mt-8">ENGINE HYPER-PARAMETERS</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {AI_PARAMS[aiModel].map(({l,v,c})=>(
                        <div key={l} className="p-4 rounded-xl border border-white/5 bg-black/20 flex flex-col gap-1">
                          <span className="text-[10px] font-bold tracking-widest" style={{ color:"rgba(180,185,230,.5)" }}>{l.toUpperCase()}</span>
                          <span className="text-sm font-mono font-bold" style={{ color:c }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </Glass>
                </div>
              )}

              {activeSection === "security" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-red-500 to-orange-500" />
                     <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 tracking-wider font-['Outfit']">ACCESS PROTOCOLS</h3>
                  </div>
                  <Glass className="p-8 border border-white/5">
                    <div className="space-y-6">
                      {[
                        {l:"Multi-Factor Authentication (MFA)", d:"Require a second factor for all matrix logins", v:true},
                        {l:"Biometric Verification", d:"Enable fingerprint/FaceID on supported operator consoles", v:false},
                        {l:"Strict Session Timeouts", d:"Terminate idle connections after 15 minutes", v:true},
                        {l:"Audit Logging", d:"Record all access events to the permanent ledger", v:true},
                      ].map(({l,d,v})=>(
                        <div key={l} className="flex items-center justify-between py-4 border-b last:border-0 border-white/5 group hover:bg-white/[0.02] -mx-4 px-4 rounded-xl transition-colors">
                           <div><div className="text-sm font-bold text-white tracking-wide">{l}</div><div className="text-xs mt-1" style={{ color:"rgba(180,185,230,.5)" }}>{d}</div></div>
                           <Toggle value={v} onChange={()=>{}}/>
                        </div>
                      ))}
                    </div>
                  </Glass>
                </div>
              )}

              {activeSection === "integrations" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500" />
                     <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 tracking-wider font-['Outfit']">DATA SIPHONS</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {name:"Salesforce", status:"Connected", c:"#00a1e0"},
                      {name:"Jira", status:"Disconnected", c:"#2684FF"},
                      {name:"GitHub", status:"Connected", c:"#fafafa"},
                      {name:"Slack", status:"Connected", c:"#e01e5a"},
                      {name:"Google Drive", status:"Disconnected", c:"#0F9D58"},
                      {name:"Confluence", status:"Disconnected", c:"#172B4D"},
                    ].map((i)=>(
                       <Glass key={i.name} className="p-5 border border-white/5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background:`${i.c}20`, color:i.c, border:`1px solid ${i.c}40` }}>{i.name[0]}</div>
                           <div>
                             <div className="text-sm font-bold text-white">{i.name}</div>
                             <div className="text-[10px] font-bold tracking-widest uppercase mt-0.5" style={{ color:i.status==="Connected"?"#10b981":"#ef4444" }}>{i.status}</div>
                           </div>
                         </div>
                         <button className="px-4 py-1.5 rounded-full text-xs font-bold transition-all" style={{ background:i.status==="Connected"?"rgba(239,68,68,0.1)":"rgba(16,185,129,0.1)", color:i.status==="Connected"?"#ef4444":"#10b981", border:i.status==="Connected"?"1px solid rgba(239,68,68,0.3)":"1px solid rgba(16,185,129,0.3)" }}>
                           {i.status==="Connected" ? "Unlink" : "Connect"}
                         </button>
                       </Glass>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "billing" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-yellow-400 to-amber-500" />
                     <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 tracking-wider font-['Outfit']">COMPUTE QUOTAS</h3>
                  </div>
                  <Glass className="p-8 border border-white/5">
                     <h3 className="text-xs font-bold tracking-widest text-amber-400 mb-6 uppercase">Current Cycle Usage</h3>
                     
                     <div className="space-y-6">
                       <div>
                         <div className="flex justify-between text-xs font-bold mb-2">
                           <span className="text-white">Vector Ingestion</span>
                           <span className="text-amber-400">8.2 GB / 10 GB</span>
                         </div>
                         <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                           <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 w-[82%]" />
                         </div>
                       </div>
                       
                       <div>
                         <div className="flex justify-between text-xs font-bold mb-2">
                           <span className="text-white">Neural Queries (LLM)</span>
                           <span className="text-cyan-400">45,210 / 50,000</span>
                         </div>
                         <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                           <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-[90%]" />
                         </div>
                       </div>
                       
                       <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-center">
                         <div>
                           <div className="text-sm font-bold text-white">Enterprise Node</div>
                           <div className="text-xs text-white/50 mt-1">Renews in 14 days</div>
                         </div>
                         <button className="px-6 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 transition-colors">Upgrade Capacity</button>
                       </div>
                     </div>
                  </Glass>
                </div>
              )}

              <div className="flex justify-end mt-8">
                <button onClick={save} className="neon-btn flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all uppercase tracking-wider" style={{ background:saved?"linear-gradient(135deg,#10b981,#059669)":"linear-gradient(135deg,#7c3aed,#22d3ee)", boxShadow:saved?"0 0 30px rgba(16,185,129,.5)":"0 0 30px rgba(124,58,237,.4)" }}>
                  {saved ? <><Check size={18}/>Protocols Saved</> : "Apply Matrix Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── App root ───────────────────────────────────────────────── */
export default function App() {
  const initPage = (window.location.hash.slice(1) as Page) || "landing";
  const [page, setPage] = useState<Page>(initPage);
  const [selectedDoc, setSelectedDoc] = useState<typeof DOCS[0] | null>(null);
  const [, forceRender] = useState({});

  useEffect(() => {
    forceRefreshApp = () => forceRender({});
    
    // Connect to global notifications WebSocket
    const ws = new WebSocket("ws://localhost:8000/ws/notifications");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const ICONS: Record<string, any> = { Sparkles, CheckCircle2, AlertCircle, Network, Upload, MessageSquare, Shield, TrendingUp, Activity, Zap, FileText };
        const newNotif = {
          id: Date.now(),
          type: data.type || "info",
          icon: ICONS[data.icon] || Sparkles,
          color: data.color || "#7c3aed",
          title: data.title || "Notification",
          body: data.body || "",
          time: "Just now",
          read: false
        };
        GLOBAL_NOTIFS = [newNotif, ...GLOBAL_NOTIFS];
        globalUnreadCount++;
        forceRefreshApp();
      } catch (e) {
        console.error("Failed to parse websocket message", e);
      }
    };
    return () => ws.close();
  }, []);

  const navTo = (p: Page) => { 
    if (p === "notifications") {
      globalUnreadCount = 0;
      GLOBAL_NOTIFS = GLOBAL_NOTIFS.map(n => ({...n, read: true}));
    }
    setPage(p); 
    window.location.hash = p; 
  };
  const openDocDetails = (d: typeof DOCS[0]) => {
    setSelectedDoc(d);
    navTo("details");
  };

  const bgImg = page==="chat"||page==="graph" ? IMG.dark : page==="landing"||page==="login"||page==="register" ? IMG.neon : IMG.aurora;
  return (
    <div className="relative min-h-screen" style={{ fontFamily:"'Plus Jakarta Sans',Inter,sans-serif" }}>
      <GStyles/>
      <Aurora img={bgImg}/>
      <Particles/>

      {page==="landing"  && <LandingPage onGetStarted={()=>navTo("login")}/>}
      {page==="login"    && <LoginPage    onLogin={()=>navTo("dashboard")} onBack={()=>navTo("landing")} onGoRegister={()=>navTo("register")}/>}
      {page==="register" && <RegisterPage onLogin={()=>navTo("dashboard")} onGoLogin={()=>navTo("login")}/>}
      {page!=="landing" && page!=="login" && page!=="register" && (
        <div className="relative z-10 flex h-screen overflow-hidden">
          <Sidebar current={page} onNav={navTo} onHome={()=>navTo("landing")}/>
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {page==="dashboard"     && <DashboardPage onNav={navTo} onSelectDoc={openDocDetails}/>}
            {page==="documents"     && <DocumentsPage onNav={navTo} onSelectDoc={openDocDetails}/>}
            {page==="details"       && <DocumentDetailsPage onNav={navTo} doc={selectedDoc || DOCS[0]}/>}
            {page==="chat"          && <ChatPage onNav={navTo} onSelectDoc={openDocDetails}/>}
            {page==="graph"         && <GraphPage onNav={navTo} onSelectDoc={openDocDetails}/>}
            {page==="analytics"     && <AnalyticsPage onNav={navTo}/>}
            {page==="upload"        && <UploadPage onNav={navTo}/>}
            {page==="compare"       && <ComparePage onNav={navTo} onSelectDoc={openDocDetails} selectedDoc={selectedDoc}/>}
            {page==="search"        && <SearchPage onNav={navTo} onSelectDoc={openDocDetails}/>}
            {page==="notifications" && <NotificationsPage onNav={navTo}/>}
            {page==="settings"      && <SettingsPage onNav={navTo}/>}
          </main>
        </div>
      )}
    </div>
  );
}
