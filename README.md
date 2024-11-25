# Slides Project Template

一个用于管理和构建多个 reveal.md 幻灯片的项目模板。本模板支持统一的样式管理、批量构建和便捷的幻灯片初始化。

## 项目结构

```
slides_product/                # 项目根目录
├── common/                    # 共享资源目录
│   ├── custom.css            # 自定义样式
│   ├── dark.css              # 暗色主题
│   ├── heti_worker.js        # 排版脚本
│   ├── Makefile.template     # 幻灯片目录的 Makefile 模板
│   └── template.html         # 幻灯片 HTML 模板
│
├── slides/                    # 幻灯片集合目录
│   └── example/              # 示例幻灯片目录
│       ├── site/             # 生成的静态文件
│       │   ├── dist/
│       │   └── plugin/
│       └── src/              # 源文件目录
│           ├── main.md       # 幻灯片内容
│           └── Makefile      # 从模板复制的 Makefile
│
├── init-slide.sh             # 幻灯片初始化脚本
├── Makefile                  # 根目录 Makefile
└── README.md                 # 本文档
```

## 环境要求

- Node.js v12 或更高版本
- npm
- reveal-md (`npm install -g reveal-md`)
- make (Windows 用户可以使用 Git Bash 或 WSL)

## 快速开始

### 1. 创建新的幻灯片

```bash
# 创建名为 "my-slide" 的新幻灯片
./init-slide.sh my-slide
```

这将会：
- 在 `slides/` 目录下创建新的幻灯片目录
- 复制必要的配置文件
- 创建初始的 `main.md` 文件

### 2. 编辑幻灯片内容

编辑 `slides/my-slide/src/main.md` 文件，使用 Markdown 编写幻灯片内容。

基本语法：
```markdown
# 第一页

---

## 第二页

---

### 第三页
```

### 3. 预览幻灯片

```bash
# 预览特定幻灯片
make live SLIDE=my-slide
```

这将启动一个本地服务器，您可以在浏览器中实时预览幻灯片。

### 4. 构建幻灯片

```bash
# 构建所有幻灯片
make build-all

# 或者构建特定幻灯片
make -C slides/my-slide/src build
```

### 5. 清理构建文件

```bash
# 清理所有构建
make clean

# 或者清理特定幻灯片的构建
make -C slides/my-slide/src clean
```

## 命令详解

### 根目录 Makefile 命令

- `make build-all`: 构建所有幻灯片
- `make clean`: 清理所有幻灯片的构建文件
- `make live SLIDE=<slide-name>`: 预览指定的幻灯片

### 幻灯片目录 Makefile 命令

- `make live`: 启动本地预览服务器
- `make build`: 构建幻灯片
- `make clean`: 清理构建文件

## 自定义样式

所有共享的样式和模板文件都位于 `common/` 目录中：

- `template.html`: 幻灯片的 HTML 模板
- `custom.css`: 自定义样式表
- `dark.css`: 暗色主题样式表
- `heti_worker.js`: 中文排版优化脚本

要修改样式，直接编辑这些文件，更改将应用到所有幻灯片。

## 注意事项

1. 每个幻灯片的源文件必须命名为 `main.md`
2. 构建生成的文件将位于每个幻灯片的 `site/` 目录中
3. 预览时的修改会实时反映在浏览器中
4. 共享资源的修改需要重新构建才能生效

## 常见问题

### Q: 构建时报错 "cannot stat 'heti_worker.js'"

确保您已正确运行了初始化脚本，并且 common 目录中包含所有必要的文件。

### Q: 预览时样式不生效

检查 common 目录中的样式文件是否存在，并确保文件名正确。

### Q: Windows 下 make 命令不可用

建议安装 Git Bash 或使用 WSL (Windows Subsystem for Linux) 来运行 make 命令。

## License

MIT

