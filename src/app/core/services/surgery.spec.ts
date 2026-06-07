import { TestBed } from '@angular/core/testing';

import { Surgery } from './surgery';

describe('Surgery', () => {
  let service: Surgery;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Surgery);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
