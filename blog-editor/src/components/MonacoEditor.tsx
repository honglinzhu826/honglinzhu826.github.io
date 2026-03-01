import { useRef, useEffect, useCallback } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useEditorStore } from '../store/editorStore';

export function MonacoEditor() {
  const { currentContent, setCurrentContent, currentFile, saveFile } = useEditorStore();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;

    // Configure editor
    editor.updateOptions({
      minimap: { enabled: true },
      wordWrap: 'on',
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      formatOnPaste: true,
      formatOnType: true,
    });

    // Add keyboard shortcut for save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      saveFile();
    });

    // Focus editor
    editor.focus();
  }, [saveFile]);

  // Update editor content when file changes
  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== currentContent) {
        editorRef.current.setValue(currentContent);
      }
    }
  }, [currentFile]);

  const handleChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCurrentContent(value);
    }
  };

  if (!currentFile) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#64748b',
          background: '#0f172a',
        }}
      >
        <p>Select a file to start editing</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', background: '#0f172a' }}>
      <Editor
        height="100%"
        language="markdown"
        value={currentContent}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          readOnly: false,
        }}
        beforeMount={(monaco) => {
          // Configure markdown language
          monaco.languages.setLanguageConfiguration('markdown', {
            wordWrap: 'on',
          });
        }}
      />
    </div>
  );
}
