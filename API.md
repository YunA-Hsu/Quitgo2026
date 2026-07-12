# API 設計合約

本文件記錄了《社畜日記》與後端溝通的 API 設計合約，供未來串接時參考。

## 資源: Profile (個人資料)

### `updateAvatar`
- **Method**: `PUT`
- **Endpoint**: `/api/profile/avatar`
- **Description**: 更新使用者的頭像。
- **Request Body** (FormData):
  - `file`: 圖片檔案 (File) 或 base64 字串
- **Response**:
  - `200 OK`
  - `{ "avatarUrl": "https://..." }`

### `updateNickname`
- **Method**: `PATCH`
- **Endpoint**: `/api/profile/nickname`
- **Description**: 更新使用者的暱稱 (上限 12 字)。
- **Request Body** (JSON):
  - `nickname` (string)
- **Response**:
  - `200 OK`
  - `{ "nickname": "..." }`

### `logout`
- **Method**: `POST`
- **Endpoint**: `/api/auth/logout`
- **Description**: 登出目前使用者，後端使 Token 失效。
- **Response**:
  - `200 OK`

## 資源: Analytics (分析庫銀行)

### `getAnalytics`
- **Method**: `GET`
- **Endpoint**: `/api/analytics`
- **Description**: 取得使用者的分析統計資料，包含雷點 TOP 3、雷達圖五軸、高頻關鍵字、AI 報告摘要。
- **Response**:
  - `200 OK`
  - ```json
    {
      "diaryCount": 47,
      "streakDays": 23,
      "topPains": [{ "label": "主管決策反覆", "count": 12 }],
      "resonanceLine": "這不是你太玻璃心...",
      "radarData": [{ "label": "主管", "value": 78 }],
      "keywords": [{ "text": "反覆", "weight": 5 }],
      "aiReports": [{ "icon": "🔍", "title": "深度壓力源剖析", "summary": "..." }]
    }
    ```

### `getUserPlan`
- **Method**: `GET`
- **Endpoint**: `/api/user/plan`
- **Description**: 取得使用者目前的訂閱方案 (`free` | `plus` | `pro`)。
- **Response**:
  - `200 OK`
  - `{ "plan": "free" }`
