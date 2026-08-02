const bodyElement = document.body;
const canvasElement = document.getElementsByTagName('canvas')[0];
const ctx = canvasElement.getContext('2d');

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

let mouseX = 0;
let mouseY = 0;

bodyElement.addEventListener('mousemove', function (event) {
    mouseX = event.pageX;
    mouseY = event.pageY;
});

bodyElement.addEventListener('click', function () {
    particles.forEach(particle => {
        particle.x = mouseX;
        particle.y = mouseY;
    });
});

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
const particleSizeFactor = Math.floor((canvasWidth * canvasHeight) / 29000);
const numParticles = 900;
const particles = [];

canvasElement.width = canvasWidth;
canvasElement.height = canvasHeight;

function initializeParticles() {
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: canvasWidth / 2,
            y: canvasHeight / 2,
            angleControlA: Math.random() * 100000,
            angleControlB: Math.random() * 100000,
            previousHeartState: 0,
            opacity: 0.1
        });
    }
}

let heartPixelData = null;

function captureHeartShape() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "#000";
    ctx.font = (canvasWidth * 0.8) + "px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("♥", canvasWidth / 2, canvasHeight / 2);

    heartPixelData = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function render() {
    if (!heartPixelData) return;

    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    particles.forEach(particle => {

        particle.angleControlA += Math.random() > 0.5 ? -1 : 1;
        particle.angleControlB -= (particle.angleControlB - particle.angleControlA) * 0.05;

        const angle = particle.angleControlB * 8;
        const rad = angle * Math.PI / 180;

        particle.x += Math.cos(rad);
        particle.y += Math.sin(rad);

        const px = Math.floor(particle.x);
        const py = Math.floor(particle.y);

        let value = 0;

        if (px >= 0 && px < canvasWidth && py >= 0 && py < canvasHeight) {
            value = heartPixelData[(px + py * canvasWidth) * 4 + 3];
        }

        const inside = value > 0;

        if ((inside && !particle.previousHeartState) || (!inside && particle.previousHeartState)) {
            particle.opacity = 0.05;
        }

        particle.previousHeartState = inside;

        if (inside) {
            particle.opacity = Math.min(0.9, particle.opacity + 0.03);
            ctx.fillStyle = `rgba(255,0,80,${particle.opacity})`;
        } else {
            particle.opacity = Math.min(0.3, particle.opacity + 0.01);
            ctx.fillStyle = `rgba(255,255,255,${particle.opacity})`;
        }

        if (particle.x > canvasWidth) particle.x = 0;
        if (particle.x < 0) particle.x = canvasWidth;
        if (particle.y > canvasHeight) particle.y = 0;
        if (particle.y < 0) particle.y = canvasHeight;

        ctx.font = particleSizeFactor + "px Arial";
        ctx.fillText("❤", particle.x, particle.y);
    });

    // Center Text
    ctx.save();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 72px cursive";
    ctx.fillStyle = "#ff4d9d";
    ctx.shadowColor = "#ff66b3";
    ctx.shadowBlur = 25;

    ctx.fillText("Sneha", canvasWidth / 2, canvasHeight / 2);

    ctx.restore();
}

(function animate() {
    requestAnimFrame(animate);
    render();
})();

initializeParticles();
captureHeartShape();