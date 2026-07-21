import React, { useState } from 'react'
import { CASE_PRINCIPAL } from '../data/mockData.js'

export default function StepApproval({ onSubmit, onNext, done, trackingId }) {
  const [checked, setChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitting(false)
    onSubmit()
  }

  return (
    <section>
      <div className="panel-eyebrow">STEP 5 · Policy Gate</div>
      <h1 className="panel-title">核准與送出</h1>

      <div className="gate-banner">
        <div className="gate-banner__icon">🛑</div>
        <div>
          <h4>此為高風險動作，需本人親自核准</h4>
          <p>
            依授權範圍，Agent 不得自行將申請書送出至勞工局調解窗口。
            送出前必須由 {CASE_PRINCIPAL.name} 本人逐項確認申請書內容無誤，並明確按下核准，此步驟才會被執行。
          </p>
        </div>
      </div>

      {!done ? (
        <div className="card">
          <div className="card__title">送出前確認</div>
          <label className="checkline">
            <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
            我已審閱申請書草稿之申請人、相對人、爭議類型、事實摘要與請求事項，內容屬實且同意以本人名義送出。
          </label>
          <button className="btn btn--amber" onClick={submit} disabled={!checked || submitting}>
            {submitting ? '送出中…' : '本人核准並送出申請書'}
          </button>
        </div>
      ) : (
        <div className="tracking-box">
          <div style={{ fontSize: 13.5, color: 'var(--green)' }}>已由本人核准並送出至勞工局調解窗口</div>
          <div className="tracking-box__id">{trackingId}</div>
          <div style={{ fontSize: 12, color: 'var(--slate)' }}>請保留此追蹤編號，後續可於稽核總覽查詢完整歷程</div>
        </div>
      )}

      <div className="step-actions">
        <button className="btn btn--primary" onClick={onNext} disabled={!done}>
          前往稽核總覽
        </button>
      </div>
    </section>
  )
}
