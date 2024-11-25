const fs = require('fs');
const path = require('path');
const config = require('../config.json');

// 读取所有幻灯片目录
const slidesDir = path.join(__dirname, '../slides');
const slides = fs.readdirSync(slidesDir)
  .filter(file => fs.statSync(path.join(slidesDir, file)).isDirectory());

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
        .slide-item { margin: 1rem 0; padding: 1rem; border: 1px solid #ddd; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${config.title}</h1>
        <p>${config.description}</p>
        <h2>Slides</h2>
        <ul class="slide-list">
            ${slides.map(slide => `
                <li class="slide-item">
                    <h3>${slide}</h3>
                    <p><a href="${config.baseUrl}/${slide}/">View Presentation</a></p>
                </li>
            `).join('')}
        </ul>
        <footer>
            <p>Created by ${config.author}</p>
        </footer>
    </div>
</body>
</html>
`;

// 创建构建目录
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// 写入 index.html
fs.writeFileSync(path.join(distDir, 'index.html'), html);