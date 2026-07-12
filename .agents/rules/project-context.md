# 專案背景與技術規範

## 產品是什麼
《社畜日記》(Shachiku Diary):給台灣 25–44 歲上班族的遊戲化職場情緒日記 App。
核心理念:「在不滿意的工作生活中找到快樂」。定位是 AI 職場自我探索工具,
不是離職鼓吹工具,也不是純發洩工具。主流程:記錄 → 分析 → 釐清 → 建議 → 導流。

## 技術棧(不得擅自更換)
- React 18 + Vite + TypeScript(strict)
- Tailwind CSS(色彩經由 tokens.ts 注入 tailwind config,不直接用預設色板)
- 路由:react-router-dom
- 狀態:輕量為主,優先 useState/useContext;不引入 Redux
- Mobile-first Web App,基準視窗 390×844;桌面瀏覽時置中並限制最大寬度 430px

## 畫面清單(依開發順序)
1. `/login` 登入頁 — 阿芽 Yaya 迎賓、Google/LINE 第三方登入按鈕(官方品牌素材,不可重繪)
2. `/register` 註冊流程 — 新進員工報到,阿芽=村長
3. `/home` 首頁 — 今日狀態、快速記錄入口、今日走到哪一格
4. `/diary/new` 日記撰寫頁 — 三步驟內完成:情緒(七選一)→ 事件標籤 → 選填一句話
5. `/board` 職涯大富翁 — 擲骰、能量環、迷霧格、幸運獎勵
6. `/archive` 封存頁 — 情緒日曆(七色)
7. `/analytics` 職場分析報告 — Free/Plus/Pro 三層;忍受地圖
8. `/analytics/map` 忍受地圖詳情
9. `/profile` 個人設定 — 含密碼鎖、低調通知等隱私設定

## 工作方式
- 一次只做一個畫面,完成後停下等我確認再繼續
- 每個畫面完成後,用瀏覽器以 390px 寬度截圖給我驗證
- 修改設計規範前必須先問我;我確認後把結論補寫回 rules 檔
- commit message 用英文,格式 `feat(screen): ...` / `fix(ui): ...`

## 資料層(V1)
- V1 不做真後端:資料先用 localStorage + 假資料 fixtures(`src/fixtures/`)
- 所有 API 呼叫封裝在 `src/services/`,介面先定義好,方便後端工程師之後接手串接
