const fs = require('fs');
const path = require('path');

function getPdfMetadata(slidePath) {
    const metadataPath = path.join(slidePath, 'metadata.json');
    const pdfPath = path.join(slidePath, 'slides.pdf');
    
    try {
        // 检查PDF是否存在
        if (!fs.existsSync(pdfPath)) {
            return null;
        }

        // 读取元数据
        let metadata = {};
        if (fs.existsSync(metadataPath)) {
            metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        }

        // 获取文件状态
        const stats = fs.statSync(pdfPath);

        return {
            created: metadata.created || stats.birthtime.toISOString(),
            modified: metadata.modified || stats.mtime.toISOString(),
            description: metadata.description || '',
            title: metadata.title || path.basename(slidePath),
            type: 'pdf'
        };
    } catch (err) {
        console.warn(`Warning: Could not get metadata for PDF ${slidePath}`, err);
        return null;
    }
}

module.exports = { getPdfMetadata };