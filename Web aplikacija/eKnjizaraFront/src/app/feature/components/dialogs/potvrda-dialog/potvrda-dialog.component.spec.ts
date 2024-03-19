import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotvrdaDialogComponent } from './potvrda-dialog.component';

describe('PotvrdaDialogComponent', () => {
  let component: PotvrdaDialogComponent;
  let fixture: ComponentFixture<PotvrdaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PotvrdaDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PotvrdaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
