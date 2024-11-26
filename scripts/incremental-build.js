const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { getDirectoryHash } = require('./utils/file-hash');

// 常量定义
const STATE_FILE = '.build-state.json';
const SLIDES_DIR = 'slides';
const DIST_DIR = 'dist';
const CONFIG_FILE = 'config.json';

// 工具函数
function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadBuildState() {
  try {
    console.log('Loading build state...');
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch (err) {
    console.log('No previous build state found, creating new state');
    return { slides: {} };
  }
}

function saveBuildState(state) {
  console.log('Saving build state...');
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// PDF 处理函数
function buildPdfSlide(slidePath, distPath) {
  console.log(`Building PDF slide: ${slidePath}`);
  
  // 确保目标目录存在
  ensureDirectory(distPath);
  
  // 复制 PDF 文件
  const pdfSource = path.join(slidePath, 'slides.pdf');
  const pdfDest = path.join(distPath, 'slides.pdf');
  console.log(`Copying PDF from ${pdfSource} to ${pdfDest}`);
  fs.copyFileSync(pdfSource, pdfDest);

  // 读取配置
  const config = require(path.join(process.cwd(), CONFIG_FILE));
  
  // 读取元数据
  let metadata = {};
  const metadataPath = path.join(slidePath, 'metadata.json');
  if (fs.existsSync(metadataPath)) {
    console.log('Reading metadata file');
    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  }

  // 处理 PDF 查看器模板
  const templatePath = path.join(__dirname, '../common/pdf-template.html');
  if (fs.existsSync(templatePath)) {
    console.log('Processing PDF viewer template');
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // 替换模板变量
    template = template
      .replace('${title}', metadata.title || path.basename(slidePath))
      .replace('${baseUrl}', config.baseUrl);
    
    fs.writeFileSync(path.join(distPath, 'index.html'), template);
  } else {
    throw new Error('PDF template not found at: ' + templatePath);
  }
}

function needsRebuild(slideName, state) {
  const slideDir = path.join(SLIDES_DIR, slideName);
  const pdfPath = path.join(slideDir, 'slides.pdf');
  
  // 检查是否是 PDF 幻灯片
  if (fs.existsSync(pdfPath)) {
    console.log(`Checking PDF slide: ${slideName}`);
    const currentHash = getDirectoryHash(slideDir);
    const previousHash = state.slides[slideName]?.files || {};
    
    // 比较文件哈希
    for (const [file, info] of Object.entries(currentHash)) {
      if (!previousHash[file] || previousHash[file].hash !== info.hash) {
        console.log(`Changes detected in: ${file}`);
        return true;
      }
    }
    
    // 检查文件删除
    for (const file of Object.keys(previousHash)) {
      if (!currentHash[file]) {
        console.log(`File removed: ${file}`);
        return true;
      }
    }
    
    console.log(`No changes detected for: ${slideName}`);
    return false;
  }
  
  // Markdown 幻灯片的检查逻辑
  console.log(`Checking Markdown slide: ${slideName}`);
  const srcDir = path.join(slideDir, 'src');
  if (!fs.existsSync(srcDir)) {
    console.log(`Source directory not found for: ${slideName}`);
    return false;
  }
  
  const currentHash = getDirectoryHash(srcDir);
  const previousHash = state.slides[slideName]?.files || {};
  
  // 比较文件哈希
  for (const [file, info] of Object.entries(currentHash)) {
    if (!previousHash[file] || previousHash[file].hash !== info.hash) {
      console.log(`Changes detected in: ${file}`);
      return true;
    }
  }
  
  // 检查文件删除
  for (const file of Object.keys(previousHash)) {
    if (!currentHash[file]) {
      console.log(`File removed: ${file}`);
      return true;
    }
  }
  
  console.log(`No changes detected for: ${slideName}`);
  return false;
}

async function main() {
  console.log('Starting build process...');
  console.log('Working directory:', process.cwd());
  
  // 确保必要的目录存在
  ensureDirectory(DIST_DIR);
  
  // 加载构建状态
  const state = loadBuildState();
  
  // 获取所有幻灯片目录
  const slides = fs.readdirSync(SLIDES_DIR)
    .filter(file => fs.statSync(path.join(SLIDES_DIR, file)).isDirectory());
  
  console.log(`Found ${slides.length} slide directories`);
  let rebuilt = false;

  // 处理每个幻灯片目录
  for (const slide of slides) {
    const slidePath = path.join(SLIDES_DIR, slide);
    const distPath = path.join(DIST_DIR, slide);
    
    console.log(`\nProcessing ${slide}...`);
    
    // 检查是否需要重建
    if (!needsRebuild(slide, state)) {
      console.log(`Skipping ${slide} (no changes)`);
      continue;
    }

    try {
      // 检查是否是 PDF 幻灯片
      if (fs.existsSync(path.join(slidePath, 'slides.pdf'))) {
        console.log(`Building PDF slide: ${slide}`);
        buildPdfSlide(slidePath, distPath);
      } else {
        console.log(`Building Markdown slide: ${slide}`);
        // 使用 make 构建 Markdown 幻灯片
        execSync(`make -C ${path.join(slidePath, 'src')} build`, { 
          stdio: 'inherit',
          env: { ...process.env, NODE_ENV: 'production' }
        });
      }
      
      // 更新构建状态
      state.slides[slide] = {
        lastBuild: new Date().toISOString(),
        files: fs.existsSync(path.join(slidePath, 'slides.pdf'))
          ? getDirectoryHash(slidePath)
          : getDirectoryHash(path.join(slidePath, 'src'))
      };
      
      rebuilt = true;
      console.log(`Successfully built ${slide}`);
      
    } catch (error) {
      console.error(`Error building ${slide}:`, error);
      process.exit(1);
    }
  }

  // 如果有更改，重新生成索引页面
  if (rebuilt) {
    console.log('\nRegenerating index page...');
    execSync('node scripts/generate-index.js', { stdio: 'inherit' });
  }

  // 保存构建状态
  saveBuildState(state);
  
  // 验证构建结果
  console.log('\nVerifying build results...');
  const builtFiles = fs.readdirSync(DIST_DIR);
  console.log(`Files in dist directory: ${builtFiles.join(', ')}`);
  
  console.log('Build process completed successfully!');
}

// 运行主函数
main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});