@echo off
chcp 65001 >nul
echo 🧹 开始清理人脸识别库缓存文件...
echo.

:: 检查并删除face-recognition目录
if exist "face-recognition" (
    echo 📁 发现 face-recognition 目录，正在删除...
    rmdir /s /q "face-recognition"
    echo ✅ face-recognition 目录已删除
) else (
    echo ℹ️ face-recognition 目录不存在，无需清理
)

:: 删除下载脚本文件
echo.
echo 🗑️ 清理下载脚本文件...
if exist "下载人脸识别库.bat" (
    del "下载人脸识别库.bat"
    echo ✅ 下载人脸识别库.bat 已删除
)
if exist "下载人脸识别库-改进版.bat" (
    del "下载人脸识别库-改进版.bat"
    echo ✅ 下载人脸识别库-改进版.bat 已删除
)
if exist "下载缺失模型文件.bat" (
    del "下载缺失模型文件.bat"
    echo ✅ 下载缺失模型文件.bat 已删除
)
if exist "下载模型文件-简化版.bat" (
    del "下载模型文件-简化版.bat"
    echo ✅ 下载模型文件-简化版.bat 已删除
)
if exist "下载模型文件.ps1" (
    del "下载模型文件.ps1"
    echo ✅ 下载模型文件.ps1 已删除
)
if exist "下载模型文件-修复版.ps1" (
    del "下载模型文件-修复版.ps1"
    echo ✅ 下载模型文件-修复版.ps1 已删除
)
if exist "下载模型文件-英文版.ps1" (
    del "下载模型文件-英文版.ps1"
    echo ✅ 下载模型文件-英文版.ps1 已删除
)

:: 删除说明文档
echo.
echo 📚 清理说明文档...
if exist "手动下载人脸识别库说明.md" (
    del "手动下载人脸识别库说明.md"
    echo ✅ 手动下载人脸识别库说明.md 已删除
)
if exist "手动下载链接.html" (
    del "手动下载链接.html"
    echo ✅ 手动下载链接.html 已删除
)

echo.
echo 🎉 缓存清理完成！
echo.
echo 📋 下一步：
echo   1. 刷新网页
echo   2. 使用新的简单身份验证方法
echo.
echo 按任意键继续...
pause >nul
