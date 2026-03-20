import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

const TECHNIQUES = {
  heart: {
    label: 'Heart',
    name: 'Heart Release',
    desc: 'Eases chest & heart heaviness',
    phases: [
      { name: 'inhale', label: 'Breathe In', duration: 5, scale: 1.0, colorLight: '#F9C8DC', color: '#D97AA0', glow: 'rgba(217,122,160,0.18)', glow2: 'rgba(217,122,160,0.07)', ring1: '14px', ring2: '28px', msg: 'Breathe warm light into your chest…' },
      { name: 'hold', label: 'Feel', duration: 3, scale: 1.0, colorLight: '#FCE588', color: '#D4B040', glow: 'rgba(212,176,64,0.18)', glow2: 'rgba(212,176,64,0.07)', ring1: '14px', ring2: '28px', msg: 'Place your hand on your heart…' },
      { name: 'exhale', label: 'Release', duration: 7, scale: 0.58, colorLight: '#B8DECA', color: '#68A878', glow: 'rgba(104,168,120,0.18)', glow2: 'rgba(104,168,120,0.07)', ring1: '10px', ring2: '20px', msg: 'Let the heaviness melt away…' },
    ],
  },
  '478': {
    label: '4-7-8',
    name: 'Calm & Sleep',
    desc: 'Activates your parasympathetic system',
    phases: [
      { name: 'inhale', label: 'Breathe In', duration: 4, scale: 1.0, colorLight: '#D4C3F0', color: '#9B7EC8', glow: 'rgba(155,126,200,0.18)', glow2: 'rgba(155,126,200,0.07)', ring1: '14px', ring2: '28px', msg: 'Fill your lungs slowly and completely…' },
      { name: 'hold', label: 'Hold', duration: 7, scale: 1.0, colorLight: '#FCE588', color: '#D4B040', glow: 'rgba(212,176,64,0.18)', glow2: 'rgba(212,176,64,0.07)', ring1: '14px', ring2: '28px', msg: 'Hold gently — feel the stillness…' },
      { name: 'exhale', label: 'Breathe Out', duration: 8, scale: 0.58, colorLight: '#B8DECA', color: '#68A878', glow: 'rgba(104,168,120,0.18)', glow2: 'rgba(104,168,120,0.07)', ring1: '10px', ring2: '20px', msg: 'Let everything go… slowly… completely…' },
    ],
  },
  box: {
    label: 'Box',
    name: 'Box Breathing',
    desc: 'Used by Navy SEALs for calm focus',
    phases: [
      { name: 'inhale', label: 'Breathe In', duration: 4, scale: 1.0, colorLight: '#D4C3F0', color: '#9B7EC8', glow: 'rgba(155,126,200,0.18)', glow2: 'rgba(155,126,200,0.07)', ring1: '14px', ring2: '28px', msg: 'Inhale steadily for 4…' },
      { name: 'hold-in', label: 'Hold', duration: 4, scale: 1.0, colorLight: '#FCE588', color: '#D4B040', glow: 'rgba(212,176,64,0.18)', glow2: 'rgba(212,176,64,0.07)', ring1: '14px', ring2: '28px', msg: 'Hold at the top…' },
      { name: 'exhale', label: 'Breathe Out', duration: 4, scale: 0.58, colorLight: '#B8DECA', color: '#68A878', glow: 'rgba(104,168,120,0.18)', glow2: 'rgba(104,168,120,0.07)', ring1: '10px', ring2: '20px', msg: 'Release slowly and fully…' },
      { name: 'hold-out', label: 'Hold', duration: 4, scale: 0.58, colorLight: '#D8E8FF', color: '#5890D8', glow: 'rgba(88,144,216,0.18)', glow2: 'rgba(88,144,216,0.07)', ring1: '10px', ring2: '20px', msg: 'Rest at the bottom…' },
    ],
  },
//   calm: {
//     label: '4-6',
//     name: 'Quick Calm',
//     desc: 'Simple & effective, anytime',
//     phases: [
//       { name: 'inhale', label: 'Breathe In', duration: 4, scale: 1.0, colorLight: '#D4C3F0', color: '#9B7EC8', glow: 'rgba(155,126,200,0.18)', glow2: 'rgba(155,126,200,0.07)', ring1: '14px', ring2: '28px', msg: 'Breathe in through your nose…' },
//       { name: 'exhale', label: 'Breathe Out', duration: 6, scale: 0.58, colorLight: '#B8DECA', color: '#68A878', glow: 'rgba(104,168,120,0.18)', glow2: 'rgba(104,168,120,0.07)', ring1: '10px', ring2: '20px', msg: 'Softly out through your mouth…' },
//     ],
//   },
}

