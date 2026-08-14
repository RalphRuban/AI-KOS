import React, { useState, useEffect } from 'react';
import {
  FileText,
  Layers,
  Database,
  Network,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock,
  Sparkles,
  Zap,
  Upload,
  Search,
  BarChart3,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function DashboardView({ dashboardData, onNavigate, onSelectDocument }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const stats = [
    {
      label: 'Total Documents',
      value: dashboardData?.total_documents ?? '—',
      change: '+2 this week',
      icon: FileText,
      color: '#7c3aed',
      glow: 'rgba(124,58,237,0.4)',
    },
    {
      label: 'Vector Chunks',
      value: dashboardData?.total_chunks ?? '—',
      change: 'ChromaDB Indexed',
      icon: Layers,
      color: '#22d3ee',
      glow: 'rgba(34,211,238,0.4)',
    },
    {
      label: 'Knowledge Entities',
      value: dashboardData?.total_entities ?? '—',
      change: `${dashboardData?.total_relationships ?? '—'} Relations`,
      icon: Network,
      color: '#ec4899',
      glow: 'rgba(236,72,153,0.4)',
    },
    {
      label: 'Queries Handled',
      value: dashboardData?.queries_processed ?? '—',
      change: `Avg. ${dashboardData?.avg_confidence ?? '—'} Precision`,
      icon: Zap,
      color: '#10b981',
      glow: 'rgba(16,185,129,0.4)',
    },
  ];

  const quickActions = [
    { label: 'Upload Document', icon: Upload, tab: 'documents', color: '#7c3aed' },
    { label: 'AI Chat', icon: MessageSquare, tab: 'chat', color: '#22d3ee' },
    { label: 'Knowledge Graph', icon: Network, tab: 'graph', color: '#ec4899' },
    { label: 'Search', icon: Search, tab: 'search', color: '#10b981' },
    { label: 'Analytics', icon: BarChart3, tab: 'analytics', color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Hero Banner ── */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          minHeight: 280,
          background: 'linear-gradient(135deg, rgba(2,5,16,0.95) 0%, rgba(76,29,149,0.5) 50%, rgba(2,5,16,0.95) 100%)',
          border: '1px solid rgba(124,58,237,0.4)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 40px rgba(124,58,237,0.15)',
        }}
      >
        {/* Background image layer */}
        <img
          src="/ui_dashboard_ai_analytics.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
        />
        {/* Accent top line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg,transparent,#7c3aed,#22d3ee,#ec4899,transparent)' }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 p-10">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(167,139,250,0.4)', color: '#c4b5fd' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI-KOS · Enterprise Knowledge Intelligence · v2.0
            </div>
            <h1 className="text-4xl font-black text-white leading-tight" style={{ letterSpacing: '-1px' }}>
              Enterprise Knowledge<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee, #a78bfa, #ec4899)' }}>
                Intelligence Hub
              </span>
            </h1>
            <p className="text-sm font-medium leading-relaxed" style={{ color: 'rgba(200,210,255,0.7)', maxWidth: 480 }}>
              Synthesize, query, and visualize your organizational knowledge in real-time — powered by ChromaDB vector similarity, BM25 hybrid search, and Gemini RAG intelligence.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'rgba(167,139,250,0.5)' }}>
              <CheckCircle size={12} className="text-emerald-400" />
              System: {dashboardData?.system_health ?? 'Operational'} &nbsp;·&nbsp;
              <Clock size={12} />
              {time.toLocaleTimeString()}
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            <button
              onClick={() => onNavigate('documents')}
              className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', boxShadow: '0 0 25px rgba(124,58,237,0.6)' }}
            >
              <Upload size={16} /> Upload Document
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <MessageSquare size={16} /> Launch AI Chat
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {quickActions.map(({ label, icon: Icon, tab, color }) => (
          <button
            key={tab}
            onClick={() => onNavigate(tab)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl font-bold text-sm transition-all hover:scale-105 text-white"
            style={{
              background: `${color}12`,
              border: `1px solid ${color}40`,
              boxShadow: `0 4px 20px ${color}15`,
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${color}20`, border: `1px solid ${color}50` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: 'rgba(220,225,255,0.85)' }}>{label}</span>
          </button>
        ))}
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl p-5 space-y-3"
              style={{
                background: 'rgba(2,5,16,0.85)',
                border: `1px solid ${stat.color}30`,
                boxShadow: `0 8px 30px rgba(0,0,0,0.6), 0 0 20px ${stat.glow}`,
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(180,185,230,0.5)' }}>
                  {stat.label}
                </span>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${stat.color}20`, border: `1px solid ${stat.color}40` }}>
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-3xl font-black text-white">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: stat.color }}>
                <TrendingUp size={12} />
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Activity & Category ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Activity */}
        <div
          className="lg:col-span-2 rounded-2xl p-6 space-y-4"
          style={{ background: 'rgba(2,5,16,0.85)', border: '1px solid rgba(124,58,237,0.25)', backdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity size={18} style={{ color: '#7c3aed' }} />
              <h2 className="text-base font-black text-white">Live System Activity</h2>
            </div>
            <span className="text-[10px] font-mono" style={{ color: 'rgba(167,139,250,0.4)' }}>FastAPI Realtime Log</span>
          </div>

          {(dashboardData?.recent_activity?.length > 0) ? (
            <div className="space-y-2">
              {dashboardData.recent_activity.map((act, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3.5 rounded-xl transition-all hover:bg-white/5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}>
                      <Clock size={13} style={{ color: '#a78bfa' }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{act.title}</p>
                      <span className="text-[10px] font-mono" style={{ color: 'rgba(167,139,250,0.5)' }}>{act.time}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('documents')}
                    className="text-xs font-bold flex items-center gap-1 transition-all hover:gap-2"
                    style={{ color: '#22d3ee' }}
                  >
                    Inspect <ArrowUpRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-3" style={{ color: 'rgba(167,139,250,0.4)' }}>
              <AlertCircle size={28} />
              <p className="text-xs font-semibold">No activity yet — upload a document to get started</p>
              <button
                onClick={() => onNavigate('documents')}
                className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
                style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', color: '#a78bfa' }}
              >
                Upload First Document
              </button>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div
          className="rounded-2xl p-6 space-y-4 flex flex-col justify-between"
          style={{ background: 'rgba(2,5,16,0.85)', border: '1px solid rgba(34,211,238,0.2)', backdropFilter: 'blur(12px)' }}
        >
          <div>
            <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
              <Database size={18} style={{ color: '#22d3ee' }} /> Category Breakdown
            </h2>
            {(dashboardData?.category_distribution?.length > 0) ? (
              <div className="space-y-3">
                {dashboardData.category_distribution.map((cat, i) => {
                  const colors = ['#7c3aed', '#22d3ee', '#ec4899', '#10b981', '#f59e0b'];
                  const c = colors[i % colors.length];
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-white">{cat.name}</span>
                        <span style={{ color: c }}>{cat.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cat.percentage}%`, background: c, boxShadow: `0 0 8px ${c}` }} />
                      </div>
                      <div className="text-[10px]" style={{ color: 'rgba(180,185,230,0.4)' }}>{cat.count} documents</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs font-semibold text-center py-6" style={{ color: 'rgba(167,139,250,0.4)' }}>
                No documents categorized yet
              </div>
            )}
          </div>

          {/* ChromaDB Status */}
          <div className="p-4 rounded-xl space-y-2" style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)' }}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: '#22d3ee' }}>
              <ShieldCheck size={14} /> ChromaDB Vector Status
            </div>
            <p className="text-xs font-medium" style={{ color: 'rgba(180,185,230,0.7)' }}>
              Store size: <strong className="text-white">{dashboardData?.vector_store_size ?? 'Calculating...'}</strong>
              {' '}· BM25 hybrid index <span className="text-emerald-400 font-bold">active</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
