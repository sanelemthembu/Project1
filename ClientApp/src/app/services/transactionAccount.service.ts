import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TransactionAccount, User } from 'src/app/models';

@Injectable({ providedIn: 'root' })
export class TransactionAccountService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  baseUrl: string;

  constructor(
    @Inject('BASE_URL') baseUrl: string,
    private router: Router,
    private http: HttpClient
  ) {
    this.baseUrl = baseUrl + "api";
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  getById(id: string) {
    return this.http.get<TransactionAccount>(`${this.baseUrl}/Account/${id}`);
  }
}
