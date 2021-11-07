////import { Component, OnInit } from '@angular/core';
////import { Transaction } from '../models';
////import { first } from 'rxjs/operators';

////import { TransactionService } from 'src/app/services';
////import { FormBuilder, FormGroup } from '@angular/forms';

////@Component({ templateUrl: 'list.component.html' })
////export class ListComponent implements OnInit {

////  public transactions: Transaction[];
////  page = 1;
////  pageSize = 10;
////  collectionSize: number;
////  form: FormGroup;


////  constructor(private transactionService: TransactionService, private formBuilder: FormBuilder) {

////    console.log('Here')
////    this.transactionService.getAll().subscribe(all => {
////      this.transactions = all
////      console.log(all)
////    })

////  }

////  refresh() {

////    this.transactionService.getPagedTransactions(this.page, this.pageSize)
////      .pipe(first())
////      .subscribe(u => {
////        this.transactions = u
////      })
////  }


////  ngOnInit() {
////    this.transactionService.getAllTransactionCount()
////      .subscribe((res: any) => {
////        this.collectionSize = res
////      })
////    this.refresh()

////  }

////  deleteUser(id: number) {
////    const t = this.transactions.find(x => x.code === id);
////    this.transactionService.delete(id)
////      .pipe(first())
////      .subscribe(() => {
////        this.transactions = this.transactions.filter(x => x.code !== id)
////      });
////  }
////}
