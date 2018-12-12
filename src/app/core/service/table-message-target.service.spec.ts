import { TestBed, inject } from '@angular/core/testing';

import { TableMessageTargetService } from './table-message-target.service';

describe('TableMessageTargetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableMessageTargetService]
    });
  });

  it('should be created', inject([TableMessageTargetService], (service: TableMessageTargetService) => {
    expect(service).toBeTruthy();
  }));
});
