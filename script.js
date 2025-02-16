const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const growOnCollision = document.getElementById('growOnCollision');
const shrinkOnCollision = document.getElementById('shrinkOnCollision');
const multiplyOnCollision = document.getElementById('multiplyOnCollision');
const smallSpace = document.getElementById('smallSpace');
const toggleTheme = document.getElementById('toggleTheme');
const toggleLanguage = document.getElementById('toggleLanguage');
const languageSelector = document.getElementById('languageSelector');
const title = document.getElementById('title');

canvas.width = 600;
canvas.height = 600;

let balls = [];
let animationFrameId;

const circle = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 200
};

class Ball {
    constructor(x, y, radius, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.note = new Audio('note.mp3');
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.dy += 0.5; // gravity

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        if (Math.hypot(this.x - circle.x, this.y - circle.y) < circle.radius) {
            this.note.play();

            if (growOnCollision.checked) {
                this.radius += 1;
            }

            if (shrinkOnCollision.checked) {
                this.radius -= 1;
            }

            const multiply = parseInt(multiplyOnCollision.value);
            for (let i = 0; i < multiply; i++) {
                balls.push(new Ball(this.x, this.y, this.radius, -this.dx, -this.dy));
            }

            if (smallSpace.checked) {
                if (Math.random() > 0.5) {
                    this.dx = -this.dx;
                } else {
                    this.dy = -this.dy;
                }
            }
        }

        if (this.y - this.radius > canvas.height) {
            balls = balls.filter(ball => ball !== this);
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.stroke();

    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });

    animationFrameId = requestAnimationFrame(animate);
}

startButton.addEventListener('click', () => {
    balls.push(new Ball(0, 0, 20, 2, 2));
    animate();
});

toggleTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

toggleLanguage.addEventListener('click', () => {
    languageSelector.classList.toggle('hidden');
});

languageSelector.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const lang = e.target.getAttribute('data-lang');
        changeLanguage(lang);
        languageSelector.classList.add('hidden');
    }
});

const translations = {
    en: {
        title: 'ASMR Inside the Circle',
        startButton: 'Start Simulation',
        growOnCollision: 'Grow on Collision',
        shrinkOnCollision: 'Shrink on Collision',
        multiplyOnCollision: 'Multiply Balls on Collision',
        smallSpace: 'Enable Small Space in Circle',
        toggleTheme: 'Toggle Theme',
        toggleLanguage: 'Change Language'
    },
    ru: {
        title: 'ASMR внутри круга',
        startButton: 'Запустить симуляцию',
        growOnCollision: 'Увеличение шарика при столкновении',
        shrinkOnCollision: 'Уменьшение шарика при столкновении',
        multiplyOnCollision: 'Количество шариков при столкновении',
        smallSpace: 'Включить маленькое пространство в круге',
        toggleTheme: 'Поменять тему',
        toggleLanguage: 'Сменить язык'
    },
    zh: {
        title: '圈内ASMR',
        startButton: '开始模拟',
        growOnCollision: '碰撞时增长',
        shrinkOnCollision: '碰撞时缩小',
        multiplyOnCollision: '碰撞时增加球的数量',
        smallSpace: '启用圆内小空间',
        toggleTheme: '切换主题',
        toggleLanguage: '更改语言'
    }
};

function changeLanguage(lang) {
    title.textContent = translations[lang].title;
    startButton.textContent = translations[lang].startButton;
    growOnCollision.nextSibling.textContent = translations[lang].growOnCollision;
    shrinkOnCollision.nextSibling.textContent = translations[lang].shrinkOnCollision;
    multiplyOnCollision.previousSibling.textContent = translations[lang].multiplyOnCollision;
    smallSpace.nextSibling.textContent = translations[lang].smallSpace;
    toggleTheme.textContent = translations[lang].toggleTheme;
    toggleLanguage.textContent = translations[lang].toggleLanguage;
}