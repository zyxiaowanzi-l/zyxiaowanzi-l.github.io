# 腾讯云云函数部署脚本
Write-Host "🚀 开始部署云函数到腾讯云..." -ForegroundColor Green
Write-Host "环境ID: cloud1-9ghdf1i93f8fb2b9" -ForegroundColor Cyan
Write-Host ""

# 检查是否已登录腾讯云
Write-Host "检查腾讯云登录状态..." -ForegroundColor Yellow
try {
    $loginStatus = tcb login --check
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 已登录腾讯云" -ForegroundColor Green
    } else {
        Write-Host "❌ 未登录腾讯云，请先登录" -ForegroundColor Red
        Write-Host "请执行: tcb login" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ 请先安装腾讯云CLI工具" -ForegroundColor Red
    Write-Host "安装命令: npm install -g @cloudbase/cli" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 部署 getLuckyNote 云函数
Write-Host "📝 部署 getLuckyNote 云函数..." -ForegroundColor Yellow
tcb fn deploy getLuckyNote --env cloud1-9ghdf1i93f8fb2b9
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ getLuckyNote 部署成功！" -ForegroundColor Green
} else {
    Write-Host "❌ getLuckyNote 部署失败" -ForegroundColor Red
}

Write-Host ""

# 部署 getLoveQuiz 云函数
Write-Host "💕 部署 getLoveQuiz 云函数..." -ForegroundColor Yellow
tcb fn deploy getLoveQuiz --env cloud1-9ghdf1i93f8fb2b9
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ getLoveQuiz 部署成功！" -ForegroundColor Green
} else {
    Write-Host "❌ getLoveQuiz 部署失败" -ForegroundColor Red
}

Write-Host ""

# 部署 addMemory 云函数
Write-Host "💭 部署 addMemory 云函数..." -ForegroundColor Yellow
tcb fn deploy addMemory --env cloud1-9ghdf1i93f8fb2b9
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ addMemory 部署成功！" -ForegroundColor Green
} else {
    Write-Host "❌ addMemory 部署失败" -ForegroundColor Red
}

Write-Host ""

# 部署 getMemories 云函数
Write-Host "📚 部署 getMemories 云函数..." -ForegroundColor Yellow
tcb fn deploy getMemories --env cloud1-9ghdf1i93f8fb2b9
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ getMemories 部署成功！" -ForegroundColor Green
} else {
    Write-Host "❌ getMemories 部署失败" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 云函数部署完成！" -ForegroundColor Green
Write-Host "现在您可以在腾讯云控制台查看部署的云函数" -ForegroundColor Cyan
Write-Host ""

# 显示部署后的验证步骤
Write-Host "📋 部署后验证步骤:" -ForegroundColor Yellow
Write-Host "1. 访问腾讯云云开发控制台" -ForegroundColor White
Write-Host "2. 进入环境: cloud1-9ghdf1i93f8fb2b9" -ForegroundColor White
Write-Host "3. 查看云函数列表，确认4个函数都已部署" -ForegroundColor White
Write-Host "4. 测试云函数是否正常工作" -ForegroundColor White
Write-Host ""

Read-Host "按回车键继续..."
