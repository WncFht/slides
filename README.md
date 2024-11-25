# 幻灯片管理系统

一个基于 reveal-md 的幻灯片管理系统，支持多幻灯片管理、增量构建、自动部署和实时预览。

模板参考 [@TonyCrane](https://github.com/TonyCrane/slide-template)。

## 1. 项目介绍

### 1.1 项目简介
这是一个专门用于管理和展示多个 reveal.js 幻灯片的系统。它提供了统一的构建流程、自动部署功能和友好的预览界面，让您可以专注于幻灯片内容的创作。

### 1.2 主要功能
- 🚀 自动构建和部署到 GitHub Pages
- 📝 支持 Markdown 编写幻灯片
- 🔄 实时预览和热重载
- 🌓 深色模式支持
- 📦 增量构建支持
- 🔍 幻灯片搜索和排序
- 📊 自动生成索引页面

### 1.3 技术特点
- 基于 reveal-md 和 reveal.js
- 使用 GitHub Actions 自动部署
- Make 构建系统
- Node.js 工具链

### 1.4 系统要求
- Node.js >= 16.0.0
- npm >= 7.0.0
- Git
- Make (Windows 用户可使用 Git Bash 或 WSL)

## 2. 目录结构

```
slides/
├── .github/                 # GitHub Actions 配置
│   └── workflows/
├── common/                  # 共享资源
│   ├── custom.css          # 自定义样式
│   ├── dark.css            # 深色主题
│   ├── template.html       # 幻灯片模板
│   └── ...
├── scripts/                # 工具脚本
│   ├── init-slide.sh       # 幻灯片初始化脚本
│   ├── generate-index.js   # 索引页面生成器
│   └── utils/
├── slides/                 # 幻灯片集合
│   └── example/
│       ├── src/           # 源文件
│       │   ├── main.md    # 幻灯片内容
│       │   └── Makefile   # 构建配置
│       └── site/          # 构建输出
├── config.json            # 项目配置
├── package.json          
└── Makefile              # 根构建配置
```

### 2.1 主要文件说明
- `config.json`: 项目全局配置
- `common/template.html`: 幻灯片模板
- `scripts/init-slide.sh`: 新幻灯片初始化脚本
- `Makefile`: 构建系统入口

## 3. 快速开始

### 3.1 环境准备
1. 安装 Node.js 和 npm:
```bash
# 使用 nvm 安装 Node.js (推荐)
nvm install 16
nvm use 16
```

2. 安装 reveal-md:
```bash
npm install -g reveal-md
```

3. 克隆仓库:
```bash
git clone https://github.com/yourusername/slides.git
cd slides
```

### 3.2 初始化配置

1. 创建配置文件:
```bash
cp config.json.example config.json
```

2. 编辑 `config.json`:
```json
{
  "baseUrl": "/slides",
  "title": "My Slides Collection",
  "description": "A collection of presentation slides",
  "author": "Your Name"
}
```

3. 安装依赖:
```bash
npm install
```

### 3.3 创建第一个幻灯片

1. 使用初始化脚本:
```bash
./scripts/init-slide.sh my-first-slide
```

2. 编辑幻灯片内容:
```bash
vim slides/my-first-slide/src/main.md
```

3. 预览幻灯片:
```bash
make preview SLIDE=my-first-slide
```

## 4. 使用指南

### 4.1 常用命令

```bash
# 查看帮助信息
make help

# 列出所有幻灯片
make list

# 预览特定幻灯片
make preview SLIDE=my-slide

# 构建特定幻灯片
make build SLIDE=my-slide

# 构建所有幻灯片
make build-all

# 清理构建文件
make clean SLIDE=my-slide
make clean-all

# 本地预览构建结果
make serve
```

### 4.2 幻灯片编写

幻灯片使用 Markdown 格式编写，位于 `slides/<name>/src/main.md`：

```markdown
# 第一页

你的内容

---

## 第二页

- 项目符号 1
- 项目符号 2

---

## 感谢观看
```

### 4.3 本地开发流程

1. 创建新幻灯片:
```bash
./scripts/init-slide.sh my-slide
```

2. 启动预览服务器:
```bash
make preview SLIDE=my-slide
```

3. 编辑 `slides/my-slide/src/main.md`
4. 浏览器会自动刷新显示更改

### 4.4 构建和部署

推送到 GitHub 后，GitHub Actions 会自动:
1. 检测变更的幻灯片
2. 增量构建
3. 部署到 GitHub Pages

也可以手动触发构建和部署:
```bash
# 本地构建
make build-all

# 或者推送触发部署
git add .
git commit -m "Update slides"
git push
```

## 5. GitHub Pages 部署

### 5.1 初始设置

1. 在 GitHub 仓库设置中启用 GitHub Pages：
   - 进入仓库的 Settings 标签页
   - 找到 Pages 部分
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "gh-pages" / "/(root)"
   - 保存设置

2. 确保工作流程权限：
   - 进入 Settings → Actions → General
   - 找到 "Workflow permissions"
   - 选择 "Read and write permissions"
   - 保存更改

3. 验证 GITHUB_TOKEN 权限：
   - 确保 `GITHUB_TOKEN` 有足够的权限进行部署
   - 默认配置通常已经足够

### 5.2 自动部署流程

项目使用 GitHub Actions 实现自动部署：

1. 触发条件：
```yaml
on:
  push:
    branches: [main]
    paths:
      - "slides/**"
      - "common/**"
      - "scripts/**"
      - "config.json"
  workflow_dispatch:
```

2. 部署过程：
- 检出代码
- 设置 Node.js 环境
- 恢复缓存
- 增量构建
- 部署到 gh-pages 分支

3. 验证部署：
- 访问 `https://username.github.io/repository-name/`
- 检查构建日志
- 验证更新是否生效

## 6. 高级特性

### 6.1 增量构建

项目支持智能增量构建，只重建发生变化的幻灯片：

1. 构建状态跟踪：
- 使用 `.build-state.json` 记录构建状态
- 跟踪文件修改时间和内容哈希

2. 缓存策略：
```yaml
- name: Restore cache
  uses: actions/cache@v3
  with:
    path: |
      dist
      .build-state.json
    key: ${{ runner.os }}-slides-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-slides-
```

### 6.2 主题定制

1. 修改共享样式：
- `common/custom.css`: 自定义样式
- `common/dark.css`: 深色主题
- `common/template.html`: HTML 模板

2. 主题变量：
```css
:root {
    --primary-color: #2196F3;
    --background-color: #ffffff;
    --text-color: #333333;
    /* 添加更多变量... */
}
```

### 6.3 元数据和索引

1. 幻灯片元数据：
```markdown
---
title: "Your Title"
description: "Slide description"
date: "2024-11-26"
---
```

2. 自动生成索引：
- 支持搜索和排序
- 显示创建和修改时间
- 支持深色模式切换

## 7. FAQ/故障排除

### 7.1 常见问题

1. **Q: 预览时样式不加载**
   - 检查 common 目录中的样式文件
   - 确认文件权限正确

2. **Q: GitHub Pages 部署失败**
   - 检查仓库设置中的 Pages 配置
   - 验证工作流程权限
   - 查看 Actions 日志

3. **Q: 增量构建不工作**
   - 清理构建缓存
   - 检查 .build-state.json
   - 确认文件变更检测正确

## License

This project is licensed under the [MIT License](LICENSE).  
See the `LICENSE` file for more details.
