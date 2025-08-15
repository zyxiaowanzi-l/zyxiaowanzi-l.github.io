// 获取幸运签云函数
const cloud = require('@cloudbase/node-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
    const luckyNotes = [
        "今天的你比昨天更可爱了！💕",
        "遇见你是我最大的幸运 ✨",
        "你的笑容是我每天的动力 🌟",
        "和你在一起的每一刻都值得珍藏 💖",
        "你是我的小确幸，也是我的大幸福 🎈",
        "有你的日子，连空气都是甜的 🍯",
        "你是我最想守护的人 💝",
        "和你一起的时光，都是最美的时光 🌈",
        "你是我生命中最美丽的意外 🎀",
        "有你在身边，世界都变得温柔了 🌸"
    ];
    
    // 随机选择一条幸运签
    const randomIndex = Math.floor(Math.random() * luckyNotes.length);
    const luckyNote = luckyNotes[randomIndex];
    
    return {
        success: true,
        data: {
            note: luckyNote,
            timestamp: new Date().toISOString(),
            type: 'lucky_note'
        }
    };
};
