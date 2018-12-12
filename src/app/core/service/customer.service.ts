import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor() { }

  public objData = {
    CustommerFullName: null,
    FamilyNo: null,
    IqCustomerNo: null,
    UserNo: null
  };
}
