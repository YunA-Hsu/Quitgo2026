# 社畜日記 — 後端 API 規格文件

> **版本**: v1.0（前端 Fixture 階段）
> **最後更新**: 2026-07-13
> **前端 Repo**: https://github.com/YunA-Hsu/Quitgo2026
>
> 本文件由前端 `src/services/` 與 `src/fixtures/` 自動掃描產出，
> 後端工程師可依此規格實作 RESTful API。

---

## ⚠️ 設計原則

> [!IMPORTANT]
> - **日記為 immutable**：建立後不可編輯、不需要 `PUT /diary/:id` endpoint。若使用者要修正，需刪除後重寫。
> - **金幣餘額必須以後端為準**：不可只存在客戶端 localStorage。所有金幣的增減必須由後端計算並回傳，前端僅做顯示。

---

## 一、資料模型

### User（使用者）

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | `string (UUID)` | 使用者唯一 ID |
| `nickname` | `string` | 暱稱，上限 12 字 |
| `avatarUrl` | `string` | 大頭貼 URL |
| `email` | `string` | 登入 Email |
| `googleLinked` | `boolean` | 是否綁定 Google 帳號 |
| `lineLinked` | `boolean` | 是否綁定 LINE 帳號 |
| `plan` | `'free' \| 'plus' \| 'pro'` | 訂閱方案 |
| `createdAt` | `ISO 8601` | 註冊時間 |

### Diary（日記）

> **immutable** — 建立後不可修改，無需 update endpoint。

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | `string (UUID)` | 日記唯一 ID |
| `userId` | `string` | 所屬使用者 |
| `date` | `string (YYYY-MM-DD)` | 記錄日期 |
| `time` | `string (HH:mm)` | 記錄時間 |
| `mood` | `MoodKey` | 心情，見下方枚舉 |
| `tags` | `string[]` | 標籤列表（自訂 + 預設） |
| `content` | `string` | 日記內文 |
| `coins` | `number` | 本篇獲得的金幣數 |
| `createdAt` | `ISO 8601` | 建立時間 |

**MoodKey 枚舉**: `'happy'` | `'calm'` | `'ordinary'` | `'achievement'` | `'depressed'` | `'hurt'` | `'angry'`

### Coin（金幣錢包）

> **金幣餘額必須以後端為準**，前端不做本地計算。

| 欄位 | 型別 | 說明 |
|------|------|------|
| `totalCoins` | `number` | 累計金幣總額 |
| `todayCoins` | `number` | 今日已獲得金幣 |
| `todayCoinCap` | `number` | 今日金幣上限 |

### BoardTile（大富翁格子）

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | `number` | 格子序號 |
| `title` | `string` | 格子標題 |
| `description` | `string` | 格子描述 |
| `rarity` | `'common' \| 'rare' \| 'epic'` | 稀有度 |
| `isVisited` | `boolean` | 是否已造訪 |
| `residentId` | `string?` | 居民素材檔名（可選） |

### BoardCard（大富翁卡牌）

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | `number` | 卡牌 ID |
| `type` | `'reward' \| 'skip'` | 獎勵卡 / 跳過卡 |
| `title` | `string` | 標題 |
| `description` | `string` | 描述 |
| `rarity` | `'common' \| 'rare' \| 'epic'` | 稀有度（reward 卡才有） |
| `residentId` | `string?` | 居民素材檔名 |

### Analytics（分析統計）

| 欄位 | 型別 | 說明 |
|------|------|------|
| `diaryCount` | `number` | 累計日記篇數 |
| `streakDays` | `number` | 連續記錄天數 |
| `topPains` | `TopPain[]` | 雷點 TOP 3 |
| `resonanceLine` | `string` | 共鳴句 |
| `radarData` | `RadarAxis[]` | 雷達圖五軸數據（0–100） |
| `keywords` | `Keyword[]` | 高頻關鍵字 |
| `aiReports` | `AiReportCard[]` | AI 報告卡（Pro 限定） |

