import { useState } from 'react';
import {
  GitBranch,
  Circle,
  Upload,
  Loader2,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export function GitStatusBar() {
  const { gitStatus, lastSyncTime, publishChanges, isLoading, refreshGitStatus } =
    useEditorStore();
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);

  const modifiedCount = gitStatus?.modified?.length || 0;
  const addedCount = gitStatus?.added?.length || 0;
  const deletedCount = gitStatus?.deleted?.length || 0;
  const untrackedCount = gitStatus?.untracked?.length || 0;

  const totalChanges = modifiedCount + addedCount + deletedCount + untrackedCount;

  const handlePublish = async () => {
    const message =
      commitMessage.trim() || `Update posts: ${new Date().toLocaleDateString()}`;
    await publishChanges(message);
    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setShowPublishDialog(false);
      setCommitMessage('');
    }, 1500);
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Never';
    const date = new Date(lastSyncTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 1rem',
          background: '#0f172a',
          borderTop: '1px solid #334155',
          fontSize: '0.875rem',
          color: '#94a3b8',
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
            <GitBranch size={16} color="#64748b" />
            <span>main</span>
          </div>

          {totalChanges > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Circle
                size={8}
                fill="#22c55e"
                color="#22c55e"
              />
              <span>
                {totalChanges} change{totalChanges !== 1 ? 's' : ''}
              </span>
              {modifiedCount > 0 && (
                <span style={{ color: '#fbbf24' }}>{modifiedCount} modified</span>
              )}
              {addedCount > 0 && (
                <span style={{ color: '#22c55e' }}>{addedCount} added</span>
              )}
            </div>
          )}

          <button
            onClick={() => refreshGitStatus()}
            disabled={isLoading}
            style={{
              padding: '2px 6px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              fontSize: '0.75rem',
            }}
          >
            Refresh
          </button>
        </div>

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
              color: '#64748b',
            }}
          >
            <Clock size={14} />
            <span>Last sync: {formatLastSync()}</span>
          </div>

          <button
            onClick={() => setShowPublishDialog(true)}
            disabled={isLoading || totalChanges === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.75rem',
              background:
                isLoading || totalChanges === 0
                  ? '#334155'
                  : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isLoading || totalChanges === 0 ? 'not-allowed' : 'pointer',
              opacity: isLoading || totalChanges === 0 ? 0.5 : 1,
            }}
          >
            {isLoading ? (
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Upload size={14} />
            )}
            Publish
          </button>
        </div>
      </div>

      {showPublishDialog && (
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
          onClick={() => !isLoading && setShowPublishDialog(false)}
        >
          <div
            style={{
              background: '#1e293b',
              borderRadius: '12px',
              padding: '1.5rem',
              width: '500px',
              maxWidth: '90%',
              border: '1px solid #334155',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {publishSuccess ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem',
                }}
              >
                <CheckCircle size={48} color="#22c55e" />
                <p
                  style={{
                    marginTop: '1rem',
                    color: '#22c55e',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                  }}
                >
                  Published successfully!
                </p>
              </div>
            ) : (
              <>
                <h3
                  style={{
                    margin: '0 0 1rem 0',
                    fontSize: '1.125rem',
                    color: '#fff',
                  }}
                >
                  Publish Changes
                </h3>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 0.5rem 0',
                      color: '#94a3b8',
                      fontSize: '0.875rem',
                    }}
                  >
                    Changes to publish:
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    {modifiedCount > 0 && (
                      <span style={{ color: '#fbbf24' }}>
                        {modifiedCount} modified
                      </span>
                    )}
                    {addedCount > 0 && (
                      <span style={{ color: '#22c55e' }}>{addedCount} added</span>
                    )}
                    {deletedCount > 0 && (
                      <span style={{ color: '#ef4444' }}>{deletedCount} deleted</span>
                    )}
                    {untrackedCount > 0 && (
                      <span style={{ color: '#60a5fa' }}>
                        {untrackedCount} untracked
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#94a3b8',
                    }}
                  >
                    Commit message (optional)
                  </label>
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder={`Update posts: ${new Date().toLocaleDateString()}`}
                    disabled={isLoading}
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

                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'flex-end',
                  }}
                >
                  <button
                    onClick={() => setShowPublishDialog(false)}
                    disabled={isLoading}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#94a3b8',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={isLoading}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#667eea',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    {isLoading && (
                      <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    )}
                    Publish to GitHub
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
