# 个人博客网站

使用 [Astro](https://astro.build) 构建的现代化个人博客网站，支持多语言和 GitHub Pages 自动部署。

## 功能特性

- 🌍 **多语言支持**: 中英文切换，URL 格式 `/zh/` 和 `/en/`
- 📝 **Markdown 内容管理**: 所有内容通过 Markdown 编写
- 🏠 **首页**: 个人简历展示
- 📚 **博客页面**: 技术文章/博客
- 💭 **想法页面**: 随笔/想法记录
- 🎨 **现代化设计**: 响应式布局，深色模式支持
- 🚀 **自动部署**: GitHub Actions 自动构建部署到 GitHub Pages

## 项目结构

```
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions 自动部署
├── public/                 # 静态资源
├── src/
│   ├── content/            # Markdown 内容
│   │   ├── blog/
│   │   │   ├── zh/        # 中文博客
│   │   │   └── en/        # 英文博客
│   │   ├── thoughts/      # 想法/随笔
│   │   └── resume/        # 简历
│   ├── layouts/           # 布局组件
│   ├── components/        # UI 组件
│   ├── pages/             # 页面路由
│   ├── i18n/              # 国际化配置
│   └── styles/            # 全局样式
├── astro.config.mjs       # Astro 配置
└── package.json
```

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 写作指南

### 写博客

在 `src/content/blog/zh/` 或 `src/content/blog/en/` 创建 Markdown 文件：

```yaml
---
title: "文章标题"
description: "文章描述"
pubDate: 2024-01-15
tags: ["标签1", "标签2"]
draft: false  # 设为 true 则不发布
---

文章内容...
```

### 写想法

在 `src/content/thoughts/zh/` 或 `src/content/thoughts/en/` 创建 Markdown 文件：

```yaml
---
title: "想法标题"
pubDate: 2024-01-15
mood: "🎉"  # 可选心情表情
---

想法内容...
```

### 更新简历

编辑 `src/content/resume/zh.md` 或 `src/content/resume/en.md`。

## 部署

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建并部署到 GitHub Pages
3. 访问 `https://honglinzhu826.github.io/zh/` 查看网站

## 技术栈

- [Astro](https://astro.build) - 静态站点生成器
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- GitHub Actions - CI/CD

## License

MIT
