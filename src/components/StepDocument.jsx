import React, { useState } from 'react'
import { DOCUMENT_DRAFT, CASE_PRINCIPAL } from '../data/mockData.js'

export default function StepDocument({ onConfirm, done }) {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const generate = async () => {
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 1400))
    setGenerating(false)
    setGenerated(true)
  }

  return (
    <section>
      <div className="panel-eyebrow">STEP 4 · Draft Generation</div>
      <h1 className="panel-title">生成申請書</h1>
      <p className="panel-lede">
        Agent 依已驗證的證據草擬申請書，並逐一標註引用的證據來源，方便本人與承辦人員逐項核對。
        <br />
        <span style={{ color: 'var(--slate-faint)', fontSize: 12.5 }}>
          （本 Demo 以預先準備之草稿模擬生成流程，未呼叫外部 AI API）
        </span>
      </p>

      {!generated ? (
        <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
          <button className="btn btn--primary" onClick={generate} disabled={generating}>
            {generating ? 'Agent 正在草擬申請書…' : '請 Agent 草擬申請書'}
          </button>
        </div>
      ) : (
        <div className="doc-paper">
          <h3>{DOCUMENT_DRAFT.title}</h3>
          <div className="doc-field">
            <span className="doc-field__label">申請人</span>
            <span>{DOCUMENT_DRAFT.applicant}</span>
          </div>
          <div className="doc-field">
            <span className="doc-field__label">相對人</span>
            <span>{DOCUMENT_DRAFT.respondent}</span>
          </div>
          <div className="doc-field">
            <span className="doc-field__label">爭議類型</span>
            <span>{DOCUMENT_DRAFT.disputeType}</span>
          </div>
          <div className="doc-body-text">{DOCUMENT_DRAFT.summary}</div>
          <div className="doc-field" style={{ alignItems: 'flex-start' }}>
            <span className="doc-field__label">請求事項</span>
            <span>
              {DOCUMENT_DRAFT.requestedRemedy.map((r, i) => (
                <div key={i}>・{r}</div>
              ))}
            </span>
          </div>
          <div className="doc-field" style={{ alignItems: 'flex-start' }}>
            <span className="doc-field__label">引用證據</span>
            <span>
              {DOCUMENT_DRAFT.evidenceRefs.map((r, i) => (
                <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  {r}
                </div>
              ))}
            </span>
          </div>
        </div>
      )}

      <div className="step-actions">
        <button className="btn btn--primary" onClick={onConfirm} disabled={!generated || done}>
          {done ? '草稿已完成 ✓' : '確認草稿，進入核准與送出'}
        </button>
      </div>
    </section>
  )
}
