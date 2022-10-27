function randomSelection(obj) {
    return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
}
// 检测用户活动状态，并在空闲时显示消息
let userAction = false,
    userActionTimer,
    messageTimer,
    messageArray = ["好久不见，日子过得好快呢……", "大坏蛋！你都多久没理人家了呀，嘤嘤嘤～", "嗨～快来逗我玩吧！", "拿小拳拳锤你胸口！"];
window.addEventListener("mousemove", () => userAction = true);
window.addEventListener("keydown", () => userAction = true);

setInterval(() => {
    if (userAction) {
        userAction = false;
        clearInterval(userActionTimer);
        userActionTimer = null;
    } else if (!userActionTimer) {
        userActionTimer = setInterval(() => {
            showMessage(randomSelection(messageArray), 6000, 9);
            // showHitokoto()
        }, 60000);
    }
}, 1000);

(function registerEventListener() {
    // document.querySelector("#waifu-tool .fa-comment").addEventListener("click", showHitokoto);
    // document.querySelector("#waifu-tool .fa-paper-plane").addEventListener("click", () => {
    //     if (window.Asteroids) {
    //         if (!window.ASTEROIDSPLAYERS) window.ASTEROIDSPLAYERS = [];
    //         window.ASTEROIDSPLAYERS.push(new Asteroids());
    //     } else {
    //         const script = document.createElement("script");
    //         script.src = "https://cdn.jsdelivr.net/gh/stevenjoezhang/asteroids/asteroids.js";
    //         document.head.appendChild(script);
    //     }
    // });
    // document.querySelector("#waifu-tool .fa-user-circle").addEventListener("click", loadOtherModel);
    // document.querySelector("#waifu-tool .fa-street-view").addEventListener("click", loadRandModel);
    // document.querySelector("#waifu-tool .fa-camera-retro").addEventListener("click", () => {
    //     showMessage("照好了嘛，是不是很可爱呢？", 6000, 9);
    //     Live2D.captureName = "photo.png";
    //     Live2D.captureFrame = true;
    // });
    // document.querySelector("#waifu-tool .fa-info-circle").addEventListener("click", () => {
    //     open("https://github.com/stevenjoezhang/live2d-widget");
    // });
    // document.querySelector("#waifu-tool .fa-times").addEventListener("click", () => {
    //     localStorage.setItem("waifu-display", Date.now());
    //     showMessage("愿你有一天能与重要的人重逢。", 2000, 11);
    //     document.getElementById("waifu").style.bottom = "-500px";
    //     setTimeout(() => {
    //         document.getElementById("waifu").style.display = "none";
    //         document.getElementById("waifu-toggle").classList.add("waifu-toggle-active");
    //     }, 3000);
    // });
    // const devtools = () => {};
    // console.log("%c", devtools);
    // devtools.toString = () => {
    //     showMessage("哈哈，你打开了控制台，是想要看看我的小秘密吗？", 6000, 9);
    // };
    // window.addEventListener("copy", () => {
    //     showMessage("你都复制了些什么呀，转载要记得加上出处哦！", 6000, 9);
    // });
    window.addEventListener("visibilitychange", () => {
        if (!document.hidden) showMessage("哇，你终于回来了～", 6000, 9);
    });
})();

(function welcomeMessage() {
    let text;
    const now = new Date().getHours();
    if (now > 5 && now <= 7) text = "早上好！一日之计在于晨，美好的一天就要开始了。";
    else if (now > 7 && now <= 11) text = "上午好！工作顺利嘛，不要久坐，多起来走动走动哦！";
    else if (now > 11 && now <= 13) text = "中午了，工作了一个上午，现在是午餐时间！";
    else if (now > 13 && now <= 17) text = "午后很容易犯困呢，今天的运动目标完成了吗？";
    else if (now > 17 && now <= 19) text = "傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红～";
    else if (now > 19 && now <= 21) text = "晚上好，今天过得怎么样？";
    else if (now > 21 && now <= 23) text = ["已经这么晚了呀，早点休息吧，晚安～", "深夜时要爱护眼睛呀！"];
    else text = "你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？";
    
    fetch('https://v0.yiketianqi.com/api?unescape=1&version=v91&appid=43656176&appsecret=I42og6Lm').then(res=>res.json()).then(res=>{
        console.log(res)
        let { wea, tem1, tem2} = res.data[0]
        showMessage(`${text} 今天${wea}，最高${tem1}℃，最低${tem2}℃。`, 5000, 8);
    })
})();



// 展示对话
function showMessage(text, timeout, priority) {
    if (!text || (sessionStorage.getItem("waifu-text") && sessionStorage.getItem("waifu-text") > priority)) return;
    if (messageTimer) {
        clearTimeout(messageTimer);
        messageTimer = null;
    }
    text = randomSelection(text);
    sessionStorage.setItem("waifu-text", priority);
    const tips = document.getElementById("waifu-tips");
    tips.innerHTML = text;
    tips.classList.add("waifu-tips-active");
    messageTimer = setTimeout(() => {
        sessionStorage.removeItem("waifu-text");
        tips.classList.remove("waifu-tips-active");
    }, timeout);
}
// 一言
function showHitokoto() {
    // 增加 hitokoto.cn 的 API
    fetch("https://v1.hitokoto.cn")
        .then(response => response.json())
        .then(result => {
            // const text = `这句一言来自 ${result.from},是 ${result.creator} 投稿的。`;
            showMessage(result.hitokoto, 6000, 9);
            // setTimeout(() => {
            //     showMessage(text, 4000, 9);
            // }, 6000);
        });
}
document.getElementById('live2d').addEventListener('click',showHitokoto)