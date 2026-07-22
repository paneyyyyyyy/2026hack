# 勞資爭議可信 AI Agent Demo

> 勞工遇到爭議時，Agent 代表本人蒐集證據（對話紀錄、出勤資料）、驗證完整性、產生申請書並協助送件，全程留下可舉證的軌跡。

⚠️ 本專案為黑客松原型 Demo，**所有人物、對話、出勤資料皆為虛構合成情境**，不涉及真實個人或企業；亦未串接任何真實政府系統或外部 AI API（詳見〈本 Demo 的邊界〉）。

---

## 這個 Demo 想證明什麼

一個能讀取私人對話、能起草法律文件、甚至能觸發送件的 AI Agent，光是「答案正確」還不夠。這個 Demo 具體演示 Agent 代辦流程中的六個信任要素應該長什麼樣子：

| 要素 | 在 Demo 裡怎麼看到 |
|---|---|
| **Principal**（代表誰） | 案件綁定單一委任人身分，所有動作皆以其名義執行 |
| **Authorization**（被授權做什麼） | 明確的允許／禁止清單，例如禁止 Agent 自行送件、禁止修改原始證據 |
| **Tool / Action**（能呼叫什麼工具） | 讀取對話、讀取出勤、生成草稿被拆分為各自獨立、各自留痕的最小工具 |
| **Policy Gate**（高風險動作怎麼擋） | 送出申請書前，強制要求委任人手動勾選確認並核准，Agent 無法跳過 |
| **Audit Log**（如何追溯） | 每個動作即時計算真實 SHA-256 雜湊並鏈接前一筆紀錄；可現場示範「竄改證據 → 雜湊比對失敗」 |
| **Expiry / Revocation**（何時失效） | 授權 7 天到期自動失效，亦可隨時手動撤銷，撤銷後 Agent 立即停止一切動作 |

完整說明請見 [`GOVERNANCE_MEMO.md`](./GOVERNANCE_MEMO.md)（一頁治理／信任設計說明）。

## 功能流程（6 步）

1. **身份與授權設定** — 建立案件，設定 Agent 的授權範圍與 7 天效期
2. **Agent 蒐證** — 模擬讀取 LINE 對話紀錄與出勤打卡資料（唯讀）
3. **完整性驗證** — 對每筆證據計算 SHA-256 雜湊；提供「模擬竄改」按鈕即時展示竄改偵測
4. **生成申請書** — 模擬 Agent 依已驗證證據草擬《勞資爭議調解申請書》
5. **核准與送出（Policy Gate）** — 高風險動作需委任人親自核准才會送出
6. **稽核總覽與撤銷** — 完整時間軸、可匯出稽核紀錄（JSON）、六大信任要素對照、隨時撤銷授權

畫面右側全程顯示一條**可即時驗證的雜湊鏈稽核憑條**，是貫穿整個流程的核心視覺與互動元素。

## 技術棧

- **React 18 + Vite** 純前端 SPA，無需後端、無需 API Key 即可完整展示
- 雜湊鏈使用瀏覽器原生 **Web Crypto API**（`crypto.subtle.digest('SHA-256', ...)`）即時計算，非視覺假資料
- 純 CSS（無 UI 框架），設計語彙取材自「案件卷宗＋鏈式稽核憑條」的視覺隱喻
- 無資料庫、無外部 API 呼叫；申請書生成與政府送件皆為前端模擬流程（詳見下方邊界說明）

## 本地執行

```bash
npm install
npm run dev
```

開啟終端機顯示的網址（預設 `http://localhost:5173`）。

## 建置與部署（GitHub Pages）

專案已附上 GitHub Actions workflow（`.github/workflows/deploy.yml`），推送到 `main` 分支後會自動建置並部署到 GitHub Pages：

1. 將此專案 push 到你的 GitHub repo
2. 到 repo 的 **Settings → Pages**，Source 選擇 **GitHub Actions**
3. push 到 `main` 後，Actions 會自動執行 `npm ci && npm run build` 並部署 `dist/`
4. 完成後即可在 `https://<你的帳號>.github.io/<repo 名稱>/` 看到 Demo

也可以手動建置後用任何靜態網站服務（Netlify、Vercel、Cloudflare Pages）託管 `dist/` 資料夾：

```bash
npm run build
npm run preview   # 本機預覽建置結果
```

## 專案結構

```
labor-agent-demo/
├── src/
│   ├── data/
│   │   ├── mockData.js      # 虛構情境資料（人物、對話、出勤、申請書範本）
│   │   └── hashChain.js      # SHA-256 雜湊鏈計算與驗證邏輯
│   ├── components/
│   │   ├── Nav.jsx            # 左側卷宗導覽（案件步驟）
│   │   ├── Ledger.jsx         # 右側稽核鏈憑條（撤銷、驗證）
│   │   ├── StepPrincipal.jsx  # Step 1 身份與授權設定
│   │   ├── StepEvidence.jsx   # Step 2 Agent 蒐證
│   │   ├── StepIntegrity.jsx  # Step 3 完整性驗證（含竄改示範）
│   │   ├── StepDocument.jsx   # Step 4 生成申請書
│   │   ├── StepApproval.jsx   # Step 5 核准與送出（Policy Gate）
│   │   └── StepAudit.jsx      # Step 6 稽核總覽與撤銷
│   ├── App.jsx                 # 狀態管理與流程串接
│   └── styles.css              # 設計 tokens 與樣式
├── GOVERNANCE_MEMO.md           # 一頁治理／信任設計說明（正式交件項目）
└── .github/workflows/deploy.yml # GitHub Pages 自動部署
```

## 本 Demo 的邊界（誠實揭露）

為了在黑客松時程內聚焦展示「信任設計」而非工程規模，以下部分為簡化或模擬：

- **雜湊鏈**是本地即時計算的真實 SHA-256，但**未上鏈至公開區塊鏈網路**；VC／DID 為概念示意。
- **申請書生成**使用預先準備的範本模擬 AI 生成流程，**未呼叫真實 LLM API**（避免額外金鑰與費用需求，聚焦展示信任機制本身）。
- **送出至勞工局**為前端模擬，**未串接真實政府系統或自然人憑證驗證**。
- 所有資料均為虛構合成情境，符合競賽規則「敏感場景應使用匿名、合成或測試資料」之要求。

若走向正式產品，下一步規劃請見 [`GOVERNANCE_MEMO.md`](./GOVERNANCE_MEMO.md) 第 4 節。

## 授權

本專案原始碼採 MIT License，僅供黑客松展示與學習用途。
