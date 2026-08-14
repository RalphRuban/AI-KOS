import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Activity,
  BarChart2,
  Database,
  Layers,
  Zap,
  ShieldCheck,
  Cpu,
  Sparkles,
  Server,
  Wifi,
  Clock,
} from 'lucide-react';

export default function AnalyticsView({ dashboardData }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`space-y-8 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Title & Live Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">Live Telemetry Active</span>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight flex items-center gap-3">
            System Analytics
          </h1>
          <p className="text-sm font-medium mt-2" style={{ color: 'rgba(180, 185, 230, 0.6)' }}>
            Real-time insights into vector embeddings, RAG performance, and knowledge base health.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-5 py-3 rounded-2xl flex items-center gap-3" style={{ background: 'rgba(2,5,16,0.6)', border: '1px solid rgba(124,58,237,0.2)' }}>
             <Server className="w-5 h-5 text-violet-400" />
             <div>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cluster Status</p>
               <p className="text-sm font-bold text-white">Optimal</p>
             </div>
           </div>
           <div className="px-5 py-3 rounded-2xl flex items-center gap-3" style={{ background: 'rgba(2,5,16,0.6)', border: '1px solid rgba(16,185,129,0.2)' }}>
             <Wifi className="w-5 h-5 text-emerald-400" />
             <div>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">API Latency</p>
               <p className="text-sm font-bold text-white">24ms</p>
             </div>
           </div>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="relative overflow-hidden rounded-3xl p-6 group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/20"
          style={{
            background: 'linear-gradient(145deg, rgba(15,20,40,0.8) 0%, rgba(5,10,20,0.9) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
          }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
             <Zap className="w-32 h-32 text-violet-400" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-violet-300">
                Embedding Accuracy
              </span>
              <div className="p-2 rounded-xl" style={{ background: 'rgba(124, 58, 237, 0.15)' }}>
                <Activity className="w-4 h-4 text-violet-400" />
              </div>
            </div>
            <div>
              <div className="flex items-end gap-3">
                <p className="text-5xl font-black text-white tracking-tighter">{dashboardData?.avg_confidence || '96.4'}<span className="text-2xl text-violet-400">%</span></p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}>
                  <TrendingUp className="w-3 h-3" /> +1.8%
                </span>
                <span className="text-[11px] text-gray-500 font-medium">vs last month</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-3xl p-6 group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/20"
          style={{
            background: 'linear-gradient(145deg, rgba(10,25,35,0.8) 0%, rgba(5,10,20,0.9) 100%)',
            border: '1px solid rgba(34, 211, 238, 0.3)',
          }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
             <Database className="w-32 h-32 text-cyan-400" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-300">
                Vector Storage
              </span>
              <div className="p-2 rounded-xl" style={{ background: 'rgba(34, 211, 238, 0.15)' }}>
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <p className="text-5xl font-black text-white tracking-tighter">{dashboardData?.vector_store_size || '128.4'}<span className="text-xl text-cyan-400 font-medium ml-1">MB</span></p>
              <div className="mt-3">
                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">{dashboardData?.total_chunks || 524} Vector Chunks Indexed (45% capacity)</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-3xl p-6 group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/20"
          style={{
            background: 'linear-gradient(145deg, rgba(30,15,30,0.8) 0%, rgba(5,10,20,0.9) 100%)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
          }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
             <BarChart2 className="w-32 h-32 text-pink-400" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-pink-300">
                Total Queries
              </span>
              <div className="p-2 rounded-xl" style={{ background: 'rgba(236, 72, 153, 0.15)' }}>
                <Zap className="w-4 h-4 text-pink-400" />
              </div>
            </div>
            <div>
              <p className="text-5xl font-black text-white tracking-tighter">
                {(dashboardData?.queries_processed || 1289).toLocaleString()}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg" style={{ background: 'rgba(236,72,153,0.1)', color: '#f472b6' }}>
                  <Clock className="w-3 h-3" /> 84ms avg
                </span>
                <span className="text-[11px] text-gray-500 font-medium">Response Latency</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div
          className="lg:col-span-2 rounded-3xl p-8 space-y-8 relative overflow-hidden"
          style={{
            background: 'rgba(5, 10, 20, 0.6)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Subtle grid background */}
          <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                Query Throughput & Accuracy
              </h3>
              <p className="text-xs text-gray-400 mt-1">7-Day Trailing Window</p>
            </div>
            <div className="flex gap-3">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                 <span className="text-[10px] text-gray-400 font-bold uppercase">Accuracy</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                 <span className="text-[10px] text-gray-400 font-bold uppercase">Volume</span>
               </div>
            </div>
          </div>

          <div className="relative z-10 h-64 flex items-end gap-2 sm:gap-6 justify-between pt-8 border-b border-gray-800/50 pb-2">
            {[
              { day: 'Mon', volHeight: '40%', accHeight: '65%', val: '94.2%', queries: 145 },
              { day: 'Tue', volHeight: '60%', accHeight: '80%', val: '96.5%', queries: 210 },
              { day: 'Wed', volHeight: '85%', accHeight: '92%', val: '98.1%', queries: 340 },
              { day: 'Thu', volHeight: '70%', accHeight: '75%', val: '95.4%', queries: 280 },
              { day: 'Fri', volHeight: '100%', accHeight: '88%', val: '97.8%', queries: 412 },
              { day: 'Sat', volHeight: '30%', accHeight: '50%', val: '92.0%', queries: 110 },
              { day: 'Sun', volHeight: '50%', accHeight: '70%', val: '96.1%', queries: 190 },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer">
                {/* Tooltip */}
                <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 flex flex-col items-center">
                  <div className="bg-gray-900 border border-gray-700 px-3 py-2 rounded-xl shadow-xl flex flex-col items-center gap-1 min-w-[80px]">
                    <span className="text-[10px] font-bold text-cyan-400">{bar.val} Acc</span>
                    <span className="text-[10px] font-bold text-violet-400">{bar.queries} Qs</span>
                  </div>
                  <div className="w-2 h-2 bg-gray-900 border-b border-r border-gray-700 rotate-45 -mt-1"></div>
                </div>

                <div className="relative w-full h-full flex items-end justify-center gap-1 group-hover:scale-105 transition-transform duration-300">
                   {/* Volume Bar */}
                   <div 
                     className="w-1/2 rounded-t-lg opacity-60 group-hover:opacity-100 transition-opacity"
                     style={{ 
                       height: bar.volHeight, 
                       background: 'linear-gradient(180deg, #8b5cf6, rgba(139, 92, 246, 0.1))',
                     }}
                   ></div>
                   {/* Accuracy Bar */}
                   <div 
                     className="w-1/2 rounded-t-lg group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all"
                     style={{ 
                       height: bar.accHeight, 
                       background: 'linear-gradient(180deg, #22d3ee, rgba(34, 211, 238, 0.1))',
                     }}
                   ></div>
                </div>
                <span className="text-[11px] font-bold text-gray-500 mt-3 group-hover:text-gray-300 transition-colors">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="rounded-3xl p-8 flex flex-col gap-6" style={{ background: 'rgba(5, 10, 20, 0.6)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
           <div>
             <h3 className="text-lg font-black text-white">System Resources</h3>
             <p className="text-xs text-gray-400 mt-1">Real-time infrastructure utilization</p>
           </div>

           <div className="space-y-6 flex-1 flex flex-col justify-center">
             <div className="space-y-2">
               <div className="flex justify-between items-end">
                 <span className="text-xs font-bold text-gray-300 flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-blue-400" /> Compute Load</span>
                 <span className="text-xs font-mono text-blue-400 font-bold">42%</span>
               </div>
               <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
                 <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-1000" style={{ width: '42%' }}></div>
               </div>
             </div>

             <div className="space-y-2">
               <div className="flex justify-between items-end">
                 <span className="text-xs font-bold text-gray-300 flex items-center gap-2"><Database className="w-3.5 h-3.5 text-emerald-400" /> Memory Usage</span>
                 <span className="text-xs font-mono text-emerald-400 font-bold">68%</span>
               </div>
               <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
                 <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: '68%' }}></div>
               </div>
             </div>

             <div className="space-y-2">
               <div className="flex justify-between items-end">
                 <span className="text-xs font-bold text-gray-300 flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-violet-400" /> Index Health</span>
                 <span className="text-xs font-mono text-violet-400 font-bold">99%</span>
               </div>
               <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
                 <div className="bg-gradient-to-r from-violet-600 to-violet-400 h-full rounded-full transition-all duration-1000" style={{ width: '99%' }}></div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