export default function Breathe() {
  const [techniqueKey, setTechniqueKey] = useState('heart')
  const [isActive, setIsActive] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [count, setCount] = useState(0)
  const [cycles, setCycles] = useState(0)
  const orbRef = useRef(null)
  const timerRef = useRef(null)

  const technique = TECHNIQUES[techniqueKey]
  const phases = technique.phases
  const currentPhase = phases[phaseIdx]

  const applyOrbStyle = useCallback((phase) => {
    if (!orbRef.current) return
    const el = orbRef.current
    el.style.setProperty('--orb-scale', phase.scale)
    el.style.setProperty('--orb-duration', `${phase.duration}s`)
    el.style.setProperty('--orb-color-light', phase.colorLight)
    el.style.setProperty('--orb-color', phase.color)
    el.style.setProperty('--orb-glow', phase.glow)
    el.style.setProperty('--orb-glow2', phase.glow2)
    el.style.setProperty('--orb-ring1', phase.ring1)
    el.style.setProperty('--orb-ring2', phase.ring2)
  }, [])

  // Apply initial orb style
  useEffect(() => {
    applyOrbStyle(currentPhase)
  }, [currentPhase, applyOrbStyle])

  // Timer loop
  useEffect(() => {
    if (!isActive) return

    // Start phase
    applyOrbStyle(currentPhase)
    setCount(currentPhase.duration)

    timerRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          // Advance phase
          setPhaseIdx(pi => {
            const next = (pi + 1) % phases.length
            if (next === 0) setCycles(c => c + 1)
            return next
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [isActive, phaseIdx, techniqueKey])

  function handleStart() {
    setIsActive(true)
    setPhaseIdx(0)
    setCount(phases[0].duration)
    setCycles(0)
  }

  function handleStop() {
    setIsActive(false)
    clearInterval(timerRef.current)
    setPhaseIdx(0)
    setCount(0)
    // Reset orb to resting state
    if (orbRef.current) {
      const el = orbRef.current
      el.style.setProperty('--orb-scale', '0.6')
      el.style.setProperty('--orb-duration', '1s')
      el.style.setProperty('--orb-color-light', '#D4C3F0')
      el.style.setProperty('--orb-color', '#9B7EC8')
      el.style.setProperty('--orb-glow', 'rgba(155,126,200,0.15)')
      el.style.setProperty('--orb-glow2', 'rgba(155,126,200,0.06)')
      el.style.setProperty('--orb-ring1', '10px')
      el.style.setProperty('--orb-ring2', '20px')
    }
  }

  function changeTechnique(key) {
    if (isActive) handleStop()
    setTechniqueKey(key)
    setCycles(0)
  }

  const techniqueDescriptions = {
    '478': 'Inhale for 4 · Hold for 7 · Exhale for 8',
    box: 'Inhale 4 · Hold 4 · Exhale 4 · Hold 4',
    calm: 'Inhale for 4 · Exhale for 6',
    heart: 'Breathe light into your heart, release what is heavy',
  }

  return (
    <div className="page breathe-page">
      <div className="page-header">
        <Link to="/" className="back-btn" aria-label="Go back">←</Link>
        <div className="page-header-text">
          <h2 className="page-header-title">Breathe</h2>
          <p className="page-header-sub">Follow the orb — let it guide you</p>
        </div>
      </div>

      {/* Technique selector */}
      <div className="technique-selector">
        {Object.entries(TECHNIQUES).map(([key, t]) => (
          <button
            key={key}
            className={`technique-tab ${techniqueKey === key ? 'active' : ''}`}
            onClick={() => changeTechnique(key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="breathing-scene">
        {/* The animated orb */}
        <div className="orb-container">
          <div className="orb-ring" />
          <div className="orb-ring" />
          <div className="breathing-orb" ref={orbRef}>
            {isActive ? (
              <>
                <span className="orb-phase-label">{currentPhase.label}</span>
                <span className="orb-count">{count || currentPhase.duration}</span>
              </>
            ) : (
              <span className="orb-tap-hint">Tap to begin</span>
            )}
          </div>
        </div>

        {/* Message */}
        <p className="breathing-message" key={`${phaseIdx}-${isActive}`}>
          {isActive ? currentPhase.msg : `${technique.name} — ${technique.desc}`}
        </p>

        {/* Start / Stop button */}
        {isActive ? (
          <button className="btn btn-ghost" onClick={handleStop}>
            ✕ Stop
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleStart}>
            ✦ Begin
          </button>
        )}

        {/* Completed cycles */}
        {cycles > 0 && (
          <div className="cycles-display">
            {Array.from({ length: cycles }).map((_, i) => (
              <div key={i} className="cycle-dot" />
            ))}
            <span className="cycles-label">
              {cycles} {cycles === 1 ? 'cycle' : 'cycles'} complete ✓
            </span>
          </div>
        )}

        {/* Info panel */}
        <div className="breathe-info">
          <span className="breathe-info-icon">
            {techniqueKey === 'heart' ? '🫀' : '💨'}
          </span>
          <div className="breathe-info-text">
            <strong>{technique.name}</strong><br />
            {techniqueDescriptions[techniqueKey]}
          </div>
        </div>

        {techniqueKey === 'heart' && (
          <div className="breathe-info" style={{ border: '1px solid var(--rose-200)', background: 'var(--rose-50)' }}>
            <span className="breathe-info-icon">🤲</span>
            <div className="breathe-info-text" style={{ color: 'var(--rose-400)' }}>
              Place one hand gently over your heart. As you exhale, imagine the heaviness dissolving like fog in sunlight.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
