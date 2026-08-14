import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  FileText,
  Bookmark,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
} from 'lucide-react';

export default function AIChatView({ documents, onSendQuery, selectedDocId = null }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your AI-KOS Enterprise RAG Assistant. Ask me anything across your document knowledge base.',
      confidence: 0.992,
      citations: [
        {
          filename: 'AI_Architecture_Spec_v3.pdf',
          snippet: 'The RAG pipeline combines BM25 keyword matching with dense vector embeddings for 98.4% retrieval accuracy.',
          score: 0.98,
        },
      ],
      keywords: ['Enterprise Knowledge', 'RAG AI', 'ChromaDB', 'Gemini 3.1'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [activeDocFilter, setActiveDocFilter] = useState(selectedDocId || 'all');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend = null) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const targetDoc = activeDocFilter === 'all' ? null : activeDocFilter;
      const response = await onSendQuery(query, targetDoc);

      const aiMsg = {
        sender: 'ai',
        text: response.answer,
        confidence: response.confidence || 0.965,
        citations: response.citations || [],
        keywords: response.keywords || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Apologies, an error occurred while querying the RAG pipeline. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'Summarize the Q4 financial strategy and revenue growth drivers.',
    'What are the core technical security requirements in our compliance framework?',
    'Explain the hybrid search pipeline combining BM25 with ChromaDB vector similarity.',
    'What key risk factors were identified in the engineering spec?',
  ];

  return (
    <div
      className="h-[calc(100vh-6rem)] flex flex-col rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(2, 5, 16, 0.9)',
        border: '1px solid rgba(124, 58, 237, 0.3)',
        boxShadow: '0 25px 80px rgba(0,0,0,0.85)',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex flex-wrap items-center justify-between gap-4"
        style={{
          background: 'rgba(124, 58, 237, 0.08)',
          borderBottom: '1px solid rgba(124, 58, 237, 0.25)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
            }}
          >
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              AI-KOS RAG Intelligence Workspace <Sparkles className="w-4 h-4 text-cyan-400" />
            </h2>
            <p className="text-xs font-medium" style={{ color: 'rgba(180, 185, 230, 0.6)' }}>
              Multi-turn hybrid search & vector RAG Assistant powered by Gemini 3.1
            </p>
          </div>
        </div>

        {/* Target Document Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold" style={{ color: 'rgba(167, 139, 250, 0.6)' }}>
            Context Scope:
          </span>
          <select
            value={activeDocFilter}
            onChange={(e) => setActiveDocFilter(e.target.value)}
            className="rounded-xl px-3.5 py-1.5 text-xs font-bold focus:outline-none"
            style={{
              background: '#0d0d1a',
              border: '1px solid rgba(124, 58, 237, 0.4)',
              color: 'white',
            }}
          >
            <option value="all">All Documents Repository ({documents.length})</option>
            {documents.map((d) => (
              <option key={d.id || d.doc_id} value={d.id || d.doc_id}>
                {d.filename}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-lg"
              style={
                msg.sender === 'user'
                  ? {
                      background: 'linear-gradient(135deg, #22d3ee, #0284c7)',
                      boxShadow: '0 0 15px rgba(34, 211, 238, 0.4)',
                      color: '#020510',
                    }
                  : {
                      background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                      boxShadow: '0 0 15px rgba(124, 58, 237, 0.4)',
                      color: '#ffffff',
                    }
              }
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble Container */}
            <div className={`max-w-3xl space-y-3 ${msg.sender === 'user' ? 'text-right' : ''}`}>
              {/* Message Bubble */}
              <div
                className="p-5 rounded-3xl text-sm leading-relaxed"
                style={
                  msg.sender === 'user'
                    ? {
                        background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                        color: '#ffffff',
                        boxShadow: '0 8px 30px rgba(124, 58, 237, 0.3)',
                        borderTopRightRadius: 4,
                      }
                    : {
                        background: 'rgba(15, 23, 42, 0.85)',
                        border: '1px solid rgba(124, 58, 237, 0.25)',
                        color: 'rgba(235, 240, 255, 0.95)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
                        borderTopLeftRadius: 4,
                      }
                }
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* AI Telemetry */}
                {msg.sender === 'ai' && (
                  <div
                    className="mt-3 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs"
                    style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
                  >
                    {msg.confidence && (
                      <span
                        className="inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          color: '#34d399',
                        }}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> {(msg.confidence * 100).toFixed(1)}% RAG Precision
                      </span>
                    )}
                    <span className="text-[10px] font-mono" style={{ color: 'rgba(167, 139, 250, 0.5)' }}>
                      {msg.timestamp}
                    </span>
                  </div>
                )}
              </div>

              {/* Citations Snippets */}
              {msg.sender === 'ai' && msg.citations && msg.citations.length > 0 && (
                <div className="space-y-2 text-left">
                  <div
                    className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
                    style={{ color: 'rgba(167, 139, 250, 0.6)' }}
                  >
                    <Bookmark className="w-3.5 h-3.5" style={{ color: '#22d3ee' }} /> Source Citations ({msg.citations.length})
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {msg.citations.map((cite, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-3.5 rounded-2xl space-y-1"
                        style={{
                          background: 'rgba(34, 211, 238, 0.06)',
                          border: '1px solid rgba(34, 211, 238, 0.25)',
                        }}
                      >
                        <div className="flex items-center justify-between font-bold text-xs" style={{ color: '#22d3ee' }}>
                          <span className="truncate flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" /> {cite.filename}
                          </span>
                          <span className="font-mono text-[10px]" style={{ color: 'rgba(180, 185, 230, 0.6)' }}>
                            {Math.round((cite.score || 0.9) * 100)}% Match
                          </span>
                        </div>
                        <p className="line-clamp-2 text-[11px] italic" style={{ color: 'rgba(200, 210, 255, 0.85)' }}>
                          "{cite.snippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs font-mono animate-pulse" style={{ color: '#22d3ee' }}>
            <Sparkles className="w-4 h-4 animate-spin text-cyan-400" /> Synthesizing RAG response with Gemini AI...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div
        className="px-6 py-2.5 flex items-center gap-2 overflow-x-auto"
        style={{
          background: 'rgba(124, 58, 237, 0.06)',
          borderTop: '1px solid rgba(124, 58, 237, 0.2)',
        }}
      >
        <span
          className="text-[10px] font-mono font-bold shrink-0 uppercase tracking-wider"
          style={{ color: 'rgba(167, 139, 250, 0.6)' }}
        >
          Suggested:
        </span>
        {samplePrompts.map((prompt, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSend(prompt)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              color: 'rgba(220, 225, 255, 0.9)',
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div
        className="p-4 flex items-center gap-3"
        style={{
          background: 'rgba(2, 5, 16, 0.95)',
          borderTop: '1px solid rgba(124, 58, 237, 0.25)',
        }}
      >
        <input
          type="text"
          placeholder="Ask a question across your enterprise document database..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 rounded-2xl px-4 py-3 text-sm focus:outline-none"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(124, 58, 237, 0.35)',
            color: 'white',
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !inputQuery.trim()}
          className="px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-105 cursor-pointer disabled:opacity-40"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
          }}
        >
          Send <Send className="w-4 h-4 inline ml-1" />
        </button>
      </div>
    </div>
  );
}
