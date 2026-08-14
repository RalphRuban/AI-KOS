import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Trash2,
  Sparkles,
  MessageSquare,
  GitCompare,
  CheckCircle2,
  Filter,
  Search,
  Layers,
  ArrowRight,
  Clock,
  HardDrive,
  ExternalLink,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import DocumentAnalysisModal from './DocumentAnalysisModal';

export default function DocumentHub({
  documents,
  onUpload,
  onDelete,
  onSelectDoc,
  onOpenWorkspace,
  onCompare,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('Engineering');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null); // {type:'success'|'error', text}
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [analysisDoc, setAnalysisDoc] = useState(null); // doc to show in modal
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);

  // ── Drag & Drop ──────────────────────────────────────────────
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadMessage(null);
    } else if (file) {
      setUploadMessage({ type: 'error', text: 'Only PDF files are supported.' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadMessage(null);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile || isUploading) return;
    setIsUploading(true);
    setUploadMessage(null);
    try {
      const result = await onUpload(selectedFile, category);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploadMessage({
        type: 'success',
        text: `"${result?.filename || selectedFile.name}" uploaded & indexed into ChromaDB successfully!`,
      });
    } catch (err) {
      setUploadMessage({ type: 'error', text: 'Upload failed. Check that the backend is running.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Delete this document and all its vector chunks?')) return;
    setDeletingId(docId);
    try {
      await onDelete(docId);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Filtering ────────────────────────────────────────────────
  const filteredDocs = (documents || []).filter((doc) => {
    const name = (doc.filename || doc.name || '').toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === 'All' || doc.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Normalize doc id (backend may return doc_id or id)
  const getDocId = (doc) => doc.id || doc.doc_id || doc._id;

  const CATEGORY_COLORS = {
    Engineering: { bg: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.4)', text: '#a78bfa' },
    Finance: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', text: '#34d399' },
    Legal: { bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.4)', text: '#fbbf24' },
    Operations: { bg: 'rgba(34,211,238,0.15)', border: 'rgba(34,211,238,0.4)', text: '#22d3ee' },
    General: { bg: 'rgba(148,163,184,0.15)', border: 'rgba(148,163,184,0.3)', text: '#94a3b8' },
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6" style={{ color: '#7c3aed' }} />
            Document Repository
          </h1>
          <p className="text-sm font-medium mt-1" style={{ color: 'rgba(180,185,230,0.6)' }}>
            Upload PDFs for automated semantic chunking, vector indexing, and graph extraction.
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold"
          style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}
        >
          <HardDrive size={15} />
          {(documents || []).length} documents indexed
        </div>
      </div>

      {/* ── Upload Zone ── */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className="relative rounded-3xl p-8 transition-all duration-300 cursor-pointer"
        style={{
          background: dragActive
            ? 'rgba(124,58,237,0.15)'
            : 'rgba(2,5,16,0.7)',
          border: `2px dashed ${dragActive ? '#7c3aed' : 'rgba(124,58,237,0.3)'}`,
          boxShadow: dragActive ? '0 0 30px rgba(124,58,237,0.3)' : 'none',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.5)' }}
          >
            <UploadCloud size={28} style={{ color: '#a78bfa' }} className={dragActive ? 'animate-bounce' : ''} />
          </div>

          {!selectedFile ? (
            <>
              <div>
                <h3 className="text-base font-bold text-white">Drag & drop PDF here, or click to browse</h3>
                <p className="text-xs mt-1" style={{ color: 'rgba(167,139,250,0.5)' }}>
                  Supports PDF up to 50MB · Auto ChromaDB vector indexing
                </p>
              </div>
              <div
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-white pointer-events-none"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}
              >
                Browse PDF
              </div>
            </>
          ) : (
            <div className="w-full space-y-4" onClick={(e) => e.stopPropagation()}>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}
              >
                <CheckCircle2 size={16} style={{ color: '#34d399' }} />
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-white truncate">{selectedFile.name}</p>
                  <p className="text-xs" style={{ color: 'rgba(167,139,250,0.6)' }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  style={{ color: 'rgba(167,139,250,0.6)' }}
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(124,58,237,0.4)', color: 'white' }}
                >
                  {['Engineering', 'Finance', 'Legal', 'Operations', 'General'].map(c => (
                    <option key={c} value={c} style={{ background: '#0d0d1a', color: 'white' }}>{c}</option>
                  ))}
                </select>

                <button
                  onClick={handleUploadSubmit}
                  disabled={isUploading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}
                >
                  {isUploading ? (
                    <><Loader2 size={15} className="animate-spin" /> Indexing...</>
                  ) : (
                    <>Upload <ArrowRight size={15} /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Message */}
      {uploadMessage && (
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-semibold"
          style={{
            background: uploadMessage.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${uploadMessage.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
            color: uploadMessage.type === 'success' ? '#34d399' : '#f87171',
          }}
        >
          {uploadMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {uploadMessage.text}
          <button onClick={() => setUploadMessage(null)} className="ml-auto"><X size={14} /></button>
        </div>
      )}

      {/* ── Search & Filter Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-3" style={{ color: 'rgba(167,139,250,0.5)' }} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm font-medium focus:outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(124,58,237,0.3)',
              color: 'white',
            }}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter size={14} style={{ color: 'rgba(167,139,250,0.5)' }} />
          {['All', 'Engineering', 'Finance', 'Legal', 'Operations', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
              style={selectedCategoryFilter === cat
                ? { background: '#7c3aed', color: 'white', boxShadow: '0 0 12px rgba(124,58,237,0.5)' }
                : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,58,237,0.2)', color: 'rgba(200,210,255,0.7)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Document Grid ── */}
      {filteredDocs.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-3xl gap-4"
          style={{ background: 'rgba(2,5,16,0.6)', border: '1px solid rgba(124,58,237,0.2)' }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}
          >
            <FileText size={28} style={{ color: 'rgba(167,139,250,0.5)' }} />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-white">
              {searchQuery || selectedCategoryFilter !== 'All' ? 'No documents match your filters' : 'No documents yet'}
            </p>
            <p className="text-sm mt-1" style={{ color: 'rgba(167,139,250,0.5)' }}>
              {searchQuery || selectedCategoryFilter !== 'All'
                ? 'Try clearing filters above'
                : 'Upload your first PDF document above to get started'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => {
            const docId = getDocId(doc);
            const catColors = CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.General;
            return (
              <div
                key={docId}
                className="group rounded-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'rgba(2,5,16,0.8)',
                  border: '1px solid rgba(124,58,237,0.25)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  padding: '20px',
                }}
              >
                {/* Top */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="p-2.5 rounded-xl"
                      style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}
                    >
                      <FileText size={20} style={{ color: '#a78bfa' }} />
                    </div>
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                      style={{ background: catColors.bg, border: `1px solid ${catColors.border}`, color: catColors.text }}
                    >
                      {doc.category || 'General'}
                    </span>
                  </div>

                  <h3
                    className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors"
                    title={doc.filename}
                  >
                    {doc.filename}
                  </h3>

                  <div className="flex items-center gap-3 text-xs font-mono" style={{ color: 'rgba(167,139,250,0.5)' }}>
                    <span className="flex items-center gap-1">
                      <Layers size={12} /> {doc.total_chunks || '—'} chunks
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {doc.created_at?.split('T')[0] || 'Recent'}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: '#34d399' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {doc.status || 'Indexed'}
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="pt-4 mt-4 flex items-center justify-between gap-2"
                  style={{ borderTop: '1px solid rgba(124,58,237,0.2)' }}
                >
                  {/* Open Workspace */}
                  <button
                    onClick={() => onOpenWorkspace(doc)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs text-white transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', boxShadow: '0 0 12px rgba(124,58,237,0.4)' }}
                  >
                    <ExternalLink size={12} /> Open
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Ask AI / Chat */}
                    <button
                      onClick={() => onSelectDoc(doc)}
                      title="Ask AI about this document"
                      className="p-2 rounded-xl transition-all hover:scale-110"
                      style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee' }}
                    >
                      <MessageSquare size={14} />
                    </button>

                    {/* View Analysis / Insights */}
                    <button
                      onClick={() => setAnalysisDoc(doc)}
                      title="View AI insights & analysis"
                      className="p-2 rounded-xl transition-all hover:scale-110"
                      style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}
                    >
                      <Sparkles size={14} />
                    </button>

                    {/* Compare */}
                    <button
                      onClick={() => onCompare(docId)}
                      title="Compare with another document"
                      className="p-2 rounded-xl transition-all hover:scale-110"
                      style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa' }}
                    >
                      <GitCompare size={14} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(docId)}
                      disabled={deletingId === docId}
                      title="Delete document"
                      className="p-2 rounded-xl transition-all hover:scale-110 disabled:opacity-40"
                      style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
                    >
                      {deletingId === docId
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Trash2 size={14} />
                      }
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Analysis Modal ── */}
      {analysisDoc && (
        <DocumentAnalysisModal
          doc={analysisDoc}
          onClose={() => setAnalysisDoc(null)}
        />
      )}
    </div>
  );
}
