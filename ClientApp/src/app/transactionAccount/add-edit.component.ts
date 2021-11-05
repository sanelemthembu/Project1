import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { TransactionAccountService, AlertService } from 'src/app/services';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  formAccount: FormGroup;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transactionAccountService: TransactionAccountService,
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


  get f() { return this.form.controls; }

}
