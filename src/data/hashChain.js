// 使用瀏覽器原生 Web Crypto API 計算真實的 SHA-256，
// 每筆稽核紀錄都會納入「前一筆的雜湊值」，形成類區塊鏈的鏈狀結構：
// 只要中途任何一筆內容被竄改，其後所有雜湊都會連動改變、鏈即斷裂。
// 這裡沒有真的上鏈到公開區塊鏈網路（Demo 範圍所限），
// 但雜湊計算與鏈結邏輯是真實運作的，並非純視覺假資料。

export const GENESIS_HASH = '0'.repeat(64)

export async function sha256Hex(text) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function shortHash(hash) {
  if (!hash) return ''
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`
}

// 計算單一區塊雜湊：內容 + 前一筆雜湊 + 時間戳
export async function computeBlockHash({ payload, prevHash, timestamp }) {
  const canonical = JSON.stringify({ payload, prevHash, timestamp })
  return sha256Hex(canonical)
}

// 驗證整條鏈：重新計算每一筆雜湊，比對是否與紀錄的 hash 一致
export async function verifyChain(entries) {
  let prev = GENESIS_HASH
  for (const entry of entries) {
    const recomputed = await computeBlockHash({
      payload: entry.payload,
      prevHash: prev,
      timestamp: entry.timestamp,
    })
    if (recomputed !== entry.hash || entry.prevHash !== prev) {
      return { valid: false, brokenAt: entry.id }
    }
    prev = entry.hash
  }
  return { valid: true, brokenAt: null }
}
