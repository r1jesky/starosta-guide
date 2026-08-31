import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

/** Подвал: кто собрал памятку и куда писать, если что-то устарело. */
@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.css',
})
export class SiteFooter {
  private readonly themeService = inject(ThemeService);

  readonly year = new Date().getFullYear();
  readonly logoSrc = computed(() =>
    this.themeService.theme() === 'dark' ? 'assets/logo-dark.png' : 'assets/logo.png',
  );
}
