import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { TransactionAccountService, TransactionService, AlertService } from 'src/app/services';
import { ModalDismissReasons, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Transaction, TransactionAccount } from '../models';
import { DatePipe } from '@angular/common';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {

  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading: boolean;
  submitted: boolean;
  closeResult = '';
  formAccount: FormGroup;
  formTransaction: FormGroup;
  transactions: Transaction[];
  account: TransactionAccount;
  transactionDate: NgbDateStruct;
  //captureDate: NgbDateStruct;

  page = 1;
  pageSize = 10;
  collectionSize: number;

  constructor(
    private dateTimePipe: DatePipe,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transactionAccountService: TransactionAccountService,
    private transactionService: TransactionService,
    private alertService: AlertService
  ) {
  }


  ngOnInit() {

    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.transactionService.getAllTransactionCount()
      .subscribe((res: any) => {
        this.collectionSize = res
      })

    this.transactionAccountService.getById(this.id)
      .subscribe(a => {
        this.account = a
      })
    this.refresh()


    this.form = this.formBuilder.group({
      accountNumber: [''],
      outstandingBalance: ['']
    });

    if (!this.isAddMode) {

      this.transactionAccountService.getById(this.id)
        .pipe(first())
        .subscribe(x => {
          this.f.accountNumber.setValue(x.accountNumber);
          this.f.outstandingBalance.setValue(x.outstandingBalance);
        });
    }
  }

  refresh() {

    this.transactionService.getPagedTransactions(this.page, this.pageSize)
      .pipe(first())
      .subscribe(u => {
        this.transactions = u.filter(f => f.accountCode === this.account.code)
      })
  }

  open(content) {

    this.formTransaction = this.formBuilder.group({
      code: 0,
      accountCode: this.id,
      transactionDate: new Date(),
      captureDate: new Date(),
      amount: 0,
      description: ['']

    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmitTransaction() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.addTransaction();
    this.modalService.dismissAll();
    this.router.navigate(['./transactionAccount/edit/' + this.id, { relativeTo: this.route }]);
    this.loading = false;
  }

  private addTransaction() {
    this.transactionService.addTransaction(this.formTransaction.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Account added successfully', { keepAfterRouteChange: true });
          this.router.navigate(['.', { relativeTo: this.route }]);
        },
        error => {
          this.alertService.error(error);
        });
  }

  private deleteTransaction(id: number) {
    const t = this.transactions.find(x => x.code === id);
    this.transactionService.delete(id)
      .pipe(first())
      .subscribe(() => {
        this.transactions = this.transactions.filter(x => x.code !== id)
      });
  }


  get f() { return this.form.controls; }
  get t() { return this.formTransaction.controls; }


}
