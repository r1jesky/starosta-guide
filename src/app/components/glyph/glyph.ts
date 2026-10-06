import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GlyphName } from '../../models/guide.model';

/**
 * Набор одинаково нарисованных геометрических значков разделов.
 * Иконки строятся на сетке 24×24 и наследуют цвет через `currentColor`.
 */
@Component({
  selector: 'app-glyph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'glyph' },
  styles: `
    .glyph {
      display: inline-flex;
    }
    svg {
      display: block;
      width: 100%;
      height: 100%;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.6;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `,
  template: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      @switch (name()) {
        @case ('book') {
          <path d="M4 5.5h6a2 2 0 0 1 2 2v11a2 2 0 0 0-2-2H4z" />
          <path d="M20 5.5h-6a2 2 0 0 0-2 2v11a2 2 0 0 1 2-2h6z" />
        }
        @case ('check') {
          <path d="M8.5 4.5h7a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2z" />
          <path d="M9.5 3.2h5v2.6h-5z" />
          <path d="M9.8 13.4l1.9 1.9 3.5-4" />
        }
        @case ('pause') {
          <circle cx="12" cy="12" r="8" />
          <path d="M10.2 9.4v5.2M13.8 9.4v5.2" />
        }
        @case ('lifebuoy') {
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3.5" />
          <path d="M6.3 6.3l3.2 3.2M17.7 6.3l-3.2 3.2M6.3 17.7l3.2-3.2M17.7 17.7l-3.2-3.2" />
        }
        @case ('pulse') {
          <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
          <path d="M6.5 12h3l1.5-3 2 6 1.5-3h3" />
        }
        @case ('coin') {
          <circle cx="12" cy="12" r="7.5" />
          <path d="M10 15.5V9h2.6a2.2 2.2 0 0 1 0 4.4H8.8" />
        }
        @case ('door') {
          <path d="M6.5 20V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14" />
          <path d="M4 20h16" />
          <circle cx="14.5" cy="12.5" r="1" />
        }
        @case ('map') {
          <path d="M3.5 6.8 9 4.5v12.7L3.5 19.5z" />
          <path d="M9 4.5l6 2.3v12.7L9 17.2z" />
          <path d="M15 6.8l5.5-2.3v12.7L15 19.5z" />
        }
        @case ('screen') {
          <rect x="3.5" y="4.5" width="17" height="12" rx="2.5" />
          <path d="M9 20h6M12 16.5V20" />
        }
        @case ('route') {
          <circle cx="6.5" cy="6.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
          <path d="M9 6.5h4.5a3.5 3.5 0 0 1 0 7h-3a3.5 3.5 0 0 0 0 7H15" stroke-dasharray="3 3" />
        }
        @case ('shield') {
          <path d="M12 3.5 19 6v6.2c0 3.6-2.7 6.6-7 8.3-4.3-1.7-7-4.7-7-8.3V6z" />
          <path d="M9.2 12.2l2 2 3.6-3.9" />
        }
        @case ('people') {
          <circle cx="9" cy="8.5" r="3" />
          <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
          <path d="M15.5 6.2a3 3 0 0 1 0 5.6" />
          <path d="M17 14.9c2 .6 3.5 2.4 3.5 4.6" />
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7.5V12l3 2" />
        }
      }
    </svg>
  `,
})
export class Glyph {
  readonly name = input.required<GlyphName>();
}
