export type Rarity = 'common' | 'rare' | 'epic';

export interface BoardTile {
  id: number;
  title: string;
  description: string;
  rarity: Rarity;
  isVisited: boolean;
  residentId?: string; // 對應 src/assets/characters/ 的檔名，例如 'Fifi.png'
}

export const MOCK_BOARD_TILES: BoardTile[] = [
  { id: 1, title: '初入職場', description: '第一天上班，緊張又期待', rarity: 'common', isVisited: true, residentId: 'Yaya.png' },
  { id: 2, title: '茶水間八卦', description: '聽到了一些不可告人的秘密', rarity: 'common', isVisited: true, residentId: 'Fifi.png' },
  { id: 3, title: '小確幸', description: '老闆請喝下午茶', rarity: 'rare', isVisited: true, residentId: 'Lulu.png' },
  { id: 4, title: '加班地獄', description: '專案趕工，連續加班一週', rarity: 'common', isVisited: true, residentId: 'Momo.png' },
  { id: 5, title: '升職加薪', description: '努力終於被看見了！', rarity: 'epic', isVisited: true, residentId: 'Yeye.png' },
  { id: 6, title: '背黑鍋', description: '不是我的錯，卻要我扛', rarity: 'common', isVisited: true, residentId: 'Nunu.png' },
  { id: 7, title: '出差旅行', description: '假借出差之名，行旅遊之實', rarity: 'rare', isVisited: true, residentId: 'Pongo.png' },
  { id: 8, title: '遇到貴人', description: '前輩熱心指導，獲益良多', rarity: 'rare', isVisited: true, residentId: 'Yoyo.png' },
  { id: 9, title: '尾牙中獎', description: '抽中頭獎，運氣爆棚', rarity: 'epic', isVisited: true, residentId: 'Yaya.png' },
  { id: 10, title: '專案成功', description: '團隊合作無間，順利結案', rarity: 'rare', isVisited: true, residentId: 'Fifi.png' },
  { id: 11, title: '職場倦怠', description: '不想上班，只想躺平', rarity: 'common', isVisited: true, residentId: 'Momo.png' },
  { id: 12, title: '新血加入', description: '來了個得力助手', rarity: 'rare', isVisited: true, residentId: 'Lulu.png' },
  { id: 13, title: '未知的挑戰', description: '前方霧濛濛的...', rarity: 'epic', isVisited: false },
  { id: 14, title: '神秘事件', description: '敬請期待', rarity: 'rare', isVisited: false },
  { id: 15, title: '未來展望', description: '會發生什麼事呢？', rarity: 'common', isVisited: false }
];
