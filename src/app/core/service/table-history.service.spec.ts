import { TestBed, inject } from '@angular/core/testing';

import { TableHistoryService } from './table-history.service';

describe('TableHistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableHistoryService]
    });
  });

  it('should be created', inject([TableHistoryService], (service: TableHistoryService) => {
    expect(service).toBeTruthy();
  }));
});
