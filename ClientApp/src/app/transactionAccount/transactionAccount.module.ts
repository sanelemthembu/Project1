import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add-edit.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TransactionAccountRoutingModule } from './transactionAccount-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TransactionAccountRoutingModule,
    NgbPaginationModule
  ],
  declarations: [
    LayoutComponent,
    AddEditComponent
  ]
})
export class TransactionAccountModule { }
