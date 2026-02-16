/**
 * App chính - Logic rút lì xì
 */

let currentUser = "";
let history = [];
let hasDrawn = false;
let envelopePool = []; // Mảng mệnh giá đã gán cho từng lá

/**
 * Bắt đầu trò chơi
 */
function startGame() {
  const nameInput = document.getElementById("user-name");
  const name = nameInput.value.trim();

  if (!name) {
    nameInput.style.borderColor = "#f44336";
    nameInput.placeholder = "⚠️ Vui lòng nhập tên của bạn!";
    shakeElement(nameInput);
    return;
  }

  currentUser = name;
  hasDrawn = false;

  // Tạo pool mệnh giá xáo trộn cho 12 lá
  envelopePool = generateEnvelopePool();

  // Hiển thị tên
  document.getElementById("display-name").textContent = name;

  // Ẩn section nhập tên, hiện game section
  document.getElementById("name-section").classList.add("hidden");
  document.getElementById("game-section").classList.remove("hidden");

  // Tạo các bao lì xì
  createEnvelopes();
}

/**
 * Tạo các bao lì xì trên giao diện - 12 con giáp
 */
function createEnvelopes() {
  const container = document.getElementById("envelope-container");
  container.innerHTML = "";

  const count = LIXI_CONFIG.envelopeCount;
  const zodiacs = LIXI_CONFIG.zodiacAnimals;

  for (let i = 0; i < count; i++) {
    const zodiac = zodiacs[i];
    const envelope = document.createElement("div");
    envelope.className = "envelope";
    envelope.setAttribute("data-index", i);

    envelope.innerHTML = `
      <div class="envelope-inner">
        <div class="envelope-flap"></div>
        <span class="envelope-zodiac">${zodiac.icon}</span>
        <span class="envelope-label">${zodiac.name} - ${zodiac.label}</span>
      </div>
    `;

    envelope.addEventListener("click", () => openEnvelope(envelope, i));
    container.appendChild(envelope);
  }

  // Animation xuất hiện
  requestAnimationFrame(() => {
    const envelopes = container.querySelectorAll(".envelope");
    envelopes.forEach((env, index) => {
      setTimeout(() => {
        env.style.opacity = "1";
        env.style.transform = "translateY(0)";
      }, index * 80);
    });
  });
}

/**
 * Mở một bao lì xì
 */
function openEnvelope(envelope, index) {
  if (hasDrawn) return;
  hasDrawn = true;

  // Animation chọn
  envelope.classList.add("selected");

  // Đánh dấu tất cả đã mở
  const allEnvelopes = document.querySelectorAll(".envelope");
  allEnvelopes.forEach((env) => {
    if (env !== envelope) {
      env.classList.add("opened");
    }
  });

  // Lấy mệnh giá đã gán sẵn cho lá này
  const denomination = envelopePool[index];
  const wish = getRandomWish();
  const zodiac = LIXI_CONFIG.zodiacAnimals[index];

  // Delay để tạo hiệu ứng hồi hộp
  setTimeout(() => {
    showResult(denomination, wish, zodiac);
    addToHistory(currentUser, denomination, zodiac);

    // Bắn confetti
    launchConfetti();
  }, 800);
}

/**
 * Hiển thị kết quả với hình tiền Việt Nam
 */
function showResult(denomination, wish, zodiac) {
  const resultSection = document.getElementById("result-section");
  const resultTitle = document.getElementById("result-title");
  const resultMessage = document.getElementById("result-message");
  const resultAmount = document.getElementById("result-amount");
  const resultWish = document.getElementById("result-wish");
  const resultMoney = document.getElementById("result-money");
  const resultZodiac = document.getElementById("result-zodiac");

  resultTitle.textContent = `🎉 Chúc mừng ${currentUser}!`;
  resultMessage.textContent = `Bạn chọn lá ${zodiac.icon} ${zodiac.name} (${zodiac.label}) và rút được:`;
  resultAmount.textContent = formatCurrency(denomination.value);
  resultAmount.style.color = denomination.color || "#d32f2f";
  resultWish.textContent = `"${wish}"`;

  // Hiển thị hình tờ tiền
  resultMoney.innerHTML = createMoneyHTML(denomination);

  // Hiển thị con giáp
  resultZodiac.innerHTML = `<span class="zodiac-big">${zodiac.icon}</span>`;

  resultSection.classList.remove("hidden");

  // Scroll đến kết quả
  resultSection.scrollIntoView({ behavior: "smooth", block: "center" });
}

/**
 * Thêm vào lịch sử
 */
function addToHistory(name, denomination, zodiac) {
  const time = new Date().toLocaleTimeString("vi-VN");
  history.unshift({ name, denomination, zodiac, time });

  renderHistory();

  // Lưu vào localStorage
  saveHistory();
}

/**
 * Render danh sách lịch sử
 */
function renderHistory() {
  const historySection = document.getElementById("history-section");
  const historyList = document.getElementById("history-list");

  if (history.length === 0) {
    historySection.classList.add("hidden");
    return;
  }

  historySection.classList.remove("hidden");
  historyList.innerHTML = "";

  history.forEach((item) => {
    const zodiacInfo = item.zodiac ? `${item.zodiac.icon} ` : "🧧 ";
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.innerHTML = `
      <div>
        <span class="history-name">${zodiacInfo}${item.name}</span>
        <div class="history-time">${item.time}</div>
      </div>
      <span class="history-amount">${formatCurrency(item.denomination.value)}</span>
    `;
    historyList.appendChild(historyItem);
  });
}

/**
 * Chơi lại
 */
function resetGame() {
  hasDrawn = false;

  // Ẩn kết quả
  document.getElementById("result-section").classList.add("hidden");

  // Ẩn game, hiện nhập tên
  document.getElementById("game-section").classList.add("hidden");
  document.getElementById("name-section").classList.remove("hidden");

  // Reset input
  const nameInput = document.getElementById("user-name");
  nameInput.value = "";
  nameInput.style.borderColor = "";
  nameInput.placeholder = "Nhập tên bạn tại đây...";
  nameInput.focus();
}

/**
 * Lưu lịch sử vào localStorage
 */
function saveHistory() {
  try {
    localStorage.setItem("lixi_history", JSON.stringify(history));
  } catch (e) {
    console.warn("Không thể lưu lịch sử:", e);
  }
}

/**
 * Load lịch sử từ localStorage
 */
function loadHistory() {
  try {
    const saved = localStorage.getItem("lixi_history");
    if (saved) {
      history = JSON.parse(saved);
      renderHistory();
    }
  } catch (e) {
    console.warn("Không thể đọc lịch sử:", e);
  }
}

/**
 * Hiệu ứng lắc element
 */
function shakeElement(element) {
  element.style.animation = "none";
  element.offsetHeight; // trigger reflow
  element.style.animation = "shake 0.5s ease";
  setTimeout(() => {
    element.style.animation = "";
  }, 500);
}

/**
 * Xử lý Enter ở ô input
 */
document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("user-name");

  nameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      startGame();
    }
  });

  nameInput.addEventListener("input", () => {
    nameInput.style.borderColor = "#ffd700";
  });

  // Load lịch sử
  loadHistory();

  // Focus vào input
  nameInput.focus();
});
