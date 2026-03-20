import { useState } from 'react'
import { Link } from 'react-router-dom'

const steps = [
  {
    number: 5,
    sense: 'See',
    icon: '👁️',
    count: 5,
    instruction: 'Look around you. Name 5 things you can see. They can be anything — a color, an object, a shadow, a light.',
    placeholder: (i) => `Something I can see #${i + 1}…`,
    color: 'var(--purple-400)',
    bg: 'var(--purple-50)',
  },
  {
    number: 4,
    sense: 'Touch',
    icon: '✋',
    count: 4,
    instruction: 'Notice 4 things you can physically feel. The texture of your clothes, the ground beneath you, the air on your skin…',
    placeholder: (i) => `Something I can feel #${i + 1}…`,
    color: 'var(--rose-400)',
    bg: 'var(--rose-50)',
  },
  {
    number: 3,
    sense: 'Hear',
    icon: '👂',
    count: 3,
    instruction: 'Listen carefully. What are 3 sounds around you? Maybe distant traffic, your breath, a fan, birds, silence itself.',
    placeholder: (i) => `Something I can hear #${i + 1}…`,
    color: 'var(--sage-500)',
    bg: 'var(--sage-50)',
  },
  {
    number: 2,
    sense: 'Smell',
    icon: '👃',
    count: 2,
    instruction: 'Notice 2 scents — in the air around you, or recall two comforting smells you love.',
    placeholder: (i) => i === 0 ? 'A scent I notice or love…' : 'Another scent…',
    color: 'var(--gold-400)',
    bg: 'var(--gold-50)',
  },
  {
    number: 1,
    sense: 'Taste',
    icon: '👅',
    count: 1,
    instruction: 'What is 1 thing you can taste right now? Even if it\'s just the neutral taste of your mouth.',
    placeholder: () => 'Something I can taste…',
    color: 'var(--purple-600)',
    bg: 'var(--purple-100)',
  },
]

export default function Ground() {
  const [stepIdx, setStepIdx] = useState(0)
  const [answers, setAnswers] = useState(steps.map(s => Array(s.count).fill('')))
  const [done, setDone] = useState(false)

  const step = steps[stepIdx]
  const stepAnswers = answers[stepIdx]
  const allFilled = stepAnswers.every(a => a.trim().length > 0)

  function updateAnswer(stepI, itemI, value) {
    setAnswers(prev => {
      const next = prev.map(arr => [...arr])
      next[stepI][itemI] = value
      return next
    })
  }

  function handleNext() {
    if (stepIdx < steps.length - 1) {
      setStepIdx(stepIdx + 1)
    } else {
      setDone(true)
    }
  }

  function handlePrev() {
    if (stepIdx > 0) setStepIdx(stepIdx - 1)
  }

  function handleRestart() {
    setStepIdx(0)
    setAnswers(steps.map(s => Array(s.count).fill('')))
    setDone(false)
  }

  if (done) {
    return (
      <div className="page ground-page">
        <div className="page-header">
          <Link to="/" className="back-btn">←</Link>
          <div className="page-header-text">
            <h2 className="page-header-title">Ground</h2>
            <p className="page-header-sub">5-4-3-2-1 sensory technique</p>
          </div>
        </div>

        <div className="ground-complete">
          <div className="complete-icon">🌿</div>
          <h2 className="complete-title">You're back.</h2>
          <p className="complete-text">
            You are here. You are safe. Your senses have returned you to this moment.
          </p>
          <div
            style={{
              background: 'linear-gradient(135deg, var(--purple-50), var(--sage-50))',
              border: '1px solid var(--purple-200)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              width: '100%',
              maxWidth: '340px',
            }}
          >
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: 'var(--purple-700)', textAlign: 'center', fontSize: '1rem', lineHeight: '1.7' }}>
              "The present moment is the only place where life exists."
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={handleRestart}>
              ↺ Do it again
            </button>
            <Link to="/breathe" className="btn btn-ghost">
              🌬️ Now breathe
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page ground-page">
      <div className="page-header">
        <Link to="/" className="back-btn">←</Link>
        <div className="page-header-text">
          <h2 className="page-header-title">Ground</h2>
          <p className="page-header-sub">Anchor yourself to this moment</p>
        </div>
      </div>

      {/* Step progress */}
      <div className="ground-step-indicator">
        <span className="ground-step-text">
          Step <span className="ground-step-count">{stepIdx + 1}</span> of {steps.length}
        </span>
        <div className="progress-dots">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`progress-dot ${i === stepIdx ? 'active' : i < stepIdx ? 'done' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Sense card */}
      <div className="sense-card" key={stepIdx}>
        <div className="sense-big-number">{step.number}</div>
        <span className="sense-icon">{step.icon}</span>
        <h3 className="sense-title">Things you can {step.sense}</h3>
        <p className="sense-instruction">{step.instruction}</p>

        <div className="sense-inputs">
          {stepAnswers.map((val, i) => (
            <div key={i} className="sense-input-row">
              <div className={`sense-input-number ${val.trim() ? 'filled' : ''}`}>
                {val.trim() ? '✓' : i + 1}
              </div>
              <input
                type="text"
                className={`sense-input-field ${val.trim() ? 'filled' : ''}`}
                value={val}
                onChange={e => updateAnswer(stepIdx, i, e.target.value)}
                placeholder={step.placeholder(i)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && i < stepAnswers.length - 1) {
                    e.target.closest('.sense-input-row').nextSibling?.querySelector('input')?.focus()
                  }
                }}
                disabled={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="ground-nav-buttons">
        {stepIdx > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={handlePrev}>
            ← Back
          </button>
        )}
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!allFilled}
          style={{ opacity: allFilled ? 1 : 0.5 }}
        >
          {stepIdx < steps.length - 1 ? 'Next →' : 'Complete ✓'}
        </button>
      </div>

      {!allFilled && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '12px' }}>
          Fill in all items to continue — take your time 💜
        </p>
      )}
    </div>
  )
}
