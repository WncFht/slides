const fs = require('fs');
const path = require('path');
const config = require('../config.json');
const { getSlideMetadata } = require('./utils/metadata');

// 确保 dist 目录存在
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// 获取所有幻灯片信息
const slidesDir = path.join(__dirname, '../slides');
const slidesInfo = fs.readdirSync(slidesDir)
    .filter(file => fs.statSync(path.join(slidesDir, file)).isDirectory())
    .filter(file => fs.existsSync(path.join(distDir, file)))
    .map(file => {
        const metadata = getSlideMetadata(path.join(slidesDir, file));
        return {
            name: file,
            ...metadata
        };
    })
    .sort((a, b) => new Date(b.modified) - new Date(a.modified));

// 生成 HTML
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>
    <link rel="icon" type="image/x-icon" href="${config.baseUrl}/favicon.ico">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
    <style>
        :root {
            --primary-color: #2196F3;
            --hover-color: #1976D2;
            --background-color: #ffffff;
            --text-color: #333333;
            --meta-color: #666666;
            --border-color: #dddddd;
        }

        [data-theme="dark"] {
            --background-color: #1a1a1a;
            --text-color: #ffffff;
            --meta-color: #bbbbbb;
            --border-color: #444444;
        }

        body {
            background-color: var(--background-color);
            color: var(--text-color);
        }

        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 2rem; 
        }

        .controls {
            margin: 2rem 0;
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .search-bar {
            width: 100%;
            padding: 0.5rem;
            border-radius: 4px;
            border: 1px solid var(--border-color);
        }

        .slide-list { 
            list-style: none; 
            padding: 0; 
        }

        .slide-item { 
            margin: 1rem 0; 
            padding: 1.5rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .slide-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .slide-title {
            margin: 0;
            color: var(--primary-color);
            font-size: 1.4rem;
        }

        .slide-description {
            margin: 0.5rem 0;
            color: var(--text-color);
        }

        .slide-meta {
            font-size: 0.9rem;
            color: var(--meta-color);
            margin-top: 1rem;
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .theme-switch {
            position: fixed;
            top: 1rem;
            right: 1rem;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
        }

        @media (max-width: 600px) {
            .container {
                padding: 1rem;
            }
            
            .slide-item {
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
    <button class="theme-switch" onclick="toggleTheme()">🌓 Theme</button>
    <div class="container">
        <h1>${config.title}</h1>
        <p>${config.description}</p>

        <div class="controls">
            <input type="text" class="search-bar" placeholder="Search slides...">
            <select class="sort-select">
                <option value="modified">Sort by Last Modified</option>
                <option value="created">Sort by Created Date</option>
                <option value="name">Sort by Name</option>
            </select>
        </div>
        
        ${slidesInfo.length > 0 ? `
            <h2>Available Slides</h2>
            <ul class="slide-list">
                ${slidesInfo.map(slide => `
                    <li class="slide-item">
                        <a href="${config.baseUrl}/${slide.name}/">
                            <h3 class="slide-title">${slide.name}</h3>
                            ${slide.description ? `
                                <p class="slide-description">${slide.description}</p>
                            ` : ''}
                            <div class="slide-meta">
                                <span>Created: ${new Date(slide.created).toLocaleDateString()}</span>
                                <span>Modified: ${new Date(slide.modified).toLocaleDateString()}</span>
                                ${slide.pageCount ? `<span>Pages: ${slide.pageCount}</span>` : ''}
                            </div>
                        </a>
                    </li>
                `).join('')}
            </ul>
        ` : `
            <p>No slides available yet.</p>
        `}
        
        <footer>
            <p>Created by ${config.author}</p>
        </footer>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const searchBar = document.querySelector('.search-bar');
        const sortSelect = document.querySelector('.sort-select');
        const slideList = document.querySelector('.slide-list');
        const slides = [...slideList.children];

        // 搜索功能
        searchBar.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            slides.forEach(slide => {
                const text = slide.textContent.toLowerCase();
                slide.style.display = text.includes(term) ? '' : 'none';
            });
        });

        // 排序功能
        sortSelect.addEventListener('change', (e) => {
            const sortBy = e.target.value;
            const sortedSlides = slides.sort((a, b) => {
                if (sortBy === 'name') {
                    return a.querySelector('.slide-title').textContent
                        .localeCompare(b.querySelector('.slide-title').textContent);
                } else {
                    const dateA = new Date(a.querySelector(\`[data-\${sortBy}]\`).textContent);
                    const dateB = new Date(b.querySelector(\`[data-\${sortBy}]\`).textContent);
                    return dateB - dateA;
                }
            });
            
            slideList.innerHTML = '';
            sortedSlides.forEach(slide => slideList.appendChild(slide));
        });
    });

    // 主题切换
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // 初始化主题
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    </script>
</body>
</html>
`;

// 复制 favicon
fs.copyFileSync(
    path.join(__dirname, '../common/favicon.ico'),
    path.join(distDir, 'favicon.ico')
);

// 写入 index.html
fs.writeFileSync(path.join(distDir, 'index.html'), html);
console.log('Index page generated successfully!');