import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Bot,
  Tag,
  Network,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Send,
  Bookmark,
  Activity,
} from 'lucide-react';
import apiService from '../services/api';

export default function DocumentWorkspace({ doc, onBack, onNavigateChat }) {
  const [activeRightTab, setActiveRightTab] = useState('summary');
  const [pageNumber, setPageNumber] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [summaryData, setSummaryData] = useState(null);
  const [keywordsData, setKeywordsData] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Q&A within Workspace
  const [workspaceQuery, setWorkspaceQuery] = useState('');
  const [workspaceChat, setWorkspaceChat] = useState([
    {
      sender: 'ai',
      text: `Welcome to the Document AI Workspace for "${doc?.filename || 'Document'}". Ask me questions or explore extracted insights on the right.`,
    },
  ]);
  const [isAnswering, setIsAnswering] = useState(false);

  useEffect(() => {
    if (!doc) return;
    const fetchDocWorkspaceDetails = async () => {
      setLoading(true);
      try {
        const docId = doc.id || doc.doc_id;
        const [sum, key, ana, grp] = await Promise.all([
          apiService.getSummary(docId),
          apiService.getKeywords(docId),
          apiService.getAnalysis(docId),
          apiService.getGraph(docId),
        ]);
        setSummaryData(sum);
        setKeywordsData(key.keywords || []);
        setAnalysisData(ana);
        setGraphData(grp);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocWorkspaceDetails();
  }, [doc]);

  const handleSendWorkspaceQuery = async () => {
    if (!workspaceQuery.trim() || isAnswering) return;
    const q = workspaceQuery;
    const docId = doc.id || doc.doc_id;
    setWorkspaceQuery('');
    setWorkspaceChat((prev) => [...prev, { sender: 'user', text: q }]);
    setIsAnswering(true);

    try {
      const res = await apiService.sendChatMessage(q, docId);
      setWorkspaceChat((prev) => [
        ...prev,
        { sender: 'ai', text: res.answer, citations: res.citations },
      ]);
    } catch {
      setWorkspaceChat((prev) => [
        ...prev,
        { sender: 'ai', text: 'Error synthesizing response from document context.' },
      ]);
    } finally {
      setIsAnswering(false);
    }
  };

  if (!doc) return null;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Top Workspace Bar */}
      <div
        className="rounded-2xl px-6 py-3 flex items-center justify-between shadow-xl shrink-0"
        style={{
          background: 'rgba(2, 5, 16, 0.9)',
          border: '1px solid rgba(124, 58, 237, 0.3)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-white transition-all hover:scale-105 flex items-center gap-1 cursor-pointer"
            style={{
              background: 'rgba(124, 58, 237, 0.15)',
              border: '1px solid rgba(124, 58, 237, 0.35)',
              color: '#a78bfa',
            }}
          >
            <ChevronLeft className="w-4 h-4" /> Back to Library
          </button>
          <div className="h-5 w-px" style={{ background: 'rgba(124, 58, 237, 0.3)' }}></div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-400" />
            <h2 className="text-base font-black text-white truncate max-w-sm">
              {doc.filename}
            </h2>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
              style={{
                background: 'rgba(34, 211, 238, 0.15)',
                border: '1px solid rgba(34, 211, 238, 0.3)',
                color: '#22d3ee',
              }}
            >
              {doc.category || 'General'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono" style={{ color: 'rgba(167, 139, 250, 0.6)' }}>
          <span>Chunks: <strong className="text-white">{doc.total_chunks || 48}</strong></span>
          <span>Size: <strong className="text-white">{((doc.filesize || 2400000) / 1024 / 1024).toFixed(2)} MB</strong></span>
        </div>
      </div>

      {/* Tri-Pane Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Pane 1: Left PDF Document Viewer (4 Cols) */}
        <div
          className="lg:col-span-4 rounded-2xl flex flex-col justify-between overflow-hidden shadow-xl"
          style={{
            background: 'rgba(2, 5, 16, 0.9)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
          }}
        >
          {/* PDF Controls */}
          <div
            className="px-4 py-2.5 flex items-center justify-between text-xs font-semibold"
            style={{
              background: 'rgba(124, 58, 237, 0.08)',
              borderBottom: '1px solid rgba(124, 58, 237, 0.25)',
              color: 'rgba(220, 225, 255, 0.8)',
            }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                className="p-1 rounded hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4 text-violet-400" />
              </button>
              <span>Page {pageNumber} of 12</span>
              <button
                onClick={() => setPageNumber((p) => Math.min(12, p + 1))}
                className="p-1 rounded hover:bg-white/10"
              >
                <ChevronRight className="w-4 h-4 text-violet-400" />
              </button>
            </div>

            <div className="flex items-center gap-1 font-mono">
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                className="p-1 rounded hover:bg-white/10"
              >
                <ZoomOut className="w-3.5 h-3.5 text-cyan-400" />
              </button>
              <span className="text-[11px]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                className="p-1 rounded hover:bg-white/10"
              >
                <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* PDF Page Canvas Mock */}
          <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div
              className="rounded-xl shadow-2xl p-6 max-w-full space-y-4 border text-xs leading-relaxed transform transition-transform origin-top"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                background: '#0d0d1a',
                borderColor: 'rgba(124, 58, 237, 0.3)',
                color: 'rgba(220, 225, 255, 0.85)',
              }}
            >
              <div
                className="pb-2 flex justify-between font-mono text-[10px] uppercase"
                style={{ borderBottom: '1px solid rgba(124, 58, 237, 0.2)', color: 'rgba(167, 139, 250, 0.5)' }}
              >
                <span>Enterprise Spec</span>
                <span>Page {pageNumber}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{doc.filename}</h3>
              <p>
                1. Executive Scope & System Architecture: The AI-KOS platform provisions RAG orchestration through dense vector similarity indexes and hybrid BM25 lexical rankers...
              </p>
              <div
                className="p-3 rounded-lg text-[11px] italic"
                style={{
                  background: 'rgba(34, 211, 238, 0.08)',
                  border: '1px solid rgba(34, 211, 238, 0.25)',
                  color: '#22d3ee',
                }}
              >
                "Vector embedding cosine similarity achieves 98.4% retrieval accuracy across indexed chunks."
              </div>
              <p>
                2. Security & Compliance Protocol: All payload chunks undergo zero-trust encryption at rest with automated PII filtering.
              </p>
            </div>
          </div>
        </div>

        {/* Pane 2: Center Interactive AI Workspace (4 Cols) */}
        <div
          className="lg:col-span-4 rounded-2xl flex flex-col justify-between overflow-hidden shadow-xl"
          style={{
            background: 'rgba(2, 5, 16, 0.9)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{
              background: 'rgba(124, 58, 237, 0.08)',
              borderBottom: '1px solid rgba(124, 58, 237, 0.25)',
            }}
          >
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">Document AI Assistant</span>
            </div>
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
              style={{
                background: 'rgba(34, 211, 238, 0.15)',
                border: '1px solid rgba(34, 211, 238, 0.3)',
                color: '#22d3ee',
              }}
            >
              Active Context
            </span>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {workspaceChat.map((m, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl text-xs leading-relaxed"
                style={
                  m.sender === 'user'
                    ? {
                        background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                        color: 'white',
                        marginLeft: '1.5rem',
                        borderTopRightRadius: 2,
                      }
                    : {
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(124, 58, 237, 0.25)',
                        color: 'rgba(220, 225, 255, 0.9)',
                        marginRight: '1.5rem',
                        borderTopLeftRadius: 2,
                      }
                }
              >
                <p>{m.text}</p>
              </div>
            ))}
            {isAnswering && (
              <div className="text-xs font-mono animate-pulse flex items-center gap-2" style={{ color: '#22d3ee' }}>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Synthesizing answer...
              </div>
            )}
          </div>

          {/* Q&A Input */}
          <div
            className="p-3 flex items-center gap-2"
            style={{
              background: 'rgba(2, 5, 16, 0.95)',
              borderTop: '1px solid rgba(124, 58, 237, 0.25)',
            }}
          >
            <input
              type="text"
              placeholder="Ask about this document..."
              value={workspaceQuery}
              onChange={(e) => setWorkspaceQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendWorkspaceQuery()}
              className="flex-1 rounded-xl px-3 py-2 text-xs focus:outline-none"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                color: 'white',
              }}
            />
            <button
              onClick={handleSendWorkspaceQuery}
              disabled={isAnswering || !workspaceQuery.trim()}
              className="p-2.5 rounded-xl text-white transition-all cursor-pointer disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                boxShadow: '0 0 12px rgba(124, 58, 237, 0.4)',
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pane 3: Right Insights Panel (4 Cols) */}
        <div
          className="lg:col-span-4 rounded-2xl flex flex-col overflow-hidden shadow-xl"
          style={{
            background: 'rgba(2, 5, 16, 0.9)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
          }}
        >
          {/* Insights Tabs Bar */}
          <div
            className="px-3 py-2 flex items-center gap-1 overflow-x-auto"
            style={{
              background: 'rgba(124, 58, 237, 0.08)',
              borderBottom: '1px solid rgba(124, 58, 237, 0.25)',
            }}
          >
            {[
              { id: 'summary', label: 'Summary', icon: Bookmark },
              { id: 'analysis', label: 'Analysis', icon: Activity },
              { id: 'keywords', label: 'Keywords', icon: Tag },
              { id: 'graph', label: 'Graph', icon: Network },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeRightTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveRightTab(tab.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                  style={
                    isActive
                      ? {
                          background: '#7c3aed',
                          color: '#ffffff',
                          boxShadow: '0 0 12px rgba(124, 58, 237, 0.4)',
                        }
                      : {
                          color: 'rgba(180, 185, 230, 0.6)',
                        }
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Insights Tab Content */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {loading ? (
              <div className="py-16 text-center text-xs font-mono text-cyan-400 animate-pulse">
                Extracting deep document intelligence...
              </div>
            ) : (
              <>
                {activeRightTab === 'summary' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      AI Executive Summary
                    </h4>
                    <p
                      className="text-xs leading-relaxed p-4 rounded-xl"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(124, 58, 237, 0.25)',
                        color: 'rgba(220, 225, 255, 0.9)',
                      }}
                    >
                      {summaryData?.summary || 'Summary unavailable.'}
                    </p>
                  </div>
                )}

                {activeRightTab === 'analysis' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Document Quality & Metrics
                    </h4>
                    <div
                      className="p-4 rounded-xl text-xs space-y-2.5"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(124, 58, 237, 0.25)',
                      }}
                    >
                      <div className="flex justify-between font-semibold">
                        <span style={{ color: 'rgba(180, 185, 230, 0.7)' }}>Readability Index:</span>
                        <span style={{ color: '#34d399' }}>{analysisData?.readability_score}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span style={{ color: 'rgba(180, 185, 230, 0.7)' }}>Sentiment:</span>
                        <span style={{ color: '#22d3ee' }}>{analysisData?.sentiment}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeRightTab === 'keywords' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Extracted Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {keywordsData.map((k, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                          style={{
                            background: 'rgba(124, 58, 237, 0.15)',
                            border: '1px solid rgba(124, 58, 237, 0.3)',
                            color: '#c4b5fd',
                          }}
                        >
                          {k.word} ({Math.round((k.score || 0.9) * 100)}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeRightTab === 'graph' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Entity Relationships
                    </h4>
                    {(graphData?.edges || []).map((e, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg text-[11px] flex items-center justify-between"
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(124, 58, 237, 0.2)',
                        }}
                      >
                        <span className="font-bold text-white">{e.source}</span>
                        <span className="font-mono text-[10px] uppercase font-bold" style={{ color: '#ec4899' }}>
                          {e.relation}
                        </span>
                        <span className="font-bold text-white">{e.target}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
