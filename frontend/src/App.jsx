import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import DashboardView from './components/DashboardView';
import DocumentHub from './components/DocumentHub';
import AIChatView from './components/AIChatView';
import KnowledgeGraphView from './components/KnowledgeGraphView';
import HybridSearchView from './components/HybridSearchView';
import CompareView from './components/CompareView';
import DocumentWorkspace from './components/DocumentWorkspace';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import LandingAndAuth from './components/LandingAndAuth';
import apiService from './services/api';
import { Search, Bell, Sparkles } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [documents, setDocuments] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [graphData, setGraphData] = useState({});
  const [activeWorkspaceDoc, setActiveWorkspaceDoc] = useState(null);
  const [selectedDocForChat, setSelectedDocForChat] = useState(null);
  const [healthStatus, setHealthStatus] = useState('Operational');

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('aikos_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
    }
  }, [isAuthenticated]);

  const loadInitialData = async () => {
    try {
      const [docs, dash, graph] = await Promise.all([
        apiService.getDocuments(),
        apiService.getDashboard(),
        apiService.getGraph(),
      ]);
      // Normalize doc IDs — backend returns doc_id, frontend uses id
      const normalizedDocs = (docs || []).map((d) => ({
        ...d,
        id: d.id || d.doc_id,
      }));
      setDocuments(normalizedDocs);
      setDashboardData(dash);
      setGraphData(graph);
    } catch (err) {
      console.error('Data loading error:', err);
    }
  };

  const handleUpload = async (file, category) => {
    const newDoc = await apiService.uploadDocument(file, category);
    await loadInitialData();
    return newDoc;
  };

  const handleDelete = async (docId) => {
    await apiService.deleteDocument(docId);
    setDocuments((prev) => prev.filter((d) => (d.id || d.doc_id) !== docId));
  };

  const handleSelectDocForChat = (doc) => {
    setSelectedDocForChat(doc.id || doc.doc_id);
    setActiveTab('chat');
  };

  const handleOpenWorkspace = (doc) => {
    setActiveWorkspaceDoc(doc);
    setActiveTab('workspace');
  };

  const handleCompareDocsTrigger = (docId) => {
    setActiveTab('compare');
  };

  if (!isAuthenticated) {
    return <LandingAndAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-x-hidden font-sans relative">
      {/* Animated Moving Background Mesh */}
      <div className="animated-bg">
        <div className="aurora-blob aurora-1"></div>
        <div className="aurora-blob aurora-2"></div>
        <div className="aurora-blob aurora-3"></div>
      </div>

      {/* Sidebar Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveWorkspaceDoc(null);
          setActiveTab(tab);
        }}
        healthStatus={healthStatus}
      />

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header
          className="h-16 sticky top-0 z-20 px-8 flex items-center justify-between"
          style={{
            background: 'rgba(2, 5, 16, 0.9)',
            borderBottom: '1px solid rgba(124, 58, 237, 0.25)',
            fontFamily: "'Outfit', sans-serif",
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'rgba(167, 139, 250, 0.6)' }}>
              Workspace / <span className="text-white font-black">{activeTab}</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('search')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
              style={{
                background: 'rgba(124, 58, 237, 0.12)',
                border: '1px solid rgba(124, 58, 237, 0.35)',
                color: 'white',
              }}
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Omni Search</span>
              <kbd
                className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#c4b5fd' }}
              >
                ⌘K
              </kbd>
            </button>

            <button
              className="p-2 rounded-xl transition-all relative cursor-pointer hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                color: 'rgba(220, 225, 255, 0.8)',
              }}
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-1.5 right-1.5 animate-pulse"></span>
            </button>
          </div>
        </header>

        {/* View Router Container */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              dashboardData={dashboardData}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectDocument={handleOpenWorkspace}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentHub
              documents={documents}
              onUpload={handleUpload}
              onDelete={handleDelete}
              onSelectDoc={handleSelectDocForChat}
              onOpenWorkspace={handleOpenWorkspace}
              onCompare={handleCompareDocsTrigger}
            />
          )}

          {activeTab === 'workspace' && activeWorkspaceDoc && (
            <DocumentWorkspace
              doc={activeWorkspaceDoc}
              onBack={() => setActiveTab('documents')}
              onNavigateChat={handleSelectDocForChat}
            />
          )}

          {activeTab === 'chat' && (
            <AIChatView
              documents={documents}
              selectedDocId={selectedDocForChat}
              onSendQuery={(query, docId) => apiService.sendChatMessage(query, docId)}
            />
          )}

          {activeTab === 'graph' && <KnowledgeGraphView graphData={graphData} />}

          {activeTab === 'search' && (
            <HybridSearchView
              onSearch={(q, cat) => apiService.search(q, cat)}
              onSelectDoc={handleSelectDocForChat}
            />
          )}

          {activeTab === 'compare' && (
            <CompareView
              documents={documents}
              onCompareDocs={(d1, d2) => apiService.compareDocuments(d1, d2)}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView dashboardData={dashboardData} />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
