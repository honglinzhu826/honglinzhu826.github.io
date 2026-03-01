# Blog Editor

A desktop blog editor application built with Tauri v2, React, and TypeScript.

## Features

- **Markdown Editor**: Monaco Editor with syntax highlighting and full editing capabilities
- **Live Preview**: Real-time preview using remark/rehype (same rendering as Astro)
- **File Tree**: Browse and manage blog, thoughts, and resume content
- **Git Integration**: View git status and one-click publish to GitHub
- **New Article Creation**: Create new blog posts and thoughts with auto-generated frontmatter

## Prerequisites

1. **Rust** (required for Tauri)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Node.js** v18+ and npm

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev
```

## Building

```bash
# Build for production
npm run tauri build
```

The built application will be in `src-tauri/target/release/bundle/`.

## Project Structure

```
blog-editor/
├── src/
│   ├── components/       # React components
│   │   ├── FileTree.tsx
│   │   ├── GitStatusBar.tsx
│   │   ├── Header.tsx
│   │   ├── MarkdownPreview.tsx
│   │   ├── MonacoEditor.tsx
│   │   └── ProjectSetup.tsx
│   ├── store/
│   │   └── editorStore.ts    # Zustand state management
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   ├── utils/
│   │   ├── frontmatter.ts    # Frontmatter utilities
│   │   └── markdownParser.ts # Markdown parsing with remark/rehype
│   ├── App.tsx
│   └── main.tsx
├── src-tauri/
│   ├── src/
│   │   └── lib.rs           # Rust backend with git2, file operations
│   ├── Cargo.toml
│   └── tauri.conf.json
└── package.json
```

## Usage

1. **First Launch**: Select your Astro blog project folder (must have `src/content/` directory)
2. **Navigate**: Use the file tree on the left to browse content
3. **Edit**: Click a file to open it in the Monaco Editor
4. **Preview**: See live preview on the right side
5. **Save**: Press `Cmd/Ctrl + S` or click the Save button
6. **New Article**: Right-click on blog/thoughts folder → New
7. **Publish**: Click the Publish button to commit and push changes

## Keyboard Shortcuts

- `Cmd/Ctrl + S`: Save current file
- Standard Monaco Editor shortcuts apply

## Technical Stack

- **Desktop Framework**: Tauri v2 (Rust backend, WebView frontend)
- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand
- **Editor**: Monaco Editor (VS Code's editor)
- **Markdown**: remark + rehype (same as Astro)
- **Git**: git2 crate for Rust

## License

MIT
