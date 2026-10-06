import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { GuideSection } from '../../models/guide.model';
import { ThemeService } from '../../services/theme.service';

/** Липкая шапка: логотип, лента разделов, поиск и переключатель темы. */
@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
})
export class SiteHeader {
  readonly sections = input.required<GuideSection[]>();
  readonly activeId = input<string | null>(null);

  readonly searchOpen = output<void>();

  private readonly themeService = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);

  readonly theme = this.themeService.theme;
  readonly logoSrc = computed(() =>
    this.theme() === 'dark' ? 'assets/logo-dark.png' : 'assets/logo.png',
  );

  /*
   * Лента разделов шире экрана. На телефоне её листают пальцем, а на компьютере
   * полосы прокрутки нет и колесо мыши крутит страницу, а не ленту. Поэтому:
   * стрелки по краям, колесо мыши над лентой листает её вбок, а чип текущего
   * раздела сам подкручивается в зону видимости.
   */
  private readonly rail = viewChild<ElementRef<HTMLElement>>('rail');
  readonly canScrollLeft = signal(false);
  readonly canScrollRight = signal(false);

  constructor() {
    afterNextRender(() => {
      const el = this.rail()?.nativeElement;
      if (!el) {
        return;
      }

      this.updateArrows();
      // ширина чипов меняется, когда догружается шрифт
      document.fonts?.ready.then(() => this.updateArrows());

      if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(() => this.updateArrows());
        observer.observe(el);
        this.destroyRef.onDestroy(() => observer.disconnect());
      }
    });

    effect(() => {
      const id = this.activeId();
      if (id) {
        this.revealChip(id);
      }
    });
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  updateArrows(): void {
    const el = this.rail()?.nativeElement;
    if (!el) {
      return;
    }
    this.canScrollLeft.set(el.scrollLeft > 2);
    this.canScrollRight.set(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }

  /** Стрелка: прокрутить ленту примерно на две трети её ширины. */
  scrollRail(direction: -1 | 1): void {
    const el = this.rail()?.nativeElement;
    el?.scrollBy({ left: direction * el.clientWidth * 0.66, behavior: this.scrollBehavior() });
  }

  /**
   * Колесо мыши над лентой листает её вбок. Когда лента докручена до края,
   * колесо снова крутит страницу — чтобы курсор над шапкой не «застревал».
   * Горизонтальную прокрутку тачпадом браузер обрабатывает сам.
   */
  onWheel(event: WheelEvent): void {
    const el = this.rail()?.nativeElement;
    if (!el || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    const atStart = el.scrollLeft <= 0;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) {
      return;
    }

    el.scrollLeft += event.deltaY;
    event.preventDefault();
  }

  /** Подкручивает ленту так, чтобы чип активного раздела был виден целиком. */
  private revealChip(id: string): void {
    const el = this.rail()?.nativeElement;
    const chip = el?.querySelector<HTMLElement>(`[data-section="${id}"]`);
    if (!el || !chip) {
      return;
    }

    const rail = el.getBoundingClientRect();
    const box = chip.getBoundingClientRect();
    const margin = 48; // ширина затухания у края ленты

    if (box.left < rail.left + margin) {
      el.scrollBy({ left: box.left - rail.left - margin, behavior: this.scrollBehavior() });
    } else if (box.right > rail.right - margin) {
      el.scrollBy({ left: box.right - rail.right + margin, behavior: this.scrollBehavior() });
    }
  }

  private scrollBehavior(): ScrollBehavior {
    return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }
}
