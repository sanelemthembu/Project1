import { DatePipe } from "@angular/common";

export class Transaction {
  code: number;
  accountCode: number;
  transactionDate: Date;
  captureDate: string;
  amount: number;
  description: string;
  transactionType: string;

}
