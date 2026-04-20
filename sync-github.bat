@echo off
cd "%~dp0"
echo 同步项目到 GitHub...
node scripts/sync-to-github.js
pause