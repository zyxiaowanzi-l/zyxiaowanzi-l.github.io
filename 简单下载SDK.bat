@echo off
chcp 65001 >nul
echo 开始下载腾讯云SDK...
echo.

REM 创建临时目录
if exist "temp-sdk" rmdir /s /q "temp-sdk"
mkdir "temp-sdk"

echo 正在下载腾讯云SDK...
echo.

REM 使用简单的PowerShell命令
powershell -Command "Invoke-WebRequest -Uri 'https://unpkg.com/@cloudbase/js-sdk@latest/dist/index.min.js' -OutFile 'temp-sdk\cloudbase-sdk.js'"

REM 检查是否下载成功
if exist "temp-sdk\cloudbase-sdk.js" (
    echo.
    echo ✅ 下载成功！
    
    REM 备份原文件
    if exist "cloudbase-sdk.js" (
        copy "cloudbase-sdk.js" "cloudbase-sdk.js.backup" >nul
        echo 已备份原文件为 cloudbase-sdk.js.backup
    )
    
    REM 替换文件
    copy "temp-sdk\cloudbase-sdk.js" "cloudbase-sdk.js" >nul
    echo ✅ SDK文件已更新！
    
    REM 清理临时目录
    rmdir /s /q "temp-sdk"
    
    echo.
    echo 🎉 腾讯云SDK下载完成！
    echo 现在请刷新网页测试真正的云开发功能
) else (
    echo.
    echo ❌ 下载失败
    echo.
    echo 现在尝试备用方案...
    echo.
    
    REM 尝试备用CDN
    echo 尝试备用CDN...
    powershell -Command "Invoke-WebRequest -Uri 'https://cdn.jsdelivr.net/npm/@cloudbase/js-sdk@latest/dist/index.min.js' -OutFile 'temp-sdk\cloudbase-sdk.js'"
    
    if exist "temp-sdk\cloudbase-sdk.js" (
        echo.
        echo ✅ 备用CDN下载成功！
        
        REM 备份原文件
        if exist "cloudbase-sdk.js" (
            copy "cloudbase-sdk.js" "cloudbase-sdk.js.backup" >nul
            echo 已备份原文件为 cloudbase-sdk.js.backup
        )
        
        REM 替换文件
        copy "temp-sdk\cloudbase-sdk.js" "cloudbase-sdk.js" >nul
        echo ✅ SDK文件已更新！
        
        REM 清理临时目录
        rmdir /s /q "temp-sdk"
        
        echo.
        echo 🎉 腾讯云SDK下载完成！
        echo 现在请刷新网页测试真正的云开发功能
    ) else (
        echo.
        echo ❌ 所有下载方法都失败了
        echo.
        echo 建议：
        echo 1. 检查网络连接
        echo 2. 尝试使用VPN
        echo 3. 手动下载SDK文件
        echo.
        echo 清理临时文件...
        if exist "temp-sdk" rmdir /s /q "temp-sdk"
    )
)

echo.
echo 按任意键继续...
pause >nul
