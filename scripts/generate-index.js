const fs = require('fs');
const path = require('path');
const config = require('../config.json');

// 确保 dist 目录存在
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// 获取所有幻灯片目录
const slidesDir = path.join(__dirname, '../slides');
const slides = fs.readdirSync(slidesDir)
    .filter(file => fs.statSync(path.join(slidesDir, file)).isDirectory())
    .filter(file => fs.existsSync(path.join(distDir, file))); // 只包含已构建的幻灯片

// 生成 HTML
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
    <style>
        .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
        .slide-list { list-style: none; padding: 0; }
        .slide-item { 
            margin: 1rem 0; 
            padding: 1rem; 
            border: 1px solid #ddd; 
            border-radius: 4px;
            transition: all 0.3s ease;
        }
        .slide-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .slide-item a {
            text-decoration: none;
            color: inherit;
        }
        .slide-item h3 {
            margin: 0;
            color: #2196F3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${config.title}</h1>
        <p>${config.description}</p>
        
        ${slides.length > 0 ? `
            <h2>Available Slides</h2>
            <ul class="slide-list">
                ${slides.map(slide => `
                    <li class="slide-item">
                        <a href="${config.baseUrl}/${slide}/">
                            <h3>${slide}</h3>
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
</body>
</html>
`;

// 写入 index.html
fs.writeFileSync(path.join(distDir, 'index.html'), html);
console.log('Index page generated successfully!');