import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Первый экран: кто сделал памятку, о чём она и куда идти дальше. */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  readonly sectionCount = input.required<number>();
  readonly searchOpen = output<void>();
}
