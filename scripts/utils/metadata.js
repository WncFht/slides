const fs = require('fs');
const path = require('path');

function getSlideMetadata(slidePath) {
    const srcPath = path.join(slidePath, 'src');
    const mdPath = path.join(srcPath, 'main.md');
    
    try {
        const stats = fs.statSync(mdPath);
        const content = fs.readFileSync(mdPath, 'utf8');
        
        // 计算幻灯片页数（根据 --- 分隔符）
        const pageCount = content.split('---').length;
        
        // 尝试从内容中提取描述（第一个非标题文本）
        const description = content
            .split('---')[0]  // 获取第一页
            .split('\n')
            .filter(line => !line.startsWith('#') && line.trim())
            .map(line => line.trim())[0] || '';

        return {
            created: stats.birthtime.toISOString(),
            modified: stats.mtime.toISOString(),
            pageCount,
            description
        };
    } catch (err) {
        console.warn(`Warning: Could not get metadata for ${slidePath}`, err);
        return null;
    }
}

module.exports = { getSlideMetadata };