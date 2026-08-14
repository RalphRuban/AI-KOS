import React, { useState } from 'react';
import {
  Network,
  Share2,
  Layers,
  Sparkles,
  Info,
  Filter,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export default function KnowledgeGraphView({ graphData }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const nodes = graphData?.nodes || [
    { id: 'E1', label: 'AI-KOS Enterprise Core', category: 'Core Architecture', centrality: 0.98 },
    { id: 'E2', label: 'RAG Pipeline Engine', category: 'Engine', centrality: 0.92 },
    { id: 'E3', label: 'ChromaDB Vector Store', category: 'Database', centrality: 0.88 },
    { id: 'E4', label: 'Gemini 3.1 Flash LLM', category: 'LLM Model', centrality: 0.94 },
    { id: 'E5', label: 'Hybrid BM25 Ranker', category: 'Algorithm', centrality: 0.81 },
    { id: 'E6', label: 'Zero-Trust Security', category: 'Compliance', centrality: 0.78 },
    { id: 'E7', label: 'Knowledge Graph DB', category: 'Database', centrality: 0.89 },
    { id: 'E8', label: 'Multi-Tenant Auth', category: 'Security', centrality: 0.74 },
  ];

  const edges = graphData?.edges || [
    { source: 'E1', target: 'E2', relation: 'ORCHESTRATES', weight: 0.95 },
    { source: 'E2', target: 'E3', relation: 'QUERIES_VECTORS', weight: 0.98 },
    { source: 'E2', target: 'E4', relation: 'PROMPTS_MODEL', weight: 0.94 },
    { source: 'E2', target: 'E5', relation: 'COMBINES_WITH', weight: 0.88 },
    { source: 'E1', target: 'E6', relation: 'ENFORCES', weight: 0.82 },
    { source: 'E1', target: 'E7', relation: 'INDEXES_TO', weight: 0.91 },
    { source: 'E6', target: 'E8', relation: 'REQUIRES', weight: 0.85 },
    { source: 'E7', target: 'E2', relation: 'ENRICHES_CONTEXT', weight: 0.89 },
  ];

  const communities = graphData?.communities || [
    { id: 'C1', name: 'RAG Search Engine Cluster', node_ids: ['E1', 'E2', 'E3', 'E4', 'E5'] },
    { id: 'C2', name: 'Security & Graph Indexing', node_ids: ['E6', 'E7', 'E8'] },
  ];

  const categories = ['All', ...new Set(nodes.map((n) => n.category))];

  const filteredNodes = nodes.filter(
    (n) => filterCategory === 'All' || n.category === filterCategory
  );

  const getCoordinates = (index, total) => {
    const radius = 160;
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: 320 + radius * Math.cos(angle),
      y: 210 + radius * Math.sin(angle),
    };
  };

  const nodeCoords = {};
  filteredNodes.forEach((n, i) => {
    nodeCoords[n.id] = getCoordinates(i, filteredNodes.length);
  });

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Core Architecture': return '#7c3aed';
      case 'Engine': return '#22d3ee';
      case 'Database': return '#ec4899';
      case 'LLM Model': return '#10b981';
      case 'Algorithm': return '#f59e0b';
      case 'Compliance': return '#a78bfa';
      default: return '#34d399';
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Network className="w-6 h-6 text-cyan-400" /> 3D Spatial Knowledge Graph
          </h1>
          <p className="text-sm font-medium mt-1" style={{ color: 'rgba(180, 185, 230, 0.6)' }}>
            Extract cross-document entity relations, eigen centrality scores, and neural sub-community clusters.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-violet-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl px-3.5 py-1.5 text-xs font-bold focus:outline-none"
            style={{
              background: 'rgba(2, 5, 16, 0.9)',
              border: '1px solid rgba(124, 58, 237, 0.4)',
              color: 'white',
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c} style={{ background: '#0d0d1a' }}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Interactive Graph Canvas */}
        <div
          className="lg:col-span-2 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[500px]"
          style={{
            background: 'rgba(2, 5, 16, 0.9)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.85)',
          }}
        >
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Neural Topology Engine
            </div>
            <div className="flex items-center gap-2 font-mono text-xs" style={{ color: 'rgba(167, 139, 250, 0.6)' }}>
              <Sparkles size={14} className="text-cyan-400" /> Live Physics Mesh
            </div>
          </div>

          {/* SVG Network Visualizer */}
          <div className="relative w-full h-[400px] my-2 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 640 420">
              <defs>
                <linearGradient id="edgeGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.4" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Edges */}
              {edges.map((e, idx) => {
                const sourceCoord = nodeCoords[e.source];
                const targetCoord = nodeCoords[e.target];
                if (!sourceCoord || !targetCoord) return null;
                return (
                  <g key={idx}>
                    <line
                      x1={sourceCoord.x}
                      y1={sourceCoord.y}
                      x2={targetCoord.x}
                      y2={targetCoord.y}
                      stroke="url(#edgeGradDark)"
                      strokeWidth={1.8}
                      strokeDasharray="6 3"
                    />
                    <text
                      x={(sourceCoord.x + targetCoord.x) / 2}
                      y={(sourceCoord.y + targetCoord.y) / 2 - 4}
                      fill="rgba(167, 139, 250, 0.7)"
                      fontSize="9"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="select-none"
                    >
                      {e.relation}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map((node) => {
                const coord = nodeCoords[node.id];
                if (!coord) return null;
                const isSelected = selectedNode?.id === node.id;
                const color = getCategoryColor(node.category);
                const radius = 18 + (node.centrality || 0.8) * 10;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${coord.x}, ${coord.y})`}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer group"
                  >
                    {/* Outer Glow Ring */}
                    <circle
                      r={radius + (isSelected ? 8 : 4)}
                      fill="none"
                      stroke={color}
                      strokeWidth={isSelected ? 2.5 : 1}
                      strokeOpacity={isSelected ? 0.9 : 0.3}
                      filter="url(#glow)"
                      className="transition-all duration-300"
                    />
                    {/* Node Core */}
                    <circle
                      r={radius}
                      fill={color}
                      fillOpacity={isSelected ? 0.95 : 0.7}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      strokeOpacity={0.6}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />
                    {/* Node Label */}
                    <text
                      y={radius + 16}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="select-none"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div
            className="flex items-center justify-between text-xs font-mono pt-3"
            style={{
              borderTop: '1px solid rgba(124, 58, 237, 0.2)',
              color: 'rgba(167, 139, 250, 0.6)',
            }}
          >
            <span>Nodes: {filteredNodes.length}</span>
            <span>Relationships: {edges.length}</span>
            <span>Physics Engine: ChromaDB Graph Store</span>
          </div>
        </div>

        {/* Node Inspector Panel */}
        <div
          className="rounded-3xl p-6 space-y-6 flex flex-col justify-between"
          style={{
            background: 'rgba(2, 5, 16, 0.9)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.85)',
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" /> Entity Inspector
              </h2>
              <span className="text-xs font-mono" style={{ color: 'rgba(167, 139, 250, 0.5)' }}>
                {selectedNode ? selectedNode.id : 'Click a Node'}
              </span>
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <div
                  className="p-4 rounded-2xl space-y-2"
                  style={{
                    background: 'rgba(124, 58, 237, 0.12)',
                    border: '1px solid rgba(124, 58, 237, 0.35)',
                  }}
                >
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                    style={{
                      background: 'rgba(34, 211, 238, 0.15)',
                      border: '1px solid rgba(34, 211, 238, 0.3)',
                      color: '#22d3ee',
                    }}
                  >
                    {selectedNode.category}
                  </span>
                  <h3 className="text-lg font-black text-white">{selectedNode.label}</h3>
                  <div
                    className="flex items-center justify-between text-xs font-mono pt-2"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <span style={{ color: 'rgba(180, 185, 230, 0.6)' }}>Eigen Centrality:</span>
                    <span className="font-bold text-cyan-400">
                      {((selectedNode.centrality || 0.85) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Related Edges */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(167, 139, 250, 0.6)' }}>
                    Direct Connections
                  </h4>
                  {edges
                    .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((e, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl text-xs flex items-center justify-between"
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(124, 58, 237, 0.2)',
                        }}
                      >
                        <span className="text-white font-bold">
                          {e.source === selectedNode.id ? e.target : e.source}
                        </span>
                        <span
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                          style={{
                            background: 'rgba(236, 72, 153, 0.15)',
                            border: '1px solid rgba(236, 72, 153, 0.3)',
                            color: '#f472b6',
                          }}
                        >
                          {e.relation}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <Sparkles className="w-8 h-8 text-cyan-400 mx-auto" />
                <p className="text-xs font-medium" style={{ color: 'rgba(180, 185, 230, 0.6)' }}>
                  Select any entity node on the spatial topology canvas to inspect centrality, sub-community clusters, and connected edges.
                </p>
              </div>
            )}
          </div>

          {/* Communities List */}
          <div className="pt-4 border-t border-violet-500/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-white">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Community Clusters
            </h4>
            {communities.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl text-xs space-y-1"
                style={{
                  background: 'rgba(124, 58, 237, 0.08)',
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                }}
              >
                <div className="font-bold text-white">{c.name}</div>
                <div className="text-[10px] font-mono" style={{ color: 'rgba(167, 139, 250, 0.6)' }}>
                  {c.node_ids.length} entities in cluster
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
