import React from 'react'
import { shortHash } from '../data/hashChain.js'
import { AUTHORIZATION } from '../data/mockData.js'

export default function Ledger({ entries, chainStatus, onVerify, verifying, revoked, onRevoke }) {
  return (
    <aside className="ledger">
      <div className="ledger__head">Audit Log · 稽核軌跡</div>
      <div className="ledger__title">可舉證雜湊鏈</div>

      {entries.length === 0 ? (
        <p className="empty-ledger">
          尚無紀錄。Agent 的每一個動作（讀取、比對、生成、送出）都會在此留下時間戳與雜湊值，並與前一筆紀錄串接，任何一筆遭竄改都可被偵測。
        </p>
      ) : (
        <>
          <button className="btn btn--ghost ledger__verify-btn" onClick={onVerify} disabled={verifying}>
            {verifying ? '驗證中…' : '重新驗證鏈完整性'}
          </button>

          {chainStatus && (
            <div className={`ledger__status ${chainStatus.valid ? 'ok' : 'broken'}`}>
              {chainStatus.valid ? '✓ 鏈完整，未偵測到竄改' : '✕ 偵測到不一致，鏈可能遭竄改'}
            </div>
          )}

          <div className="chain">
            {entries.map((e) => (
              <div className={`block ${chainStatus && !chainStatus.valid && e.id === chainStatus.brokenAt ? 'broken' : ''}`} key={e.id}>
                <div className="block__time">{e.timestamp}　·　{e.actor}</div>
                <div className="block__action">{e.action}</div>
                <div className={`block__hash ${chainStatus && !chainStatus.valid && e.id === chainStatus.brokenAt ? 'broken' : ''}`}>
                  {shortHash(e.hash)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="revoke-box">
        <div className="expiry-badge">
          授權效期：{AUTHORIZATION.grantedAt} → {AUTHORIZATION.expiresAt}
        </div>
        <p>委任人可隨時撤銷 Agent 的所有授權；撤銷或到期後，Agent 將立即停止讀取、生成與送件等一切動作。</p>
        {revoked ? (
          <div className="revoked-banner">⛔ 授權已撤銷，Agent 已停止所有動作</div>
        ) : (
          <button className="btn btn--danger" onClick={onRevoke} style={{ width: '100%' }}>
            立即撤銷 Agent 授權
          </button>
        )}
      </div>
    </aside>
  )
}