**子結構**：
- `TopPain`: `{ label: string, count: number }`
- `RadarAxis`: `{ label: string, value: number }`
- `Keyword`: `{ text: string, weight: number }`
- `AiReportCard`: `{ icon: string, title: string, summary: string }`

---

## 二、API 端點

### 🔐 Auth（認證）

---

#### `POST /api/auth/login`

**用途**：使用者登入（Email 或第三方 OAuth）

**畫面**：`/login`

**Request Body**：
```json
{
  "email": "lulu@shachiku.diary",
  "password": "********"
}
```

**Response** `200 OK`：
```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": "u-001",
    "nickname": "LuLu",
    "avatarUrl": "/avatars/default.png",
    "email": "lulu@shachiku.diary",
    "plan": "pro"
  }
}
```

---

#### `POST /api/auth/register`

**用途**：使用者註冊

**畫面**：`/register`

**Request Body**：
```json
{
  "email": "new@user.com",
  "password": "********",
  "nickname": "新社畜"
}
```

**Response** `201 Created`：同 login 回傳結構

---

#### `POST /api/auth/logout`

**用途**：登出，使 Token 失效

**畫面**：`/profile`（登出按鈕）

**Request Header**：`Authorization: Bearer <token>`

**Response** `200 OK`：
```json
{ "message": "ok" }
```

---

### 📓 Diary（日記）

---

#### `GET /api/diary`

**用途**：取得使用者的日記列表（支援日期篩選）

**畫面**：`/diary`（日記列表頁）

**Query Params**：
| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `month` | `string (YYYY-MM)` | 否 | 篩選月份，預設當月 |

**Response** `200 OK`：
```json
[
  {
    "id": "1",
    "date": "2026-07-12",
    "time": "13:47",
    "mood": "hurt",
    "preview": "被主管否決提案，中午沒得休息⋯",
    "tags": ["工作", "壓力"],
    "coins": 10
  },
  {
    "id": "2",
    "date": "2026-07-12",
    "time": "15:28",
    "mood": "happy",
    "preview": "下午同事幫我分擔，真的很感謝！",
    "tags": ["同事", "感謝"],
    "coins": 10
  }
]
```

---

#### `GET /api/diary/:id`

**用途**：取得單篇日記詳細內容

**畫面**：`/diary/:id`（日記詳情頁）

**Response** `200 OK`：
```json
{
  "id": "1",
  "date": "2026-07-01",
  "time": "20:15",
  "mood": "calm",
  "tags": ["生活", "健康"],
  "content": "今天在公園散步了一會兒，微風很舒服。\n原本煩躁的心情平靜了不少，希望明天也能保持。",
  "coins": 10
}
```

---

#### `POST /api/diary`

**用途**：新增一篇日記（immutable，建立後不可修改）

**畫面**：`/diary/write`（寫日記頁）

**Request Body**：
```json
{
  "date": "2026-07-13",
  "time": "21:30",
  "mood": "calm",
  "tags": ["生活", "放鬆"],
  "content": "今天下班後去了海邊走走，心情很平靜。"
}
```

**Response** `201 Created`：
```json
{
  "id": "14",
  "coins": 10,
  "totalCoins": 1290
}
```

> [!IMPORTANT]
> 回傳需包含 `totalCoins`，讓前端即時更新錢包顯示。

---

#### `DELETE /api/diary/:id`

**用途**：刪除（封存）一篇日記

**畫面**：`/diary/:id`（日記詳情頁的刪除按鈕）

**Response** `200 OK`：
```json
{ "message": "ok" }
```

---

### 🏠 Home（首頁）

---

#### `GET /api/wallet`

**用途**：取得使用者金幣錢包資訊

**畫面**：`/home`（首頁能量罐）

**Response** `200 OK`：
```json
{
  "todayCoins": 88,
  "todayCoinCap": 100,
  "totalCoins": 1280
}
```

