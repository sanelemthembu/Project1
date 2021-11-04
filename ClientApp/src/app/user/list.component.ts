import { Component, OnInit } from '@angular/core';
import { User } from '../models';
import { first } from 'rxjs/operators';

import { AccountService } from 'src/app/services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {

  users = null;
  public mainUsersSource: User[];
  page = 1;
  pageSize = 10;
  collectionSize: number;

  constructor(private accountService: AccountService) { }

  refresh() {

    this.accountService.getPagedUsers(this.page, this.pageSize)
      .pipe(first())
      .subscribe(u => {
        this.users = u
      })
  }


  ngOnInit() {

    this.accountService.getPagedUsers(this.page, this.pageSize)
      .pipe(first())
      .subscribe(u => {
        this.users = u;
      });
    this.accountService.getAllUsersCount()
      .subscribe((res: any) => {
        this.collectionSize = res
      })
  }

  deleteUser(id: number) {
    const user = this.users.find(x => x.code === id);
    console.log(user)
    user.isDeleting = true;
    this.accountService.delete(id)
      .pipe(first())
      .subscribe(() => {
        this.users = this.users.filter(x => x.code !== id)
      });
  }
}
