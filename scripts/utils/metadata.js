const fs = require('fs');
const path = require('path');

function getSlideMetadata(slidePath) {
    const metadataPath = path.join(slidePath, 'metadata.json');
    const pdfPath = path.join(slidePath, 'slides.pdf');
    const mdPath = path.join(slidePath, 'src', 'main.md');
    
    try {
        // 首先检查是否存在 metadata.json
        if (fs.existsSync(metadataPath)) {
            console.log(`Using metadata from ${metadataPath}`);
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            return {
                ...metadata,
                type: fs.existsSync(pdfPath) ? 'pdf' : 'markdown'
            };
        }
        
        // 检查是否是 PDF 幻灯片
        if (fs.existsSync(pdfPath)) {
            console.log(`Found PDF slide at ${pdfPath}`);
            const stats = fs.statSync(pdfPath);
            return {
                created: stats.birthtime.toISOString(),
                modified: stats.mtime.toISOString(),
                type: 'pdf',
                description: '',
                title: path.basename(slidePath)
            };
        }
        
        // 处理 Markdown 幻灯片
        if (fs.existsSync(mdPath)) {
            console.log(`Found Markdown slide at ${mdPath}`);
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
                type: 'markdown',
                title: path.basename(slidePath)
            };
        }
        
        console.warn(`No valid slide content found in ${slidePath}`);
        return null;
        
    } catch (err) {
        console.warn(`Warning: Could not get metadata for ${slidePath}`, err);
        return null;
    }
}

module.exports = { getSlideMetadata };