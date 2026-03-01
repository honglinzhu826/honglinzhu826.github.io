import { useState, useEffect } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { FolderOpen, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export function ProjectSetup() {
  const { validateAndSetProject, isLoading, error, clearError } = useEditorStore();
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSelectFolder = async () => {
    clearError();
    setValidationError(null);

    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Blog Project Folder',
      });

      if (selected && typeof selected === 'string') {
        setIsValidating(true);
        const isValid = await validateAndSetProject(selected);
        if (!isValid) {
          setValidationError('Invalid project. Please select a valid Astro blog project with src/content/ directory.');
        }
        setIsValidating(false);
      }
    } catch (err) {
      setValidationError(String(err));
      setIsValidating(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Blog Editor
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
          A desktop editor for your Astro blog
        </p>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            Select Your Blog Project
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Choose the root folder of your Astro blog project. We'll look for the{' '}
            <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
              src/content/
            </code>{' '}
            directory.
          </p>

          <button
            onClick={handleSelectFolder}
            disabled={isValidating || isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '1rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: isValidating || isLoading ? 'not-allowed' : 'pointer',
              opacity: isValidating || isLoading ? 0.7 : 1,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isValidating && !isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isValidating || isLoading ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Validating...
              </>
            ) : (
              <>
                <FolderOpen size={20} />
                Select Project Folder
              </>
            )}
          </button>

          {(validationError || error) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '0.9rem',
              }}
            >
              <AlertCircle size={18} />
              {validationError || error}
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#64748b',
          }}
        >
          <p style={{ marginBottom: '0.5rem', fontWeight: 600, color: '#94a3b8' }}>
            Expected project structure:
          </p>
          <pre style={{ textAlign: 'left', margin: 0, overflow: 'auto' }}>
            {`your-blog/
├── astro.config.mjs
├── src/
│   └── content/
│       ├── blog/
│       │   ├── zh/
│       │   └── en/
│       ├── thoughts/
│       │   ├── zh/
│       │   └── en/
│       └── resume/
│           ├── zh.md
│           └── en.md`}
          </pre>
        </div>
      </div>
    </div>
  );
}
