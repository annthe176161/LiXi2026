/**
 * Hiệu ứng Confetti - Pháo hoa khi rút lì xì
 */

const confettiCanvas = document.getElementById("confetti-canvas");
const confettiCtx = confettiCanvas.getContext("2d");
let confettiParticles = [];
let confettiAnimationId = null;

// Resize canvas
function resizeConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeConfettiCanvas);
resizeConfettiCanvas();

// Particle class
class ConfettiParticle {
  constructor() {
    this.x = Math.random() * confettiCanvas.width;
    this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
    this.size = Math.random() * 8 + 4;
    this.speedY = Math.random() * 3 + 2;
    this.speedX = Math.random() * 2 - 1;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 10 - 5;
    this.opacity = 1;
    this.color = this.getRandomColor();
    this.shape = Math.random() > 0.5 ? "rect" : "circle";
  }

  getRandomColor() {
    const colors = [
      "#FFD700", // Vàng
      "#FF0000", // Đỏ
      "#FF6B6B", // Hồng đỏ
      "#FFA500", // Cam
      "#FF69B4", // Hồng
      "#FFE4B5", // Vàng nhạt
      "#FF4500", // Đỏ cam
      "#DC143C", // Đỏ thẫm
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;
    this.opacity -= 0.005;

    // Gió nhẹ
    this.speedX += Math.sin(this.y * 0.01) * 0.1;
  }

  draw() {
    confettiCtx.save();
    confettiCtx.globalAlpha = this.opacity;
    confettiCtx.translate(this.x, this.y);
    confettiCtx.rotate((this.rotation * Math.PI) / 180);
    confettiCtx.fillStyle = this.color;

    if (this.shape === "rect") {
      confettiCtx.fillRect(
        -this.size / 2,
        -this.size / 4,
        this.size,
        this.size / 2,
      );
    } else {
      confettiCtx.beginPath();
      confettiCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      confettiCtx.fill();
    }

    confettiCtx.restore();
  }

  isAlive() {
    return this.opacity > 0 && this.y < confettiCanvas.height + 20;
  }
}

// Animation loop
function animateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiParticles = confettiParticles.filter((p) => p.isAlive());

  confettiParticles.forEach((p) => {
    p.update();
    p.draw();
  });

  if (confettiParticles.length > 0) {
    confettiAnimationId = requestAnimationFrame(animateConfetti);
  } else {
    cancelAnimationFrame(confettiAnimationId);
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

// Launch confetti
function launchConfetti() {
  const particleCount = 150;

  for (let i = 0; i < particleCount; i++) {
    setTimeout(() => {
      confettiParticles.push(new ConfettiParticle());
    }, i * 10);
  }

  if (!confettiAnimationId || confettiParticles.length <= particleCount) {
    animateConfetti();
  }
}
