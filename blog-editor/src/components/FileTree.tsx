import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  Plus,
  AlertCircle,
  Bug,
} from 'lucide-react';
import { FileNode } from '../types';
import { useEditorStore } from '../store/editorStore';

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
  onSelect: (path: string) => void;
  selectedPath: string | null;
  onNewFile: (contentType: 'blog' | 'thoughts', language: 'zh' | 'en') => void;
}

function FileTreeNode({
  node,
  level,
  onSelect,
  selectedPath,
  onNewFile,
}: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [showContextMenu, setShowContextMenu] = useState(false);

  const isContentRoot =
    node.name === 'blog' || node.name === 'thoughts' || node.name === 'resume';

  const getIcon = () => {
    if (node.is_dir) {
      if (isExpanded) {
        return <FolderOpen size={16} color="#fbbf24" />;
      }
      return <Folder size={16} color="#fbbf24" />;
    }
    return <FileText size={16} color="#60a5fa" />;
  };

  const handleClick = () => {
    if (node.is_dir) {
      setIsExpanded(!isExpanded);
    } else {
      onSelect(node.path);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isContentRoot || (node.path.includes('/blog/') || node.path.includes('/thoughts/'))) {
      setShowContextMenu(true);
    }
  };

  const handleNewFile = (contentType: 'blog' | 'thoughts', language: 'zh' | 'en') => {
    setShowContextMenu(false);
    onNewFile(contentType, language);
  };

  const paddingLeft = level * 12 + 8;
  const isSelected = selectedPath === node.path;

  return (
    <div>
      <div
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          paddingLeft: `${paddingLeft}px`,
          cursor: 'pointer',
          borderRadius: '4px',
          backgroundColor: isSelected ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
          color: isSelected ? '#fff' : '#cbd5e1',
          fontSize: '0.875rem',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        {node.is_dir ? (
          isExpanded ? (
            <ChevronDown size={14} color="#64748b" />
          ) : (
            <ChevronRight size={14} color="#64748b" />
          )
        ) : (
          <span style={{ width: 14 }} />
        )}
        {getIcon()}
        <span style={{ marginLeft: '4px' }}>{node.name}</span>
        {isContentRoot && node.name !== 'resume' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowContextMenu(true);
            }}
            style={{
              marginLeft: 'auto',
              padding: '2px 4px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              borderRadius: '3px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      {showContextMenu && (
        <div
          style={{
            position: 'fixed',
            zIndex: 1000,
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '4px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleNewFile(node.name as 'blog' | 'thoughts', 'zh')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#e2e8f0',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '0.8rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Plus size={14} />
            New 中文
          </button>
          <button
            onClick={() => handleNewFile(node.name as 'blog' | 'thoughts', 'en')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#e2e8f0',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '0.8rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Plus size={14} />
            New English
          </button>
        </div>
      )}

      {node.is_dir && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedPath={selectedPath}
              onNewFile={onNewFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree() {
  const { fileTree, setCurrentFile, currentFile, loadFileTree, error, runDiagnostics, diagnostics, clearDiagnostics, projectPath } = useEditorStore();
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileContentType, setNewFileContentType] = useState<'blog' | 'thoughts'>('blog');
  const [newFileLanguage, setNewFileLanguage] = useState<'zh' | 'en'>('zh');
  const [newFileTitle, setNewFileTitle] = useState('');
  const [newFileDescription, setNewFileDescription] = useState('');

  const handleNewFile = (contentType: 'blog' | 'thoughts', language: 'zh' | 'en') => {
    setNewFileContentType(contentType);
    setNewFileLanguage(language);
    setShowNewFileDialog(true);
  };

  const handleCreateFile = async () => {
    if (!newFileTitle.trim()) return;

    const store = useEditorStore.getState();
    const relativePath = await store.createNewFile({
      content_type: newFileContentType,
      language: newFileLanguage,
      title: newFileTitle,
      description: newFileDescription || undefined,
    });

    if (relativePath) {
      await store.loadFileTree();
      setShowNewFileDialog(false);
      setNewFileTitle('');
      setNewFileDescription('');
      setCurrentFile(relativePath);
    }
  };

  // Show error state with diagnostics
  if (error) {
    return (
      <div style={{ padding: '1rem' }}>
        <div
          style={{
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            color: '#ef4444',
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <AlertCircle size={16} />
            <strong>Error loading files:</strong>
          </div>
          <div style={{ wordBreak: 'break-all' }}>{error}</div>
        </div>

        {projectPath && (
          <button
            onClick={() => runDiagnostics()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(102, 126, 234, 0.2)',
              border: '1px solid rgba(102, 126, 234, 0.5)',
              borderRadius: '8px',
              color: '#667eea',
              cursor: 'pointer',
              fontSize: '0.875rem',
              marginBottom: '1rem',
            }}
          >
            <Bug size={16} />
            Run Diagnostics
          </button>
        )}

        {diagnostics && (
          <div
            style={{
              padding: '1rem',
              background: '#1e293b',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#94a3b8',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong style={{ color: '#fff' }}>Diagnostics Results</strong>
              <button
                onClick={() => clearDiagnostics()}
                style={{
                  padding: '2px 6px',
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Project path:</strong> {diagnostics.project_path}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Content path:</strong> {diagnostics.content_path}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Content path exists:</strong>{' '}
              <span style={{ color: diagnostics.content_path_exists ? '#22c55e' : '#ef4444' }}>
                {diagnostics.content_path_exists ? 'Yes' : 'No'}
              </span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Can read directory:</strong>{' '}
              <span style={{ color: diagnostics.can_read_dir ? '#22c55e' : '#ef4444' }}>
                {diagnostics.can_read_dir ? 'Yes' : 'No'}
              </span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Directory entries ({diagnostics.dir_entries.length}):</strong>
              {diagnostics.dir_entries.length > 0 ? (
                <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
                  {diagnostics.dir_entries.map((entry, i) => (
                    <li key={i}>{entry}</li>
                  ))}
                </ul>
              ) : (
                ' None'
              )}
            </div>
            {diagnostics.errors.length > 0 && (
              <div>
                <strong style={{ color: '#ef4444' }}>Errors ({diagnostics.errors.length}):</strong>
                <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem', color: '#ef4444' }}>
                  {diagnostics.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => loadFileTree()}
          style={{
            padding: '0.5rem 1rem',
            background: 'rgba(102, 126, 234, 0.2)',
            border: '1px solid rgba(102, 126, 234, 0.5)',
            borderRadius: '6px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Retry Load
        </button>
      </div>
    );
  }

  if (!fileTree) {
    return (
      <div style={{ padding: '1rem' }}>
        <div
          style={{
            padding: '1rem',
            color: '#64748b',
            textAlign: 'center',
            fontSize: '0.875rem',
          }}
        >
          No files found
        </div>

        {projectPath && (
          <button
            onClick={() => runDiagnostics()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(102, 126, 234, 0.2)',
              border: '1px solid rgba(102, 126, 234, 0.5)',
              borderRadius: '8px',
              color: '#667eea',
              cursor: 'pointer',
              fontSize: '0.875rem',
              marginBottom: '1rem',
            }}
          >
            <Bug size={16} />
            Run Diagnostics
          </button>
        )}

        {diagnostics && (
          <div
            style={{
              padding: '1rem',
              background: '#1e293b',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#94a3b8',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong style={{ color: '#fff' }}>Diagnostics Results</strong>
              <button
                onClick={() => clearDiagnostics()}
                style={{
                  padding: '2px 6px',
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Project path:</strong> {diagnostics.project_path}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Content path:</strong> {diagnostics.content_path}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Content path exists:</strong>{' '}
              <span style={{ color: diagnostics.content_path_exists ? '#22c55e' : '#ef4444' }}>
                {diagnostics.content_path_exists ? 'Yes' : 'No'}
              </span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Can read directory:</strong>{' '}
              <span style={{ color: diagnostics.can_read_dir ? '#22c55e' : '#ef4444' }}>
                {diagnostics.can_read_dir ? 'Yes' : 'No'}
              </span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Directory entries ({diagnostics.dir_entries.length}):</strong>
              {diagnostics.dir_entries.length > 0 ? (
                <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
                  {diagnostics.dir_entries.map((entry, i) => (
                    <li key={i}>{entry}</li>
                  ))}
                </ul>
              ) : (
                ' None'
              )}
            </div>
            {diagnostics.errors.length > 0 && (
              <div>
                <strong style={{ color: '#ef4444' }}>Errors ({diagnostics.errors.length}):</strong>
                <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem', color: '#ef4444' }}>
                  {diagnostics.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100%',
        overflow: 'auto',
        padding: '8px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px 8px',
          borderBottom: '1px solid #334155',
          marginBottom: '8px',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Files
        </span>
        <button
          onClick={() => loadFileTree()}
          style={{
            padding: '2px 6px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b',
            fontSize: '0.75rem',
            borderRadius: '3px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          Refresh
        </button>
      </div>

      <FileTreeNode
        node={fileTree}
        level={0}
        onSelect={setCurrentFile}
        selectedPath={currentFile}
        onNewFile={handleNewFile}
      />

      {showNewFileDialog && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => setShowNewFileDialog(false)}
        >
          <div
            style={{
              background: '#1e293b',
              borderRadius: '12px',
              padding: '1.5rem',
              width: '400px',
              maxWidth: '90%',
              border: '1px solid #334155',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1.125rem',
                color: '#fff',
              }}
            >
              New {newFileContentType === 'blog' ? 'Blog Post' : 'Thought'}
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#94a3b8',
                }}
              >
                Title *
              </label>
              <input
                type="text"
                value={newFileTitle}
                onChange={(e) => setNewFileTitle(e.target.value)}
                placeholder="Enter title..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            {newFileContentType === 'blog' && (
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#94a3b8',
                  }}
                >
                  Description
                </label>
                <input
                  type="text"
                  value={newFileDescription}
                  onChange={(e) => setNewFileDescription(e.target.value)}
                  placeholder="Enter description..."
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#94a3b8',
                }}
              >
                Language
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setNewFileLanguage('zh')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: newFileLanguage === 'zh' ? '#667eea' : '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  中文
                </button>
                <button
                  onClick={() => setNewFileLanguage('en')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: newFileLanguage === 'en' ? '#667eea' : '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  English
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowNewFileDialog(false)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                disabled={!newFileTitle.trim()}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#667eea',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: newFileTitle.trim() ? 'pointer' : 'not-allowed',
                  opacity: newFileTitle.trim() ? 1 : 0.5,
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
