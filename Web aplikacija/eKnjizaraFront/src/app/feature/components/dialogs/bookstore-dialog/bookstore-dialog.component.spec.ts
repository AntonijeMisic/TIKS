import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookstoreDialogComponent } from './bookstore-dialog.component';

describe('BookstoreDialogComponent', () => {
  let component: BookstoreDialogComponent;
  let fixture: ComponentFixture<BookstoreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookstoreDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookstoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
