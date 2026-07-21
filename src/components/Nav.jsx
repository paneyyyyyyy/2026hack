import React from 'react'
import { CASE_PRINCIPAL } from '../data/mockData.js'

export const STEP_LABELS = [
  '身份與授權設定',
  'Agent 蒐證',
  '完整性驗證',
  '生成申請書',
  '核准與送出',
  '稽核總覽與撤銷',
]

export default function Nav({ currentStep, maxUnlockedStep, onSelect, revoked }) {
  return (
    <nav className="case-nav">
      <div className="case-nav__brand">
        代辦人
        <span>TRUSTWORTHY LABOR-DISPUTE AGENT · DEMO</span>
      </div>
      <div className="case-nav__case">
        案件編號 {CASE_PRINCIPAL.caseId}
        <br />
        委任人　{CASE_PRINCIPAL.name}（{CASE_PRINCIPAL.idMasked}）
        <br />
        雇主　　{CASE_PRINCIPAL.employer}
      </div>
      <div className="case-nav__steps">
        {STEP_LABELS.map((label, idx) => {
          const locked = idx > maxUnlockedStep || revoked
          const active = idx === currentStep
          const done = idx < maxUnlockedStep || (idx <= maxUnlockedStep && idx < currentStep)
          return (
            <div
              key={label}
              className={[
                'nav-step',
                active ? 'active' : '',
                locked ? 'locked' : '',
                done && !active ? 'done' : '',
              ].join(' ')}
              onClick={() => !locked && onSelect(idx)}
            >
              <span className="nav-step__num">{done && !active ? '✓' : idx + 1}</span>
              <span>{label}</span>
            </div>
          )
        })}
      </div>
      <div className="case-nav__footer">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: '#8b93b3', lineHeight: 1.6 }}>
          本 Demo 全為虛構情境與合成資料，
          <br />
          不涉及真實個人或企業。
        </span>
      </div>
    </nav>
  )
}
