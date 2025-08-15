# 🔑 腾讯云API密钥配置指南

## 📋 获取API密钥步骤

### 第一步：登录腾讯云控制台

1. 访问：https://console.cloud.tencent.com/
2. 使用你的腾讯云账号登录
3. 如果没有账号，请先注册

### 第二步：创建API密钥

1. **进入访问管理**
   - 在控制台首页搜索"访问管理"
   - 或直接访问：https://console.cloud.tencent.com/cam

2. **选择API密钥管理**
   - 点击左侧菜单"访问密钥" → "API密钥管理"
   - 或直接访问：https://console.cloud.tencent.com/cam/capi

3. **新建密钥**
   - 点击"新建密钥"按钮
   - 选择"自定义创建"
   - 填写密钥名称（如：人脸识别服务）
   - 选择"编程访问"

4. **保存密钥信息**
   - 创建成功后，会显示 `SecretId` 和 `SecretKey`
   - **重要**：请立即保存这两个值，`SecretKey` 只显示一次！

### 第三步：开通人脸识别服务

1. **进入AI服务**
   - 在控制台搜索"人脸识别"
   - 或访问：https://console.cloud.tencent.com/iai

2. **开通服务**
   - 点击"立即开通"
   - 选择计费方式（建议选择"按量计费"）
   - 确认开通

## ⚙️ 配置API密钥

### 方法一：直接编辑文件

1. 用文本编辑器打开 `tencent-ai-config.js`
2. 找到以下两行：
   ```javascript
   secretId: 'YOUR_SECRET_ID',        // 替换为你的SecretId
   secretKey: 'YOUR_SECRET_KEY',      // 替换为你的SecretKey
   ```
3. 将 `YOUR_SECRET_ID` 替换为你的实际 SecretId
4. 将 `YOUR_SECRET_KEY` 替换为你的实际 SecretKey

### 方法二：使用配置工具

如果你有编程经验，可以创建一个配置工具：

```javascript
// 在浏览器控制台执行
const config = {
    secretId: prompt('请输入你的SecretId:'),
    secretKey: prompt('请输入你的SecretKey:')
};

if (config.secretId && config.secretKey) {
    localStorage.setItem('tencent_ai_config', JSON.stringify(config));
    alert('配置已保存！请刷新页面。');
}
```

## 🔒 安全注意事项

### ⚠️ 重要提醒

1. **不要泄露密钥**
   - 永远不要在公开场合分享你的API密钥
   - 不要将密钥提交到代码仓库
   - 定期更换密钥

2. **权限控制**
   - 建议为不同服务创建不同的API密钥
   - 设置适当的权限范围
   - 监控API使用情况

3. **费用控制**
   - 设置API调用频率限制
   - 配置费用告警
   - 定期查看账单

## 🧪 测试配置

### 配置完成后

1. **保存配置文件**
2. **刷新网页**
3. **查看控制台日志**
4. **测试人脸识别功能**

### 预期结果

如果配置正确，控制台会显示：
```
腾讯云AI服务初始化完成 - 在线状态: true
腾讯云AI人脸识别服务已就绪
服务状态: {isOnline: true, sdkLoaded: true, mode: "online", message: "在线模式 - 使用腾讯云API"}
```

## 🚨 常见问题

### 1. 密钥无效
- 检查SecretId和SecretKey是否正确
- 确认密钥是否已激活
- 检查账号是否有欠费

### 2. 服务未开通
- 确认人脸识别服务已开通
- 检查服务地域设置
- 验证账号权限

### 3. 网络连接问题
- 检查网络连接状态
- 尝试使用VPN
- 服务会自动切换到离线模式

## 💰 费用说明

### 计费方式
- **按量计费**：按API调用次数收费
- **免费额度**：新用户有免费调用次数
- **价格透明**：详细价格可在控制台查看

### 费用控制
- 设置API调用频率限制
- 监控使用量
- 设置费用告警

---

## 🎯 下一步

配置完成后，你就可以享受高精度的腾讯云人脸识别服务了！

**💡 提示**：
- 首次使用建议先测试离线模式
- 配置API密钥后可以享受在线模式的高精度识别
- 如果遇到问题，请查看控制台日志信息

**🚀 立即体验**：配置完成后刷新网页，点击"📷 人脸识别验证"开始使用！
