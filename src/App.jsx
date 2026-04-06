import { useState, useEffect } from 'react'
import { useBible, TRANSLATIONS, UI_TEXT } from './hooks/useBible'
import BookSelect from './components/BookSelect'
import VerseReader from './components/VerseReader'

const STORAGE_KEY = 'verse-app-state'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveState(patch) {
  try {
    const current = loadSaved() || {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }))
  } catch {}
}

export default function App() {
  const saved = loadSaved()

  const [view, setView] = useState('books')
  const [selectedBookId, setSelectedBookId] = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [showContinue, setShowContinue] = useState(!!saved?.bookId)

  const {
    translation, setTranslation,
    books,
    verses, versesLoading,
    loadChapter,
  } = useBible(saved?.translation)

  const selectedBook = books.find(b => b.id === selectedBookId) ?? null
  const t = UI_TEXT[translation]

  function handleBookSelect(book) {
    setSelectedBookId(book.id)
    setSelectedChapter(1)
    loadChapter(book.id, 1)
    setView('verses')
    saveState({ bookId: book.id, chapter: 1, verseIndex: 0 })
  }

  function handleChapterChange(chapter) {
    setSelectedChapter(chapter)
    loadChapter(selectedBookId, chapter)
    saveState({ bookId: selectedBookId, chapter, verseIndex: 0 })
  }

  function handleVerseChange(verseIndex) {
    saveState({ verseIndex })
  }

  function handleTranslationChange(id) {
    setTranslation(id)
    saveState({ translation: id })
  }

  function handleContinue() {
    if (!saved?.bookId) return
    setSelectedBookId(saved.bookId)
    setSelectedChapter(saved.chapter || 1)
    loadChapter(saved.bookId, saved.chapter || 1)
    setView('verses')
    setShowContinue(false)
  }

  // Resolve continue card book name from live books list
  const continueBook = saved?.bookId ? books.find(b => b.id === saved.bookId) : null

  return (
    <div className="h-full flex flex-col bg-cream-100 max-w-lg mx-auto relative">
      {/* Translation toggle */}
      <div className="absolute top-6 right-5 z-10 flex items-center bg-cream-200/70 rounded-full p-0.5 gap-0.5">
        {TRANSLATIONS.map(tr => (
          <button
            key={tr.id}
            onClick={() => handleTranslationChange(tr.id)}
            className={`
              px-3 py-1 rounded-full text-xs font-sans font-medium transition-all duration-200
              ${translation === tr.id
                ? 'bg-olive-500 text-cream-50 shadow-sm'
                : 'text-ink-500/50 hover:text-ink-700'
              }
            `}
          >
            {tr.label}
          </button>
        ))}
      </div>

      {view === 'books' && (
        <BookSelect
          books={books}
          translation={translation}
          onSelect={handleBookSelect}
          continueBook={showContinue ? continueBook : null}
          continueChapter={saved?.chapter}
          continueVerseIndex={saved?.verseIndex}
          onContinue={handleContinue}
          onDismissContinue={() => setShowContinue(false)}
        />
      )}

      {view === 'verses' && selectedBook && (
        <VerseReader
          book={selectedBook}
          chapter={selectedChapter}
          totalChapters={selectedBook.numberOfChapters}
          verses={verses}
          loading={versesLoading}
          translation={translation}
          initialVerseIndex={
            // Only use saved verse index on first load into the saved position
            selectedBookId === saved?.bookId && selectedChapter === saved?.chapter
              ? (saved?.verseIndex ?? 0)
              : 0
          }
          onBack={() => setView('books')}
          onChapterChange={handleChapterChange}
          onVerseChange={handleVerseChange}
        />
      )}
    </div>
  )
}
