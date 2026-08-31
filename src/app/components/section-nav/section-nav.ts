import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GuideSection } from '../../models/guide.model';
import { Glyph } from '../glyph/glyph';

/** Плитки-ссылки на разделы: содержание памятки в начале страницы. */
@Component({
  selector: 'app-section-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Glyph],
  templateUrl: './section-nav.html',
  styleUrl: './section-nav.css',
})
export class SectionNav {
  readonly sections = input.required<GuideSection[]>();

  numberOf(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
