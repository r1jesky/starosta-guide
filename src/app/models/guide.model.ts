/**
 * Модель контента памятки.
 *
 * Весь текст сайта живёт в `src/app/data/guide-data.ts` в виде типизированных
 * блоков. Компоненты только отрисовывают эти блоки — чтобы поправить текст,
 * править вёрстку не нужно.
 */

/** Простой параграф. */
export interface TextBlock {
  kind: 'text';
  text: string;
}

/** Крупный вводный абзац в начале раздела. */
export interface LeadBlock {
  kind: 'lead';
  text: string;
}

/** Маркированный или нумерованный список. */
export interface ListBlock {
  kind: 'list';
  ordered?: boolean;
  items: string[];
}

/** Пошаговый алгоритм: номер + заголовок шага + необязательное пояснение. */
export interface StepsBlock {
  kind: 'steps';
  items: Step[];
}

export interface Step {
  title: string;
  note?: string;
}

/** Термин и его расшифровка («Лекция — преподаватель говорит…»). */
export interface DefsBlock {
  kind: 'defs';
  items: Definition[];
}

export interface Definition {
  term: string;
  text: string;
}

/** Таблица. Строка либо содержит ячейки, либо является заголовком группы. */
export interface TableBlock {
  kind: 'table';
  head: string[];
  rows: TableRow[];
  note?: string;
}

export interface TableRow {
  cells?: string[];
  group?: string;
}

/** Карточки с контактами: подразделение, вопрос, адрес, связь. */
export interface CardsBlock {
  kind: 'cards';
  items: ContactCard[];
}

export interface ContactCard {
  title: string;
  subtitle?: string;
  lines: CardLine[];
}

export interface CardLine {
  label: string;
  value: string;
  href?: string;
}

/** Одна или несколько картинок с подписями. */
export interface GalleryBlock {
  kind: 'gallery';
  columns?: 1 | 2;
  items: Figure[];
}

export interface Figure {
  src: string;
  alt: string;
  caption?: string;
  /**
   * Собственные размеры файла в пикселях. Нужны, чтобы браузер заранее
   * зарезервировал место под картинку: иначе вёрстка прыгает при загрузке
   * и ссылки-якоря промахиваются мимо своего раздела.
   */
  width?: number;
  height?: number;
}

/** Выноска: важное замечание или подсказка. */
export interface CalloutBlock {
  kind: 'callout';
  tone: 'info' | 'warn';
  title?: string;
  text: string;
}

/** Набор внешних ссылок. */
export interface LinksBlock {
  kind: 'links';
  items: LinkItem[];
}

export interface LinkItem {
  label: string;
  href: string;
  note?: string;
}

/** Набор «тегов» — например, направления студенческих объединений. */
export interface TagsBlock {
  kind: 'tags';
  items: string[];
}

/** Хронология: год + событие. */
export interface TimelineBlock {
  kind: 'timeline';
  items: TimelineItem[];
}

export interface TimelineItem {
  year: string;
  text: string;
}

export type Block =
  | TextBlock
  | LeadBlock
  | ListBlock
  | StepsBlock
  | DefsBlock
  | TableBlock
  | CardsBlock
  | GalleryBlock
  | CalloutBlock
  | LinksBlock
  | TagsBlock
  | TimelineBlock;

/** Раздел памятки — один якорь в одностраничном лендинге. */
export interface GuideSection {
  /** Якорь в адресной строке, например `study` → `#study`. */
  id: string;
  /** Короткое название для меню и плиток. */
  title: string;
  /** Подзаголовок плитки в навигации. */
  teaser: string;
  /** Имя геометрического значка (см. section-nav / guide-section). */
  glyph: GlyphName;
  blocks: Block[];
}

export type GlyphName =
  | 'book'
  | 'check'
  | 'pause'
  | 'pulse'
  | 'coin'
  | 'door'
  | 'map'
  | 'screen'
  | 'route'
  | 'shield'
  | 'people'
  | 'clock';
