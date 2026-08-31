import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { GuideSection } from '../../models/guide.model';
import { Glyph } from '../glyph/glyph';

/**
 * Отрисовывает один раздел памятки: шапку с номером и значком плюс
 * последовательность блоков из `section.blocks`.
 */
@Component({
  selector: 'app-guide-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Glyph],
  templateUrl: './guide-section.html',
  styleUrl: './guide-section.css',
})
export class GuideSectionView {
  readonly section = input.required<GuideSection>();
  readonly index = input.required<number>();

  readonly number = computed(() => String(this.index() + 1).padStart(2, '0'));
}
