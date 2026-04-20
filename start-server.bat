@echo off
cd "%~dp0"
echo 启动服务器...
npx tsx backend/server.ts
pause