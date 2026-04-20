@echo off
cd /d "%~dp0"
echo 正在删除非中文本地化文件...
echo =================================

:: 删除 node_modules 中 locales 目录下的非中文文件
for /r "node_modules" %%f in (*.ts) do (
    echo "%%~dpnf" | findstr /i "locales" >nul && (
        echo "%%~nf" | findstr /i "zh" >nul || (
            echo "%%~nf" | findstr /i "index" >nul || (
                del "%%f" /f /q
                echo 删除: %%f
            )
        )
    )
)

for /r "node_modules" %%f in (*.js) do (
    echo "%%~dpnf" | findstr /i "locales" >nul && (
        echo "%%~nf" | findstr /i "zh" >nul || (
            echo "%%~nf" | findstr /i "index" >nul || (
                del "%%f" /f /q
            )
        )
    )
)

echo =================================
echo 操作完成！
pause