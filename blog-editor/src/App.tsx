import { useEffect, useState } from 'react';
import { ProjectSetup } from './components/ProjectSetup';
import { Header } from './components/Header';
import { FileTree } from './components/FileTree';
import { MonacoEditor } from './components/MonacoEditor';
import { MarkdownPreview } from './components/MarkdownPreview';
import { GitStatusBar } from './components/GitStatusBar';
import { useEditorStore } from './store/editorStore';

function App() {
  const { projectPath, loadProjectConfig } = useEditorStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      await loadProjectConfig();
      setIsInitializing(false);
    };
    init();
  }, [loadProjectConfig]);

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0f172a',
          color: '#e2e8f0',
        }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(102, 126, 234, 0.3)',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }} />
        <p>Loading...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!projectPath) {
    return <ProjectSetup />;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#0f172a',
        color: '#e2e8f0',
      }}
    >
      <Header />

      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Sidebar - File Tree */}
        <div
          style={{
            width: 280,
            minWidth: 280,
            background: '#1e293b',
            borderRight: '1px solid #334155',
            overflow: 'auto',
          }}
        >
          <FileTree />
        </div>

        {/* Editor */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 400,
            }}
          >
            <MonacoEditor />
          </div>

          {/* Preview */}
          <div
            style={{
              width: '50%',
              minWidth: 400,
              borderLeft: '1px solid #334155',
              overflow: 'auto',
            }}
          >
            <MarkdownPreview />
          </div>
        </div>
      </div>

      <GitStatusBar />
    </div>
  );
}

export default App;
