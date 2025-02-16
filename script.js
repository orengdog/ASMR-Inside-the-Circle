const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const growOnCollision = document.getElementById('growOnCollision');
const shrinkOnCollision = document.getElementById('shrinkOnCollision');
const multiplyOnCollision = document.getElementById('multiplyOnCollision');
const smallSpace = document.getElementById('smallSpace');
const rotateCircle = document.getElementById('rotateCircle');
const changeColorOnCollision = document.getElementById('changeColorOnCollision');
const circleLayers = document.getElementById('circleLayers');
const audioUrlInput = document.getElementById('audioUrl');
const audioFileInput = document.getElementById('audioFile');
const repulsionForceInput = document.getElementById('repulsionForce');
const changeSpeedOnCollision = document.getElementById('changeSpeedOnCollision');
const toggleTheme = document.getElementById('toggleTheme');
const toggleLanguage = document.getElementById('toggleLanguage');
const languageSelector = document.getElementById('languageSelector');
const dropdownContent = document.querySelector('.dropdown-content');
const restartButton = document.getElementById('restartButton');
const title = document.getElementById('title');

canvas.width = 800;
canvas.height = 800;

let balls = [];
let animationFrameId;
let noteOption = 'same';
let currentNote = 440; // Frequency in Hz for the note
let audioContext;
let audioBuffer;

const circle = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 250,
    angle: 0
};

class Ball {
    constructor(x, y, radius, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.note = currentNote;
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

        let distance = Math.hypot(this.x - circle.x, this.y - circle.y);
        if (distance + this.radius > circle.radius) {
            const angle = Math.atan2(this.y - circle.y, this.x - circle.x);
            const force = parseInt(repulsionForceInput.value);
            this.dx = -Math.cos(angle) * force;
            this.dy = -Math.sin(angle) * force;
            this.playNote();

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
                this.dx = -this.dx;
                this.dy = -this.dy;
            }

            if (changeColorOnCollision.checked) {
                this.changeColor();
            }

            if (changeSpeedOnCollision.checked) {
                this.dx *= 1.1;
                this.dy *= 1.1;
            }

            if (noteOption === 'increase') {
                currentNote += 10;
            } else if (noteOption === 'decrease') {
                currentNote -= 10;
            }
        }

        if (this.y - this.radius > canvas.height) {
            balls = balls.filter(ball => ball !== this);
            if (balls.length === 0) {
                restartButton.classList.remove('hidden');
            }
        }
    }

    playNote() {
        if (audioContext && audioBuffer) {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start(0);
        }
    }

    changeColor() {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        ctx.fillStyle = randomColor;
    }
}

function drawCircles() {
    const layers = parseInt(circleLayers.value);
    for (let i = 0; i < layers; i++) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius - i * 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (rotateCircle.checked) {
        circle.angle += 0.01;
        ctx.save();
        ctx.translate(circle.x, circle.y);
        ctx.rotate(circle.angle);
        ctx.translate(-circle.x, -circle.y);
    }
    drawCircles();
    if (rotateCircle.checked) {
        ctx.restore();
    }

    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });

    animationFrameId = requestAnimationFrame(animate);
}

function loadAudio(url) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(buffer => {
            audioBuffer = buffer;
        }).catch(e => console.error(e));
}

startButton.addEventListener('click', () => {
    balls.push(new Ball(circle.x, circle.y, 20, 2, 2));
    animate();
    startButton.disabled = true;
});

restartButton.addEventListener('click', () => {
    window.location.reload();
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

dropdownContent.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        noteOption = e.target.getAttribute('data-note');
    }
});

audioUrlInput.addEventListener('change', (e) => {
    const url = e.target.value;
    loadAudio(url);
});

audioFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        loadAudio(url);
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
        rotateCircle: 'Rotate Circle',
        changeColorOnCollision: 'Change Color on Collision',
        circleLayers: 'Number of Circle Layers',
        audioUrl: 'Audio URL',
        uploadAudio: 'Upload Audio',
        repulsionForce: 'Repulsion Force',
        changeSpeedOnCollision: 'Change Speed on Collision',
        toggleTheme: 'Toggle Theme',
        toggleLanguage: 'Change Language',
        restartButton: 'Restart'
    },
    ru: {
        title: 'ASMR внутри круга',
        startButton: 'Запустить симуляцию',
        growOnCollision: 'Увеличение шарика при столкновении',
        shrinkOnCollision: 'Уменьшение шарика при столкновении',
        multiplyOnCollision: 'Количество шариков при столкновении',
        smallSpace: 'Включить маленькое пространство в круге',
        rotateCircle: 'Вращать круг',
        changeColorOnCollision: 'Изменить цвет при столкновении',
        circleLayers: 'Количество слоев круга',
        audioUrl: 'URL аудио',
        uploadAudio: 'Загрузить аудио',
        repulsionForce: 'Сила отталкивания',
        changeSpeedOnCollision: 'Изменить скорость при столкновении',
        toggleTheme: 'Поменять тему',
        toggleLanguage: 'Сменить язык',
        restartButton: 'Перезапустить'
    },
    zh: {
        title: '圈内ASMR',
        startButton: '开始模拟',
        growOnCollision: '碰撞时增长',
        shrinkOnCollision: '碰撞时缩小',
        multiplyOnCollision: '碰撞时增加球的数量',
        smallSpace: '启用圆内小空间',
        rotateCircle: '旋转圆圈',
        changeColorOnCollision: '碰撞时改变颜色',
        circleLayers: '圆圈层数',
        audioUrl: '音频URL',
        uploadAudio: '上传音频',
        repulsionForce: '排斥力',
        changeSpeedOnCollision: '碰撞时改变速度',
        toggleTheme: '切换主题',
        toggleLanguage: '更改语言',
        restartButton: '重新启动'
    }
};

function changeLanguage(lang) {
    title.textContent = translations[lang].title;
    startButton.textContent = translations[lang].startButton;
    growOnCollision.nextSibling.textContent = translations[lang].growOnCollision;
    shrinkOnCollision.nextSibling.textContent = translations[lang].shrinkOnCollision;
    multiplyOnCollision.previousSibling.textContent = translations[lang].multiplyOnCollision;
    smallSpace.nextSibling.textContent = translations[lang].smallSpace;
    rotateCircle.nextSibling.textContent = translations[lang].rotateCircle;
    changeColorOnCollision.nextSibling.textContent = translations[lang].changeColorOnCollision;
    circleLayers.previousSibling.textContent = translations[lang].circleLayers;
    audioUrlInput.previousSibling.textContent = translations[lang].audioUrl;
    audioFileInput.previousSibling.textContent = translations[lang].uploadAudio;
    repulsionForceInput.previousSibling.textContent = translations[lang].repulsionForce;
    changeSpeedOnCollision.nextSibling.textContent = translations[lang].changeSpeedOnCollision;
    toggleTheme.textContent = translations[lang].toggleTheme;
    toggleLanguage.textContent = translations[lang].toggleLanguage;
    restartButton.textContent = translations[lang].restartButton;
}