import matter from 'gray-matter';

export function extractFrontmatter(content: string): {
  frontmatter: Record<string, any>;
  body: string;
} {
  const parsed = matter(content);
  return {
    frontmatter: parsed.data,
    body: parsed.content,
  };
}

export function updateFrontmatter(
  content: string,
  updates: Record<string, any>
): string {
  const parsed = matter(content);
  const newFrontmatter = { ...parsed.data, ...updates };
  return matter.stringify(parsed.content, newFrontmatter);
}

export function createBlogFrontmatter(params: {
  title: string;
  description?: string;
  pubDate: string;
  tags?: string[];
  draft?: boolean;
}): string {
  const { title, description = '', pubDate, tags = [], draft = true } = params;

  return `---
title: "${title}"
description: "${description}"
pubDate: ${pubDate}
tags: [${tags.map((t) => `"${t}"`).join(', ')}]
draft: ${draft}
---
`;
}

export function createThoughtsFrontmatter(params: {
  title: string;
  pubDate: string;
  mood?: string;
}): string {
  const { title, pubDate, mood } = params;

  let frontmatter = `---
title: "${title}"
pubDate: ${pubDate}
`;

  if (mood) {
    frontmatter += `mood: "${mood}"
`;
  }

  frontmatter += '---\n';
  return frontmatter;
}
