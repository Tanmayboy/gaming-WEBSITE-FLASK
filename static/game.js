// static/game.js
const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

const bird = {
    x: 50,
    y: canvas.height / 2 - 15,
    radius: 15,
    velocity: 0,
    gravity: 0.5,
    jumpStrength: 10,
};

const pipes = [];
const pipeWidth = 40;
const pipeHeight = 200;
const pipeGap = 100;
const pipeSpeed = 3;

let score = 0;

function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700'; // Yellow
    ctx.fill();
    ctx.closePath();
}

function drawPipe(x, height) {
    ctx.fillStyle = '#008000'; // Green
    ctx.fillRect(x, 0, pipeWidth, height);
    ctx.fillRect(x, height + pipeGap, pipeWidth, canvas.height - height - pipeGap);
}

function drawScore() {
    ctx.fillStyle = '#000000'; // Black
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();

    for (const pipe of pipes) {
        drawPipe(pipe.x, pipe.height);
    }

    drawScore();
}

function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - bird.radius) {
        bird.y = canvas.height - bird.radius;
        bird.velocity = 0;
    }

    if (bird.y < bird.radius) {
        bird.y = bird.radius;
        bird.velocity = 0;
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({ x: canvas.width, height: pipeHeight });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;

        if (
            bird.x + bird.radius > pipes[i].x &&
            bird.x - bird.radius < pipes[i].x + pipeWidth &&
            (bird.y - bird.radius < pipes[i].height || bird.y + bird.radius > pipes[i].height + pipeGap)
        ) {
            // Collision detected
            resetGame();
            return;
        }

        if (pipes[i].x + pipeWidth < 0) {
            // Pipe is off-screen, remove it
            pipes.splice(i, 1);
            score++;
        }
    }
}

function resetGame() {
    bird.y = canvas.height / 2 - 15;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
}

function handleKeyPress(event) {
    if (event.key === ' ' || event.key === 'Spacebar') {
        bird.velocity = -bird.jumpStrength;
    }
}

document.addEventListener('keydown', handleKeyPress);

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();