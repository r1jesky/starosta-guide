import { Injectable } from '@angular/core';
import { GUIDE_SECTIONS } from '../data/guide-data';
import { Block, GuideSection } from '../models/guide.model';

/** Один кусочек текста памятки, по которому умеет искать поиск. */
export interface SearchEntry {
  sectionId: string;
  sectionTitle: string;
  heading: string;
  text: string;
  haystack: string;
}

export interface SearchResult extends SearchEntry {
  /** Заголовок и текст, разрезанные на части с пометкой совпадений. */
  headingParts: HighlightPart[];
  parts: HighlightPart[];
  score: number;
}

export interface HighlightPart {
  text: string;
  hit: boolean;
}

const MAX_RESULTS = 24;
const SNIPPET_RADIUS = 90;

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly index: SearchEntry[] = buildIndex(GUIDE_SECTIONS);

  search(rawQuery: string): SearchResult[] {
    const query = rawQuery.trim().toLowerCase();
    if (query.length < 2) {
      return [];
    }

    const words = query.split(/\s+/).filter(Boolean);
    const results: SearchResult[] = [];

    for (const entry of this.index) {
      if (!words.every((word) => entry.haystack.includes(word))) {
        continue;
      }

      const position = entry.haystack.indexOf(words[0]);
      const snippet = makeSnippet(entry.text, entry.text.toLowerCase().indexOf(words[0]));

      results.push({
        ...entry,
        headingParts: highlight(entry.heading, words),
        parts: highlight(snippet, words),
        score: (entry.heading.toLowerCase().includes(words[0]) ? 0 : 1000) + Math.max(position, 0),
      });
    }

    return results.sort((a, b) => a.score - b.score).slice(0, MAX_RESULTS);
  }
}

function buildIndex(sections: GuideSection[]): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const section of sections) {
    push(entries, section, section.title, section.teaser);

    for (const block of section.blocks) {
      for (const fragment of flatten(block)) {
        push(entries, section, fragment.heading, fragment.text);
      }
    }
  }

  return entries;
}

function push(
  entries: SearchEntry[],
  section: GuideSection,
  heading: string,
  text: string,
): void {
  const clean = text.trim();
  if (!clean) {
    return;
  }

  entries.push({
    sectionId: section.id,
    sectionTitle: section.title,
    heading: heading.trim() || section.title,
    text: clean,
    haystack: `${heading} ${clean}`.toLowerCase(),
  });
}

interface Fragment {
  heading: string;
  text: string;
}

/** Разворачивает блок в набор «заголовок + текст» для поискового индекса. */
function flatten(block: Block): Fragment[] {
  switch (block.kind) {
    case 'text':
    case 'lead':
      return [{ heading: '', text: block.text }];

    case 'list':
      return block.items.map((item) => ({ heading: '', text: item }));

    case 'steps':
      return block.items.map((step, i) => ({
        heading: `Шаг ${i + 1}. ${step.title}`,
        text: step.note ?? step.title,
      }));

    case 'defs':
      return block.items.map((item) => ({ heading: item.term, text: item.text }));

    case 'table':
      return block.rows
        .filter((row) => row.cells?.length)
        .map((row) => ({ heading: row.cells![0], text: row.cells!.slice(1).join(' · ') }));

    case 'cards':
      return block.items.map((card) => ({
        heading: card.title,
        text: [card.subtitle, ...card.lines.map((line) => `${line.label}: ${line.value}`)]
          .filter(Boolean)
          .join(' · '),
      }));

    case 'gallery':
      return block.items.map((figure) => ({
        heading: figure.alt,
        text: figure.caption ?? figure.alt,
      }));

    case 'callout':
      return [{ heading: block.title ?? '', text: block.text }];

    case 'links':
      return block.items.map((link) => ({ heading: link.label, text: link.note ?? link.href }));

    case 'tags':
      return [{ heading: '', text: block.items.join(', ') }];

    case 'timeline':
      return block.items.map((item) => ({ heading: item.year, text: item.text }));
  }
}

function makeSnippet(text: string, position: number): string {
  if (text.length <= SNIPPET_RADIUS * 2 || position < 0) {
    return text;
  }

  const start = Math.max(0, position - SNIPPET_RADIUS);
  const end = Math.min(text.length, position + SNIPPET_RADIUS);

  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}

function highlight(text: string, words: string[]): HighlightPart[] {
  const pattern = words
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length)
    .join('|');

  if (!pattern) {
    return [{ text, hit: false }];
  }

  const splitter = new RegExp(`(${pattern})`, 'gi');
  const exact = new RegExp(`^(?:${pattern})$`, 'i');

  return text
    .split(splitter)
    .filter((chunk) => chunk.length > 0)
    .map((chunk) => ({ text: chunk, hit: exact.test(chunk) }));
}
