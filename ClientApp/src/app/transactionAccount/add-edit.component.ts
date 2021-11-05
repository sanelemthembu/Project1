import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatDatepickerModule } from '@angular/material/datepicker';


import { TransactionAccountService, TransactionService, AlertService } from 'src/app/services';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Transaction } from '../models';
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

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transactionAccountService: TransactionAccountService,
    private transactionService: TransactionService,
    private alertService: AlertService
  ) { }


  ngOnInit() {


    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

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
  open(content) {

    this.formTransaction = this.formBuilder.group({
      code: 0,
      accountCode: this.id,
      transactionDate: [''],
      captureDate: [''],
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

  get f() { return this.form.controls; }

}
