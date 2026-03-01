import { useState } from 'react';
import {
  LayoutTemplate,
  Eye,
  EyeOff,
  Save,
  FolderOpen,
  Loader2,
} from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export function Header() {
  const {
    currentFile,
    isDirty,
    saveFile,
    showPreview,
    setShowPreview,
    projectPath,
  } = useEditorStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await saveFile();
    setIsSaving(false);
  };

  const getFilePath = () => {
    if (!currentFile) return '';
    return currentFile;
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        background: '#0f172a',
        borderBottom: '1px solid #334155',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <LayoutTemplate size={24} color="#667eea" />
          <span
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#fff',
            }}
          >
            Blog Editor
          </span>
        </div>

        {currentFile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '6px',
            }}
          >
            <span
              style={{
                fontSize: '0.875rem',
                color: '#94a3b8',
              }}
            >
              {getFilePath()}
            </span>
            {isDirty && (
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#fbbf24',
                }}
              />
            )}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {currentFile && (
          <button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              background: isDirty ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: isDirty ? '#fff' : '#64748b',
              fontSize: '0.875rem',
              cursor: isDirty ? 'pointer' : 'not-allowed',
            }}
          >
            {isSaving ? (
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Save size={16} />
            )}
            Save
            <kbd
              style={{
                padding: '2px 6px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                fontSize: '0.75rem',
              }}
            >
              ⌘S
            </kbd>
          </button>
        )}

        <button
          onClick={() => setShowPreview(!showPreview)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            background: showPreview ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
            border: '1px solid #334155',
            borderRadius: '6px',
            color: showPreview ? '#fff' : '#64748b',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          {showPreview ? <Eye size={16} /> : <EyeOff size={16} />}
          Preview
        </button>

        <div
          style={{
            width: 1,
            height: 24,
            background: '#334155',
            margin: '0 0.5rem',
          }}
        />

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            background: 'transparent',
            border: '1px solid #334155',
            borderRadius: '6px',
            color: '#94a3b8',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <FolderOpen size={16} />
          {projectPath ? projectPath.split('/').pop() : 'No Project'}
        </button>
      </div>
    </header>
  );
}
