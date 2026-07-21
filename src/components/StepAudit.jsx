import React from 'react'
import { shortHash } from '../data/hashChain.js'

const PILLARS = [
  { k: 'Principal', v: '王小明本人為唯一委任人，Agent 一切行動皆以其名義且限於本案執行。' },
  { k: 'Authorization', v: '授權範圍明確列出允許與禁止事項，禁止 Agent 自行送件與修改證據。' },
  { k: 'Tool / Action', v: 'Agent 僅能呼叫「讀取對話」「讀取出勤」「草擬文件」等受限工具，無寫入或外送權限。' },
  { k: 'Policy Gate', v: '送出申請書為高風險動作，強制要求本人勾選確認並親自核准才會執行。' },
  { k: 'Audit Log', v: '每個動作即時計算 SHA-256 雜湊並鏈接前一筆紀錄，形成可驗證、可舉證的軌跡。' },
  { k: 'Expiry / Revocation', v: '授權設有 7 天效期，到期自動失效；委任人亦可隨時手動撤銷，撤銷後 Agent 立即停止動作。' },
]

export default function StepAudit({ entries, revoked, trackingId }) {
  const exportLog = () => {
    const blob = new Blob([JSON.stringify({ caseId: 'LD-2026-0714-A031', trackingId, entries }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'audit-log-LD-2026-0714-A031.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section>
      <div className="panel-eyebrow">STEP 6 · Audit Overview</div>
      <h1 className="panel-title">稽核總覽與撤銷</h1>
      <p className="panel-lede">
        本案從授權建立到送出調解申請，全程留下可舉證的軌跡。以下為完整時間軸與六大信任要素對照。
      </p>

      <div className="card">
        <div className="card__title">完整時間軸</div>
        <table className="evidence-table">
          <thead>
            <tr>
              <th>時間</th>
              <th>行為者</th>
              <th>動作</th>
              <th>雜湊</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>{e.timestamp}</td>
                <td>{e.actor}</td>
                <td>{e.action}</td>
                <td>
                  <span className="hash-chip">{shortHash(e.hash)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn--ghost" style={{ marginTop: 14 }} onClick={exportLog}>
          匯出完整稽核紀錄（JSON）
        </button>
      </div>

      <div className="card">
        <div className="card__title">六大信任要素對照</div>
        {PILLARS.map((p) => (
          <div className="scope-row" key={p.k}>
            <span className="tag tag--allow" style={{ minWidth: 130, justifyContent: 'center' }}>
              {p.k}
            </span>
            <div>{p.v}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ borderColor: revoked ? 'var(--red)' : 'var(--line)' }}>
        <div className="card__title">目前授權狀態</div>
        {revoked ? (
          <div className="revoked-banner" style={{ marginTop: 0 }}>
            ⛔ 授權已撤銷 — Agent 已停止一切動作，此後任何送件、讀取或生成請求皆會被拒絕。
          </div>
        ) : (
          <div style={{ fontSize: 13.5 }}>
            <span className="tag tag--allow">生效中</span> 授權仍在效期內，委任人可隨時於左側稽核鏈面板撤銷。
          </div>
        )}
      </div>
    </section>
  )
}
