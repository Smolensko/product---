@echo off
chcp 65001 >nul
cd "%~dp0"
echo ================================
echo      Upload to GitHub
echo ================================
echo.

git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git not installed
    echo Please install Git first: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo OK: Git installed

if not exist .git (
    echo Initializing Git repository...
    git init
)

echo OK: Git repo ready

echo Configuring user info...
git config user.name "Smolensko"
git config user.email "2319701034@qq.com"

echo Adding remote repo...
git remote add origin https://github.com/Smolensko/product----.git

echo Pulling latest code...
git pull origin main 2>&1 | findstr /i "fatal" >nul
if not %errorlevel% equ 0 (
    echo WARNING: First push, skip pull
)

echo Adding all files...
git add .

echo Committing changes...
git commit -m "Auto sync - %date% %time%"

echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS: Upload completed!
) else (
    echo.
    echo ERROR: Upload failed, check error messages
)

pause