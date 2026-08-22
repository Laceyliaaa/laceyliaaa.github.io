// auth.js 卡密校验模块
const API_VERIFY = "https://quiz-auth.1226164210.workers.dev/";

/**
 * 卡密验证函数
 * @param {string} pwd 用户输入卡密
 * @returns {Promise<{ok:boolean,msg:string}>}
 */
export async function verifyPassword(pwd) {
    if (!pwd?.trim()) {
        return { ok: false, msg: "请输入卡密" };
    }
    try {
        const res = await fetch(API_VERIFY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pwd: pwd.trim() })
        })
        const data = await res.json();
        return data;
    } catch (e) {
        console.error("卡密接口请求异常：", e);
        return { ok: false, msg: "网络异常，请稍后重试" };
    }
}

/**
 * 初始化卡密弹窗绑定事件
 * @param {Function} onSuccess 验证成功后的回调（执行渲染题目）
 */
export function initAuth(onSuccess) {
    const authMask = document.getElementById("authMask");
    const pwdInput = document.getElementById("pwdInput");
    const verifyBtn = document.getElementById("verifyBtn");
    const authErr = document.getElementById("authErr");

    // 提交校验逻辑
    const handleVerify = async () => {
        authErr.innerText = "";
        verifyBtn.disabled = true;
        const result = await verifyPassword(pwdInput.value);
        if (result.ok) {
            authMask.style.display = "none";
            onSuccess();
        } else {
            authErr.innerText = result.msg;
        }
        verifyBtn.disabled = false;
    }

    // 按钮点击
    verifyBtn.addEventListener("click", handleVerify);
    // 回车快捷提交
    pwdInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleVerify();
    })
}