> [!IMPORTANT]
> 金幣餘額必須以後端為準。前端僅顯示，不做加減計算。

---

#### `GET /api/mood-tally`

**用途**：取得指定日期的心情統計（該日所有日記的心情分佈）

**畫面**：`/home`（首頁心情統計區）

**Query Params**：
| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `date` | `string (YYYY-MM-DD)` | 是 | 查詢日期 |

**Response** `200 OK`：
```json
{
  "happy": 3,
  "calm": 0,
  "ordinary": 0,
  "achievement": 1,
  "depressed": 0,
  "hurt": 0,
  "angry": 0
}
```

---

### 🎲 Board（職涯大富翁）

---

#### `GET /api/board/state`

**用途**：取得使用者的大富翁進度（已走過的格子、目前位置、能量）

**畫面**：`/board`（大富翁頁）

**Response** `200 OK`：
```json
{
  "energy": 250,
  "maxEnergy": 500,
  "level": 2,
  "levelTitle": "職場新手村",
  "currentPosition": 12,
  "drawnCards": [
    {
      "id": 1,
      "type": "reward",
      "title": "小確幸",
      "description": "同事請喝下午茶",
      "rarity": "common",
      "residentId": "Lulu.png"
    },
    {
      "id": 15,
      "type": "skip",
      "title": "稍微休息",
      "description": "停下腳步喝杯咖啡吧",
      "residentId": "Pongo.png"
    }
  ]
}
```

---

#### `POST /api/board/roll`

**用途**：擲骰子，消耗能量、前進並抽卡

**畫面**：`/board`（擲骰按鈕）

**Request Body**：
```json
{
  "energyCost": 30
}
```

**Response** `200 OK`：
```json
{
  "diceValue": 3,
  "newPosition": 15,
  "energy": 220,
  "card": {
    "id": 6,
    "type": "reward",
    "title": "出差旅行",
    "description": "假借出差行旅遊之實",
    "rarity": "rare",
    "residentId": "Pongo.png"
  }
}
```

**抽卡規則（後端實作）**：
- 獎勵卡 75% / 跳過卡 25%
- 連續 2 張跳過卡後保底獎勵
- 同張卡 5 格內不得重複

---

### 👤 Profile（個人資料）

---

#### `GET /api/user/profile`

**用途**：取得使用者個人資料

**畫面**：`/profile`

**Response** `200 OK`：
```json
{
  "id": "u-001",
  "nickname": "LuLu",
  "avatarUrl": "/avatars/default.png",
  "email": "lulu@shachiku.diary",
  "googleLinked": true,
  "lineLinked": false,
  "plan": "pro"
}
```

---

#### `PUT /api/user/avatar`

**用途**：更新大頭貼

**畫面**：`/profile`（頭像相機按鈕）

