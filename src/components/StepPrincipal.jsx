import React from 'react'
import { CASE_PRINCIPAL, AUTHORIZATION } from '../data/mockData.js'

export default function StepPrincipal({ onConfirm, done }) {
  return (
    <section>
      <div className="panel-eyebrow">STEP 1 · Principal &amp; Authorization</div>
      <h1 className="panel-title">身份與授權設定</h1>
      <p className="panel-lede">
        在 Agent 開始行動之前，先明確定義它「代表誰」、「被允許做什麼」以及「授權何時失效」。
        這份授權書本身就是後續所有動作是否合法的依據。
      </p>

      <div className="card">
        <div className="card__title">代表對象（Principal）</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.9 }}>
          <div><strong>{CASE_PRINCIPAL.name}</strong>（{CASE_PRINCIPAL.idMasked}）</div>
          <div style={{ color: 'var(--slate)' }}>{CASE_PRINCIPAL.role}・任職於 {CASE_PRINCIPAL.employer}</div>
          <div style={{ color: 'var(--slate-faint)', fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 4 }}>
            案件編號　{CASE_PRINCIPAL.caseId}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__title">授權範圍（Authorization Scope）</div>
        {AUTHORIZATION.scope.map((s) => (
          <div className="scope-row" key={s.action}>
            <span className={`tag ${s.allowed ? 'tag--allow' : 'tag--deny'}`}>
              {s.allowed ? '允許' : '禁止'}
            </span>
            <div>
              {s.action}
              {s.note && <span className="scope-row__note">{s.note}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card__title">授權效期（Expiry）</div>
        <div style={{ fontSize: 13.5 }}>
          自 <strong>{AUTHORIZATION.grantedAt}</strong> 起生效，
          <strong> {AUTHORIZATION.expiresAt}</strong> 自動失效（效期 {AUTHORIZATION.durationLabel}）。
          委任人亦可隨時於右側面板手動撤銷。
        </div>
      </div>

      <div className="step-actions">
        <button className="btn btn--primary" onClick={onConfirm} disabled={done}>
          {done ? '已建立授權 ✓' : '確認並建立此案件的 Agent 授權'}
        </button>
      </div>
    </section>
  )
}
