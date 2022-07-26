import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksPage } from './bookmarks.page';

describe('BookmarksPage', () => {
  let component: BookmarksPage;
  let fixture: ComponentFixture<BookmarksPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookmarksPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookmarksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
