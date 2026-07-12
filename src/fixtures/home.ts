import type { MoodKey } from '../styles/tokens'

export const FIXTURE_USER_WALLET = {
  todayCoins: 88,
  todayCoinCap: 100,
  totalCoins: 1280
}

export type DailyMoodTally = Record<MoodKey, number>

// 預先準備好幾天假資料來測試
export const FIXTURE_DAILY_MOOD_TALLY: Record<string, DailyMoodTally> = {
  // 今天（部分有記錄）
  [new Date().toISOString().split('T')[0]]: {
    happy: 3,
    calm: 0,
    ordinary: 0,
    achievement: 1,
    depressed: 0,
    hurt: 0,
    angry: 0
  },
  // 昨天（過去某天）
  [new Date(Date.now() - 86400000).toISOString().split('T')[0]]: {
    happy: 0,
    calm: 2,
    ordinary: 1,
    achievement: 0,
    depressed: 1,
    hurt: 2,
    angry: 0
  },
  // 全部為 0 的空日
  [new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0]]: {
    happy: 0,
    calm: 0,
    ordinary: 0,
    achievement: 0,
    depressed: 0,
    hurt: 0,
    angry: 0
  }
}
