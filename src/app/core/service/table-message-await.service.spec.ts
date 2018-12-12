import { TestBed, inject } from '@angular/core/testing';

import { TableMessageAwaitService } from './table-message-await.service';

describe('TableMessageAwaitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableMessageAwaitService]
    });
  });

  it('should be created', inject([TableMessageAwaitService], (service: TableMessageAwaitService) => {
    expect(service).toBeTruthy();
  }));
});
