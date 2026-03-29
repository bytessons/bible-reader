import { OT_BOOKS, NT_BOOKS, UI_TEXT } from '../hooks/useBible'

export default function BookSelect({ books, translation, onSelect }) {
  const t = UI_TEXT[translation]
  const bookMap = {}
  books.forEach(b => { bookMap[b.id] = b })

  function BookCard({ id }) {
    const book = bookMap[id]
    if (!book) return null
    return (
      <button
        onClick={() => onSelect(book)}
        className="
          group bg-cream-50 border border-cream-200
          rounded-xl p-2.5 text-left
          hover:border-olive-400 hover:bg-white
          active:scale-95 transition-all duration-150
          flex flex-col justify-between min-h-[66px]
        "
      >
        <span className="font-sans text-[10px] text-olive-500/70 font-medium">
          {book.numberOfChapters} {t.chapters}
        </span>
        <span className="font-serif text-sm text-ink-800 leading-snug mt-1 break-words hyphens-auto" lang={translation === 'swe_fol' ? 'sv' : 'en'}>
          {book.name}
        </span>
      </button>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-5 pt-8 pb-4 shrink-0">
        <p className="text-[10px] font-sans font-medium tracking-[3px] uppercase text-olive-500/70 mb-1">{t.verse}</p>
        <h1 className="font-serif text-3xl text-ink-900">
          {t.chooseBook} <span className="italic">{t.book}</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
        <div className="mb-6">
          <p className="text-[10px] font-sans font-medium tracking-[2px] uppercase text-ink-500/40 mb-3">{t.oldTestament}</p>
          <div className="grid grid-cols-3 gap-2">
            {OT_BOOKS.map(id => <BookCard key={id} id={id} />)}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-sans font-medium tracking-[2px] uppercase text-ink-500/40 mb-3">{t.newTestament}</p>
          <div className="grid grid-cols-3 gap-2">
            {NT_BOOKS.map(id => <BookCard key={id} id={id} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