**Request**：`multipart/form-data`
| 欄位 | 型別 | 說明 |
|------|------|------|
| `avatar` | `File` | 圖片檔（image/*） |

**Response** `200 OK`：
```json
{
  "avatarUrl": "https://cdn.example.com/avatars/u-001.jpg"
}
```

---

#### `PUT /api/user/nickname`

**用途**：更新暱稱（上限 12 字）

**畫面**：`/profile`（暱稱鉛筆 icon）

**Request Body**：
```json
{
  "nickname": "新暱稱"
}
```

**Response** `200 OK`：
```json
{
  "nickname": "新暱稱"
}
```

---

#### `GET /api/user/account`

**用途**：取得登入帳號設定（綁定狀態）

**畫面**：`/profile/account`

**Response** `200 OK`：
```json
{
  "email": "lulu@shachiku.diary",
  "googleLinked": true,
  "lineLinked": false
}
```

---

### 📊 Analytics（分析庫銀行）

---

#### `GET /api/analytics`

**用途**：取得使用者的分析統計資料（含雷點、雷達圖、關鍵字、AI 報告）

**畫面**：`/analytics`

**Response** `200 OK`：
```json
{
  "diaryCount": 47,
  "streakDays": 23,
  "topPains": [
    { "label": "主管決策反覆", "count": 12 },
    { "label": "跨部門溝通消耗", "count": 9 },
    { "label": "加班", "count": 6 }
  ],
  "resonanceLine": "這不是你太玻璃心，這件事這個月發生了 6 次",
  "radarData": [
    { "label": "主管", "value": 78 },
    { "label": "同事", "value": 45 },
    { "label": "薪資", "value": 62 },
    { "label": "工時", "value": 85 },
    { "label": "成長", "value": 35 }
  ],
  "keywords": [
    { "text": "反覆", "weight": 5 },
    { "text": "來不及", "weight": 4 },
    { "text": "臨時", "weight": 3 },
    { "text": "加班", "weight": 3 }
  ],
  "aiReports": [
    {
      "icon": "🔍",
      "title": "深度壓力源剖析",
      "summary": "你的壓力不是來自工作量本身，而是來自不可控因素——尤其是主管決策的反覆性。"
    },
    {
      "icon": "🧭",
      "title": "求職避雷針",
      "summary": "下一份工作，建議優先確認：主管管理風格是否穩定、專案決策流程是否清楚。"
    },
    {
      "icon": "💡",
      "title": "去留思考建議",
      "summary": "目前的壓力多來自可溝通的流程問題，而非結構性因素，或許可以先嘗試溝通與調整。"
    }
  ]
}
```

> [!NOTE]
> `radarData` 的 value 範圍為 0–100，由後端根據日記內容分析產生。
> `aiReports` 僅限 Pro 方案使用者回傳，Free/Plus 使用者回傳空陣列。

---

#### `GET /api/user/plan`

**用途**：取得使用者目前的訂閱方案

**畫面**：`/analytics`（控制模糊遮罩顯示邏輯）

**Response** `200 OK`：
```json
{
  "plan": "pro"
}
```

**方案對照**：
| 方案 | 忍受地圖（雷達圖） | AI 報告 |
|------|-------------------|---------|
| `free` | ❌ 模糊遮罩 | ❌ 模糊遮罩 |
| `plus` | ✅ 完整顯示 | ❌ 模糊遮罩 |
| `pro` | ✅ 完整顯示 | ✅ 完整顯示 |

---

## 三、畫面 × API 對照總覽

| 畫面 | 路由 | 使用的 API |
|------|------|-----------|
| 登入 | `/login` | `POST /api/auth/login` |
| 註冊 | `/register` | `POST /api/auth/register` |
| 首頁 | `/home` | `GET /api/wallet`, `GET /api/mood-tally` |
| 日記列表 | `/diary` | `GET /api/diary` |
| 日記詳情 | `/diary/:id` | `GET /api/diary/:id`, `DELETE /api/diary/:id` |
| 寫日記 | `/diary/write` | `POST /api/diary` |
| 職涯大富翁 | `/board` | `GET /api/board/state`, `POST /api/board/roll` |
| 分析庫銀行 | `/analytics` | `GET /api/analytics`, `GET /api/user/plan` |
| 個人資料 | `/profile` | `GET /api/user/profile`, `PUT /api/user/avatar`, `PUT /api/user/nickname`, `POST /api/auth/logout` |
| 帳號設定 | `/profile/account` | `GET /api/user/account` |

---

## 四、共用規範

### 認證
所有 API（除 login/register）需帶 `Authorization: Bearer <token>` header。

### 錯誤格式
```json
{
  "error": "UNAUTHORIZED",
  "message": "Token 已過期，請重新登入"
}
```

### 常見 Status Code
| Code | 用途 |
|------|------|
| `200` | 成功 |
| `201` | 新增成功 |
| `400` | 參數錯誤 |
| `401` | 未認證 / Token 過期 |
| `404` | 資源不存在 |
| `422` | 驗證失敗（如暱稱超過 12 字） |
| `500` | 伺服器內部錯誤 |
