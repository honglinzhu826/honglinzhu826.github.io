import { useEffect } from 'react';
import { ProjectSetup } from './components/ProjectSetup';
import { Header } from './components/Header';
import { FileTree } from './components/FileTree';
import { MonacoEditor } from './components/MonacoEditor';
import { MarkdownPreview } from './components/MarkdownPreview';
import { GitStatusBar } from './components/GitStatusBar';
import { useEditorStore } from './store/editorStore';

function App() {
  const { projectPath, loadProjectConfig } = useEditorStore();

  useEffect(() => {
    loadProjectConfig();
  }, [loadProjectConfig]);

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
