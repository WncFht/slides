const fs = require('fs');
const path = require('path');
const { getPdfMetadata } = require('./pdf-metadata');

function getSlideMetadata(slidePath) {
    // 首先检查是否是 PDF 幻灯片
    const pdfPath = path.join(slidePath, 'slides.pdf');
    if (fs.existsSync(pdfPath)) {
        return getPdfMetadata(slidePath);
    }

    // 原有的 Markdown 幻灯片处理逻辑
    const srcPath = path.join(slidePath, 'src');
    const mdPath = path.join(srcPath, 'main.md');
    
    try {
        const stats = fs.statSync(mdPath);
        const content = fs.readFileSync(mdPath, 'utf8');
        
        const pageCount = content.split('---').length;
        
        const description = content
            .split('---')[0]
            .split('\n')
            .filter(line => !line.startsWith('#') && line.trim())
            .map(line => line.trim())[0] || '';

        return {
            created: stats.birthtime.toISOString(),
            modified: stats.mtime.toISOString(),
            pageCount,
            description,
            type: 'markdown'
        };
    } catch (err) {
        console.warn(`Warning: Could not get metadata for ${slidePath}`, err);
        return null;
    }
}

module.exports = { getSlideMetadata };