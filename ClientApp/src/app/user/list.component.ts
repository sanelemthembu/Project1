import { Component, OnInit } from '@angular/core';
import { User } from '../models';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from 'src/app/services';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {

  users = null;
  public mainUsersSource: User[];
  page = 1;
  pageSize = 10;
  collectionSize: number;
  form: FormGroup;
  isDeleting: boolean;



  constructor(private accountService: AccountService,
    private alertService: AlertService,
    private formBuilder: FormBuilder) {
    this.accountService.getAll().subscribe(all => {
      this.mainUsersSource = all
    })
  }

  refresh() {

    this.accountService.getPagedUsers(this.page, this.pageSize)
      .pipe(first())
      .subscribe(u => {
        this.users = u
      })
  }


  ngOnInit() {

    this.form = this.formBuilder.group({
      filter: ['']
    });
    this.form.get("filter").valueChanges.subscribe(x => {
      this.users = this.mainUsersSource.filter(f => f.surname.includes(x)
        || (f.accounts.filter(a => a.accountNumber.includes(x)).length > 0)
        || f.idNumber.includes(x));
    });
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
    if (user.accounts.length > 0)
    //&& user.accounts.filter(p => p.state !== 'Closed'))
    {
      this.alertService.error('This user can not be deleted, until all accounts are closed.');
      user.isDeleting = false;
      return;
    }


    this.accountService.delete(id)
      .pipe(first())
      .subscribe(() => {
        this.users = this.users.filter(x => x.code !== id)
      });
  }
}
