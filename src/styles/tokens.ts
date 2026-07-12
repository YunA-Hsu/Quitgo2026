/**
 * 《社畜日記》Design Tokens — 唯一色彩來源
 * 任何元件禁止 hardcode 色碼,一律從這裡 import。
 */

/** 七色情緒系統(固定,不得增減或改碼) */
export const mood = {
  happy: '#FFD166',       // 開心・向日葵黃
  calm: '#7BC8D6',        // 平靜・湖水藍
  ordinary: '#B8C4A4',    // 平凡的一天・鼠尾草綠
  achievement: '#E6B655', // 成就感・琥珀金
  depressed: '#9C9ABF',   // 憂鬱・薰衣草灰紫
  hurt: '#A3B4C4',        // 委屈・霧藍灰
  angry: '#E76F51',       // 憤怒・珊瑚橙紅
} as const;

export type MoodKey = keyof typeof mood;

/** 情緒中文標籤(UI 顯示用) */
export const moodLabels: Record<MoodKey, string> = {
  happy: '開心',
  calm: '平靜',
  ordinary: '平凡的一天',
  achievement: '成就感',
  depressed: '憂鬱',
  hurt: '委屈',
  angry: '憤怒',
};

/** 基底色 */
export const base = {
  bg: '#F5F0E6',          // 暖米色全域背景
  card: '#FDFBF5',        // 卡片底色
  textPrimary: '#4A4238', // 主文字・暖深灰
  textSecondary: '#8C8478',
  border: '#E5DECF',
  brandSprout: '#8FA876', // 阿芽・嫩芽綠
  accentCoral: '#E76F51', // 珊瑚橙(書籤/點綴,非警告用途)
} as const;

/** 稀有度框色(大富翁幸運獎勵,低飽和) */
export const rarity = {
  common: '#C4BBA8',
  rare: '#9FB4C9',
  epic: '#C9A86B',
} as const;

/** 圓角與陰影 */
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;
export const shadow = {
  card: '0 2px 8px rgba(74, 66, 56, 0.06)',
  raised: '0 4px 16px rgba(74, 66, 56, 0.10)',
  soft: '0 1px 4px rgba(74, 66, 56, 0.04)',
} as const;

/** 字體 */
export const font = {
  family: "'Noto Sans TC', 'PingFang TC', sans-serif",
  size: { title: 20, section: 17, body: 15, caption: 13 },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: 1.6,
} as const;

/** 遊戲數值 */
export const game = {
  energyPerRoll: 30, // 每次擲骰消耗能量
} as const;
