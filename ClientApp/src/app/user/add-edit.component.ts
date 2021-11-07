import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, TransactionAccountService, AlertService } from 'src/app/services';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../models';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  formAccount: FormGroup;
  accounts: any[];
  persons: User[];
  closeResult = '';
  nxtAccountNumber: number;
  canAddAccount: boolean;
  canDeleteUser: boolean;
  canClose: boolean;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private tranactionAccount: TransactionAccountService,
    private alertService: AlertService
  ) {

  }


  open(content) {
    console.log(this.nxtAccountNumber)
    this.formAccount = this.formBuilder.group({
      code: 0,
      personCode: this.id,
      accountNumber: this.nxtAccountNumber,
      outstandingBalance: 0,
      transactions: []

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


  ngOnInit() {


    this.accountService.getAll().subscribe(all => {
      this.persons = all
    })
    this.GetNextAccountNumber()

    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    // password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      this.canAddAccount = false;
      passwordValidators.push(Validators.required);
    }

    this.form = this.formBuilder.group({
      code: 0,
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', passwordValidators],
      idnumber: ['']
    });

    if (!this.isAddMode) {
      this.canAddAccount = true;
      this.refreshAccount()
    }

  }

  GetNextAccountNumber(): any {
    this.accountService.GetAccountNumber()
      .subscribe(x => {
        this.nxtAccountNumber = x
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private createUser() {

    let incomingIdNumber = this.form.get('idnumber').value;
    let validUser = this.persons.filter(f => f.idNumber === incomingIdNumber);
    if (validUser.length > 0) {
      this.alertService.error('User with same Id Number already Exists.');
      this.loading = false;
      return;
    }

    this.accountService.register(this.form.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('User added successfully', { keepAfterRouteChange: true });
          this.router.navigate(['.', { relativeTo: this.route }]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  private addAccount() {

    this.accountService.addAccount(this.formAccount.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Account added successfully', { keepAfterRouteChange: true });
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  onSubmitAccount() {
    this.GetNextAccountNumber()
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.addAccount();
    this.modalService.dismissAll();
    this.refreshAccount()
    this.router.navigate(['./users/edit/' + this.id]);
    this.loading = false;

  }

  refreshAccount() {

    this.accountService.getById(this.id)
      .pipe(first())
      .subscribe(x => {
        this.f.code.setValue(x.code);
        this.f.name.setValue(x.name);
        this.f.surname.setValue(x.surname);
        this.f.idnumber.setValue(x.idNumber);
        this.f.username.setValue(x.username);
        this.accounts = x.accounts;
      });
  }

  closeAccount(id: number) {

    const currentAcc = this.accounts.find(x => x.code === id);
    console.log(currentAcc)

    if (currentAcc.outstandingBalance > 0) {
      this.alertService.error('Please settle the balance before closing the Account.')
    }

    this.accountService.closeAccount(id, false)
      .subscribe(e => {
      console.log(e)
    })
  }

  private updateUser() {
    this.accountService.update(this.id, this.form.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Update successful', { keepAfterRouteChange: true });
          this.router.navigate(['..', { relativeTo: this.route }]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  deleteAccount(id: number) {
    const acc = this.accounts.find(x => x.code === id);
    acc.isDeleting = true;
    this.tranactionAccount.delete(id)
      .subscribe(e => {
        console.log(e)
        this.accounts = this.accounts.filter(x => x.code !== id)
      });
  }

}
