import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TransactionAccount, User } from 'src/app/models';

@Injectable({ providedIn: 'root' })
export class AccountService {

  closeAccount(id: number, params: any) {
    return this.http.put(`${this.baseUrl}/Account/${id}`, params);
  }

  GetAccountNumber() {
    return this.http.get<number>(`${this.baseUrl}/Person/accountnumber`);
  }
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  baseUrl: string;

  constructor(
    @Inject('BASE_URL') baseUrl: string,
    private router: Router,
    private http: HttpClient
  ) {
    this.baseUrl = baseUrl +"api";
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(username, password) {
    return this.http.post<User>(`${this.baseUrl}/Person/authenticate`, { username, password })
      .pipe(map(user => {
        console.log(user);
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout() {    
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  register(user: User) {
    return this.http.post(`${this.baseUrl}/Person`, user);
  }

  getPagedUsers(pageNo, usersPerPaage) {
    return this.http.get<User[]>(`${this.baseUrl}/Person/${pageNo}/${usersPerPaage}`);
  }

  getAllUsersCount() {
    return this.http.get(`${this.baseUrl}/Person/PersonCount`);
  }
  getAll() {
    return this.http.get<User[]>(`${this.baseUrl}/Person`);
  }

  getById(id: string) {
    return this.http.get<User>(`${this.baseUrl}/Person/${id}`);
  }

  addAccount(acc: TransactionAccount) {
    return this.http.post(`${this.baseUrl}/Person/account`, acc);
  }


  update(id, params) {
    return this.http.put(`${this.baseUrl}/Person/${id}`, params)
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
    return this.http.delete(`${this.baseUrl}/Person/${id}`)
      .pipe(map(x => {
        // auto logout if the logged in user deleted their own record
        if (id == this.userValue.code) {
          this.logout();
        }
        return x;
      }));
  }
}
