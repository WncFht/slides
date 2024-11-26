const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { getDirectoryHash } = require('./utils/file-hash');

const STATE_FILE = '.build-state.json';
const SLIDES_DIR = 'slides';

function loadBuildState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return { slides: {} };
  }
}

function saveBuildState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function needsRebuild(slideName, state) {
  const slideDir = path.join(SLIDES_DIR, slideName);
  const pdfPath = path.join(slideDir, 'slides.pdf');
  
  // 检查是否是 PDF 幻灯片
  if (fs.existsSync(pdfPath)) {
    const currentState = getDirectoryHash(slideDir);
    const previousState = state.slides[slideName]?.files || {};
    
    for (const [file, info] of Object.entries(currentState)) {
      if (!previousState[file] || previousState[file].hash !== info.hash) {
        return true;
      }
    }
    return false;
  }
  const srcDir = path.join(slideDir, 'src');
  
  if (!fs.existsSync(srcDir)) return false;
  
  const currentState = getDirectoryHash(srcDir);
  const previousState = state.slides[slideName]?.files || {};
  
  // 检查文件变化
  for (const [file, info] of Object.entries(currentState)) {
    if (!previousState[file] || previousState[file].hash !== info.hash) {
      return true;
    }
  }
  
  // 检查文件删除
  for (const file of Object.keys(previousState)) {
    if (!currentState[file]) {
      return true;
    }
  }
  
  return false;
}

async function main() {
  const state = loadBuildState();
  const slides = fs.readdirSync(SLIDES_DIR);
  let rebuilt = false;

  // 确保 dist 目录存在
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  for (const slide of slides) {
    if (needsRebuild(slide, state)) {
      console.log(`Building ${slide}...`);
      try {
        const slideDir = path.join(SLIDES_DIR, slide);
        const distDir = path.join('dist', slide);
        
        if (fs.existsSync(path.join(slideDir, 'slides.pdf'))) {
          // PDF 幻灯片构建
          buildPdfSlide(slideDir, distDir);
        } else {
          // 原有的 Markdown 幻灯片构建
          execSync(`make -C ${SLIDES_DIR}/${slide}/src build`, { stdio: 'inherit' });
        }
        
        state.slides[slide] = {
          lastBuild: new Date().toISOString(),
          files: fs.existsSync(path.join(slideDir, 'slides.pdf')) 
            ? getDirectoryHash(slideDir)
            : getDirectoryHash(path.join(slideDir, 'src'))
        };
        rebuilt = true;
      } catch (error) {
        console.error(`Error building ${slide}:`, error);
        process.exit(1);
      }
    } else {
      console.log(`Skipping ${slide} (no changes)`);
    }
  }
  if (rebuilt) {
    // 重新生成索引页面
    console.log('Regenerating index page...');
    execSync('node scripts/generate-index.js', { stdio: 'inherit' });
  }

  saveBuildState(state);
}

main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});