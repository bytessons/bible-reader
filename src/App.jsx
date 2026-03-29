import { useState } from 'react'
import { useBible, TRANSLATIONS } from './hooks/useBible'
import BookSelect from './components/BookSelect'
import VerseReader from './components/VerseReader'

export default function App() {
  const [view, setView] = useState('books')
  const [selectedBookId, setSelectedBookId] = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(1)

  const {
    translation, setTranslation,
    books,
    verses, versesLoading,
    loadChapter,
  } = useBible()

  // Derive live book from books array so name updates with translation
  const selectedBook = books.find(b => b.id === selectedBookId) ?? null

  function handleBookSelect(book) {
    setSelectedBookId(book.id)
    setSelectedChapter(1)
    loadChapter(book.id, 1)
    setView('verses')
  }

  function handleChapterChange(chapter) {
    setSelectedChapter(chapter)
    loadChapter(selectedBookId, chapter)
  }

  return (
    <div className="h-full flex flex-col bg-cream-100 max-w-lg mx-auto relative">
      {/* Translation toggle */}
      <div className="absolute top-6 right-5 z-10 flex items-center bg-cream-200/70 rounded-full p-0.5 gap-0.5">
        {TRANSLATIONS.map(tr => (
          <button
            key={tr.id}
            onClick={() => setTranslation(tr.id)}
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
          onBack={() => setView('books')}
          onChapterChange={handleChapterChange}
        />
      )}
    </div>
  )
}
