import { useState, useEffect, useCallback } from 'react'

const API_BASE = 'https://bible.helloao.org/api'

export const TRANSLATIONS = [
  { id: 'eng_kjv', label: 'EN' },
  { id: 'swe_fol', label: 'SV' },
]

export const UI_TEXT = {
  eng_kjv: {
    chooseBook: 'Choose a',
    book: 'book',
    oldTestament: 'Old Testament',
    newTestament: 'New Testament',
    chapters: 'chapters',
    chapter: 'Ch',
    verse: 'Vs',
    swipeHint: 'swipe up for next verse',
    noVerses: 'No verses found',
    backToBooks: 'All books',
    verse: "Verse"
  },
  swe_fol: {
    chooseBook: 'Välj en',
    book: 'bok',
    oldTestament: 'Gamla testamentet',
    newTestament: 'Nya testamentet',
    chapters: 'kapitel',
    chapter: 'Kap',
    verse: 'Vers',
    swipeHint: 'svep uppåt för nästa vers',
    noVerses: 'Inga verser hittades',
    backToBooks: 'Alla böcker',
    verse: "Vers"
  },
}

export const OT_BOOKS = [
  'GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT',
  '1SA','2SA','1KI','2KI','1CH','2CH','EZR','NEH',
  'EST','JOB','PSA','PRO','ECC','SNG','ISA','JER',
  'LAM','EZE','DAN','HOS','JOL','AMO','OBA','JON',
  'MIC','NAM','HAB','ZEP','HAG','ZEC','MAL',
]

export const NT_BOOKS = [
  'MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO',
  'GAL','EPH','PHP','COL','1TH','2TH','1TI','2TI',
  'TIT','PHM','HEB','JAS','1PE','2PE','1JN','2JN',
  '3JN','JUD','REV',
]

function extractVerses(content) {
  const verses = []
  for (const item of content) {
    if (item.type === 'verse') {
      const text = extractText(item.content || [])
      if (text) verses.push({ number: item.number, text })
    }
  }
  return verses
}

function extractText(parts) {
  return parts.map(part => {
    if (typeof part === 'string') return part
    if (part?.type === 'footnote') return ''
    if (part?.text) return part.text
    if (Array.isArray(part?.content)) return extractText(part.content)
    return ''
  }).join('').replace(/\s+/g, ' ').trim()
}

function getVerses(data) {
  const content = data.chapter?.content
  if (Array.isArray(content) && content.length > 0) {
    const extracted = extractVerses(content)
    if (extracted.length > 0) return extracted
  }
  const verses = data.chapter?.verses
  if (Array.isArray(verses) && verses.length > 0) {
    return verses.map(v => ({ number: v.number, text: v.text || '' }))
  }
  return []
}

export function useBible() {
  const [translation, setTranslation] = useState('eng_kjv')
  const [books, setBooks] = useState([])
  const [verses, setVerses] = useState([])
  const [versesLoading, setVersesLoading] = useState(false)
  const [currentBookId, setCurrentBookId] = useState(null)
  const [currentChapter, setCurrentChapter] = useState(null)

  // Fetch book list whenever translation changes
  useEffect(() => {
    fetch(`${API_BASE}/${translation}/books.json`)
      .then(r => r.json())
      .then(d => setBooks(d.books || []))
      .catch(() => {})
  }, [translation])

  // Re-fetch verses whenever translation, book, or chapter changes
  useEffect(() => {
    if (!currentBookId || !currentChapter) return
    setVersesLoading(true)
    setVerses([])
    fetch(`${API_BASE}/${translation}/${currentBookId}/${currentChapter}.json`)
      .then(r => r.json())
      .then(d => setVerses(getVerses(d)))
      .catch(() => setVerses([]))
      .finally(() => setVersesLoading(false))
  }, [translation, currentBookId, currentChapter])

  // Setting book/chapter triggers the useEffect above to fetch
  const loadChapter = useCallback((bookId, chapter) => {
    setCurrentBookId(bookId)
    setCurrentChapter(chapter)
  }, [])

  return {
    translation, setTranslation,
    books,
    verses, versesLoading,
    loadChapter,
  }
}
