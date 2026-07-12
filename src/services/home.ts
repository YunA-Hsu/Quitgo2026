import { FIXTURE_USER_WALLET, FIXTURE_DAILY_MOOD_TALLY } from '../fixtures/home'
import type { MoodKey } from '../styles/tokens'

export const homeService = {
  getWalletInfo() {
    return FIXTURE_USER_WALLET
  },
  
  getMoodTally(dateStr: string): Record<MoodKey, number> {
    // 若該日有假資料則回傳，否則回傳全為 0 的資料
    if (FIXTURE_DAILY_MOOD_TALLY[dateStr]) {
      return FIXTURE_DAILY_MOOD_TALLY[dateStr]
    }
    return {
      happy: 0,
      calm: 0,
      ordinary: 0,
      achievement: 0,
      depressed: 0,
      hurt: 0,
      angry: 0
    }
  }
}
