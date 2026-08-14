import React, { useState } from 'react';
import {
  Search,
  FileText,
  Sparkles,
  Zap,
  Filter,
  Layers,
  Database,
  CheckCircle2,
} from 'lucide-react';

function ScoreBadge({ score }) {
  const pct = Math.round((score || 0) * 100);
  const style =
    pct >= 80
      ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }
      : pct >= 60
      ? { background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }
      : { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' };
  return (
    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full block" style={style}>
      {pct}% Match
    </span>
  );
}

export default function HybridSearchView({ onSearch, onSelectDoc }) {
  const [query, setQuery] = useState('');
  const [fileType, setFileType] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setSearched(true);
    setError(null);
    try {
      const res = await onSearch(query, fileType || null);
      setResults(res.results || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Search failed. Please check the backend is running.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Search className="w-6 h-6 text-cyan-400" /> Enterprise Hybrid Search Engine
        </h1>
        <p className="text-sm font-medium mt-1" style={{ color: 'rgba(180, 185, 230, 0.6)' }}>
          Combines BM25 lexical keyword weighting with ChromaDB dense vector embedding cosine similarity.
        </p>
      </div>

      {/* Search Input Box */}
      <form
        onSubmit={handleSearchSubmit}
        className="rounded-3xl p-6 space-y-4"
        style={{
          background: 'rgba(2, 5, 16, 0.9)',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.85)',
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-4 top-3.5" style={{ color: '#22d3ee' }} />
            <input
              type="text"
              placeholder="Enter search query (e.g. 'RAG pipeline cosine similarity', 'revenue growth')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(124, 58, 237, 0.4)',
                color: 'white',
              }}
            />
          </div>

          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="rounded-2xl px-4 py-3 text-xs font-bold shrink-0 w-full md:w-auto focus:outline-none"
            style={{
              background: '#0d0d1a',
              border: '1px solid rgba(124, 58, 237, 0.4)',
              color: 'white',
            }}
          >
            <option value="">All File Types</option>
            <option value=".pdf">.pdf</option>
            <option value=".txt">.txt</option>
            <option value=".csv">.csv</option>
          </select>

          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="w-full md:w-auto px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-105 cursor-pointer disabled:opacity-40"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
            }}
          >
            {isSearching ? (
              <span className="animate-pulse">Searching...</span>
            ) : (
              <>
                Hybrid Search <Zap className="w-4 h-4 inline ml-1" />
              </>
            )}
          </button>
        </div>

        <div
          className="flex items-center gap-4 text-xs font-mono pt-3"
          style={{
            borderTop: '1px solid rgba(124, 58, 237, 0.2)',
            color: 'rgba(167, 139, 250, 0.6)',
          }}
        >
          <span className="flex items-center gap-1 font-bold" style={{ color: '#22d3ee' }}>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> BM25 Weight: 0.4
          </span>
          <span className="flex items-center gap-1 font-bold" style={{ color: '#a78bfa' }}>
            <Database className="w-3.5 h-3.5 text-violet-400" /> Vector Cosine Weight: 0.6
          </span>
        </div>
      </form>

      {/* Results Stream */}
      <div className="space-y-4">
        {searched && (
          <div className="flex items-center justify-between text-xs font-mono" style={{ color: 'rgba(167, 139, 250, 0.6)' }}>
            <span>Query: "{query}"</span>
            <span className="font-bold text-cyan-400">{results.length} Matches Found</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            className="rounded-2xl p-4 text-xs font-mono"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* No Results State */}
        {searched && !isSearching && !error && results.length === 0 && (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: 'rgba(2, 5, 16, 0.85)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              color: 'rgba(167, 139, 250, 0.6)',
            }}
          >
            <p className="text-sm font-bold">No results found for "{query}"</p>
            <p className="text-xs mt-1">Try uploading documents first or broaden your search terms.</p>
          </div>
        )}

        {results.map((res, i) => (
          <div
            key={i}
            className="rounded-3xl p-6 space-y-3 transition-all duration-300 hover:scale-[1.01]"
            style={{
              background: 'rgba(2, 5, 16, 0.85)',
              border: '1px solid rgba(124, 58, 237, 0.25)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="p-3 rounded-2xl"
                  style={{
                    background: 'rgba(124, 58, 237, 0.15)',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                  }}
                >
                  <FileText className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white transition-colors">
                    {res.filename}
                  </h3>
                  <span className="text-[10px] font-mono" style={{ color: 'rgba(167, 139, 250, 0.6)' }}>
                    Chunk #{res.chunk_index ?? res.chunk_id ?? 1} • {res.file_type || 'doc'}
                  </span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <ScoreBadge score={res.score || 0} />
                {(res.vector_score != null || res.bm25_score != null) && (
                  <div className="flex gap-1 justify-end">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee' }}>
                      V:{Math.round((res.vector_score || 0) * 100)}%
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa' }}>
                      B:{Math.round((res.bm25_score || 0) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            <p
              className="text-xs leading-relaxed p-4 rounded-2xl font-mono"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                color: 'rgba(220, 225, 255, 0.85)',
              }}
            >
              {res.snippet}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
