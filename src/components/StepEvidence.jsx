import React, { useState } from 'react'
import { LINE_MESSAGES, ATTENDANCE_RECORDS } from '../data/mockData.js'

export default function StepEvidence({ onConfirm, done }) {
  const [collectedLine, setCollectedLine] = useState(false)
  const [collectedAttendance, setCollectedAttendance] = useState(false)
  const [collecting, setCollecting] = useState(false)

  const collect = async (setter, delay) => {
    setCollecting(true)
    await new Promise((r) => setTimeout(r, delay))
    setter(true)
    setCollecting(false)
  }

  const allCollected = collectedLine && collectedAttendance

  return (
    <section>
      <div className="panel-eyebrow">STEP 2 · Tool / Action</div>
      <h1 className="panel-title">Agent 蒐證</h1>
      <p className="panel-lede">
        Agent 僅能依授權範圍「讀取」以下兩類資料，且僅止於唯讀，不會修改任何原始紀錄。
        每一次讀取動作都會即時寫入右側的稽核鏈。
      </p>

      <div className="card">
        <div className="card__title">
          LINE 對話紀錄
          <span className={`tag ${collectedLine ? 'tag--allow' : 'tag--wait'}`}>
            {collectedLine ? '已讀取' : '待讀取'}
          </span>
        </div>
        {!collectedLine ? (
          <button className="btn btn--ghost" disabled={collecting} onClick={() => collect(setCollectedLine, 900)}>
            {collecting ? '讀取中…' : '授權 Agent 讀取 LINE 對話紀錄'}
          </button>
        ) : (
          <div>
            {LINE_MESSAGES.map((m) => (
              <div key={m.id} className={`message-bubble ${m.from === '王小明' ? 'me' : 'mgr'}`}>
                <div className="message-meta">{m.time}　{m.from}</div>
                {m.text}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card__title">
          出勤打卡資料
          <span className={`tag ${collectedAttendance ? 'tag--allow' : 'tag--wait'}`}>
            {collectedAttendance ? '已讀取' : '待讀取'}
          </span>
        </div>
        {!collectedAttendance ? (
          <button className="btn btn--ghost" disabled={collecting} onClick={() => collect(setCollectedAttendance, 900)}>
            {collecting ? '讀取中…' : '授權 Agent 讀取出勤打卡資料'}
          </button>
        ) : (
          <table className="evidence-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>上班</th>
                <th>下班</th>
                <th>申報加班</th>
                <th>備註</th>
              </tr>
            </thead>
            <tbody>
              {ATTENDANCE_RECORDS.map((r) => (
                <tr key={r.date}>
                  <td>{r.date}</td>
                  <td>{r.clockIn}</td>
                  <td>{r.clockOut}</td>
                  <td>{r.declaredOT} 小時</td>
                  <td style={{ color: 'var(--slate)' }}>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="step-actions">
        <button className="btn btn--primary" onClick={onConfirm} disabled={!allCollected || done}>
          {done ? '證據蒐集完成 ✓' : '確認證據並進入完整性驗證'}
        </button>
      </div>
    </section>
  )
}
