import { useEffect, useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { parseMarkdown, ParsedMarkdown } from '../utils/markdownParser';

export function MarkdownPreview() {
  const { currentContent, currentFile, showPreview } = useEditorStore();
  const [parsed, setParsed] = useState<ParsedMarkdown | null>(null);

  useEffect(() => {
    const parse = async () => {
      if (currentContent) {
        try {
          const result = await parseMarkdown(currentContent);
          setParsed(result);
        } catch (err) {
          console.error('Failed to parse markdown:', err);
        }
      } else {
        setParsed(null);
      }
    };

    parse();
  }, [currentContent]);

  if (!showPreview) {
    return null;
  }

  if (!currentFile) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#64748b',
          background: '#f8fafc',
          padding: '2rem',
        }}
      >
        <p>Preview will appear here</p>
      </div>
    );
  }

  const frontmatter = parsed?.frontmatter || {};

  return (
    <div
      style={{
        height: '100%',
        overflow: 'auto',
        background: '#f8fafc',
        padding: '2rem',
      }}
    >
      {/* Article Header */}
      {frontmatter.title && (
        <div
          style={{
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {frontmatter.draft && (
            <span
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                background: '#fef3c7',
                color: '#92400e',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              Draft
            </span>
          )}
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '0.75rem',
              lineHeight: 1.3,
            }}
          >
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <p
              style={{
                fontSize: '1.125rem',
                color: '#64748b',
                marginBottom: '1rem',
                lineHeight: 1.6,
              }}
            >
              {frontmatter.description}
            </p>
          )}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              fontSize: '0.875rem',
              color: '#94a3b8',
            }}
          >
            {frontmatter.pubDate && (
              <span>
                Published:{' '}
                {new Date(frontmatter.pubDate).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            {frontmatter.mood && <span>Mood: {frontmatter.mood}</span>}
          </div>
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '1rem',
                flexWrap: 'wrap',
              }}
            >
              {frontmatter.tags.map((tag: string) => (
                <span
                  key={tag}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: '#e0e7ff',
                    color: '#4338ca',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Article Content */}
      <article
        style={{
          color: '#334155',
          lineHeight: 1.8,
          fontSize: '1rem',
        }}
        dangerouslySetInnerHTML={{
          __html:
            parsed?.html ||
            '<p style="color: #94a3b8;">Start typing to see preview...</p>',
        }}
      />

      {/* Styles for markdown content */}
      <style>{`
        article h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          margin: 2rem 0 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }
        article h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin: 1.75rem 0 0.875rem;
        }
        article h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #334155;
          margin: 1.5rem 0 0.75rem;
        }
        article p {
          margin: 1rem 0;
        }
        article ul, article ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        article li {
          margin: 0.5rem 0;
        }
        article a {
          color: #667eea;
          text-decoration: none;
        }
        article a:hover {
          text-decoration: underline;
        }
        article code {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          background: #f1f5f9;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.875em;
        }
        article pre {
          background: #1e293b;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }
        article pre code {
          background: transparent;
          padding: 0;
          color: #e2e8f0;
        }
        article blockquote {
          border-left: 4px solid #667eea;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #64748b;
          font-style: italic;
        }
        article img {
          max-width: 100%;
          border-radius: 8px;
          margin: 1rem 0;
        }
        article table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        article th, article td {
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          text-align: left;
        }
        article th {
          background: #f1f5f9;
          font-weight: 600;
        }
        article hr {
          border: none;
          border-top: 1px solid #e2e8f0;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
}
