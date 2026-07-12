/**
 * 分析庫銀行 — Service Layer
 * V1: 讀取 fixtures，介面先定義好方便後端串接
 */
import {
  FIXTURE_ANALYTICS,
  FIXTURE_USER_PLAN,
  type AnalyticsData,
  type UserPlan,
} from '../fixtures/analytics';

export const analyticsService = {
  /** 取得分析統計資料 */
  getAnalytics(): AnalyticsData {
    return FIXTURE_ANALYTICS;
  },

  /** 取得使用者目前方案 */
  getUserPlan(): UserPlan {
    return FIXTURE_USER_PLAN;
  },
};
