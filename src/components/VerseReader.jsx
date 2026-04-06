import { useState, useRef, useEffect, useCallback } from 'react'
import { UI_TEXT } from '../hooks/useBible'

export default function VerseReader({
  book, chapter, totalChapters, verses, loading,
  onBack, onChapterChange, onVerseChange, translation,
  initialVerseIndex = 0,
}) {
  const t = UI_TEXT[translation]
  const [verseIndex, setVerseIndex] = useState(initialVerseIndex)
  const [editingVerse, setEditingVerse] = useState(false)
  const [editingChapter, setEditingChapter] = useState(false)
  const [jumpVerseVal, setJumpVerseVal] = useState('')
  const [jumpChapterVal, setJumpChapterVal] = useState('')
  const [animDir, setAnimDir] = useState(null)

  const touchStartY = useRef(null)
  const dragY = useRef(0)
  const isDragging = useRef(false)
  const cardRef = useRef(null)
  const verseInputRef = useRef(null)
  const chapterInputRef = useRef(null)
  const animating = useRef(false)

  // Reset to verse 1 whenever book or chapter changes
  useEffect(() => {
    setVerseIndex(initialVerseIndex)
    setAnimDir(null)
  }, [chapter, book])

  useEffect(() => {
    if (editingVerse && verseInputRef.current) {
      verseInputRef.current.focus()
      verseInputRef.current.select()
    }
  }, [editingVerse])

  useEffect(() => {
    if (editingChapter && chapterInputRef.current) {
      chapterInputRef.current.focus()
      chapterInputRef.current.select()
    }
  }, [editingChapter])

  const navigate = useCallback((dir) => {
    if (animating.current || loading) return
    if (dir === 'next') {
      if (verseIndex < verses.length - 1) {
        animating.current = true
        setAnimDir('up')
        setTimeout(() => {
          setVerseIndex(i => {
            const next = i + 1
            onVerseChange?.(next)
            return next
          })
          setAnimDir(null)
          animating.current = false
        }, 200)
      } else if (chapter < totalChapters) {
        onChapterChange(chapter + 1)
      }
    } else {
      if (verseIndex > 0) {
        animating.current = true
        setAnimDir('down')
        setTimeout(() => {
          setVerseIndex(i => {
            const prev = i - 1
            onVerseChange?.(prev)
            return prev
          })
          setAnimDir(null)
          animating.current = false
        }, 200)
      } else if (chapter > 1) {
        onChapterChange(chapter - 1)
      }
    }
  }, [verseIndex, verses.length, chapter, totalChapters, loading])

  function onTouchStart(e) {
    touchStartY.current = e.touches[0].clientY
    dragY.current = 0
    isDragging.current = true
  }

  function onTouchMove(e) {
    if (!isDragging.current) return
    const dy = e.touches[0].clientY - touchStartY.current
    dragY.current = dy
    if (cardRef.current) {
      cardRef.current.style.transform = `translateY(${dy * 0.25}px)`
      cardRef.current.style.opacity = `${1 - Math.abs(dy) / 350}`
    }
  }

  function onTouchEnd() {
    isDragging.current = false
    if (cardRef.current) {
      cardRef.current.style.transform = ''
      cardRef.current.style.opacity = ''
    }
    if (Math.abs(dragY.current) > 50) {
      navigate(dragY.current < 0 ? 'next' : 'prev')
    }
    dragY.current = 0
  }

  useEffect(() => {
    function onKey(e) {
      if (editingVerse || editingChapter) return
      if (e.key === 'ArrowDown') navigate('next')
      if (e.key === 'ArrowUp') navigate('prev')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, editingVerse, editingChapter])

  function handleVerseClick() {
    setJumpVerseVal(String(currentVerse?.number ?? ''))
    setEditingVerse(true)
  }

  function handleVerseSubmit(e) {
    e?.preventDefault()
    const target = parseInt(jumpVerseVal)
    if (!isNaN(target)) {
      const idx = verses.findIndex(v => v.number === target)
      if (idx !== -1) { setVerseIndex(idx); onVerseChange?.(idx) }
    }
    setEditingVerse(false)
  }

  function handleChapterClick() {
    setJumpChapterVal(String(chapter))
    setEditingChapter(true)
  }

  function handleChapterSubmit(e) {
    e?.preventDefault()
    const target = parseInt(jumpChapterVal)
    if (!isNaN(target) && target >= 1 && target <= totalChapters) {
      onChapterChange(target)
    }
    setEditingChapter(false)
  }

  const currentVerse = verses[verseIndex]

  const inputClass = `
    w-12 text-center font-sans text-sm font-medium text-olive-600
    bg-transparent border-b border-olive-400 outline-none
    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
    [&::-webkit-inner-spin-button]:appearance-none
  `

  return (
    <div
      className="h-full flex flex-col select-none overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Top bar */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-olive-500 text-sm font-sans hover:text-olive-600 transition-colors active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t.backToBooks}
        </button>
      </div>

      {/* Book name + Ch/Vs navigation */}
      <div className="px-5 pb-3 shrink-0">
        <h2 className="font-serif text-xl text-ink-900 italic mb-2">{book.name}</h2>
        <div className="flex items-center gap-4">

          {/* Chapter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-sans text-ink-500/50">{t.chapter}</span>
            {editingChapter ? (
              <form onSubmit={handleChapterSubmit}>
                <input
                  ref={chapterInputRef}
                  type="number"
                  value={jumpChapterVal}
                  onChange={e => setJumpChapterVal(e.target.value)}
                  onBlur={handleChapterSubmit}
                  min={1} max={totalChapters}
                  className={inputClass}
                />
              </form>
            ) : (
              <button onClick={handleChapterClick} className="font-sans text-sm font-medium text-olive-500 hover:text-olive-600 transition-colors px-2 py-0.5 rounded-lg hover:bg-olive-500/10">
                {chapter}
              </button>
            )}
          </div>

          <span className="text-ink-300/50 text-xs">·</span>

          {/* Verse */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-sans text-ink-500/50">{t.verse}</span>
            {editingVerse ? (
              <form onSubmit={handleVerseSubmit}>
                <input
                  ref={verseInputRef}
                  type="number"
                  value={jumpVerseVal}
                  onChange={e => setJumpVerseVal(e.target.value)}
                  onBlur={handleVerseSubmit}
                  min={1} max={verses.length}
                  className={inputClass}
                />
              </form>
            ) : (
              <button onClick={handleVerseClick} className="font-sans text-sm font-medium text-olive-500 hover:text-olive-600 transition-colors px-2 py-0.5 rounded-lg hover:bg-olive-500/10">
                {currentVerse?.number ?? '–'}
              </button>
            )}
          </div>

          <span className="text-ink-300/50 text-xs">·</span>
          <span className="text-xs font-sans text-ink-400/40">{verseIndex + 1}/{verses.length}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-cream-300/60 shrink-0 mb-1" />

      {/* Verse */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 overflow-hidden">
        {loading ? (
          <div className="w-5 h-5 border-2 border-olive-300/40 border-t-olive-500 rounded-full animate-spin" />
        ) : !currentVerse ? (
          <p className="text-sm font-sans text-ink-500/40">{t.noVerses}</p>
        ) : (
          <div
            ref={cardRef}
            className={`w-full max-w-sm transition-all duration-200 ease-out ${
              animDir === 'up'   ? 'opacity-0 -translate-y-6' :
              animDir === 'down' ? 'opacity-0 translate-y-6'  :
                                   'opacity-100 translate-y-0'
            }`}
          >
            <p className="font-serif text-xl leading-relaxed text-ink-800 text-center">
              {currentVerse.text}
            </p>
          </div>
        )}
      </div>

      {/* Swipe hint */}
      <div className="px-5 pb-8 flex justify-center shrink-0">
        {verseIndex === 0 && verses.length > 1 && !loading && (
          <p className="text-[10px] font-sans text-ink-400/30 tracking-wide animate-pulse">
            {t.swipeHint}
          </p>
        )}
      </div>
    </div>
  )
}
