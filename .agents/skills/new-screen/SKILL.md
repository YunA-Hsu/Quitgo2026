---
name: new-screen
description: 當使用者要求建立、實作或重做《社畜日記》的任何一個 App 畫面(登入、首頁、日記、大富翁、封存、分析、設定等)時,依此標準流程執行,產出符合 design system 的行動版畫面並完成瀏覽器截圖驗證。
---

# Skill:建立新畫面(標準流程)

## 執行前
1. 重讀 `.agents/rules/design-system.md` 與 `.agents/rules/project-context.md`
2. 查 `ASSETS.md` 確認這個畫面需要哪些素材、素材是否已就位;缺素材就先停下回報
3. 向使用者複述你理解的畫面需求(一段話即可),等確認後才動工

## 實作規則
1. 檔案位置:`src/screens/<ScreenName>/index.tsx`,子元件放同資料夾
2. 顏色、字體、圓角一律 import 自 `src/styles/tokens.ts`
3. 中文文案全部加進 `src/copy/zh-TW.ts` 再引用,元件內不得出現字串常值文案
4. 可重用元件(按鈕、卡片、情緒標籤、底部導覽列)放 `src/components/`,先檢查是否已存在,避免重複造輪子
5. 資料用 `src/fixtures/` 假資料,透過 `src/services/` 介面取得

## 驗證(必做)
1. 啟動 dev server,用瀏覽器以 390px 寬度開啟該畫面
2. 截圖,逐項自我檢查:
   - [ ] 沒有 hardcode 色碼、沒有紅色警告感的情緒元素
   - [ ] 字體是 Noto Sans TC / PingFang TC,無手寫風
   - [ ] 背景有格紋紙質感
   - [ ] 觸控目標 ≥ 44px
   - [ ] 文案語氣是「陪伴,不評價」
3. 把截圖與檢查結果整理到 walkthrough,停下等使用者確認
4. 使用者提出的修正若涉及通用規範,提醒使用者是否要把結論補進 rules 檔
