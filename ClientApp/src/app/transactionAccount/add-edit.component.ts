import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { TransactionAccountService, TransactionService, AlertService } from 'src/app/services';
import { ModalDismissReasons, NgbCalendar, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Transaction, TransactionAccount } from '../models';
import { DatePipe } from '@angular/common';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {

  form: FormGroup;
  types: any[];
  selectedType: string;
  id: string;
  accountId: number;
  isAddMode: boolean;
  loading: boolean;
  accountClosed: boolean;
  stateDescription: string;
  submitted: boolean;
  closeResult = '';
  formAccount: FormGroup;
  formTransaction: FormGroup;
  transactions: Transaction[];
  account: TransactionAccount;
  transactionDate: string;
  today: any;
  debitCredit: any;
  model: NgbDateStruct;

  constructor(
    private dp: DatePipe,
    private cal: NgbCalendar,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transactionAccountService: TransactionAccountService,
    private transactionService: TransactionService,
    private alertService: AlertService
  ) {

    this.today = cal.getToday()
    console.log(this.dateToString(this.today))
    this.types = ['Credit', 'Debit']

  }


  ngOnInit() {

    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.form = this.formBuilder.group({
      code: 0,
      accountNumber: [{ value: '', disabled: true }],
      outstandingBalance: [{ value: '', disabled: true }],
      isActive: true,
    });

    if (!this.isAddMode) {

      this.transactionAccountService.getById(this.id)
        .pipe(first())
        .subscribe(x => {
          this.f.accountNumber.setValue(x.accountNumber);
          this.f.outstandingBalance.setValue('R ' + x.outstandingBalance);
          this.f.isActive.setValue(x.isActive);
          this.transactions = x.transactions

          this.accountClosed = x.isActive
        });


    }
  }
  onTypeChanged(event: any) {
    this.selectedType = this.types.find(n => n == event.target.value);
  }


  refresh() {

    this.transactionAccountService.getById(this.id)
      .pipe(first())
      .subscribe(x => {
        this.f.accountNumber.setValue(x.accountNumber);
        this.f.outstandingBalance.setValue(x.outstandingBalance);
        this.f.isActive.setValue(x.isActive);
        this.transactions = x.transactions

        this.accountClosed = x.isActive
      });
  }

  open(content) {

    this.formTransaction = this.formBuilder.group({
      code: 0,
      accountCode: this.id,
      transactionDate: [''],
      captureDate: [this.dateToString(this.today)],
      amount: [0, Validators.min(1)],
      description: [''],
      transactionType: ['']
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

    if (this.formTransaction.invalid) {
      return;
    }

    this.loading = true;
    this.addTransaction();
    this.modalService.dismissAll();
    console.log(this.id)
    this.router.navigate(['./transactionAccount/edit/' + this.id]);
    this.loading = false;
  }

  private dateToString = (date) => `${date.year}-${date.month}-${date.day}`;

  private addTransaction() {
    let stringDate = this.dateToString(this.formTransaction.get('transactionDate').value);
    this.formTransaction.get('transactionDate').setValue(stringDate)
    this.transactionService.addTransaction(this.formTransaction.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Account added successfully', { keepAfterRouteChange: true });
          this.refresh()
        },
        error => {
          this.alertService.error(error);
        });
  }

  get f() { return this.form.controls; }
  get t() { return this.formTransaction.controls; }


}
