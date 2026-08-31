import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { GUIDE_SECTIONS } from './data/guide-data';

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });

  it('создаётся', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('показывает заголовок памятки', () => {
    const heading = fixture.nativeElement.querySelector('h1') as HTMLElement;
    expect(heading.textContent).toContain('Памятка');
  });

  it('отрисовывает якорь для каждого раздела', () => {
    for (const section of GUIDE_SECTIONS) {
      expect(fixture.nativeElement.querySelector(`#${section.id}`)).toBeTruthy();
    }
  });

  it('у всех разделов уникальные идентификаторы', () => {
    const ids = GUIDE_SECTIONS.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
