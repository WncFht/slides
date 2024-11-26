const fs = require('fs');
const path = require('path');
const config = require('../config.json');

function buildPdfSlide(slidePath, distPath) {
    // 创建目标目录
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
    }

    // 复制 PDF 文件
    fs.copyFileSync(
        path.join(slidePath, 'slides.pdf'),
        path.join(distPath, 'slides.pdf')
    );

    // 复制并修改 PDF 模板
    const templatePath = path.join(__dirname, '../common/pdf-template.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // 读取元数据
    const metadataPath = path.join(slidePath, 'metadata.json');
    let metadata = {};
    if (fs.existsSync(metadataPath)) {
        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    }

    // 替换模板变量
    template = template
        .replace('${title}', metadata.title || path.basename(slidePath))
        .replace('${baseUrl}', config.baseUrl);

    // 写入 index.html
    fs.writeFileSync(path.join(distPath, 'index.html'), template);
}

module.exports = { buildPdfSlide };