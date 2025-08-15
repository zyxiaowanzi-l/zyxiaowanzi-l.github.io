# 💕 恋爱网站 - 腾讯云云开发版本

## 🌟 项目简介

这是一个充满爱意的恋爱主题网站，集成了腾讯云云开发服务，提供丰富的互动功能和数据存储能力。

## ✨ 主要功能

### 🎯 核心功能
- **甜蜜相册**：展示你们的珍贵照片
- **恋爱时间线**：记录从初遇到现在的美好时光
- **云端甜蜜清单**：动态管理你们的愿望清单
- **未来信号塔**：展望美好的未来

### 🎮 互动功能
- **幸运签**：每日获取专属幸运签
- **爱情问答**：有趣的爱情小测试
- **回忆管理**：添加和管理美好回忆
- **表白墙**：写下你的心里话
- **悄悄话**：发送甜蜜的弹幕消息

### ☁️ 云开发功能
- **数据库存储**：恋爱动态、用户互动、美好回忆
- **云函数服务**：幸运签、爱情问答、回忆管理
- **云存储**：图片和媒体文件存储
- **实时数据同步**：多设备数据同步

## 🚀 技术架构

### 前端技术
- **HTML5**：语义化标签和现代Web标准
- **CSS3**：渐变、动画、响应式设计
- **JavaScript ES6+**：异步编程、模块化
- **腾讯云SDK**：云开发服务集成

### 后端服务
- **腾讯云云开发**：Serverless架构
- **云数据库**：NoSQL数据存储
- **云函数**：后端逻辑处理
- **云存储**：文件存储服务

## 📁 项目结构

```
恋爱网站/
├── index.html              # 主页面文件
├── cloudbase-core.js       # 云开发核心功能
├── cloudbase-config.js     # 云开发配置文件
├── cloud-functions/        # 云函数目录
│   ├── getLuckyNote/      # 获取幸运签
│   ├── getLoveQuiz/       # 获取爱情问答
│   ├── addMemory/         # 添加回忆
│   ├── getMemories/       # 获取回忆列表
│   └── package.json       # 云函数依赖配置
├── database-schema.json    # 数据库结构定义
├── CLOUDBASE_SETUP.md     # 云开发开通指南
└── README.md              # 项目说明文档
```

## 🛠️ 安装和部署

### 1. 本地开发
```bash
# 克隆项目
git clone [项目地址]

# 进入项目目录
cd 恋爱网站

# 使用本地服务器运行（推荐使用Live Server）
# 或者直接在浏览器中打开index.html
```

### 2. 云开发部署
详细步骤请参考 [CLOUDBASE_SETUP.md](./CLOUDBASE_SETUP.md)

## 🔧 配置说明

### 云开发配置
在 `cloudbase-config.js` 中配置你的云开发环境：

```javascript
const CLOUDBASE_CONFIG = {
    env: '你的环境ID', // 例如：cloud1-9ghdf1i93f8fb2b9
    
    collections: {
        loveFeed: 'love_feed',        // 恋爱动态
        interactions: 'interactions',  // 用户互动
        memories: 'memories',         // 美好回忆
        users: 'users'                // 用户信息
    },
    
    functions: {
        getLuckyNote: 'getLuckyNote',     // 获取幸运签
        getLoveQuiz: 'getLoveQuiz',       // 获取爱情问答
        addMemory: 'addMemory',           // 添加回忆
        getMemories: 'getMemories'        // 获取回忆列表
    }
};
```

### 数据库集合
项目会自动创建以下数据库集合：
- `love_feed`：存储恋爱动态
- `interactions`：记录用户互动
- `memories`：管理美好回忆
- `users`：用户信息管理

## 🎨 自定义配置

### 修改主题色彩
在CSS中修改CSS变量：
```css
:root {
    --primary: #ff6b9e;      /* 主色调 */
    --secondary: #ff8fab;    /* 次要色调 */
    --accent: #ffb6d5;       /* 强调色 */
    --background: #fff6fa;   /* 背景色 */
}
```

### 添加新的互动功能
1. 在 `cloud-functions/` 目录下创建新的云函数
2. 在 `cloudbase-core.js` 中添加对应的功能方法
3. 在HTML中添加用户界面元素

### 修改文案内容
直接在 `index.html` 中修改对应的文本内容，支持HTML标签。

## 📱 响应式设计

网站采用响应式设计，支持：
- **桌面端**：1920x1080及以上分辨率
- **平板端**：768px-1024px宽度
- **手机端**：320px-768px宽度

## 🌐 浏览器兼容性

- **Chrome**：60+
- **Firefox**：55+
- **Safari**：12+
- **Edge**：79+

## 🚨 注意事项

1. **云开发服务**：需要先开通腾讯云云开发服务
2. **环境ID**：确保配置正确的云开发环境ID
3. **权限设置**：正确配置数据库集合的读写权限
4. **费用控制**：注意云开发服务的计费规则

## 🆘 常见问题

### Q: 云开发服务连接失败怎么办？
A: 检查环境ID是否正确，确认服务是否已开通，查看控制台错误信息。

### Q: 图片无法显示怎么办？
A: 检查图片路径是否正确，确认图片文件是否存在，检查文件权限设置。

### Q: 互动功能不工作怎么办？
A: 确认云函数是否部署成功，检查浏览器控制台错误信息。

## 📞 技术支持

- **开发者微信**：zly_137
- **开发者QQ**：2369157249（注明来意！）
- **腾讯云文档**：[云开发官方文档](https://cloud.tencent.com/document/product/876)

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](./LICENSE) 文件。

## 🙏 致谢

感谢所有为这个项目提供帮助和支持的朋友们！

---

**用代码编织的爱意，让每一行代码都充满温度！** 💕
