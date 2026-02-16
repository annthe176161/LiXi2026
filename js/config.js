/**
 * Cấu hình mệnh giá lì xì và lời chúc
 */

const LIXI_CONFIG = {
  // Các mệnh giá lì xì (VNĐ) - phân bổ cho 12 lá
  // 1 lá 500K, 3 lá 200K, 8 lá 100K
  denominations: [
    { value: 100000, label: "100,000₫", color: "#1565C0", count: 8 },
    { value: 200000, label: "200,000₫", color: "#E65100", count: 3 },
    { value: 500000, label: "500,000₫", color: "#C62828", count: 1 },
  ],

  // Số bao lì xì hiển thị (12 con giáp)
  envelopeCount: 12,

  // 12 con giáp với emoji và tên
  zodiacAnimals: [
    { icon: "🐭", name: "Tý", label: "Chuột" },
    { icon: "🐮", name: "Sửu", label: "Trâu" },
    { icon: "🐯", name: "Dần", label: "Hổ" },
    { icon: "🐱", name: "Mão", label: "Mèo" },
    { icon: "🐲", name: "Thìn", label: "Rồng" },
    { icon: "🐍", name: "Tỵ", label: "Rắn" },
    { icon: "🐴", name: "Ngọ", label: "Ngựa" },
    { icon: "🐐", name: "Mùi", label: "Dê" },
    { icon: "🐵", name: "Thân", label: "Khỉ" },
    { icon: "🐔", name: "Dậu", label: "Gà" },
    { icon: "🐶", name: "Tuất", label: "Chó" },
    { icon: "🐷", name: "Hợi", label: "Heo" },
  ],

  // Hình ảnh tờ tiền Việt Nam theo mệnh giá (dùng ảnh thật)
  moneyImages: {
    100000: { image: "100000.jpg" },
    200000: { image: "200000.jpg" },
    500000: { image: "500000.jpg" },
  },

  // Lời chúc Tết
  wishes: [
    "Năm mới vạn sự như ý, triệu triệu điều may! 🎊",
    "Chúc bạn năm mới phát tài phát lộc! 💰",
    "An khang thịnh vượng, vạn sự hanh thông! 🏮",
    "Năm mới sức khỏe dồi dào, tiền vào đầy túi! 💪",
    "Chúc bạn năm mới tình duyên viên mãn! 💕",
    "Năm mới thăng quan tiến chức, sự nghiệp lên như diều gặp gió! 🚀",
    "Chúc bạn năm mới cười nhiều hơn khóc, vui nhiều hơn buồn! 😄",
    "Tài lộc đến nhà, phúc đức tràn đầy! 🎋",
    "Năm mới mã đáo thành công, vạn sự như ý! 🐴",
    "Chúc bạn năm mới giàu sang phú quý, bình an hạnh phúc! 🌟",
    "Xuân sang tấn tài tấn lộc, năm mới bình an! 🌸",
    "Chúc mừng năm mới, gặp nhiều may mắn! 🍀",
  ],
};

/**
 * Format số tiền sang dạng VNĐ
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Lấy lời chúc ngẫu nhiên
 */
function getRandomWish() {
  const index = Math.floor(Math.random() * LIXI_CONFIG.wishes.length);
  return LIXI_CONFIG.wishes[index];
}

/**
 * Tạo danh sách 12 lá lì xì với mệnh giá được gán cố định + xáo trộn
 * Đảm bảo đúng 1 lá 500K, 3 lá 200K, 8 lá 100K
 */
function generateEnvelopePool() {
  const pool = [];

  for (const denom of LIXI_CONFIG.denominations) {
    for (let i = 0; i < denom.count; i++) {
      pool.push({ ...denom });
    }
  }

  // Xáo trộn Fisher-Yates
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool;
}

/**
 * Tạo HTML hình ảnh tờ tiền Việt Nam (dùng ảnh thật)
 */
function createMoneyHTML(denomination) {
  const money = LIXI_CONFIG.moneyImages[denomination.value];
  if (!money) return "";

  return `
    <div class="money-bill">
      <img src="${money.image}" alt="${denomination.label}" class="money-bill-img" />
    </div>
  `;
}
