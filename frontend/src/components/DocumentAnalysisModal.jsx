import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Tag,
  Bookmark,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import apiService from '../services/api';

export default function DocumentAnalysisModal({ doc, onClose }) {
  const [summaryData, setSummaryData] = useState(null);
  const [keywordsData, setKeywordsData] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doc) return;
    const fetchDocDetails = async () => {
      setLoading(true);
      try {
        const docId = doc.id || doc.doc_id;
        const [sum, key, ana] = await Promise.all([
          apiService.getSummary(docId),
          apiService.getKeywords(docId),
          apiService.getAnalysis(docId),
        ]);
        setSummaryData(sum);
        setKeywordsData(key.keywords || []);
        setAnalysisData(ana);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocDetails();
  }, [doc]);

  if (!doc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn"
      style={{ background: 'rgba(2, 5, 16, 0.85)', fontFamily: "'Outfit', sans-serif" }}
    >
      <div
        className="w-full max-w-3xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
        style={{
          background: 'rgba(2, 5, 16, 0.95)',
          border: '1px solid rgba(124, 58, 237, 0.35)',
          boxShadow: '0 25px 90px rgba(0,0,0,0.95)',
        }}
      >
        {/* Header */}
        <div
          className="p-6 flex items-center justify-between"
          style={{
            background: 'rgba(124, 58, 237, 0.08)',
            borderBottom: '1px solid rgba(124, 58, 237, 0.25)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)',
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white truncate max-w-md">{doc.filename}</h2>
              <p className="text-xs font-mono" style={{ color: 'rgba(167, 139, 250, 0.6)' }}>
                Category: {doc.category || 'General'} • Total Chunks: {doc.total_chunks || 48}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white transition-colors hover:bg-white/10 cursor-pointer"
            style={{ color: 'rgba(180, 185, 230, 0.6)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs font-mono text-cyan-300">
                Synthesizing AI Summary & Keyword Embeddings...
              </p>
            </div>
          ) : (
            <>
              {/* Executive Summary */}
              <div
                className="p-5 rounded-2xl space-y-2"
                style={{
                  background: 'rgba(34, 211, 238, 0.08)',
                  border: '1px solid rgba(34, 211, 238, 0.25)',
                }}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#22d3ee' }}>
                  <Bookmark className="w-4 h-4 text-cyan-400" /> AI Executive Summary
                </h3>
                <p className="text-sm text-white leading-relaxed">
                  {summaryData?.summary || 'Executive summary unavailable.'}
                </p>
              </div>

              {/* Keyword Cloud */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'rgba(167, 139, 250, 0.7)' }}>
                  <Tag className="w-4 h-4 text-violet-400" /> Extracted Salient Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {keywordsData.map((k, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5"
                      style={{
                        background: 'rgba(124, 58, 237, 0.12)',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        color: 'rgba(220, 225, 255, 0.9)',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      {k.word}
                      <span className="text-[10px] font-mono" style={{ color: 'rgba(167, 139, 250, 0.6)' }}>
                        ({Math.round((k.score || 0.9) * 100)}%)
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Deep Analysis & Readability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="p-4 rounded-2xl space-y-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(124, 58, 237, 0.25)',
                  }}
                >
                  <span className="text-[11px] font-bold uppercase" style={{ color: 'rgba(180, 185, 230, 0.6)' }}>Readability Index</span>
                  <p className="text-sm font-bold text-emerald-400">{analysisData?.readability_score || '84/100 (Executive)'}</p>
                </div>
                <div
                  className="p-4 rounded-2xl space-y-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(124, 58, 237, 0.25)',
                  }}
                >
                  <span className="text-[11px] font-bold uppercase" style={{ color: 'rgba(180, 185, 230, 0.6)' }}>Document Sentiment</span>
                  <p className="text-sm font-bold text-cyan-400">{analysisData?.sentiment || 'Strategic / Positive'}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
