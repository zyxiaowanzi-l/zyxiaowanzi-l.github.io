// 腾讯云云开发配置文件
const CLOUDBASE_CONFIG = {
    // 环境ID - 请替换为你的实际环境ID
    env: 'cloud1-9ghdf1i93f8fb2b9',
    
    // 数据库集合名称
    collections: {
        loveFeed: 'love_feed',        // 恋爱动态
        interactions: 'interactions',  // 用户互动
        memories: 'memories',         // 美好回忆
        users: 'users'                // 用户信息
    },
    
    // 云函数名称
    functions: {
        getLuckyNote: 'getLuckyNote',     // 获取幸运签
        getLoveQuiz: 'getLoveQuiz',       // 获取爱情问答
        addMemory: 'addMemory',           // 添加回忆
        getMemories: 'getMemories'        // 获取回忆列表
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CLOUDBASE_CONFIG;
}
