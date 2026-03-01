import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import matter from 'gray-matter';

export interface ParsedMarkdown {
  frontmatter: Record<string, any>;
  content: string;
  html: string;
}

export async function parseMarkdown(content: string): Promise<ParsedMarkdown> {
  // Parse frontmatter
  const { data: frontmatter, content: markdownContent } = matter(content);

  // Convert markdown to HTML
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdownContent);

  return {
    frontmatter,
    content: markdownContent,
    html: String(result),
  };
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}
