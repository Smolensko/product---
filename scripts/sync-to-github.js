const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 开始同步项目到 GitHub...\n');

try {
  // 检查是否在 Git 仓库中
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
  } catch {
    console.log('❌ 错误：当前目录不是 Git 仓库');
    console.log('请先运行：git init');
    process.exit(1);
  }

  // 获取当前分支名
  const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  console.log(`📍 当前分支: ${branch}`);

  // 拉取最新代码
  console.log('\n📥 拉取最新代码...');
  try {
    execSync('git pull origin ' + branch, { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ 拉取失败（可能是第一次推送），继续执行...');
  }

  // 添加所有文件
  console.log('\n📤 添加所有文件...');
  execSync('git add .', { stdio: 'inherit' });

  // 获取状态
  const status = execSync('git status --porcelain').toString().trim();
  
  if (!status) {
    console.log('\n✅ 没有需要提交的变更');
    process.exit(0);
  }

  // 生成提交消息
  const now = new Date();
  const commitMessage = `自动同步 - ${now.toLocaleString('zh-CN')}`;
  
  console.log(`\n📝 提交消息: ${commitMessage}`);
  
  // 提交
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

  // 推送到远程仓库
  console.log('\n⬆️ 推送到 GitHub...');
  execSync('git push origin ' + branch, { stdio: 'inherit' });

  console.log('\n🎉 同步完成！');
  
} catch (error) {
  console.error('\n❌ 同步失败:', error.message);
  process.exit(1);
}