// 腾讯云AI人脸识别配置
const TENCENT_AI_CONFIG = {
    // 腾讯云API密钥（需要替换为你的实际密钥）
    secretId: 'YOUR_SECRET_ID',        // 替换为你的SecretId
    secretKey: 'YOUR_SECRET_KEY',      // 替换为你的SecretKey
    
    // 人脸识别服务配置
    region: 'ap-beijing',              // 服务地域
    service: 'iai',                    // 人脸识别服务
    
    // API端点
    endpoints: {
        // 人脸检测与分析
        detectFace: 'https://iai.tencentcloudapi.com',
        // 人脸比对
        compareFace: 'https://iai.tencentcloudapi.com',
        // 人脸搜索
        searchFace: 'https://iai.tencentcloudapi.com',
        // 人脸验证
        verifyFace: 'https://iai.tencentcloudapi.com'
    },
    
    // 人脸识别参数
    faceParams: {
        maxFaceNum: 1,                 // 最大检测人脸数
        needFaceAttributes: 1,         // 是否需要返回人脸属性
        needQualityDetection: 1,       // 是否需要质量检测
        faceModelVersion: '3.0'        // 人脸识别模型版本
    },
    
    // 多用户权限配置
    userRoles: {
        admin: {
            name: '管理员',
            permissions: ['add_memory', 'add_love_feed', 'add_photo', 'delete_content', 'manage_users'],
            description: '完全权限，可以管理所有内容'
        },
        partner: {
            name: '伴侣',
            permissions: ['add_memory', 'add_love_feed', 'add_photo'],
            description: '可以添加回忆、动态和照片，但不能删除内容'
        },
        guest: {
            name: '访客',
            permissions: ['view_content'],
            description: '只能查看内容，不能添加或修改'
        }
    },
    
    // 默认用户配置
    defaultUsers: [
        {
            id: 'admin_001',
            name: '开发者',
            role: 'admin',
            description: '系统管理员，拥有所有权限'
        },
        {
            id: 'partner_001', 
            name: '女朋友',
            role: 'partner',
            description: '可以添加恋爱内容，但不能删除'
        }
    ]
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TENCENT_AI_CONFIG;
} else {
    window.TENCENT_AI_CONFIG = TENCENT_AI_CONFIG;
}
