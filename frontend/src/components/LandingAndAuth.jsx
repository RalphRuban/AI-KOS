import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Bot,
  Zap,
  Lock,
  ArrowRight,
  Database,
  Layers,
  Network,
  CheckCircle,
} from 'lucide-react';
import apiService from '../services/api';

export default function LandingAndAuth({ onAuthenticated }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await apiService.login(username || 'admin', password || 'password');
      onAuthenticated(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Dark neon ambient background */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 40%, rgba(124,58,237,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 60%, rgba(34,211,238,0.12) 0%, transparent 60%), rgb(2,5,16)' }} />
      {/* Top Glass Navbar */}
      <header className="h-20 border-b border-white/60 liquid-glass sticky top-0 z-40 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-gradient-primary">
              AI-KOS Enterprise
            </span>
            <span className="ml-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-widest">
              v2.0 Spatial
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            Enterprise Login <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-6xl mx-auto w-full relative z-10 space-y-12 my-12">
        <div className="text-center space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/60 border border-blue-400/40 text-blue-300 text-xs font-bold shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Next-Generation Spatial AI Knowledge OS
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Synthesize Enterprise Data with <span className="text-gradient-cyan">Spatial Intelligence</span>
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed font-medium">
            Unify unstructured PDF documents, ChromaDB vector embeddings, BM25 hybrid search, and multi-turn Gemini RAG AI inside a liquid glass workspace.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-extrabold text-base shadow-2xl shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-3"
            >
              Launch Workspace Demo <Zap className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8">
          {[
            {
              icon: Database,
              title: 'Hybrid ChromaDB RAG',
              desc: 'Dense vector similarity integrated with BM25 lexical keyword weighting for precision retrieval.',
            },
            {
              icon: Network,
              title: 'Knowledge Physics Graph',
              desc: 'Extract entity relations, calculate eigen centrality, and explore community clusters dynamically.',
            },
            {
              icon: ShieldCheck,
              title: 'Enterprise Security',
              desc: 'AES-256 encrypted vector storage, JWT role authentication, and PII compliance validation.',
            },
          ].map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="liquid-glass-interactive rounded-3xl p-8 border border-white/80 space-y-4 shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100/80 border border-blue-200 flex items-center justify-center text-blue-600 shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{pillar.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="liquid-glass w-full max-w-md rounded-3xl p-8 border border-white shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Enterprise Login</h3>
                  <p className="text-xs text-slate-500">Access AI-KOS Enterprise Platform</p>
                </div>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Username / Email
                </label>
                <input
                  type="text"
                  placeholder="admin@ai-kos.enterprise"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? 'Authenticating...' : 'Sign In to Workspace'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
