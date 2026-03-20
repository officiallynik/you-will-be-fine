import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const moods = [
  { emoji: '😰', value: 1 },
  { emoji: '😟', value: 2 },
  { emoji: '😐', value: 3 },
  { emoji: '🙂', value: 4 },
  { emoji: '😊', value: 5 },
]

const journalPrompts = [
  "What's taking up the most space in your mind today?",
  "Describe how you're feeling, without judgment.",
  "What does your body feel like right now?",
  "What do you need most in this moment?",
  "Write freely — this space is just for you.",
]

function getTodayKey() {
  return new Date().toDateString()
}

function loadJournal() {
  try {
    return JSON.parse(localStorage.getItem('journal') || '[]')
  } catch {
    return []
  }
}

function saveJournal(entries) {
  localStorage.setItem('journal', JSON.stringify(entries))
}

export default function Journal() {
  const [entries, setEntries] = useState(() => loadJournal())
  const [selectedMood, setSelectedMood] = useState(null)
  const [journalText, setJournalText] = useState('')
  const [gratitudes, setGratitudes] = useState(['', '', ''])
  const [saved, setSaved] = useState(false)
  const [showPast, setShowPast] = useState(false)

  const todayKey = getTodayKey()
  const todayEntry = entries.find(e => e.date === todayKey)
  const pastEntries = entries.filter(e => e.date !== todayKey)

  // Get a rotating prompt
  const promptIdx = (new Date().getDate() + new Date().getMonth() * 5) % journalPrompts.length
  const prompt = journalPrompts[promptIdx]

  // Load today's entry if it exists
  useEffect(() => {
    if (todayEntry) {
      setSelectedMood(todayEntry.mood || null)
      setJournalText(todayEntry.text || '')
      setGratitudes(todayEntry.gratitudes || ['', '', ''])
    }
  }, [])

  function handleMoodSelect(value) {
    setSelectedMood(value)
    setSaved(false)
  }

  function handleSave() {
    const updatedEntries = entries.filter(e => e.date !== todayKey)
    const newEntry = {
      date: todayKey,
      mood: selectedMood,
      text: journalText,
      gratitudes,
    }
    const all = [newEntry, ...updatedEntries]
    setEntries(all)
    saveJournal(all)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function updateGratitude(i, val) {
    setGratitudes(prev => {
      const next = [...prev]
      next[i] = val
      return next
    })
    setSaved(false)
  }

  const today = new Date()
  const dateDisplay = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="page journal-page">
      <div className="page-header">
        <Link to="/" className="back-btn">←</Link>
        <div className="page-header-text">
          <h2 className="page-header-title">Journal</h2>
          <p className="page-header-sub">A safe space, just for you</p>
        </div>
      </div>

      {/* Today's entry card */}
      <div className="journal-today-card">
        <div className="journal-date-label">✦ {dateDisplay}</div>

        {/* Mood */}
        <p className="journal-section-title">How are you feeling today?</p>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
          {moods.map(m => (
            <button
              key={m.value}
              onClick={() => handleMoodSelect(m.value)}
              style={{
                flex: 1,
                padding: '10px 4px',
                background: selectedMood === m.value ? 'var(--purple-100)' : 'var(--bg-2)',
                border: selectedMood === m.value ? '2px solid var(--purple-400)' : '2px solid var(--purple-100)',
                borderRadius: 'var(--radius-md)',
                fontSize: '1.4rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              aria-label={`Mood ${m.value}`}
            >
              {m.emoji}
            </button>
          ))}
        </div>

        {/* Free write */}
        <p className="journal-section-title" style={{ marginTop: '20px' }}>Write freely</p>
        <textarea
          value={journalText}
          onChange={e => { setJournalText(e.target.value); setSaved(false) }}
          placeholder={prompt}
          rows={5}
        />

        {/* Gratitude */}
        <p className="journal-section-title">3 things I'm grateful for today</p>
        <div className="gratitude-inputs">
          {gratitudes.map((g, i) => (
            <div key={i} className="gratitude-row">
              <div className="gratitude-num">{i + 1}</div>
              <input
                type="text"
                value={g}
                onChange={e => updateGratitude(i, e.target.value)}
                placeholder={
                  i === 0 ? 'Something small, like a warm drink…' :
                  i === 1 ? 'A person who makes me feel safe…' :
                  'Something about today, however tiny…'
                }
                style={{ padding: '10px 14px', fontSize: '0.9rem', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          ))}
        </div>

        {/* Save button */}
        <div className="journal-save-btn">
          <button
            className="btn btn-primary w-full"
            onClick={handleSave}
          >
            {saved ? '✓ Saved' : '💾 Save entry'}
          </button>
          {saved && <p className="journal-saved-msg">✨ Entry saved — your feelings matter.</p>}
        </div>
      </div>

      {/* Past entries toggle */}
      {pastEntries.length > 0 && (
        <div className="past-entries-section">
          <button
            className="w-full"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0 12px' }}
            onClick={() => setShowPast(!showPast)}
          >
            <span className="section-title" style={{ marginBottom: 0 }}>
              Past entries ({pastEntries.length})
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {showPast ? '▲ Hide' : '▼ Show'}
            </span>
          </button>

          {showPast && pastEntries.map(entry => {
            const moodEntry = moods.find(m => m.value === entry.mood)
            const filledGratitudes = (entry.gratitudes || []).filter(g => g.trim())
            return (
              <div key={entry.date} className="past-entry-card">
                <div className="past-entry-header">
                  <span className="past-entry-date">{entry.date}</span>
                  {moodEntry && <span className="past-entry-mood">{moodEntry.emoji}</span>}
                </div>
                {entry.text && (
                  <p className="past-entry-preview">{entry.text}</p>
                )}
                {filledGratitudes.length > 0 && (
                  <div className="past-entry-gratitudes">
                    {filledGratitudes.map((g, i) => (
                      <span key={i} className="gratitude-tag">✨ {g}</span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {pastEntries.length === 0 && (
        <div className="no-entries">
          <p>Your journey starts with today's entry 🌱</p>
        </div>
      )}
    </div>
  )
}
