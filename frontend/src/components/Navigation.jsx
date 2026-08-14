import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Bot,
  Network,
  Search,
  GitCompare,
  Sparkles,
  Sliders,
  BarChart2,
  LogOut,
  ShieldCheck,
  Brain,
  Cpu,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'documents', label: 'Document Repository', icon: FolderKanban, badge: 'Live' },
  { id: 'chat', label: 'AI RAG Assistant', icon: Bot, badge: 'Gemini AI' },
  { id: 'graph', label: 'Knowledge Graph', icon: Network, badge: 'Spatial' },
  { id: 'search', label: 'Hybrid Search', icon: Search, badge: 'BM25+Vector' },
  { id: 'compare', label: 'Document Compare', icon: GitCompare, badge: null },
  { id: 'analytics', label: 'Analytics & Insights', icon: BarChart2, badge: 'New' },
  { id: 'settings', label: 'System Settings', icon: Sliders, badge: null },
];

export default function Navigation({ activeTab, setActiveTab, healthStatus = 'Operational' }) {
  const handleLogout = () => {
    localStorage.removeItem('aikos_token');
    window.location.reload();
  };

  return (
    <aside
      className="w-72 flex flex-col justify-between h-screen sticky top-0 z-30 select-none shrink-0"
      style={{
        background: 'rgba(2, 5, 16, 0.95)',
        borderRight: '1px solid rgba(124, 58, 237, 0.25)',
        fontFamily: "'Outfit', sans-serif",
        boxShadow: '10px 0 40px rgba(0,0,0,0.8)',
      }}
    >
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-violet-500/20">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                border: '1px solid rgba(167, 139, 250, 0.4)',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
              }}
            >
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white tracking-tight">AI-KOS</span>
                <span
                  className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
                  style={{
                    background: 'rgba(124, 58, 237, 0.2)',
                    border: '1px solid rgba(167, 139, 250, 0.4)',
                    color: '#c4b5fd',
                  }}
                >
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] font-medium" style={{ color: 'rgba(180, 185, 230, 0.5)' }}>
                Knowledge OS & RAG AI
              </p>
            </div>
          </div>
        </div>

        {/* Backend Health Pill */}
        <div
          className="px-4 py-3 mx-4 my-4 rounded-2xl flex items-center justify-between"
          style={{
            background: 'rgba(124, 58, 237, 0.08)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-200">FastAPI Backend</span>
          </div>
          <span
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
            }}
          >
            {healthStatus}
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 py-2 space-y-1">
          <div
            className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider"
            style={{ color: 'rgba(167, 139, 250, 0.5)' }}
          >
            Core Intelligence Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 group cursor-pointer"
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(91,33,182,0.2))',
                        border: '1px solid rgba(124,58,237,0.4)',
                        color: '#ffffff',
                        boxShadow: '0 0 20px rgba(124,58,237,0.25)',
                      }
                    : {
                        color: 'rgba(180, 185, 230, 0.65)',
                        border: '1px solid transparent',
                      }
                }
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
                    style={{ color: isActive ? '#a78bfa' : 'rgba(167, 139, 250, 0.5)' }}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full"
                    style={
                      isActive
                        ? { background: 'rgba(255,255,255,0.15)', color: '#ffffff' }
                        : {
                            background: 'rgba(34, 211, 238, 0.12)',
                            border: '1px solid rgba(34, 211, 238, 0.3)',
                            color: '#22d3ee',
                          }
                    }
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Security */}
      <div className="p-4 border-t border-violet-500/20 space-y-3">
        <div
          className="rounded-2xl p-3 flex items-center justify-between"
          style={{
            background: 'rgba(124, 58, 237, 0.08)',
            border: '1px solid rgba(124, 58, 237, 0.25)',
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-white text-xs shrink-0"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                boxShadow: '0 0 12px rgba(124, 58, 237, 0.4)',
              }}
            >
              EA
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">Enterprise Admin</p>
              <p className="text-[10px] font-mono truncate" style={{ color: 'rgba(167, 139, 250, 0.6)' }}>
                admin@ai-kos.enterprise
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-rose-500/20 hover:text-rose-400"
            style={{ color: 'rgba(180, 185, 230, 0.4)' }}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
