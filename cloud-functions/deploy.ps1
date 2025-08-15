Write-Host "正在安装依赖包..." -ForegroundColor Green
npm install

Write-Host ""
Write-Host "依赖安装完成！正在部署云函数..." -ForegroundColor Green
Write-Host ""

Write-Host "部署 getLuckyNote 云函数..." -ForegroundColor Yellow
tcb fn deploy getLuckyNote

Write-Host ""
Write-Host "部署 getLoveQuiz 云函数..." -ForegroundColor Yellow
tcb fn deploy getLoveQuiz

Write-Host ""
Write-Host "部署 addMemory 云函数..." -ForegroundColor Yellow
tcb fn deploy addMemory

Write-Host ""
Write-Host "部署 getMemories 云函数..." -ForegroundColor Yellow
tcb fn deploy getMemories

Write-Host ""
Write-Host "所有云函数部署完成！" -ForegroundColor Green
Read-Host "按回车键继续..."
