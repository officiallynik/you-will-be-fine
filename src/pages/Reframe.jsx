import { useState } from 'react'
import { Link } from 'react-router-dom'
import { heartAffirmations } from '../data/affirmations'

const TOTAL_STEPS = 3

export default function Reframe() {
  const [step, setStep] = useState(0)
  const [thought, setThought] = useState('')
  const [truthSlider, setTruthSlider] = useState(80)
  const [friendAdvice, setFriendAdvice] = useState('')
  const [savedToJournal, setSavedToJournal] = useState(false)

  // Pick a heart affirmation based on current day
  const today = new Date()
  const idx = (today.getDate() + today.getMonth() * 7) % heartAffirmations.length
  const finalAffirmation = heartAffirmations[idx]

  function handleSaveToJournal() {
    const todayKey = today.toDateString()
    const existing = JSON.parse(localStorage.getItem('journal') || '[]')
    const entry = existing.find(e => e.date === todayKey)
    const reframeNote = `Anxious thought: "${thought}"\n\nWhat I'd tell a friend: "${friendAdvice}"`
    if (entry) {
      entry.reframe = reframeNote
    } else {
      existing.unshift({ date: todayKey, mood: 2, text: reframeNote, gratitudes: ['', '', ''] })
    }
    localStorage.setItem('journal', JSON.stringify(existing))
    setSavedToJournal(true)
  }

  function restart() {
    setStep(0)
    setThought('')
    setTruthSlider(80)
    setFriendAdvice('')
    setSavedToJournal(false)
  }

  const canProceed = [
    thought.trim().length > 5,
    true,
    friendAdvice.trim().length > 5,
  ]

  return (
    <div className="page reframe-page">
      <div className="page-header">
        <Link to="/" className="back-btn">←</Link>
        <div className="page-header-text">
          <h2 className="page-header-title">Heart Talk</h2>
          <p className="page-header-sub">Gently shift what weighs on you</p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="progress-dots" style={{ marginBottom: '20px' }}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i === step && step < TOTAL_STEPS ? 'active' : i < step ? 'done' : ''}`}
          />
        ))}
      </div>

      {/* STEP 0 — Name the thought */}
      {step === 0 && (
        <div className="reframe-card">
          <span className="reframe-step-emoji">🫀</span>
          <h3 className="reframe-step-title">What's weighing on your heart?</h3>
          <p className="reframe-step-desc">
            Write the thought that's making you feel anxious or heavy. Name it without judgment.
            Getting it out of your head and onto the page is the first step to release.
          </p>
          <textarea
            value={thought}
            onChange={e => setThought(e.target.value)}
            placeholder="Something like: 'I'm going to fail' or 'Something bad will happen' or 'I'm not enough'…"
            rows={4}
          />
          {thought.trim().length > 5 && (
            <div className="reframe-insight" style={{ marginTop: '16px' }}>
              <p className="reframe-insight-text">
                You named it. That took courage. Now let's look at it gently, together.
              </p>
            </div>
          )}
        </div>
      )}

      {/* STEP 1 — Examine truth */}
      {step === 1 && (
        <div className="reframe-card">
          <span className="reframe-step-emoji">🔍</span>
          <h3 className="reframe-step-title">Let's look at it gently</h3>
          <p className="reframe-step-desc">
            Your thought was: <em style={{ color: 'var(--purple-600)' }}>"{thought}"</em>
          </p>

          <div className="slider-container">
            <div className="slider-label">
              <span className="slider-label-text">How true does this feel right now?</span>
              <span className="slider-value">{truthSlider}%</span>
            </div>
            <input
              type="range"
              min={0} max={100}
              value={truthSlider}
              onChange={e => setTruthSlider(parseInt(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Not at all</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Completely</span>
            </div>
          </div>

          <div className="reframe-insight">
            <p className="reframe-insight-text">
              {truthSlider >= 80
                ? `It feels very real right now — anxiety has a way of making thoughts feel like facts. But a feeling of certainty isn't the same as truth.`
                : truthSlider >= 50
                ? `You feel ${truthSlider}% certain — that gap is important. Part of you knows this thought might not be the whole picture.`
                : `You already sense (${100 - truthSlider}%) that this thought isn't fully true. That's your wisdom speaking.`}
            </p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: '600' }}>
              Can you think of one small thing that might be okay, even right now?
            </p>
            <input
              type="text"
              placeholder="Even something tiny counts — 'I am breathing. I am here.'"
              style={{ fontSize: '0.9rem' }}
            />
          </div>
        </div>
      )}

      {/* STEP 2 — Compassionate reframe */}
      {step === 2 && (
        <div className="reframe-card">
          <span className="reframe-step-emoji">💌</span>
          <h3 className="reframe-step-title">Talk to yourself like someone you love</h3>
          <p className="reframe-step-desc">
            If your best friend came to you with this exact thought — <em style={{ color: 'var(--purple-600)' }}>"{thought}"</em> — what would you gently say to her?
          </p>
          <textarea
            value={friendAdvice}
            onChange={e => setFriendAdvice(e.target.value)}
            placeholder="I would tell her… 'You're not alone in this. You've handled hard things before and…'"
            rows={5}
          />
          {friendAdvice.trim().length > 5 && (
            <div className="reframe-insight" style={{ marginTop: '16px' }}>
              <p className="reframe-insight-text">
                Now read what you just wrote — and know that you deserve those same words too. 💜
              </p>
            </div>
          )}
        </div>
      )}

      {/* FINAL — Affirmation */}
      {step === 3 && (
        <div className="final-affirmation-card">
          <span className="affirmation-big-emoji">💜</span>

          {friendAdvice.trim() && (
            <>
              <p style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--purple-500)', marginBottom: '8px' }}>
                Your own wisdom, for you
              </p>
              <div className="affirmation-your-words">
                "{friendAdvice}"
              </div>
            </>
          )}

          <p style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--purple-500)', marginBottom: '8px' }}>
            And remember
          </p>
          <p className="affirmation-final-text">"{finalAffirmation}"</p>

          <div className="affirmation-final-actions">
            {!savedToJournal ? (
              <button className="btn btn-primary btn-sm" onClick={handleSaveToJournal}>
                📖 Save to journal
              </button>
            ) : (
              <p style={{ color: 'var(--sage-500)', fontWeight: '700', fontSize: '0.88rem' }}>✓ Saved to journal</p>
            )}
            <Link to="/breathe" className="btn btn-ghost btn-sm">
              🌬️ Now breathe
            </Link>
            <button className="btn btn-sage btn-sm" onClick={restart}>
              ↺ New thought
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      {step < 3 && (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '8px' }}>
          {step > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={() => setStep(s => s - 1)}>
              ← Back
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed[step]}
            style={{ opacity: canProceed[step] ? 1 : 0.5 }}
          >
            {step === 2 ? 'See your truth →' : 'Continue →'}
          </button>
        </div>
      )}

      {step < 3 && !canProceed[step] && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '12px' }}>
          Take your time — there's no rush here 💜
        </p>
      )}
    </div>
  )
}
