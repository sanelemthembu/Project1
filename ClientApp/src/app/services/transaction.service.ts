import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Transaction, TransactionAccount, User } from 'src/app/models';

@Injectable({ providedIn: 'root' })
export class TransactionService {


  getPagedTransactions(page: number, pageSize: number) {
    return this.http.get<Transaction[]>(`${this.baseUrl}/Transaction/${page}/${pageSize}`);
  }
  getAllTransactionCount() {
    return this.http.get(`${this.baseUrl}/Transaction/Count`);
  }

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

  getAll() {
    return this.http.get<Transaction[]>(`${this.baseUrl}/Transaction`);
  }

  getById(id: string) {
    return this.http.get<Transaction>(`${this.baseUrl}/Transaction/${id}`);
  }


  addTransaction(transaction: any) {
    return this.http.post(`${this.baseUrl}/Transaction`, transaction);
  }

  update(id, params) {
    return this.http.put(`${this.baseUrl}/Transaction/${id}`, params)
      .pipe(map(x => {
        // update stored user if the logged in user updated their own record
        if (id == this.userValue.code) {
          // update local storage
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.userSubject.next(user);
        }
        return x;
      }));
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/Transaction/${id}`)
      .pipe(map(x => {
        // auto logout if the logged in user deleted their own record
        if (id == this.userValue.code) {
        }
        return x;
      }));
  }
}
