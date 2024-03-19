import { TestBed } from '@angular/core/testing';

import { KnjizaraService } from './knjizara.service';

describe('KnjizaraService', () => {
  let service: KnjizaraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KnjizaraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
