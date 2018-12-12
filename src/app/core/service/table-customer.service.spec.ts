import { TestBed, inject } from '@angular/core/testing';

import { TableCustomerService } from './table-customer.service';

describe('TableCustomerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableCustomerService]
    });
  });

  it('should be created', inject([TableCustomerService], (service: TableCustomerService) => {
    expect(service).toBeTruthy();
  }));
});
