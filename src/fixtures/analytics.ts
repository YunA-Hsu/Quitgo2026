/**
 * 分析庫銀行 — 假資料
 * 支援三種方案 (free / plus / pro) 切換測試
 */

export type UserPlan = 'free' | 'plus' | 'pro';

export interface TopPain {
  label: string;
  count: number;
}

export interface RadarAxis {
  label: string;
  value: number; // 0–100
}

export interface AiReportCard {
  icon: string;     // emoji 佔位
  title: string;
  summary: string;
}

export interface AnalyticsData {
  diaryCount: number;
  streakDays: number;
  topPains: TopPain[];
  resonanceLine: string;
  radarData: RadarAxis[];
  keywords: { text: string; weight: number }[];
  aiReports: AiReportCard[];
}

/** 分析統計資料 */
export const FIXTURE_ANALYTICS: AnalyticsData = {
  diaryCount: 47,
  streakDays: 23,
  topPains: [
    { label: '主管決策反覆', count: 12 },
    { label: '跨部門溝通消耗', count: 9 },
    { label: '加班', count: 6 },
  ],
  resonanceLine: '這不是你太玻璃心，這件事這個月發生了 6 次',
  radarData: [
    { label: '主管', value: 78 },
    { label: '同事', value: 45 },
    { label: '薪資', value: 62 },
    { label: '工時', value: 85 },
    { label: '成長', value: 35 },
  ],
  keywords: [
    { text: '反覆', weight: 5 },
    { text: '來不及', weight: 4 },
    { text: '臨時', weight: 3 },
    { text: '加班', weight: 3 },
  ],
  aiReports: [
    {
      icon: '🔍',
      title: '深度壓力源剖析',
      summary: '你的壓力不是來自工作量本身，而是來自不可控因素——尤其是主管決策的反覆性。',
    },
    {
      icon: '🧭',
      title: '求職避雷針',
      summary: '下一份工作，建議優先確認：主管管理風格是否穩定、專案決策流程是否清楚。',
    },
    {
      icon: '💡',
      title: '去留思考建議',
      summary: '目前的壓力多來自可溝通的流程問題，而非結構性因素，或許可以先嘗試溝通與調整。',
    },
  ],
};

/** 當前使用者方案（切換此值以測試不同方案） */
export const FIXTURE_USER_PLAN: UserPlan = 'pro';

/** 導流區入口 */
export const FIXTURE_GUIDE_ENTRIES = [
  { icon: '💼', label: '職涯諮詢' },
  { icon: '❤️', label: '心理支持' },
  { icon: '⚖️', label: '勞基法資源' },
  { icon: '🔎', label: '求職平台' },
];
