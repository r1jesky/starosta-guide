import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  signal,
  viewChildren,
} from '@angular/core';
import { GUIDE_SECTIONS } from './data/guide-data';
import { GuideSectionView } from './components/guide-section/guide-section';
import { Hero } from './components/hero/hero';
import { SearchPanel } from './components/search-panel/search-panel';
import { SectionNav } from './components/section-nav/section-nav';
import { SiteFooter } from './components/site-footer/site-footer';
import { SiteHeader } from './components/site-header/site-header';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeader, Hero, SectionNav, GuideSectionView, SearchPanel, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class App implements AfterViewInit, OnDestroy {
  readonly sections = GUIDE_SECTIONS;

  readonly searchOpen = signal(false);
  readonly activeId = signal<string | null>(null);

  private readonly sectionRefs = viewChildren<ElementRef<HTMLElement>>('sectionAnchor');
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.jumpToHash();

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    // Подсвечиваем в шапке тот раздел, который сейчас в верхней части экрана.
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible) {
          this.activeId.set(visible.target.id);
        }
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: 0 },
    );

    for (const ref of this.sectionRefs()) {
      this.observer.observe(ref.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  /**
   * Ссылка вида .../#money открывается сразу на нужном разделе. Прокрутку
   * приходится повторить после полной загрузки: карты кампуса подгружаются
   * лениво и сдвигают вёрстку уже после первого перехода.
   */
  private jumpToHash(): void {
    const id = decodeURIComponent(location.hash.replace('#', ''));
    if (!id) {
      return;
    }

    const jump = () => document.getElementById(id)?.scrollIntoView({ behavior: 'auto' });

    jump();
    if (document.readyState === 'complete') {
      setTimeout(jump, 60);
    } else {
      window.addEventListener('load', () => setTimeout(jump, 60), { once: true });
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.searchOpen()) {
      this.searchOpen.set(false);
      return;
    }

    const target = event.target as HTMLElement | null;
    const typingInField =
      target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

    if (!typingInField && (event.key === '/' || (event.key === 'k' && (event.metaKey || event.ctrlKey)))) {
      event.preventDefault();
      this.searchOpen.set(true);
    }
  }
}
