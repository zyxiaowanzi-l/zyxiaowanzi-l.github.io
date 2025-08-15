// 添加回忆云函数
const cloud = require('@cloudbase/node-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
    const db = cloud.database();
    
    try {
        const { title, content, category, date } = event;
        
        // 验证必填字段
        if (!title || !content) {
            return {
                success: false,
                error: '标题和内容不能为空'
            };
        }
        
        // 添加回忆到数据库
        const result = await db.collection('memories').add({
            data: {
                title: title,
                content: content,
                category: category || 'general',
                date: date || new Date().toISOString().split('T')[0],
                createTime: new Date(),
                status: 'active',
                userId: event.userId || 'default'
            }
        });
        
        return {
            success: true,
            data: {
                id: result._id,
                message: '回忆添加成功'
            }
        };
        
    } catch (error) {
        console.error('添加回忆失败:', error);
        return {
            success: false,
            error: '添加回忆失败，请重试'
        };
    }
};
