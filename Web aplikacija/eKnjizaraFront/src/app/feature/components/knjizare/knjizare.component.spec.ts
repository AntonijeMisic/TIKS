import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnjizareComponent } from './knjizare.component';

describe('KnjizareComponent', () => {
  let component: KnjizareComponent;
  let fixture: ComponentFixture<KnjizareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnjizareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KnjizareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
