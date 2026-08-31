import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
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

  readonly theme = this.themeService.theme;
  readonly logoSrc = computed(() =>
    this.theme() === 'dark' ? 'assets/logo-dark.png' : 'assets/logo.png',
  );

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
