import React, { useRef, useState } from 'react'
import Nav, { STEP_LABELS } from './components/Nav.jsx'
import Ledger from './components/Ledger.jsx'
import StepPrincipal from './components/StepPrincipal.jsx'
import StepEvidence from './components/StepEvidence.jsx'
import StepIntegrity from './components/StepIntegrity.jsx'
import StepDocument from './components/StepDocument.jsx'
import StepApproval from './components/StepApproval.jsx'
import StepAudit from './components/StepAudit.jsx'
import { CASE_PRINCIPAL, LINE_MESSAGES, ATTENDANCE_RECORDS } from './data/mockData.js'
import { GENESIS_HASH, computeBlockHash, sha256Hex, verifyChain } from './data/hashChain.js'

function nowStamp() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0)
  const [stepDone, setStepDone] = useState([false, false, false, false, false, false])
  const [committedHashes, setCommittedHashes] = useState({ line: null, attendance: null })
  const [trackingId, setTrackingId] = useState(null)
  const [revoked, setRevoked] = useState(false)
  const [chainStatus, setChainStatus] = useState(null)
  const [verifying, setVerifying] = useState(false)

  const entriesRef = useRef([])
  const [entries, setEntries] = useState([])

  async function addEntry(action, payload, actor) {
    const prevHash = entriesRef.current.length ? entriesRef.current[entriesRef.current.length - 1].hash : GENESIS_HASH
    const timestamp = nowStamp()
    const hash = await computeBlockHash({ payload, prevHash, timestamp })
    const entry = { id: `b${entriesRef.current.length + 1}`, action, payload, actor, timestamp, prevHash, hash }
    entriesRef.current = [...entriesRef.current, entry]
    setEntries(entriesRef.current)
    return entry
  }

  const markDone = (idx) => setStepDone((prev) => prev.map((d, i) => (i === idx ? true : d)))
  const unlock = (idx) => setMaxUnlockedStep((m) => Math.max(m, idx))
  const goTo = (idx) => setCurrentStep(idx)

  const guardRevoked = () => {
    if (revoked) return true
    return false
  }

  const onStep1Confirm = async () => {
    if (guardRevoked()) return
    await addEntry('建立案件並設定 Agent 授權範圍（7 天效期）', { caseId: CASE_PRINCIPAL.caseId }, CASE_PRINCIPAL.name)
    markDone(0)
    unlock(1)
    goTo(1)
  }

  const onStep2Confirm = async () => {
    if (guardRevoked()) return
    const lineHash = await sha256Hex(JSON.stringify(LINE_MESSAGES))
    const attendanceHash = await sha256Hex(JSON.stringify(ATTENDANCE_RECORDS))
    setCommittedHashes({ line: lineHash, attendance: attendanceHash })
    await addEntry('讀取 LINE 對話紀錄（唯讀）', { hash: lineHash }, 'Agent')
    await addEntry('讀取出勤打卡資料（唯讀）', { hash: attendanceHash }, 'Agent')
    markDone(1)
    unlock(2)
    goTo(2)
  }

  const onStep3Confirm = async () => {
    if (guardRevoked()) return
    await addEntry('計算證據雜湊並比對完整性（通過）', committedHashes, 'Agent')
    markDone(2)
    unlock(3)
    goTo(3)
  }

  const onStep4Confirm = async () => {
    if (guardRevoked()) return
    await addEntry('依已驗證證據生成申請書草稿', { doc: '勞資爭議調解申請書' }, 'Agent')
    markDone(3)
    unlock(4)
    goTo(4)
  }

  const onSubmitApproved = async () => {
    if (guardRevoked()) return
    await addEntry('本人審閱並核准送出申請書', { approvedBy: CASE_PRINCIPAL.name }, CASE_PRINCIPAL.name)
    const tid = `MOL-2026-${Math.floor(100000 + Math.random() * 899999)}`
    setTrackingId(tid)
    await addEntry('送出申請書至勞工局調解窗口', { trackingId: tid }, 'Agent')
    markDone(4)
    unlock(5)
  }

  const onGoAudit = () => goTo(5)

  const onRevoke = async () => {
    await addEntry('本人撤銷 Agent 所有授權', { reason: '委任人手動撤銷' }, CASE_PRINCIPAL.name)
    setRevoked(true)
  }

  const onVerify = async () => {
    setVerifying(true)
    const result = await verifyChain(entriesRef.current)
    setChainStatus(result)
    setVerifying(false)
  }

  return (
    <div className="app-shell">
      <Nav currentStep={currentStep} maxUnlockedStep={maxUnlockedStep} onSelect={goTo} revoked={revoked} />

      <main className="case-main">
        {currentStep === 0 && <StepPrincipal onConfirm={onStep1Confirm} done={stepDone[0]} />}
        {currentStep === 1 && <StepEvidence onConfirm={onStep2Confirm} done={stepDone[1]} />}
        {currentStep === 2 && (
          <StepIntegrity committedHashes={committedHashes} onConfirm={onStep3Confirm} done={stepDone[2]} />
        )}
        {currentStep === 3 && <StepDocument onConfirm={onStep4Confirm} done={stepDone[3]} />}
        {currentStep === 4 && (
          <StepApproval onSubmit={onSubmitApproved} onNext={onGoAudit} done={stepDone[4]} trackingId={trackingId} />
        )}
        {currentStep === 5 && <StepAudit entries={entries} revoked={revoked} trackingId={trackingId} />}
      </main>

      <Ledger
        entries={entries}
        chainStatus={chainStatus}
        onVerify={onVerify}
        verifying={verifying}
        revoked={revoked}
        onRevoke={onRevoke}
      />
    </div>
  )
}
