// 粒子特效初始化
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 80 },
        "color": { "value": "#ffffff" },
        "size": { "value": 2 },
        "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.1, "width": 1 },
        "move": { "enable": true, "speed": 1 }
    }
});

// 測驗邏輯
let currentQuestionIndex = 0;
let scores = { A: 0, B: 0, C: 0, D: 0 };

function startQuiz() {
    // 切換畫面動畫
    gsap.to("#landing-page", { opacity: 0, duration: 0.5, onComplete: () => {
        document.getElementById("landing-page").classList.remove("active");
        document.getElementById("landing-page").classList.add("hidden");
        document.getElementById("quiz-page").classList.remove("hidden");
        document.getElementById("quiz-page").classList.add("active");
        gsap.from("#quiz-page", { opacity: 0, y: 20, duration: 0.5 });
        showQuestion();
    }});
}

function showQuestion() {
    let q = questions[currentQuestionIndex];
    
    // 文字淡入
    let qText = document.getElementById('question-text');
    qText.innerText = q.question;
    gsap.from(qText, { opacity: 0, y: -10, duration: 0.4 });

    let optionsHtml = '';
    q.options.forEach(opt => {
        optionsHtml += `<button class="option-btn" onclick="selectAnswer('${opt.type}')">${opt.text}</button>`;
    });
    
    let container = document.getElementById('options-container');
    container.innerHTML = optionsHtml;

    // 選項逐個浮現
    gsap.from(".option-btn", { 
        y: 20, 
        opacity: 0, 
        duration: 0.4, 
        stagger: 0.1 
    });

    // 更新進度條
    let progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

function selectAnswer(type) {
    scores[type]++;
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    // 簡單的演算法：取最高分
    let winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    let data = results[winner];

    document.getElementById('result-name').innerText = data.name;
    document.getElementById('result-title').innerText = data.title;
    document.getElementById('result-desc').innerText = data.desc;
    document.getElementById('book-link').href = data.bookLink;

    if(winner === 'A' || winner === 'B') {
        document.getElementById('book-link').innerText = "點此閱讀《月映貪狼》";
    } else {
        document.getElementById('book-link').innerText = "點此閱讀《同梁獻祭》";
    }

    // 切換到結果頁動畫
    gsap.to("#quiz-page", { opacity: 0, duration: 0.5, onComplete: () => {
        document.getElementById("quiz-page").classList.add("hidden");
        document.getElementById("result-page").classList.remove("hidden");
        document.getElementById("result-page").classList.add("active");
        gsap.from(".result-card", { scale: 0.8, opacity: 0, duration: 0.6, ease: "back.out(1.7)" });
    }});
}