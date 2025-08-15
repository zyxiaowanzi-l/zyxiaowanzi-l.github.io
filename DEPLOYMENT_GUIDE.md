# 🚀 腾讯云云函数部署指南

## 📋 部署前检查清单

### ✅ 已完成的项目
- [x] 云开发环境已开通
- [x] 数据库服务已开通
- [x] 云函数服务已开通
- [x] 云存储服务已开通
- [x] 4个云函数代码已更新
- [x] 依赖包已更新为 @cloudbase/node-sdk
- [x] 环境ID已配置：cloud1-9ghdf1i93f8fb2b9

## 🎯 部署步骤

### 第一步：安装腾讯云CLI工具
```bash
npm install -g @cloudbase/cli
```

### 第二步：登录腾讯云
```bash
tcb login
```
系统会打开浏览器要求您登录腾讯云账户并授权。

### 第三步：部署云函数
进入 cloud-functions 目录，执行部署命令：

#### 方式1：使用部署脚本（推荐）
```bash
# 在PowerShell中运行
.\deploy-cloud.ps1
```

#### 方式2：手动部署
```bash
# 部署所有云函数
tcb fn deploy --env cloud1-9ghdf1i93f8fb2b9

# 或者分别部署
tcb fn deploy getLuckyNote --env cloud1-9ghdf1i93f8fb2b9
tcb fn deploy getLoveQuiz --env cloud1-9ghdf1i93f8fb2b9
tcb fn deploy addMemory --env cloud1-9ghdf1i93f8fb2b9
tcb fn deploy getMemories --env cloud1-9ghdf1i93f8fb2b9
```

## 🔍 部署后验证

### 1. 在腾讯云控制台验证
- 访问：https://console.cloud.tencent.com/tcb
- 进入环境：cloud1-9ghdf1i93f8fb2b9
- 点击"云函数"标签页
- 确认4个云函数都已部署成功

### 2. 测试云函数
在控制台中测试每个云函数：
- **getLuckyNote**: 测试参数 `{}`
- **getLoveQuiz**: 测试参数 `{}`
- **addMemory**: 测试参数 `{"title": "测试", "content": "测试内容"}`
- **getMemories**: 测试参数 `{}`

## 🎉 部署成功标志

当您看到以下信息时，说明部署成功：
```
✅ getLuckyNote 部署成功！
✅ getLoveQuiz 部署成功！
✅ addMemory 部署成功！
✅ getMemories 部署成功！
🎉 云函数部署完成！
```

## 🚨 常见问题解决

### 问题1：CLI工具未安装
**错误信息**: `tcb : 无法将"tcb"项识别为 cmdlet`
**解决方案**: 执行 `npm install -g @cloudbase/cli`

### 问题2：未登录腾讯云
**错误信息**: `未登录腾讯云，请先登录`
**解决方案**: 执行 `tcb login`

### 问题3：环境ID错误
**错误信息**: `环境不存在或无权访问`
**解决方案**: 检查 cloudbase-config.js 中的环境ID是否正确

### 问题4：云函数部署失败
**错误信息**: `云函数部署失败`
**解决方案**: 
1. 检查云函数服务是否已开通
2. 确认代码语法是否正确
3. 查看错误日志获取详细信息

## 📱 前端集成

部署完成后，您的网站就可以调用这些云函数了：

```javascript
// 调用幸运签云函数
const result = await cloudBaseManager.callFunction('getLuckyNote');

// 调用爱情问答云函数
const quiz = await cloudBaseManager.callFunction('getLoveQuiz');

// 添加回忆
const memory = await cloudBaseManager.addMemory('标题', '内容');

// 获取回忆列表
const memories = await cloudBaseManager.getMemories();
```

## 🎯 下一步

部署完成后，您可以：
1. 在腾讯云控制台测试云函数
2. 更新前端网站配置
3. 测试完整的网站功能
4. 监控云函数运行状态

---

**祝您部署顺利！如果遇到任何问题，请查看错误日志或联系技术支持。**
