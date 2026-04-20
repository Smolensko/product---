const fs = require('fs');
const path = require('path');

console.log('🚀 开始清理非中文本地化文件...\n');

// 需要保留的中文相关文件
const keepPatterns = [
  /zh-CN/,
  /zh-TW/,
  /zh/,
  /chinese/,
  /Chinese/,
  /index\./  // 保留index文件
];

// 需要删除的目录模式
const localeDirPatterns = [
  /[\\/]locales[\\/]/,
  /[\\/]locale[\\/]/,
  /[\\/]i18n[\\/]/
];

let deletedCount = 0;
let keptCount = 0;

function shouldKeep(fileName) {
  return keepPatterns.some(pattern => pattern.test(fileName));
}

function shouldProcess(dirPath) {
  return localeDirPatterns.some(pattern => pattern.test(dirPath));
}

function scanDir(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDir(filePath);
      } else if (stat.isFile()) {
        if (shouldProcess(dirPath)) {
          if (shouldKeep(file)) {
            keptCount++;
          } else {
            // 删除非中文文件
            fs.unlinkSync(filePath);
            deletedCount++;
            if (deletedCount % 100 === 0) {
              console.log(`已删除 ${deletedCount} 个文件...`);
            }
          }
        }
      }
    });
  } catch (error) {
    // 忽略权限错误等
  }
}

// 开始扫描整个项目（包括node_modules）
scanDir(process.cwd());

console.log('\n📊 清理完成！');
console.log(`✅ 保留中文文件: ${keptCount} 个`);
console.log(`🗑️ 删除非中文文件: ${deletedCount} 个`);

if (deletedCount === 0) {
  console.log('\n提示：没有找到需要删除的非中文本地化文件。');
}