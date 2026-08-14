import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  FileText,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Search,
  Tag,
  Layers,
  BookOpen,
  Cpu,
} from 'lucide-react';

// ─── Searchable Document Picker ───────────────────────────────────────────────
function DocPicker({ label, value, onChange, documents, disabledId }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return q
      ? documents.filter(
          (d) =>
            d.filename?.toLowerCase().includes(q) ||
            d.file_type?.toLowerCase().includes(q) ||
            d.category?.toLowerCase().includes(q)
        )
      : documents;
  }, [search, documents]);

  const selected = documents.find(
    (d) => (d.doc_id || d.id) === value
  );

  return (
    <div className="space-y-2 relative">
      <label
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: 'rgba(167, 139, 250, 0.6)' }}
      >
        {label}
      </label>

      {/* Selected doc chip */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-2xl px-4 py-3 text-sm text-left flex items-center justify-between gap-2 focus:outline-none transition-all"
        style={{
          background: '#0d0d1a',
          border: `1px solid ${open ? 'rgba(124,58,237,0.7)' : 'rgba(124,58,237,0.4)'}`,
          color: selected ? 'white' : 'rgba(167,139,250,0.5)',
        }}
      >
        <span className="flex items-center gap-2 truncate">
          <FileText className="w-4 h-4 shrink-0 text-violet-400" />
          <span className="truncate">{selected ? selected.filename : 'Select a document…'}</span>
        </span>
        {selected && (
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0"
            style={{
              background: 'rgba(124,58,237,0.2)',
              border: '1px solid rgba(124,58,237,0.4)',
              color: '#a78bfa',
            }}
          >
            {selected.file_type || selected.filetype || 'doc'}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute z-50 w-full rounded-2xl overflow-hidden"
          style={{
            top: 'calc(100% + 6px)',
            background: '#0d0d1a',
            border: '1px solid rgba(124,58,237,0.5)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            maxHeight: '320px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Search box */}
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{ borderBottom: '1px solid rgba(124,58,237,0.2)' }}
          >
            <Search className="w-4 h-4 shrink-0" style={{ color: '#7c3aed' }} />
            <input
              autoFocus
              type="text"
              placeholder="Search by name, type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm focus:outline-none"
              style={{ color: 'white' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-xs"
                style={{ color: 'rgba(167,139,250,0.5)' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Count badge */}
          <div
            className="px-3 py-1.5 text-[10px] font-mono"
            style={{ color: 'rgba(167,139,250,0.4)', borderBottom: '1px solid rgba(124,58,237,0.1)' }}
          >
            {filtered.length} / {documents.length} documents
          </div>

          {/* List */}
          <ul className="overflow-y-auto flex-1">
            {filtered.length === 0 && (
              <li className="px-4 py-6 text-center text-xs" style={{ color: 'rgba(167,139,250,0.4)' }}>
                No documents match "{search}"
              </li>
            )}
            {filtered.map((d) => {
              const id = d.doc_id || d.id;
              const isDisabled = id === disabledId;
              const isSelected = id === value;
              return (
                <li key={id}>
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      onChange(id);
                      setOpen(false);
                      setSearch('');
                    }}
                    className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-all"
                    style={{
                      background: isSelected
                        ? 'rgba(124,58,237,0.18)'
                        : 'transparent',
                      color: isDisabled
                        ? 'rgba(167,139,250,0.3)'
                        : 'rgba(220,225,255,0.9)',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      borderBottom: '1px solid rgba(124,58,237,0.08)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isDisabled && !isSelected)
                        e.currentTarget.style.background = 'rgba(124,58,237,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.background = isSelected
                          ? 'rgba(124,58,237,0.18)'
                          : 'transparent';
                    }}
                  >
                    <FileText className="w-4 h-4 shrink-0 text-violet-400" />
                    <span className="flex-1 truncate font-medium">{d.filename}</span>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0"
                      style={{
                        background: 'rgba(124,58,237,0.15)',
                        color: '#a78bfa',
                      }}
                    >
                      {d.file_type || d.filetype || 'doc'}
                    </span>
                    {d.chunk_count != null && (
                      <span
                        className="text-[10px] font-mono shrink-0"
                        style={{ color: 'rgba(167,139,250,0.4)' }}
                      >
                        {d.chunk_count}c
                      </span>
                    )}
                    {isDisabled && (
                      <span className="text-[10px]" style={{ color: 'rgba(167,139,250,0.3)' }}>
                        (selected above)
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Alignment Score Ring ──────────────────────────────────────────────────────
function AlignmentGauge({ score }) {
  const pct = Math.round((score || 0) * 100);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const color =
    pct >= 75 ? '#34d399' : pct >= 50 ? '#fbbf24' : '#f87171';
  const label =
    pct >= 75 ? 'High Alignment' : pct >= 50 ? 'Moderate Alignment' : 'Low Alignment';

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Background track */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="rgba(124,58,237,0.15)"
          strokeWidth="10"
        />
        {/* Foreground arc */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.4s ease' }}
        />
        {/* Centre text */}
        <text x="70" y="65" textAnchor="middle" fontSize="26" fontWeight="900" fill={color} fontFamily="Outfit,sans-serif">
          {pct}%
        </text>
        <text x="70" y="83" textAnchor="middle" fontSize="9" fill="rgba(167,139,250,0.6)" fontFamily="monospace">
          ALIGNMENT
        </text>
      </svg>
      <span
        className="text-xs font-bold px-3 py-1 rounded-full"
        style={{
          background: `${color}18`,
          border: `1px solid ${color}44`,
          color,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Main Compare View ─────────────────────────────────────────────────────────
export default function CompareView({ documents, onCompareDocs }) {
  const [doc1Id, setDoc1Id] = useState(documents[0]?.doc_id || documents[0]?.id || '');
  const [doc2Id, setDoc2Id] = useState(documents[1]?.doc_id || documents[1]?.id || documents[0]?.doc_id || documents[0]?.id || '');
  const [compareData, setCompareData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isSameDoc = doc1Id && doc2Id && doc1Id === doc2Id;

  const handleCompare = async () => {
    if (!doc1Id || !doc2Id || isSameDoc) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await onCompareDocs(doc1Id, doc2Id);
      setCompareData(res);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Comparison failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-violet-400" /> Document Comparison Matrix
        </h1>
        <p className="text-sm font-medium mt-1" style={{ color: 'rgba(180, 185, 230, 0.6)' }}>
          AI comparative synthesis — similarities, divergences, and a real embedding alignment score.
          {documents.length > 0 && (
            <span className="ml-2 font-bold" style={{ color: '#a78bfa' }}>
              {documents.length} documents available
            </span>
          )}
        </p>
      </div>

      {/* Selectors */}
      <div
        className="rounded-3xl p-6 space-y-6"
        style={{
          background: 'rgba(2, 5, 16, 0.9)',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.85)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocPicker
            label="Primary Document A"
            value={doc1Id}
            onChange={setDoc1Id}
            documents={documents}
            disabledId={doc2Id}
          />
          <DocPicker
            label="Comparative Document B"
            value={doc2Id}
            onChange={setDoc2Id}
            documents={documents}
            disabledId={doc1Id}
          />
        </div>

        {/* Same doc warning */}
        {isSameDoc && (
          <div
            className="rounded-2xl px-4 py-3 text-xs font-mono flex items-center gap-2"
            style={{
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.3)',
              color: '#fbbf24',
            }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Please select two different documents to compare.
          </div>
        )}

        <button
          onClick={handleCompare}
          disabled={isLoading || !doc1Id || !doc2Id || isSameDoc}
          className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:scale-105 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            boxShadow: '0 0 25px rgba(124, 58, 237, 0.5)',
          }}
        >
          {isLoading ? (
            <span className="animate-pulse">Synthesizing Comparative Analysis…</span>
          ) : (
            <>Run AI Comparison <GitCompare className="w-4 h-4 inline ml-1" /></>
          )}
        </button>

        {/* Error */}
        {error && (
          <div
            className="rounded-2xl px-4 py-3 text-xs font-mono"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5',
            }}
          >
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* ── Comparison Output ── */}
      {compareData && (
        <div className="space-y-6">

          {/* Alignment Score + Document Names */}
          <div
            className="rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8"
            style={{
              background: 'rgba(2, 5, 16, 0.9)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.85)',
            }}
          >
            <AlignmentGauge score={compareData.similarity_score} />

            <div className="flex-1 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: '#22d3ee' }}>
                <Sparkles className="w-4 h-4 text-cyan-400" /> Document Pair
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Document A', name: compareData.document_1, summary: compareData.summary_1 },
                  { label: 'Document B', name: compareData.document_2, summary: compareData.summary_2 },
                ].map((doc, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-4 space-y-1"
                    style={{
                      background: 'rgba(124,58,237,0.07)',
                      border: '1px solid rgba(124,58,237,0.2)',
                    }}
                  >
                    <span className="text-[10px] font-mono uppercase" style={{ color: 'rgba(167,139,250,0.5)' }}>
                      {doc.label}
                    </span>
                    <p className="text-sm font-bold text-white">{doc.name}</p>
                    {doc.summary && (
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(220,225,255,0.7)' }}>
                        {doc.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Synthesis Overview */}
          {compareData.summary && (
            <div
              className="p-6 rounded-3xl space-y-2"
              style={{
                background: 'rgba(34, 211, 238, 0.08)',
                border: '1px solid rgba(34, 211, 238, 0.3)',
              }}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: '#22d3ee' }}>
                <BookOpen className="w-4 h-4 text-cyan-400" /> Comparative Synthesis Overview
              </h3>
              <p className="text-sm leading-relaxed font-medium text-white">{compareData.summary}</p>
            </div>
          )}

          {/* Similarities & Differences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Similarities */}
            <div
              className="rounded-3xl p-6 space-y-4"
              style={{
                background: 'rgba(2, 5, 16, 0.85)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
              }}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: '#34d399' }}>
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Strategic Alignment &amp; Similarities
                <span className="ml-auto font-mono text-[10px]" style={{ color: 'rgba(52,211,153,0.5)' }}>
                  {(compareData.similarities || []).length} found
                </span>
              </h4>
              {(compareData.similarities || []).length === 0 ? (
                <p className="text-xs" style={{ color: 'rgba(167,139,250,0.4)' }}>None identified.</p>
              ) : (
                <ul className="space-y-2.5">
                  {(compareData.similarities || []).map((item, i) => (
                    <li
                      key={i}
                      className="text-xs leading-relaxed flex items-start gap-2.5 p-3.5 rounded-2xl font-medium"
                      style={{
                        background: 'rgba(16, 185, 129, 0.06)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        color: 'rgba(220, 225, 255, 0.9)',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Differences */}
            <div
              className="rounded-3xl p-6 space-y-4"
              style={{
                background: 'rgba(2, 5, 16, 0.85)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
              }}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: '#fbbf24' }}>
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Technical &amp; Scope Differences
                <span className="ml-auto font-mono text-[10px]" style={{ color: 'rgba(251,191,36,0.5)' }}>
                  {(compareData.differences || []).length} found
                </span>
              </h4>
              {(compareData.differences || []).length === 0 ? (
                <p className="text-xs" style={{ color: 'rgba(167,139,250,0.4)' }}>None identified.</p>
              ) : (
                <ul className="space-y-2.5">
                  {(compareData.differences || []).map((item, i) => (
                    <li
                      key={i}
                      className="text-xs leading-relaxed flex items-start gap-2.5 p-3.5 rounded-2xl font-medium"
                      style={{
                        background: 'rgba(245, 158, 11, 0.06)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        color: 'rgba(220, 225, 255, 0.9)',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Common Topics + Technical Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Topics */}
            {(compareData.common_topics || []).length > 0 && (
              <div
                className="rounded-3xl p-6 space-y-4"
                style={{
                  background: 'rgba(2, 5, 16, 0.85)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                }}
              >
                <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: '#a78bfa' }}>
                  <Tag className="w-4 h-4 text-violet-400" /> Common Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(compareData.common_topics || []).map((topic, i) => (
                    <span
                      key={i}
                      className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{
                        background: 'rgba(124,58,237,0.15)',
                        border: '1px solid rgba(124,58,237,0.3)',
                        color: '#c4b5fd',
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Comparison */}
            {compareData.technical_comparison && (
              <div
                className="rounded-3xl p-6 space-y-3"
                style={{
                  background: 'rgba(2, 5, 16, 0.85)',
                  border: '1px solid rgba(34, 211, 238, 0.2)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                }}
              >
                <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: '#22d3ee' }}>
                  <Cpu className="w-4 h-4 text-cyan-400" /> Technical Depth
                </h4>
                <p className="text-xs leading-relaxed font-medium" style={{ color: 'rgba(220,225,255,0.85)' }}>
                  {compareData.technical_comparison}
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
