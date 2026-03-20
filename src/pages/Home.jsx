import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dailyAffirmations } from '../data/affirmations'

const moods = [
  { emoji: '😰', label: 'Very anxious', value: 1 },
  { emoji: '😟', label: 'Anxious', value: 2 },
  { emoji: '😐', label: 'Okay', value: 3 },
  { emoji: '🙂', label: 'Better', value: 4 },
  { emoji: '😊', label: 'Good', value: 5 },
]

const features = [
  {
    path: '/breathe',
    emoji: '🌬️',
    title: 'Breathe',
    desc: 'Slow your breath, calm your heart',
    gradient: 'linear-gradient(135deg, #D4C3F0 0%, #B89EE0 100%)',
    shadow: '0 4px 20px rgba(155, 126, 200, 0.32)',
  },
  {
    path: '/ground',
    emoji: '🌿',
    title: 'Ground',
    desc: '5-4-3-2-1 sensory anchoring',
    gradient: 'linear-gradient(135deg, #B8DECA 0%, #90C8A0 100%)',
    shadow: '0 4px 20px rgba(90, 154, 120, 0.3)',
  },
  {
    path: '/reframe',
    emoji: '💭',
    title: 'Heart Talk',
    desc: 'Gently reframe heavy thoughts',
    gradient: 'linear-gradient(135deg, #F9C8DC 0%, #E8A8C0 100%)',
    shadow: '0 4px 20px rgba(217, 122, 160, 0.3)',
  },
  {
    path: '/journal',
    emoji: '📖',
    title: 'Journal',
    desc: 'Write it out, let it go',
    gradient: 'linear-gradient(135deg, #FCE588 0%, #F0D060 100%)',
    shadow: '0 4px 20px rgba(212, 168, 0, 0.25)',
  },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour > 6 && hour < 12) return { text: 'Good morning,', sub: 'Take it one breath at a time today ☀️' }
  if (hour >= 12 && hour < 17) return { text: 'Good afternoon,', sub: "You're doing better than you think 🌸" }
  if (hour >= 17 && hour < 21) return { text: 'Good evening,', sub: 'You made it through another day 🌙' }
  return { text: 'Good night,', sub: "It's okay to rest now — tomorrow is new 🌟" }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Home() {
  const [selectedMood, setSelectedMood] = useState(null)
  const [moodSaved, setMoodSaved] = useState(false)
  const greeting = getGreeting()

  const today = new Date()
  const affirmationIndex = getRandomIntInclusive(0, dailyAffirmations.length - 1)
  const affirmation = dailyAffirmations[affirmationIndex]

  useEffect(() => {
    const todayKey = today.toDateString()
    const saved = localStorage.getItem(`mood-${todayKey}`)
    if (saved) {
      setSelectedMood(parseInt(saved))
      setMoodSaved(true)
    }
  }, [])

  function selectMood(value) {
    setSelectedMood(value)
    const todayKey = new Date().toDateString()
    localStorage.setItem(`mood-${todayKey}`, value)
    setTimeout(() => setMoodSaved(true), 300)
  }

  const moodMessages = {
    1: "I see you. You don't have to be okay right now 💙",
    2: "Thank you for checking in — let's take care of you 🌸",
    3: "You're doing alright — that's enough 💜",
    4: "So glad to hear it, keep going 🌿",
    5: "Your light is showing. Cherish this 💛",
  }

  return (
    <div className="page home-page">
      {/* Ambient background orbs */}
      <div className="home-bg">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <div className="home-content">
        {/* Greeting */}
        <div className="home-header">
          <div className="greeting-text">{greeting.text}</div>
          <div className="greeting-name">beautiful ✨</div>
          <p className="greeting-sub">{greeting.sub}</p>
        </div>

        {/* Daily affirmation */}
        <div className="affirmation-card">
          {/* <div className="affirmation-label">✦ Today's affirmation</div> */}
          <p className="affirmation-text">"{affirmation}"</p>
        </div>

        {/* Mood check-in */}
        <div className="mood-section">
          <div className="section-title">How are you feeling right now?</div>
          <div className="mood-grid">
            {moods.map(mood => (
              <button
                key={mood.value}
                className={`mood-btn ${selectedMood === mood.value ? 'selected' : ''}`}
                onClick={() => selectMood(mood.value)}
                aria-label={mood.label}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>
          {moodSaved && selectedMood && (
            <p className="mood-saved">{moodMessages[selectedMood]}</p>
          )}
        </div>

        {/* Feature cards */}
        <div className="features-section">
          <div className="section-title">Tools for you</div>
          <div className="features-grid">
            {features.map((f, i) => (
              <Link
                key={f.path}
                to={f.path}
                className="feature-card"
                style={{
                  background: f.gradient,
                  boxShadow: f.shadow,
                  animationDelay: `${i * 0.07}s`,
                }}
              >
                <div className="feature-emoji">{f.emoji}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="home-footer">
          <p>💜 You are not alone in this. You will be fine.</p>
        </div>
      </div>
    </div>
  )
}
