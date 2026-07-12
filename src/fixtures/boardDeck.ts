import { Rarity } from './boardTiles';

export type CardType = 'reward' | 'skip';

export interface BoardCard {
  id: number;
  type: CardType;
  title: string;
  description: string;
  rarity?: Rarity; // only for reward cards
  residentId?: string;
}

// 18 Cards: 14 rewards, 4 skips
export const MOCK_BOARD_DECK: BoardCard[] = [
  // 14 Rewards
  { id: 1, type: 'reward', title: '小確幸', description: '同事請喝下午茶', rarity: 'common', residentId: 'Lulu.png' },
  { id: 2, type: 'reward', title: '提早下班', description: '專案順利提早結束', rarity: 'rare', residentId: 'Yaya.png' },
  { id: 3, type: 'reward', title: '遇到貴人', description: '前輩熱心指導', rarity: 'rare', residentId: 'Fifi.png' },
  { id: 4, type: 'reward', title: '尾牙中獎', description: '抽中頭獎運氣爆棚', rarity: 'epic', residentId: 'Yoyo.png' },
  { id: 5, type: 'reward', title: '升職加薪', description: '努力終於被看見了', rarity: 'epic', residentId: 'Yeye.png' },
  { id: 6, type: 'reward', title: '出差旅行', description: '假借出差行旅遊之實', rarity: 'rare', residentId: 'Pongo.png' },
  { id: 7, type: 'reward', title: '新血加入', description: '來了個得力助手', rarity: 'common', residentId: 'Momo.png' },
  { id: 8, type: 'reward', title: '完美簡報', description: '客戶非常滿意提案', rarity: 'epic', residentId: 'Nunu.png' },
  { id: 9, type: 'reward', title: '順利結案', description: '團隊合作無間', rarity: 'rare', residentId: 'Lulu.png' },
  { id: 10, type: 'reward', title: '發現寶藏', description: '在零食櫃找到最後一包洋芋片', rarity: 'common', residentId: 'Fifi.png' },
  { id: 11, type: 'reward', title: '創意湧現', description: '想到了一個超棒的點子', rarity: 'rare', residentId: 'Yaya.png' },
  { id: 12, type: 'reward', title: '效率滿分', description: '今天的工作進度超前', rarity: 'common', residentId: 'Momo.png' },
  { id: 13, type: 'reward', title: '獲取榮譽', description: '得到主管的大力稱讚', rarity: 'epic', residentId: 'Yeye.png' },
  { id: 14, type: 'reward', title: '心情愉悅', description: '今天一整天都覺得很順利', rarity: 'common', residentId: 'Yoyo.png' },
  
  // 4 Skips
  { id: 15, type: 'skip', title: '稍微休息', description: '停下腳步喝杯咖啡吧', residentId: 'Pongo.png' },
  { id: 16, type: 'skip', title: '重新整理', description: '整理一下思緒再出發', residentId: 'Nunu.png' },
  { id: 17, type: 'skip', title: '原地踏步', description: '有時候停留在原地也不錯', residentId: 'Fifi.png' },
  { id: 18, type: 'skip', title: '放空片刻', description: '享受一下安靜的時光', residentId: 'Lulu.png' },
];
