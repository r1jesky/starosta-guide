import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { SearchResult, SearchService } from '../../services/search.service';

/** Модальный поиск по всему тексту памятки. */
@Component({
  selector: 'app-search-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-panel.html',
  styleUrl: './search-panel.css',
})
export class SearchPanel {
  readonly open = input.required<boolean>();
  readonly closed = output<void>();

  private readonly search = inject(SearchService);
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  readonly query = signal('');
  readonly results = computed<SearchResult[]>(() => this.search.search(this.query()));
  readonly hasQuery = computed(() => this.query().trim().length >= 2);

  constructor() {
    effect(() => {
      if (this.open()) {
        // ждём, пока панель появится в DOM
        queueMicrotask(() => this.field()?.nativeElement.focus());
      } else {
        this.query.set('');
      }
    });
  }

  onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  goTo(result: SearchResult): void {
    this.closed.emit();
    // даём панели закрыться, иначе прокрутка происходит под оверлеем
    setTimeout(() => {
      document.getElementById(result.sectionId)?.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', `#${result.sectionId}`);
    }, 40);
  }
}
