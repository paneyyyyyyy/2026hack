import React, { useEffect, useState } from 'react'
import { LINE_MESSAGES, ATTENDANCE_RECORDS, DERIVED_FINDINGS } from '../data/mockData.js'
import { sha256Hex, shortHash } from '../data/hashChain.js'

const TAMPERED_LINE_MESSAGES = LINE_MESSAGES.map((m) =>
  m.id === 'm1' ? { ...m, text: '這個月案子趕，這幾天都留下來加班，辛苦了。' } : m,
)

export default function StepIntegrity({ committedHashes, onConfirm, done }) {
  const [liveLineHash, setLiveLineHash] = useState(null)
  const [tampered, setTampered] = useState(false)
  const [checked, setChecked] = useState(false)

  const dataset = tampered ? TAMPERED_LINE_MESSAGES : LINE_MESSAGES

  useEffect(() => {
    let cancelled = false
    sha256Hex(JSON.stringify(dataset)).then((h) => {
      if (!cancelled) setLiveLineHash(h)
    })
    return () => {
      cancelled = true
    }
  }, [tampered])

  const mismatch = checked && liveLineHash && committedHashes.line && liveLineHash !== committedHashes.line

  return (
    <section>
      <div className="panel-eyebrow">STEP 3 · Integrity Check</div>
      <h1 className="panel-title">完整性驗證</h1>
      <p className="panel-lede">
        每筆證據在蒐集當下即計算 SHA-256 雜湊並寫入稽核鏈。此處可重新計算目前內容的雜湊，
        與蒐證當下記錄的雜湊比對，用來確認證據自蒐集後未被更動——這就是「可舉證」的核心。
      </p>

      <div className="card">
        <div className="card__title">
          EV-01　LINE 對話紀錄
          <span className={`tag ${mismatch ? 'tag--deny' : 'tag--allow'}`}>
            {mismatch ? '雜湊不一致' : '已驗證'}
          </span>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--slate)', marginBottom: 10 }}>
          蒐證當下記錄之雜湊：
          <span className={`hash-chip`} style={{ marginLeft: 6 }}>
            {shortHash(committedHashes.line)}
          </span>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--slate)', marginBottom: 14 }}>
          目前內容重新計算之雜湊：
          <span className={`hash-chip ${mismatch ? 'broken' : ''}`} style={{ marginLeft: 6 }}>
            {liveLineHash ? shortHash(liveLineHash) : '計算中…'}
          </span>
        </div>

        {mismatch && (
          <div className="finding" style={{ background: 'var(--red-bg)', borderLeftColor: 'var(--red)', color: 'var(--red)' }}>
            ⚠ 驗證失敗：目前內容與蒐證當下的雜湊不一致，證據可能於送出前遭到竄改，系統已阻擋此筆證據繼續使用。
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button className="btn btn--ghost" onClick={() => setChecked(true)}>
            重新計算並比對雜湊
          </button>
          {!tampered ? (
            <button
              className="btn btn--ghost"
              style={{ color: 'var(--red)', borderColor: 'var(--red)' }}
              onClick={() => {
                setTampered(true)
                setChecked(true)
              }}
            >
              模擬竄改此筆證據（Demo）
            </button>
          ) : (
            <button className="btn btn--ghost" onClick={() => setTampered(false)}>
              還原原始證據
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card__title">
          EV-02　出勤打卡資料
          <span className="tag tag--allow">已驗證</span>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--slate)' }}>
          雜湊：<span className="hash-chip">{shortHash(committedHashes.attendance)}</span>（{ATTENDANCE_RECORDS.length} 筆紀錄，內容未變動）
        </div>
      </div>

      <div className="card">
        <div className="card__title">Agent 交叉比對後之發現</div>
        {DERIVED_FINDINGS.map((f, i) => (
          <div className="finding" key={i}>
            {f}
          </div>
        ))}
      </div>

      <div className="step-actions">
        <button className="btn btn--primary" onClick={onConfirm} disabled={done || mismatch || !checked}>
          {done ? '完整性驗證通過 ✓' : '確認證據完整並進入申請書生成'}
        </button>
      </div>
      {!checked && !done && (
        <p style={{ fontSize: 12, color: 'var(--slate-faint)', marginTop: 10 }}>
          請先點擊「重新計算並比對雜湊」完成驗證，才能進入下一步。
        </p>
      )}
    </section>
  )
}
