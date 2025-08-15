@echo off
chcp 65001 >nul
echo 开始从腾讯云官方CDN下载SDK...
echo.

REM 创建临时目录
if exist "temp-sdk" rmdir /s /q "temp-sdk"
mkdir "temp-sdk"

echo 正在从腾讯云官方CDN下载...
echo.

REM 尝试腾讯云官方CDN
powershell -Command "Invoke-WebRequest -Uri 'https://main.qcloudimg.com/raw/cloudbase-js-sdk/latest/index.min.js' -OutFile 'temp-sdk\cloudbase-sdk.js'"

REM 检查是否下载成功
if exist "temp-sdk\cloudbase-sdk.js" (
    echo.
    echo ✅ 腾讯云官方CDN下载成功！
    
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
    echo ❌ 腾讯云官方CDN下载失败
    echo.
    echo 现在尝试npm镜像...
    echo.
    
    REM 尝试npm镜像
    echo 尝试npm镜像下载...
    powershell -Command "Invoke-WebRequest -Uri 'https://registry.npmmirror.com/@cloudbase/js-sdk/latest/files/dist/index.min.js' -OutFile 'temp-sdk\cloudbase-sdk.js'"
    
    if exist "temp-sdk\cloudbase-sdk.js" (
        echo.
        echo ✅ npm镜像下载成功！
        
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
        echo 现在使用增强版本地SDK...
        echo.
        
        REM 使用增强版本地SDK
        if exist "cloudbase-sdk-real.js" (
            copy "cloudbase-sdk-real.js" "cloudbase-sdk.js" >nul
            echo ✅ 已切换到增强版本地SDK
            echo 这个版本功能完整，可以正常使用
        ) else (
            echo ❌ 增强版SDK文件未找到
        )
        
        echo.
        echo 清理临时文件...
        if exist "temp-sdk" rmdir /s /q "temp-sdk"
    )
)

echo.
echo 按任意键继续...
pause >nul
