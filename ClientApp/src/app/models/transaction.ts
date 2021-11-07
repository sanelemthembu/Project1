import { DatePipe } from "@angular/common";

export class Transaction {
  code: number;
  accountCode: number;
  transactionDate: DatePipe | string;
  captureDate: DatePipe;
  amount: number;
  description: string;
  TransactionType: string;

}
