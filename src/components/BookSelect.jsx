import { OT_BOOKS, NT_BOOKS, UI_TEXT } from '../hooks/useBible'

export default function BookSelect({
  books, translation, onSelect,
  continueBook, continueChapter, continueVerseIndex,
  onContinue, onDismissContinue,
}) {
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
          {book.numberOfChapters}{t.chapters.slice(0, 2)}
        </span>
        <span
          className="font-serif text-sm text-ink-800 leading-snug mt-1 break-words hyphens-auto"
          lang={translation === 'swe_fol' ? 'sv' : 'en'}
        >
          {book.name}
        </span>
      </button>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-5 pt-8 pb-4 shrink-0">
        <p className="text-[10px] font-sans font-medium tracking-[3px] uppercase text-olive-500/70 mb-1">Verse</p>
        <h1 className="font-serif text-3xl text-ink-900">
          {t.chooseBook} <span className="italic">{t.book}</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
        {/* Continue card */}
        {continueBook && (
          <div className="mb-5 bg-olive-700 rounded-2xl p-4 flex items-center justify-between gap-3">
            <button onClick={onContinue} className="flex items-center gap-3 flex-1 text-left active:opacity-70">
              <div className="w-8 h-8 rounded-lg bg-olive-600 flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="#faf4e6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-sans text-olive-300/70 uppercase tracking-widest mb-0.5">
                  {translation === 'swe_fol' ? 'Fortsätt där du slutade' : 'Continue reading'}
                </p>
                <p className="font-serif text-sm text-cream-100 italic">
                  {continueBook.name}
                  <span className="font-sans not-italic text-olive-300/80 text-xs ml-2">
                    {translation === 'swe_fol' ? 'Kap' : 'Ch'} {continueChapter}
                    {continueVerseIndex > 0 && ` · ${translation === 'swe_fol' ? 'Vers' : 'Vs'} ${continueVerseIndex + 1}`}
                  </span>
                </p>
              </div>
            </button>
            <button
              onClick={onDismissContinue}
              className="text-olive-400/60 hover:text-olive-300 transition-colors shrink-0 p-1"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}

        {/* OT */}
        <div className="mb-6">
          <p className="text-[10px] font-sans font-medium tracking-[2px] uppercase text-ink-500/40 mb-3">{t.oldTestament}</p>
          <div className="grid grid-cols-3 gap-2">
            {OT_BOOKS.map(id => <BookCard key={id} id={id} />)}
          </div>
        </div>

        {/* NT */}
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
