import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  Key,
  Cpu,
  Database,
  CheckCircle,
  Save,
  Sparkles,
} from 'lucide-react';

export default function SettingsView() {
  const [model, setModel] = useState('gemini-3.1-flash-lite');
  const [chunkSize, setChunkSize] = useState('1000');
  const [chunkOverlap, setChunkOverlap] = useState('200');
  const [apiKey, setApiKey] = useState('••••••••••••••••••••••••••••••••');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-violet-400" /> Enterprise System Settings
        </h1>
        <p className="text-sm font-medium mt-1" style={{ color: 'rgba(180, 185, 230, 0.6)' }}>
          Configure AI model hyperparameters, ChromaDB vector chunking algorithms, and security credentials.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Gemini AI Specs */}
        <div
          className="rounded-3xl p-6 space-y-4"
          style={{
            background: 'rgba(2, 5, 16, 0.9)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.85)',
          }}
        >
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" /> Gemini RAG Model Selection
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(167, 139, 250, 0.6)' }}>
                LLM Model Architecture
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
                style={{
                  background: '#0d0d1a',
                  border: '1px solid rgba(124, 58, 237, 0.4)',
                  color: 'white',
                }}
              >
                <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Ultra-fast RAG)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Balanced)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(167, 139, 250, 0.6)' }}>
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(124, 58, 237, 0.4)',
                    color: 'white',
                  }}
                />
                <Key className="w-4 h-4 absolute right-3.5 top-3.5" style={{ color: 'rgba(167, 139, 250, 0.5)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Vector Chunking Specs */}
        <div
          className="rounded-3xl p-6 space-y-4"
          style={{
            background: 'rgba(2, 5, 16, 0.9)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.85)',
          }}
        >
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-violet-400" /> Vector Indexing Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(167, 139, 250, 0.6)' }}>
                Chunk Size (Characters)
              </label>
              <input
                type="number"
                value={chunkSize}
                onChange={(e) => setChunkSize(e.target.value)}
                className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(124, 58, 237, 0.4)',
                  color: 'white',
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(167, 139, 250, 0.6)' }}>
                Chunk Overlap (Characters)
              </label>
              <input
                type="number"
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(e.target.value)}
                className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(124, 58, 237, 0.4)',
                  color: 'white',
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-bold flex items-center gap-1.5 text-emerald-400">
              <CheckCircle className="w-4 h-4" /> System Configuration Saved Successfully!
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-105 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
              }}
            >
              <Save className="w-4 h-4 inline ml-1" /> Save Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
